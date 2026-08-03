import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFAB from '@/components/layout/WhatsAppFAB';
import { localBusinessSchema, JsonLd } from '@/lib/schema';
import { defaultMetadata } from '@/lib/seo';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <JsonLd data={localBusinessSchema()} />
      </head>
      <body className="font-inter antialiased">
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <WhatsAppFAB />

        {/* Skip to main content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:bg-gold-400 focus:text-navy-950 focus:px-4 focus:py-2 focus:rounded-lg focus:font-inter focus:font-semibold"
        >
          Skip to main content
        </a>
      </body>
    </html>
  );
}
