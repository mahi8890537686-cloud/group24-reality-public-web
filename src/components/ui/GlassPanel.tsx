import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

type GlassPanelVariant = 'standard' | 'strong';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: GlassPanelVariant;
}

const variants: Record<GlassPanelVariant, string> = {
  standard:
    'bg-white/78 backdrop-blur-[18px] border border-white/55 shadow-md',
  strong:
    'bg-[rgba(247,245,240,0.90)] backdrop-blur-[24px] border border-white/65 shadow-lg',
};

export function GlassPanel({ variant = 'standard', className, children, ...props }: GlassPanelProps) {
  return (
    <div className={cn('relative rounded-card', variants[variant], className)} {...props}>
      {children}
    </div>
  );
}
