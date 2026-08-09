# Property Search Phase 5 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the homepage `SearchBar`'s dark hand-rolled panel to `GlassPanel`'s "strong" light variant and its two dropdowns to the shared `Select` component, recoloring the remaining panel-internal elements to match, per `docs/superpowers/specs/2026-08-10-property-search-phase5-design.md`.

**Architecture:** Single-file change to `src/components/home/SearchBar.tsx`. Task 1 does the structural primitive swap (GlassPanel wrapper, `Select` replacing the local `SelectField`, import cleanup). Task 2 recolors the remaining hand-styled elements (pills, divider, labels) for the new light panel and fixes a height mismatch between the new `Select` (fixed `h-14`) and the existing Search button. Task 3 verifies.

**Tech Stack:** Next.js 16.2.12, React 19, `framer-motion`, Tailwind v4 tokens from Phase 1, `lucide-react` icons, `next/navigation` (`useRouter`).

## Global Constraints

- Only `src/components/home/SearchBar.tsx` is touched by this plan. No other file (not `PropertyFilters.tsx`, not `Select.tsx`/`GlassPanel.tsx` themselves).
- Search logic (`handleSearch`, query param construction, `router.push` destination) is NOT changed.
- The outer bridge `<div className="relative bg-ink -mt-16 sm:-mt-20 ...">` wrapper and the `motion.section` entrance animation are NOT changed.
- No test framework exists in this repo — verification is `npx tsc --noEmit` and `npm run lint`.
- Every task ends with a commit.

---

### Task 1: Migrate to GlassPanel and shared Select

**Files:**
- Modify: `src/components/home/SearchBar.tsx`

**Interfaces:**
- Consumes: `GlassPanel` (`src/components/ui/GlassPanel.tsx`, props `{ variant?: 'standard'|'strong', className?, children }`) and `Select` (`src/components/ui/Select.tsx`, props `{ label: string, error?: string, options: {value,label}[] } & SelectHTMLAttributes<HTMLSelectElement>` — note `onChange` here is the native `(e: ChangeEvent<HTMLSelectElement>) => void`, not the old local `SelectField`'s custom `(value: string) => void`).

- [ ] **Step 1: Add the new imports, remove the now-unused local `SelectField` and its dedicated imports**

Replace the top of the file:
```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Home, IndianRupee, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
```
with:
```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Select } from '@/components/ui/Select';
```
(`MapPin`/`IndianRupee`/`ChevronDown` were only used inside the local `SelectField`'s icon+label and native chevron, both being removed in this task. `Home` was already unused before this change — confirm at implementation time it truly has zero usages anywhere else in the file before dropping it; if it turns out to be used elsewhere, keep it and only drop the ones genuinely tied to `SelectField`.)

- [ ] **Step 2: Delete the local `SelectField` function entirely**

Delete this whole function (originally lines 31-69):
```tsx
function SelectField({
  icon: Icon,
  label,
  value,
  onChange,
  options,
  ariaLabel,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  ariaLabel: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
      <label className="flex items-center gap-1.5 text-[11px] font-inter font-semibold text-gold/80 uppercase tracking-widest">
        <Icon className="w-3.5 h-3.5 text-gold" />
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white/8 hover:bg-white/12 border border-white/15 hover:border-gold/50 rounded-xl px-4 py-3 pr-10 text-white font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold/60 cursor-pointer transition-all duration-200"
          aria-label={ariaLabel}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-ink text-white">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Replace the panel wrapper `<div>` with `GlassPanel`**

Replace:
```tsx
      <div className="relative bg-charcoal/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/40 border border-white/10 overflow-hidden p-5 sm:p-6">
```
with:
```tsx
      <GlassPanel variant="strong" className="relative overflow-hidden p-5 sm:p-6 shadow-2xl">
```
And its matching closing tag — find the closing `</div>` that pairs with this panel (immediately before the `</motion.section>` closing tag, currently the second-to-last line of the return block) and change it to `</GlassPanel>`. Do NOT change the outer bridge `<div className="relative bg-ink ...">`'s own closing tag — only the panel's.

- [ ] **Step 4: Replace the two `SelectField` usages with `Select`**

Replace:
```tsx
          <SelectField
            icon={MapPin}
            label="Location"
            value={location}
            onChange={setLocation}
            options={locations}
            ariaLabel="Select location"
          />
          <SelectField
            icon={IndianRupee}
            label="Budget"
            value={budget}
            onChange={setBudget}
            options={budgets}
            ariaLabel="Select budget range"
          />
```
with:
```tsx
          <div className="flex-1 min-w-0">
            <Select
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              options={locations}
            />
          </div>
          <div className="flex-1 min-w-0">
            <Select
              label="Budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              options={budgets}
            />
          </div>
```
(Wrapped in `flex-1 min-w-0` divs since `Select` itself doesn't take a `flex-1`/`min-w-0` className the way the old `SelectField` did internally — this preserves the same equal-width flex-row layout the parent `<div className="flex flex-col sm:flex-row gap-3 items-end">` expects.)

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors — in particular, no "SelectField is not defined" or unused-import errors.

Read the file back and confirm: `GlassPanel`/`Select` are imported and used, the local `SelectField` function is fully gone, both dropdowns render via `<Select>`, and `MapPin`/`IndianRupee`/`ChevronDown` (and `Home`, if confirmed unused) no longer appear anywhere in the file.

- [ ] **Step 6: Commit**

```bash
git add src/components/home/SearchBar.tsx
git commit -m "Migrate SearchBar panel to GlassPanel and dropdowns to shared Select"
```

---

### Task 2: Recolor pills/divider/labels for the light panel, fix button height alignment

**Files:**
- Modify: `src/components/home/SearchBar.tsx`

**Interfaces:**
- Consumes: Task 1's edits to the same file (locate blocks by literal content — Task 1 changed line numbers throughout the file).

- [ ] **Step 1: Recolor the "Type:" label**

Find:
```tsx
          <span className="text-[11px] font-inter font-semibold text-white/40 uppercase tracking-widest self-center mr-1">
            Type:
          </span>
```
Replace with:
```tsx
          <span className="text-[11px] font-inter font-semibold text-text-muted uppercase tracking-widest self-center mr-1">
            Type:
          </span>
```

- [ ] **Step 2: Recolor the inactive property-type pill state**

Find:
```tsx
                type === t.value
                  ? 'bg-gold text-ink border-gold shadow-md shadow-gold/25'
                  : 'bg-white/5 text-white/60 border-white/10 hover:border-gold/40 hover:text-white'
```
Replace with:
```tsx
                type === t.value
                  ? 'bg-gold text-ink border-gold shadow-md shadow-gold/25'
                  : 'bg-bg-secondary text-text-secondary border-border hover:border-gold/40 hover:text-text'
```
(The active state is unchanged — it already reads correctly on any surface.)

- [ ] **Step 3: Recolor the divider**

Find:
```tsx
        <div className="h-px bg-white/8 mb-5" />
```
Replace with:
```tsx
        <div className="h-px bg-border-subtle mb-5" />
```

- [ ] **Step 4: Fix Search button height to match the new `Select`'s fixed `h-14`**

Find:
```tsx
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-ink font-inter font-bold py-3 px-7 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-gold/35 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold whitespace-nowrap text-sm"
              aria-label="Search properties"
            >
```
Replace with:
```tsx
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 h-14 bg-gold hover:bg-gold-dark text-ink font-inter font-bold px-7 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-gold/35 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold whitespace-nowrap text-sm"
              aria-label="Search properties"
            >
```
(Replaced `py-3` with `h-14` so the button's height exactly matches `Select`'s fixed `h-14`, since the parent row uses `items-end` alignment and a mismatched height would look visually uneven now that `Select` has a fixed height unlike the old `SelectField`.)

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors.

Read the file back and confirm: no remaining `text-white/40`, `bg-white/5 text-white/60 border-white/10` (on the pill), or `bg-white/8` (divider) in this file, and the Search button className includes `h-14` instead of `py-3`.

- [ ] **Step 6: Commit**

```bash
git add src/components/home/SearchBar.tsx
git commit -m "Recolor SearchBar pills/divider/labels for the light panel and align button height"
```

---

### Task 3: Build verification and manual smoke check

**Files:**
- No modifications expected — this task verifies Tasks 1-2.

**Interfaces:**
- Consumes: the complete Task 1 + Task 2 `SearchBar.tsx`.

- [ ] **Step 1: Full build check**

Run: `npx tsc --noEmit`, `npm run lint`, `npm run build`.
Expected: all three succeed with no errors.

- [ ] **Step 2: Manual smoke check**

Run `npm run dev`, then in a browser (or via the `claude-in-chrome` tools if available):
- Load `/`: confirm the search panel now renders as a light warm off-white glass card (not dark charcoal), floating over the dark bridge strip below the hero, with a visible gold top-border accent.
- Confirm the Location and Budget dropdowns render with the shared `Select` styling (visible label above each field, white background, `ChevronDown` icon) and are the same height as the Search button (visually aligned along the bottom edge of the row).
- Confirm the property-type pills (Plot/Villa/Flat), "Type:" label, and divider all read clearly against the light panel (no low-contrast white-on-white text).
- Select a location, a budget, and a property type, then click "Search Properties": confirm it navigates to `/properties` with the correct `location`/`minPrice`/`maxPrice`/`type` query params reflecting your selections.
- Confirm the hero above and the rest of the homepage below are visually unaffected by this change.

- [ ] **Step 3: Commit (only if Step 1 or Step 2 surfaced a fix)**

If verification is clean, no commit needed for this task.

---

## Definition of Done

- `SearchBar.tsx`'s panel uses `<GlassPanel variant="strong">` instead of a hand-rolled dark panel className.
- Both dropdowns use the shared `Select` component; the local `SelectField` function is deleted.
- Pills, divider, and labels are recolored for the light panel; the Search button's height matches `Select`'s `h-14`.
- No unused imports remain.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass.
- Search logic, the outer bridge wrapper, and the entrance animation are unchanged from before this phase.
