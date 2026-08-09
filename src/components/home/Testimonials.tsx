'use client';

import { Star, Quote } from 'lucide-react';
import type { Testimonial } from '@/types';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StaggerContainer, StaggerItem, FadeInUp } from '@/components/ui/MotionWrapper';
import { aggregateRatingSchema, JsonLd } from '@/lib/schema';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-gold fill-gold' : 'text-slate-200'}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

interface TestimonialsProps {
  /** Fetched server-side (see src/app/page.tsx) so the AggregateRating/Review
   *  JSON-LD below is present in the initial server-rendered HTML, not only
   *  after client hydration. */
  testimonials: Testimonial[];
}

// SAFETY GATE — do not remove without confirming real reviews are in place.
// As of 2026-08-08 the live `testimonials` Firestore collection contains only
// the 4 placeholder docs seeded by scripts/seed-site-data.mjs (test-001..004:
// "Rajesh Kumar Sharma" etc.) — fabricated names, not real customers.
// Publishing schema.org Review/AggregateRating markup built from these would
// present fake reviews to Google as structured data, which is both dishonest
// and a real risk under Google's review-schema guidelines. Flip this to
// `true` only once the testimonials collection has been replaced with real,
// verified customer reviews (the visible testimonial cards below are
// unaffected either way — this only gates the JSON-LD).
const HAS_VERIFIED_TESTIMONIALS = false;

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const schema =
    HAS_VERIFIED_TESTIMONIALS && testimonials.length > 0
      ? aggregateRatingSchema(testimonials)
      : null;

  return (
    <section className="py-16 sm:py-24 bg-bg" aria-labelledby="testimonials-heading">
      {schema && <JsonLd data={schema} />}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="mb-12">
          <SectionHeader
            eyebrow="What Our Clients Say"
            heading="Real Stories from Happy Buyers"
            subheading="Hear from families and investors who trusted Group24 Reality to guide their property journey in Rajasthan."
          />
        </FadeInUp>

        {testimonials.length === 0 ? null : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {testimonials.map((t) => (
              <StaggerItem key={t.id}>
                <figure className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                  {/* Quote Icon */}
                  <Quote className="w-8 h-8 text-gold/30 mb-4" aria-hidden="true" />

                  {/* Review */}
                  <blockquote className="flex-grow">
                    <p className="text-slate-600 text-sm font-inter leading-relaxed italic mb-5">
                      &ldquo;{t.review}&rdquo;
                    </p>
                  </blockquote>

                  {/* Rating + Author */}
                  <figcaption>
                    <StarRating rating={t.rating} />
                    <div className="mt-3 pt-3 border-t border-border-subtle">
                      <div className="font-inter font-semibold text-ink text-sm">{t.name}</div>
                      <div className="text-slate-400 text-xs font-inter mt-0.5">{t.location}</div>
                    </div>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
