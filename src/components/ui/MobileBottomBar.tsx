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
      <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 z-40 lg:hidden bg-ink/95 backdrop-blur-2xl border-t border-white/10 p-3 flex gap-3">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-inter font-bold py-3 rounded-xl text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
        <a
          href={scheduleHref}
          className="flex-1 flex items-center justify-center gap-2 bg-gold text-ink font-inter font-bold py-3 rounded-xl text-sm"
        >
          <CalendarCheck className="w-4 h-4" />
          {scheduleLabel}
        </a>
      </div>
    </>
  );
}
