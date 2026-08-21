'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Phone, MessageCircle, MapPin, Mail, Clock, Send, CheckCircle, AlertCircle,
} from 'lucide-react';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/ui/MotionWrapper';
import { getSiteConfig, buildWhatsAppLink, DEFAULT_SITE_CONFIG } from '@/lib/firestore/siteConfig';
import type { SiteConfig } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Enter your name'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  location: z.string().optional(),
  propertyType: z.string().optional(),
  message: z.string().min(10, 'Please describe your requirement (min 10 characters)'),
});

type FormData = z.infer<typeof schema>;

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmitError('');
    try {
      const res = await fetch('/api/public/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'enquiry',
          name: data.name,
          phone: data.phone,
          email: data.email || undefined,
          location: data.location || undefined,
          propertyType: data.propertyType || undefined,
          message: data.message,
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setSubmitError('Something went wrong. Please call or WhatsApp us directly.');
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-12 text-center">
        <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
        <h3 className="font-serif text-ink text-2xl mb-2">
          Thank You for Reaching Out!
        </h3>
        <p className="text-slate-600 font-inter">
          Our team will contact you within 2 business hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {submitError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <p className="text-red-600 text-sm font-inter">{submitError}</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="c-name" className="block text-xs font-inter font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Your Name *</label>
          <input id="c-name" type="text" {...register('name')} placeholder="Full Name"
            className="w-full border border-border-subtle rounded-xl px-4 py-3 text-ink font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-bg" />
          {errors.name && <p className="mt-1 text-red-500 text-xs">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="c-phone" className="block text-xs font-inter font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Mobile Number *</label>
          <input id="c-phone" type="tel" {...register('phone')} placeholder="10-digit mobile" maxLength={10}
            className="w-full border border-border-subtle rounded-xl px-4 py-3 text-ink font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-bg" />
          {errors.phone && <p className="mt-1 text-red-500 text-xs">{errors.phone.message}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="c-email" className="block text-xs font-inter font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Email Address (optional)</label>
        <input id="c-email" type="email" {...register('email')} placeholder="you@email.com"
          className="w-full border border-border-subtle rounded-xl px-4 py-3 text-ink font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-bg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="c-location" className="block text-xs font-inter font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Preferred Location</label>
          <select id="c-location" {...register('location')}
            className="w-full border border-border-subtle rounded-xl px-4 py-3 text-ink font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-bg cursor-pointer">
            <option value="">Any Location</option>
            <option value="behror">Behror</option>
            <option value="neemrana">Neemrana</option>
            <option value="kotputli">Kotputli</option>
          </select>
        </div>
        <div>
          <label htmlFor="c-type" className="block text-xs font-inter font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Property Type</label>
          <select id="c-type" {...register('propertyType')}
            className="w-full border border-border-subtle rounded-xl px-4 py-3 text-ink font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-bg cursor-pointer">
            <option value="">Any Type</option>
            <option value="plot">Plot</option>
            <option value="villa">Villa</option>
            <option value="flat">Flat / Apartment</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="c-message" className="block text-xs font-inter font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Your Requirement *</label>
        <textarea id="c-message" {...register('message')} rows={4}
          placeholder="Describe your budget, preferred area size, purpose (self-use / investment), and any specific requirements..."
          className="w-full border border-border-subtle rounded-xl px-4 py-3 text-ink font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-bg resize-none" />
        {errors.message && <p className="mt-1 text-red-500 text-xs">{errors.message.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-ink font-inter font-bold py-4 px-6 rounded-xl transition-all duration-200 active:scale-[0.97] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
        {isSubmitting ? <span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
        {isSubmitting ? 'Sending...' : 'Send Enquiry to Group 24 Reality'}
      </button>
    </form>
  );
}

function AddressBlock({ label, address }: { label: string; address: string }) {
  return (
    <div className="flex items-start gap-4 bg-gold-soft border border-gold/30 rounded-2xl p-5">
      <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
        <MapPin className="w-5 h-5 text-gold-dark" />
      </div>
      <div>
        <div className="text-xs font-inter font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</div>
        <address className="font-inter text-sm text-ink not-italic leading-relaxed">
          {address.split('\n').map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </address>
      </div>
    </div>
  );
}

export default function ContactPageContent() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);

  useEffect(() => {
    getSiteConfig().then(setConfig).catch(() => { /* keep default */ });
  }, []);

  const waLink = buildWhatsAppLink(config, 'Hello, I want to enquire about properties.');
  const waEnquiryLink = buildWhatsAppLink(config, 'Hello Sunil ji, I would like to enquire about a property.');

  return (
    <>
      {/* Hero */}
      <div className="bg-bg pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInUp>
            <p className="text-ink/70 font-inter font-semibold text-xs tracking-widest uppercase mb-4">Get in Touch</p>
            <h1 className="font-serif text-ink text-4xl sm:text-5xl lg:text-6xl mb-5">
              Contact {config.businessName}
            </h1>
            <p className="text-ink/70 font-inter text-base sm:text-lg max-w-2xl mx-auto">
              Talk to {config.contactPerson} directly. We respond within 2 business hours.
              Free consultation, no obligation.
            </p>
          </FadeInUp>
        </div>
      </div>

      <div className="bg-bg py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Contact Info Sidebar */}
            <aside className="space-y-4">
              <FadeInUp>
                <h2 className="font-serif text-ink text-2xl mb-6">How to Reach Us</h2>
              </FadeInUp>

              <StaggerContainer className="space-y-4">
                {/* Primary Phone */}
                <StaggerItem>
                  <a href={config.phoneHref}
                    className="flex items-start gap-4 bg-gold-soft border border-gold/30 rounded-2xl p-5 hover:border-gold/40 hover:bg-bg/5 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                      <Phone className="w-5 h-5 text-gold-dark" />
                    </div>
                    <div>
                      <div className="text-xs font-inter font-semibold text-slate-400 uppercase tracking-wide mb-1">Call / WhatsApp</div>
                      <div className="font-inter font-semibold text-ink">{config.phone}</div>
                      <div className="text-slate-500 font-inter text-xs mt-0.5">{config.contactPerson}</div>
                    </div>
                  </a>
                </StaggerItem>

                {/* Secondary Phone */}
                {config.phone2 && config.phone2Href && (
                  <StaggerItem>
                    <a href={config.phone2Href}
                      className="flex items-start gap-4 bg-gold-soft border border-gold/30 rounded-2xl p-5 hover:border-gold/40 hover:bg-bg/5 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                        <Phone className="w-5 h-5 text-gold-dark" />
                      </div>
                      <div>
                        <div className="text-xs font-inter font-semibold text-slate-400 uppercase tracking-wide mb-1">Alternate Number</div>
                        <div className="font-inter font-semibold text-ink">{config.phone2}</div>
                      </div>
                    </a>
                  </StaggerItem>
                )}

                {/* WhatsApp */}
                <StaggerItem>
                  <a href={waEnquiryLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-4 bg-[#25D366]/5 border border-[#25D366]/20 rounded-2xl p-5 hover:border-[#25D366]/40 hover:bg-[#25D366]/10 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 text-[#25D366]" />
                    </div>
                    <div>
                      <div className="text-xs font-inter font-semibold text-slate-400 uppercase tracking-wide mb-1">WhatsApp</div>
                      <div className="font-inter font-semibold text-ink">Chat with Us</div>
                      <div className="text-slate-500 font-inter text-xs mt-0.5">Usually replies within 1 hour</div>
                    </div>
                  </a>
                </StaggerItem>

                {/* Email */}
                <StaggerItem>
                  <a href={`mailto:${config.email}`}
                    className="flex items-start gap-4 bg-gold-soft border border-gold/30 rounded-2xl p-5 hover:border-gold/40 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-gold-dark" />
                    </div>
                    <div>
                      <div className="text-xs font-inter font-semibold text-slate-400 uppercase tracking-wide mb-1">Email</div>
                      <div className="font-inter font-semibold text-ink text-sm break-all">{config.email}</div>
                    </div>
                  </a>
                </StaggerItem>

                {/* Main Office */}
                <StaggerItem>
                  <AddressBlock label={config.mainOfficeLabel} address={config.mainOfficeAddress} />
                </StaggerItem>

                {/* Head Office */}
                <StaggerItem>
                  <AddressBlock label={config.headOfficeLabel} address={config.headOfficeAddress} />
                </StaggerItem>

                {/* Hours */}
                <StaggerItem>
                  <div className="flex items-start gap-4 bg-gold-soft border border-gold/30 rounded-2xl p-5">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-gold-dark" />
                    </div>
                    <div>
                      <div className="text-xs font-inter font-semibold text-slate-400 uppercase tracking-wide mb-1">Business Hours</div>
                      <div className="font-inter text-sm text-ink">
                        {config.businessHoursWeekday}<br />{config.businessHoursWeekend}
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </aside>

            {/* Form + Map */}
            <div className="lg:col-span-2 space-y-8">
              <FadeInUp>
                <div>
                  <h2 className="font-serif text-ink text-2xl mb-2">Send Us an Enquiry</h2>
                  <p className="text-slate-500 font-inter text-sm mb-8">
                    Fill in your details and property requirement. We will get back to you within 2 hours.
                  </p>
                  <ContactForm />
                </div>
              </FadeInUp>

              {/* Map */}
              <FadeInUp>
                <div>
                  <h3 className="font-serif text-ink text-xl mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gold" />
                    Head Office Location
                  </h3>
                  <div className="rounded-2xl overflow-hidden border border-border-subtle aspect-[16/7]">
                    <iframe
                      src={`https://maps.google.com/maps?q=${config.mapEmbedQuery}&output=embed&z=14`}
                      title={`${config.businessName} head office location`}
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>
                </div>
              </FadeInUp>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for mobile bottom bar */}
      <div className="h-[calc(4rem+3.5rem+env(safe-area-inset-bottom))] lg:hidden" aria-hidden="true" />

      {/* Sticky mobile call + WhatsApp bar */}
      <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 z-40 lg:hidden bg-ink border-t border-white/10 p-3 flex gap-3">
        <a href={config.phoneHref}
          className="flex-1 flex items-center justify-center gap-2 bg-gold text-ink font-inter font-bold py-3 rounded-xl text-sm">
          <Phone className="w-4 h-4" />
          Call Now
        </a>
        <a href={waLink} target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-inter font-bold py-3 rounded-xl text-sm">
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
      </div>
    </>
  );
}
