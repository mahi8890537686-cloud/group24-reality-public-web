// Firebase Admin SDK — server-only. Never import this from a 'use client' component.
// Used by API routes / server actions that must bypass firestore.rules (e.g. creating
// team member accounts, writing financial ledger records in later phases).
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

function loadCredential() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase Admin credentials. Set FIREBASE_ADMIN_PROJECT_ID, ' +
        'FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY in .env.local.'
    );
  }

  return { projectId, clientEmail, privateKey };
}

let app: App;

if (getApps().length === 0) {
  app = initializeApp({ credential: cert(loadCredential()) });
} else {
  app = getApps()[0];
}

const adminDb: Firestore = getFirestore(app, 'group24reality');
const adminAuth: Auth = getAuth(app);

export { app as adminApp, adminDb, adminAuth };
