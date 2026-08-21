// Firestore operations for Projects collection
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, limit, DocumentData, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Project } from '@/types';

const COLLECTION = 'projects';
const col = () => collection(db, COLLECTION);

function fromDoc(id: string, data: DocumentData): Project {
  return {
    ...data,
    id,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : data.createdAt ?? new Date().toISOString(),
  } as Project;
}

export async function getAllProjects(): Promise<Project[]> {
  const q = query(col(), orderBy('name', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc(d.id, d.data()));
}

export async function getProjectsByLocation(locationId: string): Promise<Project[]> {
  const q = query(col(), where('locationId', '==', locationId), orderBy('name', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc(d.id, d.data()));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const q = query(col(), where('slug', '==', slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return fromDoc(snap.docs[0].id, snap.docs[0].data());
}

export async function getProjectById(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return fromDoc(snap.id, snap.data());
}

export async function addProject(data: Omit<Project, 'id'>): Promise<string> {
  const ref = await addDoc(col(), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), data);
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
