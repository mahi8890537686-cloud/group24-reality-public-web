# Real Estate CRM — Master Architecture Spec

**Status:** Approved for planning
**Date:** 2026-08-07
**Owner:** Group 24 Reality

## 1. Purpose

Turn the existing admin panel (Firestore-backed Next.js site with basic leads/enquiries/contacts) into a
comprehensive, industry-standard real estate CRM covering the full lifecycle: first enquiry → qualification →
site visit → booking → payments → possession → resale/rental → repeat business — plus channel partner
management and marketing integrations.

This document is the single source of truth for architecture. Per-module functional detail and build steps
live in the phase plans under `docs/crm/phases/`. Full collection/field/index/rule detail lives in
`docs/crm/data-model.md`.

## 2. Business context

Group 24 Reality operates three lines of business simultaneously, all through the same team of four
(1 admin + 3 sales agents):

1. **Primary sales** — selling units in its own projects (Locations → Projects → Properties, already modeled).
2. **Brokerage** — selling third-party (mandated) inventory it does not own.
3. **Resale & rental** — secondary-market sales and tenancy on behalf of owners.

A single linear "lead → sale" funnel cannot represent all three, so the CRM is built around **one contact
graph feeding three parallel pipelines**, described in §4.

## 3. Current state (baseline)

- **Stack:** Next.js 16 (App Router), React 19, Tailwind 4, Firebase (client SDK) + firebase-admin,
  TypeScript, Zod, React Hook Form, Recharts, lucide-react, framer-motion.
- **Auth:** Single Firebase Auth login for `/admin/*`, no roles (`src/lib/auth-context.tsx`).
- **Public data model:** `Location → Project → Property` (marketing/catalog data), `src/types/index.ts`.
- **CRM baseline already in the repo:** `Contact`, `Lead`, `Enquiry`, `CrmTemplate`, `WaMessage`,
  `WaCampaign` types and matching `src/lib/firestore/*.ts` accessors; admin pages for
  dashboard/contacts/leads/enquiries/templates/marketing exist as UI shells with no backing integrations.
- **Gap:** no `Unit`/inventory concept, no `Deal`/pipeline entity, no payments ledger, no RBAC, no
  integration wiring (WhatsApp/Meta/portals/IVR are all unbuilt), no automation engine, no reporting rollups.

## 4. Domain model

### 4.1 Six core entities

| Entity | Role |
|---|---|
| **Contact** | The hub. One person, one record, regardless of how many roles they hold (buyer, seller, tenant, investor) or how many deals they're in. |
| **Requirement** | Demand side: what a contact is looking for (budget, location, type, urgency, financing). One contact can have several. |
| **Listing** | Supply side: either an internal `Unit` (owned inventory) or a `Mandate` (third-party/resale/rental listing). |
| **Deal** | The opportunity. Links a Contact + a Listing + a pipeline + a stage + a value + an owner (agent). This is the kanban card. |
| **Activity** | The timeline atom. Every call, WhatsApp message, note, site visit, and stage change writes one Activity record. Nothing bypasses this — it is the audit trail and the "what happened" view. |
| **Task** | A follow-up with a due date and an owner. Drives the agent's daily worklist and SLA/overdue alerts. |

Contact is never duplicated per role. A person who is both selling their flat and looking to buy a plot is
one Contact with one Requirement (buy) and one Deal on the Resale pipeline (sell-side, as the mandate's
owner) plus one Deal on the Primary Sales pipeline (buy-side).

### 4.2 Three pipelines

```
Primary Sales   New → Qualified → Site Visit → Negotiation → Booked → Agreement → Registered → Possession
Brokerage/Resale Requirement → Matched → Shortlisted → Site Visit → Offer → Closed → Commission Received
Rental          Requirement → Matched → Viewing → Agreement → Tenancy Active → Renewal / Exit
```

Each `Deal` document carries a `pipeline` field and a `stage` value scoped to that pipeline. Stage
transitions are the primary trigger surface for the automation engine (§8).

### 4.3 `Unit` — the missing primitive

`Property` (existing) is a **marketing listing** — it has no booking status, no buyer, no payment plan, and
multiple public pages can point at the same physical inventory without conflict. That is correct for a
catalog page and wrong for anything transactional.

**`Unit`** is added as the sellable, bookable primitive for owned inventory:

- Belongs to a `Project`; has a unit/plot number, block/phase, size, base rate, PLC (preferential location
  charge) and other charges, and floor/facing where applicable.
- Status: `available | held | blocked | booked | agreement | registered | sold`.
- `heldUntil` — holds expire automatically (agent taps "hold" during a site visit; releases after N hours
  unless converted).
- `currentDealId` — pointer to the live Deal, so the inventory grid and the deal are always in sync.

One `Property` (public listing) maps to one `Unit` (internal, transactional) for owned inventory. Not every
`Unit` needs a public `Property` (unsold inventory not yet marketing-ready); not every `Property` needs a
`Unit` (a "typical unit" showcase page, or third-party/resale listings which use `Mandate` instead).

Full field list: `docs/crm/data-model.md#unit`.

### 4.4 `Mandate` — third-party & resale/rental supply

For brokerage and resale/rental, the CRM does not own the inventory. `Mandate` represents "a seller/owner
has authorized us to sell or rent this" — seller Contact, property description, asking price, exclusivity
flag, expiry date, and commission terms. Matching (§4.5) runs against `Mandate` the same way it runs against
`Unit`, through a shared `Listing` read-shape.

### 4.5 Requirement ↔ Listing matching

Every new `Requirement` is scored against open `Unit`/`Mandate` records on budget range, location, type, and
size; every new `Unit`/`Mandate` is scored against open `Requirement`s the same way. Matches above a
threshold create a suggested `Deal` (not an automatic one — an agent confirms it). This runs as a Firestore-
triggered server action, not a live query join (Firestore cannot join; see §7).

## 5. Money model — immutable ledger

Firestore cannot cheaply `SUM()` across thousands of documents and has no transactional joins, so the
payments module is deliberately **append-only with maintained rollups**, never a mutable balance field
computed on read.

```
payment_plans/{id}          template: milestone name, % or amount, trigger (date | construction stage)
bookings/{id}/demands/{id}  a raised demand: milestone, amount, due date, status
bookings/{id}/receipts/{id} an immutable record of money received (mode, reference, date)
bookings/{id}                rollup fields: totalDemanded, totalReceived, outstanding, overdueAmount
```

`totalDemanded`, `totalReceived`, `outstanding`, and `overdueAmount` on the `bookings/{id}` document are
updated **inside a Firestore transaction** every time a `demand` or `receipt` is written — never
recalculated by summing subcollections at read time, and never written by the client. Every write to these
three collections goes through a server action (`firebase-admin`, Next.js Server Action or Route Handler)
service-account-authenticated; the client SDK gets **read-only** access, enforced in `firestore.rules`. This
is the one place in the system where "the client can write it" is not acceptable, given Firestore's
document-level (not row-level, not constraint-checked) write model.

Detail: `docs/crm/phases/phase-5-payments-collections.md`.

## 6. Reporting — rollup documents, not live aggregation

Firestore has no `GROUP BY`. Every report is served from precomputed rollup documents, written by the same
server actions that mutate source records:

```
rollups/daily/{YYYY-MM-DD}
rollups/monthly/{YYYY-MM}
rollups/agent/{uid}/{YYYY-MM}
rollups/source/{YYYY-MM}        (lead source attribution)
```

A nightly Vercel Cron job recomputes the last 3 days of rollups from source records and repairs drift (a
failed write, a retried webhook, a manual Firestore console edit). A 12-month trend report reads 12
documents instead of scanning tens of thousands of lead/deal/payment records.

Detail: `docs/crm/phases/phase-10-reports-analytics.md`.

## 7. Firestore constraints this design works around

Named explicitly because every module design decision above traces back to one of these:

- **No joins.** Denormalize read-shape fields (e.g. `contactName` on a `Deal`) at write time; never expect
  to join `Deal` to `Contact` in a query.
- **No server-side aggregation (`SUM`/`COUNT`/`GROUP BY`).** → rollup documents (§6), maintained on write.
- **One range/inequality filter per compound query.** Composite indexes are pre-declared per phase in
  `docs/crm/data-model.md`; any new filter combination needs a new index, planned ahead of the query being
  written, not discovered at runtime.
- **No multi-document transactional integrity across unrelated collections** beyond a single transaction's
  document set. Money writes are scoped to touch only `demands`/`receipts`/`bookings` inside one transaction
  — never spanning into `contacts` or `deals` in the same transaction.
- **Client SDK writes are enforced only by `firestore.rules`**, not by application-layer validation the
  server can trust. Anything money-, commission-, or inventory-status-related is written exclusively through
  server actions with a service account; rules deny client writes to those collections outright.

## 8. Automation engine

`automation_rules/{id}`: **trigger** (`lead.created`, `deal.stage_changed`, `demand.overdue`,
`no_activity_for_N_days`, `unit.status_changed`) → **conditions** (source, tag, value range, project) →
**actions** (assign to agent/team, create task, send WhatsApp template, change stage, notify admin).

Lead scoring is rule-based (not ML) for v1: weighted factors (budget fit, source quality, response
recency, engagement count) sum to a 0–100 score stored on the lead alongside a breakdown array, so an agent
can see *why* a lead scored 82, not just that it did.

## 9. Integration layer

One inbound pipe, one outbound queue, for all four integrations (WhatsApp Business Cloud API, Meta Ads +
FB/Instagram publishing, property portals, calling/IVR):

```
/api/webhooks/{provider} → verify signature → normalize → inbound_events/{providerMsgId}  (idempotency)
                          → route: lead | message | call | delivery-status
                          → dedupe on E.164 phone hash → Contact upsert → Lead/Activity write

outbox/{id} → drained by Vercel Cron (batched, rate-limited, retried with backoff)
```

Secrets (tokens, API keys) live in environment variables only, never Firestore. `integration_accounts/{id}`
holds non-secret configuration (phone number ID, page ID, ad account ID, feature flags).

Full design: `docs/crm/integration-layer.md`.

## 10. Access control

Two roles for a four-person team: `admin`, `agent`. `users/{uid}` holds `{ role, name, active }`.
`firestore.rules`: agents may read/write records where `ownerId == request.auth.uid` or `ownerId == null`
(the unassigned pool); admins read/write everything; financial collections
(`payment_plans`, `demands`, `receipts`, `commissions`) are **admin-write-only** regardless of ownership, and
**read-only for everyone** from the client (writes go through server actions, per §5).

No channel-partner or customer external portals in this design — out of scope per business decision. The
data model does not preclude adding them later (Contact already models "role", Deal already models
ownership), but no UI or auth surface is built for them now.

## 11. UI system

Extends the existing navy/gold Tailwind 4 design system. Every list view: saved views, faceted filters,
sortable/resizable columns, bulk actions on row-select, CSV export. Every record view: header + pipeline
stage bar + tabs (Overview / Activity / Tasks / Documents / Money). Kanban board with per-column count and
value totals. `Cmd+K` command palette for navigation and quick actions. Right-side slide-over panel for
opening a record without losing list scroll position/filters.

Full component inventory: `docs/crm/ui-system.md`.

## 12. Phased delivery

11 phases (P0–P10) across 4 releases. Each phase is independently shippable and has its own plan under
`docs/crm/phases/`. Sequencing rationale and dependency graph: `docs/crm/roadmap.md`.

| Release | Phases | Outcome |
|---|---|---|
| A — Lead machine | P0 Foundation, P1 Lead Management, P2 Integration Layer + WhatsApp | No lead is ever lost or unassigned |
| B — Sell & collect | P3 Sales Pipeline, P4 Inventory & Booking, P5 Payments & Collections | Take a unit from enquiry → booked → paid |
| C — Own the lifecycle | P6 Post-Sales, P7 Resale & Rental, P8 Channel Partners & Commissions | Possession, resale, tenancy, broker payouts |
| D — Growth & intelligence | P9 Meta + Portals + IVR, P10 Reports & Analytics | Full attribution, CPL, agent scorecards |

WhatsApp ships in Release A (not with the other integrations in D) because follow-up cadence — the highest-
leverage lever on conversion — is worthless without it, and it is the highest-ROI channel for this market.
Meta/portals/IVR wait until the pipeline and inbox they feed already exist and can absorb the volume.

## 13. Non-goals (this design)

- Customer-facing or channel-partner-facing portals/logins.
- ML-based lead scoring (rule-based only, v1).
- Multi-currency / multi-country (INR only).
- Migrating off Firestore. This design is deliberately Firestore-native; a future SQL migration is a
  separate decision, not assumed here.
- Native mobile app (responsive web only).

## 14. Related documents

- `docs/crm/data-model.md` — every collection, field, composite index, security rule
- `docs/crm/ui-system.md` — component inventory and interaction patterns
- `docs/crm/integration-layer.md` — webhook/outbox design per provider
- `docs/crm/roadmap.md` — phase sequencing and dependencies
- `docs/crm/phases/phase-{0..10}-*.md` — per-phase functional spec + implementation plan
