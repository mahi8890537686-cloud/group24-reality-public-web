'use client';

import { cn } from '@/lib/utils';
import { SelectHTMLAttributes, forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: SelectOption[];
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, options, id, className, containerClassName, ...props },
  ref
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      <label htmlFor={selectId} className="text-sm font-inter font-medium text-text">
        {label}
      </label>
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'h-14 w-full appearance-none rounded-input border border-border bg-surface px-4 pr-10 text-[15px] font-inter text-text transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold disabled:opacity-60 disabled:cursor-not-allowed',
            error && 'border-red-400 focus:ring-red-400 focus:border-red-400',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
          aria-hidden="true"
        />
      </div>
      {error && (
        <p id={`${selectId}-error`} className="text-xs font-inter text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});
