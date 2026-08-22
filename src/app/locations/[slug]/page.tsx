import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getAllLocations, getLocationBySlug } from '@/lib/firestore/locations';
import { getAllProperties } from '@/lib/firestore/properties';
import LocationSection from '@/components/locations/LocationSection';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeInUp } from '@/components/ui/MotionWrapper';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, itemListSchema, faqPageSchema, JsonLd } from '@/lib/schema';
import { LOCATION_FAQS, buildFallbackFaqs } from '@/lib/locationFaqs';

const PREVIEW_COUNT = 6;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const locations = await getAllLocations();
    return locations.map((loc) => ({ slug: loc.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);
  if (!location) notFound();

  const title = `Real Estate in ${location.name}, Rajasthan`;
  const description = `${location.investmentPoints[0]} — explore verified plots, villas & flats for sale in ${location.name}, Rajasthan with Group 24 Reality.`;

  return buildMetadata({
    title,
    description,
    keywords: location.seoKeywords,
    openGraph: {
      title,
      description,
      images: [{ url: location.coverImage, width: 1200, height: 630, alt: `Real estate in ${location.name}, Rajasthan` }],
      url: `https://www.group24reality.com/locations/${location.slug}`,
    },
    alternates: { canonical: `https://www.group24reality.com/locations/${location.slug}` },
  });
}

export default async function LocationDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch location + available properties in parallel
  const [location, allAvailable] = await Promise.all([
    getLocationBySlug(slug),
    getAllProperties({ locationSlug: slug, status: 'available' }).catch(() => []),
  ]);

  if (!location) notFound();

  const previewProperties = allAvailable.slice(0, PREVIEW_COUNT);
  const totalAvailable = allAvailable.length;
  const faqs = LOCATION_FAQS[location.slug] ?? buildFallbackFaqs(location);

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Locations', url: '/locations' },
        { name: location.name, url: `/locations/${location.slug}` },
      ])} />
      {previewProperties.length > 0 && <JsonLd data={itemListSchema(previewProperties)} />}
      <JsonLd data={faqPageSchema(faqs)} />

      {/* Hero header */}
      <div className="bg-bg pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm font-inter text-ink/60">
              <li><Link href="/" className="hover:text-ink transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/locations" className="hover:text-ink transition-colors">Locations</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-ink font-medium">{location.name}</li>
            </ol>
          </nav>
          <FadeInUp>
            <SectionHeader
              headingAs="h1"
              eyebrow={`Real Estate in ${location.name}, Rajasthan`}
              heading={location.tagline}
              align="left"
            />
          </FadeInUp>
        </div>
      </div>

      {/* Location detail + inline property preview */}
      <div className="bg-bg">
        <LocationSection location={location} properties={previewProperties} />
      </div>

      {/* FAQ */}
      <div className="bg-bg border-t border-border-subtle py-16 sm:py-24" aria-labelledby="location-faq-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp className="mb-12">
            <SectionHeader
              id="location-faq-heading"
              eyebrow="Common Questions"
              heading={`Frequently Asked Questions About ${location.name}`}
              subheading={`Straight answers about buying property in ${location.name}, Rajasthan. Still have a question? Call us — we're happy to help.`}
            />
          </FadeInUp>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group border border-border-subtle rounded-xl overflow-hidden bg-gold-soft [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="list-none w-full flex items-start justify-between gap-4 px-6 py-5 text-left cursor-pointer hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold">
                  <span className="font-serif text-ink text-base leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className="w-5 h-5 text-gold-dark shrink-0 mt-0.5 transition-transform duration-300 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-ink/65 text-sm font-inter leading-relaxed border-t border-border-subtle pt-4">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Single bottom CTA */}
      {totalAvailable > 0 && (
        <div className="bg-bg border-t border-border-subtle py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-inter text-ink/70 text-sm">
              <span className="font-semibold text-ink">{totalAvailable}</span> verified{' '}
              {totalAvailable === 1 ? 'property' : 'properties'} listed in {location.name}.
              {totalAvailable > PREVIEW_COUNT && ` ${PREVIEW_COUNT} shown above.`}
            </p>
            <Link
              href={`/properties?location=${location.slug}`}
              className="group inline-flex items-center gap-2 bg-gold-soft hover:bg-gold/30 text-ink border border-gold/30 font-inter font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-sm active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink whitespace-nowrap"
            >
              View All Properties in {location.name}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
