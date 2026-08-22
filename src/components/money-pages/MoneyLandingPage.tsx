import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getLocationBySlug } from '@/lib/firestore/locations';
import { getAllProperties } from '@/lib/firestore/properties';
import PropertyGrid from '@/components/properties/PropertyGrid';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeInUp } from '@/components/ui/MotionWrapper';
import { breadcrumbSchema, itemListSchema, faqPageSchema, JsonLd } from '@/lib/schema';
import { LOCATION_FAQS, buildFallbackFaqs } from '@/lib/locationFaqs';
import type { PropertyType } from '@/types';

const TYPE_LABEL: Record<PropertyType, string> = {
  plot: 'Plots',
  villa: 'Villas',
  flat: 'Flats',
};

// Real, already-published copy (also used in LocationSection's "Property
// Options" block) — reused here rather than inventing new figures for a
// type-specific intro line.
const TYPE_BLURB: Record<PropertyType, string> = {
  plot: 'Freehold residential plots with clear title documentation, verified boundaries, and utility connections checked before listing.',
  villa: '3BHK and 4BHK independent villas in gated townships with modern amenities.',
  flat: '1BHK to 3BHK apartments in well-maintained society complexes with parking.',
};

interface MoneyLandingPageProps {
  locationSlug: string;
  type: PropertyType;
  /** This page's own canonical path, e.g. "/plots-in-neemrana" — used for breadcrumb/schema URLs. */
  path: string;
}

export default async function MoneyLandingPage({ locationSlug, type, path }: MoneyLandingPageProps) {
  const [location, properties] = await Promise.all([
    getLocationBySlug(locationSlug),
    getAllProperties({ locationSlug, type, status: 'available' }).catch(() => []),
  ]);

  if (!location) notFound();

  const typeLabel = TYPE_LABEL[type];
  const faqs = LOCATION_FAQS[location.slug] ?? buildFallbackFaqs(location);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Properties', url: '/properties' },
          { name: `${typeLabel} in ${location.name}`, url: path },
        ])}
      />
      {properties.length > 0 && <JsonLd data={itemListSchema(properties)} />}
      <JsonLd data={faqPageSchema(faqs)} />

      {/* Hero */}
      <div className="bg-bg pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm font-inter text-ink/60">
              <li><Link href="/" className="hover:text-ink transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/properties" className="hover:text-ink transition-colors">Properties</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-ink font-medium">{typeLabel} in {location.name}</li>
            </ol>
          </nav>
          <FadeInUp>
            <SectionHeader
              headingAs="h1"
              eyebrow={`Group 24 Reality — ${location.name}, ${location.state}`}
              heading={`${typeLabel} in ${location.name} for Sale`}
              subheading={`${TYPE_BLURB[type]} All ${properties.length > 0 ? properties.length + ' ' : ''}listings below are physically verified by our team before they go live.`}
              align="left"
            />
          </FadeInUp>
        </div>
      </div>

      {/* Live listings */}
      <div className="bg-bg pb-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="sr-only">Available {typeLabel} in {location.name}</h2>
          <PropertyGrid properties={properties} />
        </div>
      </div>

      {/* Why this town, for this property type — real Location fields, no invented figures */}
      <div className="bg-bg border-t border-border-subtle py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <SectionHeader
                eyebrow="Local Context"
                heading={`Why Buy ${typeLabel} in ${location.name}?`}
                align="left"
              />
              <ul className="space-y-3 mt-6">
                {location.investmentPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm font-inter text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-gold-dark mt-0.5 shrink-0" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-slate-600 font-inter leading-relaxed mb-6">{location.description}</p>
              <Link
                href={`/locations/${location.slug}`}
                className="group inline-flex items-center gap-1.5 text-gold-dark font-inter font-semibold text-sm"
              >
                Full {location.name} location guide
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ — shared, fact-grounded per-town FAQ set */}
      <div className="bg-bg border-t border-border-subtle py-16 sm:py-24" aria-labelledby="money-faq-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp className="mb-12">
            <SectionHeader
              id="money-faq-heading"
              eyebrow="Common Questions"
              heading={`Frequently Asked Questions About ${typeLabel} in ${location.name}`}
              subheading="Still have a question? Call us — we're happy to help."
            />
          </FadeInUp>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group border border-border-subtle rounded-xl overflow-hidden bg-gold-soft [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="list-none w-full flex items-start justify-between gap-4 px-6 py-5 text-left cursor-pointer hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold">
                  <span className="font-serif text-ink text-base leading-snug">{faq.question}</span>
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

      {/* Bottom CTA */}
      <div className="bg-bg border-t border-border-subtle py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-inter text-ink/70 text-sm">
            Looking for other property types in {location.name}, or other towns on the NH-48 corridor?
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
    </>
  );
}
