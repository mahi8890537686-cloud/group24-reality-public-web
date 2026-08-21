'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, CalendarCheck } from 'lucide-react';
import { getSiteConfig, buildWhatsAppLink, DEFAULT_SITE_CONFIG } from '@/lib/firestore/siteConfig';

interface MobileBottomBarProps {
  whatsappMessage: string;
  scheduleHref: string;
  scheduleLabel?: string;
}

export function MobileBottomBar({
  whatsappMessage,
  scheduleHref,
  scheduleLabel = 'Schedule Visit',
}: MobileBottomBarProps) {
  const [waHref, setWaHref] = useState(() => buildWhatsAppLink(DEFAULT_SITE_CONFIG, whatsappMessage));

  useEffect(() => {
    getSiteConfig()
      .then((config) => setWaHref(buildWhatsAppLink(config, whatsappMessage)))
      .catch(() => { /* keep default */ });
  }, [whatsappMessage]);

  return (
    <>
      <div className="h-[calc(4rem+3.5rem+env(safe-area-inset-bottom))] lg:hidden" aria-hidden="true" />
      <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 z-40 lg:hidden bg-surface/95 backdrop-blur-2xl border-t border-border-subtle p-3 flex gap-3 shadow-md">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Group24 Reality on WhatsApp"
          className="flex-1 flex items-center justify-center gap-2 bg-gold/15 border border-gold/40 text-text hover:bg-gold/25 font-inter font-bold py-3 min-h-[48px] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
        >
          <MessageCircle className="w-4 h-4 text-gold-dark" />
          WhatsApp
        </a>
        <a
          href={scheduleHref}
          className="flex-1 flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-ink font-inter font-bold py-3 min-h-[48px] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
        >
          <CalendarCheck className="w-4 h-4" />
          {scheduleLabel}
        </a>
      </div>
    </>
  );
}
