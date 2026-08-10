'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen, Search, Clock, Calendar, ArrowRight,
  MapPin, Sparkles,
} from 'lucide-react';
import type { BlogPost, BlogCategory } from '@/types';

const CATEGORIES: { label: string; value: BlogCategory | 'all' }[] = [
  { label: 'All Articles', value: 'all' },
  { label: 'Investment Guides', value: 'Investment Guide' },
  { label: 'Area Highlights', value: 'Area Highlights' },
  { label: 'Market Trends', value: 'Market Trends' },
  { label: 'Buying Tips', value: 'Buying Tips' },
  { label: 'News & Updates', value: 'News & Updates' },
];

const LOCATIONS = [
  { label: 'All Locations', value: 'all' },
  { label: 'Behror', value: 'behror' },
  { label: 'Neemrana', value: 'neemrana' },
  { label: 'Kotputli', value: 'kotputli' },
];

interface BlogsListClientProps {
  initialBlogs: BlogPost[];
}

export default function BlogsListClient({ initialBlogs }: BlogsListClientProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const filteredBlogs = initialBlogs.filter((b) => {
    const matchCat = selectedCategory === 'all' || b.category === selectedCategory;
    const matchLoc = selectedLocation === 'all' || b.locationSlug === selectedLocation;
    const term = search.toLowerCase();
    const matchSearch =
      !search ||
      b.title.toLowerCase().includes(term) ||
      b.excerpt.toLowerCase().includes(term) ||
      b.tags.some((t) => t.toLowerCase().includes(term));
    return matchCat && matchLoc && matchSearch;
  });

  const featured = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const list = featured ? filteredBlogs.slice(1) : [];

  return (
    <div className="min-h-screen bg-bg pb-16 font-inter">
      {/* Hero Section */}
      <section className="relative bg-bg text-ink pt-28 pb-14 lg:pt-32 lg:pb-16 overflow-hidden">
        {/* Dot-grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c9a84c_1px,transparent_1px)] [background-size:20px_20px]" />
        {/* Gradient glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gold/10 blur-[80px] rounded-full" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg border border-border-subtle text-ink text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
              Real Estate Insights &amp; Guides
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif tracking-tight leading-tight text-ink">
              Group 24 Reality{' '}
              <span className="text-ink">Blog</span>
            </h1>
            <p className="text-ink/65 text-base sm:text-lg max-w-2xl mx-auto font-inter leading-relaxed">
              Expert advice, market trends, area highlights, and smart property investment strategies along the NH-48 corridor in Rajasthan.
            </p>

            {/* Search Input */}
            <div className="relative max-w-xl mx-auto mt-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, topic or location…"
                className="w-full pl-12 pr-4 py-4 bg-bg text-ink rounded-2xl shadow-md text-sm font-inter focus:outline-none focus:ring-2 focus:ring-ink placeholder-slate-400 border border-border-subtle"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-gold-soft rounded-2xl shadow-md border border-gold/30 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium font-inter transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-ink text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Location Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
            <MapPin className="w-4 h-4 text-gold-dark shrink-0" />
            <span className="text-xs font-semibold text-gray-500 font-inter">Location:</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium font-inter text-gray-800 focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {filteredBlogs.length === 0 ? (
          <div className="bg-gold-soft rounded-3xl p-12 text-center border border-gray-100 max-w-lg mx-auto my-12">
            <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gold-dark" />
            </div>
            <h3 className="text-xl font-serif text-gray-900 mb-2">No Articles Found</h3>
            <p className="text-sm text-gray-500 font-inter mb-6">
              We couldn&apos;t find any articles matching your selected search or location filter.
            </p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('all'); setSelectedLocation('all'); }}
              className="px-5 py-2.5 bg-ink text-white rounded-xl text-xs font-semibold font-inter hover:bg-charcoal transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Hero Article */}
            {featured && (
              <div className="bg-gold-soft rounded-3xl overflow-hidden shadow-lg border border-gray-100 grid grid-cols-1 lg:grid-cols-12 group">
                <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[420px]">
                  <Image
                    src={featured.coverImage || '/images/fallback/default-property.jpg'}
                    alt={featured.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-ink/80 backdrop-blur-md text-gold rounded-full text-xs font-semibold font-inter">
                      {featured.category}
                    </span>
                    {featured.locationSlug && (
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-ink rounded-full text-xs font-bold capitalize font-inter flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gold-dark" />
                        {featured.locationSlug}
                      </span>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-xs text-gray-500 font-inter">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(featured.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {featured.readTimeMinutes} min read
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 group-hover:text-gold-dark transition-colors leading-tight">
                      <Link href={`/blogs/${featured.slug}`}>{featured.title}</Link>
                    </h2>

                    <p className="text-gray-600 font-inter text-sm leading-relaxed line-clamp-3">
                      {featured.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-6">
                    <span className="text-xs font-semibold text-gray-500 font-inter">
                      By {featured.author}
                    </span>
                    <Link
                      href={`/blogs/${featured.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-ink group-hover:text-gold-dark transition-colors font-inter"
                    >
                      Read Full Article
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Articles Grid */}
            {list.length > 0 && (
              <div>
                <h3 className="text-xl font-serif text-gray-900 mb-6">
                  Latest Insights ({list.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {list.map((blog) => (
                    <article
                      key={blog.id}
                      className="bg-gold-soft rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group"
                    >
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={blog.coverImage || '/images/fallback/default-property.jpg'}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="px-2.5 py-0.5 bg-ink/80 backdrop-blur-sm text-gold rounded-full text-[11px] font-semibold font-inter">
                            {blog.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-[11px] text-gray-400 font-inter">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {blog.readTimeMinutes} min
                            </span>
                          </div>

                          <h4 className="text-lg font-serif text-gray-900 group-hover:text-gold-dark transition-colors line-clamp-2">
                            <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                          </h4>

                          <p className="text-xs text-gray-600 font-inter leading-relaxed line-clamp-3">
                            {blog.excerpt}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                          {blog.locationSlug && (
                            <span className="text-[11px] font-semibold text-charcoal font-inter capitalize flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gold-dark" />
                              {blog.locationSlug}
                            </span>
                          )}
                          <Link
                            href={`/blogs/${blog.slug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink group-hover:text-gold-dark transition-colors font-inter ml-auto"
                          >
                            Read More
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
