import type { Property, FAQItem } from '@/types';
import { SITE_URL, SITE_NAME } from './seo';

// ─── LocalBusiness / RealEstateAgent ────────────────────────────────────────

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'RealEstateAgent'],
    name: SITE_NAME,
    description:
      'Trusted property dealer in Behror, Neemrana, and Kotputli, Rajasthan. Specialising in residential plots, villas, and flats with transparent dealing.',
    url: SITE_URL,
    telephone: '+91-9876543210', // [DEMO]
    email: 'info@group24realty.com', // [DEMO]
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Main Market Road', // [DEMO]
      addressLocality: 'Behror',
      addressRegion: 'Rajasthan',
      postalCode: '301701',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 27.8904,
      longitude: 76.2782,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    areaServed: [
      { '@type': 'City', name: 'Behror' },
      { '@type': 'City', name: 'Neemrana' },
      { '@type': 'City', name: 'Kotputli' },
    ],
    serviceType: ['Residential Plot Sales', 'Villa Sales', 'Flat Sales', 'Property Consultancy'],
    priceRange: '₹₹',
    sameAs: [], // Add social media URLs when available
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
  const typeMap = {
    plot: 'LandmarksOrHistoricalBuildings',
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
      addressLocality: property.location.charAt(0).toUpperCase() + property.location.slice(1),
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

// NOTE: JsonLd component has been moved to src/lib/JsonLd.tsx
// Import it from there: import { JsonLd } from '@/lib/JsonLd';
export { JsonLd } from './JsonLd';

