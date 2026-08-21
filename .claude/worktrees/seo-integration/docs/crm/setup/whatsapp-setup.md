# WhatsApp Business Cloud API — Setup

The CRM's WhatsApp integration (Conversations inbox, quick-send, broadcasts) is fully
built and wired to `/api/webhooks/whatsapp` and the outbox drain cron. It does nothing
until these steps are completed.

## 1. Create the Meta app

1. Go to [developers.facebook.com](https://developers.facebook.com) → **My Apps** → **Create App** → type **Business**.
2. Add the **WhatsApp** product to the app.
3. Under WhatsApp → API Setup, note the **temporary access token** and **Phone Number ID** — enough for testing with Meta's test number.

## 2. Go live with a real number

1. In Meta Business Manager, verify your business and add your WhatsApp Business phone number.
2. Generate a **permanent access token**: System Users → create one, assign it `whatsapp_business_messaging` + `whatsapp_business_management` permissions, generate a token with no expiry.
3. Note the production **Phone Number ID** (WhatsApp → API Setup, or Business Settings → Accounts → WhatsApp Accounts).

## 3. Configure the webhook

1. WhatsApp → Configuration → Webhook → **Edit**.
2. Callback URL: `https://<your-domain>/api/webhooks/whatsapp`
3. Verify token: any string you choose — put the same value in `WHATSAPP_VERIFY_TOKEN` below.
4. Subscribe to the `messages` field (covers both inbound messages and delivery-status updates).

## 4. Create a message template

Broadcasts and quick-send require **pre-approved templates** (Meta rejects free-form
text outside a 24-hour customer-initiated window):

1. WhatsApp Manager → Message Templates → Create Template.
2. Category: Marketing or Utility. Add `{{1}}` placeholders for variables (e.g. name).
3. Submit for review (usually approved within minutes to a few hours).
4. Once approved, create a matching entry in the CRM's **Templates** page
   (`/admin/crm/templates`, type `whatsapp`) with `waTemplateId` set to the exact
   template name from Meta.

## 5. Environment variables

Add to `.env.local` (and your Vercel project's environment variables for production):

```
WHATSAPP_PHONE_NUMBER_ID=<from step 1 or 2>
WHATSAPP_ACCESS_TOKEN=<permanent token from step 2>
WHATSAPP_APP_SECRET=<Meta App → Settings → Basic → App Secret>
WHATSAPP_VERIFY_TOKEN=<any string, must match step 3>
CRON_SECRET=<any string — protects /api/cron/* routes; optional but recommended>
```

## 6. Deploy the cron job

`vercel.json` already declares the outbox drain job (`*/2 * * * *`). **Frequent cron
schedules require a Vercel Pro plan** — on the Hobby tier, crons run at most once a
day, which makes broadcasts unusably slow. If staying on Hobby, either upgrade or
trigger `/api/cron/drain-outbox` from an external scheduler (e.g. a free
[cron-job.org](https://cron-job.org) ping) with the `Authorization: Bearer
$CRON_SECRET` header.

## Verify it's working

1. Send a WhatsApp message to your business number from your own phone — it should
   appear in `/admin/crm/conversations` within a few seconds.
2. Send a template via Quick-send from any Pipeline record's Overview tab — confirm
   the recipient receives it and the status progresses Sent → Delivered → Read in the
   Conversations thread.
3. Reply `STOP` from a test number — confirm that contact is excluded from the next
   broadcast's recipient count preview.
