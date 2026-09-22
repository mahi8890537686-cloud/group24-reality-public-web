// Server-only intake pipeline for public RWA (Resident Welfare Association)
// registration submissions from /rwa-registration-form. Runs entirely via
// firebase-admin: uploads the four KYC documents to Storage (private —
// storage.rules restricts direct read/write to authenticated users, this
// path bypasses rules) then writes one Firestore doc under `rwa_registrations`.
// Must never be imported from a 'use client' component.
import { adminDb, adminStorage } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { normalizePhone } from '@/lib/phone';
import type { RwaDocType, KycDoc } from '@/types';

const DOC_LABELS: Record<RwaDocType, string> = {
  registry_copy: 'Registry Copy',
  pan_card: 'PAN Card',
  aadhaar: 'Aadhaar Card',
  photo: 'Passport Size Photo',
};

// Far-future expiry — the standard firebase-admin substitute for a client-SDK
// download token, used because these documents (PAN/Aadhaar/registry) must
// stay out of storage.rules' public-read reach.
const SIGNED_URL_EXPIRY = '01-01-2500';

export interface RwaRegistrationFile {
  type: RwaDocType;
  buffer: Buffer;
  contentType: string;
  extension: string;
}

export interface RwaRegistrationInput {
  willingToRegister: boolean;
  fullName: string;
  relationName: string;
  blockName: string;
  plotNo: string;
  plotSizeSqYd: number;
  phone: string;
  files: RwaRegistrationFile[];
}

export interface RwaRegistrationResult {
  id: string;
}

export async function intakeRwaRegistration(
  input: RwaRegistrationInput
): Promise<RwaRegistrationResult> {
  const phoneNormalized = normalizePhone(input.phone);
  if (!phoneNormalized) {
    throw new Error('Invalid phone number');
  }

  const docRef = adminDb.collection('rwa_registrations').doc();
  const bucket = adminStorage.bucket();

  const kycDocs: KycDoc[] = await Promise.all(
    input.files.map(async (file) => {
      const path = `rwa-registrations/${docRef.id}/${file.type}.${file.extension}`;
      const storageFile = bucket.file(path);
      await storageFile.save(file.buffer, {
        contentType: file.contentType,
        metadata: { cacheControl: 'private, max-age=0' },
      });
      const [url] = await storageFile.getSignedUrl({
        action: 'read',
        expires: SIGNED_URL_EXPIRY,
      });
      return { type: DOC_LABELS[file.type], url };
    })
  );

  await docRef.set({
    willingToRegister: input.willingToRegister,
    fullName: input.fullName,
    relationName: input.relationName,
    blockName: input.blockName,
    plotNo: input.plotNo,
    plotSizeSqYd: input.plotSizeSqYd,
    phone: input.phone,
    phoneNormalized,
    kycDocs,
    status: 'new',
    createdAt: Timestamp.now(),
  });

  return { id: docRef.id };
}
