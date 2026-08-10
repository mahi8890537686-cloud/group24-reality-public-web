import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Calendar, Clock, MapPin, ArrowLeft, Tag,
} from 'lucide-react';
import { getBlogBySlug, getPublishedBlogs, getAllBlogSlugs } from '@/lib/firestore/blogs';
import { buildMetadata } from '@/lib/seo';
import { blogPostingSchema, breadcrumbSchema, JsonLd } from '@/lib/schema';
import ViewsAndShare from './ViewsAndShare';
import LeadCaptureForm from './LeadCaptureForm';

export async function generateStaticParams() {
  try {
    const slugs = await getAllBlogSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

// Allow ISR — revalidate every 60 seconds so newly published articles appear
export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return {};

  return buildMetadata({
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: 'article',
      publishedTime: blog.createdAt,
      authors: [blog.author],
      images: blog.coverImage
        ? [{ url: blog.coverImage, width: 1200, height: 630, alt: blog.title }]
        : undefined,
      url: `https://www.group24reality.com/blogs/${blog.slug}`,
    },
    alternates: {
      canonical: `https://www.group24reality.com/blogs/${blog.slug}`,
    },
  });
}

export default async function SingleBlogPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  const related = await getPublishedBlogs()
    .then((all) => all.filter((x) => x.slug !== slug).slice(0, 3))
    .catch(() => []);

  return (
    <div className="min-h-screen bg-bg pt-24 pb-20 font-inter">
      <JsonLd data={blogPostingSchema(blog)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Blogs', url: '/blogs' },
          { name: blog.title, url: `/blogs/${blog.slug}` },
        ])}
      />

      {/* Header Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Back Link */}
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-ink font-inter mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gold-dark" />
          Back to Blogs & Articles
        </Link>

        {/* Category & Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3.5 py-1 bg-ink text-gold font-semibold rounded-full text-xs font-inter">
            {blog.category}
          </span>
          {blog.locationSlug && (
            <span className="px-3 py-1 bg-white border border-gray-200 text-ink font-bold rounded-full text-xs font-inter capitalize flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gold-dark" />
              {blog.locationSlug}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-900 leading-tight mb-6">
          {blog.title}
        </h1>

        {/* Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-200/80 mb-8 text-xs text-gray-500 font-inter">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-ink text-white text-xs flex items-center justify-center font-serif">
                {blog.author.charAt(0)}
              </div>
              <span className="font-semibold text-gray-800">{blog.author}</span>
            </div>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {blog.readTimeMinutes} min read
            </span>
          </div>

          <ViewsAndShare blogId={blog.id!} views={blog.views} />
        </div>

        {/* Cover Image */}
        <div className="relative h-[320px] sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-lg mb-10">
          <Image
            src={blog.coverImage || '/images/fallback/default-property.jpg'}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Excerpt Box */}
        <div className="bg-gold/10 border-l-4 border-gold-dark rounded-r-2xl p-5 mb-10">
          <p className="text-base text-ink font-inter font-medium leading-relaxed italic">
            &ldquo;{blog.excerpt}&rdquo;
          </p>
        </div>

        {/* Article Content */}
        <div className="bg-gold-soft rounded-3xl p-6 sm:p-10 lg:p-12 border border-gray-100 shadow-sm mb-12">
          <div
            className="prose prose-lg max-w-none text-gray-700 font-inter leading-relaxed space-y-6 [&_h2]:text-2xl [&_h2]:font-serif [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-serif [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:text-gray-700 [&_blockquote]:border-l-4 [&_blockquote]:border-gold [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-800"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Article Tags */}
          {blog.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-400 font-inter flex items-center gap-1 mr-1">
                <Tag className="w-3.5 h-3.5" /> Tags:
              </span>
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-bg border border-gray-200 text-gray-600 rounded-full text-xs font-inter"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Location Callout Widget */}
        {blog.locationSlug && (
          <div className="bg-gradient-to-r from-ink to-charcoal rounded-3xl p-6 sm:p-8 text-white mb-12 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1 text-gold text-xs uppercase tracking-wider font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                Featured Location
              </div>
              <h3 className="text-xl sm:text-2xl font-serif capitalize">
                Explore Properties in {blog.locationSlug}
              </h3>
              <p className="text-white/70 text-xs sm:text-sm font-inter">
                View verified plots, villas, and apartments available in {blog.locationSlug} with transparent pricing.
              </p>
            </div>
            <Link
              href={`/properties?location=${blog.locationSlug}`}
              className="px-6 py-3 bg-gold hover:bg-gold-dark text-ink font-bold rounded-xl text-xs sm:text-sm font-inter transition-all shrink-0 shadow-md hover:scale-105"
            >
              Browse Properties
            </Link>
          </div>
        )}

        {/* Embedded Lead Capture Box */}
        <LeadCaptureForm blogTitle={blog.title} locationSlug={blog.locationSlug} />

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h3 className="text-2xl font-serif text-gray-900 mb-8">
              Related Articles & Guides
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blogs/${rel.slug}`}
                  className="bg-gold-soft rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-gold-dark font-inter uppercase tracking-wider">
                      {rel.category}
                    </span>
                    <h4 className="text-base font-serif text-gray-900 group-hover:text-gold-dark transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-gray-500 font-inter line-clamp-2">
                      {rel.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 font-inter">
                    <span>{rel.readTimeMinutes} min read</span>
                    <span className="text-ink font-bold group-hover:translate-x-1 transition-transform">Read →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
