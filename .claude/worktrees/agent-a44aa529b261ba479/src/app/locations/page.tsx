import type { Metadata } from 'next';
import Link from 'next/link';
import LocationSection from '@/components/locations/LocationSection';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeInUp } from '@/components/ui/MotionWrapper';
import { getAllLocations } from '@/lib/firestore/locations';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, JsonLd } from '@/lib/schema';

export const metadata: Metadata = buildMetadata({
  title: 'Real Estate in Behror, Neemrana & Kotputli',
  description:
    'Explore real estate markets in Behror, Neemrana, and Kotputli on the Delhi–Jaipur NH-48 corridor — investment potential, local infrastructure, and verified plots, villas & flats in each location.',
  alternates: { canonical: 'https://www.group24reality.com/locations' },
  openGraph: { url: 'https://www.group24reality.com/locations' },
});

export default async function LocationsPage() {
  const locations = await getAllLocations().catch(() => []);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Locations', url: '/locations' },
        ])}
      />

      {/* Header */}
      <div className="bg-navy-950 pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <SectionHeader
              headingAs="h1"
              eyebrow="Where We Operate"
              heading="Real Estate in Behror, Neemrana & Kotputli"
              subheading="Three of Rajasthan's most promising real estate markets — all on the Delhi–Jaipur NH-48 corridor. Discover investment potential, local infrastructure, and property options in each location."
              light
            />
          </FadeInUp>

          {/* Location nav pills */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {locations.map((loc) => (
              <Link
                key={loc.id ?? loc.slug}
                href={`/locations/${loc.slug}`}
                className="bg-white/10 hover:bg-gold-400 hover:text-navy-950 border border-white/20 hover:border-gold-400 text-white font-inter font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
              >
                {loc.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Location Sections with alternating background */}
      {locations.map((loc, i) => (
        <div key={loc.id ?? loc.slug} className={i % 2 === 0 ? 'bg-white' : 'bg-sand-50'}>
          <LocationSection location={loc} />
        </div>
      ))}
    </>
  );
}
