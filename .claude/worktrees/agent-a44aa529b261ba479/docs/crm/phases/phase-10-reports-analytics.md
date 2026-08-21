# Phase 10 — Reports & Analytics

**Release D (final phase). Depends on:** every prior phase (rollups aggregate across all of them — this is
deliberately last; see `docs/crm/roadmap.md`'s rationale).

## Functional spec

Implements master spec §6 in full: precomputed rollup documents, never live aggregation.

1. **Standard reports.** Lead source breakdown, conversion funnel (per pipeline), response time (lead →
   first contact), property/unit performance, agent performance/leaderboard, WhatsApp campaign performance,
   Meta ad performance, collections aging (P5 already ships a live version — this phase adds the
   rollup-backed trend view), monthly activity summary.
2. **Dashboard.** KPI cards with period-over-period delta, charts (line/bar/pie/funnel), date range picker
   (7d/30d/90d/custom).
3. **Export.** CSV/PDF download per report.
4. **Drift repair.** Nightly cron recomputes trailing 3 days of rollups from source records, catching any
   gap from a failed write or manual Firestore edit.

## Data model touched

New: `rollups/daily/{date}`, `rollups/monthly/{month}`, `rollups/agent/{uid}_{month}`,
`rollups/source/{month}`. See `docs/crm/data-model.md` §P10.

## Build steps

1. **Rollup writer functions.** `src/lib/server/rollups.ts` — `recomputeDailyRollup(date)`,
   `recomputeMonthlyRollup(month)`, `recomputeAgentRollup(uid, month)`, `recomputeSourceRollup(month)`.
   Each reads the relevant source collections for its period (leads, deals, bookings, receipts, calls) and
   writes one rollup document — this is the only place in the whole system allowed to do a broad collection
   scan, and only ever over a single day's or month's worth of data, never the full history.
2. **On-write triggers for the current period.** Rather than Cloud Functions (avoided per this design's
   Firestore-native, function-light approach), the relevant server actions from P1/P3/P5/P8 (lead create,
   deal stage change, receipt record, commission paid) each call the appropriate rollup writer for
   *today's* and *this month's* period inline, after their own transaction commits. This keeps rollups near-
   real-time without a separate event system.
3. **Nightly drift-repair cron.** `/api/cron/repair-rollups` — recomputes the trailing 3 days + current
   month from scratch, overwriting whatever the on-write path produced. This is the safety net: if an
   on-write call was ever missed (a bug, a manual edit), it self-heals within 24h.
4. **Dashboard page.** `src/app/admin/crm/reports/page.tsx` — date range picker, KPI cards
   (`<KpiCard>` per ui-system.md), charts reading `rollups/*` documents only (never raw collections) so a
   12-month view is 12 document reads.
5. **Per-report pages/tabs.** Lead source breakdown (pie, from `rollups/source`), conversion funnel (bar/
   funnel chart per pipeline, computed from `rollups/monthly`'s stage-count breakdown — extend the monthly
   rollup shape to include a `byStage: Record<pipeline, Record<stage, number>>` field), agent leaderboard
   (table + bar chart from `rollups/agent/*`), collections aging trend (line chart over monthly rollups'
   `overdueAmount` snapshots).
6. **Response-time report.** Computed differently — requires the gap between a Lead's `createdAt` and its
   first `Activity` of type `call`/`whatsapp`. Captured at write time: extend P1's Task/Activity flow to
   stamp `Lead.firstContactedAt` on the first outbound activity, then the rollup writer aggregates
   `firstContactedAt - createdAt` averages into `rollups/monthly`.
7. **Export.** CSV export reuses `<ListView>`'s existing export utility (P0) applied to the report's
   underlying table data; PDF export via the same document-generation approach used for allotment
   letters/demand letters (P4/P5) applied to a printable report layout.
8. **`firestore.indexes.json`.** None new for `rollups/*` itself (documents are read by ID, not queried) —
   confirm the source-collection indexes used by the rollup writers' scans are already covered by prior
   phases' declarations; add any gaps found during implementation.
9. **`firestore.rules`.** `rollups/*`: signed-in read, server-action-only write (`allow write: if false`) —
   same pattern as every computed/financial collection in this design.

## Manual verification

- Create a lead, log a call activity against it an hour later; confirm `firstContactedAt` is stamped and
  the response-time report reflects roughly that gap after the next rollup cycle.
- Compare the dashboard's "This month" KPI cards against a manual count from the raw collections for a low-
  volume test period; confirm they match exactly.
- Deliberately skip an on-write rollup call (e.g. via a direct Firestore console edit bypassing the server
  action) and run the drift-repair cron manually; confirm the rollup self-corrects.
- Export a report to CSV; confirm the downloaded file's row count and totals match what's on screen.
- Change the date range picker across 7d/30d/90d/custom; confirm the dashboard re-renders from the correct
  rollup documents each time without a full-collection query firing (verify via network/Firestore usage
  inspection, not just visually).

## Automated checks

- `npm run build`, `npm run lint`.
- Unit tests for each `recompute*Rollup` function against a fixed seed dataset — assert exact totals, not
  just "no error thrown." This is the second-highest-value test target after P5's payment transactions,
  since a silently wrong report is worse than an obviously broken one.
