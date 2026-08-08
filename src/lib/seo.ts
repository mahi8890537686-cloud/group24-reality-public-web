import type { Metadata } from 'next';

const SITE_NAME = 'Group 24 Reality';
const SITE_URL = 'https://www.group24reality.com';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Group 24 Reality — Plots, Villas & Flats in Behror, Neemrana & Kotputli',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Group 24 Reality is a trusted real estate consultant in Behror, Neemrana, and Kotputli, Rajasthan. Find verified residential plots, villas, and flats with transparent pricing and expert local guidance.',
  keywords: [
    'real estate in Behror',
    'plots for sale in Neemrana',
    'villas in Behror',
    'flats for sale in Kotputli',
    'residential plots near Neemrana',
    'property dealer in Behror',
    'investment property in Kotputli',
    'Group 24 Reality',
    'property in Rajasthan',
    'buy plot Behror Neemrana',
  ],
  authors: [{ name: 'Group 24 Reality' }],
  creator: 'Group 24 Reality',
  openGraph: {
    // No manual `images` here — app/opengraph-image.tsx (file-based convention)
    // supplies this automatically and takes priority over this object per Next's
    // metadata resolution order, so it must not be duplicated here.
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Group24Reality',
    creator: '@Group24Reality',
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
