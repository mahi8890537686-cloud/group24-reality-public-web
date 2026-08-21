// Server-only intake pipeline for public lead/enquiry submissions. Runs entirely via
// firebase-admin inside one Firestore transaction: dedupe by phone → upsert Contact →
// create Lead/Enquiry → round-robin assign → auto-create a follow-up task → log
// activity. This is what /api/public/submit-lead calls; it must never be imported
// from a 'use client' component.
//
// This is the public app's own copy (the admin/public split keeps the two apps'
// code fully independent — see docs/crm/TODO.md). It deliberately does NOT trigger
// a same-request rollup recompute the way the combined app's version did: that
// pulled in the admin app's entire reporting engine (deals/bookings/receipts scans)
// for what should be a lightweight public endpoint. The admin app's nightly
// repair-rollups cron picks up today's lead count on its own schedule instead —
// "today"'s dashboard numbers lag by up to a day, which is an acceptable trade for
// keeping this endpoint's dependency graph small.
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { normalizePhone } from '@/lib/phone';
import { scoreLead } from '@/lib/scoring';

export interface IntakeInput {
  kind: 'lead' | 'enquiry';
  name: string;
  phone: string;
  message?: string;
  email?: string;
  location?: string;
  propertyType?: string;
  propertyTitle?: string;
  propertySlug?: string;
  /**
   * Overrides the default source label ('property-detail'/'contact-page') for
   * intake paths that aren't the two public forms — e.g. 'meta' for Lead Ads,
   * 'portal_99acres' for a property portal. Falls through to scoring's source
   * weight table via src/lib/scoring.ts.
   */
  sourceOverride?: string;
}

export interface IntakeResult {
  id: string;
  contactId: string;
  phoneNormalized: string;
}

export async function intakeSubmission(input: IntakeInput): Promise<IntakeResult> {
  const phoneNormalized = normalizePhone(input.phone);
  if (!phoneNormalized) {
    throw new Error('Invalid phone number');
  }

  const source = input.sourceOverride ?? (input.kind === 'lead' ? 'property-detail' : 'contact-page');
  const { score, breakdown } = scoreLead({
    source,
    message: input.message,
    email: input.email,
    propertyTitle: input.propertyTitle,
    propertyType: input.propertyType,
    location: input.location,
  });

  const contactsCol = adminDb.collection('crm_contacts');
  const targetCol = adminDb.collection(input.kind === 'lead' ? 'leads' : 'enquiries');
  const roundRobinRef = adminDb.collection('system').doc('round_robin');

  const result = await adminDb.runTransaction(async (tx) => {
    // ── Reads (must all happen before any writes in a Firestore transaction) ──
    const existingSnap = await tx.get(
      contactsCol.where('phoneNormalized', '==', phoneNormalized).limit(1)
    );
    const existingDoc = existingSnap.docs[0];
    const existingData = existingDoc?.data();

    let ownerId: string | undefined = existingData?.ownerId ?? undefined;
    let ownerName: string | undefined = existingData?.ownerName ?? undefined;
    let nextRoundRobinIndex: number | null = null;
    let newlyAssignedAgent: { uid: string; name: string } | null = null;

    if (!ownerId) {
      const agentsSnap = await tx.get(
        adminDb.collection('users').where('role', '==', 'agent').where('active', '==', true)
      );
      const agents = agentsSnap.docs
        .map((d) => ({ uid: d.id, name: (d.data().name as string) || 'Agent' }))
        .sort((a, b) => a.uid.localeCompare(b.uid));

      if (agents.length > 0) {
        const rrSnap = await tx.get(roundRobinRef);
        const lastIndex = rrSnap.exists ? ((rrSnap.data()?.lastIndex as number) ?? -1) : -1;
        nextRoundRobinIndex = (lastIndex + 1) % agents.length;
        newlyAssignedAgent = agents[nextRoundRobinIndex];
        ownerId = newlyAssignedAgent.uid;
        ownerName = newlyAssignedAgent.name;
      }
    }

    // ── Writes ──
    const targetRef = targetCol.doc();
    const contactRef = existingDoc ? existingDoc.ref : contactsCol.doc();
    const contactId = contactRef.id;

    const targetData: Record<string, unknown> = {
      name: input.name,
      phone: input.phone,
      phoneNormalized,
      message: input.message ?? '',
      status: 'new',
      createdAt: Timestamp.now(),
      score,
      scoreBreakdown: breakdown,
      ownerId: ownerId ?? null,
      ownerName: ownerName ?? null,
      contactId,
    };
    if (input.kind === 'lead') {
      targetData.propertyTitle = input.propertyTitle ?? '';
      targetData.propertySlug = input.propertySlug ?? '';
      targetData.source = source;
    } else {
      targetData.email = input.email ?? null;
      targetData.location = input.location ?? null;
      targetData.propertyType = input.propertyType ?? null;
      targetData.source = source;
    }
    tx.set(targetRef, targetData);

    if (existingDoc) {
      const linkField = input.kind === 'lead' ? 'linkedLeadIds' : 'linkedEnquiryIds';
      const existingScore = (existingData?.score as number) ?? 0;
      tx.update(contactRef, {
        [linkField]: FieldValue.arrayUnion(targetRef.id),
        score: Math.max(score, existingScore),
        ...(ownerId && !existingData?.ownerId ? { ownerId, ownerName: ownerName ?? null } : {}),
      });
    } else {
      tx.set(contactRef, {
        name: input.name,
        phone: input.phone,
        phoneNormalized,
        email: input.email ?? null,
        tags: [],
        stage: 'new',
        source: input.kind,
        notes: input.message ?? '',
        interestedIn: input.propertyTitle ?? input.propertyType ?? '',
        locationSlug: input.location?.toLowerCase() ?? null,
        ownerId: ownerId ?? null,
        ownerName: ownerName ?? null,
        score,
        scoreBreakdown: breakdown,
        linkedLeadIds: input.kind === 'lead' ? [targetRef.id] : [],
        linkedEnquiryIds: input.kind === 'enquiry' ? [targetRef.id] : [],
        isOptedOut: false,
        createdAt: Timestamp.now(),
      });
    }

    if (ownerId) {
      const taskRef = adminDb.collection('tasks').doc();
      const dueAt = new Date();
      dueAt.setHours(23, 59, 0, 0);
      tx.set(taskRef, {
        title: `First contact — ${input.name}`,
        relatedType: 'contact',
        relatedId: contactId,
        ownerId,
        dueAt: Timestamp.fromDate(dueAt),
        status: 'open',
        priority: score >= 60 ? 'high' : 'medium',
        createdAt: Timestamp.now(),
      });
    }

    const activityRef = adminDb.collection('activities').doc();
    tx.set(activityRef, {
      relatedType: 'contact',
      relatedId: contactId,
      type: 'system',
      body: `New ${input.kind === 'lead' ? 'property enquiry' : 'contact form enquiry'} received${
        input.propertyTitle ? ` for ${input.propertyTitle}` : ''
      }`,
      metadata: { score, source: input.kind },
      ownerId: null,
      ownerName: null,
      createdAt: Timestamp.now(),
    });

    if (newlyAssignedAgent && nextRoundRobinIndex !== null) {
      tx.set(roundRobinRef, { lastIndex: nextRoundRobinIndex, updatedAt: Timestamp.now() }, { merge: true });
    }

    return { id: targetRef.id, contactId };
  });

  return { ...result, phoneNormalized };
}
