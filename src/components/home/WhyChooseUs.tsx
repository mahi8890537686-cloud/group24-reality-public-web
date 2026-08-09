import { MapPin, FileCheck, HandshakeIcon, Search, Users, IndianRupee, Eye, Scale } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StaggerContainer, StaggerItem, FadeInUp } from '@/components/ui/MotionWrapper';

const reasons = [
  {
    icon: MapPin,
    title: 'Deep Local Knowledge',
    description:
      'Our team lives and works in Behror, Neemrana, and Kotputli. We know every sector, road, and micro-market.',
  },
  {
    icon: IndianRupee,
    title: 'Transparent Pricing',
    description:
      'No hidden charges. We share the full cost breakdown — stamp duty, registry, and brokerage — upfront.',
  },
  {
    icon: FileCheck,
    title: 'Legal & Documentation Support',
    description:
      'We guide you through title verification, registry, and NOC — and connect you with trusted local lawyers.',
  },
  {
    icon: Eye,
    title: 'Free Site Visits',
    description:
      'We arrange free guided site visits at your convenience. See the property before you decide — always.',
  },
  {
    icon: HandshakeIcon,
    title: 'After-Sales Assistance',
    description:
      'Our relationship does not end at registry. We assist with construction contacts, layout approvals, and more.',
  },
  {
    icon: Scale,
    title: 'Verified & Legal Listings',
    description:
      'Every property on our platform has been physically inspected and document-checked by our local team.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-24 bg-ink" aria-labelledby="why-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="mb-12">
          <SectionHeader
            eyebrow="Why Group24 Reality"
            heading="The Difference Local Expertise Makes"
            subheading="We are not a property portal. We are your local property partner in Rajasthan — with on-the-ground knowledge, honest advice, and genuine after-care."
            light
          />
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map(({ icon: Icon, title, description }) => (
            <StaggerItem key={title}>
              <div className="group bg-white/5 hover:bg-white/8 border border-white/10 hover:border-gold/30 rounded-2xl p-6 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-gold/10 group-hover:bg-gold/20 flex items-center justify-center mb-4 transition-colors">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-serif text-white text-lg mb-2">{title}</h3>
                <p className="text-white/60 text-sm font-inter leading-relaxed">{description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
