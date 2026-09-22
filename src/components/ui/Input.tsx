'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, className, containerClassName, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      <label htmlFor={inputId} className="text-sm font-inter font-medium text-text">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'h-14 w-full rounded-input border border-border bg-surface px-4 text-[15px] font-inter text-text transition-colors placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold disabled:opacity-60 disabled:cursor-not-allowed',
          error && 'border-red-400 focus:ring-red-400 focus:border-red-400',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs font-inter text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});
