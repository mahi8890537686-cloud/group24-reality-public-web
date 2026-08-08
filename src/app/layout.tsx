import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import SiteShell from '@/components/layout/SiteShell';
import { localBusinessSchema, JsonLd } from '@/lib/schema';
import { defaultMetadata } from '@/lib/seo';
import { Analytics } from '@vercel/analytics/next';

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
        <SiteShell>{children}</SiteShell>
        <Analytics />
      </body>
    </html>
  );
}
