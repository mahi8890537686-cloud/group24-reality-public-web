import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  id?: string;
  eyebrow?: string;
  heading: string;
  subheading?: string;
  align?: 'left' | 'center';
  light?: boolean;
  className?: string;
  headingAs?: 'h1' | 'h2' | 'h3';
}

export function SectionHeader({
  id,
  eyebrow,
  heading,
  subheading,
  align = 'center',
  light = false,
  className,
  headingAs: HeadingTag = 'h2',
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        align === 'left' && 'text-left',
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            'text-xs font-inter font-semibold tracking-widest uppercase mb-3',
            light ? 'text-gold-400' : 'text-gold-500'
          )}
        >
          {eyebrow}
        </p>
      )}
      <HeadingTag
        id={id}
        className={cn(
          'font-playfair font-bold leading-tight',
          light ? 'text-white' : 'text-navy-950',
          'text-3xl sm:text-4xl lg:text-5xl'
        )}
      >
        {heading}
      </HeadingTag>
      {subheading && (
        <p
          className={cn(
            'mt-4 text-base sm:text-lg font-inter leading-relaxed',
            light ? 'text-white/70' : 'text-slate-600'
          )}
        >
          {subheading}
        </p>
      )}
    </div>
  );
}
