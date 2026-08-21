# Header / Desktop Navigation Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update `Navbar.tsx`'s nav content to the brief's structure and replace its scroll-state class-toggle with a Framer Motion-driven transition into a light glass surface, per `docs/superpowers/specs/2026-08-09-header-desktop-nav-phase2-design.md`.

**Architecture:** Single-file change to `src/components/layout/Navbar.tsx`. Task 1 handles the content/label changes (mechanical). Task 2 rebuilds the scroll transition mechanism and the light/dark color-state wiring for every element that currently hardcodes light-surface (`text-white`) colors. Task 3 is build/lint/manual verification. The mobile menu overlay JSX is untouched throughout (Phase 3 scope) except for one hamburger-icon color-state change in Task 2.

**Tech Stack:** Next.js 16.2.12, React 19, `framer-motion` (already a dependency), Tailwind v4 tokens from Phase 1 (`ink`, `bg`, `gold`, `text`, `text-secondary`, `border`).

## Global Constraints

- Only `src/components/layout/Navbar.tsx` is touched by this plan. No other file.
- The mobile menu **overlay** (the `AnimatePresence`/`motion.div` block starting at the current line 125, `{/* Mobile Menu */}`) is out of scope — do not restyle its background, links, or animation. The only permitted touch inside that block is the hamburger *button*'s icon color (in the top bar, not the overlay itself).
- No test framework exists in this repo — verification is `npx tsc --noEmit`, `npm run lint`, and a manual `npm run dev` check.
- Every task ends with a commit.

---

### Task 1: Update nav content and CTA label

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

**Interfaces:**
- Produces: updated `navLinks` array (still `{ href: string; label: string }[]`, same shape, consumed by both the desktop `<nav>` map and the mobile menu `<nav>` map further down the same file — no signature change, so the mobile menu block keeps working unmodified).

- [ ] **Step 1: Replace the `navLinks` array**

Replace lines 10-17:
```tsx
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/locations', label: 'Locations' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];
```
with:
```tsx
const navLinks = [
  { href: '/properties', label: 'Properties' },
  { href: '/locations', label: 'Locations' },
  { href: '/about', label: 'About' },
  { href: '/blogs', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
];
```

- [ ] **Step 2: Update the desktop CTA label**

After Step 1's edit, the `navLinks` array is one line shorter than the original file, shifting every subsequent line down by 1 — line numbers below account for this. Find the desktop CTA `<Link href="/contact" ...>Enquire Now</Link>` (originally line 107, now line 106) and change its text content to `Schedule a Site Visit`. Do not change the `href` or any className on that `<Link>`. Locate it by searching for the literal text `Enquire Now` if the line number doesn't match exactly — there are two occurrences in the file (desktop CTA and mobile CTA, handled in Step 3), this is the first one, inside the `{/* Desktop CTA */}` block.

- [ ] **Step 3: Update the mobile menu CTA label to match**

The mobile menu block (out of scope for restyling) has its own separate `<Link href="/contact" ...>Enquire Now</Link>` (originally line 170, now line 169 after Step 1's shift). Change only its text content to `Schedule a Site Visit` too, for copy consistency with the desktop CTA — this is a copy-only change, not a restyle, so it stays within this task's "content" scope even though the surrounding block is otherwise Phase 3's. This is the second (last) `Enquire Now` occurrence in the file.

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors.

Read the file back and confirm: `navLinks` has exactly 5 entries in the order Properties/Locations/About/Insights/Contact, no `Home` entry remains, both CTA `<Link>` elements (desktop and mobile) now read "Schedule a Site Visit".

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "Update Navbar nav links to Properties/Locations/About/Insights/Contact and CTA to Schedule a Site Visit"
```

---

### Task 2: Framer Motion scroll transition + light/dark color-state wiring

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

**Interfaces:**
- Consumes: `navLinks` from Task 1 (unchanged shape). `motion`/`AnimatePresence` already imported from `framer-motion` at the top of the file (line 6) — no new import needed for `motion.header`, it uses the same `motion` import.
- Produces: a `motion.header` replacing the current plain `<header>`, and a set of conditional Tailwind classes (bound to the existing `isScrolled || !isHeroPage` boolean, computed inline where needed since no new state variable is introduced) applied to: the logo wordmark text, the desktop nav links, the phone link, and the hamburger button icon.

- [ ] **Step 1: Replace the `<header>` opening tag and its background/border/shadow classes with a `motion.header`**

Line numbers below are from the ORIGINAL (pre-Phase-2) file. Since Task 1 already shrank the file by 1 line (the `navLinks` array), every line number in this task is 1 lower in the file you're actually editing (e.g. "lines 41-48" below is really "lines 40-47" after Task 1's edit). Locate each block by its literal code content — shown in full below — rather than trusting the line number alone if they don't line up exactly.

Replace (originally lines 41-48, now 40-47):
```tsx
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled || !isHeroPage
            ? 'bg-ink/98 backdrop-blur-md shadow-lg shadow-black/25 border-b border-white/5'
            : 'bg-transparent'
        )}
      >
```
with:
```tsx
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 border-b',
          isScrolled || !isHeroPage ? 'backdrop-blur-xl' : ''
        )}
        animate={{
          backgroundColor: isScrolled || !isHeroPage ? 'rgba(255,255,255,0.90)' : 'rgba(23,23,20,0)',
          borderColor: isScrolled || !isHeroPage ? '#DDD9D0' : 'rgba(255,255,255,0.05)',
          boxShadow: isScrolled || !isHeroPage ? '0 4px 16px rgba(23,23,20,0.05)' : 'none',
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
```

- [ ] **Step 2: Close the `motion.header` tag**

Find the closing `</header>` tag (currently line 122, immediately before the `{/* Mobile Menu */}` comment) and change it to `</motion.header>`.

- [ ] **Step 3: Wire the logo wordmark's text color to the same state**

Replace lines 64-71:
```tsx
                <div className="hidden sm:block">
                  <span className="text-white font-serif text-lg leading-none tracking-tight">
                    Group 24
                  </span>
                  <span className="block text-gold text-xs font-inter tracking-widest uppercase leading-none">
                    Reality
                  </span>
                </div>
```
with:
```tsx
                <div className="hidden sm:block">
                  <span
                    className={cn(
                      'font-serif text-lg leading-none tracking-tight transition-colors duration-300',
                      isScrolled || !isHeroPage ? 'text-ink' : 'text-white'
                    )}
                  >
                    Group 24
                  </span>
                  <span className="block text-gold text-xs font-inter tracking-widest uppercase leading-none">
                    Reality
                  </span>
                </div>
```

- [ ] **Step 4: Wire the desktop nav links' text color to the same state**

Replace lines 81-86:
```tsx
                  className={cn(
                    'px-4 py-2 rounded-md text-sm font-inter font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                    pathname === link.href
                      ? 'text-gold bg-white/5'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  )}
```
with:
```tsx
                  className={cn(
                    'px-4 py-2 rounded-md text-sm font-inter font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                    pathname === link.href
                      ? 'text-gold'
                      : isScrolled || !isHeroPage
                        ? 'text-text-secondary hover:text-ink hover:bg-bg-secondary'
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                  )}
```

- [ ] **Step 5: Wire the phone link's text color to the same state**

Replace line 97:
```tsx
                className="flex items-center gap-2 text-white/80 hover:text-gold transition-colors text-sm font-inter focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-md px-2 py-1"
```
with:
```tsx
                className={cn(
                  'flex items-center gap-2 hover:text-gold transition-colors text-sm font-inter focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-md px-2 py-1',
                  isScrolled || !isHeroPage ? 'text-text-secondary' : 'text-white/80'
                )}
```
(Note: this changes the phone `<a>` tag's `className` prop from a plain string to a `cn(...)` call — `cn` is already imported at the top of the file.)

- [ ] **Step 6: Wire the hamburger button icon's color to the same state**

Replace line 113:
```tsx
              className="lg:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
```
with:
```tsx
              className={cn(
                'lg:hidden p-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                isScrolled || !isHeroPage ? 'text-ink hover:bg-bg-secondary' : 'text-white hover:bg-white/10'
              )}
```
(Same note as Step 5 — this button's `className` becomes a `cn(...)` call.)

- [ ] **Step 7: Verify**

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors — in particular, confirm `motion.header`/`</motion.header>` tags match (no stray `<header>`/`</header>` left over), and that every edited element still compiles as valid JSX.

Read the file back in full and confirm: no remaining hardcoded `text-white` (outside the mobile-menu-overlay block, which stays untouched) on the logo, nav links, phone link, or hamburger button — every one of those four elements' text color now depends on `isScrolled || !isHeroPage`.

- [ ] **Step 8: Commit**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "Rebuild Navbar scroll transition with Framer Motion, reversing to a light glass surface per the redesign brief"
```

---

### Task 3: Build verification and manual smoke check

**Files:**
- No modifications expected — this task verifies Tasks 1-2.

**Interfaces:**
- Consumes: the complete Task 1 + Task 2 `Navbar.tsx`.

- [ ] **Step 1: Full build check**

Run: `npx tsc --noEmit`, `npm run lint`, `npm run build`.
Expected: all three succeed with no errors.

- [ ] **Step 2: Manual smoke check**

Run `npm run dev`, then in a browser (or via the `claude-in-chrome` tools if available):
- Load `/`: confirm the nav is transparent with light (white) text and logo over the hero image.
- Scroll down past the hero: confirm the nav smoothly transitions (~300ms) to a light off-white glass bar with dark (ink) text, gold active-link highlight still visible, over roughly 300ms — not an instant jump.
- Load `/properties` (or any non-homepage route): confirm the nav renders immediately in the light glass state (no transparent flash).
- Confirm the active-link gold highlight is legible in both states.
- Confirm the "Schedule a Site Visit" CTA button is visible and correctly styled in both states.
- Confirm the mobile hamburger icon (resize viewport or use device toolbar) is visible/legible in both nav states, and clicking it still opens the existing mobile menu overlay (unrestyled, as expected — Phase 3 scope).
- Confirm hovering desktop nav links shows a visible hover state in both the transparent and light-glass modes.

- [ ] **Step 3: Commit (only if Step 1 or Step 2 surfaced a fix)**

If verification is clean, no commit needed for this task.

---

## Definition of Done

- `navLinks` is the 5-item Properties/Locations/About/Insights/Contact list; CTA reads "Schedule a Site Visit" in both desktop and mobile menu.
- The nav's background/border/shadow transition is driven by Framer Motion (`motion.header` + `animate`), not a CSS class toggle.
- Transparent + light text only at the top of the homepage hero; light glass surface + dark text everywhere else (scrolled homepage, or any other route).
- Logo, nav links, phone link, and hamburger icon all switch color correctly with the header state.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass.
- Mobile menu overlay content/behavior is unchanged from before this phase.
