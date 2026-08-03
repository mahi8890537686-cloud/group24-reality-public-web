import type { Property } from '@/types';
import { getRelatedProperties } from '@/data/properties';
import PropertyCard from '@/components/properties/PropertyCard';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface RelatedPropertiesProps {
  property: Property;
}

export default function RelatedProperties({ property }: RelatedPropertiesProps) {
  const related = getRelatedProperties(property, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-sand-200" aria-labelledby="related-heading">
      <SectionHeader
        id="related-heading"
        eyebrow="More in This Area"
        heading={`Similar Properties in ${property.location.charAt(0).toUpperCase() + property.location.slice(1)}`}
        align="left"
        headingAs="h2"
      />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </section>
  );
}
