import { Maximize2, Bed, Bath, Compass, Layers, FileCheck, MapPin } from 'lucide-react';
import type { Property } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { formatArea, capitalise } from '@/lib/utils';

interface PropertyOverviewProps {
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

export default function PropertyOverview({ property }: PropertyOverviewProps) {
  const specs = [
    { icon: Maximize2, label: 'Area', value: formatArea(property.area, property.areaUnit) },
    ...(property.bedrooms ? [{ icon: Bed, label: 'Bedrooms', value: `${property.bedrooms} BHK` }] : []),
    ...(property.bathrooms ? [{ icon: Bath, label: 'Bathrooms', value: `${property.bathrooms}` }] : []),
    ...(property.facing ? [{ icon: Compass, label: 'Facing', value: property.facing }] : []),
    ...(property.floor ? [{ icon: Layers, label: 'Floor', value: property.floor }] : []),
    { icon: MapPin, label: 'Location', value: (property.locationName || property.locationSlug) + ', Rajasthan' },
  ];

  return (
    <div className="space-y-6">
      {/* Title + Status */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="navy">{capitalise(property.type)}</Badge>
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
          <h1 className="font-serif text-ink text-2xl sm:text-3xl lg:text-4xl leading-tight">
            {property.title}
          </h1>
          <p className="text-slate-500 font-inter text-sm mt-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gold-dark shrink-0" />
            {property.address}
          </p>
        </div>
        <div className="text-right">
          <div className="font-serif text-ink text-3xl sm:text-4xl">
            {property.priceLabel}
          </div>
          {property.pricePerUnit && (
            <div className="text-slate-400 font-inter text-sm">{property.pricePerUnit}</div>
          )}
        </div>
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {specs.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-bg border border-border-subtle rounded-xl px-4 py-3 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-gold-dark" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-inter">{label}</div>
              <div className="text-sm font-inter font-semibold text-ink">{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div>
        <h2 className="font-serif text-ink text-xl mb-3">
          About This Property
        </h2>
        <p className="text-slate-600 font-inter text-sm leading-relaxed">{property.description}</p>
      </div>
    </div>
  );
}
