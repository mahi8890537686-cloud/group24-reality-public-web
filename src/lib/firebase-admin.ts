// Firebase Admin SDK — server-only. Never import this from a 'use client' component.
// Used by API routes / server actions that must bypass firestore.rules.
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';

function loadCredential() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  let privateKey = rawKey?.trim();
  if (privateKey) {
    // Strip wrapping quotes if user pasted quotes into Vercel env var editor
    if (
      (privateKey.startsWith('"') && privateKey.endsWith('"')) ||
      (privateKey.startsWith("'") && privateKey.endsWith("'"))
    ) {
      privateKey = privateKey.slice(1, -1).trim();
    }
    // Convert escaped \n strings into real newline characters
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing or incomplete Firebase Admin credentials. Ensure FIREBASE_ADMIN_PROJECT_ID, ' +
        'FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY are set in Vercel Environment Variables.'
    );
  }

  return { projectId, clientEmail, privateKey };
}

let app: App;

if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(loadCredential()),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
} else {
  app = getApps()[0];
}

const adminDb: Firestore = getFirestore(app, 'group24reality');
const adminStorage: Storage = getStorage(app);

export { app as adminApp, adminDb, adminStorage };
