# Group24 Reality — Header / Desktop Navigation (Phase 2 of the site redesign)

## Context

Phase 1 (design tokens + full recolor sweep) is complete — see `docs/superpowers/specs/2026-08-08-design-system-phase1-design.md` and its implementation plan. This is Phase 2 of the ~12-phase redesign roadmap established there: Header / desktop navigation.

### Existing state

`src/components/layout/Navbar.tsx` is a single client component handling both the desktop top bar and the mobile hamburger menu overlay. It already uses Phase 1's design tokens (recolored, not restructured, in Task 9 of Phase 1). Current behavior:
- Links: Home, Properties, Locations, Blogs, About Us, Contact.
- CTA: "Enquire Now" → `/contact`.
- Logo: text placeholder — small gold box with "G24R", plus stacked "Group 24" / "Reality" text (no image asset exists).
- Scroll behavior: transparent (light text) at the top of the homepage hero; on scroll, or immediately on any non-hero page, becomes a **dark** solid bar (`bg-ink/98`) via a CSS class toggle with a `transition-all duration-300`.

### Decisions confirmed with the user

1. **Nav content** adopts the original design brief's structure: drop the separate "Home" link (logo serves as home), rename the "Blogs" nav *label* to "Insights" (route stays `/blogs`, no content/URL change), and rename the CTA from "Enquire Now" to "Schedule a Site Visit" (same destination, `/contact`).
2. **Scroll/glass transition direction reverses** from the current dark-on-scroll behavior to match the brief: transparent + light text at the top of the hero, transitioning to a **light** off-white glass surface (dark text) on scroll and on all non-hero pages.
3. **No real logo image exists yet** — keep and refine the text-based wordmark rather than waiting on an asset.
4. **Scope boundary:** this phase only touches the top bar shell — logo, desktop link list, desktop CTA, phone link, the scroll/glass transition mechanism, and the mobile hamburger *button*. The mobile menu **overlay** (the dropdown panel content, its animation, and the mobile bottom CTA bar) is out of scope — that's Phase 3 ("Mobile navigation + mobile bottom CTA bar") per the roadmap, and gets its own spec.

## Scope of Phase 2

**In scope (`src/components/layout/Navbar.tsx` only):**
1. Update `navLinks` array to the 5-item Properties/Locations/About/Insights/Contact structure; remove the "Home" entry.
2. Change desktop CTA label to "Schedule a Site Visit" (same `href="/contact"`).
3. Rebuild the scroll-driven surface transition using Framer Motion (`motion.header` with an `animate` prop driving real `backgroundColor`/`borderColor`/`boxShadow` values), replacing the current CSS-class-toggle approach:
   - Unscrolled + on `/` only: `backgroundColor: transparent`, no border/shadow, light text (`text-white`/`text-white/80`), gold accent for the active link.
   - Scrolled, or any non-`/` page: `backgroundColor: rgba(255,255,255,0.90)`, `backdrop-blur-xl`, `border-color` → the `--color-border` token, `box-shadow` → the Phase-1 `shadow-sm` token value — mirroring the `GlassPanel` "standard" variant from Phase 1. Text switches to `text-ink` (links) / `text-text-secondary` (phone link), gold stays the active-link accent in both states.
   - Transition duration ~300ms, eased — driven by Framer Motion's `animate` prop, not a Tailwind class toggle.
4. Logo wordmark: swap its text color with the header state (white on dark/transparent, ink on light) instead of staying white always; keep the small gold monogram box and stacked serif "Group 24 / Reality" text structure as-is.
5. Mobile hamburger button: recolor its icon to follow the same light/dark state switch as the rest of the bar (its function and the overlay it opens are unchanged — Phase 3 scope).

**Out of scope (explicitly deferred):**
- Mobile menu overlay redesign (panel background, animation, link sizing, glass treatment) — Phase 3.
- Mobile bottom CTA bar (`WhatsApp`/`Call`/`Site Visit` fixed bar) — Phase 3.
- Any change to routing, page content, metadata, or business data.
- The homepage `TrustIndicators` removal and `SearchBar` spacing fix requested separately in this same session are unrelated ad-hoc fixes, already applied directly (not part of this phase's plan).

## Design

### A. Nav content

```
navLinks = [
  { href: '/properties', label: 'Properties' },
  { href: '/locations',  label: 'Locations' },
  { href: '/about',      label: 'About' },
  { href: '/blogs',      label: 'Insights' },
  { href: '/contact',    label: 'Contact' },
]
```
CTA button text: `Schedule a Site Visit`, `href="/contact"` (unchanged destination).

### B. Scroll/glass transition mechanism

Replace the current `isScrolled || !isHeroPage` boolean class-toggle with a Framer Motion `animate` prop on the `<motion.header>` wrapper, driving real style values (not Tailwind classes) so the transition is genuinely interpolated:

- `backgroundColor`: `'rgba(23,23,20,0)'` (transparent, using the ink token's channels at 0 alpha) when `!isScrolled && isHeroPage`, else `'rgba(255,255,255,0.90)'`.
- `borderColor`: `'rgba(255,255,255,0.05)'` (current subtle dark-mode border) when transparent, else the `--color-border` token's hex (`#DDD9D0`) at full opacity.
- `boxShadow`: `'none'` when transparent, else the Phase-1 `--shadow-sm` value (`0 4px 16px rgba(23,23,20,0.05)`).
- `backdropFilter`: toggled via a conditional class (`backdrop-blur-md` vs none) since Framer Motion doesn't animate `backdrop-filter` smoothly across browsers — an instant switch at the same breakpoint as the color transition is acceptable (spec doesn't require the blur itself to animate, only "smooth transition into" the bar, which the color/shadow interpolation delivers).
- `transition={{ duration: 0.3, ease: 'easeOut' }}`.

Text/link colors switch via a conditional Tailwind class bound to the same `isScrolled || !isHeroPage` boolean already in the component (no need to animate text color through Framer Motion — an instant or CSS-transitioned color swap alongside the animated background reads as one cohesive transition).

### C. Logo

Keep the existing two-part structure (gold monogram box + stacked serif wordmark), but the wordmark text color becomes conditional on header state: `text-white` (transparent/dark) → `text-ink` (light/scrolled), with the "Reality" sub-label staying `text-gold` in both states (gold already has sufficient contrast on both white and dark surfaces per Phase 1's token design).

### D. Desktop CTA & phone link

No visual redesign beyond what Phase 1 already applied (gold-filled button, ink text) — only the label change (C above) and ensuring the phone link's text color follows the same light/dark state switch as the nav links.

## Testing / Verification

- `npx tsc --noEmit` and `npm run lint` must pass.
- Manual check via `npm run dev`: homepage hero shows transparent nav with light text; scrolling past the hero (or loading any other page) transitions smoothly to the light glass bar with dark text within ~300ms; active-link gold highlight remains visible and legible in both states; mobile hamburger icon remains visible/legible in both states (its click behavior and the overlay it opens are unchanged from before this phase).
- Confirm `/blogs` route itself is untouched — only the nav label reads "Insights", the page and URL stay `/blogs`.

## Non-goals / explicit exclusions

- No changes to the mobile menu overlay's content, layout, or animation (Phase 3).
- No changes to `Footer.tsx`, `BottomNav.tsx`, or `SiteShell.tsx`.
- No new logo image asset — text wordmark only, revisit if/when a real logo file is provided.
