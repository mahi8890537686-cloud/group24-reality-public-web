import type { Metadata } from 'next';
import { Heart, Eye, Handshake, MapPin, Users, TrendingUp } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StaggerContainer, StaggerItem, FadeInUp } from '@/components/ui/MotionWrapper';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, JsonLd } from '@/lib/schema';

export const metadata: Metadata = buildMetadata({
  title: 'About Group 24 Reality — Trusted Real Estate Consultant in Rajasthan',
  description:
    'Learn about Group 24 Reality — a trusted real estate consulting firm serving Behror, Neemrana, and Kotputli. Founded by Sunil Sangwan with a mission of transparency, local expertise, and honest property dealing.',
  alternates: { canonical: 'https://www.group24reality.com/about' },
  openGraph: { url: 'https://www.group24reality.com/about' },
});

const values = [
  {
    icon: Heart,
    title: 'Honest & Transparent',
    description:
      'We believe in straightforward dealing. No hidden charges, no pressure tactics, and no exaggerated claims. What you see is what you get.',
  },
  {
    icon: MapPin,
    title: 'Deep Local Knowledge',
    description:
      'Our team is rooted in the markets we serve. We know Behror, Neemrana, and Kotputli inside out — from sector-level pricing to upcoming development plans.',
  },
  {
    icon: Eye,
    title: 'Verified Listings Only',
    description:
      'Every property we list has been physically inspected. We check title documents, boundaries, utility connections, and legal status before any listing goes live.',
  },
  {
    icon: Handshake,
    title: 'Client-First Approach',
    description:
      'Our measure of success is not the number of properties sold — it is the satisfaction of every buyer and investor who trusted us with their hard-earned money.',
  },
  {
    icon: Users,
    title: 'Long-Term Relationships',
    description:
      'Many of our clients return for their second or third property — and refer friends and family. That trust is our greatest achievement.',
  },
  {
    icon: TrendingUp,
    title: 'Investment Insight',
    description:
      'We help clients understand not just a property — but the market, the growth drivers, and the realistic appreciation potential for their investment.',
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'About Us', url: '/about' },
        ])}
      />

      {/* Hero */}
      <div className="bg-navy-950 pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <FadeInUp>
            <p className="text-gold-400 font-inter font-semibold text-xs tracking-widest uppercase mb-4">
              About Us
            </p>
            <h1 className="font-playfair font-bold text-white text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
              Group 24 Reality
            </h1>
            <p className="text-white/70 font-inter text-base sm:text-lg leading-relaxed">
              The Real Estate Consultant — serving Behror, Neemrana, and Kotputli, Rajasthan.
            </p>
          </FadeInUp>
        </div>
      </div>

      {/* Story */}
      <section className="py-16 sm:py-24 bg-white" aria-labelledby="story-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeInUp>
              <div>
                <p className="text-gold-500 font-inter font-semibold text-xs tracking-widest uppercase mb-3">
                  Our Story
                </p>
                <h2
                  id="story-heading"
                  className="font-playfair font-bold text-navy-950 text-3xl sm:text-4xl mb-6 leading-tight"
                >
                  Built on Trust, Guided by Local Knowledge
                </h2>
                <div className="space-y-4 text-slate-600 font-inter text-sm leading-relaxed">
                  <p>
                    Group 24 Reality was founded by <strong className="text-navy-950">Sunil Sangwan</strong> with 
                    a clear purpose: to make property buying in Rajasthan&apos;s emerging markets a 
                    safe, transparent, and empowering experience for every buyer — whether they are 
                    purchasing their first home or adding to their investment portfolio.
                  </p>
                  <p>
                    We operate in <strong className="text-navy-950">Behror, Neemrana, and Kotputli</strong> — 
                    three fast-growing towns on the Delhi–Jaipur NH-48 corridor that are witnessing 
                    significant real estate activity driven by industrial development, improving 
                    infrastructure, and rising demand from both end-users and investors.
                  </p>
                  <p>
                    Unlike large property portals that aggregate listings without context, we are a 
                    hands-on team with boots on the ground. We physically visit every property we 
                    list, verify documentation, and accompany buyers through every step — from 
                    initial enquiry to final registry.
                  </p>
                  <p>
                    Our mission is simple: connect the right buyer with the right property at a 
                    fair price, with complete transparency and no hidden surprises.
                  </p>
                </div>
              </div>
            </FadeInUp>

            {/* Stats / Credibility */}
            <FadeInUp delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Years Active', value: '8+' },
                  { label: 'Properties Listed', value: '150+' },
                  { label: 'Happy Clients', value: '500+' },
                  { label: 'Locations Served', value: '3' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-sand-50 border border-sand-200 rounded-2xl p-6 text-center"
                  >
                    <div className="font-playfair font-bold text-navy-950 text-4xl mb-1">
                      {stat.value}
                    </div>
                    <div className="text-slate-500 font-inter text-sm">{stat.label}</div>
                  </div>
                ))}
                <div className="col-span-2 bg-gold-400/10 border border-gold-400/30 rounded-2xl p-6">
                  <p className="text-navy-800 font-inter text-sm leading-relaxed italic">
                    &ldquo;Our goal is not to sell you a property — it is to help you make the 
                    right property decision for your family and your future.&rdquo;
                  </p>
                  <p className="text-gold-600 font-inter font-semibold text-sm mt-3">
                    — Sunil Sangwan, Founder, Group 24 Reality
                  </p>
                </div>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24 bg-navy-950" aria-labelledby="values-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp className="mb-12">
            <SectionHeader
              eyebrow="What We Stand For"
              heading="Our Values"
              subheading="Six principles that guide every interaction, every listing, and every property deal we facilitate."
              light
            />
          </FadeInUp>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map(({ icon: Icon, title, description }) => (
              <StaggerItem key={title}>
                <div className="bg-white/5 hover:bg-white/8 border border-white/10 hover:border-gold-400/30 rounded-2xl p-6 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-gold-400/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-gold-400" aria-hidden="true" />
                  </div>
                  <h3 className="font-playfair font-semibold text-white text-lg mb-2">{title}</h3>
                  <p className="text-white/60 text-sm font-inter leading-relaxed">{description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-sand-50 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <FadeInUp>
            <h2 className="font-playfair font-bold text-navy-950 text-3xl sm:text-4xl mb-4">
              Ready to Work With Us?
            </h2>
            <p className="text-slate-600 font-inter mb-8">
              Get in touch with Sunil Sangwan today. Free consultation, no obligation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+919560199247"
                className="bg-gold-400 hover:bg-gold-500 text-navy-950 font-inter font-bold px-8 py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-gold-400/30"
              >
                Call +91-9560199247
              </a>
              <a
                href="/contact"
                className="border-2 border-navy-950 text-navy-950 hover:bg-navy-950 hover:text-white font-inter font-semibold px-8 py-4 rounded-xl transition-all"
              >
                Send Enquiry
              </a>
            </div>
          </FadeInUp>
        </div>
      </section>
    </>
  );
}
