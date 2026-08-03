import type { Metadata } from 'next';
import { Suspense } from 'react';
import { properties } from '@/data/properties';
import type { Property, PropertyType, LocationKey, PropertyStatus, SortOption } from '@/types';
import PropertyGrid from '@/components/properties/PropertyGrid';
import PropertySort from '@/components/properties/PropertySort';
import PropertyFilters from '@/components/properties/PropertyFilters';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, JsonLd } from '@/lib/schema';

export const metadata: Metadata = buildMetadata({
  title: 'Properties for Sale in Behror, Neemrana & Kotputli | Group 24 Reality',
  description:
    'Browse verified plots, villas, and flats for sale in Behror, Neemrana, and Kotputli, Rajasthan. Filter by location, property type, and budget. Free site visits arranged by Group 24 Reality.',
  alternates: { canonical: 'https://www.group24reality.com/properties' },
  openGraph: { url: 'https://www.group24reality.com/properties' },
});

interface PageProps {
  searchParams: Promise<{
    location?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    status?: string;
    sort?: string;
  }>;
}

function filterAndSort(params: Awaited<PageProps['searchParams']>): Property[] {
  let result = [...properties];

  if (params.location && params.location !== 'all') {
    result = result.filter((p) => p.location === params.location);
  }
  if (params.type && params.type !== 'all') {
    result = result.filter((p) => p.type === params.type);
  }
  if (params.status && params.status !== 'all') {
    result = result.filter((p) => p.status === params.status);
  }
  if (params.minPrice) {
    result = result.filter((p) => p.price >= Number(params.minPrice));
  }
  if (params.maxPrice) {
    result = result.filter((p) => p.price <= Number(params.maxPrice));
  }
  if (params.bedrooms && params.bedrooms !== 'any') {
    const beds = Number(params.bedrooms);
    result = result.filter((p) =>
      beds >= 4 ? (p.bedrooms ?? 0) >= 4 : p.bedrooms === beds
    );
  }

  // Sort
  switch (params.sort as SortOption) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'area-asc':
      result.sort((a, b) => a.area - b.area);
      break;
    case 'area-desc':
      result.sort((a, b) => b.area - a.area);
      break;
    default:
      result.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
  }

  return result;
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filtered = filterAndSort(params);

  const activeLocation = params.location;
  const pageTitle = activeLocation
    ? `Properties in ${activeLocation.charAt(0).toUpperCase() + activeLocation.slice(1)}`
    : 'All Properties';

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Properties', url: '/properties' },
        ])}
      />

      {/* Hero Banner */}
      <div className="bg-navy-950 pt-28 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Group 24 Reality"
            heading={pageTitle}
            subheading="Verified plots, villas, and flats across Behror, Neemrana, and Kotputli. All listings physically checked by our team."
            light
            align="left"
          />
        </div>
      </div>

      {/* Listing Section */}
      <div className="bg-white py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Filters */}
          <Suspense>
            <PropertyFilters />
          </Suspense>

          {/* Sort + Count */}
          <Suspense>
            <PropertySort total={filtered.length} />
          </Suspense>

          {/* Grid */}
          <PropertyGrid properties={filtered} />
        </div>
      </div>
    </>
  );
}
