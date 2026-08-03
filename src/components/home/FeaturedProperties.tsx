import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { featuredProperties } from '@/data/properties';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StaggerContainer, StaggerItem, FadeInUp } from '@/components/ui/MotionWrapper';
import PropertyCard from '@/components/properties/PropertyCard';

export default function FeaturedProperties() {
  return (
    <section className="py-16 sm:py-24 bg-sand-50" aria-labelledby="featured-heading">
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
              className="group inline-flex items-center gap-2 text-navy-800 hover:text-gold-500 font-inter font-semibold text-sm transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-md"
            >
              View All Properties
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {featuredProperties.slice(0, 6).map((property) => (
            <StaggerItem key={property.id}>
              <PropertyCard property={property} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
