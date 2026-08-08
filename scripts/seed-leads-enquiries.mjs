// Seed leads and enquiries for admin dashboard UI testing
import { Timestamp } from 'firebase-admin/firestore';
import { db } from './_admin-init.mjs';

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return Timestamp.fromDate(d);
}

const LEADS = [
  { name: 'Rajesh Kumar Sharma', phone: '9876543210', message: 'Interested in corner plot. Please share layout map.', propertyTitle: '200 Sq.Yd Corner Plot — Somnath City, Behror', propertySlug: 'somnath-city-200sqyd-corner-plot', status: 'new', source: 'property-detail', createdAt: daysAgo(0) },
  { name: 'Sunita Devi', phone: '9871234567', message: 'What is the EMI option available?', propertyTitle: '2BHK Villa — Behror Heights (1200 Sq.Ft)', propertySlug: 'behror-heights-2bhk-villa', status: 'contacted', source: 'property-detail', createdAt: daysAgo(1) },
  { name: 'Amit Agarwal', phone: '9999887766', message: 'Site visit on Saturday?', propertyTitle: '250 Sq.Yd Residential Plot — Neemrana Green Valley', propertySlug: 'neemrana-green-valley-250sqyd-plot', status: 'new', source: 'property-detail', createdAt: daysAgo(1) },
  { name: 'Priya Singh', phone: '9812345678', message: 'Is the price negotiable for bulk purchase?', propertyTitle: '300 Sq.Yd Villa Plot — Somnath City, Behror', propertySlug: 'somnath-city-300sqyd-villa-plot', status: 'new', source: 'property-detail', createdAt: daysAgo(2) },
  { name: 'Mohammad Arif', phone: '9988776655', message: 'Looking for investment. 5+ plots available?', propertyTitle: '150 Sq.Yd Residential Plot — Kotputli Residency', propertySlug: 'kotputli-residency-150sqyd-plot', status: 'contacted', source: 'property-detail', createdAt: daysAgo(3) },
  { name: 'Deepak Verma', phone: '9765432100', message: 'Please call after 6 PM.', propertyTitle: '500 Sq.Yd Commercial/Industrial Plot — Neemrana Hub', propertySlug: 'neemrana-industrial-500sqyd-commercial', status: 'new', source: 'property-detail', createdAt: daysAgo(4) },
  { name: 'Kavita Gupta', phone: '9654321098', message: 'RERA certificate copy needed.', propertyTitle: '200 Sq.Yd Corner Plot — Kotputli Residency', propertySlug: 'kotputli-residency-200sqyd-corner', status: 'closed', source: 'property-detail', createdAt: daysAgo(5) },
  { name: 'Sanjay Mehta', phone: '9543210987', message: '', propertyTitle: '3BHK Smart Villa — Kotputli Smart Township', propertySlug: 'kotputli-smart-township-3bhk-villa', status: 'contacted', source: 'property-detail', createdAt: daysAgo(6) },
  { name: 'Rekha Yadav', phone: '9432109876', message: 'What is the distance from highway?', propertyTitle: '100 Sq.Yd Residential Plot — Behror Heights', propertySlug: 'behror-heights-100sqyd-plot', status: 'new', source: 'property-detail', createdAt: daysAgo(7) },
  { name: 'Vikas Jain', phone: '9321098765', message: 'Interested in buying 2 plots together.', propertyTitle: '3BHK Villa — Neemrana Green Valley (1800 Sq.Ft)', propertySlug: 'neemrana-green-valley-3bhk-villa', status: 'closed', source: 'property-detail', createdAt: daysAgo(10) },
];

const ENQUIRIES = [
  { name: 'Harish Bansal', phone: '9876001122', email: 'harish@gmail.com', location: 'Behror', propertyType: 'plot', message: 'Looking for 200-300 sq.yd plots in Behror for investment. Budget around 25-35 lakhs.', status: 'new', source: 'contact-page', createdAt: daysAgo(0) },
  { name: 'Sneha Agarwal', phone: '9812334455', email: 'sneha.agarwal@yahoo.com', location: 'Neemrana', propertyType: 'villa', message: 'Want a 3BHK villa near Japanese zone. Ready to move or under construction both ok.', status: 'new', source: 'contact-page', createdAt: daysAgo(0) },
  { name: 'Ramesh Chandra', phone: '9988001133', email: '', location: 'Kotputli', propertyType: 'plot', message: 'We are a family of 4 looking for a plot to build our home. Budget 10-15 lakhs.', status: 'contacted', source: 'contact-page', createdAt: daysAgo(2) },
  { name: 'Anita Sharma', phone: '9977665544', email: 'anita.sharma@gmail.com', location: 'Behror', propertyType: 'flat', message: 'Interested in 2BHK flat. Looking for home loan assistance.', status: 'new', source: 'contact-page', createdAt: daysAgo(3) },
  { name: 'Suresh Pal', phone: '9865432100', email: 'suresh.pal@outlook.com', location: 'Neemrana', propertyType: 'plot', message: 'Industrial plot enquiry for setting up manufacturing unit near RIICO area.', status: 'contacted', source: 'contact-page', createdAt: daysAgo(4) },
  { name: 'Meena Devi', phone: '9754321099', email: '', location: 'Kotputli', propertyType: 'villa', message: 'Looking for a villa for joint family. 3BHK minimum with garden space.', status: 'closed', source: 'contact-page', createdAt: daysAgo(7) },
  { name: 'Ajay Khanna', phone: '9643210988', email: 'ajay.khanna@gmail.com', location: 'Behror', propertyType: 'plot', message: 'NRI investor. Looking for 5-10 plots for portfolio investment. Please send brochure.', status: 'new', source: 'contact-page', createdAt: daysAgo(8) },
  { name: 'Pooja Rani', phone: '9532109877', email: 'pooja.rani@rediffmail.com', location: 'Neemrana', propertyType: 'plot', message: 'Corner plot required in Neemrana. Ready for immediate registration.', status: 'contacted', source: 'contact-page', createdAt: daysAgo(12) },
];

async function seedCollection(colName, docs) {
  // Clear existing
  const snap = await db.collection(colName).get();
  const batch = db.batch();
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  console.log(`  🗑️  Cleared ${snap.size} old ${colName}`);

  // Insert new
  for (const doc of docs) {
    await db.collection(colName).add(doc);
  }
  console.log(`  ✅ Inserted ${docs.length} ${colName}`);
}

async function main() {
  console.log('\n🚀 Seeding leads & enquiries...\n');
  await seedCollection('leads', LEADS);
  await seedCollection('enquiries', ENQUIRIES);
  console.log('\n✅ Done! Admin dashboard should now show full data.\n');
}

main().catch((err) => { console.error('❌', err); process.exit(1); });
