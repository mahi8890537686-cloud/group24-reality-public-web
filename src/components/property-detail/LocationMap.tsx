import { MapPin } from 'lucide-react';
import type { LocationKey } from '@/types';

const locationCoords: Record<LocationKey, { q: string; center: string }> = {
  behror: {
    q: 'Behror,Alwar,Rajasthan',
    center: '27.8904,76.2782',
  },
  neemrana: {
    q: 'Neemrana,Alwar,Rajasthan',
    center: '27.9896,76.3698',
  },
  kotputli: {
    q: 'Kotputli,Jaipur,Rajasthan',
    center: '27.7080,76.2036',
  },
};

interface LocationMapProps {
  location: LocationKey;
  address: string;
}

export default function LocationMap({ location, address }: LocationMapProps) {
  const coords = locationCoords[location];

  // Google Maps Embed — replace with your actual Maps Embed API key in production
  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(coords.q)}&output=embed&z=14`;

  return (
    <div>
      <h2 className="font-playfair font-semibold text-navy-950 text-xl mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-gold-400" aria-hidden="true" />
        Location Map
      </h2>

      <div className="bg-sand-50 border border-sand-200 rounded-2xl overflow-hidden">
        {/* Address pill */}
        <div className="px-5 py-3 border-b border-sand-200 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
          <span className="text-sm font-inter text-slate-600 line-clamp-1">{address}</span>
        </div>

        {/* Map iframe */}
        <div className="relative aspect-[16/9] sm:aspect-[2/1]">
          <iframe
            src={embedSrc}
            title={`Map showing location of property in ${location}`}
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <div className="px-5 py-3 bg-sand-50 text-xs font-inter text-slate-400 text-center">
          Map shows approximate area. Exact property coordinates provided on site visit.
        </div>
      </div>
    </div>
  );
}
