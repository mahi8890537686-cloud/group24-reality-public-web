// One-time migration: for each primary_sales Deal whose listingType is still
// 'property' (the Phase 3 interim reference), find or create a matching Unit and
// re-point the Deal at it. Run once after Inventory (Phase 4) is live and units
// have been entered for any in-flight deals. No-op if there are no such deals yet.
//
// Run with: node scripts/migrate-primary-deals-to-units.mjs

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  const envPath = join(__dirname, '..', '.env.local');
  if (!existsSync(envPath)) throw new Error('.env.local not found at project root.');
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
if (!projectId || !clientEmail || !privateKey) {
  throw new Error('Missing FIREBASE_ADMIN_* credentials in .env.local');
}

initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const db = getFirestore('group24reality');

async function main() {
  const dealsSnap = await db
    .collection('deals')
    .where('pipeline', '==', 'primary_sales')
    .where('listingType', '==', 'property')
    .get();

  if (dealsSnap.empty) {
    console.log('No interim property-referencing deals found. Nothing to migrate.');
    return;
  }

  // Property and Unit are different collections with no shared key, so there's no
  // safe automatic match — an admin must pick the correct Unit for each deal via
  // the Deal's Booking tab (Deal panel → Booking → pick unit). This script only
  // reports which deals still need that manual step; it does not write anything,
  // since a wrong auto-guess would be worse than a manual review queue.
  console.log('The following deals reference a Property (interim, Phase 3) and need a real Unit:');
  for (const dealDoc of dealsSnap.docs) {
    const deal = dealDoc.data();
    console.log(`  - ${dealDoc.id}: ${deal.contactName} — "${deal.listingLabel ?? '(no label)'}"`);
  }
  console.log('\nAssign each one a Unit via its Booking tab in /admin/crm/deals.');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
