'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { cn, PHONE_HREF, PHONE_NUMBER } from '@/lib/utils';

const navLinks = [
  { href: '/properties', label: 'Properties' },
  { href: '/locations', label: 'Locations' },
  { href: '/about', label: 'About' },
  { href: '/blogs', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState<string | null>(null);
  const pathname = usePathname();

  // Only the homepage has a dark hero — all other pages need a solid navbar immediately
  const isHeroPage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMobileOpen(false);
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled || !isHeroPage
            ? 'bg-ink/98 backdrop-blur-md shadow-lg shadow-black/25 border-b border-white/5'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-md"
              aria-label="Group24 Reality — Home"
            >
              {/* Logo placeholder — replace with your logo image */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                  <span className="text-ink text-sm font-serif tracking-tight">
                    G24R
                  </span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-white font-serif text-lg leading-none tracking-tight">
                    Group 24
                  </span>
                  <span className="block text-gold text-xs font-inter tracking-widest uppercase leading-none">
                    Reality
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-md text-sm font-inter font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                    pathname === link.href
                      ? 'text-gold bg-white/5'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={PHONE_HREF}
                className="flex items-center gap-2 text-white/80 hover:text-gold transition-colors text-sm font-inter focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-md px-2 py-1"
                aria-label={`Call Group24 Reality at ${PHONE_NUMBER}`}
              >
                <Phone className="w-4 h-4" />
                <span>{PHONE_NUMBER}</span>
              </a>
              <Link
                href="/contact"
                className="bg-gold hover:bg-gold-dark text-ink font-inter font-semibold text-sm px-5 py-2.5 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-gold/25 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Schedule a Site Visit
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-expanded={isMobileOpen}
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[55] bg-ink/98 backdrop-blur-md pt-16 pb-20 overflow-y-auto lg:hidden"
          >
            <nav
              className="flex flex-col p-6 gap-2"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'block px-4 py-3 rounded-xl text-lg font-inter font-medium transition-all duration-200',
                      pathname === link.href
                        ? 'text-gold bg-gold/10'
                        : 'text-white hover:text-gold hover:bg-white/5'
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-3">
                <a
                  href={PHONE_HREF}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:text-gold hover:bg-white/5 transition-all font-inter"
                >
                  <Phone className="w-5 h-5 text-gold" />
                  <span>{PHONE_NUMBER}</span>
                </a>
                <Link
                  href="/contact"
                  className="text-center bg-gold hover:bg-gold-dark text-ink font-semibold py-3 px-6 rounded-xl transition-all"
                >
                  Schedule a Site Visit
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
