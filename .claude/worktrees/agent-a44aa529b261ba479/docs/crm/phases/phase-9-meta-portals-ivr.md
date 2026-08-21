# Phase 9 — Meta Ads, Portals, IVR

**Release D (first phase). Depends on:** P2 (the shared webhook/outbox pipe must already exist — this
phase is three new consumers of it, not a new pipe). **Unblocks:** P10 (attribution data these integrations
produce feeds the source-breakdown rollups).

## Functional spec

The remaining three integrations from `docs/crm/integration-layer.md` §5, deferred to last because the CRM
is fully usable without them (Release A–C covers manual entry + WhatsApp). Ships all three in one phase
since they share the P2 pipe and the team should context-switch into "integrations mode" once, not three
times.

1. **Meta Ads.** Lead Ads auto-capture; campaign/insights dashboard (spend, impressions, clicks, CPM, CTR);
   post/boost publishing from the admin panel.
2. **Property portals (99acres/MagicBricks/Housing.com).** Enquiries auto-pulled into the unified inbox
   (P1) with source attribution and portal-specific dedupe.
3. **Calling/IVR.** Virtual number call logging, click-to-call from any record panel, recordings.

## Data model touched

New: `ad_campaigns`, `calls`. Reuses `integration_accounts`/`inbound_events`/`outbox` (P2). See
`docs/crm/data-model.md` §P9.

## Build steps — Meta Ads

1. **Meta Developer App setup (external).** Extend the existing WhatsApp Meta app (P2 already created one)
   with Ads/Pages permissions, or create a dedicated app if scopes conflict. Document in
   `docs/crm/setup/meta-ads-setup.md`.
2. **Lead Ads webhook routing.** Extend `src/app/api/webhooks/whatsapp/route.ts`'s sibling — actually a
   shared Meta webhook endpoint (`src/app/api/webhooks/meta/route.ts`) since Lead Ads and WhatsApp can share
   Meta's App-level webhook subscription infrastructure; route by payload's `field` value (`leadgen` vs
   `messages`). Routes through the same inbound pipe (integration-layer.md §2)'s `lead` path.
3. **`ad_campaigns` type + accessor.** Sync job `/api/cron/sync-meta-insights` (hourly) calling
   `/act_{account_id}/campaigns` + `/insights`, upserting `ad_campaigns` documents.
4. **Campaign dashboard UI.** `src/app/admin/crm/marketing/meta/page.tsx` — table from `ad_campaigns`
   (cached, never a live Meta API call from the dashboard render path), charts via existing Recharts setup.
5. **Post composer + boost UI.** Image/caption upload → writes to `outbox` (`type: 'meta_post'`) with
   optional `scheduledFor`; boost flow (select existing post → budget/audience/duration → launch as ad)
   calls Meta's Ad Set API directly from a server action (not queued — this is a one-time setup call, not a
   bulk send).

## Build steps — Property portals

6. **Per-portal `integration_accounts` config.** `portal_99acres`, `portal_magicbricks`, `portal_housing`
   (multi-account keyed by `{provider}_{accountId}` per integration-layer.md §5).
7. **Webhook + polling fallback.** `src/app/api/webhooks/portal/[provider]/route.ts` for portals offering
   push; `/api/cron/poll-portals` (15 min) for those requiring polling, per each account's `config.pollUrl`.
8. **Portal-specific dedupe hardening.** Portal enquiries are the highest duplicate-lead-risk source (master
   spec's integration-layer.md §5) — verify against P1's `phoneNormalized` dedupe with real portal data
   during this phase's manual verification, since portal phone formatting is inconsistent in practice.
9. **Source attribution in the inbox.** Confirm P1's unified inbox already surfaces `source` per lead
   (it does, by design) — no new UI needed, just new source values flowing in.

## Build steps — Calling / IVR

10. **Provider selection + setup (external).** Evaluate Exotel/Knowlarity/MyOperator on India coverage,
    pricing, and webhook reliability; document choice + setup in `docs/crm/setup/ivr-setup.md`.
11. **`calls` type + accessor.** `src/types/index.ts`, `src/lib/firestore/calls.ts`.
12. **Call webhook.** `src/app/api/webhooks/ivr/route.ts` — on call completion, maps the agent's extension
    to `ownerId` via `integration_accounts/ivr.config.extensionMap`, matches the caller number to a Contact
    via `phoneNormalized`, writes a `calls` doc + a mirrored `activities` entry (type `call`).
13. **Click-to-call UI.** Button in Contact/Deal record panels calling the provider's bridge-call API
    directly (real-time user action, not queued — per integration-layer.md §5's IVR note).

## Cross-cutting

14. **`firestore.indexes.json`.** `(ad_campaigns: status)`, `(calls: contactId, occurredAt desc)`,
    `(calls: agentId, occurredAt desc)`.
15. **`firestore.rules`.** `ad_campaigns`/`calls`: signed-in read, server-action-only write (both are
    externally-synced data, not user-entered).

## Manual verification

- Submit a test Meta Lead Ad form; confirm it lands in the unified inbox with `source: 'meta'` and correct
  contact details.
- Confirm the Meta campaign dashboard shows real spend/impression data matching Meta Ads Manager for a live
  test campaign.
- Publish a test post via the composer; confirm it appears on the connected FB Page/Instagram account.
- Trigger a test portal enquiry (or simulate the webhook payload if a live portal account isn't available
  for testing); confirm it lands in the inbox with correct source and doesn't duplicate an existing contact
  with the same phone in a different format.
- Place a test inbound and outbound call through the IVR number; confirm a `calls` record and matching
  Activity appear against the correct Contact and agent.
- Click-to-call from a Contact panel; confirm the bridge call connects.

## Automated checks

- `npm run build`, `npm run lint`.
- Unit tests for the Meta webhook payload router (leadgen vs. message field discrimination) and the portal
  phone-format normalization edge cases specific to whichever portals are actually connected.
