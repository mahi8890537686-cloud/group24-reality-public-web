import { MetadataRoute } from 'next';
import { properties } from '@/data/properties';

const SITE_URL = 'https://www.group24reality.com';

export default function sitemap(): MetadataRoute.Sitemap {
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
  ];

  const propertyRoutes: MetadataRoute.Sitemap = properties.map((p) => {
    const date = new Date(p.postedAt);
    const safeDate = isNaN(date.getTime()) ? new Date() : date;
    return {
      url: `${SITE_URL}/properties/${p.slug}`,
      lastModified: safeDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });

  return [...staticRoutes, ...propertyRoutes];
}
