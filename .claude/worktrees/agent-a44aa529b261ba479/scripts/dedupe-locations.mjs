/**
 * dedupe-locations.mjs
 *
 * The `locations` collection may have old documents (auto-ID or previous seeds)
 * alongside the current slug-keyed documents. This script:
 *   1. Reads every doc in `locations`
 *   2. Groups by slug
 *   3. Keeps the doc whose ID === slug (the canonical one)
 *   4. Deletes all others
 *
 * Run: node scripts/dedupe-locations.mjs
 */

import { db } from './_admin-init.mjs';

async function main() {
  const snap = await db.collection('locations').get();
  const docs = snap.docs.map((d) => ({ id: d.id, slug: d.data().slug, ref: d.ref }));

  console.log(`\n🔍 Found ${docs.length} location docs\n`);

  // Group by slug value
  const bySlug = {};
  for (const doc of docs) {
    const slug = doc.slug || doc.id;
    if (!bySlug[slug]) bySlug[slug] = [];
    bySlug[slug].push(doc);
  }

  let deleted = 0;
  for (const [slug, group] of Object.entries(bySlug)) {
    if (group.length === 1) {
      console.log(`  ✓ ${slug} — no duplicates`);
      continue;
    }

    // Prefer the doc whose ID equals the slug; fall back to first
    const canonical = group.find((d) => d.id === slug) ?? group[0];
    const dupes = group.filter((d) => d.id !== canonical.id);

    console.log(`  ⚠️  ${slug} — ${group.length} docs, keeping "${canonical.id}", deleting ${dupes.map((d) => d.id).join(', ')}`);
    for (const dupe of dupes) {
      await dupe.ref.delete();
      deleted++;
    }
  }

  console.log(`\n✅ Done — deleted ${deleted} duplicate location doc(s)\n`);
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
