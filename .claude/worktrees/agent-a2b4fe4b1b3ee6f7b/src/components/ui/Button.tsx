import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef } from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton
  extends BaseButtonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> {
  href?: undefined;
  asChild?: false;
}

interface ButtonAsLink
  extends BaseButtonProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> {
  href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-ink hover:bg-charcoal text-surface shadow-sm hover:shadow-md',
  secondary:
    'bg-transparent border border-border text-text hover:bg-bg-secondary',
  outline:
    'border-2 border-white/30 text-white hover:border-white hover:bg-white/10',
  ghost: 'text-white/80 hover:text-white hover:bg-white/10',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm h-12',
  md: 'px-6 py-3 text-base h-12 sm:h-13',
  lg: 'px-8 py-4 text-lg h-14',
};

const base =
  'inline-flex items-center justify-center gap-2 font-inter font-semibold rounded-button transition-all duration-200 active:scale-[0.97] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  { variant = 'primary', size = 'md', className, children, href, ...props },
  ref
) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
});
