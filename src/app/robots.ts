import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Block API routes — they return JSON, not crawlable content,
        // so excluding them preserves crawl budget for real pages.
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://www.group24reality.com/sitemap.xml',
    // Note: `host` directive removed — it is a Yandex-specific extension
    // not recognised by Google or Bing; canonical is declared per-page instead.
  };
}
