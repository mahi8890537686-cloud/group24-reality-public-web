# CRM Panel Implementation Plan — Group 24 Reality

Full-featured, industry-standard Real Estate CRM embedded inside the admin panel.

---

## Overview

The CRM will be organized as a separate top-level section in the admin sidebar: **Admin → CRM** with 7 core modules, built in Next.js (same stack), using Firestore as the database and REST API integrations for Meta and WhatsApp Business.

---

## Module Architecture

```
/admin/crm/
├── dashboard          ← CRM Overview & KPIs
├── contacts           ← Unified Contact Book
├── leads              ← Already exists — enhanced
├── enquiries          ← Already exists — enhanced
├── marketing/
│   ├── overview       ← Campaign list & stats
│   ├── meta           ← Meta (FB + Instagram) Ads & Posts
│   └── whatsapp       ← WhatsApp Broadcast & Conversations
├── templates          ← Message & Post Templates
└── reports            ← Analytics & Reports
```

---

## 1. 🏠 CRM Dashboard

A premium "command center" view with real-time KPIs.

### Key Widgets
| Widget | Data Source |
|---|---|
| Total Contacts | `contacts` collection |
| New Leads (Today / 7d / 30d) | `leads` collection |
| Pending Follow-ups | Leads/Enquiries with `status=contacted` |
| WhatsApp Messages Sent Today | `wa_messages` collection |
| Meta Ad Spend (current month) | Meta Ads API |
| Campaign Impressions & Clicks | Meta Ads API |
| Lead Source Breakdown (Pie Chart) | `leads` aggregation |
| Enquiry Funnel (Bar Chart) | `enquiries` + `leads` |

### Design
- Dark navy sidebar, white card grid
- **Recharts** library for charts
- Animated live counters for KPIs
- Color-coded status indicators

---

## 2. 👤 Contacts Module

Unified contact book combining leads + enquiries into one profile view.

### Features
- Contact card with full history: all leads submitted, enquiries, WhatsApp messages
- **Tags**: Investor / First-time buyer / NRI / Builder
- **Pipeline stage**: New → Contacted → Site Visit → Negotiation → Closed Won / Lost
- Contact notes + activity timeline
- Bulk import via CSV
- Export to Excel/CSV

### Firestore Schema
```
contacts/{id}
  name: string
  phone: string (index)
  email?: string
  tags: string[]
  stage: 'new' | 'contacted' | 'site-visit' | 'negotiation' | 'won' | 'lost'
  source: 'lead' | 'enquiry' | 'manual' | 'import'
  assignedTo?: string (agent name/id)
  notes: string
  lastContactedAt: Timestamp
  createdAt: Timestamp
  linkedLeadIds: string[]
  linkedEnquiryIds: string[]
```

---

## 3. 📞 Leads Module (Enhanced)

Building on the existing `/admin/leads`, add:

- **Kanban Board view**: Drag-and-drop across pipeline stages
- Quick-call button (tap phone number to dial)
- WhatsApp quick-message button per lead (pre-filled template)
- **Lead Score**: Auto-calculated from property price, recency, message length
- Assign to agent
- Follow-up date + reminders
- Bulk status update

---

## 4. 📬 Enquiries Module (Enhanced)

Building on the existing `/admin/enquiries`, add:

- Convert enquiry → Contact with one click
- Link to a specific property / project
- Response time tracking (time from enquiry to first contact)
- Priority flag (Hot / Warm / Cold)

---

## 5. 📣 Marketing Module

### 5a. Meta API Integration (Facebook + Instagram)

#### Features
| Feature | Meta API Used |
|---|---|
| View running Ad Campaigns | `/act_{account_id}/campaigns` |
| Ad performance (Impressions, Clicks, CPM, CTR, Spend) | `/insights` |
| Create / Boost a post from admin panel | `/me/photos` + `/me/videos` |
| Post to FB Page | `/{page-id}/feed` |
| Post to Instagram | Instagram Content Publishing API |
| View Page Insights (reach, likes, comments) | `/{page-id}/insights` |
| Schedule a post | `published=false + scheduled_publish_time` |
| Boost an existing post as Ad | `/act_{account_id}/adsets` |

#### Admin UI
- **Campaigns tab**: Table of all active campaigns with budget, impressions, clicks, ROAS
- **Create Post tab**: Rich post composer with image upload, caption editor, hashtag suggestions, choose platform (FB / Instagram / Both), schedule date/time toggle
- **Boost Post tab**: Select an existing post, set budget (₹ daily/lifetime), audience, duration → launch ad
- **Insights tab**: Charts — reach per day, top-performing posts, best time to post

#### Configuration Required (once)
```
Meta App ID, App Secret
Page Access Token (Facebook Page)
Instagram Business Account ID
Ad Account ID
```
Stored in Firestore `settings/meta` (admin-readable only).

---

### 5b. WhatsApp Business API Integration

#### Features
| Feature | Description |
|---|---|
| **Send Single Message** | Send a text/template message to any lead/contact |
| **Broadcast Campaigns** | Send to a filtered list (e.g. all Behror leads) |
| **Message Templates** | Pre-approved WhatsApp template messages |
| **Delivery Reports** | Sent ✓ / Delivered ✓✓ / Read ✓✓ (blue) per contact |
| **Conversation View** | Two-way chat interface per contact |
| **Auto-Reply** | Set a keyword-based auto reply (e.g. "PRICE" → sends price list) |
| **Opt-out Handling** | Mark contacts who replied STOP |

#### WhatsApp Business API (Cloud API via Meta)
Uses **Meta Cloud API for WhatsApp** (free, official):
- Endpoint: `https://graph.facebook.com/v20.0/{phone_number_id}/messages`
- Webhook: receives incoming messages + status updates (delivered/read)

#### Firestore Schema
```
wa_messages/{id}
  contactId: string
  phone: string
  direction: 'outbound' | 'inbound'
  type: 'template' | 'text' | 'image'
  templateName?: string
  body: string
  status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed'
  sentAt: Timestamp
  deliveredAt?: Timestamp
  readAt?: Timestamp
  campaignId?: string

wa_campaigns/{id}
  name: string
  templateId: string
  audience: { tags?: string[], stage?: string, locationSlug?: string }
  targetCount: number
  sentCount: number
  deliveredCount: number
  readCount: number
  failedCount: number
  status: 'draft' | 'running' | 'completed'
  scheduledAt?: Timestamp
  createdAt: Timestamp
```

#### WhatsApp Admin UI
- **Conversations**: List of all contacts with last message, unread count, search — like a CRM inbox
- **Broadcast**: Select template → filter audience (by tag / location / stage) → preview count → Send
- **Campaign History**: Table with Sent / Delivered / Read rate bars per campaign
- **Templates**: Manage approved template messages

---

## 6. 📝 Templates Module

Centralized library for all message templates.

### Template Types
| Type | Used By |
|---|---|
| WhatsApp Template | WhatsApp broadcasts / manual sends |
| Follow-up SMS draft | Agents copy-paste for calling |
| Email Template | Future email marketing |
| Meta Ad Copy | Saved ad captions / descriptions |
| Instagram Caption | Social post templates with hashtags |

### Template Schema
```
templates/{id}
  name: string
  type: 'whatsapp' | 'sms' | 'email' | 'meta-ad' | 'instagram-caption'
  body: string
  variables: string[]  // e.g. ['{{name}}', '{{property}}', '{{price}}']
  waTemplateId?: string  // approved WhatsApp template ID
  status: 'active' | 'draft'
  usageCount: number
  createdAt: Timestamp
```

### Template UI
- Card grid view with live preview
- Variable substitution preview (fill in sample values)
- Copy to clipboard / Send directly
- Tag-based filtering

---

## 7. 📊 Reports & Analytics Module

### Available Reports
| Report | Description |
|---|---|
| Lead Source Report | Breakdown of leads by source (property detail, contact page, WhatsApp, Meta Ad) |
| Conversion Funnel | Lead → Contacted → Site Visit → Sale |
| Response Time | Avg time from lead/enquiry to first contact |
| Property Performance | Which properties generate most enquiries |
| Agent Performance | Leads assigned, contacted, converted per agent |
| WhatsApp Campaign Report | Per-campaign delivery + read rates |
| Meta Ad Performance | Spend, impressions, clicks, CPL per campaign |
| Monthly Activity | New contacts, leads, enquiries per month |

### Charts & Visualizations
- Line charts — leads over time
- Bar charts — property-wise enquiries
- Funnel chart — conversion rates
- Heatmap — best response times
- KPI cards with % change vs previous period

### Export
- Download reports as PDF or CSV
- Date range picker (7d / 30d / 90d / Custom)

---

## Design System

### Visual Style (Industry Standard CRM Look)
- **Sidebar**: Dark navy (`#0a1128`) with gold accents — matches existing design
- **Main content**: Light gray background (`#f5f5f5`) with white cards
- **Data tables**: Sortable, filterable, pagination with row hover highlight
- **Charts**: Recharts library (already in stack tendency) or Chart.js
- **Status pills**: Color-coded (green = delivered, blue = read, orange = pending, red = failed)
- **Kanban board**: Shadcn-inspired drag-and-drop columns
- **Notification badges**: Live unread counts in sidebar nav

---

## Technical Architecture

### Stack
- **Frontend**: Next.js (app router) — same as existing
- **State Management**: React state + Firestore real-time listeners (onSnapshot)
- **Charts**: Recharts (lightweight, React-native)
- **Meta API calls**: Server Actions / API Routes (keeps tokens server-side)
- **WhatsApp Webhook**: `/api/webhooks/whatsapp` Next.js route handler
- **Realtime updates**: Firestore `onSnapshot` for WA message status changes

### Security
- All Meta / WhatsApp API tokens stored in `.env.local` (never in Firestore)
- Admin auth check on every CRM page (existing `useAuth` hook)
- Firestore rules: CRM collections only readable/writable by authenticated users

---

## Open Questions

> [!IMPORTANT]
> **Meta Developer App**: You'll need to create a Meta Developer App at `developers.facebook.com` and obtain:
> - Facebook Page Access Token (long-lived)
> - Instagram Business Account ID
> - Ad Account ID
>
> **WhatsApp Business Number**: A verified WhatsApp Business phone number linked to Meta Business Suite is required for the Cloud API.

> [!NOTE]
> **Phased Delivery**: This is a large module. Recommend building in 3 phases:
> - **Phase 1**: CRM Dashboard + Enhanced Leads/Enquiries + Contacts + Templates
> - **Phase 2**: WhatsApp Broadcast + Conversations + Campaign Reports
> - **Phase 3**: Meta API (Ads + Post Publisher + Insights)

---

## Verification Plan

### Manual Verification
- CRM Dashboard loads with charts and KPI widgets
- Contacts module — add/edit/delete a contact, view activity timeline
- WhatsApp — send a single test message, view delivery status update
- Meta — view a campaign's insights, post a test post to FB Page
- Reports — generate a 30-day lead source report and export CSV

### Automated Tests
- TypeScript build passes: `npm run build`
- API routes return 200 with mock data
