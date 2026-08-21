// Firestore operations for Testimonials collection
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  DocumentData,
  serverTimestamp,
  Timestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Testimonial } from '@/types';

const COLLECTION = 'testimonials';
const col = () => collection(db, COLLECTION);

function fromDoc(id: string, data: DocumentData): Testimonial {
  return {
    id,
    name: (data.name as string) || '',
    location: (data.location as string) || '',
    propertyType: data.propertyType || 'plot',
    rating: (data.rating as number) ?? 5,
    review: (data.review as string) || '',
    avatar: (data.avatar as string) || undefined,
    order: (data.order as number) ?? 99,
    isVisible: (data.isVisible as boolean) ?? true,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : data.createdAt ?? new Date().toISOString(),
  };
}

/** Public read: only visible testimonials, ordered by `order` field */
export async function getVisibleTestimonials(): Promise<Testimonial[]> {
  const q = query(
    col(),
    where('isVisible', '==', true),
    orderBy('order', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc(d.id, d.data()));
}

/** Admin read: all testimonials */
export async function getAllTestimonials(): Promise<Testimonial[]> {
  const q = query(col(), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc(d.id, d.data()));
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return fromDoc(snap.id, snap.data());
}

/** Admin write: add testimonial */
export async function addTestimonial(
  data: Omit<Testimonial, 'id' | 'createdAt'>
): Promise<string> {
  const ref = await addDoc(col(), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/** Admin write: upsert testimonial by known ID (used for seeding) */
export async function upsertTestimonial(
  id: string,
  data: Omit<Testimonial, 'id'>
): Promise<void> {
  await setDoc(doc(db, COLLECTION, id), {
    ...data,
    createdAt: serverTimestamp(),
  }, { merge: true });
}

/** Admin write: update testimonial */
export async function updateTestimonial(
  id: string,
  data: Partial<Testimonial>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), data);
}

/** Admin write: delete testimonial */
export async function deleteTestimonial(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
