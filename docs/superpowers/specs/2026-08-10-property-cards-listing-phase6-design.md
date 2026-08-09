# Group24 Reality — Property Cards + Listing Page (Phase 6 of the site redesign)

## Context

Phases 1-5 (design tokens, header/desktop nav, mobile nav/bottom CTA, hero, property search) are complete. This is Phase 6 of the ~12-phase redesign roadmap: property cards and the `/properties` listing page.

### Existing state

- `src/components/properties/PropertyCard.tsx` is already close to spec-compliant: white card, `border-border-subtle`, `shadow-md`, hover lift, type/status `Badge` overlays, price overlay on the image, title/location/specs/highlights, a `bg-ink hover:bg-gold` "View Details →" CTA. Already uses Phase-1 tokens throughout (swept in Phase 1, not restructured since).
- `src/components/properties/PropertyGrid.tsx` — responsive grid (1/2/3 columns) with `StaggerContainer`/`StaggerItem` entrance and a clean empty state. Already token-correct.
- `src/components/properties/PropertyFilters.tsx` — 5 filter selects (Location/Type/Budget/Bedrooms/Status) via a local hand-rolled `FilterSelect` sub-component (duplicate of the pattern already replaced by the shared `Select` in Phase 5's `SearchBar.tsx`). Mobile behavior is a simple inline show/hide toggle that appends the filter fields below a button — not the "bottom sheet/filter drawer" the design brief explicitly specifies for mobile (§22: "Mobile: Use: [ Filters ] [ Sort ] with bottom sheet/filter drawer. Do NOT force a desktop filter layout onto mobile.").
- `src/components/properties/PropertySort.tsx` — a small "N properties found" + sort `<select>`, also hand-rolled inline (not using the shared `Select`).
- `src/app/properties/page.tsx` — already token-correct (dark hero banner via `SectionHeader`, white listing section), Server Component with `Suspense` boundaries around the client filter/sort components.

### Design decisions (made autonomously per user instruction — proceed with recommended choices, no approval gate)

1. **`PropertyCard.tsx`, `PropertyGrid.tsx`, `/properties/page.tsx` are left untouched** — they already satisfy the brief's Property Card System (§21) and listing-page structure (§22); no real gap to close, and touching working, already-correct code would be unnecessary churn.
2. **`PropertyFilters.tsx`'s local `FilterSelect` migrates to the shared `Select` component** — same rationale as Phase 5's `SearchBar` migration: one Input/select system site-wide (brief §39, Design Consistency Rule), removes a duplicate hand-rolled implementation.
3. **`PropertySort.tsx`'s inline `<select>` migrates to the shared `Select` component** — same rationale.
4. **Mobile filter UX becomes a real bottom-sheet drawer**, replacing the current inline toggle-and-append pattern — this is the one substantive UX gap the brief calls out explicitly for this page. Built directly in `PropertyFilters.tsx` using the same `AnimatePresence`/fixed-overlay pattern already proven in `Navbar.tsx`'s mobile menu (Phases 1-3), rather than extracting a new generic `Drawer` primitive now — one real call site doesn't justify a new shared component yet (YAGNI); revisit generalizing it if a second drawer use case appears in a later phase.
5. **Unused type imports in `PropertyFilters.tsx` (`LocationKey`, `PropertyType`, `PropertyStatus`) are cleaned up** while the file is already being touched — a pre-existing lint warning, cheap to fix in passing.

## Scope of Phase 6

**In scope:**
1. `src/components/properties/PropertyFilters.tsx`: delete local `FilterSelect`, migrate all 5 filter fields to the shared `Select` component; replace the mobile inline toggle with a bottom-sheet drawer (fixed overlay, slides up from the bottom, backdrop, close button, same filter fields inside); remove unused type imports.
2. `src/components/properties/PropertySort.tsx`: migrate the sort `<select>` to the shared `Select` component (keep the always-visible, non-drawer layout — the brief's bottom-sheet guidance is specifically about the denser multi-field Filters UI, not a single sort dropdown).

**Out of scope (explicitly deferred):**
- `PropertyCard.tsx`, `PropertyGrid.tsx`, `/properties/page.tsx` — already correct, not touched.
- Property detail page (`/properties/[slug]`) — Phase 7.
- A new generic `Drawer`/`Modal` UI primitive — built ad-hoc in `PropertyFilters.tsx` for now; extract later if a second use case appears.
- Any change to filter/sort logic (query param construction, `router.push` destinations, `apply`/`reset` behavior).

## Design

### A. Select migration (`PropertyFilters.tsx`, `PropertySort.tsx`)

Both files' local select sub-components (`FilterSelect`, and `PropertySort`'s inline `<select>`) are replaced with the shared `Select` component (`src/components/ui/Select.tsx`), same adaptation as Phase 5: native `onChange={(e) => onChange(e.target.value)}` signature. `PropertyFilters`' 5-field grid (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4`) stays structurally the same, just rendering `<Select>` instead of `<FilterSelect>` in each grid cell.

### B. Mobile filter bottom sheet (`PropertyFilters.tsx`)

Replace the current `{mobileOpen && <div className="lg:hidden mt-2">{filtersUI}</div>}` inline-append pattern with a fixed-position bottom sheet:
- Triggered by the existing "Show Filters" button (same `mobileOpen` state, same badge showing active-filter count).
- `AnimatePresence` + `motion.div` sliding up from `y: '100%'` to `y: 0`, `fixed inset-x-0 bottom-0 z-[60]` (above `BottomNav`'s `z-50`), `bg-surface rounded-t-2xl` with a backdrop (`fixed inset-0 z-[59] bg-ink/40` behind it, dismissible on click), matching the animation duration/easing already used by `Navbar.tsx`'s mobile menu (`duration: 0.2`–`0.3` range).
- Contains the same `filtersUI` (5 `Select` fields, now stacked in a single column for the sheet's narrower width) plus a visible close affordance (an `X` button or "Done" button at the top of the sheet) and the existing "Clear all" reset action.
- Desktop (`lg:` and up) is unaffected — `filtersUI` continues to render inline via the existing `hidden lg:block` wrapper, unchanged.

### C. Unused imports cleanup

Remove `LocationKey`, `PropertyType`, `PropertyStatus` from `PropertyFilters.tsx`'s type import if genuinely unused (confirm at implementation time — the file's `LOCATIONS`/`TYPES`/`STATUSES` arrays are untyped string-literal arrays, not annotated with these imported types, which is why they're currently dead).

## Testing / Verification

- `npx tsc --noEmit` and `npm run lint` must pass (confirm the three unused-type-import warnings are gone).
- Manual check via `npm run dev`: `/properties` desktop shows all 5 filters inline as before (now using `Select` styling) plus the sort dropdown (now `Select`-styled); on mobile, tapping "Show Filters" opens a bottom sheet (not an inline expand) with all 5 filters stacked, a way to close it, and applying a filter updates the URL/results correctly from within the sheet.

## Non-goals / explicit exclusions

- No changes to `PropertyCard.tsx`, `PropertyGrid.tsx`, `/properties/page.tsx`, or the property detail page.
- No new generic `Drawer` component.
- No filter/sort logic changes.
