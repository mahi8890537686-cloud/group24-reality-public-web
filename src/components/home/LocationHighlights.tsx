'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { getAllLocations } from '@/lib/firestore/locations';
import type { Location } from '@/types';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StaggerContainer, StaggerItem, FadeInUp } from '@/components/ui/MotionWrapper';

function LocationSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-ink animate-pulse aspect-[4/3] relative">
      <div className="absolute inset-0 bg-white/5" />
    </div>
  );
}

export default function LocationHighlights() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllLocations()
      .then(setLocations)
      .catch((err) => console.error('Failed to load locations:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-gold" aria-labelledby="locations-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="mb-12 text-center">
          <SectionHeader
            eyebrow="Our Markets"
            heading="Prime Locations in Rajasthan"
            subheading="We operate in three of the most exciting real estate markets on the Delhi–Jaipur corridor. Explore investment potential in each location."
          />
        </FadeInUp>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <LocationSkeleton key={i} />
            ))}
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {locations.map((loc) => (
              <StaggerItem key={loc.id ?? loc.slug}>
                <article className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-ink">
                  {/* Background Image */}
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={loc.coverImage}
                      alt={`Real estate in ${loc.name}, Rajasthan`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-gold" />
                      <span className="text-gold text-xs font-inter font-semibold uppercase tracking-wide">
                        High Growth
                      </span>
                    </div>
                    <h3 className="font-serif text-white text-2xl mb-1">
                      {loc.name}
                    </h3>
                    <p className="text-white/70 text-sm font-inter mb-4 line-clamp-2">
                      {loc.tagline}
                    </p>

                    {/* Investment points preview */}
                    <ul className="space-y-1 mb-5">
                      {loc.investmentPoints.slice(0, 2).map((point) => (
                        <li
                          key={point}
                          className="text-white/60 text-xs font-inter flex items-start gap-1.5"
                        >
                          <span className="text-gold mt-0.5 shrink-0">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>

                    <div className="flex gap-3">
                      <Link
                        href={`/properties?location=${loc.slug}`}
                        className="flex items-center gap-1.5 bg-gold hover:bg-gold-dark text-ink font-inter font-semibold text-xs px-4 py-2 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      >
                        View Properties
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/locations#${loc.slug}`}
                        className="flex items-center gap-1.5 border border-white/30 text-white hover:border-white hover:bg-white/10 font-inter text-xs px-4 py-2 rounded-lg transition-all duration-200"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
