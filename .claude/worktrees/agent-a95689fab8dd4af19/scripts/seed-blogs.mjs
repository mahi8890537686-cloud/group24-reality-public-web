/**
 * Blog Seed Script
 * Seeds high-quality blog posts into Firestore ('group24reality' database)
 * Run: node scripts/seed-blogs.mjs
 */

import { Timestamp } from 'firebase-admin/firestore';
import { db } from './_admin-init.mjs';

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return Timestamp.fromDate(d);
}

const blogs = [
  {
    title: 'Why Behror is Emerging as the Top Real Estate Investment Corridor on NH-48',
    slug: 'why-behror-emerging-top-real-estate-investment-corridor-nh48',
    excerpt: 'Explore why strategic location, industrial proximity to Neemrana, and planned infrastructure make Behror the prime hub for residential and commercial land appreciation.',
    content: `
      <h2>The Rise of Behror on the Delhi-Jaipur Highway Corridor</h2>
      <p>Situated strategically along National Highway 48 (NH-48), Behror has transformed from a quiet highway township into one of Rajasthan's fastest-growing real estate corridors. Connecting Delhi NCR to Jaipur, this region is witnessing unprecedented demand for both residential plots and luxury villas.</p>

      <h3>Key Drivers of Growth in Behror</h3>
      <ul>
        <li><strong>Unmatched Highway Connectivity:</strong> Seamless 2-hour access to Gurgaon and 1.5 hours to Jaipur via the expanded NH-48.</li>
        <li><strong>RIICO & Industrial Synergy:</strong> Close proximity to the Neemrana Industrial Zone, Japanese Investment Zone, and upcoming freight corridors.</li>
        <li><strong>Affordable Capital Entry:</strong> Plot rates in Behror offer high appreciation potential compared to saturated NCR markets like Gurgaon or Manesar.</li>
        <li><strong>Planned Township Approvals:</strong> Approved by DTCP with complete road infrastructure, 24/7 water supply, and electrification.</li>
      </ul>

      <blockquote>"Behror offers the perfect sweet spot for investors looking for 15-20% annual land value appreciation without high capital risk." — Real Estate Market Insights 2026</blockquote>

      <h3>What Property Types Perform Best in Behror?</h3>
      <p>Residential plots ranging from 150 to 300 sq.yds in gated colonies like Sector 12 and Somnath City lead investor interest. Additionally, 3 BHK villas in gated townships offer high rental yields from professionals working in nearby industrial nodes.</p>

      <h3>Conclusion</h3>
      <p>Whether you are looking to build your family home or seeking a high-yielding long-term asset, Behror represents a prime opportunity in Northern Rajasthan. Explore Group 24 Reality's verified listings in Behror today.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    category: 'Investment Guide',
    tags: ['Behror', 'NH-48', 'Land Investment', 'Plots', 'Rajasthan Real Estate'],
    author: 'Sunil Sharma, Senior Analyst',
    locationSlug: 'behror',
    status: 'published',
    readTimeMinutes: 5,
    views: 342,
    createdAt: daysAgo(12),
  },
  {
    title: 'Neemrana Real Estate Boom: Industrial Expansion and Housing Demand in 2026',
    slug: 'neemrana-real-estate-boom-industrial-expansion-housing-demand',
    excerpt: 'With Japanese and Korean manufacturing giants setting up base, Neemrana is experiencing a severe housing shortage. Here is how investors can capitalize.',
    content: `
      <h2>Neemrana: From Historical Heritage to Industrial Powerhouse</h2>
      <p>Famous for its 15th-century Fort Palace, Neemrana has quietly evolved into a global manufacturing power hub. Home to over 50 major Japanese MNCs, the Japanese Zone in Neemrana has created thousands of executive jobs, driving exponential demand for rental flats and luxury villas.</p>

      <h3>Why Executives & Engineers Choose Neemrana</h3>
      <p>The influx of expatriates and senior managers working in automotive and electronic manufacturing hubs requires modern gated communities. Luxury villas with private amenities, clubhouse access, and smart home automation in developments like Heritage Heights are commanding premium rental rates.</p>

      <h3>Key Investment Indicators</h3>
      <ul>
        <li><strong>Rental Yields:</strong> Up to 6.5% annually for 1 & 2 BHK units.</li>
        <li><strong>Capital Growth:</strong> 12-18% YoY growth in land prices near Sector 5 and RIICO zones.</li>
        <li><strong>Future Infrastructure:</strong> Proposed Delhi-Alwar Regional Rapid Transit System (RRTS).</li>
      </ul>

      <h3>Should You Buy a Plot, Flat, or Villa in Neemrana?</h3>
      <p>Investors seeking steady monthly passive income should target 1 & 2 BHK flats near the industrial area. End-users seeking luxury living with historic fort views will find 4 BHK villas in Heritage Heights to be an unrivaled choice.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
    category: 'Area Highlights',
    tags: ['Neemrana', 'RIICO', 'Japanese Zone', 'Villas', 'Flats'],
    author: 'Anjali Verma',
    locationSlug: 'neemrana',
    status: 'published',
    readTimeMinutes: 6,
    views: 489,
    createdAt: daysAgo(8),
  },
  {
    title: 'Plots vs Villas vs Flats: Which Real Estate Asset Class Fits Your Goals?',
    slug: 'plots-vs-villas-vs-flats-which-real-estate-asset-class-fits-your-goals',
    excerpt: 'A comprehensive comparison of capital appreciation, maintenance costs, liquidity, and financing options for plots, villas, and apartments in Rajasthan.',
    content: `
      <h2>Choosing the Right Property Type for Your Financial Portfolio</h2>
      <p>One of the most frequent questions buyers ask Group 24 Reality advisors is: <em>"Should I buy a plot of land, a built villa, or a modern apartment?"</em> The answer depends on your timeline, budget, and desired involvement.</p>

      <h3>1. Residential & Commercial Plots</h3>
      <ul>
        <li><strong>Pros:</strong> Zero maintenance, highest land value appreciation, full control over architectural design.</li>
        <li><strong>Cons:</strong> No immediate rental income until constructed.</li>
        <li><strong>Best For:</strong> Long-term investors and buyers planning custom homes.</li>
      </ul>

      <h3>2. Independent & Gated Villas</h3>
      <ul>
        <li><strong>Pros:</strong> Exclusive lifestyle, private gardens, multi-generational family living, strong prestige factor.</li>
        <li><strong>Cons:</strong> Higher capital investment required upfront.</li>
        <li><strong>Best For:</strong> End-users and NRI buyers seeking premium living.</li>
      </ul>

      <h3>3. Apartments & Flats</h3>
      <ul>
        <li><strong>Pros:</strong> Immediate rental income, shared maintenance costs, lower ticket price for first-time buyers.</li>
        <li><strong>Cons:</strong> Land share is divided among unit owners.</li>
        <li><strong>Best For:</strong> First-time buyers and income-focused investors.</li>
      </ul>

      <h3>Summary Matrix</h3>
      <p>If capital growth is your primary objective, plots in Behror and Kotputli offer maximum upside. If rental returns are key, apartments in Neemrana offer consistent occupancy.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80',
    category: 'Buying Tips',
    tags: ['Property Guide', 'Plots', 'Villas', 'Flats', 'Investment Strategy'],
    author: 'Group 24 Advisory Team',
    locationSlug: 'behror',
    status: 'published',
    readTimeMinutes: 7,
    views: 615,
    createdAt: daysAgo(5),
  },
  {
    title: 'Kotputli Real Estate Spotlight: Commercial Frontage Along NH-48 Corridor',
    slug: 'kotputli-real-estate-spotlight-commercial-frontage-nh48-corridor',
    excerpt: 'Connecting Jaipur to Northern NCR, Kotputli offers unique highway frontage plots with massive commercial potential for showrooms, warehouses, and hospitality.',
    content: `
      <h2>Kotputli: The Commercial Gateway to Jaipur</h2>
      <p>Located just 55 km from Jaipur on NH-48, Kotputli is rapidly transforming into a major commercial and logistics node. Heavy transport traffic, industrial expansion, and rising local commerce make highway-facing land in Kotputli highly sought after.</p>

      <h3>Why Kotputli Commercial Land is in High Demand</h3>
      <ul>
        <li><strong>Direct Highway Frontage:</strong> Plots along NH-48 offer unmatched visibility for retail showrooms, logistics hubs, and restaurants.</li>
        <li><strong>Proximity to Jaipur Metro Region:</strong> Benefit from Jaipur's urban expansion without metropolitan price tags.</li>
        <li><strong>Industrial Infrastructure:</strong> Surrounding cement and manufacturing clusters guarantee continuous commercial activity.</li>
      </ul>

      <h3>Key Projects in Kotputli</h3>
      <p>Developments like Green Meadows Colony and Royal Enclave offer eco-friendly villas and premium land choices for discerning buyers.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    category: 'Market Trends',
    tags: ['Kotputli', 'NH-48', 'Commercial Plots', 'Jaipur Corridor'],
    author: 'Sunil Sharma, Senior Analyst',
    locationSlug: 'kotputli',
    status: 'published',
    readTimeMinutes: 4,
    views: 210,
    createdAt: daysAgo(2),
  },
];

async function main() {
  console.log('\n📰 Group 24 Reality — Blog Data Seeder');
  console.log('═══════════════════════════════════════\n');

  const colRef = db.collection('blogs');

  // Clear existing blogs
  const snap = await colRef.get();
  if (!snap.empty) {
    console.log(`  🗑️  Clearing ${snap.size} existing blog posts...`);
    for (const doc of snap.docs) {
      await doc.ref.delete();
    }
  }

  let count = 0;
  for (const blog of blogs) {
    const ref = await colRef.add(blog);
    count++;
    console.log(`  ✅ [${count}/${blogs.length}] Blog: "${blog.title.slice(0, 40)}..." → ${ref.id}`);
  }

  console.log('\n═══════════════════════════════════════');
  console.log(`🎉 Blog Seed Complete! ${count} articles published.`);
  console.log('📍 View in Firebase Console: https://console.firebase.google.com/project/group24reality-web-2f3fd/firestore\n');

  process.exit(0);
}

main().catch((err) => {
  console.error('\n❌ Seed failed:', err.message || err);
  process.exit(1);
});
