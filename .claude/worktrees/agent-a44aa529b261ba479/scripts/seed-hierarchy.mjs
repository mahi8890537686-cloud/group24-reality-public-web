// Migration seed: creates 3 locations, 6 projects, and re-seeds 12 properties
// with the new Location → Project → Site hierarchy.
// Run: node scripts/seed-hierarchy.mjs

import { Timestamp } from 'firebase-admin/firestore';
import { db } from './_admin-init.mjs';

// ── 1. LOCATIONS ─────────────────────────────────────────────────────────────
const LOCATIONS = [
  {
    slug: 'behror', name: 'Behror', state: 'Rajasthan',
    tagline: 'Gateway to NCR — Fastest-growing investment corridor',
    description: 'Behror is a rapidly developing city on NH-48 (Delhi-Jaipur Highway), attracting major industrial and residential investment.',
    coverImage: 'https://images.unsplash.com/photo-1504671957578-11bdd62e4d53?w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=Behror,Rajasthan',
    investmentPoints: ['On NH-48 Delhi–Jaipur Highway', 'Fastest growing real estate market in Rajasthan', 'Industrial hub with major MNCs', 'Affordable land prices with high appreciation potential'],
    connectivity: ['90 minutes from Delhi', '45 minutes from Gurugram', '2 hours from Jaipur', 'Near Shahjahanpur Neemrana Behror (SNB) Urban Complex'],
    infrastructure: ['RIICO Industrial Area', 'DMIC corridor', 'Proposed metro extension', 'New AIIMS Rewari nearby'],
    seoKeywords: ['plots in behror', 'residential plots behror', 'invest in behror', 'behror real estate'],
  },
  {
    slug: 'neemrana', name: 'Neemrana', state: 'Rajasthan',
    tagline: 'Industrial powerhouse with heritage charm',
    description: 'Neemrana is home to the prestigious Japanese Industrial Zone and is one of the most sought-after investment destinations in North India.',
    coverImage: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e3?w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=Neemrana,Rajasthan',
    investmentPoints: ['Japanese Industrial Zone — 50+ Japanese companies', 'KMP Expressway connectivity', 'Rapid infrastructure development', 'High rental yield potential'],
    connectivity: ['75 minutes from Delhi', '30 minutes from Gurugram', 'Near proposed Neemrana Airport', 'KMP Expressway access'],
    infrastructure: ['RIICO Industrial Area Phase IV', 'Dedicated Freight Corridor', 'Neemrana Fort tourism circuit', 'Proposed greenfield airport'],
    seoKeywords: ['plots in neemrana', 'industrial plots neemrana', 'neemrana investment', 'neemrana real estate'],
  },
  {
    slug: 'kotputli', name: 'Kotputli', state: 'Rajasthan',
    tagline: 'Emerging residential destination on Delhi–Jaipur axis',
    description: 'Kotputli offers affordable residential and commercial plots with excellent highway connectivity, making it ideal for end-users and investors.',
    coverImage: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=Kotputli,Rajasthan',
    investmentPoints: ['Affordable land prices', 'Excellent NH-48 connectivity', 'Growing residential demand', 'Upcoming industrial clusters'],
    connectivity: ['60 minutes from Jaipur', '2 hours from Delhi', 'On NH-48 highway', 'Near Shahpura junction'],
    infrastructure: ['Municipal limits expansion', 'New water & power infrastructure', 'Proposed bypass road'],
    seoKeywords: ['plots in kotputli', 'kotputli residential plots', 'kotputli investment'],
  },
];

// ── 2. PROJECTS (6 total, 2 per location) ────────────────────────────────────
const makeProjects = (locationId, locationName, locationSlug) => [
  locationSlug === 'behror' ? {
    name: 'Somnath City', slug: 'somnath-city',
    locationId, locationName, locationSlug,
    description: 'A premium plotted development in the heart of Behror with world-class amenities and RERA approval.',
    coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    status: 'active', amenities: ['Park', 'Club House', 'Security', 'Wide Roads', 'Street Lights'],
    highlights: ['RERA Approved', 'Gated Community', 'Clear Title', 'Ready for Construction'],
    reraNumber: 'RAJ/A/2023/001234', totalUnits: 200,
  } : null,
  locationSlug === 'behror' ? {
    name: 'Behror Heights', slug: 'behror-heights',
    locationId, locationName, locationSlug,
    description: 'Affordable plots and villas with modern infrastructure in a prime Behror location.',
    coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
    status: 'active', amenities: ['Entrance Gate', 'Internal Roads', 'Boundary Wall', 'Water Connection'],
    highlights: ['Bank Loan Available', 'Low EMI Options', 'Clear Title'],
    reraNumber: 'RAJ/A/2023/005678', totalUnits: 120,
  } : null,
  locationSlug === 'neemrana' ? {
    name: 'Neemrana Green Valley', slug: 'neemrana-green-valley',
    locationId, locationName, locationSlug,
    description: 'Eco-friendly plotted development near the Japanese Industrial Zone with excellent ROI potential.',
    coverImage: 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800&q=80',
    status: 'active', amenities: ['Green Landscaping', 'Club House', 'Swimming Pool', 'Sports Court'],
    highlights: ['RERA Approved', 'Near Japanese Zone', 'High Appreciation', 'Gated Community'],
    reraNumber: 'RAJ/A/2022/009876', totalUnits: 180,
  } : null,
  locationSlug === 'neemrana' ? {
    name: 'Neemrana Industrial Hub', slug: 'neemrana-industrial-hub',
    locationId, locationName, locationSlug,
    description: 'Commercial and industrial plots for businesses looking to establish operations near the Japanese Industrial Zone.',
    coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    status: 'upcoming', amenities: ['Power Backup', 'Wide Roads', 'Loading Bays', 'Security'],
    highlights: ['Industrial License Ready', 'RIICO Approved', 'Highway Frontage'],
    reraNumber: '', totalUnits: 80,
  } : null,
  locationSlug === 'kotputli' ? {
    name: 'Kotputli Residency', slug: 'kotputli-residency',
    locationId, locationName, locationSlug,
    description: 'Affordable residential plots for families looking for a peaceful home near the highway.',
    coverImage: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800&q=80',
    status: 'active', amenities: ['Park', 'Children Play Area', 'Security', 'Internal Roads'],
    highlights: ['Affordable Pricing', 'Bank Loan Available', 'Clear Title', 'Near School & Hospital'],
    reraNumber: 'RAJ/A/2024/003456', totalUnits: 150,
  } : null,
  locationSlug === 'kotputli' ? {
    name: 'Kotputli Smart Township', slug: 'kotputli-smart-township',
    locationId, locationName, locationSlug,
    description: 'A fully planned township with 2BHK & 3BHK villas and premium plots at competitive prices.',
    coverImage: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80',
    status: 'upcoming', amenities: ['Club House', 'Gym', 'Swimming Pool', 'Garden', 'Security'],
    highlights: ['Township Project', 'Smart Infrastructure', 'RERA Registered'],
    reraNumber: 'RAJ/A/2024/007890', totalUnits: 300,
  } : null,
].filter(Boolean);

// ── 3. PROPERTIES (12 total, 2 per project) ───────────────────────────────────
const makeProperties = (projectId, projectName, projectSlug, locationId, locationName, locationSlug) => {
  const now = new Date().toISOString();

  const baseByProject = {
    'somnath-city': [
      {
        slug: 'somnath-city-200sqyd-corner-plot',
        title: '200 Sq.Yd Corner Plot — Somnath City, Behror',
        type: 'plot', status: 'available',
        address: 'Plot C-14, Somnath City, Sector 3, Behror, Alwar, Rajasthan',
        price: 2800000, priceLabel: '₹28 Lakh', pricePerUnit: '₹1,400/sq.yd',
        area: 200, areaUnit: 'sq.yd', facing: 'East',
        amenities: ['Park Facing', 'Corner Plot', 'Wide Road'], highlights: ['RERA Approved', 'Corner Premium', 'Ready Possession'],
        images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
        tour360Url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=2000&q=80',
        description: 'Premium east-facing corner plot in Somnath City with park view and wide road access.',
        nearbyLandmarks: ['NH-48', 'Behror Market', 'Schools'], postedAt: now, isFeatured: true, reraNumber: 'RAJ/A/2023/001234',
      },
      {
        slug: 'somnath-city-300sqyd-villa-plot',
        title: '300 Sq.Yd Villa Plot — Somnath City, Behror',
        type: 'plot', status: 'available',
        address: 'Plot V-8, Somnath City, Sector 5, Behror, Alwar, Rajasthan',
        price: 4200000, priceLabel: '₹42 Lakh', pricePerUnit: '₹1,400/sq.yd',
        area: 300, areaUnit: 'sq.yd', facing: 'North',
        amenities: ['Main Road', 'Corner', 'Security'], highlights: ['Big Plot', 'Villa Development Ready', 'RERA Approved'],
        images: ['https://images.unsplash.com/photo-1504671957578-11bdd62e4d53?w=800&q=80', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80'],
        tour360Url: 'https://images.unsplash.com/photo-1504671957578-11bdd62e4d53?w=2000&q=80',
        description: 'Spacious 300 sq.yd plot ideal for building your dream villa.',
        nearbyLandmarks: ['Club House', 'Park', 'NH-48'], postedAt: now, isFeatured: true, reraNumber: 'RAJ/A/2023/001234',
      },
    ],
    'behror-heights': [
      {
        slug: 'behror-heights-100sqyd-plot',
        title: '100 Sq.Yd Residential Plot — Behror Heights',
        type: 'plot', status: 'available',
        address: 'Plot 45, Behror Heights, Behror, Alwar, Rajasthan',
        price: 850000, priceLabel: '₹8.5 Lakh', pricePerUnit: '₹850/sq.yd',
        area: 100, areaUnit: 'sq.yd', facing: 'North',
        amenities: ['Security', 'Internal Roads'], highlights: ['Affordable', 'Bank Loan Available'],
        images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'],
        tour360Url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=2000&q=80',
        description: 'Compact 100 sq.yd plot perfect for first-time home buyers.',
        nearbyLandmarks: ['Behror Town', 'NH-48'], postedAt: now, isFeatured: false, reraNumber: 'RAJ/A/2023/005678',
      },
      {
        slug: 'behror-heights-2bhk-villa',
        title: '2BHK Villa — Behror Heights (1200 Sq.Ft)',
        type: 'villa', status: 'available',
        address: 'Villa 12, Behror Heights, Behror, Alwar, Rajasthan',
        price: 3500000, priceLabel: '₹35 Lakh', pricePerUnit: '₹2,916/sq.ft',
        area: 1200, areaUnit: 'sq.ft', bedrooms: 2, bathrooms: 2, facing: 'East',
        amenities: ['Parking', 'Garden', 'Security'], highlights: ['Ready to Move', 'Vastu Compliant'],
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80'],
        tour360Url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2000&q=80',
        description: 'Beautiful 2BHK ready-to-move villa with garden and parking.',
        nearbyLandmarks: ['Market', 'School', 'Hospital'], postedAt: now, isFeatured: true, reraNumber: 'RAJ/A/2023/005678',
      },
    ],
    'neemrana-green-valley': [
      {
        slug: 'neemrana-green-valley-250sqyd-plot',
        title: '250 Sq.Yd Residential Plot — Neemrana Green Valley',
        type: 'plot', status: 'available',
        address: 'Plot G-23, Green Valley, Neemrana, Alwar, Rajasthan',
        price: 3750000, priceLabel: '₹37.5 Lakh', pricePerUnit: '₹1,500/sq.yd',
        area: 250, areaUnit: 'sq.yd', facing: 'South',
        amenities: ['Green View', 'Club House', 'Security'], highlights: ['RERA Approved', 'High Appreciation'],
        images: ['https://images.unsplash.com/photo-1560185893-a55cbc8c57e3?w=800&q=80', 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800&q=80'],
        tour360Url: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e3?w=2000&q=80',
        description: 'Serene green-facing plot in the heart of Neemrana near the Japanese Zone.',
        nearbyLandmarks: ['Japanese Industrial Zone', 'NH-48', 'Neemrana Fort'], postedAt: now, isFeatured: true, reraNumber: 'RAJ/A/2022/009876',
      },
      {
        slug: 'neemrana-green-valley-3bhk-villa',
        title: '3BHK Villa — Neemrana Green Valley (1800 Sq.Ft)',
        type: 'villa', status: 'under-negotiation',
        address: 'Villa B-5, Green Valley, Neemrana, Alwar, Rajasthan',
        price: 6800000, priceLabel: '₹68 Lakh', pricePerUnit: '₹3,777/sq.ft',
        area: 1800, areaUnit: 'sq.ft', bedrooms: 3, bathrooms: 3, facing: 'East',
        amenities: ['Pool Access', 'Gym', 'Club House', 'Parking'], highlights: ['Premium Finish', 'Gated Society', 'RERA Approved'],
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'],
        tour360Url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&q=80',
        description: 'Luxurious 3BHK villa with club access and premium interiors.',
        nearbyLandmarks: ['Japanese Zone', 'Club House'], postedAt: now, isFeatured: false, reraNumber: 'RAJ/A/2022/009876',
      },
    ],
    'neemrana-industrial-hub': [
      {
        slug: 'neemrana-industrial-500sqyd-commercial',
        title: '500 Sq.Yd Commercial/Industrial Plot — Neemrana Hub',
        type: 'plot', status: 'available',
        address: 'Plot I-7, Industrial Hub, Neemrana RIICO, Alwar, Rajasthan',
        price: 9500000, priceLabel: '₹95 Lakh', pricePerUnit: '₹1,900/sq.yd',
        area: 500, areaUnit: 'sq.yd', facing: 'East',
        amenities: ['Highway Frontage', 'Power Backup', 'Loading Access'], highlights: ['RIICO Approved', 'Industrial Licence', 'Highway Facing'],
        images: ['https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80'],
        tour360Url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=2000&q=80',
        description: 'Prime industrial plot with direct highway frontage in RIICO area.',
        nearbyLandmarks: ['Japanese Zone', 'KMP Expressway'], postedAt: now, isFeatured: false, reraNumber: '',
      },
      {
        slug: 'neemrana-industrial-1000sqyd-warehouse',
        title: '1000 Sq.Yd Warehouse Plot — Neemrana Industrial Hub',
        type: 'plot', status: 'available',
        address: 'Plot W-3, Industrial Hub, Neemrana RIICO, Alwar, Rajasthan',
        price: 18000000, priceLabel: '₹1.8 Cr', pricePerUnit: '₹1,800/sq.yd',
        area: 1000, areaUnit: 'sq.yd', facing: 'West',
        amenities: ['24x7 Power', 'Water Connection', 'Security'], highlights: ['Large Format', 'Warehouse Ready', 'Clear Title'],
        images: ['https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80'],
        tour360Url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=2000&q=80',
        description: 'Large warehouse plot ideal for manufacturing or logistics hub.',
        nearbyLandmarks: ['Freight Corridor', 'NH-48'], postedAt: now, isFeatured: false, reraNumber: '',
      },
    ],
    'kotputli-residency': [
      {
        slug: 'kotputli-residency-150sqyd-plot',
        title: '150 Sq.Yd Residential Plot — Kotputli Residency',
        type: 'plot', status: 'available',
        address: 'Plot R-32, Kotputli Residency, Kotputli, Jaipur, Rajasthan',
        price: 900000, priceLabel: '₹9 Lakh', pricePerUnit: '₹600/sq.yd',
        area: 150, areaUnit: 'sq.yd', facing: 'East',
        amenities: ['Park', 'Children Play Area', 'Security'], highlights: ['Affordable', 'RERA Approved', 'Bank Loan'],
        images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80'],
        tour360Url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=2000&q=80',
        description: 'Great value 150 sq.yd plot in a well-planned residential society near Kotputli.',
        nearbyLandmarks: ['NH-48', 'Kotputli Town', 'School'], postedAt: now, isFeatured: false, reraNumber: 'RAJ/A/2024/003456',
      },
      {
        slug: 'kotputli-residency-200sqyd-corner',
        title: '200 Sq.Yd Corner Plot — Kotputli Residency',
        type: 'plot', status: 'available',
        address: 'Plot C-5, Kotputli Residency, Kotputli, Jaipur, Rajasthan',
        price: 1400000, priceLabel: '₹14 Lakh', pricePerUnit: '₹700/sq.yd',
        area: 200, areaUnit: 'sq.yd', facing: 'North',
        amenities: ['Corner Plot', 'Park Facing', 'Wide Road'], highlights: ['Corner Premium', 'Best Value', 'Clear Title'],
        images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80'],
        tour360Url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=2000&q=80',
        description: 'Corner plot with park view — excellent value in Kotputli\'s fastest-growing society.',
        nearbyLandmarks: ['Market', 'Hospital', 'Railway Station'], postedAt: now, isFeatured: true, reraNumber: 'RAJ/A/2024/003456',
      },
    ],
    'kotputli-smart-township': [
      {
        slug: 'kotputli-smart-township-3bhk-villa',
        title: '3BHK Smart Villa — Kotputli Smart Township (2000 Sq.Ft)',
        type: 'villa', status: 'available',
        address: 'Villa S-10, Smart Township, Kotputli, Jaipur, Rajasthan',
        price: 5500000, priceLabel: '₹55 Lakh', pricePerUnit: '₹2,750/sq.ft',
        area: 2000, areaUnit: 'sq.ft', bedrooms: 3, bathrooms: 3, facing: 'North',
        amenities: ['Club House', 'Gym', 'Pool', 'Garden', 'Security'], highlights: ['Smart Home Features', 'Premium Finish', 'Township Project'],
        images: ['https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80'],
        tour360Url: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=2000&q=80',
        description: 'Premium 3BHK villa in Kotputli\'s first smart township project with all modern amenities.',
        nearbyLandmarks: ['Club House', 'School', 'NH-48'], postedAt: now, isFeatured: true, reraNumber: 'RAJ/A/2024/007890',
      },
      {
        slug: 'kotputli-smart-township-2bhk-flat',
        title: '2BHK Apartment — Kotputli Smart Township (950 Sq.Ft)',
        type: 'flat', status: 'available',
        address: 'Apt 3B-201, Smart Township, Kotputli, Jaipur, Rajasthan',
        price: 2600000, priceLabel: '₹26 Lakh', pricePerUnit: '₹2,736/sq.ft',
        area: 950, areaUnit: 'sq.ft', bedrooms: 2, bathrooms: 2, floor: '2nd Floor', facing: 'East',
        amenities: ['Lift', 'Parking', 'Security', 'Club Access'], highlights: ['Ready in 2025', 'Affordable EMI', 'RERA Approved'],
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
        tour360Url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&q=80',
        description: 'Modern 2BHK apartment with club house access in Kotputli\'s new smart township.',
        nearbyLandmarks: ['Town Centre', 'Highway', 'School'], postedAt: now, isFeatured: false, reraNumber: 'RAJ/A/2024/007890',
      },
    ],
  };
  return (baseByProject[projectSlug] || []).map((p) => ({
    ...p,
    projectId, projectName, projectSlug,
    locationId, locationName, locationSlug,
  }));
};

async function deleteCollection(colName) {
  const snap = await db.collection(colName).get();
  const batch = db.batch();
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  console.log(`  🗑️  Deleted ${snap.size} docs from ${colName}`);
}

async function main() {
  console.log('\n🚀 Starting hierarchy migration...\n');

  // Clear old data
  console.log('Clearing old collections...');
  await deleteCollection('properties');
  await deleteCollection('locations');
  await deleteCollection('projects');

  // Create locations
  console.log('\n📍 Creating locations...');
  const locationIds = {};
  for (const loc of LOCATIONS) {
    const ref = await db.collection('locations').add({ ...loc, createdAt: Timestamp.now() });
    locationIds[loc.slug] = ref.id;
    console.log(`  ✅ ${loc.name} → ${ref.id}`);
  }

  // Create projects
  console.log('\n🏗️  Creating projects...');
  const projectMap = {};
  for (const [locSlug, locId] of Object.entries(locationIds)) {
    const loc = LOCATIONS.find((l) => l.slug === locSlug);
    const projects = makeProjects(locId, loc.name, locSlug);
    for (const proj of projects) {
      const ref = await db.collection('projects').add({ ...proj, createdAt: Timestamp.now() });
      projectMap[proj.slug] = { id: ref.id, ...proj };
      console.log(`  ✅ ${proj.name} (${locSlug}) → ${ref.id}`);
    }
  }

  // Create properties
  console.log('\n🏠 Creating properties...');
  let propCount = 0;
  for (const [projSlug, proj] of Object.entries(projectMap)) {
    const props = makeProperties(proj.id, proj.name, projSlug, proj.locationId, proj.locationName, proj.locationSlug);
    for (const prop of props) {
      await db.collection('properties').add({ ...prop, postedAt: Timestamp.now() });
      propCount++;
      console.log(`  ✅ ${prop.title.slice(0, 50)}…`);
    }
  }

  console.log(`\n✅ Done! Created ${LOCATIONS.length} locations, ${Object.keys(projectMap).length} projects, ${propCount} properties.\n`);
}

main().catch((err) => { console.error('❌ Error:', err); process.exit(1); });
