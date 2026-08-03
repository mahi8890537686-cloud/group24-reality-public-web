'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Maximize2, Bed, ArrowRight, Layers } from 'lucide-react';
import type { Property } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { cn, formatArea } from '@/lib/utils';

const typeLabels: Record<string, string> = {
  plot: 'Plot',
  villa: 'Villa',
  flat: 'Flat',
};

const statusConfig: Record<string, { label: string; variant: 'green' | 'red' | 'gold' }> = {
  available: { label: 'Available', variant: 'green' },
  sold: { label: 'Sold', variant: 'red' },
  'under-negotiation': { label: 'Under Negotiation', variant: 'gold' },
};

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export default function PropertyCard({ property, className }: PropertyCardProps) {
  const status = statusConfig[property.status] ?? statusConfig.available;

  return (
    <motion.article
      whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(11,22,41,0.12)' }}
      transition={{ duration: 0.25 }}
      className={cn(
        'bg-white rounded-2xl overflow-hidden border border-sand-100 shadow-md group',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-sand-100">
        <Image
          src={property.images[0]}
          alt={`${property.title} — ${property.location}, Rajasthan`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge variant="navy">{typeLabels[property.type]}</Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        {/* Price tag */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy-950/80 to-transparent p-4">
          <span className="text-white font-playfair font-bold text-2xl">
            {property.priceLabel}
          </span>
          {property.pricePerUnit && (
            <span className="text-white/70 text-xs font-inter ml-2">{property.pricePerUnit}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-playfair font-semibold text-navy-950 text-lg leading-snug mb-2 line-clamp-2">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-slate-500 text-sm font-inter mb-4">
          <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0" />
          <span className="truncate">{property.address}</span>
        </div>

        {/* Specs row */}
        <div className="flex flex-wrap items-center gap-4 text-sm font-inter text-slate-600 mb-4 pb-4 border-b border-sand-100">
          <span className="flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-gold-500" />
            {formatArea(property.area, property.areaUnit)}
          </span>
          {property.bedrooms && (
            <span className="flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-gold-500" />
              {property.bedrooms} BHK
            </span>
          )}
          {property.facing && (
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-gold-500" />
              {property.facing} Facing
            </span>
          )}
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {property.highlights.slice(0, 3).map((h) => (
            <span
              key={h}
              className="text-xs font-inter bg-sand-50 text-navy-800 border border-sand-200 px-2.5 py-1 rounded-full"
            >
              {h}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/properties/${property.slug}`}
          className="group/btn flex items-center justify-between w-full bg-navy-950 hover:bg-gold-400 text-white hover:text-navy-950 rounded-xl px-5 py-3 font-inter font-semibold text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </motion.article>
  );
}
