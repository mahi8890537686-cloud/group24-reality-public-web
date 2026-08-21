import { MetadataRoute } from 'next';
import { getAllProperties } from '@/lib/firestore/properties';
import { getPublishedBlogs } from '@/lib/firestore/blogs';
import { getAllLocations } from '@/lib/firestore/locations';

const SITE_URL = 'https://www.group24reality.com';

// Fallback only used if Firestore is unreachable at build time — not a claim
// that content changed "now", just the best available signal in that case.
const BUILD_TIME = new Date();

function mostRecent(dates: (Date | undefined)[]): Date | undefined {
  const valid = dates.filter((d): d is Date => !!d && !isNaN(d.getTime()));
  if (valid.length === 0) return undefined;
  return valid.reduce((latest, d) => (d > latest ? d : latest));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch full location docs (not just slugs) so `createdAt` is available for
  // a real lastModified signal instead of always stamping "now".
  let locations: Awaited<ReturnType<typeof getAllLocations>> = [];
  try {
    locations = await getAllLocations();
  } catch {
    // Fall back to known slugs if Firestore is unreachable at build time
    locations = ['behror', 'neemrana', 'kotputli'].map((slug) => ({
      slug,
      name: slug,
    })) as Awaited<ReturnType<typeof getAllLocations>>;
  }

  // Fetch full property docs so `postedAt` (the only date Firestore tracks for
  // a property — there's no separate `updatedAt`) can drive lastModified.
  let properties: Awaited<ReturnType<typeof getAllProperties>> = [];
  try {
    properties = await getAllProperties();
  } catch {
    // Silently fall back to empty if Firestore is unreachable at build time
  }

  // Fetch full published blog docs so `updatedAt` (falling back to
  // `createdAt`) can drive lastModified.
  let blogs: Awaited<ReturnType<typeof getPublishedBlogs>> = [];
  try {
    blogs = await getPublishedBlogs();
  } catch {
    // Silently fall back to empty if Firestore is unreachable at build time
  }

  const latestLocationDate = mostRecent(
    locations.map((l) => (l.createdAt ? new Date(l.createdAt) : undefined))
  );
  const latestPropertyDate = mostRecent(
    properties.map((p) => (p.postedAt ? new Date(p.postedAt) : undefined))
  );
  const latestBlogDate = mostRecent(
    blogs.map((b) =>
      b.updatedAt ? new Date(b.updatedAt) : b.createdAt ? new Date(b.createdAt) : undefined
    )
  );
  // Homepage surfaces all three content types, so its freshest real signal is
  // whichever of them changed most recently — not an unconditional "now".
  const latestSiteWideDate =
    mostRecent([latestLocationDate, latestPropertyDate, latestBlogDate]) ?? BUILD_TIME;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: latestSiteWideDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/properties`,
      lastModified: latestPropertyDate ?? BUILD_TIME,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/locations`,
      lastModified: latestLocationDate ?? BUILD_TIME,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    ...locations.map((loc) => ({
      url: `${SITE_URL}/locations/${loc.slug}`,
      lastModified: loc.createdAt ? new Date(loc.createdAt) : BUILD_TIME,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    // /about and /contact are hand-authored static pages with no CMS-backed
    // change date — omitting lastModified rather than fabricating "now" on
    // every build (a false freshness signal for content that rarely changes).
    {
      url: `${SITE_URL}/about`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/blogs`,
      lastModified: latestBlogDate ?? BUILD_TIME,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const propertyRoutes: MetadataRoute.Sitemap = properties
    .filter((p) => !!p.slug)
    .map((p) => ({
      url: `${SITE_URL}/properties/${p.slug}`,
      lastModified: p.postedAt ? new Date(p.postedAt) : BUILD_TIME,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  const blogRoutes: MetadataRoute.Sitemap = blogs
    .filter((b) => !!b.slug)
    .map((b) => ({
      url: `${SITE_URL}/blogs/${b.slug}`,
      lastModified: b.updatedAt
        ? new Date(b.updatedAt)
        : b.createdAt
          ? new Date(b.createdAt)
          : BUILD_TIME,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...propertyRoutes, ...blogRoutes];
}
