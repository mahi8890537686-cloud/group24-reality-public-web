/**
 * deploy-indexes.mjs
 * Reads service account credentials from .env.local and deploys
 * Firestore indexes via the Firebase CLI using GOOGLE_APPLICATION_CREDENTIALS.
 *
 * Run: node scripts/deploy-indexes.mjs
 */

import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── 1. Parse .env.local ────────────────────────────────────────────────────────
const envPath = join(ROOT, '.env.local');
if (!existsSync(envPath)) throw new Error('.env.local not found');

const envContent = readFileSync(envPath, 'utf8');

function readEnv(key) {
  const match = envContent.match(new RegExp(`^${key}=(.+)$`, 'm'));
  if (!match) throw new Error(`${key} not found in .env.local`);
  // Strip surrounding quotes if present
  return match[1].replace(/^["']|["']$/g, '');
}

const projectId   = readEnv('FIREBASE_ADMIN_PROJECT_ID');
const clientEmail = readEnv('FIREBASE_ADMIN_CLIENT_EMAIL');
// Replace escaped newlines stored as \n literal in the env file
const privateKey  = readEnv('FIREBASE_ADMIN_PRIVATE_KEY').replace(/\\n/g, '\n');

// ── 2. Write a temporary service-account JSON key file ────────────────────────
const keyObj = {
  type: 'service_account',
  project_id: projectId,
  private_key_id: 'from-env-local',
  private_key: privateKey,
  client_email: clientEmail,
  client_id: '',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(clientEmail)}`,
};

const tmpKeyPath = join(tmpdir(), `g24-sa-key-${Date.now()}.json`);
writeFileSync(tmpKeyPath, JSON.stringify(keyObj, null, 2), 'utf8');
console.log(`\n🔑 Temporary service account key written to: ${tmpKeyPath}`);

// ── 3. Deploy Firestore indexes ────────────────────────────────────────────────
try {
  console.log(`\n🚀 Deploying Firestore indexes to project: ${projectId}\n`);
  execSync(
    `npx firebase-tools deploy --only firestore:indexes --project ${projectId} --non-interactive`,
    {
      cwd: ROOT,
      stdio: 'inherit',
      env: {
        ...process.env,
        GOOGLE_APPLICATION_CREDENTIALS: tmpKeyPath,
      },
    }
  );
  console.log('\n✅ Firestore indexes deployed successfully!\n');
} finally {
  // Always clean up the temp key file
  try { unlinkSync(tmpKeyPath); } catch { /* ignore */ }
  console.log('🧹 Temporary key file cleaned up.\n');
}
