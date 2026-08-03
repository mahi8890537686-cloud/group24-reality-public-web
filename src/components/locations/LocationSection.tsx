import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, TrendingUp, MapPin, CheckCircle2, Train } from 'lucide-react';
import type { LocationData } from '@/types';

interface LocationSectionProps {
  location: LocationData;
}

export default function LocationSection({ location }: LocationSectionProps) {
  return (
    <section
      id={location.key}
      className="py-16 sm:py-24 scroll-mt-20"
      aria-labelledby={`${location.key}-heading`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={location.image}
              alt={`Real estate in ${location.name}, Rajasthan`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <div className="flex flex-wrap gap-2">
                {location.propertyTypes.map((t) => (
                  <span
                    key={t}
                    className="bg-gold-400 text-navy-950 font-inter font-semibold text-xs px-3 py-1 rounded-full capitalize"
                  >
                    {t}s Available
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-gold-500 font-inter font-semibold text-xs tracking-widest uppercase mb-3">
              {location.name}, Rajasthan
            </p>
            <h2
              id={`${location.key}-heading`}
              className="font-playfair font-bold text-navy-950 text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4"
            >
              Properties in {location.name}
            </h2>
            <p className="text-slate-600 font-inter leading-relaxed mb-8">
              {location.description}
            </p>

            {/* Investment Points */}
            <div className="mb-8">
              <h3 className="font-playfair font-semibold text-navy-950 text-xl mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gold-400" aria-hidden="true" />
                Why Invest in {location.name}?
              </h3>
              <ul className="space-y-3">
                {location.investmentPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm font-inter text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Two Columns: Connectivity + Infrastructure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-inter font-semibold text-navy-950 text-sm uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Train className="w-4 h-4 text-gold-400" />
                  Connectivity
                </h3>
                <ul className="space-y-2">
                  {location.connectivity.map((item) => (
                    <li key={item} className="text-sm font-inter text-slate-500 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-inter font-semibold text-navy-950 text-sm uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gold-400" />
                  Infrastructure
                </h3>
                <ul className="space-y-2">
                  {location.infrastructure.map((item) => (
                    <li key={item} className="text-sm font-inter text-slate-500 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* SEO-rich subheadings for each property type */}
            <div className="bg-sand-50 rounded-2xl p-5 border border-sand-200 mb-6">
              <h3 className="font-playfair font-semibold text-navy-950 text-lg mb-3">
                Property Options in {location.name}
              </h3>
              <div className="space-y-1 text-sm font-inter text-slate-600">
                <p>
                  <strong className="text-navy-900">Plots for sale in {location.name}</strong>: 
                  {' '}Freehold residential plots from ₹12 Lakh with clear title documentation.
                </p>
                <p>
                  <strong className="text-navy-900">Villas in {location.name}</strong>: 
                  {' '}3BHK and 4BHK independent villas in gated townships with modern amenities.
                </p>
                <p>
                  <strong className="text-navy-900">Flats in {location.name}</strong>: 
                  {' '}1BHK to 3BHK apartments in well-maintained society complexes with parking.
                </p>
              </div>
            </div>

            <Link
              href={`/properties?location=${location.key}`}
              className="group inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-navy-950 font-inter font-bold px-7 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gold-400/30 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
            >
              View All Properties in {location.name}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
