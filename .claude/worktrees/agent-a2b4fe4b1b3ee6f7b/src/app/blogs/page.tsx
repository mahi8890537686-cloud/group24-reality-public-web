import type { Metadata } from 'next';
import { getPublishedBlogs } from '@/lib/firestore/blogs';
import BlogsListClient from './BlogsListClient';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, JsonLd } from '@/lib/schema';

export const metadata: Metadata = buildMetadata({
  title: 'Real Estate Blog — Investment Guides & Market Insights',
  description:
    'Expert advice, market trends, area highlights, and property investment guides for Behror, Neemrana, and Kotputli on the Delhi–Jaipur NH-48 corridor.',
  alternates: { canonical: 'https://www.group24reality.com/blogs' },
  openGraph: { url: 'https://www.group24reality.com/blogs' },
});

export default async function BlogsPage() {
  const blogs = await getPublishedBlogs().catch(() => []);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Blogs', url: '/blogs' },
        ])}
      />
      <BlogsListClient initialBlogs={blogs} />
    </>
  );
}
