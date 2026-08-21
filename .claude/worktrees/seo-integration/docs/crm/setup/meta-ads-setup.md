# Meta Ads & Lead Ads — Setup

Extends the Meta Developer App created for WhatsApp (`docs/crm/setup/whatsapp-setup.md`)
with Ads and Lead Ads permissions. Campaign dashboard and Lead Ads auto-capture are
built; the post/boost composer is not (see note at the end).

## 1. Add permissions to the existing app

In the same Meta Developer App used for WhatsApp, add the **Marketing API** and
**Lead Ads Retrieval** products. Request `ads_read`, `leads_retrieval`, and
`pages_manage_ads` permissions on your System User token.

## 2. Lead Ads webhook

1. Meta Developer App → Webhooks → Page → Subscribe to the `leadgen` field.
2. Callback URL: `https://<your-domain>/api/webhooks/meta`
3. Verify token: set `META_WEBHOOK_VERIFY_TOKEN` in `.env.local` to match what you
   enter in Meta's webhook config.
4. Every Lead Ads form on your Facebook Page now auto-flows into the CRM's Pipeline,
   scored and assigned exactly like a website enquiry.

## 3. Environment variables

```
META_AD_ACCOUNT_ID=<numeric ad account ID, without the "act_" prefix>
META_PAGE_ACCESS_TOKEN=<permanent System User token with ads_read + leads_retrieval>
META_WEBHOOK_VERIFY_TOKEN=<any string, matches step 2>
```

## 4. Deploy the sync cron

`vercel.json` schedules `/api/cron/sync-meta-insights` hourly — it pulls campaign +
spend/impressions/clicks data into the `ad_campaigns` cache the dashboard
(`/admin/crm/marketing/meta`) reads from. Nothing renders until the first sync runs.

## Not built: post composer & boost

Creating/scheduling Facebook & Instagram posts and boosting them as ads needs image
upload to Storage, the Content Publishing API, and a scheduling UI — a substantial
addition on its own. The `outbox` queue already has a `meta_post` type reserved for
this; when you're ready to build it, the drain cron just needs a case added for that
type, following the same pattern as the WhatsApp send functions in
`src/lib/server/whatsapp.ts`.
