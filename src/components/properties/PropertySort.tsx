'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';
import { Select } from '@/components/ui/Select';

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
        <span className="font-semibold text-ink">{total}</span>{' '}
        {total === 1 ? 'property' : 'properties'} found
      </p>

      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-gold-dark shrink-0 mb-1.5" aria-hidden="true" />
        <div className="w-48">
          <Select
            id="sort-select"
            label="Sort by"
            value={currentSort}
            onChange={(e) => handleChange(e.target.value)}
            options={SORT_OPTIONS}
          />
        </div>
      </div>
    </div>
  );
}
