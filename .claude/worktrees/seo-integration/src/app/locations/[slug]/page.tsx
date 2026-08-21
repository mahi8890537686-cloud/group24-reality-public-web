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
import type { FAQItem, Location } from '@/types';

const PREVIEW_COUNT = 6;

// ─── Town-specific FAQs ───────────────────────────────────────────────────────
// Grounded in this town's real `investmentPoints` / `connectivity` /
// `infrastructure` / `description` fields (Firestore `locations` collection).
// No invented prices, developments, or statistics — see buildFallbackFaqs()
// below for how any location not covered here degrades gracefully instead of
// making something up.

const LOCATION_FAQS: Record<string, FAQItem[]> = {
  behror: [
    {
      question: 'Why is Behror considered a good real estate investment right now?',
      answer:
        'Behror sits directly on the Delhi–Jaipur NH-48, which gives it strong through-connectivity, and land values here have been rising on the back of RIICO industrial expansion in the area. It is also priced considerably lower to enter than nearby Gurugram or Bhiwadi, which is why it draws both end-users and investors.',
    },
    {
      question: 'How far is Behror from Delhi, Jaipur, and the neighbouring towns?',
      answer:
        'Behror is about 120 km from Delhi and 130 km from Jaipur, both via NH-48. It is also close to Rewari in Haryana (20 km), Neemrana (30 km), and Kotputli (55 km) — useful if you are comparing plots across the corridor.',
    },
    {
      question: 'What civic and social infrastructure does Behror already have?',
      answer:
        'Behror has an established RIICO Industrial Area, a Government District Hospital, DPS Behror school, a city commercial market, and multiple banks and ATMs. Social infrastructure — schools, hospitals, and markets — has been steadily developing alongside the industrial growth.',
    },
    {
      question: 'Who typically buys property in Behror — residents or investors?',
      answer:
        'Both. There is strong end-user demand for residential plots from the workforce employed in the RIICO industrial belt, alongside investors attracted by the lower entry price compared to Gurugram and Bhiwadi. Exact plot prices vary by sector, plot size, and road width — our team can walk you through current listings for your budget.',
    },
    {
      question: 'How does property registration work if I buy in Behror?',
      answer:
        'Behror falls in Alwar district, Rajasthan, so registration follows the standard Rajasthan process at the local Sub-Registrar Office — stamp duty is typically 5–6% for men and 4–5% for women buyers. Our team assists with sale deed preparation, stamp duty payment, and the registry appointment.',
    },
  ],
  neemrana: [
    {
      question: 'What makes Neemrana different from other towns on the NH-48 corridor?',
      answer:
        'Neemrana is home to the largest Japanese industrial cluster in India outside the major metros, and it falls within the Delhi–Mumbai Industrial Corridor (DMIC) influence zone. That combination drives both strong rental demand and steady capital appreciation, which sets it apart from the smaller towns nearby.',
    },
    {
      question: 'Is Neemrana a good choice for rental income, not just resale value?',
      answer:
        'Yes — the Japanese Industrial Zone (RIICO Phase I–IV) brings a steady base of corporate executives and expats, which supports high rental yield potential. Leading private schools and multi-specialty hospitals in the area also make it practical for tenants to actually live there long-term.',
    },
    {
      question: 'How close is Neemrana to Delhi and the airport?',
      answer:
        'Neemrana is around 90 km / roughly 90 minutes from Delhi via NH-48, and about 100 km from IGI Airport. It is also close to Gurugram (75 km) and Behror (30 km), which helps with weekday commuting for anyone working in the industrial zone.',
    },
    {
      question: 'Is Neemrana just an industrial town, or is there more to it?',
      answer:
        "No — Neemrana Fort Palace anchors a genuine heritage tourism circuit that draws steady visitors, alongside the DMIC's Shahjahanpur Smart City Node development. It is a rare combination of industrial demand and heritage character on the same stretch of highway.",
    },
    {
      question: 'How does property registration work if I buy in Neemrana?',
      answer:
        'Registration follows the standard Rajasthan process at the local Sub-Registrar Office — stamp duty is typically 5–6% for men and 4–5% for women buyers. Our team handles the documentation, from sale deed preparation to the registry appointment, for every property we help you buy in Neemrana.',
    },
  ],
  kotputli: [
    {
      question: 'Why is Kotputli often called the most affordable option on the NH-48 corridor?',
      answer:
        'Kotputli has some of the most affordable property prices anywhere on the NH-48 corridor, while still sitting just 55 km from Jaipur. The growing RIICO industrial estate here is also creating fresh workforce housing demand, which supports the case for entry-level investment.',
    },
    {
      question: 'What is the Kotputli–Behror district formation, and does it matter for buyers?',
      answer:
        "Kotputli and Behror were reorganised into a new administrative district, and that kind of change typically brings more government infrastructure investment into the area over time. It's one of the factors behind the renewed interest in Kotputli as an entry-level investment location.",
    },
    {
      question: 'How well connected is Kotputli by road and rail?',
      answer:
        'Kotputli sits on NH-48, roughly 55 km from Jaipur and 175 km from Delhi, with Behror 55 km away and Neemrana 85 km away. Kotputli Railway Station handles both passenger and freight traffic, which adds another connectivity option beyond the highway.',
    },
    {
      question: "Is Kotputli's economy only real estate and industry, or is there more to it?",
      answer:
        'Kotputli has a genuinely balanced local economy — alongside the RIICO Industrial Area and a growing commercial market, it has an active grain and vegetable mandi supporting agricultural trade, plus a government hospital and engineering/polytechnic colleges. It is not a purely speculative market built on industry alone.',
    },
    {
      question: 'How does property registration work if I buy in Kotputli?',
      answer:
        'Registration follows the standard Rajasthan process at the local Sub-Registrar Office — stamp duty is typically 5–6% for men and 4–5% for women buyers. Our team assists with sale deed preparation, stamp duty payment, and the registry appointment for every purchase in Kotputli.',
    },
  ],
};

/** Fallback for any location not yet covered above — built only from that
 *  location's own real Firestore fields, no invented specifics. Keeps this
 *  page correct if a new town is added to the `locations` collection before
 *  someone writes hand-tailored FAQs for it. */
function buildFallbackFaqs(location: Location): FAQItem[] {
  return [
    {
      question: `Why should I consider investing in ${location.name}?`,
      answer: `${location.investmentPoints.slice(0, 3).join('. ')}.`,
    },
    {
      question: `How is ${location.name} connected to nearby cities?`,
      answer: `${location.connectivity.join(', ')}.`,
    },
    {
      question: `What infrastructure is already in place in ${location.name}?`,
      answer: `${location.infrastructure.join(', ')}.`,
    },
    {
      question: `How does property registration work in ${location.name}?`,
      answer:
        'Property registration in Rajasthan takes place at the local Sub-Registrar Office. Stamp duty is typically 5–6% for men and 4–5% for women buyers. Our team assists with the complete documentation — sale deed preparation, stamp duty payment, and registry appointment.',
    },
  ];
}

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

  const title = `Real Estate in ${location.name}, Rajasthan — Plots, Villas & Flats`;
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
