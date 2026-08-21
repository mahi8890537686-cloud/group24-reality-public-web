'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building2, MapPin, Newspaper, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const bottomLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/properties', label: 'Properties', icon: Building2 },
  { href: '/locations', label: 'Locations', icon: MapPin },
  { href: '/blogs', label: 'Blogs', icon: Newspaper },
  { href: '/contact', label: 'Contact', icon: Phone },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function BottomNav() {
  const pathname = usePathname() ?? '/';

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-navy-950/95 backdrop-blur-md border-t border-white/10 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="flex items-stretch justify-between">
        {bottomLinks.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] text-[11px] font-inter transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-inset',
                  active ? 'text-gold-400' : 'text-white/60 active:text-white'
                )}
              >
                <Icon className={cn('w-5 h-5', active && 'fill-gold-400/20')} strokeWidth={active ? 2.25 : 2} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
