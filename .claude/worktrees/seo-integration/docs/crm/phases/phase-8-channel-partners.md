# Phase 8 — Channel Partners & Commissions

**Release C (final phase). Depends on:** P3 (Deal), P5 (reuses the transactional-ledger pattern for
commission math — same rigor, same reason: money). **Unblocks:** nothing downstream.

## Functional spec

1. **Channel partner onboarding.** Admin-created partner records (no self-service portal — out of scope
   per master spec §10) with KYC docs and a default commission structure.
2. **Lead/deal attribution.** A Deal can be attributed to a channel partner (who brought the buyer) at
   creation or by later assignment.
3. **Commission calculation.** Percent, flat, or tiered — per-project overrides of a partner's default
   terms. Applies to both external channel partners and, optionally, internal agent commission (same
   entity, `type` field distinguishes them).
4. **Payout tracking.** Pending → Approved → Paid workflow, admin-gated approval.

## Data model touched

New: `channel_partners`, `commissions`. See `docs/crm/data-model.md` §P8.

## Build steps

1. **`channel_partners` type + accessor + admin UI.** `src/types/index.ts`,
   `src/lib/firestore/channel-partners.ts`, onboarding form (KYC doc upload, reusing P4's Storage upload
   pattern; commission default terms).
2. **Channel partner list + record panel.** `src/app/admin/crm/channel-partners/page.tsx` via
   `<ListView>` — Overview (KYC, terms, status), a "Deals" tab (all deals attributed to this partner),
   a "Payouts" tab (their commission history).
3. **Attribution field on Deal.** Add `channelPartnerId?` to `Deal` (data-model.md's `deals` schema gets
   this addition — noted here since it's introduced in this phase, not P3, to avoid P3 carrying a field
   nothing uses yet). Attribution set at Deal creation (dropdown, optional) or later via an "Attribute to
   partner" action.
4. **Commission calc server action.** `src/lib/server/commissions.ts` (admin-SDK only, same isolation as
   `payments.ts` from P5) — `calculateCommission(dealId, partnerOrAgentId, type)` reads the Deal's `value`
   and the partner's (or a project-level override's) commission terms, writes a `commissions` doc in
   `pending` status. Triggered manually by admin from the Deal panel ("Calculate commission") once a Deal
   is `won`, not automatically — commission terms can have judgment calls (partial credit, split deals) an
   admin should confirm before the number is generated.
5. **Approval workflow.** Admin-only action flipping `commissions/{id}.status: pending → approved →
   paid`, each transition logged as an Activity linked to the Deal. Payout amount/date recorded on
   `paidAt`.
6. **Commission list + payout dashboard.** `src/app/admin/crm/commissions/page.tsx` — filterable by
   partner/agent/status, with pending-approval and pending-payout counts surfaced as KPI cards (reusing
   ui-system.md's `<KpiCard>`).
7. **`firestore.indexes.json`.** `(commissions: channelPartnerId, status)`, `(commissions: agentId,
   status)`, `(deals: channelPartnerId)`.
8. **`firestore.rules`.** `channel_partners`: admin-write, signed-in read. `commissions`: same
   `allow write: if false` pattern as P5's `demands`/`receipts` — this is money, so it's server-action-only
   with no exception.

## Manual verification

- Onboard a test channel partner with a 2% flat commission default.
- Attribute a won test Deal to that partner; calculate commission; confirm the amount matches 2% of the
  Deal's value by hand-checking.
- Progress the commission through approved → paid; confirm each transition logs an Activity and the
  partner's Payouts tab reflects the final paid status.
- Attempt a direct client-side write to a `commissions` document; confirm it's rejected by rules.

## Automated checks

- `npm run build`, `npm run lint`.
- Unit tests for `src/lib/server/commissions.ts`'s calculation function — flat, percent, and tiered basis
  types, plus a project-level override taking precedence over the partner's default.
