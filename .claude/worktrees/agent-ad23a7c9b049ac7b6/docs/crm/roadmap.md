# Phased Roadmap

Companion to `docs/superpowers/specs/2026-08-07-real-estate-crm-design.md` §12. 11 phases, 4 releases.
Each phase has its own plan under `docs/crm/phases/`. Phases within a release are listed in build order;
cross-release dependencies are called out explicitly.

## Release A — Lead machine

**Goal: no lead is ever lost or unassigned.**

| Phase | Delivers | Depends on |
|---|---|---|
| P0 Foundation | RBAC (admin/agent), `users` collection, `Unit` schema (unused until P4 but modeled now so later phases don't retrofit it), shared UI primitives (`ListView`, `RecordPanel`, `ActivityTimeline`) | — |
| P1 Lead Management | Unified inbox, `Requirement`, `Task`, `Activity` entities, dedupe, rule-based scoring, assignment | P0 |
| P2 Integration Layer + WhatsApp | Shared webhook/outbox pipe, WhatsApp inbox/broadcast/templates live | P0, P1 (needs Contact/Lead to attach messages to) |

**Why Unit ships in P0, not P4:** every phase after P0 references either `Unit` or `Deal.listingId`. Adding
the field now (even though Inventory/Booking UI doesn't exist until P4) avoids a schema migration later —
new documents are created with the field from day one, old `Property` records are untouched.

## Release B — Sell & collect

**Goal: take a unit from enquiry through booked to paid.**

| Phase | Delivers | Depends on |
|---|---|---|
| P3 Sales Pipeline | `Deal` entity, kanban board, site visit scheduling, negotiation tracking | P1 (Requirement→Deal), P2 (WhatsApp quick-send from Deal panel) |
| P4 Inventory & Booking | Unit availability grid, hold/block workflow, KYC intake, allotment letter, `Booking` entity | P3 (Deal reaches "Booked" stage) |
| P5 Payments & Collections | Payment plans, demands, receipts, collections aging, the immutable ledger | P4 (Booking exists) |

**Why this order:** a Deal must exist before a Unit can be booked against it (P3 before P4); a Booking must
exist before a payment plan can be attached to it (P4 before P5). Building P5 first would mean a payments
ledger with nothing to attach to.

## Release C — Own the lifecycle

**Goal: possession, resale, tenancy, broker payouts.**

| Phase | Delivers | Depends on |
|---|---|---|
| P6 Post-Sales | Handover checklists, possession tracking, grievance desk | P5 (a booking is fully paid before possession) |
| P7 Resale & Rental | `Mandate` entity, listing management, requirement↔listing matching, tenancy tracking | P1 (Requirement), P3 (Deal supports `listingType: 'mandate'` already from P3's design — no rework) |
| P8 Channel Partners & Commissions | CP onboarding, lead attribution, commission engine, payout tracking | P3 (Deal), P5 (payment/ledger pattern reused for commissions) |

**Why P7 doesn't block on P6:** resale/rental is a parallel pipeline to primary sales, not a continuation of
it — a resale deal never touches `Booking`/handover at all. P7 only needs P1 (Requirement) and P3 (Deal),
both already shipped by the start of Release C; sequencing it after P6 here is about team focus (finish the
owned-inventory lifecycle end-to-end before opening the second pipeline's UI), not a technical dependency.

## Release D — Growth & intelligence

**Goal: full attribution, cost-per-lead, agent scorecards.**

| Phase | Delivers | Depends on |
|---|---|---|
| P9 Meta Ads, Portals, IVR | Remaining three integrations on the shared pipe from P2 | P2 (pipe must exist) |
| P10 Reports & Analytics | Rollup documents, dashboards, exports | Every prior phase (rollups aggregate across all of them) |

**Why these ship last:** P9's integrations are additive lead/attribution sources — valuable, but the CRM is
fully usable without them (manual lead entry + WhatsApp covers Release A–C). P10 is deliberately last
because a rollup document is only as good as the data feeding it; building reports before Deals/Bookings/
Commissions exist would mean reporting on empty collections.

## Cross-phase notes

- **No phase is "done" until its manual verification steps (in each phase plan) pass against real data
  entered through the UI** — not just against seed/test data.
- **Every phase adds to, never breaks, the existing public site** (`/properties`, `/contact`, location
  pages) — those pages' Firestore reads (`properties`, `locations`, `projects`) are untouched throughout.
- **Firestore composite indexes accumulate.** Each phase plan lists new indexes; deploy
  `firestore.indexes.json` changes before or with the query code that needs them, never after.
