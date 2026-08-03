'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Home, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-20 -mt-12 sm:-mt-16 container mx-auto px-4 sm:px-6 lg:px-8"
      aria-label="Property search"
    >
      <div className="bg-white rounded-2xl shadow-2xl shadow-navy-950/15 p-4 sm:p-6 border border-sand-100">
        <h2 className="sr-only">Search Properties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-inter font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold-500" />
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-sand-50 border border-sand-200 rounded-xl px-4 py-3 text-navy-950 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 cursor-pointer"
              aria-label="Select location"
            >
              {locations.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-inter font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-gold-500" />
              Property Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-sand-50 border border-sand-200 rounded-xl px-4 py-3 text-navy-950 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 cursor-pointer"
              aria-label="Select property type"
            >
              {propertyTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-inter font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-gold-500" />
              Budget
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="bg-sand-50 border border-sand-200 rounded-xl px-4 py-3 text-navy-950 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 cursor-pointer"
              aria-label="Select budget range"
            >
              {budgets.map((b) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="flex flex-col justify-end">
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-500 text-navy-950 font-inter font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gold-400/30 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
              aria-label="Search properties"
            >
              <Search className="w-4 h-4" />
              Search Properties
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
