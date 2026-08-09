'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Select } from '@/components/ui/Select';

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
    /* Bridge div: full-width bg-ink pulls up over the hero bottom edge so
       the rounded card corners never expose the white body background */
    <div className="relative bg-ink -mt-16 sm:-mt-20 pt-4 sm:pt-6 pb-4 sm:pb-6">
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8"
        aria-label="Property search"
      >
      <GlassPanel variant="strong" className="relative overflow-hidden p-5 sm:p-6 shadow-2xl">
        {/* Subtle top gold border accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

        <h2 className="sr-only">Search Properties</h2>

        {/* Property type quick-pills (mobile-first top row) */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="text-[11px] font-inter font-semibold text-text-secondary uppercase tracking-widest self-center mr-1">
            Type:
          </span>
          {propertyTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-inter font-semibold transition-all duration-200 border',
                type === t.value
                  ? 'bg-gold text-ink border-gold shadow-md shadow-gold/25'
                  : 'bg-bg-secondary text-text-secondary border-border hover:border-gold/40 hover:text-text'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-ink/10 mb-5" />

        {/* Selects + Button */}
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <Select
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              options={locations}
            />
          </div>
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <Select
              label="Budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              options={budgets}
            />
          </div>

          {/* Search Button */}
          <div className="flex flex-col justify-end w-full sm:w-auto shrink-0">
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 h-14 bg-gold hover:bg-gold-dark text-ink font-inter font-bold px-7 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-gold/35 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold whitespace-nowrap text-sm"
              aria-label="Search properties"
            >
              <Search className="w-4 h-4" />
              Search Properties
            </button>
          </div>
        </div>
      </GlassPanel>
    </motion.section>
    </div>
  );
}
