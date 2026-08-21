# Property Cards + Listing Page Phase 6 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate `PropertyFilters.tsx` and `PropertySort.tsx`'s hand-rolled selects to the shared `Select` component, and replace `PropertyFilters.tsx`'s mobile inline filter toggle with a real bottom-sheet drawer, per `docs/superpowers/specs/2026-08-10-property-cards-listing-phase6-design.md`.

**Architecture:** Task 1 migrates all 5 filter fields to `Select` and cleans up unused imports. Task 2 replaces the mobile inline-append pattern with an `AnimatePresence`-driven bottom sheet, reusing the same `filtersUI` JSX already defined (its `grid-cols-1` base is already single-column at mobile widths, so no separate mobile-specific field layout is needed). Task 3 migrates `PropertySort.tsx`'s standalone select. Task 4 verifies. `PropertyCard.tsx`, `PropertyGrid.tsx`, and `/properties/page.tsx` are not touched by this plan.

**Tech Stack:** Next.js 16.2.12, React 19, `framer-motion`, Tailwind v4 tokens from Phase 1, `lucide-react` icons, `next/navigation` (`useRouter`/`useSearchParams`).

## Global Constraints

- Only `src/components/properties/PropertyFilters.tsx` and `src/components/properties/PropertySort.tsx` are touched by this plan. No other file.
- Filter/sort logic (`apply`, `reset`, `handleChange`, query param construction, `router.push` destinations) is NOT changed — only the UI rendering the same state/handlers changes.
- Desktop (`lg:` and up) filter layout (`hidden lg:block`, inline `filtersUI`) is NOT changed — only mobile's presentation changes.
- No test framework exists in this repo — verification is `npx tsc --noEmit` and `npm run lint`.
- Every task ends with a commit.

---

### Task 1: Migrate PropertyFilters to shared Select, clean up unused imports

**Files:**
- Modify: `src/components/properties/PropertyFilters.tsx`

**Interfaces:**
- Consumes: `Select` (`src/components/ui/Select.tsx`, `{label, error?, options: {value,label}[]} & SelectHTMLAttributes<HTMLSelectElement>`, native `onChange={(e) => ...}` signature).

- [ ] **Step 1: Replace the import block**

Replace:
```tsx
'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import type { LocationKey, PropertyType, PropertyStatus } from '@/types';
```
with:
```tsx
'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { Select } from '@/components/ui/Select';
```
(`LocationKey`/`PropertyType`/`PropertyStatus` are pre-existing dead imports — the `LOCATIONS`/`TYPES`/`STATUSES` arrays below are untyped string-literal arrays, never annotated with these types. Confirm at implementation time none of the three appears anywhere else in the file before removing all three; if one is actually used somewhere, keep only that one.)

- [ ] **Step 2: Delete the local `FilterSelect` function and its `SelectProps` interface**

Delete both (originally lines 44-70):
```tsx
interface SelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  id: string;
}

function FilterSelect({ label, value, onChange, options, id }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-inter font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border border-border-subtle rounded-xl px-3 py-2.5 text-ink font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
```

- [ ] **Step 3: Replace the 5 `FilterSelect` usages in `filtersUI` with `Select`**

Replace:
```tsx
  const filtersUI = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <FilterSelect id="filter-location" label="Location" value={location} onChange={(v) => { setLocation(v); apply({ location: v }); }} options={LOCATIONS} />
      <FilterSelect id="filter-type" label="Property Type" value={type} onChange={(v) => { setType(v); apply({ type: v }); }} options={TYPES} />
      <FilterSelect id="filter-price" label="Budget" value={priceRange} onChange={(v) => { setPriceRange(v); apply({ priceRange: v }); }} options={PRICE_RANGES} />
      <FilterSelect id="filter-bedrooms" label="Bedrooms" value={bedrooms} onChange={(v) => { setBedrooms(v); apply({ bedrooms: v }); }} options={BEDROOMS} />
      <FilterSelect id="filter-status" label="Status" value={status} onChange={(v) => { setStatus(v); apply({ status: v }); }} options={STATUSES} />
    </div>
  );
```
with:
```tsx
  const filtersUI = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Select id="filter-location" label="Location" value={location} onChange={(e) => { setLocation(e.target.value); apply({ location: e.target.value }); }} options={LOCATIONS} />
      <Select id="filter-type" label="Property Type" value={type} onChange={(e) => { setType(e.target.value); apply({ type: e.target.value }); }} options={TYPES} />
      <Select id="filter-price" label="Budget" value={priceRange} onChange={(e) => { setPriceRange(e.target.value); apply({ priceRange: e.target.value }); }} options={PRICE_RANGES} />
      <Select id="filter-bedrooms" label="Bedrooms" value={bedrooms} onChange={(e) => { setBedrooms(e.target.value); apply({ bedrooms: e.target.value }); }} options={BEDROOMS} />
      <Select id="filter-status" label="Status" value={status} onChange={(e) => { setStatus(e.target.value); apply({ status: e.target.value }); }} options={STATUSES} />
    </div>
  );
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors — in particular, no "FilterSelect is not defined" errors and no unused-import warnings for `LocationKey`/`PropertyType`/`PropertyStatus`.

Read the file back and confirm: `Select` is imported and used 5 times, the local `FilterSelect` function and `SelectProps` interface are fully gone, and the three type imports are removed (or confirmed still needed and kept, per Step 1's caveat).

- [ ] **Step 5: Commit**

```bash
git add src/components/properties/PropertyFilters.tsx
git commit -m "Migrate PropertyFilters to shared Select component, remove unused type imports"
```

---

### Task 2: Replace mobile filter toggle with a bottom-sheet drawer

**Files:**
- Modify: `src/components/properties/PropertyFilters.tsx`

**Interfaces:**
- Consumes: Task 1's edits to the same file (the `filtersUI` variable, `mobileOpen`/`setMobileOpen` state, `hasFilters`, `reset`, all already defined and unchanged by this task).
- Adds: `AnimatePresence`, `motion` from `framer-motion` (new import — not previously imported in this file).

- [ ] **Step 1: Add the `framer-motion` import**

Add to the top of the file (after the existing imports from Task 1):
```tsx
import { AnimatePresence, motion } from 'framer-motion';
```

- [ ] **Step 2: Replace the mobile inline-append block with a bottom-sheet drawer**

Find the end of the component (the `return` statement's final section):
```tsx
      {/* Mobile: toggleable */}
      {mobileOpen && <div className="lg:hidden mt-2">{filtersUI}</div>}
    </div>
  );
}
```
Replace with:
```tsx
      {/* Mobile: bottom-sheet drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[59] bg-ink/40 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 bottom-0 z-[60] bg-surface rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Filter properties"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-ink text-lg">Filters</h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-md hover:bg-bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5 text-ink" />
                </button>
              </div>
              {filtersUI}
              {hasFilters && (
                <button
                  onClick={reset}
                  className="mt-4 text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear all filters
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
```
(The backdrop's `z-[59]` and sheet's `z-[60]` sit above `BottomNav`'s `z-50` from Phase 3, so the sheet correctly covers the bottom nav bar rather than appearing beneath it. `filtersUI` is reused as-is — its `grid-cols-1` base is already single-column at mobile widths below the `sm:` breakpoint, so it renders correctly stacked inside the sheet with no separate mobile-specific variant needed.)

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors.

Read the file back and confirm: `AnimatePresence`/`motion` are imported and used, the mobile filter UI now renders as a fixed bottom sheet with a backdrop and a close button (not an inline-appended block), and the desktop `hidden lg:block` section is completely unchanged.

- [ ] **Step 4: Commit**

```bash
git add src/components/properties/PropertyFilters.tsx
git commit -m "Replace mobile filter toggle with a bottom-sheet drawer"
```

---

### Task 3: Migrate PropertySort to shared Select

**Files:**
- Modify: `src/components/properties/PropertySort.tsx`

**Interfaces:**
- Consumes: `Select` (same component as Tasks 1-2).

- [ ] **Step 1: Add the `Select` import**

Replace:
```tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';
```
with:
```tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';
import { Select } from '@/components/ui/Select';
```

- [ ] **Step 2: Replace the inline `<select>` with `Select`**

Replace:
```tsx
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-gold-dark shrink-0" aria-hidden="true" />
        <label htmlFor="sort-select" className="text-sm font-inter text-slate-500 shrink-0">
          Sort by:
        </label>
        <select
          id="sort-select"
          value={currentSort}
          onChange={(e) => handleChange(e.target.value)}
          className="bg-white border border-border-subtle rounded-lg px-3 py-2 text-ink font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold cursor-pointer"
          aria-label="Sort properties"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
```
with:
```tsx
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-gold-dark shrink-0 mb-1.5" aria-hidden="true" />
        <div className="w-48">
          <Select
            id="sort-select"
            label="Sort by"
            value={currentSort}
            onChange={(e) => handleChange(e.target.value)}
            options={SORT_OPTIONS}
          />
        </div>
      </div>
```
(`Select` renders its own visible `<label>`, replacing the separate `<label htmlFor="sort-select">Sort by:</label>` text — the standalone label element is removed since `Select` provides an equivalent one. The icon gets a small `mb-1.5` nudge to roughly align with the input row now that there's a label line above the field taking up vertical space; `w-48` keeps the sort dropdown from stretching to fill the flex row's available width the way it would with no width constraint.)

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors.

Read the file back and confirm: `Select` is imported and used, the old standalone `<label htmlFor="sort-select">` text and native `<select>` are gone, and `handleChange`/`currentSort` logic is unchanged.

- [ ] **Step 4: Commit**

```bash
git add src/components/properties/PropertySort.tsx
git commit -m "Migrate PropertySort to shared Select component"
```

---

### Task 4: Build verification and manual smoke check

**Files:**
- No modifications expected — this task verifies Tasks 1-3.

**Interfaces:**
- Consumes: the complete Task 1-3 changes to `PropertyFilters.tsx` and `PropertySort.tsx`.

- [ ] **Step 1: Full build check**

Run: `npx tsc --noEmit`, `npm run lint`, `npm run build`.
Expected: all three succeed with no errors.

- [ ] **Step 2: Manual smoke check**

Run `npm run dev`, then in a browser (or via the `claude-in-chrome` tools if available):
- Load `/properties` at desktop width (≥1024px): confirm all 5 filters render inline in a row, styled via `Select` (visible label above each field); confirm the sort dropdown also renders via `Select`; select a few different filter/sort values and confirm the URL updates and results change accordingly.
- At a mobile-ish width (or narrow browser window): confirm the "Show Filters" button still shows the active-filter-count badge when filters are set; tapping it now opens a bottom sheet sliding up from the bottom of the screen with a dark backdrop behind it, containing all 5 filters stacked in a single column, a close (X) button, and (when filters are active) a "Clear all filters" button; tapping the backdrop or the X closes the sheet; the sheet renders above the mobile bottom nav bar, not underneath it.
- Confirm applying a filter from inside the mobile sheet correctly updates the URL and results (same as desktop).
- Confirm `PropertyCard`/`PropertyGrid`/the page's hero banner are all visually unchanged from before this phase.

- [ ] **Step 3: Commit (only if Step 1 or Step 2 surfaced a fix)**

If verification is clean, no commit needed for this task.

---

## Definition of Done

- `PropertyFilters.tsx`'s 5 filter fields and `PropertySort.tsx`'s sort field all use the shared `Select` component; both local hand-rolled select sub-components are deleted.
- `PropertyFilters.tsx`'s mobile filter UI is a real bottom-sheet drawer (backdrop + slide-up panel + close button), not an inline-appended block.
- Unused type imports removed from `PropertyFilters.tsx`.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass.
- Filter/sort logic, desktop layout, and `PropertyCard`/`PropertyGrid`/the listing page shell are all unchanged from before this phase.
