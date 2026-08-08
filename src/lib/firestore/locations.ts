// Firestore operations for Locations collection
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, limit, DocumentData, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Location } from '@/types';

const COLLECTION = 'locations';
const col = () => collection(db, COLLECTION);

function fromDoc(id: string, data: DocumentData): Location {
  return {
    ...data,
    id,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : data.createdAt ?? new Date().toISOString(),
  } as Location;
}

export async function getAllLocations(): Promise<Location[]> {
  const q = query(col(), orderBy('name', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc(d.id, d.data()));
}

export async function getLocationBySlug(slug: string): Promise<Location | null> {
  const q = query(col(), where('slug', '==', slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return fromDoc(snap.docs[0].id, snap.docs[0].data());
}

export async function getLocationById(id: string): Promise<Location | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return fromDoc(snap.id, snap.data());
}

export async function addLocation(data: Omit<Location, 'id'>): Promise<string> {
  const ref = await addDoc(col(), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateLocation(id: string, data: Partial<Location>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), data);
}

export async function deleteLocation(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
