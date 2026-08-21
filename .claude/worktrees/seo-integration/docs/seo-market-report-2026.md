# Group 24 Reality — SEO Technical Audit & Market Report

**Prepared:** August 2026
**Site:** group24reality.com (Next.js 16.2.12 App Router)
**Scope:** Fresh technical audit of the live codebase, market benchmarking against Indian real-estate SEO practice, and a prioritized action plan.

---

## Executive Summary

The prior rounds of technical SEO work (Server Component conversions, JSON-LD, dedicated location pages, self-hosted images, sitemap/robots) are **mostly real and verified in this pass** — I re-checked every claim against the current code and a clean production build rather than trusting the changelog. But this audit found **two genuine, currently-live problems** the prior work missed:

1. `/locations` (the location *index* page) is still a client-only component with **zero page-specific metadata** — it silently inherits the homepage's exact `<title>` and canonical URL. This is a real duplicate-title/duplicate-canonical issue on a page that should be one of the site's stronger local-intent landing pages.
2. The property filter system (location + type + price + bedrooms + status, all combinable) needs far more Firestore composite indexes than exist today. Only a handful of the field combinations the UI actually allows are indexed. Most combined-filter searches will currently either **throw an unhandled error** (on `/properties`) or **silently return zero results** (on the location detail pages' related-properties query) in production.

Everything else — Server Component correctness on the other 8 public routes, JSON-LD depth, canonical/heading hygiene on the pages that do have metadata, image hosting — checked out clean. This is a technically competent site with two specific, fixable defects, not a site with systemic technical debt.

---

## Part 1: Technical Audit of the Current Codebase

### 1.1 Build health and route map

`npm run build` was run clean, zero errors, zero warnings:

```
Route (app)                                                Revalidate  Expire
○  /                                    (Static)
○  /about                               (Static)
ƒ  /api/public/submit-lead              (Dynamic)
○  /blogs                               (Static)
●  /blogs/[slug]                        (SSG, generateStaticParams)   1m   1y
○  /contact                             (Static)
○  /icon                                (Static)
○  /locations                           (Static)
●  /locations/[slug]                    (SSG, generateStaticParams)   1m   1y
○  /manifest.webmanifest                (Static)
○  /opengraph-image                     (Static)
ƒ  /properties                          (Dynamic)
●  /properties/[slug]                   (SSG, generateStaticParams)   1m   1y
○  /robots.txt                          (Static)
○  /sitemap.xml                         (Static)
```

This is a healthy crawlability profile: every content-bearing route is either prerendered (○/●) or a legitimate on-demand server render (`/properties` is `ƒ` only because it reads `searchParams`, which is expected and fine — it still returns fully server-rendered HTML with real `<title>`/canonical/JSON-LD per request, verified below). `revalidate = 60` on the two SSG detail routes (`src/app/properties/[slug]/page.tsx:32`, `src/app/blogs/[slug]/page.tsx:24`) means new Firestore content shows up within a minute without a full redeploy — good ISR setup.

### 1.2 Server Component / metadata audit — page by page

I inspected every `page.tsx` in `src/app` (there are 10, plus `layout.tsx`, `robots.ts`, `sitemap.ts`, `manifest.ts`, `opengraph-image.tsx`, `icon.tsx` — this is the complete route surface, confirmed with `find src/app -type d`, no hidden admin/CRM routes exist under `src/app`).

| Route | Server Component? | `generateMetadata`/`metadata` | Canonical | JSON-LD |
|---|---|---|---|---|
| `/` (`src/app/page.tsx`) | Yes | Yes (static `buildMetadata`) | Yes | LocalBusiness (root layout) |
| `/about` | Yes | Yes | Yes | Breadcrumb |
| `/contact` | Yes (renders client `ContactPageContent`) | Yes | Yes | Breadcrumb |
| `/blogs` | Yes | Yes | Yes | Breadcrumb |
| `/blogs/[slug]` | Yes | Yes (`generateMetadata`, per-post) | Yes | BlogPosting + Breadcrumb |
| `/properties` | Yes | Yes (`generateMetadata`, facet-aware) | Yes | ItemList + Breadcrumb |
| `/properties/[slug]` | Yes | Yes (`generateMetadata`, per-listing) | Yes | RealEstateListing-style (`propertySchema`) + Breadcrumb |
| `/locations/[slug]` | Yes | Yes (`generateMetadata`, per-town) | Yes | ItemList + Breadcrumb |
| **`/locations`** | **No — `'use client'`** | **No — none at all** | **No** | **None** |

**Finding — `/locations` regression (confirmed, not just suspected):** `src/app/locations/page.tsx:1` opens with `'use client'` and fetches its data in a `useEffect` (`getAllLocations().then(setLocations)`, lines 19–24). The file contains this comment at line 12–13:

> `// NOTE: metadata must stay in a sibling server component or layout.`
> `// This page is now a client component so metadata is handled in the layout.`

That plan was never completed — there is **no `layout.tsx` inside `src/app/locations/`** (confirmed via directory listing: the folder contains only `page.tsx` and `[slug]/`). The page therefore falls through to the root layout's `defaultMetadata` with no override. I confirmed this against the actual production build output (`.next/server/app/locations.html`):

```html
<title>Group 24 Reality — Plots, Villas &amp; Flats in Behror, Neemrana &amp; Kotputli</title>
<link rel="canonical" href="https://www.group24reality.com"/>
```

That is byte-identical to the homepage's title and canonical. `/locations` is arguably the single best local-SEO landing page opportunity on the whole site (it's the natural target for "real estate Behror Neemrana Kotputli"-style head terms), and right now Google sees it as a duplicate of the homepage with no unique signal. It also has **zero H1 tags** in its rendered HTML (see 1.4) and no breadcrumb/JSON-LD, unlike every other route. This is the same *class* of defect as the "doubled title suffix" bug the prior work fixed elsewhere, just a different mechanism (missing metadata + client-side data fetching, rather than a duplicated string) — worth fixing the same way the others were.

Note this page also has a UX/crawl cost independent of SEO: because location data loads client-side via `useEffect`, a no-JS or slow-JS crawl of `/locations` sees only the loading skeleton, not the three towns' content. `/locations/[slug]` doesn't have this problem — it's a proper server component.

Everything else on the table above is genuinely solid: all use `buildMetadata`/`generateMetadata` from `src/lib/seo.ts`, all set an explicit canonical, all render server-side.

### 1.3 Title tag audit — one page still has the "doubled suffix" bug, and there's a mechanism worth understanding

I checked how title templating actually resolves in this Next 16 app rather than assuming. Root layout (`src/app/layout.tsx:20`) sets `metadata = defaultMetadata`, and `defaultMetadata.title` (`src/lib/seo.ts:8-11`) is `{ default: '...', template: '%s | Group 24 Reality' }`. Per Next's own docs (`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md:285-289`): a parent layout's `title.template` **does** apply to any child segment that supplies a plain string title (not `{ absolute }`), but it does **not** apply to a page at the *same* segment as the layout defining it (i.e., the root `page.tsx` is exempt from the root layout's own template).

`buildMetadata()` (`src/lib/seo.ts:51-60`) always returns `title` as a plain string via object spread, so every page below the root inherits the `%s | Group 24 Reality` suffix automatically. I verified actual rendered output for each page:

- `/` → `Group 24 Reality — Plots, Villas & Flats in Behror, Neemrana & Kotputli` (no suffix — correctly exempt, same segment as root layout)
- `/blogs` → `Real Estate Blog — Investment Guides & Market Insights | Group 24 Reality` — correct, single brand mention
- `/contact` → `Contact Us — Behror & Gurugram Office | Group 24 Reality` — correct
- `/locations/behror` → `Real Estate in Behror, Rajasthan — Plots, Villas & Flats | Group 24 Reality` — correct
- **`/about` → `About Group 24 Reality — Trusted Real Estate Consultant in Rajasthan | Group 24 Reality`** — **"Group 24 Reality" appears twice** because the page's own title string (`src/app/about/page.tsx:9`) already starts with the brand name, and the template then appends it again.

This is a small, one-line fix (either drop "Group 24 Reality" from the start of the `/about` title string, or set `title: { absolute: '...' }` to opt that page out of the template) but it is a live, confirmed instance of the exact bug class the prior sessions believed they'd fully eliminated. I did not find this pattern on any other page — it's isolated to `/about`.

### 1.4 Heading hierarchy

Checked every `<h1>` in the codebase (`grep -rn "<h1" src`) and cross-referenced against rendered build output:

- `/` — one H1, in `HeroSection.tsx:36` ("Find Your Perfect Plot, Villa or Flat in Behror, Neemrana & Kotputli"). Confirmed present in the static HTML despite `HeroSection` being a client component — Next SSRs it. Fine.
- `/about` — one H1 (`src/app/about/page.tsx:72`). Fine.
- `/contact` — one H1 (`ContactPageContent.tsx:169`). Fine.
- `/blogs` — one H1, inside `BlogsListClient.tsx:66`. Fine.
- `/blogs/[slug]` — one H1 (`src/app/blogs/[slug]/page.tsx:101`, the post title). Fine.
- `/properties/[slug]` — one H1, inside `PropertyOverview.tsx:49` (the listing title). Fine.
- `/locations/[slug]` — one H1, via `SectionHeader` with explicit `headingAs="h1"` (`src/app/locations/[slug]/page.tsx:87`). Fine.
- **`/locations` — zero H1s.** `SectionHeader`'s `headingAs` prop defaults to `'h2'` (`src/components/ui/SectionHeader.tsx:22`), and `src/app/locations/page.tsx:32-37` doesn't override it. Confirmed against build output — `grep -c '<h1' .next/server/app/locations.html` returns 0. Same root cause as 1.2/1.3: this page just never got the same finishing pass as its siblings.
- `/properties` — no H1 found in `PropertiesPage`/`PropertyResults` (`src/app/properties/page.tsx`); the `SectionHeader` there (line 103-109) also doesn't pass `headingAs="h1"`, so it renders as H2. Worth a one-line fix (`headingAs="h1"`) alongside the `/locations` fix — same component, same missing prop, same effect.

So: 7 of 9 routes have correct single-H1 structure; `/locations` and `/properties` both render zero H1s because `SectionHeader` isn't told to use one.

### 1.5 JSON-LD / structured data

`src/lib/schema.ts` is genuinely thorough: `localBusinessSchema()` emits a `@graph` with two distinct `LocalBusiness`/`RealEstateAgent` entries (Behror main office, Gurugram head office) with separate `@id`s, addresses, and phone numbers — correctly scoped in the root layout so it's present on every page. `breadcrumbSchema()` is used consistently on every server-rendered route. `propertySchema()`, `itemListSchema()`, and `blogPostingSchema()` all check out and are wired into the right pages. One accurate self-documented caveat in the code itself (`schema.ts:57-58, 91`): the Behror office has an approximate lat/long flagged for verification, and the Gurugram office has **no geo-coordinates at all** ("No verified lat/long yet for this address — omit rather than guess"). That's a genuine gap worth closing — see Part 3.

`FAQPage` schema is correctly wired: `FAQSection.tsx:8,100` imports `faqPageSchema()` and renders it via `JsonLd`, and I confirmed it actually appears in the server-rendered homepage HTML (`grep -o '"@type":"FAQPage"' .next/server/app/index.html` matches) — despite `FAQSection` itself being a client component, Next SSRs it same as the `HeroSection` H1 in 1.4, so this is not a gap. The one real gap: no `AggregateRating`/`Review` schema anywhere on the site, even though a `Testimonials` component renders testimonial content on the homepage — that content has no matching structured data.

### 1.6 Images

No raw `<img>` tags anywhere in `src` (confirmed by grep — zero matches), and no references to `images.unsplash.com` or any other hotlinked domain in `src` (zero matches). Every image use goes through `next/image`, and `alt` text is present everywhere `next/image` is used (`ImageGallery.tsx`, `PropertyCard.tsx`, `LocationSection.tsx`, `LocationHighlights.tsx`, `AnimatedHeroBackground.tsx`, blog cover images). The self-hosting migration described in the prior work is real and complete.

One loose end: `next.config.ts:5-16` still declares `remotePatterns` for `images.unsplash.com` and `plus.unsplash.com`, even though nothing in `src` references those hosts anymore. Harmless (an unused allowlist entry, not a live hotlink), but worth removing as cleanup since it's the one piece of evidence in the repo that unsplash hotlinking used to happen — leaving it doesn't cause any SEO problem, just dead config.

### 1.7 Firestore composite indexes — bigger gap than the changelog suggests

The prior work's changelog credits itself with fixing one specific missing index (`locationSlug + status + postedAt`), and that index **is** present in `firestore.indexes.json` (lines 43-51) — confirmed. But I read the actual query builder, `getAllProperties()` in `src/lib/firestore/properties.ts:28-76`, against the full filter surface exposed by `src/components/properties/PropertyFilters.tsx`, and the picture is bigger than one index.

`PropertyFilters.tsx` (lines 8-42) exposes five independent, freely-combinable filters: **Location** (behror/neemrana/kotputli), **Property Type** (plot/villa/flat), **Budget** (four price bands, i.e. `price >=` and `price <=` range filters), **Bedrooms** (1–4+), and **Status** (available/under-negotiation). Because each filter's `<select>` fires `apply()` independently (`PropertyFilters.tsx:122-126`) and `apply()` preserves whatever the other filters are currently set to, a user can and will land on URLs combining any subset of these — e.g. `?location=neemrana&type=villa&bedrooms=3` or `?minPrice=2000000&maxPrice=5000000&status=available`.

`getAllProperties()` builds one `where()` clause per present param and **always** appends `orderBy('postedAt', 'desc')` (line 63). Under Firestore's rules, any combination of an equality/range filter with an `orderBy` on a different field needs its own composite index — single-field automatic indexes don't cover it. Comparing the filter surface against what's actually declared in `firestore.indexes.json` (`properties` collection, lines 3-51):

- Indexed: `isFeatured+postedAt`, `type+postedAt`, `status+postedAt`, `locationSlug+status+postedAt`.
- **Not indexed, but reachable from the live filter UI:** `price` (Budget filter) `+postedAt`, `bedrooms+postedAt`, and every 2-and-3-way combination of location/type/status/bedrooms/price beyond the single `locationSlug+status` case — e.g. `locationSlug+type+postedAt`, `type+status+postedAt`, `locationSlug+bedrooms+postedAt`, and so on.
- Also present but **not matching any field the code actually queries**: indexes on `location+postedAt` (line 15) and `locationId+postedAt` (line 23). The live code exclusively filters on `locationSlug` (confirmed in `properties.ts:41`) — these two entries appear to be dead/stale indexes for field names the schema doesn't use, not usable for anything the app currently does.

**Practical impact, and it differs by page:**
- `/properties?...` (`src/app/properties/page.tsx:78-86`) calls `getAllProperties()` with **no `.catch()`** — an unindexed combination throws a Firestore `failed-precondition` error, which with no error boundary in that route will surface as a 500/error page for that filtered URL. That's worse for SEO than empty results: an error page is not something you want Google (or a user coming from a Map Pack click into a filtered link) to land on.
- `/locations/[slug]/page.tsx:56` and `getRelatedByLocation()` (`properties.ts:99-116`) both wrap the call in `.catch(() => [])` — so on those pages, a missing index degrades to **silently empty results** rather than an error, same failure mode the changelog describes for the original bug, just now possible on more field combinations than the one that was fixed.

Bottom line: the specific index the changelog claims credit for is real, but it only covers one of the many filter combinations the current UI actually produces. Someone should enumerate the combinations `PropertyFilters` can actually generate (or simplify the filter UX to reduce the combinatorial surface) and add the composite indexes for all of them, then confirm via the Firebase console that this is deployed to the live project — the task brief's note that deployment status is unconfirmed applies here too, and it's a bigger deploy than the changelog implies.

### 1.8 Everything else checked

- `robots.ts` — clean, allows all, points to sitemap + host. No issues.
- `sitemap.ts` — dynamically pulls locations/properties/blogs from Firestore with sane fallbacks if Firestore is unreachable at build time, reasonable priorities/changefreq. No issues.
- `manifest.ts`, `opengraph-image.tsx`, `icon.tsx` — present, generate correctly (all show as `○ Static` in the build).
- `api/public/submit-lead` — correctly a dynamic API route, not part of the crawlable surface, no SEO concern.

---

## Part 2: Market Benchmark — Local Real Estate SEO in 2026

### 2.1 What actually drives Map Pack + organic rankings for town-level real estate queries

Multiple current sources converge on the same weighting: **Google Business Profile signals are the single largest lever** in local pack ranking (cited around 32% of ranking weight, with primary category as the most influential individual factor), followed by on-page signals (~19%), review signals (~16%), link signals (~15%), behavioral and citation signals making up the rest ([The Blueprint Training](https://theblueprint.training/local-seo/), [Whitespark 2026 Local Search Ranking Factors Report](https://whitespark.ca/local-search-ranking-factors/)). Concretely, for a query pattern like "plots in Neemrana" or "property in Behror," Google is deciding *local pack* placement almost entirely from GBP completeness/category/reviews/proximity, and *organic page-1* placement from a mix of on-page relevance plus authority signals. **This is the single most important framing for this report: no amount of code work moves the GBP-driven 32%.**

Reviews specifically: 2026 sources emphasize *recency and pace* of reviews over raw volume, plus response rate, as stronger signals than they used to be ([Local Falcon 2026 guide](https://www.localfalcon.com/blog/guide-to-the-future-of-local-search-in-2026-local-ranking-factors--expert-local-seo-approaches)).

### 2.2 What top-ranking Indian real estate pages actually implement

I fetched live competitor pages rather than relying on general SEO advice. `99acres.com` and `squareyards.com` blocked automated fetches (403), but `realestateindia.com`'s Behror hub page (a smaller, independent competitor closer to Group 24 Reality's own scale than the national portals) was fetchable and instructive:

- **Heading structure**: single clear H1 ("Properties, Agents & Real Estate Services in Behror") with H2-level sections for sub-localities.
- **Locality breadth over depth**: the page links out to 7+ sub-localities within Behror (Keshwana, NH-8, Sotanala, Jaipur Road, Gunti, RIICO Industrial Area, Nasarpur) each with property counts — a much finer-grained internal linking structure than Group 24 Reality's three-town model, though Group 24 Reality's narrower geographic footprint (three towns, two offices) makes a full sub-locality expansion optional rather than mandatory.
- **Trust/review signals directly on the local hub page**: a "Rating & Reviews of Behror" block showing an aggregate score (4 user ratings) with visible testimonial snippets — this is exactly the `AggregateRating`/`Review` schema gap identified in 1.5. Competitors are putting review content *on the geographic landing page itself*, not just on a generic testimonials section.
- **Agent/dealer directory**: six named local agents with logos, service areas, and listing counts displayed directly on the town page — a pattern Group 24 Reality could adapt cheaply (their two named contacts, Sunil Sangwan and the office structure, are already schema-marked but not surfaced as visible on-page trust content the way this competitor does it).

(Source: [realestateindia.com Behror hub](https://www.realestateindia.com/behror-property/), fetched and analyzed directly.)

General search results for "plots in Neemrana" and "property in Behror" (99acres, Square Yards, RealEstateIndia, Homeonline, Housing.com all rank) confirm the competitive set is the expected list of national portals plus a handful of independent local dealers — consistent with what the task brief anticipated. Group 24 Reality is not competing against zero incumbents; it's competing against portals with orders-of-magnitude more listings and domain authority, which reinforces that **local-pack/GBP and independent-site-specific long-tail content are the realistic wins**, not outranking 99acres on the head term "property in Behror" itself.

### 2.3 Schema/structured data depth expected in 2026

Current guidance is unambiguous that JSON-LD (which this site already uses exclusively — correct format) should extend to `Review`/`AggregateRating` on listings and to `FAQPage` on pages with genuine Q&A content, both for direct rich-result eligibility and because "in 2026, structured data unlocks AI Overview citations, Knowledge Graph entity recognition, and entity verification signals that Gemini, ChatGPT, Perplexity, and Claude rely on when generating AI answers" ([Realty AI real estate schema guide](https://www.realty-ai.com/blog/real-estate-schema-markup); [gwcontent 2026 structured data guide](https://www.gwcontent.com/blogs/news/structured-data-for-seo)). This directly matches the gap found in 1.5 — the `FAQPage` schema function exists in code but is never called, and there's no review schema anywhere despite a `Testimonials` component existing.

### 2.4 Content depth benchmark

Search-industry guidance for 2026 puts effective local landing pages in the 1,000+ word range with structured H2 coverage of price ranges and property types, and cites long-form content (3,000+ words) earning meaningfully more backlinks than short pages ([PageOptimizerPro word-count guide](https://www.pageoptimizer.pro/blog/how-long-should-seo-content-be-finding-the-ideal-word-count-for-ranking-success)). Group 24 Reality's `/locations/[slug]` pages (description + investment points + connectivity + infrastructure + property preview grid, per `LocationSection.tsx`) are reasonably substantial but have no FAQ block and no testimonial/review content — both cheap additions that would close the gap to what competitors visibly do (2.2) without needing portal-scale listing volume.

### 2.5 Google Business Profile — the single biggest lever, and it's not a code task

This is the most consequential finding in the whole report and it belongs entirely to the business owner, not the codebase:

- A multi-location business needs a **separate, individually verified GBP listing per physical office** — Behror and Gurugram each need their own, not one listing with two addresses ([NiceJob multi-location GBP guide](https://get.nicejob.com/resources/google-business-profile-multiple-locations)).
- **NAP consistency** between the GBP listings and the site is critical — and the codebase is already NAP-disciplined here: `schema.ts:8-12` explicitly documents that the LocalBusiness fields "must stay byte-identical to what's printed on the site... and to the Google Business Profile listings, since mismatched NAP data is a direct local-pack ranking penalty." That's the code side; someone still needs to confirm the two GBP listings themselves match this exactly.
- **Primary category selection is the single most influential individual signal** in the entire local ranking model — this needs to be chosen deliberately per office (e.g. "Real Estate Agency" / "Real Estate Consultant") and audited, not left at a default.
- Multi-location best practice explicitly warns against **copy-pasting the same description/photos across locations** — each GBP listing should have location-specific photos and description text, not a duplicate of the other office's.
- **Weekly Google Posts and monthly photo updates** are cited as materially affecting visibility ("5x more views" for actively updated profiles vs static ones) ([PinMeTo 2026 GBP playbook](https://www.pinmeto.com/blog/google-business-profile-best-practices-2026/)).
- **Review velocity and response rate** matter more than raw count in 2026 scoring.

None of this is a `git commit`. It's an ongoing operational task for whoever manages the business's Google presence.

### 2.6 Local citations (India-specific)

For an Indian real-estate business, the standard citation stack is Google Business Profile, JustDial, IndiaMART, Sulekha, and the real-estate-specific portals themselves (Housing.com, MagicBricks, 99acres) — all cited as carrying meaningful domain authority in the Indian search index specifically, distinct from Western citation norms where Yelp dominates ([w3era 2026 India business listings](https://www.w3era.com/blog/seo/free-business-listing-sites-india/)). The consistent theme across every source: **NAP accuracy across all of these matters more than the raw count of citations**.

### 2.7 Realistic ranking timeline

I did not find a source willing to give a hard number for this exact scenario, and I'm not going to invent one either. What the current research does support: **competition level and existing domain authority are the two dominant variables**, not effort alone — "a business with 10 high-quality local backlinks from a chamber of commerce, local news sites, and community organizations will consistently outrank a competitor with 200 irrelevant directory links" ([Backlinko 2026 local SEO guide](https://backlinko.com/local-seo-guide)). Case-study data points found (not averages, individual examples, treat as anecdote not benchmark): one rural-market agent case study reported a #1 county ranking within 6 months; another went from position #3 to #1 in 9 months after sustained content + citation work ([The Marketing Agency real estate SEO case studies](https://themarketingagency.ca/blog/25-real-estate-seo-case-studies-that-actually-moved-the-needle-and-what-you-can-learn-from-them/)). Given Group 24 Reality's competitive set includes national portals with far more domain authority (2.2), and assuming GBP + citation work starts now: **a realistic window for meaningful Map Pack visibility on town-level long-tail terms is on the order of 4-9 months of consistent GBP/review/citation activity, not weeks** — and outranking the national portals themselves on head terms ("property in Behror") should not be treated as a near-term goal at all. Long-tail, town+type-specific queries are the realistic target.

---

## Part 3: Prioritized Action Plan

### Lane A — Technical SEO (developer-actionable, in this codebase)

1. **Fix `/locations` — highest priority code fix.** Convert `src/app/locations/page.tsx` to a Server Component (fetch `getAllLocations()` server-side, same pattern already used correctly in `src/app/locations/[slug]/page.tsx`), add `generateMetadata`/`metadata` via `buildMetadata()`, add breadcrumb JSON-LD, and pass `headingAs="h1"` to its `SectionHeader`. This page currently duplicates the homepage's title/canonical and has no H1 — it should be one of the strongest local-intent pages on the site.
2. **Fix `/about`'s doubled title.** One-line change: either drop the leading "Group 24 Reality" from the title string in `src/app/about/page.tsx:9`, or set `title: { absolute: '...' }` there.
3. **Add `headingAs="h1"` to `/properties`' `SectionHeader`** (`src/app/properties/page.tsx:103-109`) — same missing prop as `/locations`.
4. **Firestore composite indexes — audit the full filter matrix, not just one combination.** Enumerate every field combination `PropertyFilters.tsx` can actually produce (location × type × price × bedrooms × status, in any subset) and add the composite indexes for all of them, not just `locationSlug+status+postedAt`. Remove the two dead indexes on `location`/`locationId` (fields the code doesn't use — likely stale from a prior schema). Then confirm deployment to the live Firestore project via the Firebase console — this still hasn't been verified live, and the scope of what's missing is larger than previously tracked.
5. **Add a `.catch()` around `getAllProperties()` in `src/app/properties/page.tsx`** so a still-missing index degrades to an empty state instead of an unhandled error/500 on a filtered URL — a stopgap alongside #4, not a replacement for it.
6. **Add `Review`/`AggregateRating` schema** wherever testimonial content is rendered (the `Testimonials` component on the homepage is the obvious first target) — directly matches what 2.2/2.3 found competitors doing and what 2026 guidance recommends for AI Overview / rich-result eligibility. (`FAQPage` schema is already correctly implemented and confirmed rendering — no action needed there.)
7. **Fill in the missing Gurugram office geo-coordinates** in `src/lib/schema.ts:91` (currently omitted, flagged in the code's own comment) — get an exact lat/long from Google Maps for that address.
8. Minor cleanup, not urgent: remove the now-unused `images.unsplash.com`/`plus.unsplash.com` `remotePatterns` entries from `next.config.ts` since nothing in `src` references those hosts anymore.

### Lane B — Content strategy (needs content production, not code)

1. Add FAQ content to `/locations/[slug]` pages, each with its own `FAQPage` schema block (the `faqPageSchema()` helper used on the homepage's FAQ section can be reused per-town) — town-specific Q&A like "Is X locality flood-prone," "What's the registry process for NRI buyers," etc.
2. Add testimonial/review content specifically tied to each town and each office — competitor pages (2.2) put review snippets directly on the geographic landing page, not just in a generic sitewide testimonials block.
3. Consider a locality-tier expansion under each town page (2.2's competitor benchmark shows sub-locality linking — e.g. specific sectors/colonies within Behror) if there's enough real listing density to support it; don't force it if there isn't.
4. Video/virtual-tour content: `tour360Url` already exists as a property-level field (used in `ImageGallery.tsx`) — worth confirming it's actually populated for active listings, since 2026 guidance consistently flags video/virtual tours as a differentiator competitors increasingly use.
5. Blog cadence: the four existing posts are well-built (proper metadata, BlogPosting schema, breadcrumbs — verified in 1.2), so the content *system* is ready; the gap is volume and regularity, which is a production commitment, not a technical one.

### Lane C — Off-page / local SEO (business-owner action, not code or content)

**This is where the real ranking work happens, and it cannot be done from this repository.**

1. Verify and fully complete **separate Google Business Profiles for both the Behror and Gurugram offices**, with accurate primary category selection, byte-identical NAP to the site (the code side is already correct — this is about matching the GBP listings themselves to it).
2. Establish a **review generation cadence** — recency and pace matter more than raw count per 2026 guidance; a steady trickle of new reviews with owner responses outperforms a one-time push.
3. **Weekly Google Posts + monthly photo refreshes** on both GBP listings — cited as a meaningful, low-cost lever.
4. Build **local citations**: JustDial, IndiaMART, Sulekha as first priority, plus Housing.com/MagicBricks/99acres business listings, all with NAP that exactly matches the site and GBP.
5. Pursue a small number of **high-relevance local backlinks** (local news, NH-48 corridor business/industrial associations, chamber-of-commerce-style organizations) over volume — quality local links reportedly outperform large batches of generic directory links.
6. Set realistic internal expectations: outranking 99acres/MagicBricks/Housing.com on head terms is not a near-term goal at this domain's current authority; the realistic win is Map Pack visibility plus long-tail organic terms ("2BHK flat Kotputli," "plot near RIICO Neemrana") over a period of several months of sustained GBP/review/citation work, not weeks.

---

## Bottom line

The technical foundation is genuinely close to solid — one real page-level regression (`/locations`), one small title bug (`/about`), two missing H1s, and a Firestore index gap wider than previously tracked. None of that is a redesign; it's a focused punch list. But fixing all of Lane A will not, by itself, move rankings — the market research in Part 2 is consistent and specific that ~32% of local ranking weight sits in Google Business Profile management alone, an area this codebase cannot touch. Technical SEO removes barriers; it does not create rankings. The highest-leverage work from here forward is Lane C, and it takes months of consistent effort, not a sprint.
