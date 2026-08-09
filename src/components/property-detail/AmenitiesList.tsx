import { CheckCircle2, Zap, MapPin } from 'lucide-react';
import type { Property } from '@/types';

interface AmenitiesListProps {
  amenities: Property['amenities'];
  highlights: Property['highlights'];
  nearbyLandmarks: Property['nearbyLandmarks'];
}

export default function AmenitiesList({
  amenities,
  highlights,
  nearbyLandmarks,
}: AmenitiesListProps) {
  return (
    <div className="space-y-8">
      {/* Highlights */}
      {highlights.length > 0 && (
        <div>
          <h2 className="font-serif font-semibold text-ink text-xl mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-gold" aria-hidden="true" />
            Key Highlights
          </h2>
          <div className="flex flex-wrap gap-2">
            {highlights.map((h) => (
              <span
                key={h}
                className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/30 text-text-secondary font-inter font-medium text-sm px-4 py-2 rounded-full"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" aria-hidden="true" />
                {h}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Amenities */}
      {amenities.length > 0 && (
        <div>
          <h2 className="font-serif font-semibold text-ink text-xl mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-gold" aria-hidden="true" />
            Amenities & Features
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {amenities.map((amenity) => (
              <li
                key={amenity}
                className="flex items-center gap-2.5 text-sm font-inter text-slate-700 bg-bg border border-border-subtle rounded-xl px-4 py-3"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
                {amenity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Nearby Landmarks */}
      {nearbyLandmarks.length > 0 && (
        <div>
          <h2 className="font-serif font-semibold text-ink text-xl mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gold" aria-hidden="true" />
            Nearby Landmarks
          </h2>
          <ul className="space-y-2">
            {nearbyLandmarks.map((landmark) => (
              <li
                key={landmark}
                className="flex items-center gap-2.5 text-sm font-inter text-slate-600"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" aria-hidden="true" />
                {landmark}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
