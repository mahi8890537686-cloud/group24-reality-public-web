/**
 * CRM Seed Script
 * Seeds: crm_contacts, crm_templates, wa_campaigns (demo data)
 * Run: node scripts/seed-crm.mjs
 */

import { Timestamp } from 'firebase-admin/firestore';
import { db } from './_admin-init.mjs';

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return Timestamp.fromDate(d);
}

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return Timestamp.fromDate(d);
}

// ─── CRM Contacts ─────────────────────────────────────────────────────────────
const contacts = [
  {
    name: 'Rajesh Kumar Sharma',
    phone: '+91 98765 43210',
    email: 'rajesh.sharma@gmail.com',
    tags: ['investor'],
    stage: 'site-visit',
    source: 'lead',
    assignedTo: 'Amit Singh',
    notes: 'Looking for 200 sq.yd plot in Behror. Has budget of 30L. Very interested, visited once.',
    interestedIn: 'Residential Plot — Behror Sector 12',
    locationSlug: 'behror',
    budget: 3000000,
    lastContactedAt: daysAgo(2),
    followUpAt: daysFromNow(2),
    createdAt: daysAgo(15),
    linkedLeadIds: [],
    linkedEnquiryIds: [],
    isOptedOut: false,
  },
  {
    name: 'Priya Meena',
    phone: '+91 87654 32109',
    email: 'priya.meena@yahoo.com',
    tags: ['first-time-buyer'],
    stage: 'negotiation',
    source: 'enquiry',
    assignedTo: 'Sonal Verma',
    notes: 'First home buyer. Wants 2BHK flat. Price sensitive but serious. Loan pre-approved for 25L.',
    interestedIn: '2 BHK Flat — Sunrise Apartments',
    locationSlug: 'behror',
    budget: 3200000,
    lastContactedAt: daysAgo(1),
    followUpAt: daysFromNow(1),
    createdAt: daysAgo(20),
    linkedLeadIds: [],
    linkedEnquiryIds: [],
    isOptedOut: false,
  },
  {
    name: 'Mohammed Arif Khan',
    phone: '+91 99887 76655',
    email: 'arif.khan@hotmail.com',
    tags: ['nri', 'investor'],
    stage: 'contacted',
    source: 'lead',
    assignedTo: 'Amit Singh',
    notes: 'NRI based in Dubai. Interested in luxury villa. Looking for high ROI investment near NH-48.',
    interestedIn: '4 BHK Luxury Villa — Heritage Heights, Neemrana',
    locationSlug: 'neemrana',
    budget: 15000000,
    lastContactedAt: daysAgo(5),
    followUpAt: daysFromNow(3),
    createdAt: daysAgo(30),
    linkedLeadIds: [],
    linkedEnquiryIds: [],
    isOptedOut: false,
  },
  {
    name: 'Sunita Agarwal',
    phone: '+91 77665 54433',
    email: 'sunita.agarwal@rediffmail.com',
    tags: ['investor'],
    stage: 'new',
    source: 'enquiry',
    assignedTo: '',
    notes: 'Enquired about commercial plot on Behror main road. Not yet contacted.',
    interestedIn: 'Commercial Plot — Behror Main Road',
    locationSlug: 'behror',
    budget: 4500000,
    lastContactedAt: null,
    followUpAt: daysFromNow(0),
    createdAt: daysAgo(1),
    linkedLeadIds: [],
    linkedEnquiryIds: [],
    isOptedOut: false,
  },
  {
    name: 'Deepak Choudhary',
    phone: '+91 95544 33221',
    email: 'deepak.choudhary@gmail.com',
    tags: ['builder'],
    stage: 'won',
    source: 'manual',
    assignedTo: 'Sonal Verma',
    notes: 'Purchased 300 sq.yd industrial plot in Neemrana. Deal closed at 52L. Very satisfied customer.',
    interestedIn: 'Industrial Plot — Neemrana Sector 5',
    locationSlug: 'neemrana',
    budget: 5400000,
    lastContactedAt: daysAgo(10),
    followUpAt: null,
    createdAt: daysAgo(45),
    linkedLeadIds: [],
    linkedEnquiryIds: [],
    isOptedOut: false,
  },
  {
    name: 'Kavita Joshi',
    phone: '+91 88776 65544',
    email: '',
    tags: ['first-time-buyer'],
    stage: 'contacted',
    source: 'lead',
    assignedTo: 'Amit Singh',
    notes: 'Wants 1BHK in Neemrana for self-use (works in RIICO zone). Budget tight, around 20L.',
    interestedIn: '1 BHK Flat — Industrial View Residency',
    locationSlug: 'neemrana',
    budget: 2000000,
    lastContactedAt: daysAgo(3),
    followUpAt: daysFromNow(4),
    createdAt: daysAgo(12),
    linkedLeadIds: [],
    linkedEnquiryIds: [],
    isOptedOut: false,
  },
  {
    name: 'Rakesh Bansal',
    phone: '+91 96655 44332',
    email: 'rakesh.bansal@gmail.com',
    tags: ['investor'],
    stage: 'lost',
    source: 'enquiry',
    assignedTo: 'Sonal Verma',
    notes: 'Was interested in Kotputli plot but went with competitor. Price was the main issue.',
    interestedIn: 'Highway-Facing Plot — Kotputli',
    locationSlug: 'kotputli',
    budget: 2000000,
    lastContactedAt: daysAgo(20),
    followUpAt: null,
    createdAt: daysAgo(35),
    linkedLeadIds: [],
    linkedEnquiryIds: [],
    isOptedOut: false,
  },
  {
    name: 'Anita Gupta',
    phone: '+91 91122 33445',
    email: 'anita.gupta@outlook.com',
    tags: ['first-time-buyer', 'investor'],
    stage: 'site-visit',
    source: 'lead',
    assignedTo: 'Amit Singh',
    notes: 'Visited Somnath City project. Interested in corner plot. Husband also coming next visit.',
    interestedIn: 'Plot in Somnath City, Behror',
    locationSlug: 'behror',
    budget: 3500000,
    lastContactedAt: daysAgo(4),
    followUpAt: daysFromNow(5),
    createdAt: daysAgo(18),
    linkedLeadIds: [],
    linkedEnquiryIds: [],
    isOptedOut: false,
  },
  {
    name: 'Sanjay Yadav',
    phone: '+91 70011 22334',
    email: 'sanjay.yadav@gmail.com',
    tags: ['investor'],
    stage: 'new',
    source: 'lead',
    assignedTo: '',
    notes: 'New lead from property details page. No contact made yet.',
    interestedIn: '5 BHK Premium Villa — Royal Enclave',
    locationSlug: 'kotputli',
    budget: 20000000,
    lastContactedAt: null,
    followUpAt: daysFromNow(1),
    createdAt: daysAgo(0),
    linkedLeadIds: [],
    linkedEnquiryIds: [],
    isOptedOut: false,
  },
  {
    name: 'Manisha Rawat',
    phone: '+91 85544 77889',
    email: 'manisha.rawat@gmail.com',
    tags: ['tenant', 'first-time-buyer'],
    stage: 'negotiation',
    source: 'enquiry',
    assignedTo: 'Sonal Verma',
    notes: 'Currently renting in Behror. Wants to buy own home. Budget 32L for 2BHK. Loan from SBI pending.',
    interestedIn: '2 BHK Flat — Sunrise Apartments',
    locationSlug: 'behror',
    budget: 3200000,
    lastContactedAt: daysAgo(2),
    followUpAt: daysFromNow(2),
    createdAt: daysAgo(25),
    linkedLeadIds: [],
    linkedEnquiryIds: [],
    isOptedOut: false,
  },
];

// ─── CRM Templates ─────────────────────────────────────────────────────────────
const templates = [
  {
    name: 'Welcome — New Lead',
    type: 'whatsapp',
    body: 'Hello {{name}}! 👋\n\nThank you for your interest in *Group 24 Reality*.\n\nWe specialize in premium plots, villas, and flats in Behror, Neemrana, and Kotputli — along the NH-48 corridor.\n\nOur team will call you shortly to understand your requirements.\n\nBest regards,\n*Group 24 Reality Team* 🏠\n📞 +91-XXXXXXXXXX',
    subject: null,
    variables: ['{{name}}'],
    waTemplateId: 'welcome_new_lead_v1',
    status: 'active',
    usageCount: 0,
    hashtags: [],
    previewImage: null,
    createdAt: daysAgo(30),
  },
  {
    name: 'Site Visit Invitation',
    type: 'whatsapp',
    body: 'Dear {{name}},\n\nWe are delighted to invite you for a *site visit* to our *{{project}}* project in {{location}}.\n\n📅 *Date:* {{date}}\n🕐 *Time:* {{time}}\n📍 *Address:* {{address}}\n\nOur team will be there to walk you through the plots and answer all your questions.\n\nPlease reply *YES* to confirm, or call us to reschedule.\n\n— *Group 24 Reality* 🏠',
    subject: null,
    variables: ['{{name}}', '{{project}}', '{{location}}', '{{date}}', '{{time}}', '{{address}}'],
    waTemplateId: 'site_visit_invite_v1',
    status: 'active',
    usageCount: 0,
    hashtags: [],
    previewImage: null,
    createdAt: daysAgo(30),
  },
  {
    name: 'Follow-up — No Response',
    type: 'whatsapp',
    body: 'Hi {{name}},\n\nThis is a gentle follow-up from *Group 24 Reality* 🏠\n\nWe noticed you had shown interest in our properties in {{location}}. We would love to help you find your dream home or investment opportunity!\n\nAre you still looking? Reply *YES* and we will share our latest listings.\n\nThank you! 🙏',
    subject: null,
    variables: ['{{name}}', '{{location}}'],
    waTemplateId: 'followup_no_response_v1',
    status: 'active',
    usageCount: 0,
    hashtags: [],
    previewImage: null,
    createdAt: daysAgo(25),
  },
  {
    name: 'Deal Closed — Thank You',
    type: 'whatsapp',
    body: 'Dear {{name}},\n\nCongratulations! 🎉🏡\n\nWe are thrilled to welcome you as part of the *Group 24 Reality* family!\n\nYour property — *{{property}}* — is now officially yours.\n\nWe will share all necessary documents shortly. Please do not hesitate to reach out for any queries.\n\nThank you for trusting us with this milestone! 🙏\n\n— *Group 24 Reality Team*',
    subject: null,
    variables: ['{{name}}', '{{property}}'],
    waTemplateId: 'deal_closed_thankyou_v1',
    status: 'active',
    usageCount: 0,
    hashtags: [],
    previewImage: null,
    createdAt: daysAgo(25),
  },
  {
    name: 'Price Drop Alert',
    type: 'whatsapp',
    body: '🔥 *SPECIAL OFFER — Group 24 Reality*\n\nDear {{name}},\n\nGreat news! The property you were interested in has a *special discounted price* for a limited time.\n\n🏡 *{{property}}*\n📍 {{location}}\n💰 New Price: *₹{{price}}* (was ₹{{oldPrice}})\n\nThis offer is valid only till *{{deadline}}*.\n\nReply *INTEREST* or call us now to lock in this price!\n\n*Group 24 Reality* 📞',
    subject: null,
    variables: ['{{name}}', '{{property}}', '{{location}}', '{{price}}', '{{oldPrice}}', '{{deadline}}'],
    waTemplateId: 'price_drop_alert_v1',
    status: 'active',
    usageCount: 0,
    hashtags: [],
    previewImage: null,
    createdAt: daysAgo(20),
  },
  {
    name: 'New Project Launch — Instagram',
    type: 'instagram-caption',
    body: '🏡 JUST LAUNCHED: *{{project}}* at {{location}}!\n\n✨ Premium {{type}} starting from ₹{{startingPrice}}\n🌿 Amenities: {{amenities}}\n📍 NH-48 Corridor | High ROI Investment Zone\n🏗️ RERA Approved | Clear Titles\n\n👉 Limited units available — DM us NOW or call {{phone}} to book your site visit!\n\n⬇️ Link in bio for more details',
    subject: null,
    variables: ['{{project}}', '{{location}}', '{{type}}', '{{startingPrice}}', '{{amenities}}', '{{phone}}'],
    waTemplateId: null,
    status: 'active',
    usageCount: 0,
    hashtags: ['#Group24Reality', '#RealEstate', '#Behror', '#Neemrana', '#NH48', '#PlotForSale', '#VillaForSale', '#Investment', '#JaipurRealEstate', '#RajasthanRealEstate'],
    previewImage: null,
    createdAt: daysAgo(20),
  },
  {
    name: 'Meta Ad Copy — Plot Investment',
    type: 'meta-ad',
    body: '🏡 Invest in Your Future — Premium Plots on NH-48!\n\nGroup 24 Reality offers DTCP-approved residential & commercial plots in Behror, Neemrana, and Kotputli.\n\n✅ Clear Titles\n✅ Paved Roads & Utilities\n✅ High Appreciation Zone\n✅ Easy Loan Eligibility\n\nStarting from just ₹{{startingPrice}}\n\n📞 Call Now: {{phone}}\n🌐 Visit: {{websiteUrl}}\n\n*Limited Plots Available — Enquire Today!*',
    subject: null,
    variables: ['{{startingPrice}}', '{{phone}}', '{{websiteUrl}}'],
    waTemplateId: null,
    status: 'active',
    usageCount: 0,
    hashtags: [],
    previewImage: null,
    createdAt: daysAgo(15),
  },
  {
    name: 'Email — Property Enquiry Response',
    type: 'email',
    subject: 'Your Enquiry about {{property}} — Group 24 Reality',
    body: 'Dear {{name}},\n\nThank you for reaching out to Group 24 Reality!\n\nWe have received your enquiry about *{{property}}* in {{location}}. Our team is reviewing your requirements and will get back to you within 24 hours.\n\nIn the meantime, you can:\n- Browse more properties at our website\n- Call us at {{phone}} for immediate assistance\n- WhatsApp us for quick responses\n\nWarm regards,\nGroup 24 Reality Team\n{{agentName}} | Sales Manager\n📞 {{phone}}',
    variables: ['{{name}}', '{{property}}', '{{location}}', '{{phone}}', '{{agentName}}'],
    waTemplateId: null,
    status: 'active',
    usageCount: 0,
    hashtags: [],
    previewImage: null,
    createdAt: daysAgo(15),
  },
  {
    name: 'SMS — Site Visit Reminder',
    type: 'sms',
    body: 'Group24 Reality: Reminder - Your site visit to {{project}} is tomorrow at {{time}}. Address: {{address}}. Call {{phone}} for queries. Reply STOP to opt out.',
    subject: null,
    variables: ['{{project}}', '{{time}}', '{{address}}', '{{phone}}'],
    waTemplateId: null,
    status: 'active',
    usageCount: 0,
    hashtags: [],
    previewImage: null,
    createdAt: daysAgo(10),
  },
  {
    name: 'Instagram — Weekend Sale Post',
    type: 'instagram-caption',
    body: '🎉 WEEKEND SPECIAL OFFER!\n\nThis {{weekend}}, Group 24 Reality is offering *exclusive discounts* on select properties in {{location}}!\n\n🏠 Plots | Villas | Flats\n💰 Special weekend pricing\n🤝 Zero brokerage\n📋 Ready paperwork\n\nCall or DM us NOW — offer ends Sunday midnight! 🌙\n\n📞 {{phone}}',
    subject: null,
    variables: ['{{weekend}}', '{{location}}', '{{phone}}'],
    waTemplateId: null,
    status: 'draft',
    usageCount: 0,
    hashtags: ['#WeekendSale', '#Group24Reality', '#RealEstateDeals', '#Behror', '#Neemrana', '#PropertyForSale'],
    previewImage: null,
    createdAt: daysAgo(5),
  },
];

// ─── WA Campaigns (demo history) ──────────────────────────────────────────────
const waCampaigns = [
  {
    name: 'New Year Offer Blast — Jan 2026',
    templateId: 'price_drop_alert',
    templateName: 'Price Drop Alert',
    audience: { all: true },
    targetCount: 45,
    sentCount: 45,
    deliveredCount: 42,
    readCount: 28,
    failedCount: 3,
    status: 'completed',
    scheduledAt: daysAgo(30),
    completedAt: daysAgo(29),
    createdAt: daysAgo(31),
  },
  {
    name: 'Behror Investors — Feb Follow-up',
    templateId: 'followup_no_response',
    templateName: 'Follow-up — No Response',
    audience: { locationSlug: 'behror', tags: ['investor'] },
    targetCount: 22,
    sentCount: 22,
    deliveredCount: 21,
    readCount: 15,
    failedCount: 1,
    status: 'completed',
    scheduledAt: daysAgo(14),
    completedAt: daysAgo(13),
    createdAt: daysAgo(15),
  },
  {
    name: 'Site Visit Invites — Neemrana',
    templateId: 'site_visit_invite',
    templateName: 'Site Visit Invitation',
    audience: { locationSlug: 'neemrana', stage: 'contacted' },
    targetCount: 8,
    sentCount: 8,
    deliveredCount: 8,
    readCount: 6,
    failedCount: 0,
    status: 'completed',
    scheduledAt: daysAgo(7),
    completedAt: daysAgo(6),
    createdAt: daysAgo(8),
  },
  {
    name: 'Welcome All New Leads — March',
    templateId: 'welcome_new_lead',
    templateName: 'Welcome — New Lead',
    audience: { all: true },
    targetCount: 30,
    sentCount: 0,
    deliveredCount: 0,
    readCount: 0,
    failedCount: 0,
    status: 'draft',
    scheduledAt: daysFromNow(2),
    completedAt: null,
    createdAt: daysAgo(1),
  },
];

// ─── Seed Function ─────────────────────────────────────────────────────────────
async function clearCollection(collectionName) {
  const snap = await db.collection(collectionName).get();
  let count = 0;
  for (const doc of snap.docs) {
    await doc.ref.delete();
    count++;
  }
  if (count > 0) console.log(`  🗑️  Cleared ${count} existing docs from "${collectionName}"`);
}

async function seedCollection(collectionName, items, label) {
  let count = 0;
  for (const item of items) {
    const data = { ...item };
    for (const key of ['createdAt', 'lastContactedAt', 'followUpAt', 'scheduledAt', 'completedAt']) {
      if (data[key] instanceof Timestamp) continue;
      if (data[key] === null || data[key] === undefined) {
        delete data[key];
      }
    }
    const ref = await db.collection(collectionName).add(data);
    count++;
    console.log(`  ✅ [${count}/${items.length}] ${label}: ${item.name} → ${ref.id}`);
  }
  return count;
}

async function main() {
  console.log('\n🌱 Group 24 Reality — CRM Data Seeder');
  console.log('═══════════════════════════════════════\n');

  // ─── Contacts ────────────────────────────────────────────────────────────────
  console.log('📋 Seeding CRM Contacts...');
  const existingContacts = await db.collection('crm_contacts').get();
  if (!existingContacts.empty) {
    console.log(`  ⚠️  Found ${existingContacts.size} existing contacts — clearing first...`);
    await clearCollection('crm_contacts');
  }
  const contactCount = await seedCollection('crm_contacts', contacts, 'Contact');
  console.log(`  ✨ ${contactCount} contacts seeded!\n`);

  // ─── Templates ───────────────────────────────────────────────────────────────
  console.log('📝 Seeding CRM Templates...');
  const existingTemplates = await db.collection('crm_templates').get();
  if (!existingTemplates.empty) {
    console.log(`  ⚠️  Found ${existingTemplates.size} existing templates — clearing first...`);
    await clearCollection('crm_templates');
  }
  const templateCount = await seedCollection('crm_templates', templates, 'Template');
  console.log(`  ✨ ${templateCount} templates seeded!\n`);

  // ─── WA Campaigns ─────────────────────────────────────────────────────────────
  console.log('📣 Seeding WhatsApp Campaigns (history)...');
  const existingCampaigns = await db.collection('wa_campaigns').get();
  if (!existingCampaigns.empty) {
    console.log(`  ⚠️  Found ${existingCampaigns.size} existing campaigns — clearing first...`);
    await clearCollection('wa_campaigns');
  }
  const campaignCount = await seedCollection('wa_campaigns', waCampaigns, 'Campaign');
  console.log(`  ✨ ${campaignCount} campaigns seeded!\n`);

  // ─── Summary ──────────────────────────────────────────────────────────────────
  console.log('═══════════════════════════════════════');
  console.log('🎉 CRM Seed Complete!\n');
  console.log(`   👥 Contacts   : ${contactCount}`);
  console.log(`   📝 Templates  : ${templateCount}`);
  console.log(`   📣 WA Campaigns: ${campaignCount}`);
  console.log('\n📍 View in Firebase Console:');
  console.log('   https://console.firebase.google.com/project/group24reality-web-2f3fd/firestore\n');

  process.exit(0);
}

main().catch((err) => {
  console.error('\n❌ Seed failed:', err.message || err);
  console.error(err);
  process.exit(1);
});
