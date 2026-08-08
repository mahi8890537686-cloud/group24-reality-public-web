import { cn } from '@/lib/utils';
import { TextareaHTMLAttributes, forwardRef, useId } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, id, className, rows = 4, ...props }, ref) {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={textareaId} className="text-sm font-inter font-medium text-text">
          {label}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            'w-full resize-none rounded-input border border-border bg-surface px-4 py-3 text-[15px] font-inter text-text transition-colors placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold disabled:opacity-60 disabled:cursor-not-allowed',
            error && 'border-red-400 focus:ring-red-400 focus:border-red-400',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="text-xs font-inter text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);
