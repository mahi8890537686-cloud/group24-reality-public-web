'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'area-asc', label: 'Area: Small to Large' },
  { value: 'area-desc', label: 'Area: Large to Small' },
];

interface PropertySortProps {
  total: number;
}

export default function PropertySort({ total }: PropertySortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') ?? 'newest';

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <p className="text-slate-600 font-inter text-sm">
        <span className="font-semibold text-navy-950">{total}</span>{' '}
        {total === 1 ? 'property' : 'properties'} found
      </p>

      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-gold-500 shrink-0" aria-hidden="true" />
        <label htmlFor="sort-select" className="text-sm font-inter text-slate-500 shrink-0">
          Sort by:
        </label>
        <select
          id="sort-select"
          value={currentSort}
          onChange={(e) => handleChange(e.target.value)}
          className="bg-white border border-sand-200 rounded-lg px-3 py-2 text-navy-950 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 cursor-pointer"
          aria-label="Sort properties"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
