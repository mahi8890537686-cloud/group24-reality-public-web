// Firestore operations for Properties collection
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, DocumentData, QueryConstraint,
  serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Property, PropertyType, PropertyStatus, SortOption } from '@/types';

const COLLECTION = 'properties';
const col = () => collection(db, COLLECTION);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fromDoc(id: string, data: DocumentData): Property {
  return {
    ...data,
    id,
    postedAt:
      data.postedAt instanceof Timestamp
        ? data.postedAt.toDate().toISOString()
        : data.postedAt ?? new Date().toISOString(),
  } as Property;
}

// ─── Public reads ─────────────────────────────────────────────────────────────

export async function getAllProperties(params?: {
  locationSlug?: string;
  projectId?: string;
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  sort?: SortOption;
}): Promise<Property[]> {
  const constraints: QueryConstraint[] = [];

  // Server-side (Firestore) filtering is intentionally limited to the highest-value,
  // most-commonly-combined equality filters — locationSlug and status. The listing
  // page (PropertyFilters) exposes 5 independently-combinable filters; if every one
  // of them (type, price range, bedrooms too) were pushed into where() clauses, every
  // realistic 2-way/3-way combination would need its own Firestore composite index
  // (orderBy('postedAt') on top of any filter combo requires one), which scales badly
  // and is easy to leave gaps in. At this data volume (a few dozen documents — see
  // scripts/ seed data for a 3-town listings business, not an at-scale marketplace),
  // fetching the locationSlug/status-narrowed set and filtering the rest in JS is
  // simpler, can't drift out of sync with the index config, and sidesteps the
  // failed-precondition class of bug entirely.
  if (params?.locationSlug && params.locationSlug !== 'all') {
    constraints.push(where('locationSlug', '==', params.locationSlug));
  }
  if (params?.projectId && params.projectId !== 'all') {
    constraints.push(where('projectId', '==', params.projectId));
  }
  if (params?.status && params.status !== 'all') {
    constraints.push(where('status', '==', params.status));
  }

  // Default sort newest first
  constraints.push(orderBy('postedAt', 'desc'));

  const q = query(col(), ...constraints);
  const snap = await getDocs(q);
  let results = snap.docs.map((d) => fromDoc(d.id, d.data()));

  // In-memory filters for type / price range / bedrooms — deliberately not part of
  // the Firestore query (see comment above). Applied after the fetch so they can be
  // combined freely without needing dedicated composite indexes for each combination.
  if (params?.type && params.type !== 'all') {
    results = results.filter((p) => p.type === params.type);
  }
  if (params?.minPrice !== undefined) {
    results = results.filter((p) => p.price >= params.minPrice!);
  }
  if (params?.maxPrice !== undefined) {
    results = results.filter((p) => p.price <= params.maxPrice!);
  }
  if (params?.bedrooms) {
    results = results.filter((p) => p.bedrooms === params.bedrooms);
  }

  // Client-side secondary sorts that Firestore can't do with compound queries
  if (params?.sort === 'price-asc') results.sort((a, b) => a.price - b.price);
  if (params?.sort === 'price-desc') results.sort((a, b) => b.price - a.price);
  if (params?.sort === 'area-asc') results.sort((a, b) => a.area - b.area);
  if (params?.sort === 'area-desc') results.sort((a, b) => b.area - a.area);

  return results;
}


export async function getFeaturedProperties(count = 6): Promise<Property[]> {
  const q = query(col(), where('isFeatured', '==', true), orderBy('postedAt', 'desc'), limit(count));
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc(d.id, d.data()));
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const q = query(col(), where('slug', '==', slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return fromDoc(d.id, d.data());
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return fromDoc(snap.id, snap.data());
}

export async function getRelatedByLocation(
  locationSlug: string,
  excludeId: string,
  count = 3
): Promise<Property[]> {
  const q = query(
    col(),
    where('locationSlug', '==', locationSlug),
    where('status', '==', 'available'),
    orderBy('postedAt', 'desc'),
    limit(count + 1)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => fromDoc(d.id, d.data()))
    .filter((p) => p.id !== excludeId)
    .slice(0, count);
}

export async function getAllPropertySlugs(): Promise<string[]> {
  const q = query(col(), orderBy('postedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data().slug as string).filter(Boolean);
}

// ─── Admin writes ─────────────────────────────────────────────────────────────

export async function addProperty(data: Omit<Property, 'id'>): Promise<string> {
  const ref = await addDoc(col(), { ...data, postedAt: serverTimestamp() });
  return ref.id;
}

export async function updateProperty(id: string, data: Partial<Property>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), data);
}

export async function deleteProperty(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
