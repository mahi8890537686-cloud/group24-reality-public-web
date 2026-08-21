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
  Timestamp,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BlogPost, BlogCategory } from '@/types';

const COLLECTION = 'blogs';
const col = () => collection(db, COLLECTION);

function fromDoc(id: string, data: Record<string, unknown>): BlogPost {
  return {
    id,
    title: (data.title as string) || '',
    slug: (data.slug as string) || '',
    excerpt: (data.excerpt as string) || '',
    content: (data.content as string) || '',
    coverImage: (data.coverImage as string) || '',
    category: (data.category as BlogCategory) || 'Investment Guide',
    tags: (data.tags as string[]) || [],
    author: (data.author as string) || 'Group 24 Reality Team',
    locationSlug: (data.locationSlug as string) || undefined,
    projectId: (data.projectId as string) || undefined,
    propertyId: (data.propertyId as string) || undefined,
    status: (data.status as 'published' | 'draft') || 'draft',
    readTimeMinutes: (data.readTimeMinutes as number) || 5,
    views: (data.views as number) || 0,
    createdAt: data.createdAt
      ? (data.createdAt as Timestamp).toDate().toISOString()
      : new Date().toISOString(),
    updatedAt: data.updatedAt
      ? (data.updatedAt as Timestamp).toDate().toISOString()
      : undefined,
  };
}

// Fetch all blogs (for admin view)
export async function getAllBlogs(): Promise<BlogPost[]> {
  const snap = await getDocs(query(col(), orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => fromDoc(d.id, d.data()));
}

// Fetch only published blogs (for public website)
export async function getPublishedBlogs(): Promise<BlogPost[]> {
  const snap = await getDocs(
    query(col(), where('status', '==', 'published'), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map((d) => fromDoc(d.id, d.data()));
}

// Fetch single blog by slug
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const snap = await getDocs(query(col(), where('slug', '==', slug)));
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return fromDoc(docSnap.id, docSnap.data());
}

// Fetch single blog by document ID
export async function getBlogById(id: string): Promise<BlogPost | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return fromDoc(snap.id, snap.data());
}

// Fetch just the slugs of published blogs — for sitemap.ts / generateStaticParams
export async function getAllBlogSlugs(): Promise<string[]> {
  const snap = await getDocs(
    query(col(), where('status', '==', 'published'), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map((d) => d.data().slug as string).filter(Boolean);
}

// Fetch published blogs by location
export async function getBlogsByLocation(locationSlug: string): Promise<BlogPost[]> {
  const snap = await getDocs(
    query(
      col(),
      where('status', '==', 'published'),
      where('locationSlug', '==', locationSlug),
      orderBy('createdAt', 'desc')
    )
  );
  return snap.docs.map((d) => fromDoc(d.id, d.data()));
}

// Add new blog post
export async function addBlog(
  data: Omit<BlogPost, 'id' | 'createdAt' | 'views'>
): Promise<string> {
  const ref = await addDoc(col(), {
    ...data,
    views: 0,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// Update blog post
export async function updateBlog(id: string, data: Partial<BlogPost>): Promise<void> {
  const { createdAt: _c, id: _id, ...rest } = data;
  void _c; void _id;
  await updateDoc(doc(db, COLLECTION, id), {
    ...rest,
    updatedAt: serverTimestamp(),
  });
}

// Delete blog post
export async function deleteBlog(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

// Increment view count when user reads an article
export async function incrementBlogViews(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    views: increment(1),
  });
}

// Helper to generate URL slug from blog title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
