// Firebase Storage helpers for property image upload
'use client';

import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

/**
 * Upload a property image file to Firebase Storage.
 * Returns the public download URL.
 * @param file - The File object to upload
 * @param propertySlug - Used as folder name for organisation
 * @param onProgress - optional callback with 0-100 progress
 */
export async function uploadPropertyImage(
  file: File,
  propertySlug: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const storageRef = ref(storage, `properties/${propertySlug}/${filename}`);

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    });

    task.on(
      'state_changed',
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(Math.round(pct));
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

/**
 * Delete an image from Firebase Storage by its full download URL.
 */
export async function deletePropertyImage(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // Silently ignore if file doesn't exist
  }
}

/**
 * Upload a booking document (KYC proof, allotment letter, agreement) to Storage.
 * Returns the public download URL.
 */
export async function uploadBookingDocument(
  file: File,
  bookingId: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const storageRef = ref(storage, `bookings/${bookingId}/${filename}`);

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file, { contentType: file.type });
    task.on(
      'state_changed',
      (snapshot) => onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
      (error) => reject(error),
      async () => resolve(await getDownloadURL(task.snapshot.ref))
    );
  });
}
