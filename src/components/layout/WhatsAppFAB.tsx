'use client';

import { motion } from 'framer-motion';
import { whatsappLink } from '@/lib/utils';

export default function WhatsAppFAB() {
  const message =
    'Hello Group24 Realty, I am interested in properties in Behror/Neemrana/Kotputli. Please share details.';

  return (
    <motion.a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Group24 Realty on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/40 flex items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/50"
    >
      {/* WhatsApp SVG Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-8 h-8 fill-white"
        aria-hidden="true"
      >
        <path d="M16 2C8.28 2 2 8.28 2 16c0 2.46.65 4.76 1.79 6.76L2 30l7.44-1.95A13.93 13.93 0 0016 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.5c-2.2 0-4.27-.6-6.05-1.64l-.43-.26-4.42 1.16 1.18-4.31-.28-.45A11.48 11.48 0 014.5 16c0-6.34 5.16-11.5 11.5-11.5S27.5 9.66 27.5 16 22.34 27.5 16 27.5zm6.3-8.62c-.34-.17-2.02-1-2.33-1.11-.31-.11-.54-.17-.77.17-.23.34-.88 1.11-1.08 1.34-.2.23-.39.26-.73.09-.34-.17-1.45-.53-2.76-1.7-1.02-.91-1.71-2.03-1.91-2.37-.2-.34-.02-.52.15-.69.16-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.77-1.86-1.06-2.55-.28-.67-.56-.58-.77-.59H9.5c-.2 0-.51.07-.78.37-.27.3-1.02 1-.02 2.86 1 1.86 3.63 5.32 8.67 7.27 1.21.42 2.16.67 2.9.86 1.22.3 2.33.26 3.21.16.98-.12 3.02-1.23 3.44-2.43.43-1.2.43-2.22.3-2.43-.12-.2-.44-.31-.78-.49z" />
      </svg>

      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
    </motion.a>
  );
}
