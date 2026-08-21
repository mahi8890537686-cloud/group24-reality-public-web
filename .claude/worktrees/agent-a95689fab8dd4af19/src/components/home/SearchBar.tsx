'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Home, IndianRupee, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const locations = [
  { value: 'all', label: 'All Locations' },
  { value: 'behror', label: 'Behror' },
  { value: 'neemrana', label: 'Neemrana' },
  { value: 'kotputli', label: 'Kotputli' },
];

const propertyTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'plot', label: 'Plot' },
  { value: 'villa', label: 'Villa' },
  { value: 'flat', label: 'Flat' },
];

const budgets = [
  { value: 'all', label: 'Any Budget' },
  { value: '0-2000000', label: 'Under ₹20 Lakh' },
  { value: '2000000-5000000', label: '₹20L – ₹50L' },
  { value: '5000000-10000000', label: '₹50L – ₹1 Cr' },
  { value: '10000000-99999999', label: 'Above ₹1 Cr' },
];

function SelectField({
  icon: Icon,
  label,
  value,
  onChange,
  options,
  ariaLabel,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  ariaLabel: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
      <label className="flex items-center gap-1.5 text-[11px] font-inter font-semibold text-gold-400/80 uppercase tracking-widest">
        <Icon className="w-3.5 h-3.5 text-gold-400" />
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white/8 hover:bg-white/12 border border-white/15 hover:border-gold-400/50 rounded-xl px-4 py-3 pr-10 text-white font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/60 focus:border-gold-400/60 cursor-pointer transition-all duration-200"
          aria-label={ariaLabel}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-navy-950 text-white">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
      </div>
    </div>
  );
}

export default function SearchBar() {
  const [location, setLocation] = useState('all');
  const [type, setType] = useState('all');
  const [budget, setBudget] = useState('all');
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location !== 'all') params.set('location', location);
    if (type !== 'all') params.set('type', type);
    if (budget !== 'all') {
      const [min, max] = budget.split('-');
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }
    router.push(`/properties?${params.toString()}`);
  };

  return (
    /* Bridge div: full-width bg-navy-950 pulls up over the hero bottom edge so
       the rounded card corners never expose the white body background */
    <div className="relative bg-navy-950 -mt-16 sm:-mt-20 pt-4 sm:pt-6 pb-10 sm:pb-14">
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8"
        aria-label="Property search"
      >
      <div className="relative bg-navy-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/40 border border-white/10 overflow-hidden p-5 sm:p-6">
        {/* Subtle top gold border accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />

        <h2 className="sr-only">Search Properties</h2>

        {/* Property type quick-pills (mobile-first top row) */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="text-[11px] font-inter font-semibold text-white/40 uppercase tracking-widest self-center mr-1">
            Type:
          </span>
          {propertyTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-inter font-semibold transition-all duration-200 border',
                type === t.value
                  ? 'bg-gold-400 text-navy-950 border-gold-400 shadow-md shadow-gold-400/25'
                  : 'bg-white/5 text-white/60 border-white/10 hover:border-gold-400/40 hover:text-white'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/8 mb-5" />

        {/* Selects + Button */}
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <SelectField
            icon={MapPin}
            label="Location"
            value={location}
            onChange={setLocation}
            options={locations}
            ariaLabel="Select location"
          />
          <SelectField
            icon={IndianRupee}
            label="Budget"
            value={budget}
            onChange={setBudget}
            options={budgets}
            ariaLabel="Select budget range"
          />

          {/* Search Button */}
          <div className="flex flex-col justify-end w-full sm:w-auto shrink-0">
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-500 text-navy-950 font-inter font-bold py-3 px-7 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-gold-400/35 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 whitespace-nowrap text-sm"
              aria-label="Search properties"
            >
              <Search className="w-4 h-4" />
              Search Properties
            </button>
          </div>
        </div>
      </div>
    </motion.section>
    </div>
  );
}
