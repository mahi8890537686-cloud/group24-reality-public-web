import type { MetadataRoute } from 'next';
import { SITE_NAME } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Plots, Villas & Flats in Behror, Neemrana & Kotputli`,
    short_name: SITE_NAME,
    description:
      'Trusted real estate consultant in Behror, Neemrana, and Kotputli, Rajasthan. Verified residential plots, villas, and flats with transparent pricing.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B1629',
    theme_color: '#0B1629',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
  };
}
