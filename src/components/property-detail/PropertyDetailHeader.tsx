import Link from 'next/link';
import { MapPin, FileCheck } from 'lucide-react';
import type { Property } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { capitalise } from '@/lib/utils';

interface PropertyDetailHeaderProps {
  property: Property;
}

const statusBadge: Record<string, 'green' | 'red' | 'gold'> = {
  available: 'green',
  sold: 'red',
  'under-negotiation': 'gold',
};

const statusLabel: Record<string, string> = {
  available: 'Available',
  sold: 'Sold',
  'under-negotiation': 'Under Negotiation',
};

export default function PropertyDetailHeader({ property }: PropertyDetailHeaderProps) {
  return (
    <div className="bg-ink pt-28 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm font-inter text-white/50">
            <li><Link href="/" className="hover:text-gold transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/properties" className="hover:text-gold transition-colors">Properties</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-text-on-dark font-medium truncate max-w-xs">{property.title}</li>
          </ol>
        </nav>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="gold">{capitalise(property.type)}</Badge>
          <Badge variant={statusBadge[property.status]}>
            {statusLabel[property.status]}
          </Badge>
          {property.reraNumber && (
            <Badge variant="sand">
              <FileCheck className="w-3 h-3" />
              RERA: {property.reraNumber}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-serif text-text-on-dark text-2xl sm:text-3xl lg:text-4xl leading-tight">
              {property.title}
            </h1>
            <p className="text-text-on-dark/70 font-inter text-sm mt-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
              {property.address}
            </p>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <div className="font-serif text-text-on-dark text-3xl sm:text-4xl">
              {property.priceLabel}
            </div>
            {property.pricePerUnit && (
              <div className="text-text-on-dark/60 font-inter text-sm">{property.pricePerUnit}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
