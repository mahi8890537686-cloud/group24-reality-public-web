import { ShieldCheck, Award, Eye, FileCheck } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { StaggerContainer, StaggerItem } from '@/components/ui/MotionWrapper';

const trustItems = [
  {
    icon: ShieldCheck,
    stat: 150,
    suffix: '+',
    label: 'Verified Properties',
    description: 'Every listing is physically verified by our team before listing.',
  },
  {
    icon: Award,
    stat: 8,
    suffix: '+',
    label: 'Years of Local Expertise',
    description: 'Deep roots in Behror, Neemrana, and Kotputli real estate markets.',
  },
  {
    icon: Eye,
    stat: 500,
    suffix: '+',
    label: 'Happy Families',
    description: 'Families and investors who trusted us to find their ideal property.',
  },
  {
    icon: FileCheck,
    stat: 1000,
    suffix: '+',
    label: 'Site Visits Arranged',
    description: 'We arrange free site visits so you can see your property in person.',
  },
];

export default function TrustIndicators() {
  return (
    <section
      className="py-16 sm:py-20 bg-ink"
      aria-labelledby="trust-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="trust-heading" className="sr-only">
          Why trust Group24 Reality
        </h2>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map(({ icon: Icon, stat, suffix, label, description }) => (
            <StaggerItem key={label}>
              <div className="group bg-white/5 hover:bg-white/8 border border-white/10 hover:border-gold/30 rounded-2xl p-6 text-center transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                  <Icon className="w-6 h-6 text-gold" />
                </div>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
                  <AnimatedCounter target={stat} suffix={suffix} />
                </div>
                <div className="text-gold font-inter font-semibold text-sm mb-2">{label}</div>
                <p className="text-white/50 text-xs font-inter leading-relaxed">{description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
