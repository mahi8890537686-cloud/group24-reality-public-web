import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { WHATSAPP_HREF } from '@/lib/utils';

const footerLinks = {
  quickLinks: [
    { label: 'Home', href: '/' },
    { label: 'Properties', href: '/properties' },
    { label: 'Locations', href: '/locations' },
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
    { label: 'Behror Location Guide', href: '/locations#behror' },
    { label: 'Neemrana Location Guide', href: '/locations#neemrana' },
    { label: 'Kotputli Location Guide', href: '/locations#kotputli' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

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
                <span className="text-white font-playfair font-bold text-xl">Group 24</span>
                <span className="block text-gold-400 text-xs tracking-widest uppercase font-inter">
                  Reality
                </span>
              </div>
            </Link>
            <p className="text-white/60 text-sm font-inter leading-relaxed mb-6">
              Trusted real estate consultant in Behror, Neemrana, and Kotputli, Rajasthan.
              We help families and investors find verified plots, villas, and flats with
              transparent pricing and honest guidance. Contact: Sunil Sangwan.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { label: 'Facebook', href: 'https://www.facebook.com/group24reality', emoji: 'f' },
                { label: 'Instagram (@group24reality)', href: 'https://www.instagram.com/group24reality', emoji: 'in' },
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
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-gold-400 text-sm font-inter transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-400 rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {footerLinks.propertyTypes.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-gold-400 text-sm font-inter transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-400 rounded"
                  >
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
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-gold-400 text-sm font-inter transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-400 rounded"
                  >
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
              <li className="flex items-start gap-3 text-sm text-white/60 font-inter">
                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                <span>
                  Plot No. 6, Basai Enclave, Part 2,<br />
                  Sector 37C, Near Corona Optus,<br />
                  Gurugram, Haryana
                </span>
              </li>
              <li>
                <a
                  href="tel:+919560199247"
                  className="flex items-center gap-3 text-sm text-white/60 hover:text-gold-400 font-inter transition-colors"
                >
                  <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>+91-95601-99247 (Sunil Sangwan)</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@group24reality.com"
                  className="flex items-center gap-3 text-sm text-white/60 hover:text-gold-400 font-inter transition-colors"
                >
                  <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>info@group24reality.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/60 font-inter">
                <Clock className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                <span>Mon – Sat: 9:00 AM – 7:00 PM<br />Sunday: By Appointment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40 font-inter">
          <p>© {currentYear} Group 24 Reality. All rights reserved.</p>
          <p>
            Real Estate Consultant — Behror, Neemrana &amp; Kotputli, Rajasthan
          </p>
        </div>
      </div>
    </footer>
  );
}
