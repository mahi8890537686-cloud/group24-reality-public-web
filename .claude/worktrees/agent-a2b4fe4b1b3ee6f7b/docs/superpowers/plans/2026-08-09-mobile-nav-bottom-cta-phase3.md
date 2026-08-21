# Mobile Navigation + Bottom CTA Bar Phase 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the mobile menu overlay and `BottomNav` to a stronger dark-glass treatment, build a new reusable `MobileBottomBar` component, wire it onto property detail pages (WhatsApp + Schedule Visit, filling a real gap), and retire the floating `WhatsAppFAB` now that its job is covered, per `docs/superpowers/specs/2026-08-09-mobile-nav-bottom-cta-phase3-design.md`.

**Architecture:** Five small, mostly-independent changes. Tasks 1, 2, and 4 are one-file, few-line edits. Task 2 creates the new `MobileBottomBar` client component (self-fetches site config, mirroring the existing `WhatsAppFAB.tsx`/`ContactPageContent.tsx` pattern rather than prop-drilling Firestore data through the server-rendered property page). Task 3 wires it into `properties/[slug]/page.tsx`, reusing the exact spacer+fixed-bar layout pattern already proven in `ContactPageContent.tsx`. Task 5 verifies the whole phase.

**Tech Stack:** Next.js 16.2.12, React 19, `framer-motion`, Tailwind v4 tokens from Phase 1, `lucide-react` icons, Firestore `siteConfig` (`src/lib/firestore/siteConfig.ts`).

## Global Constraints

- `src/app/contact/ContactPageContent.tsx` is NOT touched by this plan — its existing bottom bar stays exactly as-is.
- `src/components/layout/WhatsAppFAB.tsx`'s source file is NOT deleted — only its usage in `SiteShell.tsx` is removed.
- `BottomNav.tsx`'s 5 nav tabs, routing, and icons are NOT restructured — only its background/blur classes change.
- `Navbar.tsx`'s mobile menu link list, order, and stagger animation are NOT changed — only the overlay's background/blur classes change.
- No test framework exists in this repo — verification per task is `npx tsc --noEmit`, `npm run lint`, and (for the final task) `npm run build` plus a manual dev-server check.
- Every task ends with a commit.

---

### Task 1: Dark-glass refinement — mobile menu overlay and BottomNav

**Files:**
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/layout/BottomNav.tsx`

**Interfaces:**
- No prop/behavior changes — pure class-string edits, same as Phase 1's sweep discipline.

- [ ] **Step 1: Strengthen the mobile menu overlay's glass**

In `src/components/layout/Navbar.tsx`, find the mobile menu `motion.div`'s className (currently reads, in full):
```tsx
            className="fixed inset-0 z-[55] bg-ink/98 backdrop-blur-md pt-16 pb-20 overflow-y-auto lg:hidden"
```
Change `bg-ink/98 backdrop-blur-md` to `bg-ink/95 backdrop-blur-2xl`, leaving everything else on that line unchanged:
```tsx
            className="fixed inset-0 z-[55] bg-ink/95 backdrop-blur-2xl pt-16 pb-20 overflow-y-auto lg:hidden"
```

- [ ] **Step 2: Strengthen `BottomNav`'s glass**

In `src/components/layout/BottomNav.tsx`, find the `<nav>`'s className (currently reads, in full):
```tsx
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-ink/95 backdrop-blur-md border-t border-white/10 pb-[env(safe-area-inset-bottom)]"
```
Change `backdrop-blur-md` to `backdrop-blur-2xl`, leaving everything else unchanged:
```tsx
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-ink/95 backdrop-blur-2xl border-t border-white/10 pb-[env(safe-area-inset-bottom)]"
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors.

Read both files back and confirm: no other classes, structure, links, or logic changed — only the two `backdrop-blur-md`→`backdrop-blur-2xl` (plus the `bg-ink/98`→`bg-ink/95` on the overlay) substitutions are present.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Navbar.tsx src/components/layout/BottomNav.tsx
git commit -m "Strengthen mobile menu overlay and BottomNav to a darker, stronger glass treatment"
```

---

### Task 2: New `MobileBottomBar` component

**Files:**
- Create: `src/components/ui/MobileBottomBar.tsx`

**Interfaces:**
- Produces: `MobileBottomBar({ whatsappMessage: string; scheduleHref: string; scheduleLabel?: string })` — a client component. Renders its own spacer + fixed bar (same two-piece pattern `ContactPageContent.tsx` already uses standalone), so callers just drop `<MobileBottomBar ... />` at the end of their page content with no extra wrapper needed.
- Consumes: `getSiteConfig`, `buildWhatsAppLink`, `DEFAULT_SITE_CONFIG` from `src/lib/firestore/siteConfig.ts` (same functions `WhatsAppFAB.tsx` and `ContactPageContent.tsx` already use).

- [ ] **Step 1: Write `MobileBottomBar.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, CalendarCheck } from 'lucide-react';
import { getSiteConfig, buildWhatsAppLink, DEFAULT_SITE_CONFIG } from '@/lib/firestore/siteConfig';

interface MobileBottomBarProps {
  whatsappMessage: string;
  scheduleHref: string;
  scheduleLabel?: string;
}

export function MobileBottomBar({
  whatsappMessage,
  scheduleHref,
  scheduleLabel = 'Schedule Visit',
}: MobileBottomBarProps) {
  const [waHref, setWaHref] = useState(() => buildWhatsAppLink(DEFAULT_SITE_CONFIG, whatsappMessage));

  useEffect(() => {
    getSiteConfig()
      .then((config) => setWaHref(buildWhatsAppLink(config, whatsappMessage)))
      .catch(() => { /* keep default */ });
  }, [whatsappMessage]);

  return (
    <>
      <div className="h-[calc(4rem+3.5rem+env(safe-area-inset-bottom))] lg:hidden" aria-hidden="true" />
      <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 z-40 lg:hidden bg-ink/95 backdrop-blur-2xl border-t border-white/10 p-3 flex gap-3">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-inter font-bold py-3 rounded-xl text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
        <a
          href={scheduleHref}
          className="flex-1 flex items-center justify-center gap-2 bg-gold text-ink font-inter font-bold py-3 rounded-xl text-sm"
        >
          <CalendarCheck className="w-4 h-4" />
          {scheduleLabel}
        </a>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors (the component isn't imported anywhere yet, so this only confirms it compiles standalone).

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/MobileBottomBar.tsx
git commit -m "Add shared MobileBottomBar component (WhatsApp + scheduling CTA)"
```

---

### Task 3: Wire `MobileBottomBar` into the property detail page

**Files:**
- Modify: `src/app/properties/[slug]/page.tsx`

**Interfaces:**
- Consumes: `MobileBottomBar` from Task 2 (`{ whatsappMessage, scheduleHref, scheduleLabel? }`).

- [ ] **Step 1: Import `MobileBottomBar`**

In `src/app/properties/[slug]/page.tsx`, add to the import block (after the existing `PropertyCard` import, before `StaggerContainer`):
```tsx
import { MobileBottomBar } from '@/components/ui/MobileBottomBar';
```

- [ ] **Step 2: Add an anchor id to the enquiry sidebar**

Find:
```tsx
            <aside className="space-y-6" aria-label="Property enquiry and EMI">
```
Replace with:
```tsx
            <aside id="enquiry" className="space-y-6" aria-label="Property enquiry and EMI">
```
(`html { scroll-behavior: smooth }` is already set globally in `src/app/globals.css` from Phase 1, so a plain `href="#enquiry"` anchor link scrolls to this smoothly with no additional JS needed.)

- [ ] **Step 3: Render `MobileBottomBar` at the end of the page**

Find the end of the component's returned JSX:
```tsx
          )}
        </div>
      </div>
    </>
  );
}
```
Replace with:
```tsx
          )}
        </div>
      </div>

      <MobileBottomBar
        whatsappMessage={`Hello Group24 Reality, I'm interested in ${property.title} (${property.priceLabel}). Please share more details.`}
        scheduleHref="#enquiry"
      />
    </>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors.

Read the file back and confirm: the import is present, `id="enquiry"` is on the `<aside>`, and `<MobileBottomBar ... />` is rendered once, after the main content `<div className="bg-white">...</div>` closes and before the outer `</>`.

- [ ] **Step 5: Commit**

```bash
git add "src/app/properties/[slug]/page.tsx"
git commit -m "Add MobileBottomBar (WhatsApp + Schedule Visit) to property detail pages"
```

---

### Task 4: Remove `WhatsAppFAB` from `SiteShell`

**Files:**
- Modify: `src/components/layout/SiteShell.tsx`

**Interfaces:**
- No change to `SiteShell`'s own props/exports — only its rendered children change.

- [ ] **Step 1: Remove the import and render**

In `src/components/layout/SiteShell.tsx`, remove this line from the imports:
```tsx
import WhatsAppFAB from '@/components/layout/WhatsAppFAB';
```
And remove this line from the returned JSX:
```tsx
      <WhatsAppFAB />
```
Leave `Navbar`, `Footer`, and `BottomNav` imports/renders exactly as they are. Do not delete `src/components/layout/WhatsAppFAB.tsx` itself — only remove its usage here.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors (an unused-export lint rule would only fire on unused *imports*, and this import is fully removed, so nothing should flag).

Read the file back and confirm: `WhatsAppFAB` no longer appears anywhere in `SiteShell.tsx`, and `Navbar`/`main`/`Footer`/`BottomNav`/skip-link are all still present and unchanged.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/SiteShell.tsx
git commit -m "Remove floating WhatsApp FAB now that BottomNav and MobileBottomBar cover its function"
```

---

### Task 5: Build verification and manual smoke check

**Files:**
- No modifications expected — this task verifies Tasks 1-4.

**Interfaces:**
- Consumes: the complete Phase 3 codebase from Tasks 1-4.

- [ ] **Step 1: Full build check**

Run: `npx tsc --noEmit`, `npm run lint`, `npm run build`.
Expected: all three succeed with no errors.

- [ ] **Step 2: Manual smoke check**

Run `npm run dev`, then in a browser at a mobile viewport width (375-430px) or via the `claude-in-chrome` tools if available:
- Load `/`: confirm no floating round WhatsApp button appears anywhere on the page.
- Confirm `BottomNav`'s 5 tabs (Home, Properties, Locations, Blogs, Contact) still work and show the darker/stronger blur.
- Tap the hamburger menu: confirm it opens with the darker/stronger dark-glass blur, same link list and CTA as before, still closes correctly.
- Load `/properties/[any real slug]`: confirm a new fixed bar appears above `BottomNav` with `[WhatsApp]` (green) and `[Schedule Visit]` (gold) buttons; confirm page content (especially the `LeadForm`/EMI sidebar area) is not covered by either bar; tapping "Schedule Visit" smooth-scrolls to the enquiry/LeadForm section; tapping WhatsApp opens a WhatsApp chat link pre-filled with the property's title and price.
- Load `/contact`: confirm it looks and behaves exactly as before (its own existing bottom bar, untouched by this plan).
- Resize to desktop width (≥1024px): confirm neither `BottomNav` nor the new property-page bar render (both `lg:hidden`), consistent with pre-Phase-3 behavior.

- [ ] **Step 3: Commit (only if Step 1 or Step 2 surfaced a fix)**

If verification is clean, no commit needed for this task.

---

## Definition of Done

- Mobile menu overlay and `BottomNav` both use `bg-ink/95 backdrop-blur-2xl` (stronger, darker glass than before); no other change to their content/structure.
- `MobileBottomBar` exists as a reusable component in `src/components/ui/`, used on property detail pages with WhatsApp + Schedule Visit actions.
- `WhatsAppFAB` no longer renders anywhere on the site (source file untouched, just unmounted from `SiteShell`).
- `ContactPageContent.tsx` is byte-identical to its pre-Phase-3 state.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass.
- Manual smoke check across `/`, `/properties/[slug]`, `/contact`, and desktop width all confirm the expected behavior above.
