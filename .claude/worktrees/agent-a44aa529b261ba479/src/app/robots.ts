import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://www.group24reality.com/sitemap.xml',
    host: 'https://www.group24reality.com',
  };
}
