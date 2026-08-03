import { Star, Quote } from 'lucide-react';
import { testimonials } from '@/data/testimonials';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StaggerContainer, StaggerItem, FadeInUp } from '@/components/ui/MotionWrapper';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-gold-400 fill-gold-400' : 'text-slate-200'}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-24 bg-sand-50" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="mb-12">
          <SectionHeader
            eyebrow="What Our Clients Say"
            heading="Real Stories from Happy Buyers"
            subheading="Hear from families and investors who trusted Group24 Realty to guide their property journey in Rajasthan."
          />
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {testimonials.map((t) => (
            <StaggerItem key={t.id}>
              <figure className="bg-white border border-sand-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-gold-400/30 mb-4" aria-hidden="true" />

                {/* Review */}
                <blockquote className="flex-grow">
                  <p className="text-slate-600 text-sm font-inter leading-relaxed italic mb-5">
                    &ldquo;{t.review}&rdquo;
                  </p>
                </blockquote>

                {/* Rating + Author */}
                <figcaption>
                  <StarRating rating={t.rating} />
                  <div className="mt-3 pt-3 border-t border-sand-100">
                    <div className="font-inter font-semibold text-navy-950 text-sm">{t.name}</div>
                    <div className="text-slate-400 text-xs font-inter mt-0.5">{t.location}</div>
                  </div>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
