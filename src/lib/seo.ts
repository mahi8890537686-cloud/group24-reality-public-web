import type { Metadata } from 'next';

const SITE_NAME = 'Group 24 Reality';
const SITE_URL = 'https://www.group24reality.com';
const DEFAULT_OG_IMAGE = '/og-image.jpg';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Group 24 Reality — Plots, Villas & Flats in Behror, Neemrana & Kotputli',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Group 24 Reality is a trusted real estate consultant in Behror, Neemrana, and Kotputli, Rajasthan. Find verified residential plots, villas, and flats with transparent pricing and expert local guidance. Contact Sunil Sangwan: +91-9560199247.',
  keywords: [
    'real estate in Behror',
    'plots for sale in Neemrana',
    'villas in Behror',
    'flats for sale in Kotputli',
    'residential plots near Neemrana',
    'property dealer in Behror',
    'investment property in Kotputli',
    'Group24 Realty',
    'property in Rajasthan',
    'buy plot Behror Neemrana',
  ],
  authors: [{ name: 'Group24 Realty' }],
  creator: 'Group24 Realty',
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_IN',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Group24 Realty — Plots, Villas & Flats in Rajasthan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Group24Realty',
    creator: '@Group24Realty',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export function buildMetadata(overrides: Partial<Metadata>): Metadata {
  return {
    ...defaultMetadata,
    ...overrides,
    openGraph: {
      ...(defaultMetadata.openGraph as object),
      ...(overrides.openGraph as object),
    },
  };
}

export { SITE_NAME, SITE_URL };
