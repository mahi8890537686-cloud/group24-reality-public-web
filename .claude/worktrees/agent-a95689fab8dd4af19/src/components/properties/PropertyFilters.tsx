'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import type { LocationKey, PropertyType, PropertyStatus } from '@/types';

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

interface SelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  id: string;
}

function FilterSelect({ label, value, onChange, options, id }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-inter font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border border-sand-200 rounded-xl px-3 py-2.5 text-navy-950 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

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
      <FilterSelect id="filter-location" label="Location" value={location} onChange={(v) => { setLocation(v); apply({ location: v }); }} options={LOCATIONS} />
      <FilterSelect id="filter-type" label="Property Type" value={type} onChange={(v) => { setType(v); apply({ type: v }); }} options={TYPES} />
      <FilterSelect id="filter-price" label="Budget" value={priceRange} onChange={(v) => { setPriceRange(v); apply({ priceRange: v }); }} options={PRICE_RANGES} />
      <FilterSelect id="filter-bedrooms" label="Bedrooms" value={bedrooms} onChange={(v) => { setBedrooms(v); apply({ bedrooms: v }); }} options={BEDROOMS} />
      <FilterSelect id="filter-status" label="Status" value={status} onChange={(v) => { setStatus(v); apply({ status: v }); }} options={STATUSES} />
    </div>
  );

  return (
    <div className="bg-sand-50 border border-sand-200 rounded-2xl p-5">
      {/* Mobile toggle */}
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 text-navy-950 font-inter font-semibold text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-md"
        >
          <SlidersHorizontal className="w-4 h-4 text-gold-500" />
          {mobileOpen ? 'Hide Filters' : 'Show Filters'}
          {hasFilters && (
            <span className="bg-gold-400 text-navy-950 rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
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

      {/* Mobile: toggleable */}
      {mobileOpen && <div className="lg:hidden mt-2">{filtersUI}</div>}
    </div>
  );
}
