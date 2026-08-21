import type { Property, FAQItem, BlogPost, Testimonial } from '@/types';
import { SITE_URL, SITE_NAME } from './seo';

// ─── LocalBusiness / RealEstateAgent (multi-location) ───────────────────────
// Group 24 Reality operates two real offices — the NAP (name/address/phone)
// fields below must stay byte-identical to what's printed on the site (footer,
// contact page, FAQ) and to the Google Business Profile listings, since
// mismatched NAP data is a direct local-pack ranking penalty.
//
// These are kept as literals (not imported from firestore/siteConfig) so this
// file — which is also pulled into client bundles via components like
// FAQSection — doesn't drag the Firebase client SDK along with it.

const CONTACT_PERSON = 'Sunil Sangwan';
const PRIMARY_PHONE = '+91-9266982400';
const ALT_PHONE = '+91-9560199247';
const BUSINESS_EMAIL = 'info@group24reality.com';

const SAME_AS = ['https://www.facebook.com/group24reality', 'https://www.instagram.com/group24reality'];

const OPENING_HOURS = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00',
    closes: '19:00',
  },
];

const AREA_SERVED = [
  { '@type': 'City', name: 'Behror' },
  { '@type': 'City', name: 'Neemrana' },
  { '@type': 'City', name: 'Kotputli' },
];

const SERVICE_TYPES = ['Residential Plot Sales', 'Villa Sales', 'Flat Sales', 'Property Consultancy'];

function behrorOfficeSchema() {
  return {
    '@type': ['LocalBusiness', 'RealEstateAgent'],
    '@id': `${SITE_URL}/#behror-office`,
    name: `${SITE_NAME} — Main Office`,
    description:
      'Group 24 Reality main office, serving Behror, Neemrana, and Kotputli with verified residential plots, villas, and flats.',
    url: SITE_URL,
    telephone: PRIMARY_PHONE,
    email: BUSINESS_EMAIL,
    employee: { '@type': 'Person', name: CONTACT_PERSON },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'AA-111, Somnath City, Near Goonti Flyover, Delhi-Jaipur Highway',
      addressLocality: 'Behror',
      addressRegion: 'Rajasthan',
      postalCode: '301701',
      addressCountry: 'IN',
    },
    // Approximate — verify against an exact Google Maps pin for this address
    // before relying on this for local-pack placement.
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 27.8904,
      longitude: 76.2782,
    },
    openingHoursSpecification: OPENING_HOURS,
    areaServed: AREA_SERVED,
    serviceType: SERVICE_TYPES,
    priceRange: '₹₹',
    sameAs: SAME_AS,
  };
}

function gurugramOfficeSchema() {
  return {
    '@type': ['LocalBusiness', 'RealEstateAgent'],
    '@id': `${SITE_URL}/#gurugram-office`,
    name: `${SITE_NAME} — Head Office`,
    description:
      'Group 24 Reality head office in Gurugram, coordinating property consultancy for Behror, Neemrana, and Kotputli, Rajasthan.',
    url: SITE_URL,
    telephone: ALT_PHONE,
    email: BUSINESS_EMAIL,
    employee: { '@type': 'Person', name: CONTACT_PERSON },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Group24Reality, Plot No. 6 & 7, Sector 37C, Adjacent Corona Optus Society',
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      postalCode: '122001',
      addressCountry: 'IN',
    },
    // Sector/complex-level precision, not a verified pin for Plot No. 6 & 7
    // specifically — sourced by looking up a public listing physically located
    // inside the Corona Optus complex itself (same landmark named in this
    // address), via Mappls. Refine with an exact Google Business Profile pin
    // once one exists for this office.
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 28.454462,
      longitude: 76.991089,
    },
    openingHoursSpecification: OPENING_HOURS,
    areaServed: AREA_SERVED,
    serviceType: SERVICE_TYPES,
    priceRange: '₹₹',
    sameAs: SAME_AS,
  };
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [behrorOfficeSchema(), gurugramOfficeSchema()],
  };
}

// ─── AggregateRating / Review (homepage testimonials) ────────────────────────
// Built strictly from real Testimonial docs (Firestore `testimonials`
// collection, via getVisibleTestimonials()) — never invent ratings/reviews
// here. Caller must guard on `testimonials.length > 0` before rendering the
// result; this function itself returns null for an empty list rather than
// emitting a fake 0-review AggregateRating.
//
// KNOWN ISSUE (flagged, not fixed by this function): as of this writing the
// live `testimonials` collection contains exactly the 4 demo docs seeded by
// scripts/seed-site-data.mjs (ids test-001..test-004, e.g. "Rajesh Kumar
// Sharma") — placeholder names/reviews, not verified real customers. This
// function will faithfully turn whatever is in that collection into
// schema.org Review markup, so those placeholder reviews should be replaced
// with real ones (or the collection cleared) before this ships to production;
// see the audit report for details.
export function aggregateRatingSchema(testimonials: Testimonial[]) {
  if (testimonials.length === 0) return null;

  const ratingValue =
    Math.round(
      (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length) * 10
    ) / 10;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount: testimonials.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: testimonials.map((t) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: t.name },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: t.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: t.review,
      ...(t.createdAt ? { datePublished: t.createdAt.slice(0, 10) } : {}),
    })),
  };
}

// ─── BreadcrumbList ───────────────────────────────────────────────────────────

export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

// ─── FAQPage ─────────────────────────────────────────────────────────────────

export function faqPageSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ─── RealEstateListing (Property Detail) ─────────────────────────────────────

export function propertySchema(property: Property) {
  // schema.org has no dedicated "vacant land" residence type — asserting a
  // dwelling type for a plot would be inaccurate, so plots use the generic
  // `Product` type (still valid alongside the `offers` block below).
  const typeMap = {
    plot: 'Product',
    villa: 'SingleFamilyResidence',
    flat: 'Apartment',
  };

  return {
    '@context': 'https://schema.org',
    '@type': typeMap[property.type] ?? 'Residence',
    name: property.title,
    description: property.description,
    url: `${SITE_URL}/properties/${property.slug}`,
    image: property.images,
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
      addressLocality: (property.locationName || property.locationSlug || ''),
      addressRegion: 'Rajasthan',
      addressCountry: 'IN',
    },
    numberOfRooms: property.bedrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.area,
      unitCode: property.areaUnit === 'sq.ft' ? 'FTK' : 'YDK',
    },
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'INR',
      availability: property.status === 'available'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/SoldOut',
    },
  };
}

// ─── ItemList (Property Listing Pages) ────────────────────────────────────────

export function itemListSchema(properties: Property[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: properties.map((property, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/properties/${property.slug}`,
      name: property.title,
    })),
  };
}

// ─── BlogPosting (Blog Detail Page) ───────────────────────────────────────────

export function blogPostingSchema(blog: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImage ? [blog.coverImage] : undefined,
    url: `${SITE_URL}/blogs/${blog.slug}`,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: {
      '@type': 'Person',
      name: blog.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blogs/${blog.slug}`,
    },
    keywords: blog.tags.join(', ') || undefined,
    articleSection: blog.category,
  };
}

// NOTE: JsonLd component has been moved to src/lib/JsonLd.tsx
// Import it from there: import { JsonLd } from '@/lib/JsonLd';
export { JsonLd } from './JsonLd';

