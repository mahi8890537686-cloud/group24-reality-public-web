// Public, unauthenticated endpoint backing the property-detail lead form and the
// contact page enquiry form. Replaces direct client-side Firestore writes so that
// dedupe, scoring, round-robin assignment, and task creation can run server-side
// (see src/lib/server/leadIntake.ts) rather than trusting the browser with them.
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { intakeSubmission } from '@/lib/server/leadIntake';

const phoneSchema = z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number');

const leadSchema = z.object({
  kind: z.literal('lead'),
  name: z.string().min(2),
  phone: phoneSchema,
  message: z.string().optional(),
  propertyTitle: z.string().min(1),
  propertySlug: z.string().min(1),
});

const enquirySchema = z.object({
  kind: z.literal('enquiry'),
  name: z.string().min(2),
  phone: phoneSchema,
  email: z.string().email().optional().or(z.literal('')),
  location: z.string().optional(),
  propertyType: z.string().optional(),
  message: z.string().min(10),
});

const bodySchema = z.discriminatedUnion('kind', [leadSchema, enquirySchema]);

export async function POST(req: NextRequest) {
  let parsed;
  try {
    const json = await req.json();
    parsed = bodySchema.parse(json);
  } catch {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
  }

  try {
    const result = await intakeSubmission({
      ...parsed,
      email: 'email' in parsed && parsed.email ? parsed.email : undefined,
    });
    return NextResponse.json({ ok: true, id: result.id });
  } catch (err) {
    console.error('Lead intake failed:', err);
    const message = err instanceof Error ? err.message : 'Submission failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
