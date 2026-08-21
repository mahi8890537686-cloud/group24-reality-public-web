import { Search, Eye, FileText, KeyRound } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StaggerContainer, StaggerItem, FadeInUp } from '@/components/ui/MotionWrapper';

const steps = [
  {
    step: '01',
    icon: Search,
    title: 'Discover',
    description:
      'Browse our verified listings or tell us your requirements. We will curate the best matches in your budget and preferred location.',
  },
  {
    step: '02',
    icon: Eye,
    title: 'Site Visit',
    description:
      'We arrange a free, guided site visit at your convenience. See the property, the neighbourhood, and the surrounding infrastructure firsthand.',
  },
  {
    step: '03',
    icon: FileText,
    title: 'Documentation',
    description:
      'Our team assists with title verification, payment planning, loan coordination, and all registration paperwork.',
  },
  {
    step: '04',
    icon: KeyRound,
    title: 'Ownership',
    description:
      'Complete your registry at the Sub-Registrar office. We accompany you and ensure a smooth, hassle-free handover.',
  },
];

export default function ProcessSteps() {
  return (
    <section className="py-16 sm:py-24 bg-bg" aria-labelledby="process-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="mb-12">
          <SectionHeader
            eyebrow="Our Process"
            heading="Your Property Journey, Simplified"
            subheading="From first enquiry to final registry — we guide you through every step with local expertise and honest support."
          />
        </FadeInUp>

        <StaggerContainer className="relative">
          {/* Connector Line — desktop only */}
          <div
            className="absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent hidden lg:block"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ step, icon: Icon, title, description }) => (
              <StaggerItem key={step}>
                <div className="relative flex flex-col items-center text-center">
                  {/* Step circle */}
                  <div className="relative w-20 h-20 rounded-full bg-gold-soft border-2 border-ink/15 flex items-center justify-center mb-6 z-10">
                    <div className="w-12 h-12 rounded-full bg-gold/30 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-ink" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-ink text-gold font-serif text-xs flex items-center justify-center">
                      {step}
                    </span>
                  </div>
                  <h3 className="font-serif text-ink text-xl mb-3">{title}</h3>
                  <p className="text-slate-500 text-sm font-inter leading-relaxed">{description}</p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}
