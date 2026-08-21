import { MetadataRoute } from 'next';
import { getAllPropertySlugs } from '@/lib/firestore/properties';
import { getAllBlogSlugs } from '@/lib/firestore/blogs';
import { getAllLocations } from '@/lib/firestore/locations';

const SITE_URL = 'https://www.group24reality.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch location slugs from Firestore so sitemap stays in sync with DB
  let locationSlugs: string[] = [];
  try {
    const locs = await getAllLocations();
    locationSlugs = locs.map((l) => l.slug);
  } catch {
    // Fall back to known slugs if Firestore is unreachable at build time
    locationSlugs = ['behror', 'neemrana', 'kotputli'];
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/locations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    ...locationSlugs.map((slug) => ({
      url: `${SITE_URL}/locations/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Fetch all property slugs from Firestore so the sitemap stays in sync
  let propertySlugs: string[] = [];
  try {
    propertySlugs = await getAllPropertySlugs();
  } catch {
    // Silently fall back to empty if Firestore is unreachable at build time
  }

  const propertyRoutes: MetadataRoute.Sitemap = propertySlugs.map((slug) => ({
    url: `${SITE_URL}/properties/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Fetch all published blog slugs so new articles get submitted automatically
  let blogSlugs: string[] = [];
  try {
    blogSlugs = await getAllBlogSlugs();
  } catch {
    // Silently fall back to empty if Firestore is unreachable at build time
  }

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${SITE_URL}/blogs/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...propertyRoutes, ...blogRoutes];
}
