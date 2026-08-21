// Firestore operations for SiteConfig collection
// Single document at `siteConfig/main` stores all business contact info.
// Public-facing components read from this so admins can update without code changes.
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SiteConfig } from '@/types';

const COLLECTION = 'siteConfig';
const DOC_ID = 'main';
const docRef = () => doc(db, COLLECTION, DOC_ID);

/** Default fallback so the site never breaks if Firestore is unavailable */
export const DEFAULT_SITE_CONFIG: SiteConfig = {
  businessName: 'Group 24 Reality',
  contactPerson: 'Sunil Sangwan',
  // Primary phone
  phone: '+91-92669-82400',
  phoneHref: 'tel:+919266982400',
  // Secondary phone
  phone2: '+91-95601-99247',
  phone2Href: 'tel:+919560199247',
  // WhatsApp uses the primary number
  whatsappNumber: '919266982400',
  email: 'info@group24reality.com',
  // Main field office (Behror)
  mainOfficeLabel: 'Main Office',
  mainOfficeAddress: 'AA-111, SOMNATH CITY, Near Goonti Flyover,\nDelhi–Jaipur Highway, Behror, Rajasthan 301701',
  // Head / corporate office (Gurugram)
  headOfficeLabel: 'Head Office',
  headOfficeAddress: 'Group24Reality, Plot No. 6 & 7, Sector 37C,\nAdjacent Corona Optus Society, Gurugram, Haryana 122001',
  // Map embed uses the head office by default
  mapEmbedQuery: 'Sector+37C+Gurugram+Haryana',
  businessHoursWeekday: 'Mon – Sat: 9:00 AM – 7:00 PM',
  businessHoursWeekend: 'Sunday: By Appointment Only',
  instagramHandle: '@group24reality',
  facebookUrl: 'https://www.facebook.com/group24reality',
  instagramUrl: 'https://www.instagram.com/group24reality',
  websiteUrl: 'www.group24reality.com',
};

function fromDoc(data: DocumentData): SiteConfig {
  const d = DEFAULT_SITE_CONFIG;
  return {
    businessName: (data.businessName as string) || d.businessName,
    contactPerson: (data.contactPerson as string) || d.contactPerson,
    phone: (data.phone as string) || d.phone,
    phoneHref: (data.phoneHref as string) || d.phoneHref,
    phone2: (data.phone2 as string) || d.phone2,
    phone2Href: (data.phone2Href as string) || d.phone2Href,
    whatsappNumber: (data.whatsappNumber as string) || d.whatsappNumber,
    email: (data.email as string) || d.email,
    mainOfficeLabel: (data.mainOfficeLabel as string) || d.mainOfficeLabel,
    mainOfficeAddress: (data.mainOfficeAddress as string) || d.mainOfficeAddress,
    headOfficeLabel: (data.headOfficeLabel as string) || d.headOfficeLabel,
    headOfficeAddress: (data.headOfficeAddress as string) || d.headOfficeAddress,
    officeAddress: (data.officeAddress as string) || undefined,
    businessHoursWeekday: (data.businessHoursWeekday as string) || d.businessHoursWeekday,
    businessHoursWeekend: (data.businessHoursWeekend as string) || d.businessHoursWeekend,
    instagramHandle: (data.instagramHandle as string) || d.instagramHandle,
    facebookUrl: (data.facebookUrl as string) || d.facebookUrl,
    instagramUrl: (data.instagramUrl as string) || d.instagramUrl,
    websiteUrl: (data.websiteUrl as string) || d.websiteUrl,
    mapEmbedQuery: (data.mapEmbedQuery as string) || d.mapEmbedQuery,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? undefined,
  };
}

/**
 * Fetch site config. Falls back to DEFAULT_SITE_CONFIG if the document
 * doesn't exist yet (e.g. before the seed script has run).
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const snap = await getDoc(docRef());
    if (!snap.exists()) return DEFAULT_SITE_CONFIG;
    return fromDoc(snap.data());
  } catch {
    // Network error or permissions issue — return defaults so site stays up
    return DEFAULT_SITE_CONFIG;
  }
}

/** Admin write: create or replace the entire config document */
export async function setSiteConfig(data: Omit<SiteConfig, 'updatedAt'>): Promise<void> {
  await setDoc(docRef(), { ...data, updatedAt: serverTimestamp() });
}

/** Admin write: patch specific fields */
export async function updateSiteConfig(data: Partial<SiteConfig>): Promise<void> {
  await updateDoc(docRef(), { ...data, updatedAt: serverTimestamp() });
}

/**
 * Utility: build a WhatsApp href from the config's whatsappNumber.
 * message is the pre-filled text.
 */
export function buildWhatsAppLink(config: SiteConfig, message: string): string {
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
