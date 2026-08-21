# Phase 5 — Payments & Collections

**Release B (final phase). Depends on:** P4 (Booking must exist). **Unblocks:** P6 (possession follows full
payment), P8 (commission engine reuses this phase's transactional-ledger pattern).

## Functional spec

The money module — the one place in this design where correctness matters more than speed of iteration.
Implements master spec §5 in full.

1. **Payment plan templates.** Admin defines milestone-based plans (e.g. "20:80 construction-linked") once
   per project or globally, reused across bookings.
2. **Demand generation.** Apply a plan to a Booking → generates `demand` documents per milestone with due
   dates. Manual trigger by default; date-triggered milestones can auto-generate via a scheduled job.
3. **Demand letters.** Generated document per demand (PDF/HTML, same approach as P4's allotment letter),
   sent via WhatsApp (P2's outbox) or downloadable.
4. **Receipt entry.** Admin/accounts records money received against a demand — immutable once created.
5. **Collections aging.** Outstanding + overdue rollups per booking, and a portfolio-wide aging report
   (0–30/31–60/61–90/90+ days overdue).
6. **The ledger guarantee.** `totalDemanded`/`totalReceived`/`outstanding`/`overdueAmount` on `Booking` are
   never wrong relative to their `demands`/`receipts` subcollections, because they are written in the same
   transaction as the record that changes them — never recomputed by summing at read time (master spec §5,
   §7).

## Data model touched

New: `payment_plans`, `bookings/{id}/demands`, `bookings/{id}/receipts`. Extended: `bookings` (rollup
fields). See `docs/crm/data-model.md` §P5.

## Build steps

1. **`payment_plans` type + accessor + admin UI.** `src/types/index.ts`, `src/lib/firestore/payment-
   plans.ts`, simple CRUD form for milestone list (label, trigger type, percent/amount, offset days).
2. **Server-action module for all money writes.** `src/lib/server/payments.ts` (imported only by Route
   Handlers/Server Actions, never by client components) — this is the **only** code path allowed to write
   `demands`, `receipts`, or `bookings`' rollup fields. Every function here runs inside
   `runTransaction()`.
3. **`applyPaymentPlan(bookingId, planId)`.** Transaction: read the plan, compute each milestone's amount
   from the Booking's `agreementValue`, write one `demand` doc per milestone, no rollup change yet (demands
   aren't money received).
4. **`recordReceipt(bookingId, demandId, amount, mode, reference)`.** Transaction: write the immutable
   `receipt` doc (sequential `receiptNumber` generated from a counter doc, avoiding read-then-write races by
   incrementing inside the same transaction), update the target `demand.status`
   (`pending → partially_paid → paid` based on cumulative receipts against it), and update the four
   `Booking` rollup fields in the same transaction. This function is the entire reason §5/§7 of the master
   spec exist — get this one function right and the rest of the module is straightforward CRUD around it.
5. **Overdue sweep.** Daily cron (`/api/cron/mark-overdue-demands`) — queries `demands` where
   `status in ['pending','partially_paid']` and `dueDate < now`, flips to `overdue`, and recomputes
   `Booking.overdueAmount` in the same transaction pattern as step 4 (never a separate untransacted write).
6. **Demand letter generation + send.** Reuses P4's document-generation approach; "Send via WhatsApp" button
   writes to `outbox` (P2) with the demand letter as a document-type WhatsApp message (or a summary text
   with a Storage-hosted PDF link, depending on what the WhatsApp Cloud API's document message type
   supports for the account's tier).
7. **Money tab in Booking record panel.** `src/components/crm/PaymentPlanProgress.tsx` (ui-system.md's
   component inventory) — plan progress bar, demands table, receipts table, the four rollup values
   displayed directly from `Booking` fields (never recomputed in the component — read straight off the doc,
   confirming the "never computed client-side" rule is actually followed in the UI layer too).
8. **Collections aging report.** `src/app/admin/crm/collections/page.tsx` — table of all bookings with
   `outstanding > 0`, bucketed by days overdue, using `<ListView>` (P0) with an aging-bucket facet filter.
   Sourced from `bookings`' rollup fields directly (fast — no subcollection scanning), not from `rollups/*`
   (P10 hasn't shipped yet; this report reads live `bookings` documents, which is fine at this data volume
   and becomes a `rollups/*`-backed summary card once P10 ships, without changing this page's core table).
9. **`firestore.indexes.json`.** `(bookings: status, outstanding)` (for the aging report; note: Firestore
   composite indexes on computed/rollup fields are fine since they're regular document fields, just
   maintained by transactions rather than client writes), `(demands collectionGroup: status, dueDate)` for
   the cron sweep across all bookings' subcollections.
10. **`firestore.rules`.** `payment_plans`: admin-write, signed-in read. `demands`/`receipts` (as
    subcollections under `bookings`): **read: signed-in; write: false** unconditionally — the rule
    explicitly denies all client writes, full stop, since `src/lib/server/payments.ts` uses the admin SDK
    which bypasses rules entirely. This is the one collection pair in the whole system where the rule is
    simply `allow write: if false`.

## Manual verification

- Apply a 3-milestone payment plan to a test booking; confirm 3 `demand` docs are created with correct
  amounts summing to `agreementValue`.
- Record a partial receipt against the first demand; confirm `demand.status → partially_paid`,
  `Booking.totalReceived` increases by exactly the receipt amount, and `outstanding` decreases by the same.
- Record a second receipt completing that demand; confirm `demand.status → paid`.
- Backdate a demand's due date and run the overdue sweep; confirm `demand.status → overdue` and
  `Booking.overdueAmount` reflects it.
- Attempt a direct Firestore console write to a `receipt` subdocument as a non-admin-SDK client (or confirm
  via rules simulator); confirm it's rejected.
- Open the Collections aging report; confirm a deliberately-overdue test booking appears in the correct
  bucket.

## Automated checks

- `npm run build`, `npm run lint`.
- Unit/integration tests for `src/lib/server/payments.ts`'s transaction functions — this is the highest-
  value test target in the entire project. Cover: exact-payment, overpayment, underpayment/partial,
  concurrent-receipt race (two receipts recorded near-simultaneously — confirm the transaction serializes
  correctly and the rollup never double-counts or drops one).
