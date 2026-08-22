import type { Metadata } from 'next';
import ContactPageContent from './ContactPageContent';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, JsonLd } from '@/lib/schema';

export const metadata: Metadata = buildMetadata({
  title: 'Contact Us — Behror & Gurugram Office',
  description:
    'Get in touch for plots, villas & flats in Behror, Neemrana & Kotputli. Call or WhatsApp Sunil Sangwan, or visit our Behror office.',
  alternates: { canonical: 'https://www.group24reality.com/contact' },
  openGraph: { url: 'https://www.group24reality.com/contact' },
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' },
        ])}
      />
      <ContactPageContent />
    </>
  );
}
