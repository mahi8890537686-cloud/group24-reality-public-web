// ─── Property Types ──────────────────────────────────────────────────────────

export type PropertyType = 'plot' | 'villa' | 'flat';
export type PropertyStatus = 'available' | 'sold' | 'under-negotiation';
export type LocationKey = 'behror' | 'neemrana' | 'kotputli';
export type AreaUnit = 'sq.yd' | 'sq.ft';

export interface Property {
  id: string;
  slug: string;
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  location: LocationKey;
  address: string; // [DEMO] — replace from CMS
  price: number; // INR
  priceLabel: string; // formatted e.g. "₹45 Lakh"
  pricePerUnit?: string; // e.g. "₹1,200/sq.ft"
  area: number;
  areaUnit: AreaUnit;
  bedrooms?: number;
  bathrooms?: number;
  facing?: string;
  floor?: string;
  amenities: string[];
  highlights: string[];
  images: string[]; // URLs compatible with next/image
  description: string;
  nearbyLandmarks: string[];
  postedAt: string; // ISO date string
  isFeatured: boolean;
  reraNumber?: string; // [DEMO] — add actual RERA before launch
}

// ─── Location Types ───────────────────────────────────────────────────────────

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
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export interface FAQItem {
  question: string;
  answer: string;
}

// ─── Filter / Sort ────────────────────────────────────────────────────────────

export interface PropertyFilters {
  location?: LocationKey | 'all';
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
