# Phase 3 — Sales Pipeline

**Release B (first phase). Depends on:** P1 (Requirement), P2 (WhatsApp quick-send in the Deal panel).
**Unblocks:** P4 (a Deal reaching "Booked" is what triggers a Booking), P7 (Deal already supports
`listingType: 'mandate'` from day one here, so resale/rental doesn't need a Deal schema change later).

## Functional spec

Introduces the `Deal` entity — the actual opportunity, distinct from the Contact/Lead that spawned it — and
the full kanban experience the master spec's UI section describes.

1. **Deal creation.** From a qualified Lead/Requirement ("Convert to Deal") or manually. Picks a pipeline
   (Primary Sales / Brokerage-Resale / Rental) and a listing (Unit or Mandate — Mandate not selectable until
   P7 ships; Unit not selectable until P4 ships, so Primary Sales deals in P3 link to a `Property` as an
   interim listing reference, migrated to `Unit` when P4 lands — see build step 3).
2. **Full kanban board.** Extends P1's kanban-lite into the real thing: pipeline-switcher tabs, per-column
   value totals, days-in-stage badges, drag-and-drop stage change.
3. **Site visit scheduling.** Book a site visit against a Deal; track completed/no-show; feedback capture.
4. **Negotiation tracking.** Free-text + structured offer/counter-offer log on the Deal's Activity timeline.
5. **Deal record panel.** Full `<RecordPanel>` with stage bar, Overview/Activity/Tasks tabs (Money tab
   arrives in P5 once Booking exists).

## Data model touched

New: `deals`, `site_visits`. See `docs/crm/data-model.md` §P3.

## Build steps

1. **`deals` type + accessor.** `src/types/index.ts`, `src/lib/firestore/deals.ts`.
2. **Convert-to-Deal action.** From the P1 unified inbox / kanban-lite, a "Convert to Deal" button on a
   qualified Lead — prompts pipeline + listing selection, creates the `Deal`, logs an Activity, marks the
   source Lead `status: 'closed'` (converted).
3. **Interim listing reference for Primary Sales deals (pre-P4).** Until Inventory ships, `Deal.listingId`
   for `pipeline: 'primary_sales'` points at a `properties/{id}` document (existing catalog data) with
   `listingType: 'unit'` set anyway — P4's migration step re-points these at the matching `units/{id}`
   once that collection is populated, rather than changing the `Deal` schema. Document this explicitly in
   the P4 plan's build steps so it isn't missed.
4. **`<StageBar>` component.** `src/components/crm/StageBar.tsx` — pipeline-scoped stage list (from
   master spec §4.2), clickable segments, skip-stage confirmation dialog.
5. **`<KanbanBoard>` component.** `src/components/crm/KanbanBoard.tsx` — extends P1's kanban-lite: adds
   pipeline-switcher tabs, per-column count + value-sum header, days-in-stage badge (amber >7d / red >14d,
   thresholds as constants). Drag-and-drop via a lightweight library already compatible with React 19 (no
   new heavy dependency — evaluate `@dnd-kit/core` at build time for React 19 support; fall back to a
   click-to-move stage selector if drag-and-drop tooling isn't React-19-ready).
6. **Deal kanban page.** `src/app/admin/crm/deals/page.tsx` replaces the P1 kanban-lite route (redirect old
   route) once this ships.
7. **`site_visits` type + accessor + scheduling UI.** `src/lib/firestore/site-visits.ts`; a "Schedule site
   visit" action in the Deal record panel writing a `site_visits` doc + a matching `Task` (P0) due at the
   scheduled time, and an Activity entry.
8. **No-show sweep.** Server action (cron, daily) marking past-due `scheduled` site visits with no
   completion as `no_show`, logging an Activity — surfaces agent follow-through gaps without manual review.
9. **Deal record panel wiring.** Overview tab (contact, listing, value, probability), Activity tab (reused
   `<ActivityTimeline>`), Tasks tab (reused from P1).
10. **WhatsApp quick-send in Deal panel.** Mount P2's `<WhatsAppQuickSend>` in the Deal panel's action bar.
11. **`firestore.indexes.json`.** `(deals: pipeline, stage, ownerId)`, `(deals: ownerId, pipeline, updatedAt
    desc)`, `(site_visits: ownerId, scheduledAt)`, `(site_visits: status, scheduledAt)`.
12. **`firestore.rules`.** `deals`/`site_visits` follow the same owner-or-admin pattern as `contacts`
    (data-model.md's cross-cutting rules shape).

## Manual verification

- Convert a qualified lead to a Primary Sales Deal; confirm it appears in the correct kanban column with
  correct value.
- Drag a Deal card across two stages; confirm the stage bar in its record panel reflects the change and an
  Activity entry logs the transition.
- Schedule a site visit for tomorrow; confirm a Task appears due at that time. Backdate a test site visit
  and run the no-show sweep manually; confirm it flips to `no_show`.
- Switch pipeline tabs (Primary Sales ↔ Brokerage-Resale ↔ Rental); confirm each shows its own distinct
  stage columns per master spec §4.2.
- Send a WhatsApp quick message from a Deal panel; confirm it appears in the Conversation view (P2) linked
  to the same Contact.

## Automated checks

- `npm run build`, `npm run lint`.
- Unit test for the stage-transition validator (no illegal skips without confirmation flag) and the
  days-in-stage badge threshold logic.
