# Phase 7 — Resale & Rental

**Release C. Depends on:** P1 (Requirement), P3 (Deal — already supports `listingType: 'mandate'` since P3,
no schema rework needed here). **Unblocks:** nothing downstream; parallel pipeline, independently usable.

## Functional spec

Opens the second and third business lines (master spec §2): brokerage on third-party inventory, and
resale/rental. This is where `Mandate` (master spec §4.4) and requirement↔listing matching (master spec
§4.5) actually ship — both were designed in P0–P3 but unused until now.

1. **Seller/owner mandate intake.** Capture a seller's authorization to sell or rent their property —
   asking price, exclusivity, expiry, commission terms.
2. **Listing management.** Mandate record with photos, description — effectively a private (non-public-site)
   listing.
3. **Requirement↔listing matching.** Automated suggestion engine: new Requirement scored against open
   Mandates (and, for buy-side requirements, open Units too — brokerage and primary sales share the same
   buyer pool); new Mandate scored against open Requirements. Suggestions surface for agent confirmation,
   never auto-create a Deal.
4. **Deal creation from a match.** Confirmed match → Deal on the Brokerage/Resale or Rental pipeline
   (pipeline chosen by the Requirement's `purpose` field).
5. **Tenancy tracking.** For rental deals reaching "Tenancy Active": start/end dates, rent, deposit, renewal-
   due alerts.

## Data model touched

New: `mandates`, `tenancies`, `match_suggestions`. See `docs/crm/data-model.md` §P7.

## Build steps

1. **`mandates` type + accessor.** `src/types/index.ts`, `src/lib/firestore/mandates.ts`.
2. **Mandate intake form.** Multi-step (`<Stepper>`, ui-system.md §8): seller contact (link existing or
   create new — reuse P1's dedupe-on-write path), property details, commission terms, exclusivity/expiry.
3. **Mandate list + record panel.** `src/app/admin/crm/mandates/page.tsx` via `<ListView>` (P0); record
   panel with Overview, Activity, and a "Matches" tab (suggestions for this mandate).
4. **`match_suggestions` type + accessor + matching function.** `src/lib/server/matching.ts` — pure scoring
   function (budget overlap, location match, type match, size fit → weighted score), same style as P1's
   `scoring.ts`. Triggered by a server action on `Requirement` create/update and `Mandate`/`Unit` create/
   update — **not** a live query join (Firestore can't join; per master spec §7, this is app-code matching
   against a bounded candidate set fetched via the `(status, type, locationSlug)` indexes already declared
   in data-model.md).
5. **Match suggestions UI.** Badge/list in both the Requirement's and the Mandate's record panels; "Create
   Deal from this match" action → creates the Deal on the correct pipeline per Requirement.purpose, marks
   the suggestion `accepted`, logs Activity on both sides.
6. **`tenancies` type + accessor.** `src/types/index.ts`, `src/lib/firestore/tenancies.ts`. Created when a
   Rental-pipeline Deal reaches "Agreement" stage (manual action in the Deal panel: "Start tenancy").
7. **Renewal-due sweep.** Cron job querying `(status == 'active', endDate <= now + 60d)` → flips to
   `renewal_due`, creates a follow-up Task for the assigned agent.
8. **Rental Deal panel extension.** Tenancy details tab once a tenancy exists (start/end, rent, deposit,
   renewal status).
9. **`firestore.indexes.json`.** `(mandates: status, purpose, type, locationSlug)`, `(tenancies: status,
   endDate)`, `(match_suggestions: requirementId)`, `(match_suggestions: listingId)`.
10. **`firestore.rules`.** `mandates`/`tenancies` follow owner-or-admin pattern; `match_suggestions` are
    system-generated (server-action write) but agent-actionable (client can update `status` to
    `accepted`/`dismissed`).

## Manual verification

- Create a mandate for a test seller; confirm it appears in the mandate list with correct status.
- Create a requirement whose budget/location/type overlaps the test mandate; confirm a match suggestion
  appears on both records within a reasonable delay (immediate if the matching function runs synchronously
  in the create path).
- Accept the match; confirm a Deal is created on the correct pipeline with both sides' details populated.
- Advance a rental Deal to "Agreement" and start a tenancy; confirm the tenancy record appears with correct
  dates. Backdate `endDate` to trigger the renewal sweep; confirm it flips to `renewal_due` and a Task is
  created.

## Automated checks

- `npm run build`, `npm run lint`.
- Unit tests for `src/lib/server/matching.ts`'s scoring function — cover exact match, partial budget
  overlap, no overlap (score should exclude it entirely, not just score it low), and location mismatch.
