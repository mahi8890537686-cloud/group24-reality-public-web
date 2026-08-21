# Integration Layer

Companion to `docs/superpowers/specs/2026-08-07-real-estate-crm-design.md` §9. Covers all four external
integrations: WhatsApp Business Cloud API, Meta Ads + FB/Instagram publishing, property portals (99acres/
MagicBricks/Housing.com), and calling/IVR. All four share one inbound pipe and one outbound queue rather
than four bespoke integrations — this document is the shared design; provider-specific field mapping lives
in the phase plan that ships it (P2 for WhatsApp, P9 for the rest).

## 1. Why unified

Four providers, four webhook formats, four rate limits, four auth models — but the same three problems
every time: verify the sender, don't process the same event twice, and don't lose a message/lead if the
provider retries a delivery. Solving that once in a shared pipe is cheaper and more testable than four
separate solve-it-again implementations, and it means P9's providers get de-duplication and reliability for
free instead of re-deriving them.

## 2. Inbound pipe

```
POST /api/webhooks/{provider}
  1. Verify signature (provider-specific: Meta uses X-Hub-Signature-256 HMAC, IVR providers vary — see
     provider config in integration_accounts/{provider})
  2. Extract provider's event/message ID
  3. Write inbound_events/{providerEventId} with status: 'received'
     — document ID IS the idempotency key. If it already exists, ack 200 and stop (duplicate delivery).
  4. Route by payload shape:
       lead            → normalize → dedupe on phoneNormalized → upsert Contact → create Lead + Activity
       message         → upsert Contact → append wa_messages/{id} → Activity
       call            → upsert Contact (if matched) → calls/{id} → Activity
       delivery_status → patch existing wa_messages/{id}.status
  5. Mark inbound_events/{id}.status = 'processed' (or 'failed' with .error — never silently drop)
  6. Return 200 within the provider's timeout window (Meta: 20s) — do heavy work (scoring, automation
     rules) via a follow-up async trigger, not inline in the webhook handler
```

Route handlers live at `src/app/api/webhooks/[provider]/route.ts`, one file, provider-specific parsing
delegated to `src/lib/integrations/{provider}/parse.ts`.

## 3. Deduplication

Every inbound contact touchpoint normalizes phone to E.164 (`+91XXXXXXXXXX`) before lookup. `contacts` and
`leads` both index `phoneNormalized`. A new inbound lead with a matching `phoneNormalized` to an existing
open Contact does **not** create a second Contact — it appends a new `Lead` document linked to the existing
Contact and logs an Activity, so repeat enquiries from the same person accumulate on one profile instead of
fragmenting.

## 4. Outbound queue

```
outbox/{id}: { provider, type, payload, status: 'queued', scheduledFor?, attempts: 0 }
```
- Every outbound send (single WhatsApp message, template broadcast recipient, scheduled Meta post) writes
  one `outbox` document instead of calling the provider API directly from a request handler.
- A Vercel Cron job (`/api/cron/drain-outbox`, every 1–2 min) claims a batch of `queued` documents where
  `scheduledFor <= now`, sends them respecting the provider's rate limit (WhatsApp Cloud API: ~80 msg/sec
  tier-dependent; stay well under), and updates `status` to `sent` or `failed` with `attempts++`.
- Failed sends retry with exponential backoff up to a cap (3 attempts), then sit at `status: 'failed'` for
  manual review in the Marketing → Campaign History UI.
- This is what makes a 500-recipient broadcast safe: a single Vercel serverless invocation (10s–60s budget)
  never has to send 500 messages inline. The queue absorbs the volume across many short cron ticks.

## 5. Provider notes

### WhatsApp Business Cloud API (P2)
- Requires: verified Meta Business, WhatsApp Business phone number, permanent access token, phone number ID.
- Webhook payload: incoming messages + status updates (sent/delivered/read/failed) in one endpoint,
  distinguished by payload shape.
- Templates must be pre-approved in Meta Business Manager before use — `CrmTemplate.waTemplateId` stores the
  approved template's Meta-side identifier.
- Opt-out: inbound message body matching STOP-list keywords sets `contacts/{id}.isOptedOut = true`; outbox
  drain skips opted-out contacts unconditionally.

### Meta Ads + FB/Instagram publishing (P9)
- Requires: Meta Developer App, long-lived Page Access Token, Instagram Business Account ID, Ad Account ID.
- Lead Ads: Meta sends a webhook on new lead form submission → routes through the same `lead` inbound path.
- Campaign/insights data is pulled (not pushed) — a scheduled sync job (`/api/cron/sync-meta-insights`,
  hourly) calls `/insights` and upserts `ad_campaigns/{id}` (data-model.md P9). Never queried live from the
  dashboard — dashboard reads the cached `ad_campaigns` collection.
- Publishing (post/boost) writes to `outbox` with `type: 'meta_post'`, same drain mechanism.

### Property portals — 99acres / MagicBricks / Housing.com (P9)
- These are the least standardized: some offer webhook push, others require polling an API. Design assumes
  webhook-first with a polling fallback (`/api/cron/poll-portals`, every 15 min) per
  `integration_accounts/portal_{name}.config.pollUrl`.
- Highest duplicate-lead risk of any source (same enquiry can land from portal + WhatsApp click-through) —
  this is why phone-normalized dedupe (§3) is a shared, not per-provider, concern.
- Multi-account support (a business may have several portal listings accounts) — `integration_accounts`
  keyed by `{provider}_{accountId}`, not just `{provider}`.

### Calling / IVR (P9)
- Provider candidates: Exotel, Knowlarity, MyOperator (virtual number + click-to-call + call logging).
- Webhook fires on call completion with duration, recording URL, and the agent's virtual-number extension →
  maps to `ownerId` via a static extension→uid config in `integration_accounts/ivr.config.extensionMap`.
- Click-to-call from the CRM UI (Contact/Deal record panel) calls the provider's API to bridge the agent's
  and contact's numbers — this is an outbound API call, not an `outbox` queue item, since it's a real-time
  user action expecting an immediate response, not a batched send.

## 6. Configuration & secrets

```
integration_accounts/{provider}   // non-secret config only (data-model.md)
.env.local / Vercel env vars      // all tokens, API keys, webhook verify secrets
```
Never store a token in Firestore, even in an admin-only-readable collection — env vars are the only secret
store, consistent with the original implementation plan's stated security posture.

## 7. Failure visibility

`integration_accounts/{provider}.lastError` surfaces the most recent failure in the Marketing/Settings UI.
`inbound_events` with `status: 'failed'` and `outbox` with `status: 'failed'` are both queryable admin views
— nothing fails silently into a log no one reads.
