import Link from 'next/link';
import { Layers, Home, Building2, ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StaggerContainer, StaggerItem, FadeInUp } from '@/components/ui/MotionWrapper';

const categories = [
  {
    icon: Layers,
    type: 'plot',
    label: 'Residential Plots',
    tagline: 'Build your dream home your way',
    description:
      'Freehold residential plots in Behror, Neemrana, and Kotputli. Clear title, measured boundaries, and verified registry.',
    highlights: ['Freehold Title', 'Corner Plots Available', 'As low as ₹12 Lakh'],
    href: '/properties?type=plot',
    color: 'from-amber-500/10 to-gold/5',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
  },
  {
    icon: Home,
    type: 'villa',
    label: 'Villas & Independent Houses',
    tagline: 'Premium living with privacy and space',
    description:
      'Spacious villas and independent houses across three locations — from budget-friendly 3BHK to luxury 4BHK with private pool.',
    highlights: ['Ready to Move Options', '3BHK & 4BHK', 'Gated Townships'],
    href: '/properties?type=villa',
    color: 'from-ink/5 to-ink/10',
    iconBg: 'bg-bg-secondary',
    iconColor: 'text-text-secondary',
  },
  {
    icon: Building2,
    type: 'flat',
    label: 'Flats & Apartments',
    tagline: 'Smart investment in growing markets',
    description:
      'Modern 1BHK, 2BHK, and 3BHK apartments in established complexes with lifts, parking, and society amenities.',
    highlights: ['Bank Loan Available', '1BHK to 3BHK', 'Low Maintenance Societies'],
    href: '/properties?type=flat',
    color: 'from-emerald-500/5 to-teal-500/5',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-700',
  },
];

export default function PropertyCategories() {
  return (
    <section className="py-16 sm:py-24 bg-bg" aria-labelledby="categories-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="mb-12">
          <SectionHeader
            eyebrow="What We Offer"
            heading="Property Categories"
            subheading="From affordable plots to premium villas, we cover every segment of the residential property market."
          />
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map(({ icon: Icon, label, tagline, description, highlights, href, color, iconBg, iconColor }) => (
            <StaggerItem key={label}>
              <div className={`group bg-gradient-to-br ${color} bg-white border border-border-subtle rounded-2xl p-7 hover:shadow-xl transition-all duration-300 h-full flex flex-col`}>
                <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-5`}>
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <h3 className="font-serif text-ink text-xl mb-1">{label}</h3>
                <p className="text-gold-dark text-sm font-inter font-medium mb-3">{tagline}</p>
                <p className="text-slate-600 text-sm font-inter leading-relaxed mb-5 flex-grow">
                  {description}
                </p>
                <ul className="space-y-2 mb-6">
                  {highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm font-inter text-text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
                <Link
                  href={href}
                  className="group/link mt-auto inline-flex items-center gap-2 text-text-secondary hover:text-gold-dark font-inter font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-md"
                >
                  Browse {label}
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
