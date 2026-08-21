import Link from 'next/link';
import { Home, Building2, MapPin } from 'lucide-react';

// App Router file convention: rendering this automatically sets the response
// status to 404, so search engines correctly drop the URL instead of
// indexing a soft-404 "200 OK" page — https://www.group24reality.com and its
// crawl budget stay pointed at real content instead of dead links.
export default function NotFound() {
  return (
    <div className="bg-bg min-h-[70vh] flex items-center pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
        <p className="text-ink/70 font-inter font-semibold text-xs tracking-widest uppercase mb-4">
          404 — Page Not Found
        </p>
        <h1 className="font-serif text-ink text-4xl sm:text-5xl leading-tight mb-6">
          This page has moved or no longer exists
        </h1>
        <p className="text-ink/65 font-inter text-base sm:text-lg leading-relaxed mb-10">
          The property or page you&apos;re looking for isn&apos;t here. It may have been sold,
          renamed, or the link may be outdated. Try one of these instead:
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-ink font-inter font-bold px-6 py-3 rounded-xl transition-all"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 border-2 border-ink text-ink hover:bg-ink hover:text-gold font-inter font-semibold px-6 py-3 rounded-xl transition-all"
          >
            <Building2 className="w-4 h-4" />
            Browse Properties
          </Link>
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 border-2 border-ink text-ink hover:bg-ink hover:text-gold font-inter font-semibold px-6 py-3 rounded-xl transition-all"
          >
            <MapPin className="w-4 h-4" />
            View Locations
          </Link>
        </div>
      </div>
    </div>
  );
}
