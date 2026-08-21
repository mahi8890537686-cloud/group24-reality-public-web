import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // API routes carry no indexable content and would only waste crawl
        // budget / risk showing up as thin/duplicate results.
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://www.group24reality.com/sitemap.xml',
    host: 'https://www.group24reality.com',
  };
}
