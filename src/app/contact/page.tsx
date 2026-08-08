import type { Metadata } from 'next';
import ContactPageContent from './ContactPageContent';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, JsonLd } from '@/lib/schema';

export const metadata: Metadata = buildMetadata({
  title: 'Contact Us — Behror & Gurugram Office',
  description:
    'Get in touch with Group 24 Reality for plots, villas, and flats in Behror, Neemrana, and Kotputli. Call or WhatsApp Sunil Sangwan, or visit our Behror or Gurugram office.',
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
