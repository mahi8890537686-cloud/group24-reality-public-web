import type { Property } from '@/types';
import PropertyCard from './PropertyCard';
import { StaggerContainer, StaggerItem } from '@/components/ui/MotionWrapper';
import { SearchX } from 'lucide-react';
import Link from 'next/link';

interface PropertyGridProps {
  properties: Property[];
}

export default function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-sand-100 flex items-center justify-center">
          <SearchX className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="font-playfair font-semibold text-navy-950 text-xl">No Properties Found</h3>
        <p className="text-slate-500 font-inter text-sm max-w-md">
          No properties match your current filters. Try broadening your search or clearing some
          filters to see more results.
        </p>
        <Link
          href="/properties"
          className="mt-2 bg-gold-400 hover:bg-gold-500 text-navy-950 font-inter font-semibold px-6 py-3 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
        >
          Clear All Filters
        </Link>
      </div>
    );
  }

  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {properties.map((property) => (
        <StaggerItem key={property.id}>
          <PropertyCard property={property} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
