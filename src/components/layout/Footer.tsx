'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { getSiteConfig, DEFAULT_SITE_CONFIG } from '@/lib/firestore/siteConfig';
import type { SiteConfig } from '@/types';

const footerLinks = {
  quickLinks: [
    { label: 'Home', href: '/' },
    { label: 'Properties', href: '/properties' },
    { label: 'Locations', href: '/locations' },
    { label: 'Blogs & Articles', href: '/blogs' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  propertyTypes: [
    { label: 'Plots for Sale', href: '/properties?type=plot' },
    { label: 'Villas', href: '/properties?type=villa' },
    { label: 'Flats / Apartments', href: '/properties?type=flat' },
  ],
  locations: [
    { label: 'Properties in Behror', href: '/properties?location=behror' },
    { label: 'Properties in Neemrana', href: '/properties?location=neemrana' },
    { label: 'Properties in Kotputli', href: '/properties?location=kotputli' },
    { label: 'Behror Location Guide', href: '/locations/behror' },
    { label: 'Neemrana Location Guide', href: '/locations/neemrana' },
    { label: 'Kotputli Location Guide', href: '/locations/kotputli' },
  ],
};

export default function Footer() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    getSiteConfig()
      .then(setConfig)
      .catch(() => { /* keep default */ });
  }, []);

  return (
    <footer
      className="bg-navy-950 text-white pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:pb-0"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">Footer</h2>

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-lg bg-gold-400 flex items-center justify-center">
                <span className="text-navy-950 font-bold font-playfair text-sm">G24R</span>
              </div>
              <div>
                <span className="text-white font-playfair font-bold text-xl">{config.businessName}</span>
                <span className="block text-gold-400 text-xs tracking-widest uppercase font-inter">
                  Reality
                </span>
              </div>
            </Link>
            <p className="text-white/60 text-sm font-inter leading-relaxed mb-6">
              Trusted real estate consultant in Behror, Neemrana, and Kotputli, Rajasthan.
              Verified plots, villas, and flats with transparent pricing and honest guidance.
              Contact: {config.contactPerson}.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { label: 'Facebook', href: config.facebookUrl, emoji: 'f' },
                { label: `Instagram (${config.instagramHandle})`, href: config.instagramUrl, emoji: 'in' },
              ].map(({ label, href, emoji }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-gold-400/20 hover:text-gold-400 flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 text-white text-xs font-bold font-inter"
                >
                  {emoji}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-playfair font-semibold text-white mb-5 text-base">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 hover:text-gold-400 text-sm font-inter transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-400 rounded">
                    {link.label}
                  </Link>
                </li>
              ))}
              {footerLinks.propertyTypes.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 hover:text-gold-400 text-sm font-inter transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-400 rounded">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="font-playfair font-semibold text-white mb-5 text-base">Locations</h3>
            <ul className="space-y-3">
              {footerLinks.locations.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 hover:text-gold-400 text-sm font-inter transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-400 rounded">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-playfair font-semibold text-white mb-5 text-base">Contact Us</h3>
            <ul className="space-y-4">

              {/* Phone 1 */}
              <li>
                <a href={config.phoneHref} className="flex items-center gap-3 text-sm text-white/60 hover:text-gold-400 font-inter transition-colors">
                  <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{config.phone}</span>
                </a>
              </li>

              {/* Phone 2 (if present) */}
              {config.phone2 && config.phone2Href && (
                <li>
                  <a href={config.phone2Href} className="flex items-center gap-3 text-sm text-white/60 hover:text-gold-400 font-inter transition-colors">
                    <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                    <span>{config.phone2}</span>
                  </a>
                </li>
              )}

              {/* Email */}
              <li>
                <a href={`mailto:${config.email}`} className="flex items-center gap-3 text-sm text-white/60 hover:text-gold-400 font-inter transition-colors">
                  <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{config.email}</span>
                </a>
              </li>

              {/* Main Office */}
              <li className="flex items-start gap-3 text-sm text-white/60 font-inter">
                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                <span>
                  <span className="text-gold-400/80 text-xs font-semibold uppercase tracking-wide block mb-0.5">
                    {config.mainOfficeLabel}
                  </span>
                  {config.mainOfficeAddress.split('\n').map((line, i) => (
                    <span key={i}>{line}{i < config.mainOfficeAddress.split('\n').length - 1 && <br />}</span>
                  ))}
                </span>
              </li>

              {/* Head Office */}
              <li className="flex items-start gap-3 text-sm text-white/60 font-inter">
                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                <span>
                  <span className="text-gold-400/80 text-xs font-semibold uppercase tracking-wide block mb-0.5">
                    {config.headOfficeLabel}
                  </span>
                  {config.headOfficeAddress.split('\n').map((line, i) => (
                    <span key={i}>{line}{i < config.headOfficeAddress.split('\n').length - 1 && <br />}</span>
                  ))}
                </span>
              </li>

              {/* Hours */}
              <li className="flex items-start gap-3 text-sm text-white/60 font-inter">
                <Clock className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                <span>{config.businessHoursWeekday}<br />{config.businessHoursWeekend}</span>
              </li>

            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40 font-inter">
          <p>© {currentYear} {config.businessName}. All rights reserved.</p>
          <p>Real Estate Consultant — Behror, Neemrana &amp; Kotputli, Rajasthan</p>
        </div>
      </div>
    </footer>
  );
}
