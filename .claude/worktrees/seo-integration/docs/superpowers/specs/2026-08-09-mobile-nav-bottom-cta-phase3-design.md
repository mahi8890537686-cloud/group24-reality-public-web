# Group24 Reality — Mobile Navigation + Bottom CTA Bar (Phase 3 of the site redesign)

## Context

Phases 1 (design tokens) and 2 (header/desktop nav) are complete — see their specs/plans in this same directory. This is Phase 3 of the ~12-phase redesign roadmap: mobile navigation + mobile bottom CTA bar.

### Existing state

- `src/components/layout/Navbar.tsx` has a mobile hamburger button (recolored/wired to the light/dark header state in Phase 2) that opens a full-screen `AnimatePresence`/`motion.div` overlay: currently `bg-ink/98 backdrop-blur-md`, fade+vertical-stagger link reveal, large tap targets, phone link + "Schedule a Site Visit" CTA at the bottom. This overlay's *content structure and animation* were explicitly out of scope for Phase 2.
- `src/components/layout/BottomNav.tsx` is a persistent mobile-only (`lg:hidden`) bottom tab bar with 5 items (Home, Properties, Locations, Blogs, Contact), icon+label, `bg-ink/95 backdrop-blur-md`, active-state gold highlight. Recolored (not restructured) in Phase 1.
- `src/components/layout/WhatsAppFAB.tsx` is a floating round WhatsApp button, positioned above `BottomNav`.
- `src/app/contact/ContactPageContent.tsx` already has an ad-hoc, page-specific fixed mobile CTA bar (`fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 z-40 lg:hidden bg-ink border-t border-white/10 p-3`) with a single "Call" button — the only precedent in the codebase for the brief's "mobile bottom CTA bar" concept (brief §13, §23, component list §40's `MobileBottomBar`).
- `src/app/properties/[slug]/page.tsx` (property detail) has no fixed/sticky mobile CTA at all — the `LeadForm` inquiry panel is `lg:sticky` on desktop only; mobile users must scroll to find it.

### Decisions confirmed with the user

1. **Bottom-of-screen concept**: keep `BottomNav`'s 5-tab navigation on general pages (useful, working, not replaced) — restyled to the new design system, not restructured. Additionally, build a new shared `MobileBottomBar` CTA-bar component (per brief §13/§40) and wire it onto property detail pages only, where no such bar exists today. The floating `WhatsAppFAB` is dropped once its function is covered by these bars (general pages keep `BottomNav`'s existing Contact tab as the WhatsApp/contact entry point; property pages get an explicit WhatsApp button in the new bar).
2. **Mobile menu overlay treatment**: stays a dark full-screen takeover (not switched to the light glass treaty Phase 2 gave the desktop nav on scroll) — refined to the `GlassPanel` "strong" dark-glass values rather than the current flat semi-opaque color, since a bold dark takeover is a deliberate, common pattern for full-screen mobile menus independent of overall site brand.
3. **Scope discipline**: `ContactPageContent.tsx`'s existing ad-hoc bottom bar is NOT touched or refactored to use the new shared component in this phase — it already works, and revisiting it belongs to the later Forms/CTA-section phases (9/10) when that page gets its own pass.

## Scope of Phase 3

**In scope:**
1. `src/components/layout/Navbar.tsx`: refine the mobile menu overlay's background/blur to a dark strong-glass treatment. No changes to its link list, animation timing/stagger, or CTA content (those are already correct from Phases 1/2).
2. `src/components/layout/BottomNav.tsx`: restyle the bar's background/blur to match the refined dark-glass treatment (visual consistency with the mobile menu overlay). No changes to its 5 tabs, routing, or icons.
3. New `src/components/ui/MobileBottomBar.tsx`: a reusable fixed bottom action bar (1-2 buttons, icon+label), positioned above `BottomNav`, `lg:hidden`, safe-area-aware.
4. Wire `MobileBottomBar` into `src/app/properties/[slug]/page.tsx` with two actions: WhatsApp (opens WhatsApp chat, reusing the existing `buildWhatsAppLink`/site-config pattern from `WhatsAppFAB.tsx`) and "Schedule Visit" (scrolls to or opens the existing `LeadForm`). Add matching bottom page-padding so the bar never covers content, mirroring the existing pattern in `ContactPageContent.tsx`.
5. Remove `WhatsAppFAB` from `SiteShell.tsx` now that its function is covered by `BottomNav` (general pages) and the new bar (property pages) — delete the now-unused `WhatsAppFAB.tsx` import/render, leave the component file in place (reversible, matches how Phase 1 handled a similarly-deferred component).

**Out of scope (explicitly deferred):**
- `ContactPageContent.tsx`'s existing bottom bar — untouched.
- Desktop nav (`Navbar.tsx` top bar) — done in Phase 2.
- Any other page beyond property detail getting the new `MobileBottomBar`.
- Mobile menu's link list content, order, or animation — unchanged from Phases 1/2.
- Any change to `WhatsAppFAB.tsx`'s own code (file stays, just unmounted from `SiteShell`).

## Design

### A. Mobile menu overlay dark glass refinement

Replace the current `bg-ink/98 backdrop-blur-md` on the overlay `motion.div` with the Phase-1 `GlassPanel` "strong" treatment's dark equivalent: `bg-ink/95 backdrop-blur-2xl` (stronger blur, matching spec's "strong glassmorphism" guidance for full-screen mobile overlays). Border/shadow stay as currently implemented (`border-white/10`-style separators inside the menu are untouched). No other changes to this block.

### B. `BottomNav` glass restyle

Change `bg-ink/95 backdrop-blur-md` to `bg-ink/95 backdrop-blur-2xl` (same blur intensity as A, for visual consistency between the two persistent dark mobile surfaces). No structural changes — same 5 links, same icons, same active-state logic.

### C. `MobileBottomBar` component

```
MobileBottomBar({ actions }: { actions: { label: string; href: string; icon: LucideIcon; variant?: 'primary' | 'whatsapp' }[] })
```
- `fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 z-40 lg:hidden` — positioned directly above `BottomNav` (which is `~4rem`/64px tall including its own safe-area padding), matching the existing `ContactPageContent.tsx` precedent's exact positioning formula.
- `bg-ink/95 backdrop-blur-2xl border-t border-white/10 p-3 flex gap-3` — same dark-glass treatment as A/B.
- Each action renders as a flex-1 button: `whatsapp` variant gets the WhatsApp green (`bg-[#25D366]`, matching `WhatsAppFAB`'s existing brand-correct color — WhatsApp's own green is a fixed external brand color, not a Group24 token), `primary` variant gets `bg-gold text-ink`.
- Minimum 48px tap height, icon + label, matches spec §13's `[ WhatsApp ] [ Schedule Visit ]` two-button pattern for property pages.

### D. Property detail page wiring

In `src/app/properties/[slug]/page.tsx`, render `<MobileBottomBar actions={[...]} />` with:
- WhatsApp action: reuses `buildWhatsAppLink`/site-config pattern from `WhatsAppFAB.tsx`, message pre-filled with the property title/slug.
- "Schedule Visit" action: anchors to the existing `LeadForm` section (`href="#enquiry"` with a matching `id` added to that section, or an equivalent scroll target — no new form, just surfacing the existing one).

Add `pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0` (or the page's existing bottom-padding pattern, extended) to the page's mobile-only bottom spacing so the new bar never overlaps page content, exactly mirroring how `ContactPageContent.tsx` already solves this for its own bar.

### E. `WhatsAppFAB` removal from `SiteShell`

Remove the `<WhatsAppFAB />` render and its import from `src/components/layout/SiteShell.tsx`. Leave `src/components/layout/WhatsAppFAB.tsx` itself in place, unused — reversible if a future phase wants it back.

## Testing / Verification

- `npx tsc --noEmit`, `npm run lint`, `npm run build` must pass.
- Manual check via `npm run dev` at mobile widths (375px/390px/430px): mobile menu overlay opens with the darker/stronger glass blur; `BottomNav` shows the same treatment; on `/properties/[any-slug]`, the new `MobileBottomBar` appears above `BottomNav` with WhatsApp + Schedule Visit buttons, page content isn't covered by either bar, and the WhatsApp button opens a correctly pre-filled WhatsApp chat link.
- Confirm `WhatsAppFAB` no longer renders anywhere (no floating round button visible on any page).
- Confirm `/contact` is visually unchanged (its own existing bottom bar untouched).
- Confirm desktop (`lg:` and up) shows neither `BottomNav` nor `MobileBottomBar` (both `lg:hidden`), consistent with today.

## Non-goals / explicit exclusions

- No redesign of `ContactPageContent.tsx`'s existing bottom bar.
- No new pages beyond property detail getting `MobileBottomBar` in this phase.
- No changes to the mobile menu's link content/order/animation, or to any desktop nav behavior (Phase 2 territory).
- No deletion of `WhatsAppFAB.tsx`'s source file — only its usage in `SiteShell`.
