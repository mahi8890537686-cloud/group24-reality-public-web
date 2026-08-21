import type { Metadata } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import './globals.css';
import SiteShell from '@/components/layout/SiteShell';
import { localBusinessSchema, JsonLd } from '@/lib/schema';
import { defaultMetadata } from '@/lib/seo';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <head>
        <JsonLd data={localBusinessSchema()} />
      </head>
      <body className="font-inter antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
