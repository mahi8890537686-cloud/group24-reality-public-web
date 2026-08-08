# Design System Phase 1 (Group24 Reality Redesign) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the site's navy/gold/Playfair-Display brand with the new warm off-white/charcoal/gold/Instrument-Serif editorial system across every existing component — tokens + core primitives + a full 1:1 recolor sweep — with zero structural/layout changes.

**Architecture:** New semantic CSS custom properties land in `src/app/globals.css` under Tailwind v4's `@theme` block (auto-generates `bg-*`/`text-*`/`border-*` utilities from `--color-*` names). `Instrument Serif` replaces `Playfair Display` in `src/app/layout.tsx`. Five shared primitives in `src/components/ui/` get rebuilt/created (`Button`, `Badge`, `SectionHeader`, plus new `Input`/`Select`/`Textarea`/`GlassPanel`). Then every one of the 37 remaining files that reference the old palette directly gets swept: each old class token is replaced 1:1 via the Token Migration Map below — same JSX structure, same props, same logic, only the class strings change.

**Tech Stack:** Next.js 16.2.12 (pre-release — breaking changes vs. training data, consult `node_modules/next/dist/docs/` before touching `layout.tsx`/font loading), React 19, Tailwind CSS v4 (`@theme` token system), TypeScript, `clsx`/`tailwind-merge` (`cn()` in `src/lib/utils.ts`).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-08-design-system-phase1-design.md`.
- **No structural/layout changes** in this phase — only `className` color/font/radius/shadow token swaps. Do not touch JSX structure, props, component logic, data fetching, or copy.
- **No changes** to metadata, JSON-LD/schema, sitemap, robots, or Firestore data/fetching logic in any touched file.
- `AGENTS.md` requires reading the relevant guide under `node_modules/next/dist/docs/` before writing implementation code, since this Next.js version has breaking changes vs. training data — Task 2 (font loading) must read `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` first.
- No test framework exists in this repo (`package.json` has no test script/deps) — verification per task is: `npx tsc --noEmit` (typecheck), `npm run lint` (ESLint), and a Grep-tool check that the task's target files contain zero remaining old-token matches.
- Every task ends with a commit.

## Token Migration Map

Apply this table to every `navy-`, `gold-` (400/500/600/700/50), `sand-`, and `font-playfair` class token found. This is the only source of truth for the sweep tasks — do not invent new mappings.

| Old class fragment | New class fragment | Notes |
|---|---|---|
| `navy-950` | `ink` | darkest surface / primary text on light bg (both `bg-navy-950` and `text-navy-950`) |
| `navy-900` | `charcoal` | secondary dark surface (panels, gradient stops, hover-darken of ink) |
| `navy-800` **as text** (`text-navy-800`, `iconColor: 'text-navy-800'`) | `text-secondary` | secondary/tag text role |
| `navy-800` **as bg/gradient** (`bg-navy-800`, `from-navy-800`) | `ink` | decorative bg role |
| `navy-700` (`text-navy-700/50`) | `text-secondary` (keep the `/50` opacity suffix) | only occurrence: muted search-icon color |
| `navy-100` (`bg-navy-100`) | `bg-secondary` | light icon-chip background |
| `navy-50`, `navy-200` | — | unused anywhere outside `globals.css` token defs; just delete the definitions, no sweep needed |
| `gold-400` | `gold` | keep any `/NN` opacity suffix as-is (e.g. `gold-400/15` → `gold/15`) |
| `gold-500` | `gold-dark` | hover/emphasis state |
| `gold-600` | `gold-dark` | |
| `gold-700` | `gold-dark` | pre-existing dead class (token never defined in old `globals.css`) — fixing as a byproduct of the sweep |
| `gold-50` (`bg-gold-50`) | `gold/10` | pre-existing dead class — fixing as a byproduct of the sweep |
| `sand-50` | `bg` | primary warm background |
| `sand-100` | `bg-secondary` | secondary warm background |
| `sand-200` | `border-subtle` | border tone paired with sand backgrounds |
| `font-playfair` | `font-serif` | |

Everything else in a touched line (spacing, layout classes, `text-white`, `text-slate-*`, `text-gray-*`, opacity, hover/focus modifiers, non-brand utility classes) stays **exactly as-is** — out of scope for this phase.

---

### Task 1: Design tokens in `globals.css`

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: CSS custom properties consumed by every later task — `--color-bg`, `--color-bg-secondary`, `--color-surface`, `--color-ink`, `--color-charcoal`, `--color-text`, `--color-text-secondary`, `--color-text-muted`, `--color-text-on-dark`, `--color-border`, `--color-border-subtle`, `--color-gold`, `--color-gold-dark`, `--font-serif`, fluid type scale (`--text-hero`, `--text-hero-secondary`, `--text-section`, `--text-property`, `--text-subheading`, `--text-body`, `--text-small`, `--text-eyebrow`), spacing/radius/shadow tokens. Tailwind v4 auto-generates matching utility classes from any `--color-*`/`--text-*`/`--radius-*` token in `@theme` — e.g. `bg-ink`, `text-ink`, `border-ink`, `text-section`, `rounded-button`.

- [ ] **Step 1: Replace the `@theme` block**

Replace the current contents of `src/app/globals.css` lines 1-30 with:

```css
@import "tailwindcss";

@theme {
  --font-serif: "Instrument Serif", "DM Serif Display", "Cormorant Garamond", serif;
  --font-inter: "Inter", sans-serif;

  /* Color system */
  --color-bg: #F7F5F0;
  --color-bg-secondary: #EFECE5;
  --color-surface: #FFFFFF;
  --color-ink: #171714;
  --color-charcoal: #20201D;

  --color-text: #171714;
  --color-text-secondary: #66645E;
  --color-text-muted: #8A8780;
  --color-text-on-dark: #F7F5F0;

  --color-border: #DDD9D0;
  --color-border-subtle: #E8E5DE;

  --color-gold: #A88A5A;
  --color-gold-dark: #80683F;

  /* Fluid type scale */
  --text-hero: clamp(3rem, 7vw, 6rem);
  --text-hero-secondary: clamp(3rem, 5vw, 4rem);
  --text-section: clamp(2.25rem, 5vw, 3.75rem);
  --text-property: clamp(2.5rem, 4vw, 3.5rem);
  --text-subheading: clamp(1.25rem, 1.6vw, 1.5rem);
  --text-body: clamp(0.9375rem, 1.2vw, 1.125rem);
  --text-small: 0.9375rem;
  --text-eyebrow: 0.75rem;

  /* Radius */
  --radius-button: 7px;
  --radius-input: 8px;
  --radius-card: 12px;
  --radius-image-lg: 14px;
  --radius-none: 0px;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;

  /* Shadow */
  --shadow-sm: 0 4px 16px rgba(23,23,20,0.05);
  --shadow-md: 0 12px 40px rgba(23,23,20,0.08);
  --shadow-lg: 0 24px 80px rgba(23,23,20,0.10);

  /* Spacing scale (px, additive to Tailwind defaults) */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-120: 120px;
  --spacing-160: 160px;
}
```

- [ ] **Step 2: Update the `@layer base` and `@layer utilities` blocks to match**

Replace the `body`, `h1..h6`, `::selection` rules and the `.font-playfair`/`.font-inter` utilities (current lines 32-65) with:

```css
@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
    color: var(--color-text);
    background: var(--color-bg);
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-serif), Georgia, serif;
  }

  ::selection {
    background: var(--color-gold);
    color: var(--color-text-on-dark);
  }
}

@layer utilities {
  .font-serif { font-family: var(--font-serif), Georgia, serif; }
  .font-inter { font-family: var(--font-inter), ui-sans-serif, sans-serif; }

  .animate-kenburns {
    animation: kenburns 7s ease-out forwards;
  }

  .animate-light-sweep {
    animation: light-sweep 8s ease-in-out infinite;
  }
}
```

Keep the `@keyframes kenburns`, `@keyframes light-sweep`, and `@media (prefers-reduced-motion: reduce)` blocks (current lines 67-83) completely unchanged.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no new errors (CSS isn't typechecked, this just confirms nothing else broke).

Use the Grep tool: pattern `navy-|gold-(400|500|600)|sand-` on `src/app/globals.css`.
Expected: zero matches (old token definitions are gone).

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "Replace design tokens with warm editorial palette (Phase 1 design system)"
```

---

### Task 2: Font swap in `layout.tsx`

**Files:**
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `--font-serif` CSS variable name from Task 1.
- Produces: `instrumentSerif.variable` CSS class feeding the `--font-serif` custom property at the `<html>` level, replacing `playfair.variable`.

- [ ] **Step 1: Read the Next.js 16 fonts doc**

Read `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` to confirm `next/font/google` usage is unchanged for this Next version before editing. If the API differs from the current `Inter`/`Playfair_Display` usage in `layout.tsx`, follow the doc's current API instead of the pattern below.

- [ ] **Step 2: Swap the font import and variable**

In `src/app/layout.tsx`, replace:

```tsx
import { Inter, Playfair_Display } from 'next/font/google';
```

with:

```tsx
import { Inter, Instrument_Serif } from 'next/font/google';
```

Replace:

```tsx
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});
```

with:

```tsx
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
  display: 'swap',
});
```

(Instrument Serif ships only weight 400 on Google Fonts — required `weight` param, unlike the variable-weight `Playfair_Display` call it replaces.)

Replace the `className` on `<html>`:

```tsx
<html lang="en-IN" className={`${inter.variable} ${playfair.variable}`}>
```

with:

```tsx
<html lang="en-IN" className={`${inter.variable} ${instrumentSerif.variable}`}>
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

Use the Grep tool: pattern `Playfair|font-playfair` on `src/app/layout.tsx`.
Expected: zero matches.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "Swap Playfair Display for Instrument Serif"
```

---

### Task 3: Rebuild `Button.tsx`

**Files:**
- Modify: `src/components/ui/Button.tsx`

**Interfaces:**
- Consumes: `cn()` from `src/lib/utils.ts` (unchanged); color/radius tokens from Task 1.
- Produces: same public API (`variant: 'primary'|'secondary'|'outline'|'ghost'`, `size: 'sm'|'md'|'lg'`, `href`/button polymorphism) — no call site changes needed anywhere in the codebase.

- [ ] **Step 1: Replace the variants/sizes/base constants**

In `src/components/ui/Button.tsx`, replace lines 30-47 with:

```tsx
const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-ink hover:bg-charcoal text-surface shadow-sm hover:shadow-md',
  secondary:
    'bg-transparent border border-border text-text hover:bg-bg-secondary',
  outline:
    'border-2 border-white/30 text-white hover:border-white hover:bg-white/10',
  ghost: 'text-white/80 hover:text-white hover:bg-white/10',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm h-12',
  md: 'px-6 py-3 text-base h-12 sm:h-13',
  lg: 'px-8 py-4 text-lg h-14',
};

const base =
  'inline-flex items-center justify-center gap-2 font-inter font-semibold rounded-button transition-all duration-200 active:scale-[0.97] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
```

(`outline`/`ghost` variants are used on dark hero/nav surfaces — kept as literal `white` since they're not brand-palette tokens, per spec's "on-dark" usage; not part of the Token Migration Map.)

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors.

Use the Grep tool: pattern `navy-|gold-(400|500|600)|sand-` on `src/components/ui/Button.tsx`.
Expected: zero matches.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Button.tsx
git commit -m "Rebuild Button on new design tokens"
```

---

### Task 4: Rebuild `Badge.tsx`

**Files:**
- Modify: `src/components/ui/Badge.tsx`

**Interfaces:**
- Produces: same public API (`variant: 'gold'|'navy'|'green'|'sand'|'red'`) — variant names stay the same (avoids touching every call site), only their visual output changes.

- [ ] **Step 1: Replace the variants map**

Replace lines 11-17 in `src/components/ui/Badge.tsx`:

```tsx
const variants: Record<BadgeVariant, string> = {
  gold: 'bg-gold/15 text-gold-dark border border-gold/30',
  navy: 'bg-ink text-surface',
  green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  sand: 'bg-bg-secondary text-text-secondary border border-border-subtle',
  red: 'bg-red-50 text-red-700 border border-red-200',
};
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors.

Use the Grep tool: pattern `navy-|gold-(400|500|600)|sand-` on `src/components/ui/Badge.tsx`.
Expected: zero matches.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Badge.tsx
git commit -m "Rebuild Badge on new design tokens"
```

---

### Task 5: Rebuild `SectionHeader.tsx`

**Files:**
- Modify: `src/components/ui/SectionHeader.tsx`

**Interfaces:**
- Produces: same public API (`eyebrow`, `heading`, `subheading`, `align`, `light`, `className`, `headingAs`).

- [ ] **Step 1: Update the eyebrow/heading/subheading classes**

Replace line 37:
```tsx
            light ? 'text-gold-400' : 'text-gold-500'
```
with:
```tsx
            light ? 'text-gold' : 'text-gold-dark'
```

Replace lines 45-49:
```tsx
        className={cn(
          'font-playfair font-bold leading-tight',
          light ? 'text-white' : 'text-navy-950',
          'text-3xl sm:text-4xl lg:text-5xl'
        )}
```
with:
```tsx
        className={cn(
          'font-serif font-bold leading-tight text-section',
          light ? 'text-text-on-dark' : 'text-text'
        )}
```

Replace line 57 (`light ? 'text-white/70' : 'text-slate-600'`) with:
```tsx
            light ? 'text-text-on-dark/70' : 'text-text-secondary'
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors.

Use the Grep tool: pattern `navy-|gold-(400|500|600)|sand-|font-playfair` on `src/components/ui/SectionHeader.tsx`.
Expected: zero matches.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/SectionHeader.tsx
git commit -m "Rebuild SectionHeader on new design tokens and fluid type scale"
```

---

### Task 6: New `Input`/`Textarea` components

**Files:**
- Create: `src/components/ui/Input.tsx`
- Create: `src/components/ui/Textarea.tsx`

**Interfaces:**
- Produces: `Input` — `forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }>`. `Textarea` — same shape over `HTMLTextAreaElement`/`TextareaHTMLAttributes`. Both render a visible `<label>` (spec §15/§35: "never rely only on placeholder text").
- Consumes: `cn()` from `src/lib/utils.ts`.

- [ ] **Step 1: Write `Input.tsx`**

```tsx
import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, className, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-inter font-medium text-text">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'h-14 w-full rounded-input border border-border bg-surface px-4 text-[15px] font-inter text-text transition-colors placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold disabled:opacity-60 disabled:cursor-not-allowed',
          error && 'border-red-400 focus:ring-red-400 focus:border-red-400',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs font-inter text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});
```

- [ ] **Step 2: Write `Textarea.tsx`**

```tsx
import { cn } from '@/lib/utils';
import { TextareaHTMLAttributes, forwardRef, useId } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, id, className, rows = 4, ...props }, ref) {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={textareaId} className="text-sm font-inter font-medium text-text">
          {label}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            'w-full resize-none rounded-input border border-border bg-surface px-4 py-3 text-[15px] font-inter text-text transition-colors placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold disabled:opacity-60 disabled:cursor-not-allowed',
            error && 'border-red-400 focus:ring-red-400 focus:border-red-400',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="text-xs font-inter text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors (files aren't imported anywhere yet, so this only checks they compile standalone).

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Input.tsx src/components/ui/Textarea.tsx
git commit -m "Add shared Input and Textarea primitives"
```

---

### Task 7: New `Select` component

**Files:**
- Create: `src/components/ui/Select.tsx`

**Interfaces:**
- Produces: `Select` — `forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string; options: { value: string; label: string }[] }>`.
- Consumes: `cn()` from `src/lib/utils.ts`.

- [ ] **Step 1: Write `Select.tsx`**

```tsx
import { cn } from '@/lib/utils';
import { SelectHTMLAttributes, forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, options, id, className, ...props },
  ref
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="text-sm font-inter font-medium text-text">
        {label}
      </label>
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'h-14 w-full appearance-none rounded-input border border-border bg-surface px-4 pr-10 text-[15px] font-inter text-text transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold disabled:opacity-60 disabled:cursor-not-allowed',
            error && 'border-red-400 focus:ring-red-400 focus:border-red-400',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
          aria-hidden="true"
        />
      </div>
      {error && (
        <p id={`${selectId}-error`} className="text-xs font-inter text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Select.tsx
git commit -m "Add shared Select primitive"
```

---

### Task 8: New `GlassPanel` component

**Files:**
- Create: `src/components/ui/GlassPanel.tsx`

**Interfaces:**
- Produces: `GlassPanel({ variant: 'standard' | 'strong', className, children })` — a `div` wrapper. Not consumed by any page yet in this phase (later phases wire it into hero search, mobile menu, image overlays per spec §10/§54).

- [ ] **Step 1: Write `GlassPanel.tsx`**

```tsx
import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

type GlassPanelVariant = 'standard' | 'strong';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: GlassPanelVariant;
}

const variants: Record<GlassPanelVariant, string> = {
  standard:
    'bg-white/78 backdrop-blur-[18px] border border-white/55 shadow-md',
  strong:
    'bg-[rgba(247,245,240,0.90)] backdrop-blur-[24px] border border-white/65',
};

export function GlassPanel({ variant = 'standard', className, children, ...props }: GlassPanelProps) {
  return (
    <div className={cn('rounded-card', variants[variant], className)} {...props}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/GlassPanel.tsx
git commit -m "Add shared GlassPanel primitive (standard + strong-over-photography variants)"
```

---

### Task 9: Sweep — Layout shell

**Files:**
- Modify: `src/components/layout/Navbar.tsx` (lines 45, 54, 59-60, 65, 68, 82-84, 97, 105-106, 113, 132, 150-151, 161, 163, 168)
- Modify: `src/components/layout/Footer.tsx` (lines 45, 57-58, 61-62, 84, 94, 98, 105, 115, 119, 129, 134-135, 143-144, 152-153, 160, 162, 173, 175, 186)
- Modify: `src/components/layout/SiteShell.tsx` (line 29)
- Modify: `src/components/layout/BottomNav.tsx` (lines 27, 38-39, 42)

**Interfaces:**
- Consumes: color/font tokens from Task 1, `Button`/`Badge` from Tasks 3-4 if used (verify at edit time; if not consumed directly, ignore).

- [ ] **Step 1: Sweep `Navbar.tsx`**

Apply the Token Migration Map to every matched class in the file. Worked examples from the current file:

Line 45: `'bg-navy-950/98 backdrop-blur-md shadow-lg shadow-black/25 border-b border-white/5'` → `'bg-ink/98 backdrop-blur-md shadow-lg shadow-black/25 border-b border-white/5'`

Line 59-60:
```tsx
<div className="w-9 h-9 rounded-lg bg-gold-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
  <span className="text-navy-950 font-bold text-sm font-playfair tracking-tight">
```
→
```tsx
<div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
  <span className="text-ink font-bold text-sm font-serif tracking-tight">
```

Line 126: `focus-visible:ring-offset-navy-950` → `focus-visible:ring-offset-ink`. Every other `gold-400`→`gold`, `gold-500`→`gold-dark`, `navy-950`→`ink` substitution in the file follows the same table with no other changes to structure, spacing, or non-brand classes (e.g. `text-white`, `text-white/80`, `bg-white/10` stay as-is).

- [ ] **Step 2: Sweep `Footer.tsx`, `SiteShell.tsx`, `BottomNav.tsx`**

Same procedure: Grep each file for `navy-|gold-(400|500|600|700|50)|sand-|font-playfair`, apply the Token Migration Map to each match, leave everything else untouched.

`SiteShell.tsx` line 29 worked example:
```tsx
className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:bg-gold-400 focus:text-navy-950 focus:px-4 focus:py-2 focus:rounded-lg focus:font-inter focus:font-semibold"
```
→
```tsx
className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:bg-gold focus:text-ink focus:px-4 focus:py-2 focus:rounded-lg focus:font-inter focus:font-semibold"
```

- [ ] **Step 3: Verify**

Use the Grep tool: pattern `navy-|gold-(400|500|600|700|50)|sand-|font-playfair` on `src/components/layout/`.
Expected: zero matches.

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Navbar.tsx src/components/layout/Footer.tsx src/components/layout/SiteShell.tsx src/components/layout/BottomNav.tsx
git commit -m "Sweep layout shell components to new design tokens"
```

---

### Task 10: Sweep — Home hero & discovery

**Files:**
- Modify: `src/components/home/HeroSection.tsx` (lines 18, 29, 40, 43, 45, 72, 87, 128)
- Modify: `src/components/home/AnimatedHeroBackground.tsx` (lines 64, 96-97)
- Modify: `src/components/home/SearchBar.tsx` (lines 48-49, 56, 60, 90-92, 100, 102, 118-119, 153)
- Modify: `src/components/home/FeaturedProperties.tsx` (lines 24, 36, 46)
- Modify: `src/components/home/PropertyCategories.tsx` (lines 16, 29-31, 50, 63, 67-68, 74-75, 82)
- Modify: `src/components/home/LocationHighlights.tsx` (lines 14, 52, 62, 68-69, 73, 87, 96)

**Interfaces:**
- Consumes: color/font tokens from Task 1.

- [ ] **Step 1: Sweep `HeroSection.tsx`**

Worked example, line 40 and 43-45:
```tsx
className="font-playfair font-bold text-white leading-tight text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-6"
...
<span className="text-gold-400">Plot, Villa</span>
...
<span className="text-gold-400">Behror, Neemrana</span>
```
→
```tsx
className="font-serif font-bold text-white leading-tight text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-6"
...
<span className="text-gold">Plot, Villa</span>
...
<span className="text-gold">Behror, Neemrana</span>
```

Apply the Token Migration Map to every remaining match in the file (lines 18, 29, 72, 87, 128) — same pattern, no structural changes.

- [ ] **Step 2: Sweep `AnimatedHeroBackground.tsx`**

Line 64: `bg-navy-950` → `bg-ink`. Lines 96-97: `from-navy-950/90 via-navy-950/70` → `from-ink/90 via-ink/70`; `from-navy-950/80 via-transparent to-navy-950/30` → `from-ink/80 via-transparent to-ink/30`.

- [ ] **Step 3: Sweep `SearchBar.tsx`**

Note line 92 has a code comment mentioning `bg-navy-950` (`/* Bridge div: full-width bg-navy-950 pulls up... */`) — update the comment text to say `bg-ink` too, so it doesn't go stale. Line 100: `bg-navy-900/95` → `bg-charcoal/95`. Line 60: `className="bg-navy-950 text-white"` on a native `<option>` → `className="bg-ink text-white"`. Apply the table to the remaining matches (48-49, 56, 118-119, 153).

- [ ] **Step 4: Sweep `FeaturedProperties.tsx`, `PropertyCategories.tsx`, `LocationHighlights.tsx`**

Same procedure via the Token Migration Map. Note `PropertyCategories.tsx` line 29 (`from-navy-800/5 to-navy-950/10`) is a **background gradient** use of `navy-800` → per the map, background-role `navy-800` maps to `ink`: `from-ink/5 to-ink/10`. Line 31 (`iconColor: 'text-navy-800'`) is a **text** role → `text-secondary`.

- [ ] **Step 5: Verify**

Use the Grep tool: pattern `navy-|gold-(400|500|600|700|50)|sand-|font-playfair` on the 6 files above.
Expected: zero matches.

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/home/HeroSection.tsx src/components/home/AnimatedHeroBackground.tsx src/components/home/SearchBar.tsx src/components/home/FeaturedProperties.tsx src/components/home/PropertyCategories.tsx src/components/home/LocationHighlights.tsx
git commit -m "Sweep homepage hero and discovery sections to new design tokens"
```

---

### Task 11: Sweep — Home trust & conversion sections

**Files:**
- Modify: `src/components/home/WhyChooseUs.tsx` (lines 46, 60-62, 64)
- Modify: `src/components/home/TrustIndicators.tsx` (lines 39, 49-51, 53, 56)
- Modify: `src/components/home/ProcessSteps.tsx` (lines 51, 60-62, 64, 68)
- Modify: `src/components/home/Testimonials.tsx` (lines 15, 49, 64, 66, 78-79)
- Modify: `src/components/home/FAQSection.tsx` (lines 59, 61, 65, 69, 86, 99)
- Modify: `src/components/home/ContactStrip.tsx` (lines 25, 29-30, 36, 49, 62, 64)

**Interfaces:**
- Consumes: color/font tokens from Task 1.

- [ ] **Step 1: Sweep all six files**

Apply the Token Migration Map to every match. Worked example, `ContactStrip.tsx` lines 25 and 49:
```tsx
className="py-16 sm:py-20 bg-navy-950 relative overflow-hidden"
...
className="group flex items-center gap-3 bg-gold-400 hover:bg-gold-500 text-navy-950 font-inter font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-gold-400/30 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 text-base min-w-56"
```
→
```tsx
className="py-16 sm:py-20 bg-ink relative overflow-hidden"
...
className="group flex items-center gap-3 bg-gold hover:bg-gold-dark text-ink font-inter font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-gold/30 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold text-base min-w-56"
```

`Testimonials.tsx` line 15 (`fill-gold-400`) → `fill-gold` (Tailwind arbitrary `fill-*` utility also reads from `--color-*` tokens the same way).

- [ ] **Step 2: Verify**

Use the Grep tool: pattern `navy-|gold-(400|500|600|700|50)|sand-|font-playfair` on the 6 files above.
Expected: zero matches.

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/WhyChooseUs.tsx src/components/home/TrustIndicators.tsx src/components/home/ProcessSteps.tsx src/components/home/Testimonials.tsx src/components/home/FAQSection.tsx src/components/home/ContactStrip.tsx
git commit -m "Sweep homepage trust and conversion sections to new design tokens"
```

---

### Task 12: Sweep — Properties listing components

**Files:**
- Modify: `src/components/properties/PropertyCard.tsx` (lines 39, 44, 60-61, 72, 78, 83, 85, 90, 96, 107, 117)
- Modify: `src/components/properties/PropertyGrid.tsx` (lines 15, 18, 25)
- Modify: `src/components/properties/PropertySort.tsx` (lines 32, 37, 45)
- Modify: `src/components/properties/PropertyFilters.tsx` (lines 62, 131, 136, 138, 141)

**Interfaces:**
- Consumes: color/font tokens from Task 1.

- [ ] **Step 1: Sweep all four files**

Apply the Token Migration Map to every match. Worked example, `PropertyCard.tsx` lines 39-44 and 107:
```tsx
'bg-white rounded-2xl overflow-hidden border border-sand-100 shadow-md group',
...
<div className="relative aspect-[4/3] overflow-hidden bg-sand-100">
...
className="text-xs font-inter bg-sand-50 text-navy-800 border border-sand-200 px-2.5 py-1 rounded-full"
```
→
```tsx
'bg-white rounded-2xl overflow-hidden border border-border-subtle shadow-md group',
...
<div className="relative aspect-[4/3] overflow-hidden bg-border-subtle">
...
className="text-xs font-inter bg-bg text-text-secondary border border-border-subtle px-2.5 py-1 rounded-full"
```

Note: `sand-100` used as an *image placeholder background* (line 44, `bg-sand-100`) maps to `border-subtle` per the literal table (sand-200→border-subtle is for borders; sand-100→bg-secondary is the correct row for backgrounds) — use `bg-bg-secondary` there instead, i.e. line 44 → `<div className="relative aspect-[4/3] overflow-hidden bg-bg-secondary">`. Line 39's `border-sand-100` → `border-border-subtle` (sand-100 as a border tone maps to the closest border token, `border-subtle`, since there is no separate "bg-secondary-as-border" case).

- [ ] **Step 2: Verify**

Use the Grep tool: pattern `navy-|gold-(400|500|600|700|50)|sand-|font-playfair` on the 4 files above.
Expected: zero matches.

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/properties/PropertyCard.tsx src/components/properties/PropertyGrid.tsx src/components/properties/PropertySort.tsx src/components/properties/PropertyFilters.tsx
git commit -m "Sweep property listing components to new design tokens"
```

---

### Task 13: Sweep — Property detail components (A)

**Files:**
- Modify: `src/components/property-detail/ImageGallery.tsx` (lines 40, 59, 62-63, 65, 103-104)
- Modify: `src/components/property-detail/VirtualTour360Modal.tsx` (lines 185, 188, 190, 194, 213, 239, 246, 249)
- Modify: `src/components/property-detail/PropertyOverview.tsx` (lines 49, 53, 58, 72, 74-75, 79, 87)
- Modify: `src/components/property-detail/AmenitiesList.tsx` (lines 20-21, 28, 30, 41-42, 49, 62-63, 72)

**Interfaces:**
- Consumes: color/font tokens from Task 1.

- [ ] **Step 1: Sweep all four files**

Apply the Token Migration Map to every match. Worked example, `AmenitiesList.tsx` line 28:
```tsx
className="inline-flex items-center gap-1.5 bg-gold-400/10 border border-gold-400/30 text-navy-800 font-inter font-medium text-sm px-4 py-2 rounded-full"
```
→
```tsx
className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/30 text-text-secondary font-inter font-medium text-sm px-4 py-2 rounded-full"
```
(`text-navy-800` here is a text role → `text-secondary` per the map.)

- [ ] **Step 2: Verify**

Use the Grep tool: pattern `navy-|gold-(400|500|600|700|50)|sand-|font-playfair` on the 4 files above.
Expected: zero matches.

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/property-detail/ImageGallery.tsx src/components/property-detail/VirtualTour360Modal.tsx src/components/property-detail/PropertyOverview.tsx src/components/property-detail/AmenitiesList.tsx
git commit -m "Sweep property detail gallery/overview/amenities components to new design tokens"
```

---

### Task 14: Sweep — Property detail components (B)

**Files:**
- Modify: `src/components/property-detail/LocationMap.tsx` (lines 35-36, 40, 42-43, 59)
- Modify: `src/components/property-detail/EMICalculator.tsx` (lines 22-24, 35, 46, 61, 70, 85, 94, 104, 107)
- Modify: `src/components/property-detail/LeadForm.tsx` (lines 60, 69-70, 89, 101, 114, 121, 124)

**Interfaces:**
- Consumes: color/font tokens from Task 1.

- [ ] **Step 1: Sweep all three files**

Apply the Token Migration Map to every match. Worked example, `EMICalculator.tsx` lines 46/70/94:
```tsx
className="w-full accent-gold-400 cursor-pointer"
```
→
```tsx
className="w-full accent-gold cursor-pointer"
```
(Tailwind's `accent-*` utility reads from the same `--color-*` token, same as `bg-*`/`text-*`.)

`LeadForm.tsx` line 124:
```tsx
<span className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
```
→
```tsx
<span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
```

- [ ] **Step 2: Verify**

Use the Grep tool: pattern `navy-|gold-(400|500|600|700|50)|sand-|font-playfair` on the 3 files above.
Expected: zero matches.

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/property-detail/LocationMap.tsx src/components/property-detail/EMICalculator.tsx src/components/property-detail/LeadForm.tsx
git commit -m "Sweep property detail map/EMI/lead-form components to new design tokens"
```

---

### Task 15: Sweep — Property & location pages

**Files:**
- Modify: `src/app/properties/page.tsx` (lines 101, 135)
- Modify: `src/app/properties/[slug]/page.tsx` (lines 93, 95, 97, 131-132)
- Modify: `src/app/locations/page.tsx` (lines 31, 49, 60)
- Modify: `src/app/locations/[slug]/page.tsx` (lines 194, 198, 200, 223, 238, 240-241, 245, 250, 262, 265, 271)
- Modify: `src/components/locations/LocationSection.tsx` (lines 36, 42, 52-53, 58, 62, 66, 75, 80, 90-91, 97, 107-108, 114, 121-122, 128, 142, 147)

**Interfaces:**
- Consumes: color/font tokens from Task 1.

- [ ] **Step 1: Sweep all five files**

Apply the Token Migration Map to every match. Worked example, `LocationSection.tsx` line 147:
```tsx
className="group flex items-center gap-1.5 text-gold-600 hover:text-gold-700 font-inter font-semibold text-sm transition-colors shrink-0"
```
→
```tsx
className="group flex items-center gap-1.5 text-gold-dark hover:text-gold-dark font-inter font-semibold text-sm transition-colors shrink-0"
```
(both `gold-600` and the pre-existing dead `gold-700` collapse to the single `gold-dark` token — the hover class becomes a no-op duplicate of the base class, which is correct: there is no third gold shade in the new system to differentiate hover from base here. If this reads oddly once visible, drop the redundant `hover:text-gold-dark` — but do not invent a new shade not in the token map.)

`locations/[slug]/page.tsx` lines 58/62/66 equivalent pattern in `LocationSection.tsx` (`text-navy-900` for inline `<strong>` emphasis) → per the map, `navy-900` → `charcoal`, so `text-navy-900` → `text-charcoal`.

- [ ] **Step 2: Verify**

Use the Grep tool: pattern `navy-|gold-(400|500|600|700|50)|sand-|font-playfair` on the 5 files above.
Expected: zero matches.

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/properties/page.tsx "src/app/properties/[slug]/page.tsx" src/app/locations/page.tsx "src/app/locations/[slug]/page.tsx" src/components/locations/LocationSection.tsx
git commit -m "Sweep property and location pages to new design tokens"
```

---

### Task 16: Sweep — Secondary pages (about, contact, blogs)

**Files:**
- Modify: `src/app/about/page.tsx` (lines 66, 69, 72, 88, 93, 99, 105, 135, 137, 143-144, 148, 159, 173-175, 177, 187, 190, 199, 205)
- Modify: `src/app/contact/ContactPageContent.tsx` (lines 59, 81, 87, 94, 100, 110, 122, 126-127, 136-138, 142, 165, 168-169, 187, 194-196, 200, 210-212, 216, 231, 240-242, 246, 263-265, 269, 282, 293-294, 297, 318, 320)
- Modify: `src/app/blogs/BlogsListClient.tsx` (lines 53, 55, 59, 62, 66, 68, 76, 82, 100, 111, 116, 133, 135, 141, 159, 163-164, 184, 199, 212, 229, 248-249, 259-260, 266)
- Modify: `src/app/blogs/[slug]/page.tsx` (lines 66, 81, 83, 89, 93-94, 101, 109, 141-142, 150, 163, 174, 176, 180, 189, 202, 213, 216, 225)
- Modify: `src/app/blogs/[slug]/LeadCaptureForm.tsx` (lines 47, 50, 84, 97, 111, 118)

**Interfaces:**
- Consumes: color/font tokens from Task 1.

- [ ] **Step 1: Sweep all five files**

Apply the Token Migration Map to every match. Worked example, `about/page.tsx` lines 143-148:
```tsx
<div className="col-span-2 bg-gold-400/10 border border-gold-400/30 rounded-2xl p-6">
  <p className="text-navy-800 font-inter text-sm leading-relaxed italic">
  ...
  <p className="text-gold-600 font-inter font-semibold text-sm mt-3">
```
→
```tsx
<div className="col-span-2 bg-gold/10 border border-gold/30 rounded-2xl p-6">
  <p className="text-text-secondary font-inter text-sm leading-relaxed italic">
  ...
  <p className="text-gold-dark font-inter font-semibold text-sm mt-3">
```

`LeadCaptureForm.tsx` line 47 (dead class, per the map):
```tsx
<div className="w-12 h-12 bg-gold-50 text-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-2">
```
→
```tsx
<div className="w-12 h-12 bg-gold/10 text-gold-dark rounded-2xl flex items-center justify-center mx-auto mb-2">
```

Leave `text-gray-*`/`bg-gray-*`/`text-slate-*` classes in `BlogsListClient.tsx` and `blogs/[slug]/page.tsx` untouched — they are not brand tokens and out of scope.

- [ ] **Step 2: Verify**

Use the Grep tool: pattern `navy-|gold-(400|500|600|700|50)|sand-|font-playfair` on the 5 files above.
Expected: zero matches.

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/about/page.tsx src/app/contact/ContactPageContent.tsx src/app/blogs/BlogsListClient.tsx "src/app/blogs/[slug]/page.tsx" "src/app/blogs/[slug]/LeadCaptureForm.tsx"
git commit -m "Sweep about, contact, and blog pages to new design tokens"
```

---

### Task 17: Final verification and old-token cleanup

**Files:**
- No new modifications expected — this task verifies Tasks 9-16 left nothing behind.

**Interfaces:**
- Consumes: the complete swept codebase from all prior tasks.

- [ ] **Step 1: Full-repo grep verification**

Use the Grep tool: pattern `navy-|gold-(400|500|600|700|50)|sand-|font-playfair` on `src/`.
Expected: zero matches anywhere. If any remain, apply the Token Migration Map to fix them now (they were missed by the batch task lists above — check whether the file exists in the original 42-file list; if it's a new/renamed file, apply the same table).

- [ ] **Step 2: Full build check**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds with no errors (this also catches any Server/Client Component or `next/font` misconfiguration from Task 2).

- [ ] **Step 3: Manual visual smoke check**

Run: `npm run dev`, then check in a browser (or via the `claude-in-chrome` tools if available) that these routes render with the new palette, no unstyled/broken elements, and no layout shift beyond the expected color/type change:
- `/` (homepage — hero, search, featured properties, categories, why-us, trust, process, testimonials, FAQ, contact strip)
- `/properties`
- `/properties/[any real slug from Firestore]`
- `/locations`
- `/locations/[behror|neemrana|kotputli]`
- `/about`
- `/contact`
- `/blogs`
- `/blogs/[any real slug]`

Confirm the `prefers-reduced-motion` block in `globals.css` (kept untouched since Task 1) still works: enable "reduce motion" in OS/browser settings and confirm `.animate-kenburns`/`.animate-light-sweep` are disabled.

- [ ] **Step 4: Commit (only if Step 1 found and fixed stragglers)**

```bash
git add -A
git commit -m "Fix remaining old-token references found in final sweep verification"
```

If Step 1 found nothing, skip this commit — there's nothing to commit.

---

## Definition of Done

- Zero `navy-`/`gold-400|500|600|700|50`/`sand-`/`font-playfair` references anywhere in `src/`.
- `npx tsc --noEmit`, `npm run lint`, and `npm run build` all pass.
- Every route in the Step 3 smoke-check list renders with the new warm off-white/charcoal/gold/Instrument-Serif palette, with no structural/layout regressions.
- `Input`, `Select`, `Textarea`, `GlassPanel` exist as shared primitives in `src/components/ui/`, ready for later phases (search, forms) to consume — not yet wired into any page.
