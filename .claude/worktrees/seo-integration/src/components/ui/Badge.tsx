import { cn } from '@/lib/utils';

type BadgeVariant = 'gold' | 'navy' | 'green' | 'sand' | 'red';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  gold: 'bg-gold/15 text-gold-dark border border-gold/30',
  navy: 'bg-ink text-surface',
  green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  sand: 'bg-bg-secondary text-text-secondary border border-border-subtle',
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
