# Phase 2 — Integration Layer + WhatsApp

**Release A. Depends on:** P0, P1 (Contact/Lead must exist to attach messages to). **Unblocks:** P9 (reuses
this phase's shared pipe for Meta/Portals/IVR), gives P3+ "quick WhatsApp" actions from any record panel.

## Functional spec

Ships the shared inbound/outbound integration pipe (`docs/crm/integration-layer.md`) and its first, highest-
value consumer: WhatsApp Business Cloud API, already partially typed in the existing codebase
(`WaMessage`, `WaCampaign`).

1. **Two-way conversation view.** Per-contact chat thread — inbound and outbound WhatsApp messages in one
   timeline, feeding the same `ActivityTimeline` component from P0/P1.
2. **Quick-send.** One-click template message from any Contact/Lead/Deal record panel.
3. **Broadcast campaigns.** Select a template → filter audience (tag/stage/location, reusing P1's facet
   filters) → preview recipient count → send. Safe at scale via the outbox queue.
4. **Delivery tracking.** Sent/Delivered/Read status per message, per campaign aggregate.
5. **Opt-out handling.** STOP-keyword detection; opted-out contacts are permanently excluded from broadcasts.
6. **Template management.** Extend the existing Templates module (`CrmTemplate`, already built) to manage
   WhatsApp-approved template IDs.

## Data model touched

New: `integration_accounts`, `inbound_events`, `outbox`. Unchanged shape, now actually wired: `wa_messages`,
`wa_campaigns` (already exist in `src/types/index.ts`).

## Build steps

1. **Meta setup (external, not code).** Create Meta Developer App, verify WhatsApp Business number, obtain
   phone number ID + permanent access token. Document the exact steps + screenshots in
   `docs/crm/setup/whatsapp-setup.md` (written during this phase, not before — avoids documenting an
   unverified process).
2. **`integration_accounts`/`inbound_events`/`outbox` types + accessors.** `src/types/index.ts`,
   `src/lib/firestore/integrations.ts`.
3. **Webhook route.** `src/app/api/webhooks/whatsapp/route.ts` — signature verification
   (`X-Hub-Signature-256` HMAC against the app secret, env var), idempotent write to `inbound_events`,
   route by payload shape (message vs. status update) per integration-layer.md §2.
4. **Contact/Lead upsert on inbound message.** New inbound WhatsApp number with no matching
   `phoneNormalized` → create a minimal Contact (`source: 'whatsapp'`) + Lead; matching number → append to
   existing Contact's timeline. Reuses P1's dedupe path exactly.
5. **Outbox drain cron.** `src/app/api/cron/drain-outbox/route.ts`, scheduled via `vercel.json` cron
   config (every 1–2 min). Sends via WhatsApp Cloud API (`POST
   https://graph.facebook.com/v20.0/{phone_number_id}/messages`), rate-limited batch size, updates
   `outbox`/`wa_messages` status.
6. **Conversation view UI.** `src/app/admin/crm/conversations/page.tsx` — contact list (unread-first) +
   thread panel. Thread renders from `wa_messages` filtered by `contactId`, styled as a chat bubble list
   (this is the one place a custom timeline render replaces the generic `ActivityTimeline`, since chat
   bubbles need left/right alignment by direction — still logs a mirrored `Activity` for cross-module
   visibility).
7. **Quick-send component.** `<WhatsAppQuickSend>` — template picker + variable-fill preview, mounted in
   `<RecordPanel>`'s action bar. Writes one `outbox` doc.
8. **Broadcast builder UI.** `src/app/admin/crm/marketing/whatsapp/page.tsx` (extends existing marketing
   stub) — template select → audience filter (reuse P1 facet filter component) → recipient count preview
   (`getCountFromServer` on the filtered query) → confirm → writes N `outbox` docs, one `wa_campaigns` doc
   with `targetCount`.
9. **Campaign history + delivery bars.** Table of `wa_campaigns` with sent/delivered/read rate bars,
   computed from the campaign's own counters (`sentCount`/`deliveredCount`/`readCount`, updated by the
   webhook status-update path — same rollup-on-write pattern the money model uses, not summed at read time).
10. **Opt-out enforcement.** Webhook message handler checks body against a STOP-keyword list; sets
    `isOptedOut`. Outbox drain cron filters `isOptedOut == true` contacts out before sending, and the
    broadcast builder's recipient preview excludes them so the count shown matches what actually sends.
11. **Template management UI.** Extend existing Templates page: add WhatsApp-type template form fields
    (`waTemplateId`, variable list, approval status badge).
12. **`firestore.indexes.json`.** `(wa_messages: contactId, sentAt desc)`, `(outbox: status, scheduledFor)`,
    `(wa_campaigns: status, createdAt desc)`.
13. **`firestore.rules`.** `inbound_events`/`outbox` writable only by server actions (admin SDK bypasses
    rules; client rule = read-only for signed-in users, no client writes at all).

## Manual verification

- Send a test WhatsApp message to the business number; confirm it appears in the Conversation view within
  the webhook's response time, and a Contact/Lead is created if the number is new.
- Send a template message via Quick-send from a Contact panel; confirm delivery status progresses
  Sent → Delivered → Read as the test recipient receives and opens it.
- Build a broadcast to a 3-contact filtered audience; confirm the preview count matches, and all 3 receive
  the message via the outbox drain (check `outbox` documents transition `queued → sent`).
- Reply STOP from a test number; confirm `isOptedOut` flips and that number is excluded from a subsequent
  broadcast's preview count.
- Kill the webhook's signature check deliberately (wrong secret) in a local test; confirm it's rejected, not
  silently accepted.

## Automated checks

- `npm run build`, `npm run lint`.
- Unit test for the webhook signature verification function and the STOP-keyword matcher (pure functions,
  no live Meta call needed).
