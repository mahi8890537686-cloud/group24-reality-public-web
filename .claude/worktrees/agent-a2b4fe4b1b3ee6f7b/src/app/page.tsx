import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import SearchBar from '@/components/home/SearchBar';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import LocationHighlights from '@/components/home/LocationHighlights';
import PropertyCategories from '@/components/home/PropertyCategories';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Testimonials from '@/components/home/Testimonials';
import ProcessSteps from '@/components/home/ProcessSteps';
import ContactStrip from '@/components/home/ContactStrip';
import { buildMetadata } from '@/lib/seo';
import { getVisibleTestimonials } from '@/lib/firestore/testimonials';

export const metadata: Metadata = buildMetadata({
  title: 'Group 24 Reality — Plots, Villas & Flats in Behror, Neemrana & Kotputli',
  description:
    'Find verified residential plots, villas, and flats in Behror, Neemrana, and Kotputli, Rajasthan. Group 24 Reality offers transparent pricing, site visits, and local expertise. Call Sunil Sangwan: +91-9266982400.',
  openGraph: {
    title: 'Group 24 Reality — Real Estate Consultant in Rajasthan',
    description:
      'Trusted property consultant in Behror, Neemrana & Kotputli. Plots from ₹12 Lakh. Verified listings. Free site visits.',
    url: 'https://www.group24reality.com',
  },
  alternates: {
    canonical: 'https://www.group24reality.com',
  },
});

export default async function HomePage() {
  // Fetched server-side (rather than in Testimonials.tsx) so the
  // AggregateRating/Review JSON-LD it emits is present in the initial
  // server-rendered HTML for crawlers, not only after client hydration.
  const testimonials = await getVisibleTestimonials().catch(() => []);

  return (
    <>
      <HeroSection />
      <SearchBar />
      <FeaturedProperties />
      <LocationHighlights />
      <PropertyCategories />
      <WhyChooseUs />
      <Testimonials testimonials={testimonials} />
      <ProcessSteps />
      <ContactStrip />
    </>
  );
}
