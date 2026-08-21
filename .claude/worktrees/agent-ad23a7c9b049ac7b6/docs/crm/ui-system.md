# CRM UI System

Companion to `docs/superpowers/specs/2026-08-07-real-estate-crm-design.md`. Extends the existing
navy/gold Tailwind 4 design system (`src/app/globals.css`, `AdminSidebar.tsx`) rather than replacing it.
Grounded in 2026 CRM UI research: Pipedrive-style kanban-as-center-of-design, Streak/Wealthbox command
palettes, Linear-style saved views and bulk actions.

## 1. Design tokens (existing, reused)

- Sidebar: navy `#0a1128` with gold `#gold-400` accents.
- Content background: light gray, white cards.
- Font: Playfair (headings) / Inter (body) — already loaded.
- Status pills: green = success/paid/delivered, blue = in-progress/read, orange = pending/warm, red =
  overdue/failed/lost, gray = inactive/draft.

New tokens to add:
- Stage-bar colors per pipeline (primary sales = gold gradient; brokerage = blue gradient; rental = teal
  gradient) so a Deal's pipeline is visually identifiable at a glance in list views.
- Priority colors for tasks (low = gray, medium = amber, high = red) — distinct from status pills.

## 2. Navigation

`AdminSidebar.tsx`'s existing CRM collapsible section grows as phases ship. Target structure by Release D:

```
CRM
 ├─ Overview            (dashboard)
 ├─ Inbox                (P1 — unified lead/enquiry/WA inbox)
 ├─ Contacts
 ├─ Deals                (P3 — kanban, replaces flat Leads/Enquiries as primary nav)
 ├─ Site Visits           (P3)
 ├─ Inventory             (P4 — unit grid)
 ├─ Bookings              (P4/P5)
 ├─ Collections            (P5)
 ├─ Post-Sales             (P6 — handover, grievances)
 ├─ Resale & Rental         (P7 — mandates, tenancies)
 ├─ Channel Partners         (P8)
 ├─ Marketing                (existing stub, wired up in P2/P9)
 ├─ Templates                (existing)
 └─ Reports                  (P10)
```
Leads/Enquiries top-level nav items fold into Deals + Inbox once P3 ships (kept separate through Release A
so nothing regresses while the pipeline entity doesn't exist yet).

## 3. Core list view pattern

Every module list (Contacts, Deals, Bookings, Mandates, Channel Partners...) shares one component shape:

```
[Saved Views tabs]  [Search]                          [+ New] [Bulk actions ▾] [Export]
[Facet filters: Stage | Owner | Source | Date range | ...]
┌─────────────────────────────────────────────────────────────────┐
│ ☐  Name          Stage       Owner      Value      Updated   ⋮  │
│ ☐  ...           ...         ...        ...        ...       ⋮  │
└─────────────────────────────────────────────────────────────────┘
[Pagination]
```

- **Saved views**: user-defined filter+sort presets, stored per-user (`users/{uid}/savedViews/{id}`),
  e.g. "My hot leads", "Overdue collections". Not built until P1 needs its first one; the component is
  designed generically from the start so every later module reuses it for free.
- **Faceted filters**: derived from the module's own fields (stage, owner, source, tag, date range).
  Filters compose into the Firestore query's `where()` clauses; anything beyond one range filter needs
  client-side post-filtering or a precomputed index (see data-model.md's index notes).
- **Bulk actions**: appear in a toolbar the moment ≥1 row is checked. Standard set: reassign owner, change
  stage/status, add tag, send WhatsApp template, export selected.
- **Row click** opens the record in the right-side slide-over panel (§5), not a full page navigation —
  keeps filter/scroll state intact. Deep-linkable via `?panel=<id>` so it's still shareable/bookmarkable.

## 4. Kanban board (Deals, P3)

- One column per pipeline stage; column header shows count + summed `value`.
- Cards: contact name, listing label, value, owner avatar, days-in-stage badge (turns amber >7d, red >14d
  — configurable).
- Drag-and-drop between columns triggers the same stage-change path as the record panel's stage selector
  (writes one `activities` doc, may fire `automation_rules`).
- Pipeline switcher (Primary Sales / Brokerage / Rental) as tabs above the board — one board per pipeline,
  never mixed, since stage lists differ.

## 5. Record panel

Right-side slide-over, ~640px, opened from any list row or via command palette:

```
┌────────────────────────────────────┐
│ ← Back        Contact Name    ⋮ ✕  │
│ [Stage bar: ●───●───○───○───○]     │
│ [Overview] [Activity] [Tasks] [Docs] [Money] │
│                                      │
│  <tab content>                      │
└────────────────────────────────────┘
```
- **Stage bar**: only present on Deal/Booking records; clickable segments to jump-change stage (with
  confirmation if skipping stages).
- **Activity tab**: reverse-chronological feed from `activities` (data-model.md), grouped by day, with
  inline quick-add (note / log call / log WhatsApp).
- **Tasks tab**: open tasks for this record + "add follow-up" inline form.
- **Money tab**: only on Booking records — payment plan progress bar, demands table, receipts table,
  outstanding/overdue rollup fields displayed prominently (never computed client-side, per data-model.md).

## 6. Command palette (`Cmd+K` / `Ctrl+K`)

Global, available from any `/admin/*` page. Two modes based on query prefix:
- No prefix: fuzzy-search contacts, deals, units, bookings by name/phone/label — opens the record panel.
- `>` prefix: actions — "Create lead", "New task", "Go to Inventory", "Send WhatsApp broadcast".

Built as a single client component mounted in `admin/layout.tsx`, keyboard-triggered, results from a
lightweight client-side index refreshed on open (not a live Firestore full-text search — Firestore has none;
see data-model.md's constraint notes) plus a manual "search everywhere" fallback that fans out `where()`
prefix-queries per collection.

## 7. Dashboard widgets

Reused across CRM Overview (existing) and later Reports (P10): KPI card (value + delta vs. prior period +
sparkline), pie/donut (source breakdown), bar (stage funnel, agent leaderboard), line (trend over time).
Built on the existing Recharts dependency — no new charting library.

## 8. Forms

React Hook Form + Zod, matching existing `PropertyForm.tsx`/`ProjectForm.tsx` conventions. Multi-step forms
(Booking creation, Mandate intake) use a shared `<Stepper>` wrapper rather than one giant form, so KYC/
document upload steps can be completed out of order and resumed.

## 9. Accessibility & responsiveness

Mobile-first for agents in the field: site-visit check-in, quick-call, WhatsApp-send, and task-complete are
all one-tap from the mobile nav (agents are the primary mobile users, not admins). Desktop is the primary
surface for kanban, inventory grid, and reports, which don't meaningfully compress to mobile widths — those
views get a simplified list fallback below `md:` breakpoint rather than a squeezed kanban.

## 10. Component inventory (build order, maps to phases)

| Component | First needed | Reused by |
|---|---|---|
| `<ListView>` (saved views, filters, bulk actions) | P1 (Leads/Contacts) | every module thereafter |
| `<RecordPanel>` | P1 | Deals, Bookings, Mandates, Channel Partners |
| `<ActivityTimeline>` | P1 | every record type |
| `<StageBar>` | P3 | Deals, Bookings |
| `<KanbanBoard>` | P3 | Deals only |
| `<InventoryGrid>` (visual unit map) | P4 | Inventory |
| `<PaymentPlanProgress>` | P5 | Bookings Money tab |
| `<CommandPalette>` | P1 (basic) → full in P3 | global |
| `<KpiCard>` / chart wrappers | existing CRM dashboard | Reports (P10) |
