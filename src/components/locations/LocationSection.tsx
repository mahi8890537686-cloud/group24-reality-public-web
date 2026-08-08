import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, TrendingUp, MapPin, CheckCircle2, Train } from 'lucide-react';
import type { Location, Property } from '@/types';
import PropertyCard from '@/components/properties/PropertyCard';

interface LocationSectionProps {
  location: Location;
  /** Up to 6 available properties shown in a full-width 3-col grid below. */
  properties?: Property[];
}

export default function LocationSection({ location, properties = [] }: LocationSectionProps) {
  return (
    <section
      id={location.slug}
      className="py-16 sm:py-24 scroll-mt-20"
      aria-labelledby={`${location.slug}-heading`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Top two-column block ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-stretch">

          {/* LEFT col: cover image + Property Options SEO block */}
          <div className="flex flex-col gap-6 h-full">
            {/* Cover image */}
            <div className="relative flex-1 min-h-[220px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={location.coverImage}
                alt={`Real estate in ${location.name}, Rajasthan`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="flex flex-wrap gap-2">
                  {(['plot', 'villa', 'flat'] as const).map((t) => (
                    <span
                      key={t}
                      className="bg-gold-400 text-navy-950 font-inter font-semibold text-xs px-3 py-1 rounded-full capitalize"
                    >
                      {t}s Available
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Property Options SEO block — sits directly below image in same col */}
            <div className="bg-sand-50 rounded-2xl p-5 border border-sand-200">
              <h3 className="font-playfair font-semibold text-navy-950 text-lg mb-3">
                Property Options in {location.name}
              </h3>
              <div className="space-y-2 text-sm font-inter text-slate-600">
                <p>
                  <strong className="text-navy-900">Plots for sale in {location.name}</strong>:{' '}
                  Freehold residential plots from ₹12 Lakh with clear title documentation.
                </p>
                <p>
                  <strong className="text-navy-900">Villas in {location.name}</strong>:{' '}
                  3BHK and 4BHK independent villas in gated townships with modern amenities.
                </p>
                <p>
                  <strong className="text-navy-900">Flats in {location.name}</strong>:{' '}
                  1BHK to 3BHK apartments in well-maintained society complexes with parking.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT col: heading, description, investment, connectivity & infrastructure */}
          <div>
            <p className="text-gold-500 font-inter font-semibold text-xs tracking-widest uppercase mb-3">
              {location.name}, {location.state}
            </p>
            <h2
              id={`${location.slug}-heading`}
              className="font-playfair font-bold text-navy-950 text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4"
            >
              Properties in {location.name}
            </h2>
            <p className="text-slate-600 font-inter leading-relaxed mb-8">
              {location.description}
            </p>

            {/* Investment Points */}
            <div className="mb-8">
              <h3 className="font-playfair font-semibold text-navy-950 text-xl mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gold-400" aria-hidden="true" />
                Why Invest in {location.name}?
              </h3>
              <ul className="space-y-3">
                {location.investmentPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm font-inter text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Connectivity + Infrastructure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-inter font-semibold text-navy-950 text-sm uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Train className="w-4 h-4 text-gold-400" />
                  Connectivity
                </h3>
                <ul className="space-y-2">
                  {location.connectivity.map((item) => (
                    <li key={item} className="text-sm font-inter text-slate-500 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-inter font-semibold text-navy-950 text-sm uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gold-400" />
                  Infrastructure
                </h3>
                <ul className="space-y-2">
                  {location.infrastructure.map((item) => (
                    <li key={item} className="text-sm font-inter text-slate-500 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── Property cards — full-width 3-col grid, completely separate below ── */}
        {properties.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <h3 className="font-playfair font-bold text-navy-950 text-2xl">
                Available Properties in {location.name}
              </h3>
              <Link
                href={`/properties?location=${location.slug}`}
                className="group flex items-center gap-1.5 text-gold-600 hover:text-gold-700 font-inter font-semibold text-sm transition-colors shrink-0"
              >
                View all listings
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
