// One-time script: promotes the existing NEXT_PUBLIC_ADMIN_EMAIL Firebase Auth account
// to role: 'admin' by creating/updating its users/{uid} profile doc. Run once after
// deploying Phase 0, before anyone tries to use role-gated admin features.
//
// Reads credentials from .env.local (FIREBASE_ADMIN_PROJECT_ID / _CLIENT_EMAIL /
// _PRIVATE_KEY, NEXT_PUBLIC_ADMIN_EMAIL) — no secrets hardcoded in this file.
//
// Run with: node scripts/bootstrap-admin.mjs

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  const envPath = join(__dirname, '..', '.env.local');
  if (!existsSync(envPath)) {
    throw new Error('.env.local not found at project root.');
  }
  const lines = readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
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
const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

if (!projectId || !clientEmail || !privateKey) {
  throw new Error(
    'Missing FIREBASE_ADMIN_PROJECT_ID / FIREBASE_ADMIN_CLIENT_EMAIL / FIREBASE_ADMIN_PRIVATE_KEY in .env.local'
  );
}
if (!adminEmail) {
  throw new Error('Missing NEXT_PUBLIC_ADMIN_EMAIL in .env.local');
}

initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const db = getFirestore('group24reality');
const auth = getAuth();

async function main() {
  const authUser = await auth.getUserByEmail(adminEmail);
  const ref = db.collection('users').doc(authUser.uid);
  const existing = await ref.get();

  if (existing.exists) {
    await ref.update({ role: 'admin', active: true, updatedAt: Timestamp.now() });
    console.log(`Updated existing profile for ${adminEmail} (${authUser.uid}) to role: admin`);
  } else {
    await ref.set({
      role: 'admin',
      name: authUser.displayName || adminEmail.split('@')[0],
      email: adminEmail,
      active: true,
      createdAt: Timestamp.now(),
    });
    console.log(`Created admin profile for ${adminEmail} (${authUser.uid})`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Bootstrap failed:', err);
    process.exit(1);
  });
