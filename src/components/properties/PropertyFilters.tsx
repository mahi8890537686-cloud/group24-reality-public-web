'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Select } from '@/components/ui/Select';

const LOCATIONS = [
  { value: 'all', label: 'All Locations' },
  { value: 'behror', label: 'Behror' },
  { value: 'neemrana', label: 'Neemrana' },
  { value: 'kotputli', label: 'Kotputli' },
];

const TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'plot', label: 'Plot' },
  { value: 'villa', label: 'Villa' },
  { value: 'flat', label: 'Flat / Apartment' },
];

const STATUSES = [
  { value: 'all', label: 'All Status' },
  { value: 'available', label: 'Available' },
  { value: 'under-negotiation', label: 'Under Negotiation' },
];

const PRICE_RANGES = [
  { value: 'all', label: 'Any Budget' },
  { value: '0-2000000', label: 'Under ₹20 Lakh' },
  { value: '2000000-5000000', label: '₹20L – ₹50L' },
  { value: '5000000-10000000', label: '₹50L – ₹1 Cr' },
  { value: '10000000-999999999', label: 'Above ₹1 Cr' },
];

const BEDROOMS = [
  { value: 'any', label: 'Any BHK' },
  { value: '1', label: '1 BHK' },
  { value: '2', label: '2 BHK' },
  { value: '3', label: '3 BHK' },
  { value: '4', label: '4+ BHK' },
];

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getParam = (key: string, fallback = 'all') => searchParams.get(key) ?? fallback;

  const [location, setLocation] = useState(getParam('location'));
  const [type, setType] = useState(getParam('type'));
  const [status, setStatus] = useState(getParam('status'));
  const [priceRange, setPriceRange] = useState('all');
  const [bedrooms, setBedrooms] = useState(getParam('bedrooms', 'any'));

  const apply = useCallback(
    (overrides: Record<string, string> = {}) => {
      const params = new URLSearchParams();
      const state = { location, type, status, priceRange, bedrooms, ...overrides };

      if (state.location !== 'all') params.set('location', state.location);
      if (state.type !== 'all') params.set('type', state.type);
      if (state.status !== 'all') params.set('status', state.status);
      if (state.bedrooms !== 'any') params.set('bedrooms', state.bedrooms);
      if (state.priceRange !== 'all') {
        const [min, max] = state.priceRange.split('-');
        params.set('minPrice', min);
        params.set('maxPrice', max);
      }
      router.push(`/properties?${params.toString()}`);
    },
    [location, type, status, priceRange, bedrooms, router]
  );

  const reset = () => {
    setLocation('all');
    setType('all');
    setStatus('all');
    setPriceRange('all');
    setBedrooms('any');
    router.push('/properties');
  };

  const hasFilters =
    location !== 'all' ||
    type !== 'all' ||
    status !== 'all' ||
    priceRange !== 'all' ||
    bedrooms !== 'any';

  const filtersUI = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Select id="filter-location" label="Location" value={location} onChange={(e) => { setLocation(e.target.value); apply({ location: e.target.value }); }} options={LOCATIONS} />
      <Select id="filter-type" label="Property Type" value={type} onChange={(e) => { setType(e.target.value); apply({ type: e.target.value }); }} options={TYPES} />
      <Select id="filter-price" label="Budget" value={priceRange} onChange={(e) => { setPriceRange(e.target.value); apply({ priceRange: e.target.value }); }} options={PRICE_RANGES} />
      <Select id="filter-bedrooms" label="Bedrooms" value={bedrooms} onChange={(e) => { setBedrooms(e.target.value); apply({ bedrooms: e.target.value }); }} options={BEDROOMS} />
      <Select id="filter-status" label="Status" value={status} onChange={(e) => { setStatus(e.target.value); apply({ status: e.target.value }); }} options={STATUSES} />
    </div>
  );

  return (
    <div className="bg-bg border border-border-subtle rounded-2xl p-5">
      {/* Mobile toggle */}
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 text-ink font-inter font-semibold text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-md"
        >
          <SlidersHorizontal className="w-4 h-4 text-gold-dark" />
          {mobileOpen ? 'Hide Filters' : 'Show Filters'}
          {hasFilters && (
            <span className="bg-gold text-ink rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
              •
            </span>
          )}
        </button>
        {hasFilters && (
          <button
            onClick={reset}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Desktop: always shown */}
      <div className="hidden lg:block">
        {filtersUI}
        {hasFilters && (
          <button
            onClick={reset}
            className="mt-3 text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear all filters
          </button>
        )}
      </div>

      {/* Mobile: bottom-sheet drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="filters-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[59] bg-ink/40 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              key="filters-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 bottom-0 z-[60] bg-surface rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Filter properties"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-ink text-lg">Filters</h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-md hover:bg-bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5 text-ink" />
                </button>
              </div>
              {filtersUI}
              {hasFilters && (
                <button
                  onClick={reset}
                  className="mt-4 text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear all filters
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
