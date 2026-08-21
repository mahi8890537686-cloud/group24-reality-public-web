# Group24 Reality — Design System (Phase 1 of the site redesign)

## Context

The user requested a full UI/UX redesign of the Group24 Reality real-estate site (see the full 58-section brief supplied in-conversation) moving the brand from its current navy/gold/Playfair-Display look to a warm, editorial, off-white/charcoal/gold/Instrument-Serif system inspired by premium real-estate brands like Giara and Embasse.

The full redesign is too large for one spec/plan/implementation cycle. It's decomposed into ~12 phases, following the brief's own "Implementation Priority" section (§57):

1. **Design system** (this spec)
2. Header / desktop navigation
3. Mobile navigation + mobile bottom CTA bar
4. Hero
5. Property search
6. Property cards + listing page
7. Property detail page
8. Location pages (Behror / Neemrana / Kotputli)
9. Forms (inquiry / contact — consuming Phase 1's Input/Select/Textarea)
10. CTA sections / Footer
11. Motion polish pass
12. Performance / accessibility / SEO pass

Each phase gets its own brainstorm → spec → plan → implementation cycle. This document covers **Phase 1 only**.

### Existing state (as of 2026-08-08)

- Next.js 16.2.12 (pre-release — breaking changes vs. training data; `AGENTS.md` requires consulting `node_modules/next/dist/docs/` before writing implementation code), React 19, Tailwind v4, Firebase/Firestore-backed data.
- Current design tokens live in `src/app/globals.css` under `@theme`: `--color-navy-*`, `--color-gold-*`, `--color-sand-*`, `--font-playfair`, `--font-inter`, plus a small radius scale.
- Fonts loaded in `src/app/layout.tsx` via `next/font/google`: `Inter` and `Playfair_Display`.
- Shared UI primitives exist at `src/components/ui/`: `Button.tsx`, `Badge.tsx`, `SectionHeader.tsx`, `AnimatedCounter.tsx`, `MotionWrapper.tsx`. No `Input`/`Select`/`Textarea`/`GlassPanel` components exist yet — forms are hand-rolled per call site (e.g. `LeadForm.tsx`).
- Roughly 30 component files across `src/components/**` and `src/app/**` reference the old palette directly via Tailwind utility classes (`bg-gold-400`, `text-navy-950`, `bg-sand-50`, `font-playfair`, etc.), not only through the shared primitives.
- SEO/metadata/schema work was already audited and fixed in a prior session (see project memory `seo-audit-findings` / `project-nap-data`) — this phase must not touch metadata, schema, routing, or data-fetching logic, only presentation.

### Decisions confirmed with the user

- **Full palette + type swap** to the spec's exact values (not a partial/gold-only swap).
- **Full sweep now**: every existing component's old `navy-*`/`gold-*`/`sand-*`/`font-playfair` class usage gets updated to the new semantic tokens in this phase — not bridged with aliases, not deferred to later phases. This is a recolor/retype sweep only — **no structural/layout changes** to any component in this phase (structure changes happen in Phases 2-10, each against its own spec).

## Scope of Phase 1

**In scope:**
1. New semantic design tokens in `globals.css` (`@theme` block): color, font family, fluid type scale, spacing scale, radius scale, shadow scale.
2. Swap `Playfair_Display` → `Instrument Serif` in `layout.tsx`; `Inter` stays.
3. Rebuild `Button.tsx`, `Badge.tsx`, `SectionHeader.tsx` against the new tokens and spec's button/typography rules.
4. New shared primitives: `Input`, `Select`, `Textarea` (one consistent form system, spec §15/§35), `GlassPanel` (standard + strong-over-photography variants, spec §10/§54).
5. Full-sweep recolor: replace every `navy-*`/`gold-*`/`sand-*`/`font-playfair` class reference across `src/components/**` and `src/app/**` with the new semantic tokens — visual recolor/retype only, same DOM structure/layout/props.
6. Remove the old `navy-*`/`gold-*`/`sand-*` tokens from `globals.css` once the sweep is verified clean (no aliasing debt carried forward).
7. `prefers-reduced-motion` support stays intact (already present in `globals.css`; not being removed).

**Out of scope (explicitly deferred to later phases):**
- Any layout/structural change to Navbar, Footer, Hero, PropertyCard, PropertyGrid, LocationSection, Testimonials, etc. — Phase 1 only changes their colors/fonts/spacing values, not their markup structure or content.
- New page sections, new copy, new imagery.
- Filters/search/gallery/EMI-calculator/map behavior.
- Metadata, JSON-LD, sitemap, robots, or any SEO-related code.
- Firestore data shape or fetching logic.

## Design

### A. Color tokens (`globals.css` `@theme`)

| Token | Value | Purpose |
|---|---|---|
| `--color-bg` | `#F7F5F0` | primary background |
| `--color-bg-secondary` | `#EFECE5` | secondary background |
| `--color-surface` | `#FFFFFF` | pure white surface |
| `--color-ink` | `#171714` | dark section background |
| `--color-charcoal` | `#20201D` | deep charcoal (alt dark surface) |
| `--color-text` | `#171714` | primary text |
| `--color-text-secondary` | `#66645E` | secondary text |
| `--color-text-muted` | `#8A8780` | muted text |
| `--color-text-on-dark` | `#F7F5F0` | text on dark sections |
| `--color-border` | `#DDD9D0` | primary border |
| `--color-border-subtle` | `#E8E5DE` | subtle border |
| `--color-gold` | `#A88A5A` | accent (sparing use — labels, active nav, selected states, accent CTAs) |
| `--color-gold-dark` | `#80683F` | accent hover/pressed |

Target ratio (informational, guides sweep decisions where old usage is ambiguous): ~60% warm neutral bg, 20% white, 15% dark charcoal, 5% gold accent.

### B. Typography tokens

- `--font-serif`: Instrument Serif, loaded via `next/font/google` in `layout.tsx` as `--font-serif` CSS variable, replacing the `Playfair_Display` import. Used only for hero headings, section headings, and property titles (never body/UI text).
- `--font-sans`: Inter (unchanged), used for nav, buttons, forms, body, metadata, labels, footer, numbers.
- Fluid clamp-based sizes (Tailwind utility classes or `@theme` `--text-*` tokens):
  - Hero: `clamp(3rem, 7vw, 6rem)` (48–96px)
  - Hero secondary: `clamp(3rem, 5vw, 4rem)` (48–64px)
  - Section heading: `clamp(2.25rem, 5vw, 3.75rem)` (36–60px)
  - Property heading: `clamp(2.5rem, 4vw, 3.5rem)` (40–56px)
  - Subheading: `clamp(1.25rem, 1.6vw, 1.5rem)` (20–24px)
  - Body: `clamp(0.9375rem, 1.2vw, 1.125rem)` (15–18px)
  - Small body: 14–15px
  - Eyebrow/label: 11–13px, tracked uppercase

### C. Spacing scale

4/8px-based token scale: `4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 120, 160` (px), exposed as Tailwind spacing scale extensions where they don't already exist. Section padding presets: desktop 96–140px, tablet 72–96px, mobile 56–80px — applied as a reusable `Section` padding pattern (existing `Section`-equivalent usage audited during the sweep; no new layout component built in this phase beyond token availability).

### D. Radius scale

`--radius-button: 7px`, `--radius-input: 8-10px` (use 8px as the single value), `--radius-card: 10-14px` (use 12px as the single value), `--radius-image-lg: 12-16px` (use 14px), plus `--radius-none: 0` available for full-bleed imagery. Nothing pill-shaped by default.

### E. Shadow scale

- `--shadow-sm`: `0 4px 16px rgba(23,23,20,0.05)`
- `--shadow-md`: `0 12px 40px rgba(23,23,20,0.08)`
- `--shadow-lg`: `0 24px 80px rgba(23,23,20,0.10)`

### F. Component rebuilds

- **Button** (`src/components/ui/Button.tsx`): variants `primary` (bg `--color-ink`, text `--color-surface`), `secondary` (transparent/off-white bg, `1px solid var(--color-border)`, text `--color-text`), `accent` (bg `--color-gold`, used sparingly by call sites, not by default), `ghost`. Radius 7px. Heights: sm/md/lg mapped to 48-52px desktop, 48-56px mobile. Hover: background shift + optional arrow icon translate 4-8px + `translateY(-1px)`; transition 200-300ms. Same public API (`variant`, `size`, `href`/button polymorphism) so no call sites need prop changes, only visual output changes.
- **Badge** (`src/components/ui/Badge.tsx`): re-themed variants onto the new tokens (gold accent, ink/dark, bg-secondary, plus existing green/red semantic states kept as-is since they're not brand colors). Same API.
- **SectionHeader** (`src/components/ui/SectionHeader.tsx`): heading → `--font-serif`, eyebrow → `--color-gold` + tracked uppercase small label, body/subheading → `--color-text-secondary`, sizes → fluid clamp tokens from §B. Same API (`eyebrow`, `heading`, `subheading`, `align`, `light`, `headingAs`).
- **New `Input`/`Select`/`Textarea`** (`src/components/ui/`): height 52-56px, `--color-surface` bg, `1px solid var(--color-border)`, radius 8px, 16px padding, 15-16px font, visible `<label>` (not placeholder-only), focus state → border color shifts to `--color-ink` or `--color-gold`. Built now so Phase 9 (forms) and any earlier phase needing an input (e.g. Phase 5 search) can consume them without redoing token work.
- **New `GlassPanel`** (`src/components/ui/`): two variants per spec's decision rule (§54) — `standard` (`rgba(255,255,255,0.78)`, `blur(18px)`, `1px solid rgba(255,255,255,0.55)`, `--shadow-md`) and `strong` (`rgba(247,245,240,0.90)`, `blur(24px)`, `1px solid rgba(255,255,255,0.65)`) for use over photography (hero search, mobile menu, image-overlay panels in later phases). Not wired into any page yet in this phase — just the primitive.

### G. Full-sweep mechanics

1. Land tokens (A-E) and font swap in `globals.css` / `layout.tsx`.
2. Rebuild the primitives (F).
3. Grep `src/components/**` and `src/app/**` for `navy-`, `gold-` (old scale: 400/500/600), `sand-`, `font-playfair` and update each usage to the new semantic token/class — 1:1 visual recolor, no structural changes.
4. Remove the old `--color-navy-*`/`--color-gold-*`/`--color-sand-*` tokens from `globals.css` once grep confirms zero remaining references — no aliases carried forward.
5. Verify: `npm run build` (or `next lint`/typecheck) passes, then a `npm run dev` visual smoke pass across homepage, a property listing page, and a property detail page to confirm no broken/unstyled elements.

## Testing / Verification

- Static: `npm run lint` and a TypeScript build check must pass.
- Grep verification that zero `navy-`/`gold-400|500|600`/`sand-`/`font-playfair` references remain outside of the (soon-removed) token definitions themselves.
- Manual visual smoke check via dev server on homepage, `/properties`, `/properties/[slug]`, `/locations`, `/about`, `/contact` — confirm consistent recolor, no unstyled/broken elements, no layout shift beyond expected color/type changes.
- Confirm `prefers-reduced-motion` CSS block in `globals.css` is preserved untouched.

## Non-goals / explicit exclusions

- No new page sections, copy, or imagery.
- No changes to metadata, JSON-LD/schema, sitemap, robots, or Firestore data/fetching logic.
- No structural/layout changes to any existing component — that's Phases 2 onward, each against its own spec.
