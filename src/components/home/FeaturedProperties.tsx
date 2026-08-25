// Server Component — data fetched at request time so Googlebot sees
// actual property cards in the initial HTML (not a client-side spinner).
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getFeaturedProperties } from '@/lib/firestore/properties';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StaggerContainer, StaggerItem, FadeInUp } from '@/components/ui/MotionWrapper';
import PropertyCard from '@/components/properties/PropertyCard';

export default async function FeaturedProperties() {
  // Fetch server-side so the property cards are present in the SSR HTML.
  // Errors are caught gracefully — the section renders empty rather than
  // crashing the whole homepage.
  const properties = await getFeaturedProperties(6).catch(() => []);

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

        {properties.length === 0 ? (
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

