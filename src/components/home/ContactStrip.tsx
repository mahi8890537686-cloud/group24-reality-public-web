'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle } from 'lucide-react';
import { getSiteConfig, buildWhatsAppLink, DEFAULT_SITE_CONFIG } from '@/lib/firestore/siteConfig';
import type { SiteConfig } from '@/types';

export default function ContactStrip() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);

  useEffect(() => {
    getSiteConfig()
      .then(setConfig)
      .catch(() => { /* keep default */ });
  }, []);

  const waLink = buildWhatsAppLink(
    config,
    'Hello Sunil ji, I am interested in properties in Behror/Neemrana/Kotputli. Please share details.'
  );

  return (
    <section
      className="py-16 sm:py-20 bg-bg relative overflow-hidden"
      aria-labelledby="contact-strip-heading"
    >
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-gold-soft rounded-2xl p-8 sm:p-12 shadow-sm border border-gold/30">
          <h2
            id="contact-strip-heading"
            className="font-serif text-ink text-3xl sm:text-4xl lg:text-5xl mb-4"
          >
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-ink/70 font-inter text-base sm:text-lg mb-10 max-w-2xl mx-auto">
            Talk to {config.contactPerson} — our local property expert in Behror, Neemrana, and
            Kotputli. Free consultation, no pressure.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
            <a
              href={config.phoneHref}
              className="group flex items-center gap-3 bg-gold hover:bg-gold-dark text-ink font-inter font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-gold/30 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold text-base min-w-56"
            >
              <Phone className="w-5 h-5" />
              <div className="text-left">
                <div className="text-xs font-medium opacity-70 leading-none mb-0.5">Call Now</div>
                <div className="leading-none">{config.phone}</div>
              </div>
            </a>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-gold hover:bg-gold-dark text-ink font-inter font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-gold/30 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold text-base min-w-56"
            >
              <MessageCircle className="w-5 h-5" />
              <div className="text-left">
                <div className="text-xs font-medium opacity-70 leading-none mb-0.5">WhatsApp</div>
                <div className="leading-none">Chat with Us</div>
              </div>
            </a>

            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 border-2 border-ink/30 hover:border-ink text-ink font-inter font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:bg-ink/5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink text-base"
            >
              Send an Enquiry
            </Link>
          </div>

          <p className="mt-8 text-ink/45 text-xs font-inter">
            {config.businessHoursWeekday} · {config.businessHoursWeekend} · We respond within 2 hours
          </p>
        </div>
      </div>
    </section>
  );
}
