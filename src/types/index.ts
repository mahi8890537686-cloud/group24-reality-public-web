// ─── Extended Types for Firebase / DB ────────────────────────────────────────

export type PropertyType = 'plot' | 'villa' | 'flat';
export type PropertyStatus = 'available' | 'sold' | 'under-negotiation';
export type AreaUnit = 'sq.yd' | 'sq.ft';

// Kept for backward compatibility with existing public pages
export type LocationKey = string;

// ─── Location (Firestore-backed) ──────────────────────────────────────────────

export interface Location {
  id?: string;            // Firestore document ID
  name: string;           // "Behror"
  slug: string;           // "behror"
  state: string;          // "Rajasthan"
  tagline: string;
  description: string;
  coverImage: string;
  mapUrl?: string;
  investmentPoints: string[];
  connectivity: string[];
  infrastructure: string[];
  seoKeywords: string[];
  createdAt?: string;
}

// ─── Project (Firestore-backed) ───────────────────────────────────────────────

export interface Project {
  id?: string;            // Firestore document ID
  name: string;           // "Somnath City"
  slug: string;           // "somnath-city"
  locationId: string;     // Firestore ID of parent Location
  locationName: string;   // Denormalized: "Behror"
  locationSlug: string;   // Denormalized: "behror"
  description: string;
  coverImage: string;
  status: 'active' | 'upcoming' | 'completed';
  amenities: string[];
  highlights: string[];
  reraNumber?: string;
  totalUnits?: number;
  createdAt?: string;
}

// ─── Property (updated with 3-level hierarchy) ────────────────────────────────

export interface Property {
  id?: string;            // Firestore document ID (absent before save)
  slug: string;
  title: string;
  type: PropertyType;
  status: PropertyStatus;

  // Hierarchy (dynamic, from Firestore)
  locationId: string;     // Firestore ID of parent Location
  locationName: string;   // Denormalized e.g. "Behror"
  locationSlug: string;   // Denormalized e.g. "behror"
  projectId: string;      // Firestore ID of parent Project
  projectName: string;    // Denormalized e.g. "Somnath City"
  projectSlug: string;    // Denormalized e.g. "somnath-city"

  address: string;
  price: number;          // INR
  priceLabel: string;     // e.g. "₹45 Lakh"
  pricePerUnit?: string;  // e.g. "₹1,200/sq.ft"
  area: number;
  areaUnit: AreaUnit;
  bedrooms?: number;
  bathrooms?: number;
  facing?: string;
  floor?: string;
  amenities: string[];
  highlights: string[];
  images: string[];       // Firebase Storage URLs
  description: string;
  nearbyLandmarks: string[];
  postedAt: string;       // ISO date string
  isFeatured: boolean;
  reraNumber?: string;
  tour360Url?: string;    // 360° virtual tour URL or 360° equirectangular panorama image URL
}

// ─── Legacy LocationData (used by static location pages) ─────────────────────

export interface LocationData {
  key: LocationKey;
  name: string;
  tagline: string;
  description: string;
  investmentPoints: string[];
  connectivity: string[];
  infrastructure: string[];
  image: string;
  mapUrl?: string;
  propertyTypes: PropertyType[];
  seoKeywords: string[];
}

// ─── Testimonial ─────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  propertyType: PropertyType;
  rating: number;
  review: string;
  avatar?: string;
  order?: number;       // display ordering (lower = first)
  isVisible?: boolean;  // admin can hide without deleting
  createdAt?: string;
}

// ─── SiteConfig ───────────────────────────────────────────────────────────────
// Single document in `siteConfig/main`. Stores all business contact info so
// non-technical admins can update it without code changes.

export interface SiteConfig {
  businessName: string;
  contactPerson: string;
  // Primary phone (shown on buttons, call CTAs)
  phone: string;           // display format e.g. "+91-92669-82400"
  phoneHref: string;       // href format e.g. "tel:+919266982400"
  // Secondary phone (optional)
  phone2?: string;         // display format e.g. "+91-95601-99247"
  phone2Href?: string;     // href format e.g. "tel:+919560199247"
  // WhatsApp (uses whichever number is preferred)
  whatsappNumber: string;  // bare number e.g. "919266982400"
  email: string;
  // Two offices
  mainOfficeLabel: string;   // e.g. "Main Office"
  mainOfficeAddress: string; // full address string
  headOfficeLabel: string;   // e.g. "Head Office"
  headOfficeAddress: string;
  // Legacy single-address field kept for Maps embed only
  officeAddress?: string;    // used as fallback in map embed
  businessHoursWeekday: string;   // e.g. "Mon – Sat: 9:00 AM – 7:00 PM"
  businessHoursWeekend: string;   // e.g. "Sunday: By Appointment Only"
  instagramHandle: string;
  facebookUrl: string;
  instagramUrl: string;
  websiteUrl: string;
  mapEmbedQuery: string;  // used in Google Maps embed URL
  updatedAt?: string;
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export interface FAQItem {
  question: string;
  answer: string;
}

// ─── Lead (property detail enquiry) ──────────────────────────────────────────

export interface Lead {
  id?: string;
  name: string;
  phone: string;
  message?: string;
  propertyTitle: string;
  propertySlug: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
  source: 'property-detail';
  phoneNormalized?: string;
  ownerId?: string;
  ownerName?: string;
  score?: number;
  scoreBreakdown?: ScoreBreakdownItem[];
  contactId?: string;
  firstContactedAt?: string;   // stamped on new→contacted transition, feeds the response-time report
}

// ─── Enquiry (contact page form) ─────────────────────────────────────────────

export interface Enquiry {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  location?: string;
  propertyType?: PropertyType | string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
  source: 'contact-page';
  phoneNormalized?: string;
  ownerId?: string;
  ownerName?: string;
  score?: number;
  scoreBreakdown?: ScoreBreakdownItem[];
  contactId?: string;
  firstContactedAt?: string;   // stamped on new→contacted transition, feeds the response-time report
}

// ─── RWA Registration (public /rwa-registration-form) ────────────────────────

export type RwaDocType = 'registry_copy' | 'pan_card' | 'aadhaar' | 'photo';

export interface RwaRegistration {
  id?: string;
  willingToRegister: boolean;
  fullName: string;
  relationName: string;        // "S/o Ramesh Kumar" / "W/o Ramesh Kumar"
  blockName: string;
  plotNo: string;
  plotSizeSqYd: number;
  phone: string;
  phoneNormalized?: string;
  kycDocs: KycDoc[];           // one entry per RwaDocType, url points to Firebase Storage
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}

// ─── Filter / Sort ────────────────────────────────────────────────────────────

export interface PropertyFilters {
  locationSlug?: string | 'all';
  projectId?: string | 'all';
  type?: PropertyType | 'all';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number | 'any';
  status?: PropertyStatus | 'all';
}

export type SortOption =
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'area-asc'
  | 'area-desc';

// ─── CRM Types ────────────────────────────────────────────────────────────────

export interface ScoreBreakdownItem {
  factor: string;
  points: number;
}

export type ContactStage =
  | 'new'
  | 'contacted'
  | 'site-visit'
  | 'negotiation'
  | 'won'
  | 'lost';

export type ContactTag =
  | 'investor'
  | 'first-time-buyer'
  | 'nri'
  | 'builder'
  | 'tenant'
  | 'other';

export interface Contact {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  tags: ContactTag[];
  stage: ContactStage;
  source: 'lead' | 'enquiry' | 'manual' | 'import';
  assignedTo?: string;
  notes?: string;
  interestedIn?: string;       // Free text: property/project interest
  locationSlug?: string;
  budget?: number;
  lastContactedAt?: string;    // ISO date string
  followUpAt?: string;         // ISO date string
  createdAt: string;
  linkedLeadIds?: string[];
  linkedEnquiryIds?: string[];
  isOptedOut?: boolean;        // WhatsApp opt-out
  ownerId?: string;             // assigned agent uid
  ownerName?: string;           // denormalized
  score?: number;
  scoreBreakdown?: ScoreBreakdownItem[];
  phoneNormalized?: string;
  duplicateOfId?: string;
}

// ─── Requirement (demand side — P1) ────────────────────────────────────────────

export type RequirementPurpose = 'buy' | 'rent' | 'invest';
export type RequirementUrgency = 'immediate' | '1-3-months' | '3-6-months' | 'just-browsing';
export type RequirementStatus = 'open' | 'matched' | 'closed' | 'stale';

export interface Requirement {
  id?: string;
  contactId: string;
  contactName: string;         // denormalized
  type: PropertyType;
  locationSlug?: string;
  budgetMin?: number;
  budgetMax?: number;
  bedrooms?: number;
  purpose: RequirementPurpose;
  urgency: RequirementUrgency;
  financing?: 'cash' | 'loan' | 'undecided';
  status: RequirementStatus;
  createdAt: string;
  updatedAt?: string;
}

export type TemplateType =
  | 'whatsapp'
  | 'sms'
  | 'email'
  | 'meta-ad'
  | 'instagram-caption';

export interface CrmTemplate {
  id?: string;
  name: string;
  type: TemplateType;
  subject?: string;            // For email type
  body: string;
  variables: string[];         // e.g. ['{{name}}', '{{property}}']
  waTemplateId?: string;       // Approved WhatsApp template ID
  status: 'active' | 'draft';
  usageCount: number;
  previewImage?: string;       // For meta-ad / instagram types
  hashtags?: string[];         // For instagram captions
  createdAt: string;
}

export interface WaMessage {
  id?: string;
  contactId: string;
  phone: string;
  contactName?: string;
  direction: 'outbound' | 'inbound';
  type: 'template' | 'text' | 'image';
  templateName?: string;
  body: string;
  status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  campaignId?: string;
  waMessageId?: string;   // Meta's message ID — links a delivery-status webhook back to this doc
}

export interface WaCampaign {
  id?: string;
  name: string;
  templateId: string;
  templateName: string;
  audience: {
    tags?: string[];
    stage?: string;
    locationSlug?: string;
    all?: boolean;
  };
  targetCount: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  status: 'draft' | 'running' | 'completed' | 'paused';
  scheduledAt?: string;
  completedAt?: string;
  createdAt: string;
}

// ─── P0 Foundation Types ───────────────────────────────────────────────────────

export type UserRole = 'admin' | 'agent';

export interface AppUser {
  uid: string;              // Firebase Auth uid — also the Firestore doc ID
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  active: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export type UnitStatus =
  | 'available'
  | 'held'
  | 'blocked'
  | 'booked'
  | 'agreement'
  | 'registered'
  | 'sold';

export interface Unit {
  id?: string;
  projectId: string;
  projectName: string;        // denormalized
  locationSlug: string;       // denormalized
  unitNumber: string;         // "A-204"
  block?: string;
  phase?: string;
  type: PropertyType;
  areaSqft: number;
  baseRate: number;           // ₹ per unit area
  plcCharges?: number;
  otherCharges?: { label: string; amount: number }[];
  totalPrice: number;
  status: UnitStatus;
  heldUntil?: string;         // ISO date string — hold auto-expires
  currentDealId?: string;
  propertyId?: string;        // linked public listing, if any
  floor?: string;
  facing?: string;
  createdAt: string;
  updatedAt?: string;
}

export type ActivityRelatedType = 'contact' | 'deal' | 'unit' | 'booking' | 'lead' | 'enquiry' | 'user';

export type ActivityType =
  | 'call'
  | 'whatsapp'
  | 'note'
  | 'site_visit'
  | 'stage_change'
  | 'email'
  | 'task'
  | 'system';

export interface ActivityRecord {
  id?: string;
  relatedType: ActivityRelatedType;
  relatedId: string;
  type: ActivityType;
  body?: string;
  metadata?: Record<string, unknown>;
  ownerId?: string;
  ownerName?: string;         // denormalized, for display without a users lookup
  createdAt: string;
}

export type TaskStatus = 'open' | 'done' | 'overdue' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskRecord {
  id?: string;
  title: string;
  relatedType: 'contact' | 'deal' | 'lead' | 'booking';
  relatedId: string;
  ownerId: string;
  dueAt: string;               // ISO date string
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
}

export type AutomationTrigger =
  | 'lead.created'
  | 'deal.stage_changed'
  | 'demand.overdue'
  | 'no_activity_for_N_days'
  | 'unit.status_changed';

export interface AutomationCondition {
  field: string;
  op: string;
  value: unknown;
}

export interface AutomationAction {
  type: 'assign' | 'create_task' | 'send_template' | 'change_stage' | 'notify_admin';
  params: Record<string, unknown>;
}

export interface AutomationRule {
  id?: string;
  name: string;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

// ─── Integration Layer Types (P2/P9) ───────────────────────────────────────────

export type IntegrationProvider =
  | 'whatsapp'
  | 'meta_ads'
  | 'portal_99acres'
  | 'portal_magicbricks'
  | 'portal_housing'
  | 'ivr';

export interface IntegrationAccount {
  id?: string;             // provider, or `${provider}_${accountId}` for multi-account
  provider: IntegrationProvider;
  enabled: boolean;
  config: Record<string, unknown>;   // non-secret only
  lastSyncAt?: string;
  lastError?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface InboundEvent {
  id?: string;              // provider's event/message ID — the idempotency key
  provider: string;
  rawPayload: Record<string, unknown>;
  status: 'received' | 'processed' | 'failed' | 'duplicate';
  processedAt?: string;
  error?: string;
  createdAt: string;
}

export type OutboxType = 'whatsapp_template' | 'whatsapp_text' | 'meta_post' | 'sms';
export type OutboxStatus = 'queued' | 'sending' | 'sent' | 'failed';

export interface OutboxItem {
  id?: string;
  provider: string;
  type: OutboxType;
  payload: Record<string, unknown>;
  status: OutboxStatus;
  attempts: number;
  lastAttemptAt?: string;
  scheduledFor?: string;
  error?: string;
  createdAt: string;
}

// ─── Deal / Sales Pipeline Types (P3) ──────────────────────────────────────────

export type DealPipeline = 'primary_sales' | 'brokerage_resale' | 'rental';

export const PIPELINE_STAGES: Record<DealPipeline, string[]> = {
  primary_sales: ['new', 'qualified', 'site_visit', 'negotiation', 'booked', 'agreement', 'registered', 'possession'],
  brokerage_resale: ['requirement', 'matched', 'shortlisted', 'site_visit', 'offer', 'closed', 'commission_received'],
  rental: ['requirement', 'matched', 'viewing', 'agreement', 'tenancy_active', 'renewal_exit'],
};

export const PIPELINE_LABELS: Record<DealPipeline, string> = {
  primary_sales: 'Primary Sales',
  brokerage_resale: 'Brokerage / Resale',
  rental: 'Rental',
};

export const STAGE_LABELS: Record<string, string> = {
  new: 'New',
  qualified: 'Qualified',
  site_visit: 'Site Visit',
  negotiation: 'Negotiation',
  booked: 'Booked',
  agreement: 'Agreement',
  registered: 'Registered',
  possession: 'Possession',
  requirement: 'Requirement',
  matched: 'Matched',
  shortlisted: 'Shortlisted',
  offer: 'Offer',
  closed: 'Closed',
  commission_received: 'Commission Received',
  viewing: 'Viewing',
  tenancy_active: 'Tenancy Active',
  renewal_exit: 'Renewal / Exit',
};

export interface Deal {
  id?: string;
  pipeline: DealPipeline;
  stage: string;               // one of PIPELINE_STAGES[pipeline]
  contactId: string;
  contactName: string;         // denormalized
  contactPhone: string;        // denormalized
  listingType?: 'unit' | 'mandate' | 'property';   // 'property' = interim reference until Phase 4's Unit migration
  listingId?: string;
  listingLabel?: string;       // denormalized display, e.g. "Somnath City A-204"
  value: number;
  ownerId?: string;
  ownerName?: string;
  probability?: number;
  lostReason?: string;
  wonAt?: string;
  lostAt?: string;
  channelPartnerId?: string;   // P8 — attribution, set at creation or via "Attribute to partner"
  channelPartnerName?: string; // denormalized
  createdAt: string;
  updatedAt?: string;
}

export type SiteVisitStatus = 'scheduled' | 'completed' | 'no_show' | 'cancelled';

export interface SiteVisit {
  id?: string;
  dealId: string;
  contactId: string;
  contactName: string;         // denormalized
  listingLabel?: string;       // denormalized
  scheduledAt: string;
  status: SiteVisitStatus;
  feedback?: string;
  ownerId?: string;
  ownerName?: string;
  createdAt: string;
  updatedAt?: string;
}

// ─── Booking Types (P4/P5) ──────────────────────────────────────────────────────

export type BookingStatus = 'draft' | 'confirmed' | 'agreement_signed' | 'registered' | 'possession_given' | 'cancelled';

export interface KycDoc {
  type: string;
  url: string;
  verifiedAt?: string;
}

export interface Booking {
  id?: string;
  dealId: string;
  unitId: string;
  contactId: string;
  unitLabel: string;         // denormalized
  contactName: string;       // denormalized
  contactPhone: string;      // denormalized
  bookingDate: string;
  agreementValue: number;
  kycDocs: KycDoc[];
  allotmentLetterUrl?: string;
  agreementUrl?: string;
  status: BookingStatus;
  // Rollup fields (P5) — written only by src/lib/server/payments.ts transactions,
  // never computed client-side. Zero until a payment plan is applied.
  totalDemanded: number;
  totalReceived: number;
  outstanding: number;
  overdueAmount: number;
  createdAt: string;
  updatedAt?: string;
}

// ─── Payments & Collections Types (P5) ─────────────────────────────────────────

export type MilestoneTriggerType = 'date' | 'construction_stage' | 'on_booking';

export interface PaymentMilestone {
  label: string;
  triggerType: MilestoneTriggerType;
  percentOrAmount: { kind: 'percent' | 'amount'; value: number };
  offsetDays?: number;
}

export interface PaymentPlan {
  id?: string;
  name: string;
  projectId?: string;      // scoped to a project, or global if omitted
  milestones: PaymentMilestone[];
  createdAt: string;
  updatedAt?: string;
}

export type DemandStatus = 'pending' | 'sent' | 'partially_paid' | 'paid' | 'overdue';

export interface Demand {
  id?: string;
  milestoneLabel: string;
  amount: number;
  dueDate: string;
  status: DemandStatus;
  demandLetterUrl?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export type PaymentMode = 'cash' | 'cheque' | 'bank_transfer' | 'upi' | 'card';

export interface Receipt {
  id?: string;
  amount: number;
  mode: PaymentMode;
  referenceNumber?: string;
  receivedAt: string;
  demandId?: string;
  receiptNumber: string;     // sequential, generated server-side
  createdAt: string;
  createdBy?: string;
}

// ─── Post-Sales Types (P6) ──────────────────────────────────────────────────────

export type HandoverItemStatus = 'pending' | 'done' | 'na';
export type HandoverChecklistStatus = 'pending' | 'in_progress' | 'completed';

export interface HandoverItem {
  label: string;
  status: HandoverItemStatus;
  completedAt?: string;
}

export interface HandoverChecklist {
  id?: string;
  bookingId: string;
  items: HandoverItem[];
  possessionDate?: string;
  status: HandoverChecklistStatus;
  createdAt: string;
  updatedAt?: string;
}

export type GrievanceCategory = 'construction' | 'documentation' | 'payment' | 'other';
export type GrievancePriority = 'low' | 'medium' | 'high';
export type GrievanceStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface Grievance {
  id?: string;
  contactId: string;
  contactName: string;       // denormalized
  bookingId?: string;
  subject: string;
  description: string;
  category: GrievanceCategory;
  priority: GrievancePriority;
  status: GrievanceStatus;
  assignedTo?: string;
  resolutionNote?: string;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
}

// ─── Resale & Rental Types (P7) ────────────────────────────────────────────────

export type MandatePurpose = 'sale' | 'rent';
export type MandateStatus = 'active' | 'matched' | 'closed' | 'expired' | 'withdrawn';

export interface Mandate {
  id?: string;
  sellerContactId: string;
  sellerContactName: string;   // denormalized
  type: PropertyType;
  purpose: MandatePurpose;
  address: string;
  locationSlug?: string;
  askingPrice: number;
  areaSqft: number;
  exclusivity: boolean;
  expiresAt: string;
  status: MandateStatus;
  commissionTerms: { kind: 'percent' | 'flat'; value: number };
  images: string[];
  description: string;
  createdAt: string;
  updatedAt?: string;
}

export type MatchSuggestionStatus = 'suggested' | 'accepted' | 'dismissed';

export interface MatchSuggestion {
  id?: string;
  requirementId: string;
  listingType: 'unit' | 'mandate';
  listingId: string;
  listingLabel: string;        // denormalized, for display without a second lookup
  score: number;
  status: MatchSuggestionStatus;
  createdAt: string;
}

export type TenancyStatus = 'active' | 'renewal_due' | 'ended';

export interface Tenancy {
  id?: string;
  mandateId: string;
  tenantContactId: string;
  tenantContactName: string;   // denormalized
  landlordContactId: string;
  landlordContactName: string; // denormalized
  startDate: string;
  endDate: string;
  rentAmount: number;
  depositAmount: number;
  status: TenancyStatus;
  agreementUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

// ─── Channel Partners & Commissions Types (P8) ─────────────────────────────────

export type ChannelPartnerStatus = 'pending' | 'active' | 'suspended';
export type CommissionBasis = { kind: 'percent' | 'flat'; value: number };

export interface ChannelPartner {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  firmName?: string;
  kycDocs: KycDoc[];
  status: ChannelPartnerStatus;
  commissionDefault: CommissionBasis;
  createdAt: string;
  updatedAt?: string;
}

export type CommissionType = 'channel_partner' | 'internal_agent';
export type CommissionStatus = 'pending' | 'approved' | 'paid';

export interface Commission {
  id?: string;
  dealId: string;
  dealLabel: string;          // denormalized, e.g. contact + listing
  channelPartnerId?: string;
  channelPartnerName?: string; // denormalized
  agentId?: string;
  agentName?: string;          // denormalized
  type: CommissionType;
  basis: CommissionBasis;
  dealValue: number;
  amount: number;
  status: CommissionStatus;
  approvedBy?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt?: string;
}

// ─── Meta Ads, Portals, IVR Types (P9) ─────────────────────────────────────────

export interface AdCampaign {
  id?: string;              // Firestore doc ID
  metaCampaignId: string;
  name: string;
  status: string;
  dailyBudget: number;
  spend: number;
  impressions: number;
  clicks: number;
  cpm: number;
  ctr: number;
  lastSyncedAt: string;
}

export type CallDirection = 'inbound' | 'outbound' | 'missed';

export interface CallRecord {
  id?: string;
  contactId?: string;
  phoneNormalized: string;
  direction: CallDirection;
  durationSeconds: number;
  recordingUrl?: string;
  agentId?: string;
  occurredAt: string;
  createdAt: string;
}

// ─── Reports & Analytics Types (P10) ───────────────────────────────────────────

export interface DailyRollup {
  date: string;               // YYYY-MM-DD
  newLeads: number;
  newContacts: number;
  siteVisits: number;
  dealsWon: number;
  dealsLost: number;
  revenue: number;
  collections: number;
  computedAt: string;
}

export interface MonthlyRollup {
  month: string;               // YYYY-MM
  newLeads: number;
  newContacts: number;
  siteVisits: number;
  dealsWon: number;
  dealsLost: number;
  revenue: number;
  collections: number;
  avgResponseMinutes: number;
  bySource: Record<string, number>;
  byStage: Record<string, Record<string, number>>;  // pipeline -> stage -> count
  computedAt: string;
}

export interface AgentRollup {
  uid: string;
  month: string;
  name: string;
  leadsAssigned: number;
  leadsContacted: number;
  dealsWon: number;
  revenue: number;
  computedAt: string;
}

export interface SourceRollup {
  month: string;
  bySource: Record<string, number>;
  computedAt: string;
}

// ─── Blog Types ───────────────────────────────────────────────────────────────

export type BlogCategory =
  | 'Investment Guide'
  | 'Area Highlights'
  | 'Market Trends'
  | 'Buying Tips'
  | 'News & Updates';

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;            // HTML / Markdown content
  coverImage: string;
  category: BlogCategory;
  tags: string[];
  author: string;
  locationSlug?: string;       // Linked location e.g. "behror"
  projectId?: string;          // Linked project ID
  propertyId?: string;         // Linked property ID
  status: 'published' | 'draft';
  readTimeMinutes: number;
  views: number;
  createdAt: string;
  updatedAt?: string;
}
