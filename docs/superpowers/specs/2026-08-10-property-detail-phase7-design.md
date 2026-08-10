# Group24 Reality — Property Detail Page (Phase 7 of the site redesign)

## Context

Phases 1–6 (design tokens, header/desktop nav, mobile nav/bottom CTA, hero, property search, property cards + listing page) are complete. This is Phase 7 of the ~12-phase redesign roadmap: the `/properties/[slug]` property detail page.

### Existing state

- `src/app/properties/[slug]/page.tsx` — functional Server Component: fetches property + related listings, renders JSON-LD, breadcrumb, 2+1 grid (gallery/overview/amenities/map | sticky LeadForm + EMI), related properties, and `MobileBottomBar` (wired in Phase 3). Uses a standalone `pt-20` nav spacer and an all-white content shell.
- `src/components/property-detail/PropertyOverview.tsx` — renders badges, `<h1>` title, address, price, specs grid, and description in one block inside the white main column.
- `src/components/property-detail/ImageGallery.tsx` — carousel, thumbnails, lightbox, 360° tour button. Token-correct from Phase 1; lightbox `AnimatePresence` child lacks a `key` (exit animation may not run — same class of bug fixed in Phase 6's filter drawer).
- `LeadForm.tsx`, `EMICalculator.tsx`, `AmenitiesList.tsx`, `LocationMap.tsx`, `VirtualTour360Modal.tsx` — token-swept in Phase 1, behavior unchanged since. `LeadForm` still uses hand-rolled inputs (Phase 9 forms scope).
- `/properties` listing page (Phase 6 neighbor) already uses the editorial pattern this page lacks: a dark `bg-ink pt-28` hero band with `SectionHeader`, then a white content section below.

### Design decisions (made autonomously per user instruction — proceed with recommended choices, no approval gate)

1. **Add a dark editorial header band to the property detail page**, mirroring the listing page's `bg-ink` hero treatment — the primary structural gap vs. the rest of the redesigned site. Breadcrumb, type/status/RERA badges, title, address, and price move into this band; the white content area below focuses on gallery + details.
2. **Extract a new `PropertyDetailHeader` server component** (`src/components/property-detail/PropertyDetailHeader.tsx`) for the header band — keeps `[slug]/page.tsx` readable and isolates the badge/title/price markup moved out of `PropertyOverview`.
3. **Slim `PropertyOverview` to specs grid + description only** — removes the duplicated title/price/badges block now owned by the header. No logic changes to specs or copy.
4. **Fix `ImageGallery` lightbox `AnimatePresence` key** — add `key="gallery-lightbox"` on the lightbox `motion.div` while touching this area's page structure (same one-line fix pattern as Phase 6's bottom sheet).
5. **Leave `LeadForm`, `EMICalculator`, sidebar sticky behavior, `MobileBottomBar`, metadata/JSON-LD, and gallery placement inside the main column untouched** — forms migrate in Phase 9; mobile CTA bar was Phase 3; no full-bleed gallery restructure (YAGNI — one real gap to close).

## Scope of Phase 7

**In scope:**
1. New `PropertyDetailHeader.tsx`: dark `bg-ink pt-28 pb-8` band with light-styled breadcrumb, badges, `<h1>` title, address line, price + price-per-unit.
2. `PropertyOverview.tsx`: delete the title/badges/price/address block; keep specs grid + "About This Property" description.
3. `src/app/properties/[slug]/page.tsx`: replace `pt-20` + all-white shell with header band → white content section (existing grid, related properties, `MobileBottomBar` unchanged).
4. `ImageGallery.tsx`: add `key` on lightbox `motion.div` under `AnimatePresence`.

**Out of scope (explicitly deferred):**
- `LeadForm.tsx` / contact forms → Phase 9 (shared `Input`/`Textarea` migration).
- `EMICalculator.tsx`, `AmenitiesList.tsx`, `LocationMap.tsx`, `VirtualTour360Modal.tsx` — no changes unless a compile error forces it.
- Full-bleed edge-to-edge gallery, new drawer/modal primitives, filter/search behavior.
- Metadata, JSON-LD, Firestore fetching, or `MobileBottomBar` changes.

## Design

### A. Page shell (`[slug]/page.tsx`)

Replace:
```
<div className="pt-20" />
<div className="bg-white">
  <div className="container ... py-10">
    <nav breadcrumb>...</nav>
    <div className="grid ...">
```

With:
```
<PropertyDetailHeader property={property} />
<div className="bg-white py-10">
  <div className="container ...">
    <div className="grid ...">  <!-- unchanged grid internals -->
```

`MobileBottomBar`, related-properties section, JSON-LD blocks, and `#enquiry` aside id stay as-is.

### B. `PropertyDetailHeader`

Server component, props: `{ property: Property }`.

Structure inside `bg-ink pt-28 pb-8`:
- Container with breadcrumb (`Home / Properties / {title}`) using light link colors (`text-white/50 hover:text-gold`, current page `text-text-on-dark`).
- Badge row: type (`Badge variant="navy"` → reads as ink-on-surface; on dark bg use existing variants that work — type badge stays `navy` which is `bg-ink text-surface`; on ink background switch type badge to `gold` or `sand` for contrast). **Decision:** use `gold` for type, keep status/RERA variants as today (green/red/gold/sand all have light backgrounds — readable on dark).
- `<h1>`: `font-serif text-text-on-dark text-2xl sm:text-3xl lg:text-4xl`.
- Address: `text-text-on-dark/70` with `MapPin` icon in `text-gold`.
- Price row: `font-serif text-text-on-dark text-3xl sm:text-4xl` + optional `pricePerUnit` in `text-text-on-dark/60`.

### C. `PropertyOverview` slim-down

Remove lines 34–65 (title + badges + price block). Component opens directly with the specs grid. Imports `Badge`, `FileCheck`, `capitalise` become unused — remove them.

### D. `ImageGallery` AnimatePresence key

On the lightbox `motion.div` (the `fixed inset-0 z-[60]` overlay), add `key="gallery-lightbox"`.

## Testing / Verification

- `npx tsc --noEmit`, `npm run lint`, and `npm run build` must pass.
- Manual check via `npm run dev`: `/properties/[slug]` shows a dark header band with breadcrumb/title/price above the white gallery+content area; no duplicate title/price in the overview section; desktop sticky sidebar and mobile `MobileBottomBar` still work; gallery lightbox still opens/closes.

## Non-goals / explicit exclusions

- No `LeadForm` / shared form primitive migration.
- No changes to related-properties query, SEO metadata, or `MobileBottomBar`.
- No full-bleed gallery or new shared layout primitives.
