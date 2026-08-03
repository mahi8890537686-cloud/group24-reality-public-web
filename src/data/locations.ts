import type { LocationData } from '@/types';

/**
 * DEMO DATA — Location metadata for Behror, Neemrana, and Kotputli.
 */
export const locations: LocationData[] = [
  {
    key: 'behror',
    name: 'Behror',
    tagline: 'The Rising Town of Alwar on the Delhi–Jaipur Highway',
    description:
      'Behror is a rapidly growing town in Alwar district, Rajasthan, strategically located on the Delhi–Jaipur National Highway 48. With excellent road connectivity, a growing commercial presence, and proximity to the RIICO industrial belt, Behror has emerged as a sought-after destination for residential and investment property in northern Rajasthan.',
    investmentPoints: [
      'Direct NH-48 connectivity between Delhi and Jaipur',
      'Rising land values driven by RIICO industrial expansion',
      'Developing social infrastructure: schools, hospitals, markets',
      'Strong demand for residential plots from industrial workforce',
      'Affordable entry price compared to Gurugram and Bhiwadi',
    ],
    connectivity: [
      'Delhi (120 km via NH-48)',
      'Jaipur (130 km via NH-48)',
      'Rewari Haryana (20 km)',
      'Neemrana (30 km)',
      'Kotputli (55 km)',
    ],
    infrastructure: [
      'RIICO Industrial Area Behror',
      'Government District Hospital',
      'DPS Behror School',
      'City commercial market',
      'Multiple banks and ATMs',
    ],
    image:
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80',
    propertyTypes: ['plot', 'villa', 'flat'],
    seoKeywords: [
      'real estate in Behror',
      'property dealer in Behror',
      'plots for sale in Behror',
      'villas in Behror',
      'residential plots near Behror',
      'buy property in Behror Rajasthan',
    ],
  },
  {
    key: 'neemrana',
    name: 'Neemrana',
    tagline: 'Rajasthan\'s Premier Industrial & Heritage Investment Hub',
    description:
      'Neemrana is one of the most prominent investment destinations in Rajasthan, home to the largest Japanese industrial zone in India outside of major metros. Located on NH-48 and forming part of the Delhi–Mumbai Industrial Corridor (DMIC), Neemrana attracts both Indian and foreign investors, driving exceptional real estate demand in the region.',
    investmentPoints: [
      'Largest Japanese Industrial Cluster in Rajasthan',
      'Delhi–Mumbai Industrial Corridor (DMIC) influence zone',
      'High rental yields from corporate executives and expats',
      'Heritage tourism from Neemrana Fort draws steady visitors',
      '90 minutes from IGI Airport, Delhi',
    ],
    connectivity: [
      'Delhi (90 km via NH-48)',
      'IGI Airport (100 km)',
      'Behror (30 km)',
      'Gurugram (75 km)',
      'Jaipur (145 km)',
    ],
    infrastructure: [
      'Japanese Industrial Zone (RIICO Phase I–IV)',
      'DMIC Shahjahanpur Smart City Node',
      'Neemrana Fort Palace (Tourism & Heritage)',
      'Leading private schools',
      'Multi-specialty hospitals',
    ],
    image:
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
    propertyTypes: ['plot', 'villa', 'flat'],
    seoKeywords: [
      'plots for sale in Neemrana',
      'residential plots near Neemrana',
      'property in Neemrana Rajasthan',
      'real estate investment Neemrana',
      'villas in Neemrana',
      'flats in Neemrana',
    ],
  },
  {
    key: 'kotputli',
    name: 'Kotputli',
    tagline: 'The Gateway to Jaipur — Affordable Growth on NH-48',
    description:
      'Kotputli sits at the crossroads of Rajasthan and Haryana on National Highway 48, serving as the northern gateway to Jaipur. With Jaipur just 55 km away and excellent rail and road connectivity, Kotputli is witnessing rapid urbanisation. Its RIICO industrial estate and strong agricultural trade ensure a balanced local economy with solid real estate fundamentals.',
    investmentPoints: [
      'Only 55 km from Jaipur on NH-48',
      'Growing RIICO industrial estate creating workforce housing demand',
      'Most affordable property prices in the NH-48 corridor',
      'Kotputli–Behror new district formation boosting infrastructure investment',
      'Active agricultural trade supports local economy',
    ],
    connectivity: [
      'Jaipur (55 km via NH-48)',
      'Delhi (175 km via NH-48)',
      'Behror (55 km)',
      'Neemrana (85 km)',
      'Kotputli Railway Station (passenger & freight)',
    ],
    infrastructure: [
      'RIICO Industrial Area Kotputli',
      'Kotputli Government Hospital',
      'Engineering & Polytechnic Colleges',
      'Active grain and vegetable mandi',
      'Expanding commercial market area',
    ],
    image:
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e3?w=800&q=80',
    propertyTypes: ['plot', 'villa', 'flat'],
    seoKeywords: [
      'flats for sale in Kotputli',
      'plots for sale in Kotputli',
      'investment property in Kotputli',
      'real estate in Kotputli Rajasthan',
      'affordable plots near Jaipur',
      'property dealer in Kotputli',
    ],
  },
];

export const locationMap: Record<string, LocationData> = Object.fromEntries(
  locations.map((l) => [l.key, l])
);
