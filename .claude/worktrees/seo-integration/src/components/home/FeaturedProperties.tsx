'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { getFeaturedProperties } from '@/lib/firestore/properties';
import type { Property } from '@/types';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StaggerContainer, StaggerItem, FadeInUp } from '@/components/ui/MotionWrapper';
import PropertyCard from '@/components/properties/PropertyCard';

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProperties(6)
      .then(setProperties)
      .catch((err) => console.error('Failed to load featured properties:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-bg" aria-labelledby="featured-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <SectionHeader
              eyebrow="Handpicked for You"
              heading="Featured Properties"
              subheading="Explore our top listings across Behror, Neemrana, and Kotputli — each verified by our team."
              align="left"
            />
            <Link
              href="/properties"
              className="group inline-flex items-center gap-2 text-text-secondary hover:text-gold-dark font-inter font-semibold text-sm transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-md"
            >
              View All Properties
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </FadeInUp>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-10 h-10 text-gold-dark animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <p className="text-center text-slate-500 font-inter py-12">
            No featured properties at the moment. Check back soon!
          </p>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {properties.map((property) => (
              <StaggerItem key={property.id}>
                <PropertyCard property={property} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
