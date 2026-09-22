import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, JsonLd } from '@/lib/schema';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { FadeInUp } from '@/components/ui/MotionWrapper';
import RwaRegistrationForm from '@/components/rwa/RwaRegistrationForm';

export const metadata: Metadata = buildMetadata({
  title: 'RWA Society Registration Form',
  description:
    'Register your plot for RWA (Resident Welfare Association) society formation. Submit your plot details and KYC documents online.',
  alternates: { canonical: 'https://www.group24reality.com/rwa-registration-form' },
  openGraph: { url: 'https://www.group24reality.com/rwa-registration-form' },
});

export default function RwaRegistrationPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'RWA Registration Form', url: '/rwa-registration-form' },
        ])}
      />

      <div className="bg-bg pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInUp>
            <p className="text-ink/70 font-inter font-semibold text-xs tracking-widest uppercase mb-4">
              RWA Society
            </p>
            <h1 className="font-serif text-ink text-4xl sm:text-5xl mb-5">RWA Registration Form</h1>
            <p className="text-ink/70 font-inter text-base sm:text-lg max-w-2xl mx-auto">
              Fill in your plot details and upload your documents to register for the Resident
              Welfare Association (RWA) society.
            </p>
          </FadeInUp>
        </div>
      </div>

      <div className="bg-bg pb-16 sm:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <FadeInUp>
              <GlassPanel variant="standard" className="p-6 sm:p-8">
                <RwaRegistrationForm />
              </GlassPanel>
            </FadeInUp>
          </div>
        </div>
      </div>
    </>
  );
}
