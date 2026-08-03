import { cn } from '@/lib/utils';

type BadgeVariant = 'gold' | 'navy' | 'green' | 'sand' | 'red';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  gold: 'bg-gold-400/15 text-gold-500 border border-gold-400/30',
  navy: 'bg-navy-950 text-white',
  green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  sand: 'bg-sand-100 text-navy-800 border border-sand-200',
  red: 'bg-red-50 text-red-700 border border-red-200',
};

export function Badge({
  children,
  variant = 'gold',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-inter font-semibold tracking-wide uppercase',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
