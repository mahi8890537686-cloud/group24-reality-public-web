import { Maximize2, Bed, Bath, Compass, Layers, MapPin } from 'lucide-react';
import type { Property } from '@/types';
import { formatArea } from '@/lib/utils';

interface PropertyOverviewProps {
  property: Property;
}

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
      {/* Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {specs.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-gold-soft border border-gold/30 rounded-xl px-4 py-3 flex items-center gap-3"
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
