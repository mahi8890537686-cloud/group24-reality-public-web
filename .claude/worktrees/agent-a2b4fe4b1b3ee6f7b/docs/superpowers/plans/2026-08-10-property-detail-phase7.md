# Property Detail Page Phase 7 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dark editorial header band to `/properties/[slug]`, slim `PropertyOverview` to specs+description, and fix the gallery lightbox `AnimatePresence` key, per `docs/superpowers/specs/2026-08-10-property-detail-phase7-design.md`.

**Architecture:** Task 1 creates `PropertyDetailHeader` and slims `PropertyOverview`. Task 2 rewires `[slug]/page.tsx` to use the header and drops the old spacer/breadcrumb. Task 3 fixes `ImageGallery` AnimatePresence key. Task 4 verifies. Sidebar, forms, metadata, and `MobileBottomBar` are untouched.

**Tech Stack:** Next.js 16.2.12, React 19, Tailwind v4 tokens from Phase 1, `lucide-react`, existing `Badge` component.

## Global Constraints

- Only `PropertyDetailHeader.tsx` (new), `PropertyOverview.tsx`, `src/app/properties/[slug]/page.tsx`, and `ImageGallery.tsx` are touched by this plan.
- `LeadForm`, `EMICalculator`, `AmenitiesList`, `LocationMap`, `VirtualTour360Modal`, metadata/JSON-LD, Firestore fetching, and `MobileBottomBar` are NOT changed.
- No test framework exists — verification is `npx tsc --noEmit`, `npm run lint`, and `npm run build`.
- Every task ends with a commit.

---

### Task 1: Create PropertyDetailHeader and slim PropertyOverview

**Files:**
- Create: `src/components/property-detail/PropertyDetailHeader.tsx`
- Modify: `src/components/property-detail/PropertyOverview.tsx`

**Interfaces:**
- Consumes: `Property` type from `@/types`, `Badge` from `@/components/ui/Badge`, `capitalise` from `@/lib/utils`, `Link` from `next/link`, `MapPin`/`FileCheck` from `lucide-react`.

- [ ] **Step 1: Create `PropertyDetailHeader.tsx`**

```tsx
import Link from 'next/link';
import { MapPin, FileCheck } from 'lucide-react';
import type { Property } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { capitalise } from '@/lib/utils';

interface PropertyDetailHeaderProps {
  property: Property;
}

const statusBadge: Record<string, 'green' | 'red' | 'gold'> = {
  available: 'green',
  sold: 'red',
  'under-negotiation': 'gold',
};

const statusLabel: Record<string, string> = {
  available: 'Available',
  sold: 'Sold',
  'under-negotiation': 'Under Negotiation',
};

export default function PropertyDetailHeader({ property }: PropertyDetailHeaderProps) {
  return (
    <div className="bg-ink pt-28 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm font-inter text-white/50">
            <li><Link href="/" className="hover:text-gold transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/properties" className="hover:text-gold transition-colors">Properties</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-text-on-dark font-medium truncate max-w-xs">{property.title}</li>
          </ol>
        </nav>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="gold">{capitalise(property.type)}</Badge>
          <Badge variant={statusBadge[property.status]}>
            {statusLabel[property.status]}
          </Badge>
          {property.reraNumber && (
            <Badge variant="sand">
              <FileCheck className="w-3 h-3" />
              RERA: {property.reraNumber}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-serif text-text-on-dark text-2xl sm:text-3xl lg:text-4xl leading-tight">
              {property.title}
            </h1>
            <p className="text-text-on-dark/70 font-inter text-sm mt-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
              {property.address}
            </p>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <div className="font-serif text-text-on-dark text-3xl sm:text-4xl">
              {property.priceLabel}
            </div>
            {property.pricePerUnit && (
              <div className="text-text-on-dark/60 font-inter text-sm">{property.pricePerUnit}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Slim `PropertyOverview.tsx`**

Delete the entire `{/* Title + Status */}` block (badges, h1, address, price). Remove now-unused imports: `Badge`, `FileCheck`, `capitalise`. Keep specs grid and description unchanged.

Result should open with:
```tsx
  return (
    <div className="space-y-6">
      {/* Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` and `npm run lint`.
Expected: no errors; `PropertyDetailHeader` not yet imported anywhere (unused-file warning acceptable until Task 2).

- [ ] **Step 4: Commit**

```bash
git add src/components/property-detail/PropertyDetailHeader.tsx src/components/property-detail/PropertyOverview.tsx
git commit -m "Add PropertyDetailHeader and slim PropertyOverview to specs and description"
```

---

### Task 2: Rewire property detail page shell

**Files:**
- Modify: `src/app/properties/[slug]/page.tsx`

**Interfaces:**
- Consumes: Task 1's `PropertyDetailHeader` (default export).

- [ ] **Step 1: Add import**

```tsx
import PropertyDetailHeader from '@/components/property-detail/PropertyDetailHeader';
```

- [ ] **Step 2: Replace page shell**

Delete:
```tsx
      {/* Page spacing for sticky nav */}
      <div className="pt-20" />

      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm font-inter text-slate-400">
              <li><Link href="/" className="hover:text-gold-dark transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/properties" className="hover:text-gold-dark transition-colors">Properties</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-ink font-medium truncate max-w-xs">{property.title}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
```

Replace with:
```tsx
      <PropertyDetailHeader property={property} />

      <div className="bg-white py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
```

- [ ] **Step 3: Remove unused `Link` import if breadcrumb was its only use**

If `Link` is no longer referenced in `page.tsx`, delete `import Link from 'next/link';`.

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` and `npm run lint`.
Read the file back: no `pt-20` spacer, no inline breadcrumb, `PropertyDetailHeader` rendered before white content section, grid/sidebar/related/`MobileBottomBar` unchanged.

- [ ] **Step 5: Commit**

```bash
git add "src/app/properties/[slug]/page.tsx"
git commit -m "Restructure property detail page with dark editorial header band"
```

---

### Task 3: Fix ImageGallery lightbox AnimatePresence key

**Files:**
- Modify: `src/components/property-detail/ImageGallery.tsx`

- [ ] **Step 1: Add key to lightbox motion.div**

Find the lightbox block under `AnimatePresence`:
```tsx
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
```

Add `key="gallery-lightbox"` as the first prop on that `motion.div`.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` and `npm run lint`.

- [ ] **Step 3: Commit**

```bash
git add src/components/property-detail/ImageGallery.tsx
git commit -m "Add AnimatePresence key to property gallery lightbox"
```

---

### Task 4: Build verification

**Files:**
- No modifications expected.

- [ ] **Step 1: Full build check**

Run: `npx tsc --noEmit`, `npm run lint`, `npm run build`.
Expected: all three succeed.

- [ ] **Step 2: Manual smoke check**

Run `npm run dev`, load `/properties/[any slug]`:
- Dark header band shows breadcrumb, badges, title, address, price.
- White section below has gallery (no duplicate title/price in overview), sticky sidebar on desktop, related properties, `MobileBottomBar` on mobile.
- Gallery lightbox opens and closes.

- [ ] **Step 3: Commit (only if verification surfaced a fix)**

If clean, no commit needed.

---

## Definition of Done

- `/properties/[slug]` has a dark `bg-ink` editorial header with breadcrumb, badges, title, address, and price.
- `PropertyOverview` contains only the specs grid and description — no duplicate header content.
- Gallery lightbox `motion.div` has an `AnimatePresence` key.
- `LeadForm`, EMI, metadata, and `MobileBottomBar` unchanged.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass.
