import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllProperties } from '@/lib/firestore/properties';
import { getLocationBySlug } from '@/lib/firestore/locations';
import type { SortOption } from '@/types';
import PropertyGrid from '@/components/properties/PropertyGrid';
import PropertySort from '@/components/properties/PropertySort';
import PropertyFilters from '@/components/properties/PropertyFilters';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Loader2 } from 'lucide-react';
import { buildMetadata, SITE_URL } from '@/lib/seo';
import { breadcrumbSchema, itemListSchema, JsonLd } from '@/lib/schema';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const TYPE_LABELS: Record<string, string> = {
  plot: 'Plots',
  villa: 'Villas',
  flat: 'Flats',
};

function firstParam(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const locationSlug = firstParam(params.location);
  const type = firstParam(params.type);

  const location = locationSlug ? await getLocationBySlug(locationSlug) : undefined;
  const typeLabel = type ? TYPE_LABELS[type] : undefined;

  let title = 'All Properties — Plots, Villas & Flats';
  let description =
    'Browse verified residential plots, villas, and flats for sale in Behror, Neemrana, and Kotputli, Rajasthan. Transparent pricing, physically verified listings.';

  if (location && typeLabel) {
    title = `${typeLabel} for Sale in ${location.name}`;
    description = `${typeLabel} for sale in ${location.name}, Rajasthan. ${location.description.slice(0, 120)}...`;
  } else if (location) {
    title = `Properties in ${location.name} — Plots, Villas & Flats`;
    description = `Verified plots, villas, and flats for sale in ${location.name}, Rajasthan. ${location.description.slice(0, 120)}...`;
  } else if (typeLabel) {
    title = `${typeLabel} for Sale in Behror, Neemrana & Kotputli`;
    description = `Verified ${typeLabel.toLowerCase()} for sale across Behror, Neemrana, and Kotputli, Rajasthan. Transparent pricing, physically verified listings.`;
  }

  // Only the location + type facets are meaningfully distinct for search intent;
  // price/bedrooms/status/sort are refinements that should collapse back to the
  // parent filtered URL rather than being indexed as separate pages.
  const canonicalParams = new URLSearchParams();
  if (locationSlug) canonicalParams.set('location', locationSlug);
  if (type) canonicalParams.set('type', type);
  const canonicalQuery = canonicalParams.toString();
  const canonical = `${SITE_URL}/properties${canonicalQuery ? `?${canonicalQuery}` : ''}`;

  return buildMetadata({
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
  });
}

async function PropertyResults({ searchParams }: PageProps) {
  const params = await searchParams;
  const location = firstParam(params.location);
  const type = firstParam(params.type);
  const minPrice = firstParam(params.minPrice);
  const maxPrice = firstParam(params.maxPrice);
  const bedrooms = firstParam(params.bedrooms);
  const status = firstParam(params.status);
  const sort = firstParam(params.sort) as SortOption | undefined;

  const properties = await getAllProperties({
    locationSlug: location,
    type,
    status,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    bedrooms: bedrooms && bedrooms !== 'any' ? Number(bedrooms) : undefined,
    sort,
  }).catch(() => []);

  const locationData = location ? await getLocationBySlug(location) : undefined;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Properties', url: '/properties' },
        ])}
      />
      {properties.length > 0 && <JsonLd data={itemListSchema(properties)} />}

      {/* Hero Banner */}
      <div className="bg-navy-950 pt-28 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            headingAs="h1"
            eyebrow="Group 24 Reality"
            heading={locationData ? `Properties in ${locationData.name}` : 'All Properties'}
            subheading="Verified plots, villas, and flats across Behror, Neemrana, and Kotputli. All listings physically checked by our team."
            light
            align="left"
          />
        </div>
      </div>

      {/* Listing Section */}
      <div className="bg-white py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Suspense fallback={<div className="h-[74px]" />}>
            <PropertyFilters />
          </Suspense>
          <Suspense fallback={<div className="h-6" />}>
            <PropertySort total={properties.length} />
          </Suspense>
          <PropertyGrid properties={properties} />
        </div>
      </div>
    </>
  );
}

export default function PropertiesPage({ searchParams }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-gold-500 animate-spin" />
        </div>
      }
    >
      <PropertyResults searchParams={searchParams} />
    </Suspense>
  );
}
