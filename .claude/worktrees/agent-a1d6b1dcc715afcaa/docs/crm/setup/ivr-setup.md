# Calling / IVR — Setup

The webhook (`/api/webhooks/ivr`) and `calls` collection are built and wired to log
every call as an Activity against the matched Contact. It's provider-agnostic by
design — Exotel, Knowlarity, and MyOperator all send different payload shapes, so
this doc is where you map your chosen provider's actual webhook fields onto the
normalized shape the route expects.

## Normalized payload the webhook expects

```json
{
  "callId": "unique-provider-call-id",
  "from": "+919876543210",
  "to": "your-virtual-number",
  "direction": "inbound | outbound | missed",
  "durationSeconds": 145,
  "recordingUrl": "https://...",
  "agentExtension": "101"
}
```

## Steps

1. **Pick a provider.** Exotel and Knowlarity are the most common for Indian real
   estate teams; MyOperator is simpler to set up but has fewer API options. All
   three offer virtual numbers, call recording, and webhook callbacks.
2. **Provision a virtual number** and assign each agent an extension.
3. **Map extensions to CRM users.** In `integration_accounts/ivr`, set:
   ```json
   { "enabled": true, "config": { "extensionMap": { "101": "<agent-uid>", "102": "<agent-uid>" } } }
   ```
4. **Configure the provider's webhook** to POST to `https://<your-domain>/api/webhooks/ivr`
   on call completion. If the provider's payload doesn't match the normalized shape
   above, add a small adapter at the top of the route handler translating
   provider-specific field names before the rest of the logic runs.
5. **Set `IVR_WEBHOOK_SECRET`** in `.env.local` and configure the same value in the
   provider's webhook settings (as a header or query param) so the endpoint isn't
   open to anyone who finds the URL.

## Click-to-call (not built)

Bridging an agent's and a customer's number in real time (tap a button in the CRM,
both phones ring) requires the provider's "originate call" API, which is
provider-specific enough that it wasn't built generically. Once a provider is
chosen, this is a small addition: a server route that POSTs to the provider's
originate-call endpoint with the agent's extension and the customer's number, then
the existing webhook logs the resulting call automatically.
