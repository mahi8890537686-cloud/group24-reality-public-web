# Local / Off-Page SEO Strategy — Group 24 Reality

Researched via OpenSEO (DataForSEO-backed) MCP tools, 2026-08-21. Goal: rank page 1 for local
real estate intent in Behror, Neemrana, and Kotputli (Delhi–Jaipur NH-48 corridor, Rajasthan).

## Headline finding

**Group 24 Reality has no Google Business Profile.** `get_business_profile` returned `null` for
"Group 24 Reality" within a 50km radius of Behror. For a local service business, GBP is normally
the single highest-leverage local-SEO asset — it's the thing that shows up in the Maps/local-pack
result, which is what most "near me" and "in Behror/Neemrana/Kotputli" searches actually surface.
Right now the business is invisible there while competitors, some with very thin web presences,
occupy those slots.

Local pack composition sampled via `get_local_serp_results`:

| Query | Location | Top result | Notes |
|---|---|---|---|
| "real estate agent" | Behror | Nakshatra Properties (4.6★/10) | Rank 1–20 almost all unclaimed or website-less |
| "plots for sale" | Neemrana | Residential Plots in Neemrana (wordpress site, 4.2★/5) | Eldeco Group (267 & 87 reviews) is the strongest player here |
| "property dealer" | Kotputli | Ganesham Garden Pvt Ltd (4.9★/7) | Apna Awas (4.9★/52) strongest claimed listing |

Only a handful of local competitors have a real website at all: `apnaawas.com`, `eldecogroup.com`,
`cmplaza.in`, `rkrealtygurgaon.com`, `skyearthrealty.wordpress.com`. Most rank-1–10 local pack
results are unclaimed, no-website listings. **The competitive bar to win the local pack here is
low** — a claimed, fully-populated, review-rich GBP tied to a technically sound website (the other
two agents' workstreams) can plausibly out-rank the incumbents within weeks, not the months this
fight would take in a saturated metro market.

---

## 1. Google Business Profile — top priority

**Primary listing address: the Behror main office, not the Gurugram head office.** Behror is the
actual service-area location where clients meet the team and where "near me" searches resolve
geographically; Gurugram is back-office/coordination only per `src/lib/schema.ts`. A GBP centered
on Gurugram would compete in the wrong city entirely.

Use this NAP block **exactly as printed in `src/lib/schema.ts`** — do not reformat, abbreviate, or
retype it, since mismatched NAP formatting across GBP/citations/site is itself a ranking penalty
the code comments already call out:

```
Business name: Group 24 Reality
Address: AA-111, Somnath City, Near Goonti Flyover, Delhi-Jaipur Highway, Behror, Rajasthan 301701
Phone: +91-9266982400
Email: info@group24reality.com
Website: https://www.group24reality.com
```

Setup checklist:
- **Category**: primary = "Real Estate Consultant"; secondary = "Real Estate Agency". (Do not use
  "Real Estate Agent" as primary — that's an individual-person category in GBP's taxonomy, and
  this is a firm.)
- **Service area**: add Behror, Neemrana, and Kotputli as served areas in addition to the pinned
  address, so the profile is eligible to surface for searches centered on Neemrana/Kotputli too,
  not just Behror.
- **Verification**: Google will offer postcard-by-mail (2–5 business days to the Behror address)
  or, if eligible given the business category/history, phone/email verification. Postcard is the
  most reliable path for a first-time local listing in India — start this immediately, it's the
  long pole.
- **Services list**: mirror `SERVICE_TYPES` from schema.ts — Residential Plot Sales, Villa Sales,
  Flat Sales, Property Consultancy.
- **Business hours**: Mon–Sat 9:00–19:00 (matches `OPENING_HOURS` in schema.ts — keep identical).
- **Photos**: minimum 10 at launch — office exterior/interior, Sunil Sangwan (builds trust, matches
  the site's "meet the founder" positioning), and 3–5 real (physically inspected) property photos
  per town. Listings with 100+ photos consistently outrank thin profiles in this result set
  (compare Eldeco Hillside's 619 photos, ranked #5 for "plots for sale" near Neemrana).
- **Posts**: weekly GBP Posts tied to real inventory or local news (see backlink section below) —
  this is a ranking signal and a cheap one.
- **Q&A seeding**: pre-populate the Q&A tab with the 5–6 questions already written for the site's
  FAQ section (once claimed, competitors and randoms can post there first if you don't).
- **Website field**: link to the homepage; once location pages are live, add UTM-tagged links in
  individual GBP Posts pointing to `/locations/behror`, `/locations/neemrana`, `/locations/kotputli`.

---

## 2. Local citations

Build these in the order listed — real-estate-vertical directories first (they carry the most
topical relevance signal), then general local directories. Paste the identical NAP block from
Section 1 into every one; do not let any platform auto-format the phone number differently.

**Tier 1 — real estate vertical (do first):**
1. 99acres — free business listing + agent profile
2. MagicBricks — free agent/dealer profile
3. Housing.com — free dealer profile
4. IndiaMART — good for the "property consultancy/services" angle, indexes well for B2B-style
   investment-property queries

**Tier 2 — general local directories:**
5. JustDial — very high domain authority in India, frequently outranks small business sites
   directly for "near me" queries; claim and fully complete the profile
6. Sulekha — similar profile, pair with JustDial
7. Bing Places — low effort, often skipped by competitors, easy incremental win
8. Facebook Page (already exists per `SAME_AS` in schema.ts — `facebook.com/group24reality`) —
   confirm it has the identical NAP in its About section, not just a link to the site

**Tier 3 — nice to have:**
9. Google Maps direct "Suggest an edit" cleanup on any stray/duplicate listings that may already
   exist for this business (search Maps for "Group 24 Reality" before publishing GBP, to make sure
   you're not creating a duplicate that will later need merging)
10. Sector 37C / Gurugram-specific business directories for the head office, secondary priority

Track completion in a simple checklist (spreadsheet or the project's admin panel) — citation
consistency is checked periodically by tools like Moz Local / Whitespark if budget allows a paid
audit later.

---

## 3. Review generation (external Google reviews)

Separate concern from the site's own testimonials section — `src/lib/schema.ts` already flags
that the *on-site* testimonials are placeholder demo data (4 seeded docs), which the on-page agent
is handling. This section is specifically about **real Google reviews on the GBP listing itself**,
which currently has zero.

Group 24 Reality claims 500+ past clients over 8+ years — that's a large, mostly untapped review
base. Concrete tactic:

- **Timing**: ask at the moment of maximum goodwill — immediately after registry/final handover,
  not months later. Build this into the existing lead/deal workflow as a checklist step.
- **Direct link**: once GBP is verified, generate the short review link from the Google Business
  Profile dashboard (`g.page/r/.../review`) and send it via WhatsApp (the business already has a
  WhatsApp number wired up — `WhatsAppFAB.tsx` / `buildWhatsAppLink`) rather than email; WhatsApp
  has far higher completion rates for this audience.
- **Volume target**: match or exceed the two strongest local competitors seen in this research —
  Apna Awas (52 reviews, 4.9★) and Eldeco (267 & 87 reviews across two locations) — as the
  benchmark for what "competitive" looks like in this specific market. Even 20–30 genuine reviews
  would likely leapfrog most of the unclaimed/low-review competitors currently occupying the local
  pack.
- **Response**: reply to every review (positive or negative) from the owner account — response
  rate/recency is itself a minor ranking factor and signals an actively managed listing.
- **No incentivized/fake reviews** — Google routinely purges these and it risks the listing itself;
  given how thin the competition's review counts are, genuine reviews from the real 500+ client
  base are more than enough to win here without the risk.

---

## 4. Backlink / off-page opportunities

- **Kotputli-Behror district news hook**: keyword research surfaced that Kotputli-Behror is now an
  official separate administrative district (recent state-level reorganization). This is a
  genuinely timely, linkable local-news angle — a well-written explainer ("What the new
  Kotputli-Behror district means for property buyers and investors") is the kind of content local
  news outlets, Rajasthan real-estate blogs, and NH-48 corridor community groups will link to
  organically if pitched. Coordinate with the on-page agent's content plan — this should exist as
  a real page/post before pitching it anywhere.
- **Local business associations**: Behror/Neemrana/Kotputli trader/industry associations (Neemrana
  has an active industrial-area RIICO business community given the Japanese Zone development) —
  membership listings often include a backlink.
- **Builder/developer partnerships**: several competitors identified here are builders, not just
  dealers (Eldeco, Trehan, Labana Homes, Bhoomi Properties). A referral/co-marketing relationship
  with one or two (Group 24 Reality lists their inventory, they link back as an authorized/partner
  dealer) is a realistic, non-competitive backlink source since Group 24 Reality's positioning is
  consultancy/brokerage, not building.
- **Guest posts**: Rajasthan real estate and NH-48-corridor investment blogs (search
  "Neemrana industrial corridor investment blog", "Rajasthan real estate blog guest post") — pitch
  the founder's 8-years-local-market angle as the expert-author hook.
- **NH-48/Delhi-Jaipur corridor context links**: any coverage of the expressway, industrial
  development (Neemrana Japanese Zone, RIICO), or the Kotputli-Behror district split is a natural
  place to be cited as the local expert source — set up a Google Alert for these terms and pitch
  quote/data availability to journalists covering them.

---

## 5. Geo-pin verification checklist

`src/lib/schema.ts` has two `GeoCoordinates` blocks (Behror: `27.8904, 76.2782`; Gurugram head
office: `28.454462, 76.991089`), both explicitly commented as **approximate**, sourced from
address lookups rather than a verified pin. Do not edit the file as part of this off-page
workstream — hand this checklist to whoever owns schema.ts (technical agent / a dev) once GBP
exists:

1. Complete GBP verification for the Behror address (Section 1).
2. Open the live GBP listing on Google Maps once approved; right-click the exact pin → copy the
   lat/long Google itself assigned to the verified listing.
3. Compare against the current `27.8904, 76.2782` in `behrorOfficeSchema()` — replace if they
   differ by more than a few meters (a mismatch here can cause the JSON-LD geo to point to a
   different spot than the GBP pin, which is a consistency signal search engines do check).
4. Repeat for the Gurugram head office if/when a GBP is created for it (lower priority — it's
   back-office only, not a client-facing location, so a GBP there arguably shouldn't be created at
   all; consider whether it should stay unlisted rather than diluting local-pack relevance in the
   wrong city).
5. Update the code comment once verified, removing the "Approximate" caveat so future readers know
   the value is trustworthy.

---

## Summary for combined report

**Biggest gap**: no Google Business Profile exists at all for a business whose entire strategy
depends on local "near me" / town-name search intent. **Single highest-priority action: claim and
verify a Google Business Profile at the Behror main-office address** (NAP exact block in Section 1
above), then drive real reviews from the existing 500+ client base via WhatsApp. Local-pack
competition here is unusually weak — most competitors are unclaimed or website-less — so this one
action is likely to move the needle faster than anything else in this plan.
