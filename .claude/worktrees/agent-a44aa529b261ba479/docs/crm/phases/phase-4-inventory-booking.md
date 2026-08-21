# Phase 4 — Inventory & Booking

**Release B. Depends on:** P3 (a Deal reaching "Booked" stage is the trigger for creating a Booking).
**Unblocks:** P5 (Payments attach to a Booking), P6 (Post-sales/handover attaches to a Booking).

## Functional spec

1. **Unit inventory grid.** Visual availability map per project — Available/Held/Blocked/Booked/Agreement/
   Registered/Sold, color-coded, filterable by block/phase/type. The `units` schema already exists from P0;
   this phase builds the admin UI to create/manage units and the grid to view them.
2. **Hold workflow.** Agent taps "Hold" on a unit during/after a site visit → `status: 'held'`,
   `heldUntil` set (configurable duration, default 24h) → auto-releases back to `available` if not
   converted, via a scheduled sweep.
3. **Migration of interim Deal listing references.** P3 shipped Primary Sales deals pointing at
   `properties/{id}` as a stand-in. This phase back-fills `units` for existing `Property` records that
   represent owned inventory and re-points those Deals' `listingId` at the new `Unit` doc.
4. **Booking creation.** From a Deal at "Booked" stage: select the held/available Unit → KYC document
   upload → generate allotment letter → create `Booking`.
5. **Booking record.** Status progression `draft → confirmed → agreement_signed → registered →
   possession_given` (possession_given actually flips in P6, but the field exists here).

## Data model touched

`units` (P0 schema, now actively used). New: `bookings`. See `docs/crm/data-model.md` §P4.

## Build steps

1. **Unit management UI.** `src/app/admin/crm/inventory/[projectId]/page.tsx` — add/edit unit form
   (React Hook Form + Zod, matching `PropertyForm.tsx` conventions), bulk-add (e.g. "Tower A, Floors 1–10,
   4 units each" generator to avoid 40 manual entries).
2. **`<InventoryGrid>` component.** `src/components/crm/InventoryGrid.tsx` — grid/block layout by
   floor/phase, color-coded by status, click opens Unit quick-view with "Hold" / "View Deal" actions.
3. **Hold action + expiry sweep.** Server action sets `status: 'held'` + `heldUntil`; a cron job
   (`/api/cron/release-expired-holds`, every 15 min) queries `(status == 'held', heldUntil <= now)` and
   reverts to `available`, logging an Activity on the unit's linked Deal if any.
4. **Migration script.** `scripts/migrate-primary-deals-to-units.ts` (one-time, service-account) — for each
   `Property` referenced by a `primary_sales` Deal's `listingId`, create (or match existing) a `Unit`
   document, then update the Deal's `listingId`/`listingType` to point at it. Run once against production
   after this phase's `units` UI is live and units have been entered for in-flight deals.
5. **`bookings` type + accessor.** `src/types/index.ts`, `src/lib/firestore/bookings.ts`.
6. **Booking creation flow.** Multi-step form (`<Stepper>`, per ui-system.md §8) from the Deal record
   panel's "Book this unit" action: Step 1 confirm unit + price, Step 2 KYC document upload (Firebase
   Storage, matching existing image-upload pattern from `PropertyForm.tsx`), Step 3 review → creates
   `Booking` + flips `Unit.status = 'booked'` + `Unit.currentDealId` — **all three writes in one Firestore
   transaction** so a partial failure never leaves a unit `booked` with no `Booking` doc or vice versa.
7. **Allotment letter generation.** Simple server-rendered PDF (a lightweight library — evaluate one
   compatible with the Next.js 16/React 19 server runtime; fall back to an HTML-to-print view if PDF
   generation adds unwanted dependency weight) populated from Booking + Unit + Contact fields, stored to
   Firebase Storage, URL saved on `Booking.allotmentLetterUrl`.
8. **Booking record panel.** Extends `<RecordPanel>` — Overview (unit, contact, agreement value, status
   progression control), Documents tab (KYC docs, allotment letter, agreement — uploaded/listed here; Money
   tab is a placeholder until P5).
9. **`firestore.indexes.json`.** `(units: projectId, status)` and `(units: status, heldUntil)` already
   declared in P0 — confirm still accurate against final query shapes. Add `(bookings: unitId)`,
   `(bookings: contactId)`, `(bookings: status, createdAt desc)`.
10. **`firestore.rules`.** `units` status/currentDealId writes only via server action (client rule stays
    read-only for status-changing fields — enforce by keeping all unit-status mutation server-side, not by
    a field-level rule Firestore can't easily express); `bookings` follow owner-or-admin read, but create
    only via the booking-creation server action (not raw client `addDoc`) to guarantee the transactional
    unit-status flip always happens together.

## Manual verification

- Add a project's units via the bulk generator; confirm the grid renders them color-coded by status.
- Hold a unit; confirm `heldUntil` is set and the unit shows "Held" in the grid. Manually backdate
  `heldUntil` and run the sweep; confirm it reverts to "Available."
- Run the migration script against a test/staging project with an existing Primary Sales Deal; confirm the
  Deal's `listingId` now points at a `Unit` doc and nothing else about the Deal changed.
- Book a unit end-to-end: KYC upload → review → confirm; verify the Unit flips to `booked`, the Booking
  doc exists, and the allotment letter PDF/document is generated and downloadable.
- Attempt to book an already-`booked` unit (simulate a race by opening two tabs); confirm the transaction
  prevents double-booking (second attempt fails cleanly, not silently overwrites).

## Automated checks

- `npm run build`, `npm run lint`.
- Test for the booking-creation transaction's failure path (mock a mid-transaction error, assert no partial
  state — Unit stays unbooked if Booking creation fails).
