/**
 * seed-site-data.mjs
 *
 * Seeds Firestore with:
 *   1. Locations  (3 docs)  → `locations` collection
 *   2. Testimonials (4 docs) → `testimonials` collection
 *   3. Site Config (1 doc)  → `siteConfig/main`
 *   4. Properties (12 docs) → `properties` collection
 *
 * Run: node scripts/seed-site-data.mjs
 *
 * Uses Firebase Admin SDK via _admin-init.mjs (reads credentials from .env.local)
 * Safe to run multiple times — uses setDoc with merge:true so it won't duplicate.
 */

import { db } from './_admin-init.mjs';
import { FieldValue } from 'firebase-admin/firestore';

// ─── 1. Site Config ───────────────────────────────────────────────────────────

const SITE_CONFIG = {
  businessName: 'Group 24 Reality',
  contactPerson: 'Sunil Sangwan',
  // Primary number (field office / Behror)
  phone: '+91-92669-82400',
  phoneHref: 'tel:+919266982400',
  // Secondary number
  phone2: '+91-95601-99247',
  phone2Href: 'tel:+919560199247',
  // WhatsApp uses the primary number
  whatsappNumber: '919266982400',
  email: 'info@group24reality.com',
  // Main Field Office — Behror
  mainOfficeLabel: 'Main Office',
  mainOfficeAddress: 'AA-111, SOMNATH CITY, Near Goonti Flyover,\nDelhi–Jaipur Highway, Behror, Rajasthan 301701',
  // Head / Corporate Office — Gurugram
  headOfficeLabel: 'Head Office',
  headOfficeAddress: 'Group24Reality, Plot No. 6 & 7, Sector 37C,\nAdjacent Corona Optus Society, Gurugram, Haryana 122001',
  // Map embed uses head office
  mapEmbedQuery: 'Sector+37C+Gurugram+Haryana',
  businessHoursWeekday: 'Mon – Sat: 9:00 AM – 7:00 PM',
  businessHoursWeekend: 'Sunday: By Appointment Only',
  instagramHandle: '@group24reality',
  facebookUrl: 'https://www.facebook.com/group24reality',
  instagramUrl: 'https://www.instagram.com/group24reality',
  websiteUrl: 'www.group24reality.com',
  updatedAt: FieldValue.serverTimestamp(),
};


// ─── 2. Locations ─────────────────────────────────────────────────────────────

const LOCATIONS = [
  {
    id: 'behror',
    name: 'Behror',
    slug: 'behror',
    state: 'Rajasthan',
    tagline: 'The Rising Town of Alwar on the Delhi–Jaipur Highway',
    description:
      'Behror is a rapidly growing town in Alwar district, Rajasthan, strategically located on the Delhi–Jaipur National Highway 48. With excellent road connectivity, a growing commercial presence, and proximity to the RIICO industrial belt, Behror has emerged as a sought-after destination for residential and investment property in northern Rajasthan.',
    coverImage:
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80',
    investmentPoints: [
      'Direct NH-48 connectivity between Delhi and Jaipur',
      'Rising land values driven by RIICO industrial expansion',
      'Developing social infrastructure: schools, hospitals, markets',
      'Strong demand for residential plots from industrial workforce',
      'Affordable entry price compared to Gurugram and Bhiwadi',
    ],
    connectivity: [
      'Delhi (120 km via NH-48)',
      'Jaipur (130 km via NH-48)',
      'Rewari Haryana (20 km)',
      'Neemrana (30 km)',
      'Kotputli (55 km)',
    ],
    infrastructure: [
      'RIICO Industrial Area Behror',
      'Government District Hospital',
      'DPS Behror School',
      'City commercial market',
      'Multiple banks and ATMs',
    ],
    seoKeywords: [
      'real estate in Behror',
      'property dealer in Behror',
      'plots for sale in Behror',
      'villas in Behror',
      'residential plots near Behror',
      'buy property in Behror Rajasthan',
    ],
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    id: 'neemrana',
    name: 'Neemrana',
    slug: 'neemrana',
    state: 'Rajasthan',
    tagline: "Rajasthan's Premier Industrial & Heritage Investment Hub",
    description:
      'Neemrana is one of the most prominent investment destinations in Rajasthan, home to the largest Japanese industrial zone in India outside of major metros. Located on NH-48 and forming part of the Delhi–Mumbai Industrial Corridor (DMIC), Neemrana attracts both Indian and foreign investors, driving exceptional real estate demand in the region.',
    coverImage:
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
    investmentPoints: [
      'Largest Japanese Industrial Cluster in Rajasthan',
      'Delhi–Mumbai Industrial Corridor (DMIC) influence zone',
      'High rental yields from corporate executives and expats',
      'Heritage tourism from Neemrana Fort draws steady visitors',
      '90 minutes from IGI Airport, Delhi',
    ],
    connectivity: [
      'Delhi (90 km via NH-48)',
      'IGI Airport (100 km)',
      'Behror (30 km)',
      'Gurugram (75 km)',
      'Jaipur (145 km)',
    ],
    infrastructure: [
      'Japanese Industrial Zone (RIICO Phase I–IV)',
      'DMIC Shahjahanpur Smart City Node',
      'Neemrana Fort Palace (Tourism & Heritage)',
      'Leading private schools',
      'Multi-specialty hospitals',
    ],
    seoKeywords: [
      'plots for sale in Neemrana',
      'residential plots near Neemrana',
      'property in Neemrana Rajasthan',
      'real estate investment Neemrana',
      'villas in Neemrana',
      'flats in Neemrana',
    ],
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    id: 'kotputli',
    name: 'Kotputli',
    slug: 'kotputli',
    state: 'Rajasthan',
    tagline: 'The Gateway to Jaipur — Affordable Growth on NH-48',
    description:
      'Kotputli sits at the crossroads of Rajasthan and Haryana on National Highway 48, serving as the northern gateway to Jaipur. With Jaipur just 55 km away and excellent rail and road connectivity, Kotputli is witnessing rapid urbanisation. Its RIICO industrial estate and strong agricultural trade ensure a balanced local economy with solid real estate fundamentals.',
    coverImage:
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e3?w=800&q=80',
    investmentPoints: [
      'Only 55 km from Jaipur on NH-48',
      'Growing RIICO industrial estate creating workforce housing demand',
      'Most affordable property prices in the NH-48 corridor',
      'Kotputli–Behror new district formation boosting infrastructure investment',
      'Active agricultural trade supports local economy',
    ],
    connectivity: [
      'Jaipur (55 km via NH-48)',
      'Delhi (175 km via NH-48)',
      'Behror (55 km)',
      'Neemrana (85 km)',
      'Kotputli Railway Station (passenger & freight)',
    ],
    infrastructure: [
      'RIICO Industrial Area Kotputli',
      'Kotputli Government Hospital',
      'Engineering & Polytechnic Colleges',
      'Active grain and vegetable mandi',
      'Expanding commercial market area',
    ],
    seoKeywords: [
      'flats for sale in Kotputli',
      'plots for sale in Kotputli',
      'investment property in Kotputli',
      'real estate in Kotputli Rajasthan',
      'affordable plots near Jaipur',
      'property dealer in Kotputli',
    ],
    createdAt: FieldValue.serverTimestamp(),
  },
];

// ─── 3. Testimonials ──────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    id: 'test-001',
    name: 'Rajesh Kumar Sharma',
    location: 'Delhi — Purchased Plot in Behror',
    propertyType: 'plot',
    rating: 5,
    review:
      'Group24 Realty made my first property purchase completely stress-free. They showed me multiple verified plots in Behror, explained every document in detail, and arranged the site visit within a day. The pricing was transparent with no hidden charges. Highly recommend for anyone looking to invest near NH-48.',
    order: 1,
    isVisible: true,
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    id: 'test-002',
    name: 'Sunita & Anil Verma',
    location: 'Gurugram — Purchased Villa in Neemrana',
    propertyType: 'villa',
    rating: 5,
    review:
      "We were looking for a weekend home near Delhi and found this beautiful villa in Neemrana through Group24 Realty. The team's local knowledge was exceptional — they knew every road, every project, and every regulation. The registry process was smooth and completed in time. Truly a professional team.",
    order: 2,
    isVisible: true,
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    id: 'test-003',
    name: 'Mohammed Arif Khan',
    location: 'Jaipur — Purchased Flat in Kotputli',
    propertyType: 'flat',
    rating: 5,
    review:
      "As a first-time buyer, I was nervous about the process. Group24 Realty's team patiently guided me through every step — from loan assistance to documentation. The flat in Kotputli is exactly as described and the price was the best I found in the market. Will definitely refer friends and family.",
    order: 3,
    isVisible: true,
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    id: 'test-004',
    name: 'Priya Meena',
    location: 'Behror — Purchased Plot in Neemrana',
    propertyType: 'plot',
    rating: 5,
    review:
      "I invested in a plot in the DMIC zone through Group24 Realty. Their advice on the growth corridor proved correct — the land has appreciated well since my purchase. They connected me with a good lawyer for the title verification too. A team that genuinely cares about the buyer's interests.",
    order: 4,
    isVisible: true,
    createdAt: FieldValue.serverTimestamp(),
  },
];

// ─── 4. Properties ────────────────────────────────────────────────────────────

const PROPERTIES = [
  // ── BEHROR ──────────────────────────────────────────────────────────────────
  {
    id: 'prop-001',
    slug: 'residential-plot-behror-sector-12',
    title: 'Premium Residential Plot in Behror Sector 12',
    type: 'plot', status: 'available',
    locationId: 'behror', locationName: 'Behror', locationSlug: 'behror',
    projectId: 'somnath-city', projectName: 'Somnath City', projectSlug: 'somnath-city',
    address: 'Sector 12, Behror, Alwar, Rajasthan — 301701',
    price: 1800000, priceLabel: '₹18 Lakh', pricePerUnit: '₹1,500/sq.yd',
    area: 120, areaUnit: 'sq.yd', facing: 'East',
    amenities: ['Wide Road Access', 'Electricity Connection', 'Water Pipeline', 'Clear Title Deed', 'Boundary Wall', 'Street Lighting'],
    highlights: ['NH-48 Connectivity', 'RERA Compliant', 'Vastu-Friendly East Facing', 'Gated Community'],
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80'],
    description: 'A prime east-facing residential plot in the fast-developing Sector 12 of Behror. Situated on a 30-foot road with complete civic infrastructure. Ideal for constructing your dream home or as a long-term investment property. Just 5 km from NH-48, offering excellent connectivity to Delhi-Jaipur highway.',
    nearbyLandmarks: ['Behror Bus Stand (3 km)', 'Government Hospital Behror (4 km)', 'Sunrise Public School (1.5 km)', 'NH-48 Entry (5 km)'],
    postedAt: '2025-11-15T00:00:00Z', isFeatured: true, reraNumber: 'RAJ/P/2025/001',
  },
  {
    id: 'prop-002',
    slug: 'villa-behror-green-valley',
    title: 'Modern 3BHK Villa in Green Valley Behror',
    type: 'villa', status: 'available',
    locationId: 'behror', locationName: 'Behror', locationSlug: 'behror',
    projectId: 'somnath-city', projectName: 'Somnath City', projectSlug: 'somnath-city',
    address: 'Green Valley Township, Behror, Alwar, Rajasthan',
    price: 6500000, priceLabel: '₹65 Lakh',
    area: 1800, areaUnit: 'sq.ft', bedrooms: 3, bathrooms: 3,
    facing: 'North', floor: 'Ground + 1',
    amenities: ['Modular Kitchen', 'Covered Parking', 'Power Backup', 'Clubhouse Access', 'Landscaped Garden', 'Security Guard', 'CCTV Surveillance', 'RO Water System'],
    highlights: ['Ready to Move', 'Vaastu Compliant', 'Township with Amenities', 'Gated Community'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'],
    description: 'A beautifully designed 3BHK villa in the premium Green Valley Township, Behror. Spread across 1,800 sq. ft. with top-quality fixtures and finishes. The township offers a clubhouse, landscaped gardens, and 24/7 security — perfect for families seeking a modern lifestyle with the tranquility of Rajasthan.',
    nearbyLandmarks: ['Behror Railway Station (2 km)', 'DPS Behror (4 km)', 'City Mall Behror (3 km)', 'RIICO Industrial Area (6 km)'],
    postedAt: '2025-12-01T00:00:00Z', isFeatured: true, reraNumber: 'RAJ/P/2025/002',
  },
  {
    id: 'prop-003',
    slug: 'flat-behror-sunrise-apartments',
    title: '2BHK Flat in Sunrise Apartments Behror',
    type: 'flat', status: 'available',
    locationId: 'behror', locationName: 'Behror', locationSlug: 'behror',
    projectId: 'somnath-city', projectName: 'Somnath City', projectSlug: 'somnath-city',
    address: 'Sunrise Apartments, Main Market Road, Behror, Rajasthan',
    price: 3200000, priceLabel: '₹32 Lakh', pricePerUnit: '₹2,900/sq.ft',
    area: 1100, areaUnit: 'sq.ft', bedrooms: 2, bathrooms: 2,
    facing: 'West', floor: '3rd Floor',
    amenities: ['Lift', 'Covered Parking', 'Backup Generator', 'Intercom', 'Terrace Garden', 'Gym'],
    highlights: ['Prime Market Location', 'Bank Loan Available', 'Low Maintenance Society'],
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
    description: 'A well-planned 2BHK apartment in the popular Sunrise Apartments complex, centrally located in Behror. Modern interiors, ample natural light, and easy access to market, schools, and transport make this an excellent choice for first-time home buyers and investors alike.',
    nearbyLandmarks: ['Behror Bus Stand (500 m)', 'City Center (200 m)', 'Govt. Senior Secondary School (1 km)', 'Primary Health Centre (1.5 km)'],
    postedAt: '2026-01-10T00:00:00Z', isFeatured: false, reraNumber: 'RAJ/P/2025/003',
  },
  {
    id: 'prop-004',
    slug: 'plot-behror-highway-touch',
    title: 'Highway-Touch Commercial & Residential Plot in Behror',
    type: 'plot', status: 'available',
    locationId: 'behror', locationName: 'Behror', locationSlug: 'behror',
    projectId: 'somnath-city', projectName: 'Somnath City', projectSlug: 'somnath-city',
    address: 'NH-48 Highway Touch, Behror, Alwar, Rajasthan',
    price: 3500000, priceLabel: '₹35 Lakh', pricePerUnit: '₹2,200/sq.yd',
    area: 160, areaUnit: 'sq.yd', facing: 'South',
    amenities: ['Highway Frontage', 'Commercial Potential', 'All Utilities Available', 'Clear Registry'],
    highlights: ['High Investment Return', 'Dual Use: Commercial & Residential', 'Direct NH-48 Access'],
    images: ['https://images.unsplash.com/photo-1504671957578-11bdd62e4d53?w=800&q=80', 'https://images.unsplash.com/photo-1465301055284-72a8c30a3bae?w=800&q=80'],
    description: 'A rare highway-touch plot in Behror, suitable for commercial or residential development. Directly accessible from the Delhi–Jaipur NH-48, making it ideal for showroom, warehouse, or residential complex development. High footfall zone with excellent future appreciation potential.',
    nearbyLandmarks: ['RIICO Industrial Area (3 km)', 'Delhi via NH-48 (120 km)', 'Jaipur via NH-48 (130 km)', 'Behror Town Center (2 km)'],
    postedAt: '2026-02-05T00:00:00Z', isFeatured: false, reraNumber: 'RAJ/P/2025/004',
  },
  // ── NEEMRANA ────────────────────────────────────────────────────────────────
  {
    id: 'prop-005',
    slug: 'residential-plot-neemrana-riico',
    title: 'Residential Plot Near RIICO Industrial Area Neemrana',
    type: 'plot', status: 'available',
    locationId: 'neemrana', locationName: 'Neemrana', locationSlug: 'neemrana',
    projectId: 'neemrana-green-valley', projectName: 'Neemrana Green Valley', projectSlug: 'neemrana-green-valley',
    address: 'Near RIICO Phase III, Neemrana, Alwar, Rajasthan',
    price: 2800000, priceLabel: '₹28 Lakh', pricePerUnit: '₹2,000/sq.yd',
    area: 140, areaUnit: 'sq.yd', facing: 'East',
    amenities: ['Metalled Road', 'Water Pipeline', 'Electricity Board Connection', 'Clear Title', 'Drainage System'],
    highlights: ['DMIC Growth Corridor', 'Japanese Industrial Zone Nearby', 'Strong Rental Demand', 'Freehold Property'],
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80', 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&q=80'],
    description: "A strategically located residential plot near the RIICO industrial area in Neemrana — one of Rajasthan's fastest-growing investment hubs. The region houses leading Japanese MNCs and benefits from the Delhi–Mumbai Industrial Corridor (DMIC). Excellent rental yield potential due to high workforce demand from nearby factories.",
    nearbyLandmarks: ['RIICO Industrial Area (2 km)', 'Japanese Zone (4 km)', 'Neemrana Fort (8 km)', 'Shahjahanpur (DMIC node) (15 km)'],
    postedAt: '2025-10-20T00:00:00Z', isFeatured: true, reraNumber: 'RAJ/P/2025/005',
  },
  {
    id: 'prop-006',
    slug: 'villa-neemrana-heritage-heights',
    title: '4BHK Luxury Villa in Heritage Heights Neemrana',
    type: 'villa', status: 'available',
    locationId: 'neemrana', locationName: 'Neemrana', locationSlug: 'neemrana',
    projectId: 'neemrana-green-valley', projectName: 'Neemrana Green Valley', projectSlug: 'neemrana-green-valley',
    address: 'Heritage Heights, Neemrana-Alwar Road, Rajasthan',
    price: 11500000, priceLabel: '₹1.15 Cr',
    area: 3200, areaUnit: 'sq.ft', bedrooms: 4, bathrooms: 4,
    facing: 'North', floor: 'Ground + 2',
    amenities: ['Private Pool', 'Landscaped Garden', 'Smart Home Features', 'Home Theatre Room', 'Double Garage', 'Solar Panels', 'Servant Quarters', '24x7 Security'],
    highlights: ['Luxury Specification', 'Fort View from Terrace', 'Premium Township', 'Near Delhi 90 Min'],
    images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'],
    description: "An opulent 4BHK luxury villa set in the scenic Heritage Heights township of Neemrana. Offering spectacular views of the historic Neemrana Fort, this residence combines modern luxury with Rajasthan's rich cultural heritage. Premium smart home fittings, private pool, and eco-friendly solar setup make this a truly distinguished property.",
    nearbyLandmarks: ['Neemrana Fort Palace (5 km)', 'Delhi Border (90 km via NH-48)', 'IGI Airport (100 km)', 'Manesar Industrial Hub (70 km)'],
    postedAt: '2025-09-15T00:00:00Z', isFeatured: true, reraNumber: 'RAJ/P/2025/006',
  },
  {
    id: 'prop-007',
    slug: 'flat-neemrana-sky-residency',
    title: '2BHK Flat in Sky Residency Neemrana',
    type: 'flat', status: 'available',
    locationId: 'neemrana', locationName: 'Neemrana', locationSlug: 'neemrana',
    projectId: 'neemrana-green-valley', projectName: 'Neemrana Green Valley', projectSlug: 'neemrana-green-valley',
    address: 'Sky Residency Complex, Neemrana, Alwar, Rajasthan',
    price: 4200000, priceLabel: '₹42 Lakh', pricePerUnit: '₹3,200/sq.ft',
    area: 1300, areaUnit: 'sq.ft', bedrooms: 2, bathrooms: 2,
    facing: 'East', floor: '5th Floor',
    amenities: ['High-Speed Lift', 'Covered Parking', 'Swimming Pool', 'Children Play Area', 'Power Backup', 'Fire Safety System'],
    highlights: ['Walking Distance to MNC Offices', 'High Rental Yield', 'Well-Maintained Society'],
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80'],
    description: "A premium 2BHK apartment in the well-managed Sky Residency complex, Neemrana. Located within walking distance of the Japanese industrial zone, this flat commands strong rental returns from corporate executives and expats working in the nearby factories. A smart investment in India's most active industrial corridor outside NCR.",
    nearbyLandmarks: ['Japanese Industrial Zone (1.5 km)', 'RIICO Industrial Area (3 km)', 'Neemrana Bus Stand (2 km)', 'Bawal (Haryana border) (20 km)'],
    postedAt: '2026-01-25T00:00:00Z', isFeatured: false, reraNumber: 'RAJ/P/2025/007',
  },
  {
    id: 'prop-008',
    slug: 'plot-neemrana-dmic-zone',
    title: 'Investment Plot in DMIC Zone Neemrana',
    type: 'plot', status: 'available',
    locationId: 'neemrana', locationName: 'Neemrana', locationSlug: 'neemrana',
    projectId: 'neemrana-green-valley', projectName: 'Neemrana Green Valley', projectSlug: 'neemrana-green-valley',
    address: 'DMIC Influence Zone, Near Shahjahanpur, Neemrana',
    price: 4500000, priceLabel: '₹45 Lakh', pricePerUnit: '₹2,500/sq.yd',
    area: 180, areaUnit: 'sq.yd', facing: 'South',
    amenities: ['On Wide Road', 'Clear Patta', 'Electricity Available', 'Freehold'],
    highlights: ['DMIC High-Growth Zone', 'Industrial Corridor Proximity', 'Strong Capital Appreciation'],
    images: ['https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80'],
    description: 'A high-potential investment plot located within the influence zone of the Delhi-Mumbai Industrial Corridor (DMIC) near Neemrana. As the DMIC continues to develop, land prices in this zone are expected to appreciate significantly. Freehold land with clear title documentation — ideal for savvy investors.',
    nearbyLandmarks: ['DMIC Shahjahanpur Node (8 km)', 'Neemrana Industrial Area (12 km)', 'Rewari Railway Station (25 km)', 'Behror Town (15 km)'],
    postedAt: '2026-03-01T00:00:00Z', isFeatured: false, reraNumber: 'RAJ/P/2025/008',
  },
  // ── KOTPUTLI ────────────────────────────────────────────────────────────────
  {
    id: 'prop-009',
    slug: 'plot-kotputli-green-meadows',
    title: 'Affordable Residential Plot in Green Meadows Kotputli',
    type: 'plot', status: 'available',
    locationId: 'kotputli', locationName: 'Kotputli', locationSlug: 'kotputli',
    projectId: 'kotputli-residency', projectName: 'Kotputli Residency', projectSlug: 'kotputli-residency',
    address: 'Green Meadows Colony, Kotputli, Jaipur, Rajasthan',
    price: 1200000, priceLabel: '₹12 Lakh', pricePerUnit: '₹1,000/sq.yd',
    area: 120, areaUnit: 'sq.yd', facing: 'East',
    amenities: ['Wide Road', 'Underground Drainage', 'Electricity', 'Clear Registry', 'Corner Plot'],
    highlights: ['Affordable Entry Price', 'Near Jaipur (55 km)', 'Fast Developing Area', 'Vastu-Friendly East Facing'],
    images: ['https://images.unsplash.com/photo-1599587493892-62b62f46cabe?w=800&q=80', 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80'],
    description: 'An affordable residential plot in the planned Green Meadows Colony, Kotputli — the gateway to Jaipur on the NH-48 corridor. With Jaipur just 55 km away and excellent road connectivity, property values in Kotputli are appreciating steadily. Perfect for those looking to invest in Rajasthan real estate on a budget.',
    nearbyLandmarks: ['Kotputli Railway Station (3 km)', 'Govt. District Hospital (4 km)', 'Kotputli Market (2 km)', 'Jaipur (55 km via NH-48)'],
    postedAt: '2025-11-01T00:00:00Z', isFeatured: true, reraNumber: 'RAJ/P/2025/009',
  },
  {
    id: 'prop-010',
    slug: 'villa-kotputli-sunrise-villas',
    title: '3BHK Villa in Sunrise Villas Township Kotputli',
    type: 'villa', status: 'available',
    locationId: 'kotputli', locationName: 'Kotputli', locationSlug: 'kotputli',
    projectId: 'kotputli-residency', projectName: 'Kotputli Residency', projectSlug: 'kotputli-residency',
    address: 'Sunrise Villas Township, Kotputli-Jaipur Road, Rajasthan',
    price: 5500000, priceLabel: '₹55 Lakh',
    area: 1600, areaUnit: 'sq.ft', bedrooms: 3, bathrooms: 3,
    facing: 'East', floor: 'Ground + 1',
    amenities: ['Modular Kitchen', 'Covered Parking', 'Power Backup', 'Garden Area', 'Rainwater Harvesting', 'Security'],
    highlights: ['Ready to Move', 'Township with Parks', 'Near Industrial Growth Corridor', 'Attractive Price for 3BHK Villa'],
    images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80', 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80', 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=800&q=80'],
    description: "A well-priced 3BHK villa in the developing Sunrise Villas Township on the Kotputli-Jaipur road. Ideal for families seeking a peaceful residential environment without compromising on modern amenities. The township features wide internal roads, parks, and 24x7 security at a price point that is rare in today's market.",
    nearbyLandmarks: ['Kotputli Town Center (4 km)', 'NH-48 (2 km)', 'Engineering College Kotputli (5 km)', 'Jaipur (55 km)'],
    postedAt: '2025-12-20T00:00:00Z', isFeatured: true, reraNumber: 'RAJ/P/2025/010',
  },
  {
    id: 'prop-011',
    slug: 'flat-kotputli-metro-heights',
    title: '1BHK Starter Flat in Metro Heights Kotputli',
    type: 'flat', status: 'available',
    locationId: 'kotputli', locationName: 'Kotputli', locationSlug: 'kotputli',
    projectId: 'kotputli-residency', projectName: 'Kotputli Residency', projectSlug: 'kotputli-residency',
    address: 'Metro Heights Apartments, Station Road, Kotputli, Rajasthan',
    price: 2000000, priceLabel: '₹20 Lakh', pricePerUnit: '₹2,500/sq.ft',
    area: 800, areaUnit: 'sq.ft', bedrooms: 1, bathrooms: 1,
    facing: 'East', floor: '2nd Floor',
    amenities: ['Lift', 'Open Parking', 'CCTV', 'Water Storage Tank'],
    highlights: ['Entry-Level Investment', 'Railway Station Proximity', 'Rental Income Potential'],
    images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'],
    description: "An entry-level 1BHK apartment in the Metro Heights complex, ideally located near Kotputli Railway Station. A great starter home or smart investment for those looking to benefit from Kotputli's growing connectivity to Jaipur and Delhi. Expected rental demand from railway staff and small business owners in the area.",
    nearbyLandmarks: ['Kotputli Railway Station (500 m)', 'Market Area (1 km)', 'Primary School (800 m)', 'RIICO Kotputli Industrial Area (6 km)'],
    postedAt: '2026-02-14T00:00:00Z', isFeatured: false, reraNumber: 'RAJ/P/2025/011',
  },
  {
    id: 'prop-012',
    slug: 'plot-kotputli-industrial-fringe',
    title: 'Large Residential Plot on Kotputli Industrial Fringe',
    type: 'plot', status: 'available',
    locationId: 'kotputli', locationName: 'Kotputli', locationSlug: 'kotputli',
    projectId: 'kotputli-residency', projectName: 'Kotputli Residency', projectSlug: 'kotputli-residency',
    address: 'Industrial Fringe Zone, Kotputli, Jaipur, Rajasthan',
    price: 2200000, priceLabel: '₹22 Lakh', pricePerUnit: '₹1,375/sq.yd',
    area: 160, areaUnit: 'sq.yd', facing: 'North',
    amenities: ['Metalled Road', 'Electricity Available', 'Freehold Plot', 'Clear Patta'],
    highlights: ['Close to RIICO Industrial Area', 'Workforce Housing Demand', 'Strong Future Appreciation'],
    images: ['https://images.unsplash.com/photo-1548017704-7769e6e2b4c0?w=800&q=80'],
    description: "A larger-format residential plot on the fringe of Kotputli's growing industrial zone. With RIICO continuing to expand its footprint in Kotputli, demand for worker housing, staff quarters, and affordable residential developments is increasing rapidly. This plot offers a compelling opportunity for developers or investors with a medium-term horizon.",
    nearbyLandmarks: ['RIICO Industrial Area Kotputli (2 km)', 'Kotputli Bus Terminal (5 km)', 'Rajiv Gandhi Poly Clinic (3 km)', 'NH-48 (4 km)'],
    postedAt: '2026-01-30T00:00:00Z', isFeatured: false, reraNumber: 'RAJ/P/2025/012',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function upsertDoc(collectionName, id, data) {
  const ref = db.collection(collectionName).doc(id);
  await ref.set(data, { merge: true });
  console.log(`  ✓ ${collectionName}/${id}`);
}

async function upsertAutoId(collectionName, id, data) {
  // Use the provided ID as the document ID
  const ref = db.collection(collectionName).doc(id);
  await ref.set(data, { merge: true });
  console.log(`  ✓ ${collectionName}/${id}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌱 Seeding Firestore...\n');

  // 1. Site Config
  console.log('📋 siteConfig/main');
  await upsertDoc('siteConfig', 'main', SITE_CONFIG);

  // 2. Locations
  console.log('\n📍 Locations');
  for (const loc of LOCATIONS) {
    const { id, ...data } = loc;
    await upsertAutoId('locations', id, data);
  }

  // 3. Testimonials
  console.log('\n💬 Testimonials');
  for (const t of TESTIMONIALS) {
    const { id, ...data } = t;
    await upsertAutoId('testimonials', id, data);
  }

  // 4. Properties
  console.log('\n🏠 Properties');
  for (const p of PROPERTIES) {
    const { id, ...data } = p;
    await upsertAutoId('properties', id, data);
  }

  console.log('\n✅ Seeding complete!\n');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n❌ Seed failed:', err);
  process.exit(1);
});
