# Phase 6 — Post-Sales

**Release C (first phase). Depends on:** P5 (a booking is typically fully/mostly paid before possession).
**Unblocks:** nothing downstream directly, but completes the owned-inventory lifecycle end-to-end
(enquiry → possession) before Release C opens the second pipeline (P7).

## Functional spec

1. **Handover checklist.** Configurable checklist template (per project or global) applied to a Booking when
   it nears possession — inspection items, documentation items, key handover — tracked to completion.
2. **Possession tracking.** `Booking.status → possession_given` on checklist completion, with the possession
   date recorded.
3. **Grievance desk.** Post-possession issue log — construction defects, documentation disputes, payment
   queries — categorized, prioritized, assignable, with resolution tracking. This is also the natural home
   for pre-possession complaints, not possession-only.

## Data model touched

New: `handover_checklists`, `grievances`. See `docs/crm/data-model.md` §P6.

## Build steps

1. **`handover_checklists` type + accessor.** `src/types/index.ts`,
   `src/lib/firestore/handover-checklists.ts`. Admin-configurable checklist templates (simple label list,
   reused across bookings the way `payment_plans` are reused — same "template → applied instance" pattern
   established in P5, not reinvented).
2. **Apply checklist to Booking.** Action in the Booking record panel ("Start handover") — creates a
   `handover_checklists` doc from the template, linked to the booking.
3. **Checklist UI.** New tab on the Booking record panel — checkbox list, each item togglable
   (`pending/done/na`), completion timestamp captured per item. When all items are `done` or `na`, prompt to
   confirm possession date → sets `Booking.status = 'possession_given'` and the checklist's own `status =
   'completed'`.
4. **`grievances` type + accessor.** `src/types/index.ts`, `src/lib/firestore/grievances.ts`.
5. **Grievance module UI.** `src/app/admin/crm/grievances/page.tsx` using `<ListView>` (P0) — facets:
   status, priority, category. New grievance form linkable from a Contact or Booking record panel ("Raise
   grievance") or standalone (walk-in complaint not yet tied to a specific booking).
6. **Grievance record panel.** Overview (category, description, linked booking/contact), Activity tab
   (resolution notes logged as activities, reusing `<ActivityTimeline>`), assignment control.
7. **Grievance SLA nudge.** Reuse the P0 `automation_rules` schema: a rule flags grievances open >48h at
   `high` priority with no activity — creates a `Task` for the admin to check in. Not a hard SLA enforcement
   system, just a visibility nudge, matching the scale of a 4-person team.
8. **`firestore.indexes.json`.** `(grievances: status, priority, createdAt)`, `(handover_checklists:
   bookingId)`.
9. **`firestore.rules`.** Both collections follow the owner-or-admin pattern; grievance resolution notes are
   agent-writable (not restricted like the financial collections) since this is operational, not monetary,
   data.

## Manual verification

- Apply a handover checklist template to a test booking; confirm all items start `pending`.
- Mark all items done; confirm the possession-date prompt appears and, on confirm, `Booking.status`
  updates to `possession_given`.
- Raise a grievance linked to a booking; confirm it appears in the grievance list and its record panel shows
  the linked booking.
- Leave a `high` priority grievance untouched for the test SLA window; confirm the nudge task is created.

## Automated checks

- `npm run build`, `npm run lint`.
