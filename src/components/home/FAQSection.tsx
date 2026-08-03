'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeInUp } from '@/components/ui/MotionWrapper';
import { faqPageSchema } from '@/lib/schema';
import { JsonLd } from '@/lib/schema';
import type { FAQItem } from '@/types';

const faqs: FAQItem[] = [
  {
    question: 'Is Group 24 Reality a registered real estate company?',
    answer:
      'Yes. Group 24 Reality is a registered real estate consulting firm based in Gurugram, serving clients across Behror, Neemrana, and Kotputli in Rajasthan. All our listings are physically verified before being listed on our platform.',
  },
  {
    question: 'What is the minimum budget to buy a plot in Neemrana?',
    answer:
      'Residential plots in Neemrana typically start from around ₹15–20 Lakh for plots of 100–120 sq. yards, depending on the sector, road width, and proximity to the industrial zone. Our team can help you find the best match within your budget.',
  },
  {
    question: 'Can I get a home loan for a plot or villa in Behror?',
    answer:
      'Yes. Most scheduled banks including SBI, HDFC, and ICICI offer home loans for villa and flat purchases. Loans for plots are available as composite plot-construction loans. We assist all our clients in coordinating with bank representatives for smooth loan processing.',
  },
  {
    question: 'Do you offer site visits before purchase?',
    answer:
      'Absolutely. We strongly encourage site visits before any purchase decision. Our team arranges free guided site visits to all listed properties at your convenience. We believe seeing is believing — especially when investing in land.',
  },
  {
    question: 'How is property registration done in Rajasthan?',
    answer:
      'Property registration in Rajasthan takes place at the local Sub-Registrar Office. Stamp duty is typically 5–6% for men and 4–5% for women buyers. Our team assists with the complete documentation — sale deed preparation, stamp duty payment, and registry appointment.',
  },
  {
    question: 'What makes Neemrana a good real estate investment?',
    answer:
      'Neemrana hosts the largest Japanese industrial cluster in India outside major metros, and forms part of the Delhi–Mumbai Industrial Corridor (DMIC). This drives strong rental demand from corporate executives and consistent capital appreciation. Properties near the Japanese zone have seen steady value growth over the past decade.',
  },
  {
    question: 'Is Kotputli a good location for affordable property investment?',
    answer:
      'Yes. Kotputli offers some of the most affordable property prices on the Delhi–Jaipur NH-48 corridor, while benefiting from its proximity to Jaipur (55 km) and a growing RIICO industrial estate. It is an ideal entry-level investment location with strong upside potential.',
  },
  {
    question: 'How do I contact Group 24 Reality to enquire about a property?',
    answer:
      'You can contact us by calling or WhatsApp at +91-9560199247 (Sunil Sangwan), filling our online enquiry form, or visiting our office at Plot No. 6, Basai Enclave, Part 2, Sector 37C, Gurugram. We respond to all enquiries within 2 business hours.',
  },
];

function FAQItem({ question, answer }: FAQItem) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-sand-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-sand-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-400"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="font-playfair font-semibold text-navy-950 text-base leading-snug">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gold-500 shrink-0 mt-0.5 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 bg-white">
              <p className="text-slate-600 text-sm font-inter leading-relaxed border-t border-sand-100 pt-4">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  return (
    <section className="py-16 sm:py-24 bg-sand-50" aria-labelledby="faq-heading">
      <JsonLd data={faqPageSchema(faqs)} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="mb-12">
          <SectionHeader
            eyebrow="Common Questions"
            heading="Frequently Asked Questions"
            subheading="Honest answers to the questions our buyers ask most. Couldn't find yours? Call us — we are happy to help."
          />
        </FadeInUp>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}
