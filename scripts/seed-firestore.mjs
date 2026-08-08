// Seed script: pushes mock property data into Firestore (legacy — superseded
// by seed-hierarchy.mjs / seed-site-data.mjs; kept for reference).
// Run once with: node --experimental-vm-modules scripts/seed-firestore.mjs
// OR: npx tsx scripts/seed-firestore.mjs
//
// Reads Firebase config from .env.local rather than hardcoding it, so this
// file is safe to commit — never inline real API keys/project config here.

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, Timestamp } from 'firebase/firestore';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env.local');
if (!existsSync(envPath)) throw new Error('.env.local not found');
const envContent = readFileSync(envPath, 'utf8');
function readEnv(key) {
  const match = envContent.match(new RegExp(`^${key}=(.+)$`, 'm'));
  if (!match) throw new Error(`${key} not found in .env.local`);
  return match[1].replace(/^["']|["']$/g, '');
}

const firebaseConfig = {
  apiKey: readEnv('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: readEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: readEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: readEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: readEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: readEnv('NEXT_PUBLIC_FIREBASE_APP_ID'),
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// ─── Mock Properties Data ─────────────────────────────────────────────────────
const properties = [
  {
    slug: 'residential-plot-behror-sector-12',
    title: '200 Sq.Yd Residential Plot — Behror Sector 12',
    type: 'plot',
    status: 'available',
    location: 'behror',
    address: 'Sector 12, Behror, Alwar, Rajasthan 301701',
    price: 2800000,
    priceLabel: '₹28 Lakh',
    pricePerUnit: '₹1,400/sq.yd',
    area: 200,
    areaUnit: 'sq.yd',
    amenities: ['DTCP Approved', 'Paved Roads', '24/7 Water Supply', 'Electricity Connection', 'Park Nearby'],
    highlights: ['Vastu-compliant', 'Corner plot', 'Ready for construction', 'Clear title'],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'],
    description: 'A prime 200 sq.yd residential plot located in the fast-developing Sector 12, Behror. With clear title documents, DTCP approval, and direct road access, this plot is ideal for constructing a family home or as a long-term investment along the NH-48 corridor.',
    nearbyLandmarks: ['NH-48 (2 km)', 'Behror Bus Stand (3 km)', 'Neemrana Industrial Zone (15 km)'],
    postedAt: new Date('2026-01-10').toISOString(),
    isFeatured: true,
    reraNumber: 'RAJ/P/XXXX/XXXX [DEMO]',
  },
  {
    slug: 'villa-behror-green-valley',
    title: '3 BHK Villa — Green Valley Township, Behror',
    type: 'villa',
    status: 'available',
    location: 'behror',
    address: 'Green Valley Township, Behror, Alwar, Rajasthan',
    price: 7500000,
    priceLabel: '₹75 Lakh',
    area: 1800,
    areaUnit: 'sq.ft',
    bedrooms: 3,
    bathrooms: 3,
    facing: 'East',
    amenities: ['Gated Community', 'Club House', 'Swimming Pool', '24/7 Security', 'Power Backup', 'Children Play Area'],
    highlights: ['East facing', 'Premium township', 'Modular kitchen', 'Italian marble flooring'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
    description: 'An elegantly designed 3 BHK villa in the prestigious Green Valley Township, Behror. Offering premium amenities including a swimming pool, clubhouse, and round-the-clock security, this is perfect for families seeking a luxurious lifestyle close to the Delhi-Jaipur Highway.',
    nearbyLandmarks: ['NH-48 (1 km)', 'Behror Town Centre (2 km)', 'Neemrana Fort Palace (20 km)'],
    postedAt: new Date('2026-01-15').toISOString(),
    isFeatured: true,
    reraNumber: 'RAJ/P/XXXX/XXXX [DEMO]',
  },
  {
    slug: 'flat-behror-sunrise-apartments',
    title: '2 BHK Flat — Sunrise Apartments, Behror',
    type: 'flat',
    status: 'available',
    location: 'behror',
    address: 'Sunrise Apartments, Near Bus Stand, Behror, Rajasthan',
    price: 3200000,
    priceLabel: '₹32 Lakh',
    pricePerUnit: '₹2,800/sq.ft',
    area: 1150,
    areaUnit: 'sq.ft',
    bedrooms: 2,
    bathrooms: 2,
    floor: '3rd Floor',
    amenities: ['Lift', 'Power Backup', 'CCTV Security', 'Reserved Parking', 'Terrace Garden'],
    highlights: ['Ready to move', 'Semi-furnished', 'Prime location', 'Great connectivity'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'],
    description: 'A well-designed 2 BHK flat in Sunrise Apartments, conveniently located near Behror Bus Stand. Features a modern layout, quality construction, and excellent connectivity to NH-48 and Neemrana Industrial Area.',
    nearbyLandmarks: ['Behror Bus Stand (500m)', 'NH-48 (3 km)', 'Local Market (1 km)'],
    postedAt: new Date('2026-01-20').toISOString(),
    isFeatured: true,
    reraNumber: 'RAJ/P/XXXX/XXXX [DEMO]',
  },
  {
    slug: 'plot-neemrana-sector-5',
    title: '300 Sq.Yd Industrial Plot — Neemrana Sector 5',
    type: 'plot',
    status: 'available',
    location: 'neemrana',
    address: 'Sector 5, Neemrana, Alwar, Rajasthan 301705',
    price: 5400000,
    priceLabel: '₹54 Lakh',
    pricePerUnit: '₹1,800/sq.yd',
    area: 300,
    areaUnit: 'sq.yd',
    amenities: ['RIICO Approved', 'Industrial Zone', '24/7 Power', 'Wide Roads', 'Security'],
    highlights: ['RIICO approved', 'Industrial zone', 'Strategic location', 'High appreciation potential'],
    images: ['https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80'],
    description: 'Prime 300 sq.yd industrial plot in the heart of Neemrana\'s RIICO industrial zone. Ideal for setting up a manufacturing unit, warehouse, or commercial establishment. Excellent road and highway connectivity.',
    nearbyLandmarks: ['RIICO Industrial Zone (adjacent)', 'Neemrana Fort Palace (5 km)', 'NH-48 (2 km)', 'Japanese Industrial Township (8 km)'],
    postedAt: new Date('2026-01-22').toISOString(),
    isFeatured: true,
    reraNumber: 'RAJ/P/XXXX/XXXX [DEMO]',
  },
  {
    slug: 'villa-neemrana-heritage-heights',
    title: '4 BHK Luxury Villa — Heritage Heights, Neemrana',
    type: 'villa',
    status: 'available',
    location: 'neemrana',
    address: 'Heritage Heights, Near Neemrana Fort Palace, Neemrana, Rajasthan',
    price: 12500000,
    priceLabel: '₹1.25 Cr',
    area: 3200,
    areaUnit: 'sq.ft',
    bedrooms: 4,
    bathrooms: 4,
    facing: 'North-East',
    amenities: ['Private Pool', 'Home Theatre', 'Smart Home Automation', 'Landscaped Garden', 'Staff Quarters', '3-car Garage'],
    highlights: ['Fort view', 'Private pool', 'Smart home tech', 'Premium finishes'],
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'],
    description: 'An ultra-luxury 4 BHK villa with stunning views of the historic Neemrana Fort Palace. This meticulously crafted residence features a private swimming pool, smart home automation, and the finest imported finishes throughout.',
    nearbyLandmarks: ['Neemrana Fort Palace (1.5 km)', 'NH-48 (4 km)', 'Neemrana Bus Stand (3 km)'],
    postedAt: new Date('2026-01-24').toISOString(),
    isFeatured: true,
    reraNumber: 'RAJ/P/XXXX/XXXX [DEMO]',
  },
  {
    slug: 'flat-neemrana-industrial-view',
    title: '1 BHK Flat — Industrial View Residency, Neemrana',
    type: 'flat',
    status: 'available',
    location: 'neemrana',
    address: 'Industrial View Residency, Neemrana, Alwar, Rajasthan',
    price: 1850000,
    priceLabel: '₹18.5 Lakh',
    pricePerUnit: '₹2,200/sq.ft',
    area: 850,
    areaUnit: 'sq.ft',
    bedrooms: 1,
    bathrooms: 1,
    floor: '2nd Floor',
    amenities: ['Lift', 'Security', 'Parking', 'Power Backup'],
    highlights: ['Affordable', 'Good rental yield', 'Near industrial zone', 'Ready possession'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'],
    description: 'A compact 1 BHK flat in Neemrana\'s growing residential zone. Excellent for investment with high rental demand from professionals working in the Neemrana Industrial Zone and the nearby Japanese Township.',
    nearbyLandmarks: ['RIICO Industrial Zone (3 km)', 'Neemrana Bus Stand (2 km)', 'Bawal (Haryana border) (20 km)'],
    postedAt: new Date('2026-01-25').toISOString(),
    isFeatured: false,
    reraNumber: 'RAJ/P/XXXX/XXXX [DEMO]',
  },
  {
    slug: 'plot-kotputli-highway-facing',
    title: '250 Sq.Yd Highway-Facing Plot — Kotputli',
    type: 'plot',
    status: 'available',
    location: 'kotputli',
    address: 'Near NH-48, Kotputli, Jaipur, Rajasthan 303108',
    price: 2100000,
    priceLabel: '₹21 Lakh',
    pricePerUnit: '₹840/sq.yd',
    area: 250,
    areaUnit: 'sq.yd',
    amenities: ['Highway Frontage', 'Commercial Potential', 'Clear Title', 'Electricity'],
    highlights: ['Highway facing', 'High commercial value', 'Near Jaipur', 'Good appreciation'],
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'],
    description: 'A strategically located 250 sq.yd highway-facing plot in Kotputli with excellent commercial potential. Kotputli\'s position on the Delhi-Jaipur highway makes it a high-growth investment corridor.',
    nearbyLandmarks: ['NH-48 (direct frontage)', 'Kotputli Town (2 km)', 'Jaipur (55 km)', 'Delhi (160 km)'],
    postedAt: new Date('2026-01-28').toISOString(),
    isFeatured: true,
    reraNumber: 'RAJ/P/XXXX/XXXX [DEMO]',
  },
  {
    slug: 'villa-kotputli-green-meadows',
    title: '3 BHK Villa — Green Meadows Colony, Kotputli',
    type: 'villa',
    status: 'available',
    location: 'kotputli',
    address: 'Green Meadows Colony, Kotputli, Jaipur, Rajasthan',
    price: 5800000,
    priceLabel: '₹58 Lakh',
    area: 1600,
    areaUnit: 'sq.ft',
    bedrooms: 3,
    bathrooms: 2,
    facing: 'West',
    amenities: ['Gated Community', 'Water Harvesting', 'Solar Power', 'Children Park', 'Temple'],
    highlights: ['Eco-friendly design', 'Gated colony', 'Peaceful environment', 'Near nature'],
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'],
    description: 'A beautifully designed 3 BHK eco-friendly villa in Green Meadows Colony, Kotputli. Features solar power, rainwater harvesting, and is surrounded by lush greenery — perfect for a peaceful family lifestyle close to Jaipur.',
    nearbyLandmarks: ['Kotputli Town Centre (4 km)', 'NH-48 (6 km)', 'Jaipur (55 km)'],
    postedAt: new Date('2026-02-01').toISOString(),
    isFeatured: false,
    reraNumber: 'RAJ/P/XXXX/XXXX [DEMO]',
  },
  {
    slug: 'flat-kotputli-city-center',
    title: '2 BHK Flat — City Centre Apartments, Kotputli',
    type: 'flat',
    status: 'sold',
    location: 'kotputli',
    address: 'City Centre Apartments, Main Market, Kotputli, Rajasthan',
    price: 2400000,
    priceLabel: '₹24 Lakh',
    pricePerUnit: '₹2,500/sq.ft',
    area: 960,
    areaUnit: 'sq.ft',
    bedrooms: 2,
    bathrooms: 2,
    floor: 'Top Floor',
    amenities: ['Terrace', 'Parking', 'Generator', 'Security'],
    highlights: ['Central location', 'Top floor', 'Good views', 'Sold — reference only'],
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'],
    description: 'This 2 BHK flat in Kotputli city centre has been sold. It serves as a reference for similar units we may have available. Please contact us for current listings in this area.',
    nearbyLandmarks: ['Kotputli Main Market (adjacent)', 'Bus Stand (1 km)', 'Hospital (2 km)'],
    postedAt: new Date('2026-02-05').toISOString(),
    isFeatured: false,
    reraNumber: 'RAJ/P/XXXX/XXXX [DEMO]',
  },
  {
    slug: 'plot-behror-commercial-main-road',
    title: '150 Sq.Yd Commercial Plot — Behror Main Road',
    type: 'plot',
    status: 'under-negotiation',
    location: 'behror',
    address: 'Main Market Road, Behror, Alwar, Rajasthan',
    price: 4200000,
    priceLabel: '₹42 Lakh',
    pricePerUnit: '₹2,800/sq.yd',
    area: 150,
    areaUnit: 'sq.yd',
    amenities: ['Main Road Frontage', 'Commercial Zone', 'Power', 'Water', 'Drainage'],
    highlights: ['Main road frontage', 'Commercial zone', 'High footfall', 'Rare opportunity'],
    images: ['https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80'],
    description: 'A rare 150 sq.yd commercial plot with direct main road frontage in Behror market. Currently under negotiation — contact us quickly if you are interested.',
    nearbyLandmarks: ['Behror Main Market (adjacent)', 'NH-48 (1 km)', 'Behror Bus Stand (500m)'],
    postedAt: new Date('2026-02-08').toISOString(),
    isFeatured: false,
    reraNumber: 'RAJ/P/XXXX/XXXX [DEMO]',
  },
  {
    slug: 'plot-neemrana-residential-colony',
    title: '180 Sq.Yd Residential Plot — Neemrana Residential Colony',
    type: 'plot',
    status: 'available',
    location: 'neemrana',
    address: 'Neemrana Residential Colony, Near NH-48, Neemrana, Rajasthan',
    price: 3100000,
    priceLabel: '₹31 Lakh',
    pricePerUnit: '₹1,722/sq.yd',
    area: 180,
    areaUnit: 'sq.yd',
    amenities: ['Residential Zone', 'Paved Roads', 'Street Lights', 'Parks', 'Near Schools'],
    highlights: ['Near schools', 'Peaceful area', 'Well-planned colony', 'Easy home loan'],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'],
    description: 'An affordable residential plot in Neemrana\'s well-planned residential colony. Surrounded by schools, parks, and daily amenities. Excellent for self-construction with easy home loan eligibility.',
    nearbyLandmarks: ['Neemrana School (1 km)', 'NH-48 (3 km)', 'Neemrana Bus Stand (2 km)', 'Medical Facilities (2 km)'],
    postedAt: new Date('2026-02-10').toISOString(),
    isFeatured: false,
    reraNumber: 'RAJ/P/XXXX/XXXX [DEMO]',
  },
  {
    slug: 'villa-kotputli-premium-enclave',
    title: '5 BHK Premium Villa — Royal Enclave, Kotputli',
    type: 'villa',
    status: 'available',
    location: 'kotputli',
    address: 'Royal Enclave, NH-48, Kotputli, Jaipur, Rajasthan',
    price: 18500000,
    priceLabel: '₹1.85 Cr',
    area: 4500,
    areaUnit: 'sq.ft',
    bedrooms: 5,
    bathrooms: 5,
    facing: 'East',
    amenities: ['Private Pool', 'Gym', 'Movie Room', 'Smart Home', 'Garden', 'Servants Quarters', '4-car Garage'],
    highlights: ['Ultra luxury', 'Highway connectivity', 'Close to Jaipur', 'Investment grade'],
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'],
    description: 'The pinnacle of luxury living in Kotputli — a 5 BHK villa spanning 4,500 sq.ft on a prime NH-48 facing plot. Features a private pool, dedicated gym, and a home movie room. Only 55 km from Jaipur, this is the ultimate investment for those seeking luxury in Rajasthan.',
    nearbyLandmarks: ['NH-48 (direct frontage)', 'Kotputli Town (5 km)', 'Jaipur Airport (65 km)', 'Delhi (160 km)'],
    postedAt: new Date('2026-02-12').toISOString(),
    isFeatured: true,
    reraNumber: 'RAJ/P/XXXX/XXXX [DEMO]',
  },
];

async function seed() {
  console.log('🌱 Starting Firestore seed for group24reality-web-2f3fd...\n');

  const col = collection(db, 'properties');

  // Check if already seeded
  const existing = await getDocs(query(col));
  if (!existing.empty) {
    console.log(`⚠️  ${existing.size} properties already exist in Firestore.`);
    console.log('   Delete the "properties" collection first if you want to re-seed.\n');
    process.exit(0);
  }

  let count = 0;
  for (const property of properties) {
    const ref = await addDoc(col, {
      ...property,
      postedAt: Timestamp.fromDate(new Date(property.postedAt)),
    });
    count++;
    console.log(`✅ [${count}/${properties.length}] Added: ${property.title} → ${ref.id}`);
  }

  console.log(`\n🎉 Seed complete! ${count} properties added to Firestore.\n`);
  console.log('📍 Firebase Console: https://console.firebase.google.com/project/group24reality-web-2f3fd/firestore\n');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message || err);
  process.exit(1);
});
