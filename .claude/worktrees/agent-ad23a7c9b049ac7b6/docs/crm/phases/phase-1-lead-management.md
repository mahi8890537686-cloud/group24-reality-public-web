# Phase 1 — Lead Management

**Release A. Depends on:** P0. **Unblocks:** P2 (WhatsApp needs Contact/Lead to attach messages to),
P3 (Deal needs Requirement).

## Functional spec

The single biggest gap in the current admin: `leads` and `enquiries` are flat, unassigned, unscored lists
with no shared timeline and no follow-up mechanism. This phase turns them into a real lead management
system.

1. **Unified inbox.** One screen listing every inbound touchpoint — `leads`, `enquiries`, and (once P2
   ships) `wa_messages` — merged by `phoneNormalized`, so an agent sees "this person" once, not three rows.
2. **Dedupe.** New inbound records with a phone matching an existing open Contact attach to that Contact
   instead of spawning a duplicate.
3. **`Requirement` capture.** When a lead/enquiry indicates budget/location/type, capture it as a structured
   `Requirement` (manual entry by the agent during the first call, not auto-extracted from free text).
4. **Rule-based scoring.** Every Contact/Lead gets a 0–100 score from weighted factors: budget fit vs.
   project price range, source quality (portal > website > cold), response recency, engagement count
   (number of activities). Score and its breakdown are visible, not a black box.
5. **Assignment.** Manual (drag/reassign in the UI) at launch; round-robin auto-assignment is an
   `automation_rule` (P0 schema, first real rule authored in this phase) an admin can turn on once agent
   load-balancing matters.
6. **Follow-up tasks.** Every new lead auto-creates a `Task` ("First contact") due same-day; stage changes
   can create follow-up tasks per `automation_rules`.
7. **Kanban-lite.** Leads/Enquiries get a lightweight stage board (New/Contacted/Qualified/Converted/Lost)
   using the same board component P3 will extend into full `Deal` kanban — built once, extended not rebuilt.

## Data model touched

New: `requirements`. Extended: `contacts`, `leads`, `enquiries` (see `docs/crm/data-model.md` §P1).

## Build steps

1. **Phone normalization utility.** `src/lib/phone.ts` — E.164 normalize + validate for Indian numbers
   (handle `+91`, `0`-prefix, 10-digit bare formats). Used everywhere a phone is captured or matched.
2. **Backfill `phoneNormalized`.** One-time server-action script normalizing existing `contacts`/`leads`/
   `enquiries` documents. Run once against production data before dedupe logic goes live, so old records
   participate in matching.
3. **Dedupe-on-write.** Extend `saveLead`/enquiry save + `addContact` (existing files in
   `src/lib/firestore/`) to query `phoneNormalized` before insert; if a match exists, link
   (`linkedLeadIds`/`linkedEnquiryIds` already exist on `Contact` — reuse) instead of creating a second
   Contact.
4. **`requirements` type + accessor.** `src/types/index.ts`, `src/lib/firestore/requirements.ts`. Simple
   form in the Contact record panel's Overview tab: "Add requirement."
5. **Scoring function.** `src/lib/scoring.ts` — pure function `scoreLead(lead, project?) →
   { score, breakdown }`. Called on lead/contact create and on relevant field changes (budget updates,
   new activity). Store both `score` and `scoreBreakdown` on the document (data-model.md §P1).
6. **Unified inbox screen.** `src/app/admin/crm/inbox/page.tsx` using `<ListView>` (P0) — merges `leads` +
   `enquiries` client-side (two queries, combined + sorted, since Firestore can't union-query across
   collections), grouped by `phoneNormalized`. Columns: name, phone, source, score, stage, owner,
   last activity. Facets: source, stage, owner, score range.
7. **Lead/Enquiry `<RecordPanel>` wiring.** Reuse P0's `<RecordPanel>` + `<ActivityTimeline>`; add
   Overview tab (contact details, requirement) and Tasks tab (P0's task accessor).
8. **Kanban-lite board.** `src/app/admin/crm/pipeline/page.tsx` — 5-column board (New/Contacted/Qualified/
   Converted/Lost) over the unified inbox's merged record set. Drag = stage update + `logActivity('stage_
   change')`. Build this as a thin wrapper the way P3 expects to extend (same component, more columns,
   multiple pipeline tabs) rather than a one-off.
9. **Auto-task-on-create.** Extend `saveLead`/enquiry save path to also create a `Task` ("First contact",
   due today, `ownerId` = assigned agent or unassigned pool) via `firebase-admin` server action (keeps the
   write transactional-ish: lead + task created together, not client-side two separate calls that can
   partially fail).
10. **First `automation_rule`: round-robin assignment.** Author (not build a UI for yet — a UI comes if
    admin wants to edit rules; for P1, a single seeded rule document is enough) `trigger: 'lead.created'` →
    `action: 'assign'` round-robin across active agents. Implemented as a server action triggered from the
    lead-save path (Firestore has no native triggers reachable without Cloud Functions, which this design
    avoids — see integration-layer.md's provider-webhook pattern for the same "server action does the work"
    approach).
11. **Saved views (real, first use).** Wire `<ListView>`'s saved-views hook (schema built in P0) to actual
    UI: "Save current filters as view," view switcher tabs. Ship 2 default views: "My leads today,"
    "Unassigned."
12. **`firestore.indexes.json` additions.** `(contacts: phoneNormalized)`, `(contacts: ownerId, stage)`,
    `(contacts: stage, followUpAt)`, `(leads/enquiries: phoneNormalized)`, `(requirements: status, type,
    locationSlug)`.

## Manual verification

- Submit two property-detail enquiries with the same phone number (different formatting: `9876543210` vs
  `+91 98765 43210`) — confirm they resolve to one Contact, not two.
- Create a lead; confirm a "First contact" task appears in Tasks with today's due date and an assigned
  owner.
- Open a lead in the record panel; confirm score + breakdown display and match the weights in
  `scoring.ts` by hand-checking one example.
- Drag a card across the kanban-lite board; confirm the stage updates and an Activity entry appears.
- Save a filtered view ("Unassigned"), navigate away, come back; confirm the view persists and reapplies.

## Automated checks

- `npm run build`, `npm run lint`.
- Unit tests for `src/lib/phone.ts` (normalization edge cases) and `src/lib/scoring.ts` (weight math) —
  first tests in the CRM codebase; establishes the pattern later phases' money/commission math will need.
