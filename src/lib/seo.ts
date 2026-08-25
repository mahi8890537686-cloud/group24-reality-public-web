import type { Metadata } from 'next';

const SITE_NAME = 'Group 24 Reality';
const SITE_URL = 'https://www.group24reality.com';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Group 24 Reality — Real Estate in Behror, Neemrana & Kotputli',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Trusted real estate consultant in Behror, Neemrana, and Kotputli, Rajasthan. Verified plots, villas, and flats with transparent pricing.',
  keywords: [
    // Location × type combinations (match the exact-match landing pages)
    'plots for sale in Behror',
    'plots for sale in Neemrana',
    'plots for sale in Kotputli',
    'villas for sale in Behror',
    'villas for sale in Neemrana',
    'villas for sale in Kotputli',
    'flats for sale in Behror',
    'flats for sale in Neemrana',
    'flats for sale in Kotputli',
    // Broader intent keywords
    'real estate in Behror',
    'residential plots near Neemrana',
    'property dealer in Behror',
    'investment property Rajasthan NH-48',
    'buy plot Behror Neemrana Kotputli',
    'Group 24 Reality',
    'property in Rajasthan',
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

/**
 * Trims free-form text (property/blog titles, generated descriptions) to a
 * search-engine-friendly length, cutting at the nearest word boundary
 * instead of mid-word. The root layout's title template appends
 * " | Group 24 Reality" (~19 chars) to every non-homepage page title, so
 * dynamic titles should target ~40 chars to land the rendered title near
 * Google's ~60-char display cutoff.
 */
export function trimForSeo(text: string, maxLen: number, ellipsis = false): string {
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  const trimmed = (lastSpace > maxLen * 0.5 ? cut.slice(0, lastSpace) : cut).trim();
  return ellipsis ? `${trimmed}...` : trimmed;
}

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
