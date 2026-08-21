# Group24 Reality — Hero (Phase 4 of the site redesign)

## Context

Phases 1-3 (design tokens, header/desktop nav, mobile nav/bottom CTA) are complete — see their specs/plans in this same directory. This is Phase 4 of the ~12-phase redesign roadmap: the homepage hero.

### Existing state

`src/components/home/HeroSection.tsx` is already well-built: a `min-h-screen` (100vh) section over `AnimatedHeroBackground.tsx` (a 4-image cross-fading Ken Burns background, self-hosted, reduced-motion aware — untouched by this phase), with a staggered Framer Motion entrance (trust-badge pill → H1 → subheading → location pills → 3 CTA buttons → stats row → scroll indicator). Headline/subheading/location pills already carry real, location-specific SEO copy (Behror/Neemrana/Kotputli), not placeholder text.

### Decisions confirmed with the user

1. **CTAs simplified from 3 to 2**: drop "Call Now" and "WhatsApp" (redundant now that `BottomNav`/`MobileBottomBar`/nav CTA from Phases 2-3 already give one-tap contact access) — keep "Explore Properties" (primary) and add "Schedule a Site Visit" (secondary), matching the brief's CTA-discipline guidance (§50: one primary action per section, not competing CTAs) and reusing the CTA label already established in the Phase 2 nav.
2. **Height reduced** from full-height (`min-h-screen`, ~100vh) to the brief's specified range: `min-h-[85vh] lg:min-h-[90vh]`, so the search card below peeks into view and hints at more content.
3. **New eyebrow label** ("GROUP24 REALITY", small gold tracked-uppercase) added above the existing trust-badge pill — both kept, serving different jobs (brand mark vs. trust signal).
4. **Real content preserved**: headline, subheading, and location pills copy is NOT replaced with the brief's generic placeholder text — it's real, location-specific SEO copy already in place.

## Scope of Phase 4

**In scope (`src/components/home/HeroSection.tsx` only):**
1. Change the section's height classes from `min-h-screen` to `min-h-[85vh] lg:min-h-[90vh]`.
2. Add a new eyebrow `motion.div`/`motion.p` ("GROUP24 REALITY") as the first element in the stagger sequence, before the existing trust-badge pill, using the same small tracked-uppercase gold-label pattern `SectionHeader.tsx` already uses elsewhere on the site.
3. Remove the "Call Now" `<a>` and "WhatsApp" `<a>` (with its inline SVG) from the CTA `motion.div`.
4. Add a "Schedule a Site Visit" `<a href="/contact">` in their place, styled with the same outline-on-dark treatment the removed "Call Now" button used (`bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white`), so the CTA row still reads as primary (gold) + secondary (outline) — two buttons total.

**Out of scope (explicitly deferred):**
- `AnimatedHeroBackground.tsx` — untouched, already solid.
- `SearchBar.tsx` (the glass search card directly below the hero) — Phase 5 (Property search) territory.
- Headline/subheading/location-pills copy — unchanged, already real and SEO-appropriate.
- Stats row, scroll indicator — unchanged.
- No migration to the shared `Button` component — its current variant set (`primary`/`secondary`/`outline`/`ghost`) doesn't include a "gold-filled on dark hero" variant, and retrofitting that is a separate architectural decision, not needed just to change CTA count/copy. Hero's CTAs stay hand-styled, matching their existing token classes.

## Design

### A. Height

Replace `min-h-screen` with `min-h-[85vh] lg:min-h-[90vh]` on the `<section>` element. `AnimatedHeroBackground`'s `absolute inset-0` fills whatever height the parent section resolves to, so no change needed there. The scroll indicator (`absolute bottom-8`) and all other absolutely-positioned children continue to work unchanged since they're relative to the section, not the viewport.

### B. Eyebrow label

New first element in the stagger sequence (delay 0, before the existing trust-badge pill's delay):
```
<motion.p className="text-gold text-xs font-inter font-semibold tracking-widest uppercase mb-4">
  Group24 Reality
</motion.p>
```
Fade/slide-up entrance matching the existing pattern used by the other staggered elements (`initial={{ opacity: 0, y: -20 }}` / `animate={{ opacity: 1, y: 0 }}`, short duration, delay 0 so it's the first thing to appear).

### C. CTA row simplified

Remove the "Call Now" (`href={PHONE_HREF}`) and "WhatsApp" (`href={whatsappLink(...)}`, with its inline SVG icon) anchors from the CTA `motion.div`. Add:
```
<Link
  href="/contact"
  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-inter font-semibold px-7 py-4 rounded-xl transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white text-sm sm:text-base"
>
  Schedule a Site Visit
</Link>
```
(Reuses the exact className the removed "Call Now" button had — same visual treatment, just repurposed for the new CTA and pointing at `/contact` instead of `tel:`.) The `PHONE_HREF`/`whatsappLink` imports become unused after this change and should be removed from the import statement if nothing else in the file uses them (verify at implementation time — `whatsappLink` is imported specifically for the removed WhatsApp button; `PHONE_HREF` for the removed Call button).

## Testing / Verification

- `npx tsc --noEmit` and `npm run lint` must pass (in particular, confirm no unused-import lint warnings from removing the Call/WhatsApp buttons).
- Manual check via `npm run dev`: homepage hero is visibly shorter than before (search card partially visible below the fold on both mobile and desktop viewport heights), new gold "GROUP24 REALITY" eyebrow appears above the trust badge in the entrance stagger, exactly two CTA buttons render ("Explore Properties" gold-filled, "Schedule a Site Visit" outline), both link correctly (`/properties`, `/contact`), reduced-motion users still see the section correctly (no broken layout from the removed animations).

## Non-goals / explicit exclusions

- No changes to `AnimatedHeroBackground.tsx`, `SearchBar.tsx`, or any other homepage section.
- No headline/subheading copy changes.
- No `Button` component migration for hero CTAs.
