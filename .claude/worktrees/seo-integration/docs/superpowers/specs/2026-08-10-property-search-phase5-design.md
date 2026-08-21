# Group24 Reality — Property Search (Phase 5 of the site redesign)

## Context

Phases 1-4 (design tokens, header/desktop nav, mobile nav/bottom CTA, hero) are complete. This is Phase 5 of the ~12-phase redesign roadmap: the homepage property search widget, explicitly deferred from Phase 4.

### Existing state

`src/components/home/SearchBar.tsx` is a fully functional search widget: property-type quick-pills (Plot/Villa/Flat), Location + Budget dropdowns (hand-rolled `SelectField` sub-component), a "Search Properties" button that routes to `/properties?location=...&type=...&minPrice=...&maxPrice=...`. It sits in a dark `bg-charcoal/95 backdrop-blur-xl` panel that overlaps the hero's bottom edge via a `-mt-16`/`bg-ink` "bridge" wrapper (recolored, not restructured, in Phase 1).

Two Phase-1-built primitives have no call sites yet and are directly applicable here: `GlassPanel` (a "strong" variant — `rgba(247,245,240,0.90)`, `blur(24px)` — that the design brief explicitly names for this exact use case: "Hero search forms" is the brief's own worked example for when to use strong glass, §10/§16) and `Select` (label + `<select>` + `ChevronDown` + error-state primitive, styled for light surfaces).

### Design decisions (made autonomously per user instruction — proceed with recommended choices, no approval gate)

1. **Migrate the search panel from a dark hand-rolled panel to `GlassPanel`'s "strong" (light, warm off-white) variant** — this is a literal, named match to the design brief's §16 worked example (`rgba(247,245,240,0.90)`/`blur(24px)`), not a style preference. All panel-internal colors flip from white-on-dark to ink-on-light accordingly (labels, select text/borders, pill inactive states, dividers).
2. **Migrate the two dropdowns (Location, Budget) from the hand-rolled `SelectField` to the shared `Select` component.** `Select` doesn't support an inline icon next to its label (only the `SelectField` being replaced did) — dropping the small MapPin/IndianRupee icons is a reasonable simplification rather than extending `Select`'s API for a one-off need; the label text ("Location", "Budget") already carries the meaning.
3. **Keep the property-type pill row and the Search button hand-styled** — pills aren't a `Select`/`Button` use case, and the Search button needs a gold-filled treatment that `Button.tsx`'s current variant set (`primary`/`secondary`/`outline`/`ghost`) doesn't offer (same gap already noted and deliberately not fixed ad-hoc in Phase 4's hero CTA). Recolored to match the light panel instead of migrated to a component.
4. **Keep the outer dark `bg-ink` "bridge" wrapper unchanged** — a light glass card floating with clear shadow/border separation over a dark strip bleeding from the hero is the standard pattern the brief's own glass examples show; only the panel *inside* the bridge changes color, not the bridge itself.

## Scope of Phase 5

**In scope (`src/components/home/SearchBar.tsx` only):**
1. Replace the panel's className from `bg-charcoal/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/40 border border-white/10` to use `GlassPanel` (`variant="strong"`).
2. Delete the local `SelectField` function; replace its two call sites (Location, Budget) with the shared `Select` component (`import { Select } from '@/components/ui/Select'`), passing `label`, `options`, `value`, `onChange` (adapted to `Select`'s native `<select>` `onChange={(e) => setLocation(e.target.value)}` signature, since `Select` forwards standard `SelectHTMLAttributes`, not a custom `(value: string) => void` callback like the old `SelectField` did).
3. Recolor the property-type pill row, section divider, and "Type:" label for a light panel (inactive pill: `bg-bg-secondary text-text-secondary border-border`; active pill stays `bg-gold text-ink border-gold` — already panel-agnostic).
4. Recolor the Search button for a light panel (currently already `bg-gold hover:bg-gold-dark text-ink` — already correct/panel-agnostic, only its focus-ring offset or any white/dark-specific classes need checking).
5. Keep the outer bridge `<div className="relative bg-ink ...">` wrapper and its `-mt-16 sm:-mt-20` pull-up, and the `motion.section` entrance animation, entirely unchanged.

**Out of scope (explicitly deferred):**
- `PropertyFilters.tsx` (the `/properties` listing page's own filter UI) — Phase 6 territory, not this homepage widget.
- Any change to the search logic itself (query param construction, `router.push` destination).
- Any change to `Button.tsx`'s variant set to add a gold/accent option — noted as a recurring gap (this is the second phase to hit it) but not fixed here; a candidate for the later motion/design-system polish phase.
- Any change to `HeroSection.tsx` or the bridge wrapper's dark color.

## Design

### A. Panel treatment

Wrap the search form's inner panel in `<GlassPanel variant="strong" className="rounded-2xl overflow-hidden p-5 sm:p-6">` (GlassPanel's own base already includes `rounded-card`; the panel's existing `p-5 sm:p-6` padding and `overflow-hidden` carry over as additional className). The gold top-border accent (`absolute top-0 ... bg-gradient-to-r from-transparent via-gold/60 to-transparent`) stays — reads fine on a light panel too, a common accent-line treatment.

### B. Select migration

```
<Select
  label="Location"
  value={location}
  onChange={(e) => setLocation(e.target.value)}
  options={locations}
/>
<Select
  label="Budget"
  value={budget}
  onChange={(e) => setBudget(e.target.value)}
  options={budgets}
/>
```
`Select`'s own styling (`bg-surface border-border rounded-input focus:ring-gold`) already matches a light-panel context — no per-instance style overrides needed. The local `SelectField` function and its now-unused `ChevronDown`/`MapPin`/`IndianRupee` imports (`MapPin`/`IndianRupee` were only used inside `SelectField`'s label icon — confirm at implementation time whether either is used elsewhere in the file before removing) are deleted.

### C. Pills, divider, labels

- "Type:" label: `text-white/40` → `text-text-muted`.
- Inactive pill: `bg-white/5 text-white/60 border-white/10 hover:border-gold/40 hover:text-white` → `bg-bg-secondary text-text-secondary border-border hover:border-gold/40 hover:text-text`.
- Active pill: unchanged (`bg-gold text-ink border-gold shadow-md shadow-gold/25` already reads correctly on any surface).
- Divider: `bg-white/8` → `bg-border-subtle`.

### D. Search button

Already `bg-gold hover:bg-gold-dark text-ink` — no color change needed. Verify the `focus-visible:ring-2 focus-visible:ring-gold` still reads correctly on the new light panel background (it does; gold ring on off-white is the same treatment used site-wide).

## Testing / Verification

- `npx tsc --noEmit` and `npm run lint` must pass.
- Manual check via `npm run dev`: homepage search panel now renders as a light warm off-white glass card (not dark charcoal) floating over the dark bridge strip below the hero; Location/Budget dropdowns use the shared `Select` styling (visible label above each, not inline icon+label); property-type pills, divider, and labels all read clearly on the light panel; search still correctly navigates to `/properties` with the right query params for a few different pill/dropdown combinations.

## Non-goals / explicit exclusions

- No changes to `/properties`'s own `PropertyFilters.tsx`.
- No changes to search logic/query params.
- No `Button.tsx` variant additions.
