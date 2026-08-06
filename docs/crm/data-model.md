# CRM Data Model — Complete Firestore Schema

Companion to `docs/superpowers/specs/2026-08-07-real-estate-crm-design.md`. Every collection the CRM
introduces or extends, across all 11 phases. Fields marked **(new)** don't exist in the current codebase.
Existing types (`Contact`, `Lead`, `Enquiry`, `CrmTemplate`, `WaMessage`, `WaCampaign` in `src/types/index.ts`)
are extended, not replaced, unless noted.

Conventions used throughout:
- All timestamps stored as Firestore `Timestamp`, surfaced to the app as ISO strings (matches existing
  `fromDoc()` pattern in `src/lib/firestore/*.ts`).
- Every collection has `createdAt`, `updatedAt`, `createdBy` (uid) unless stated otherwise.
- `ownerId` = assigned agent's uid, used by security rules for row-level-style visibility.
- Denormalized display fields (e.g. `contactName` alongside `contactId`) are intentional — Firestore has no
  joins; see master spec §7.

---

## P0 — Foundation

### `users/{uid}`
```
role: 'admin' | 'agent'
name: string
email: string
phone?: string
active: boolean
avatarUrl?: string
createdAt, updatedAt
```
Mirrors Firebase Auth uid. Created on first admin-invited login (no self-signup).

### `units/{id}` (new — see master spec §4.3)
```
projectId: string            // → projects/{id}
projectName, locationSlug    // denormalized
unitNumber: string            // "A-204"
block?: string
phase?: string
type: PropertyType            // 'plot' | 'villa' | 'flat'
areaSqft: number
baseRate: number               // ₹ per unit area
plcCharges?: number             // preferential location charge
otherCharges?: { label: string; amount: number }[]
totalPrice: number              // computed at creation, re-editable by admin
status: 'available' | 'held' | 'blocked' | 'booked' | 'agreement' | 'registered' | 'sold'
heldUntil?: Timestamp           // hold auto-expires
currentDealId?: string          // → deals/{id}
propertyId?: string             // → properties/{id}, if this unit has a public listing
floor?: string
facing?: string
createdAt, updatedAt
```
Composite indexes: `(projectId, status)`, `(status, heldUntil)` for the hold-expiry sweep job.

### `automation_rules/{id}` (new)
```
name: string
trigger: 'lead.created' | 'deal.stage_changed' | 'demand.overdue' | 'no_activity_for_N_days' | 'unit.status_changed'
conditions: { field: string; op: string; value: unknown }[]
actions: { type: 'assign' | 'create_task' | 'send_template' | 'change_stage' | 'notify_admin'; params: Record<string, unknown> }[]
active: boolean
createdAt, updatedAt
```

### Security model
`firestore.rules` gains a role lookup helper reading `users/{request.auth.uid}.role`, used by every
subsequent rule below. See `docs/crm/phases/phase-0-foundation.md` for the full rules file.

---

## P1 — Lead Management

### `contacts/{id}` — extends existing `Contact`
Adds:
```
roles: ('buyer' | 'seller' | 'tenant' | 'landlord' | 'investor')[]   // (new) replaces implicit single-role assumption
ownerId?: string              // (new) assigned agent uid
score?: number                 // (new) 0-100 lead score
scoreBreakdown?: { factor: string; points: number }[]   // (new)
phoneNormalized: string        // (new) E.164, used for the dedupe index
duplicateOfId?: string         // (new) set when merged
```
Composite indexes: `(phoneNormalized)` unique-ish lookup, `(ownerId, stage)`, `(stage, followUpAt)`.

### `requirements/{id}` (new — see master spec §4.2)
```
contactId, contactName          // denormalized
type: PropertyType
locationSlug?: string
budgetMin?: number
budgetMax?: number
bedrooms?: number
purpose: 'buy' | 'rent' | 'invest'
urgency: 'immediate' | '1-3-months' | '3-6-months' | 'just-browsing'
financing?: 'cash' | 'loan' | 'undecided'
status: 'open' | 'matched' | 'closed' | 'stale'
createdAt, updatedAt
```
Index: `(status, type, locationSlug)` for the matching job.

### `tasks/{id}` (new)
```
title: string
relatedType: 'contact' | 'deal' | 'lead' | 'booking'
relatedId: string
ownerId: string
dueAt: Timestamp
status: 'open' | 'done' | 'overdue' | 'cancelled'
priority: 'low' | 'medium' | 'high'
createdAt, updatedAt, completedAt?
```
Index: `(ownerId, status, dueAt)` — powers the agent's daily worklist.

### `activities/{id}` (new — the timeline atom, see master spec §4.1)
```
relatedType: 'contact' | 'deal' | 'unit' | 'booking'
relatedId: string
type: 'call' | 'whatsapp' | 'note' | 'site_visit' | 'stage_change' | 'email' | 'task'
body?: string
metadata?: Record<string, unknown>   // e.g. { fromStage, toStage } for stage_change
ownerId: string
createdAt
```
Index: `(relatedType, relatedId, createdAt desc)` — one query renders any record's full timeline.

### `leads/{id}` / `enquiries/{id}` — extend existing
Adds `ownerId?`, `score?`, `scoreBreakdown?`, `phoneNormalized`, `duplicateOfId?` (same shape as Contact
additions above) so scoring/assignment work before a lead is converted to a Contact.

---

## P2 — Integration Layer + WhatsApp

### `integration_accounts/{provider}` (new)
`provider` ∈ `whatsapp | meta_ads | portal_99acres | portal_magicbricks | portal_housing | ivr`
```
enabled: boolean
config: Record<string, unknown>     // non-secret only: phone_number_id, page_id, ad_account_id, etc.
lastSyncAt?: Timestamp
lastError?: string
createdAt, updatedAt
```
Secrets never live here — env vars only (master spec §9).

### `inbound_events/{providerEventId}` (new)
```
provider: string
rawPayload: Record<string, unknown>
status: 'received' | 'processed' | 'failed' | 'duplicate'
processedAt?: Timestamp
error?: string
createdAt
```
Document ID **is** the provider's event/message ID — the idempotency key. A retried webhook delivery is a
no-op write, not a duplicate lead.

### `outbox/{id}` (new)
```
provider: string
type: 'whatsapp_template' | 'whatsapp_text' | 'meta_post' | 'sms'
payload: Record<string, unknown>
status: 'queued' | 'sending' | 'sent' | 'failed'
attempts: number
lastAttemptAt?: Timestamp
scheduledFor?: Timestamp
error?: string
createdAt
```
Index: `(status, scheduledFor)` — the cron drain query.

### `wa_messages/{id}` / `wa_campaigns/{id}` — existing, unchanged shape (already well-designed in
`src/types/index.ts`). Campaign sends now populate `outbox` rather than writing directly to the WhatsApp API
from the client.

---

## P3 — Sales Pipeline

### `deals/{id}` (new — see master spec §4.1, §4.2)
```
pipeline: 'primary_sales' | 'brokerage_resale' | 'rental'
stage: string                        // pipeline-scoped, see master spec §4.2 for the stage lists
contactId, contactName, contactPhone  // denormalized
listingType: 'unit' | 'mandate'
listingId: string
listingLabel: string                  // denormalized, e.g. "Somnath City A-204"
value: number
ownerId: string
probability?: number                  // for weighted pipeline value
lostReason?: string
wonAt?: Timestamp
lostAt?: Timestamp
createdAt, updatedAt
```
Composite indexes: `(pipeline, stage, ownerId)`, `(ownerId, pipeline, updatedAt desc)`.

### `site_visits/{id}` (new)
```
dealId, contactId, unitOrMandateId
scheduledAt: Timestamp
status: 'scheduled' | 'completed' | 'no_show' | 'cancelled'
feedback?: string
ownerId: string
createdAt, updatedAt
```
Index: `(ownerId, scheduledAt)`, `(status, scheduledAt)` for no-show sweeps.

---

## P4 — Inventory & Booking

`units/{id}` — defined in P0 (introduced early because the schema is foundational; booking behavior
activates in this phase).

### `bookings/{id}` (new)
```
dealId, unitId, contactId          // denormalized names too
unitLabel, contactName
bookingDate: Timestamp
agreementValue: number
kycDocs: { type: string; url: string; verifiedAt?: Timestamp }[]
allotmentLetterUrl?: string
agreementUrl?: string
status: 'draft' | 'confirmed' | 'agreement_signed' | 'registered' | 'possession_given' | 'cancelled'
totalDemanded: number    // rollup, see master spec §5
totalReceived: number    // rollup
outstanding: number      // rollup
overdueAmount: number    // rollup
createdAt, updatedAt
```

---

## P5 — Payments & Collections

### `payment_plans/{id}` (new)
```
name: string                          // "Construction-linked 20:80"
projectId?: string                    // template scoped to a project, or global
milestones: {
  label: string
  triggerType: 'date' | 'construction_stage' | 'on_booking'
  percentOrAmount: { kind: 'percent' | 'amount'; value: number }
  offsetDays?: number
}[]
createdAt, updatedAt
```

### `bookings/{id}/demands/{id}` (new, subcollection)
```
milestoneLabel: string
amount: number
dueDate: Timestamp
status: 'pending' | 'sent' | 'partially_paid' | 'paid' | 'overdue'
demandLetterUrl?: string
sentAt?: Timestamp
createdAt, updatedAt
```

### `bookings/{id}/receipts/{id}` (new, subcollection, immutable — no update/delete in rules)
```
amount: number
mode: 'cash' | 'cheque' | 'bank_transfer' | 'upi' | 'card'
referenceNumber?: string
receivedAt: Timestamp
demandId?: string                     // which demand this pays against
receiptNumber: string                 // sequential, generated server-side
createdAt, createdBy
```
Every write to `demands`/`receipts` runs inside a Firestore transaction that also updates the four rollup
fields on the parent `bookings/{id}` — see master spec §5. Client SDK: read-only on both subcollections;
writes only via server action with service-account credentials.

---

## P6 — Post-Sales

### `handover_checklists/{id}` (new)
```
bookingId, unitId
items: { label: string; status: 'pending' | 'done' | 'na'; completedAt?: Timestamp }[]
possessionDate?: Timestamp
status: 'pending' | 'in_progress' | 'completed'
createdAt, updatedAt
```

### `grievances/{id}` (new)
```
contactId, bookingId?
subject: string
description: string
category: 'construction' | 'documentation' | 'payment' | 'other'
priority: 'low' | 'medium' | 'high'
status: 'open' | 'in_progress' | 'resolved' | 'closed'
assignedTo?: string
resolutionNote?: string
createdAt, updatedAt, resolvedAt?
```
Index: `(status, priority, createdAt)`.

---

## P7 — Resale & Rental

### `mandates/{id}` (new — see master spec §4.4)
```
sellerContactId, sellerContactName
type: PropertyType
purpose: 'sale' | 'rent'
address, locationSlug
askingPrice: number
areaSqft: number
exclusivity: boolean
expiresAt: Timestamp
status: 'active' | 'matched' | 'closed' | 'expired' | 'withdrawn'
commissionTerms: { kind: 'percent' | 'flat'; value: number }
images: string[]
description: string
createdAt, updatedAt
```
Index: `(status, purpose, type, locationSlug)` — feeds the matching job alongside `units`.

### `tenancies/{id}` (new)
```
mandateId, tenantContactId, landlordContactId
startDate, endDate: Timestamp
rentAmount: number
depositAmount: number
status: 'active' | 'renewal_due' | 'ended'
agreementUrl?: string
createdAt, updatedAt
```
Index: `(status, endDate)` — renewal-due sweep.

### `match_suggestions/{id}` (new)
```
requirementId, listingType: 'unit' | 'mandate', listingId
score: number
status: 'suggested' | 'accepted' | 'dismissed'
createdAt
```

---

## P8 — Channel Partners & Commissions

### `channel_partners/{id}` (new)
```
name, phone, email, firmName?
kycDocs: { type: string; url: string }[]
status: 'pending' | 'active' | 'suspended'
commissionDefault: { kind: 'percent' | 'flat'; value: number }
createdAt, updatedAt
```

### `commissions/{id}` (new)
```
dealId, channelPartnerId?, agentId?
type: 'channel_partner' | 'internal_agent'
basis: { kind: 'percent' | 'flat' | 'tiered'; value: number }
dealValue: number
amount: number
status: 'pending' | 'approved' | 'paid'
approvedBy?, paidAt?
createdAt, updatedAt
```
Index: `(channelPartnerId, status)`, `(agentId, status)`. Written only by server action, same
admin-write-only pattern as §5 money model.

---

## P9 — Meta Ads, Portals, IVR

No new collections beyond `integration_accounts` (P2) and provider-specific rows in `inbound_events`/
`outbox`. Adds:

### `ad_campaigns/{id}` (new, synced from Meta, read-only cache)
```
metaCampaignId: string
name, status, dailyBudget, spend, impressions, clicks, cpm, ctr
lastSyncedAt: Timestamp
```

### `calls/{id}` (new, from IVR provider webhook)
```
contactId?, phoneNormalized
direction: 'inbound' | 'outbound' | 'missed'
durationSeconds: number
recordingUrl?: string
agentId?: string
occurredAt: Timestamp
createdAt
```
Also writes a matching `activities` record (type `call`).

---

## P10 — Reports & Analytics

### `rollups/daily/{YYYY-MM-DD}`, `rollups/monthly/{YYYY-MM}`, `rollups/agent/{uid}_{YYYY-MM}`,
### `rollups/source/{YYYY-MM}` (new — see master spec §6)
```
// shape varies by rollup type, e.g. monthly:
newLeads, newContacts, siteVisits, dealsWon, dealsLost
revenue, collections
bySource: Record<string, number>
byAgent: Record<string, { leads: number; conversions: number; revenue: number }>
computedAt: Timestamp
```
Written exclusively by server actions (on-write for the current period, nightly cron recompute for drift
repair on the trailing 3 days). Never written by the client SDK.

---

## Cross-cutting: composite index summary

Firestore requires every compound query's index declared ahead of time in `firestore.indexes.json`. Full
list assembled progressively per phase; each phase plan lists the indexes it introduces. Do not add a filter
combination to a query without adding its index in the same PR — production Firestore will reject the query
at runtime with a console link, not fail at build time.

## Cross-cutting: security rules shape

```
match /contacts/{id} {
  allow read: if isAdmin() || resource.data.ownerId == request.auth.uid || resource.data.ownerId == null;
  allow write: if isAdmin() || resource.data.ownerId == request.auth.uid;
}
match /{financialCollection}/{id} {
  allow read: if isSignedIn();
  allow write: if false;   // server-action only, via service account (bypasses rules)
}
```
Full rules file assembled in `docs/crm/phases/phase-0-foundation.md` and extended per phase.
