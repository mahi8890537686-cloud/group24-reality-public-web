'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Phone, MessageCircle, MapPin, Mail, Clock, Send, CheckCircle,
} from 'lucide-react';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/ui/MotionWrapper';
import { whatsappLink } from '@/lib/utils';

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
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 800));
    console.log('Contact form:', data);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-12 text-center">
        <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
        <h3 className="font-playfair font-bold text-navy-950 text-2xl mb-2">
          Thank You for Reaching Out!
        </h3>
        <p className="text-slate-600 font-inter">
          Sunil Sangwan will contact you within 2 business hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name */}
        <div>
          <label htmlFor="c-name" className="block text-xs font-inter font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Your Name *
          </label>
          <input
            id="c-name"
            type="text"
            {...register('name')}
            placeholder="Full Name"
            className="w-full border border-sand-200 rounded-xl px-4 py-3 text-navy-950 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 bg-sand-50"
          />
          {errors.name && <p className="mt-1 text-red-500 text-xs">{errors.name.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="c-phone" className="block text-xs font-inter font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Mobile Number *
          </label>
          <input
            id="c-phone"
            type="tel"
            {...register('phone')}
            placeholder="10-digit mobile"
            maxLength={10}
            className="w-full border border-sand-200 rounded-xl px-4 py-3 text-navy-950 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 bg-sand-50"
          />
          {errors.phone && <p className="mt-1 text-red-500 text-xs">{errors.phone.message}</p>}
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="c-email" className="block text-xs font-inter font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          Email Address (optional)
        </label>
        <input
          id="c-email"
          type="email"
          {...register('email')}
          placeholder="you@email.com"
          className="w-full border border-sand-200 rounded-xl px-4 py-3 text-navy-950 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 bg-sand-50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Preferred Location */}
        <div>
          <label htmlFor="c-location" className="block text-xs font-inter font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Preferred Location
          </label>
          <select
            id="c-location"
            {...register('location')}
            className="w-full border border-sand-200 rounded-xl px-4 py-3 text-navy-950 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 bg-sand-50 cursor-pointer"
          >
            <option value="">Any Location</option>
            <option value="behror">Behror</option>
            <option value="neemrana">Neemrana</option>
            <option value="kotputli">Kotputli</option>
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label htmlFor="c-type" className="block text-xs font-inter font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Property Type
          </label>
          <select
            id="c-type"
            {...register('propertyType')}
            className="w-full border border-sand-200 rounded-xl px-4 py-3 text-navy-950 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 bg-sand-50 cursor-pointer"
          >
            <option value="">Any Type</option>
            <option value="plot">Plot</option>
            <option value="villa">Villa</option>
            <option value="flat">Flat / Apartment</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="c-message" className="block text-xs font-inter font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          Your Requirement *
        </label>
        <textarea
          id="c-message"
          {...register('message')}
          rows={4}
          placeholder="Describe your budget, preferred area size, purpose (self-use / investment), and any specific requirements..."
          className="w-full border border-sand-200 rounded-xl px-4 py-3 text-navy-950 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 bg-sand-50 resize-none"
        />
        {errors.message && <p className="mt-1 text-red-500 text-xs">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-500 text-navy-950 font-inter font-bold py-4 px-6 rounded-xl transition-all duration-200 active:scale-[0.97] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
      >
        {isSubmitting ? (
          <span className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {isSubmitting ? 'Sending...' : 'Send Enquiry to Group 24 Reality'}
      </button>
    </form>
  );
}

export default function ContactPageClient() {
  return (
    <>
      {/* Hero */}
      <div className="bg-navy-950 pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInUp>
            <p className="text-gold-400 font-inter font-semibold text-xs tracking-widest uppercase mb-4">
              Get in Touch
            </p>
            <h1 className="font-playfair font-bold text-white text-4xl sm:text-5xl lg:text-6xl mb-5">
              Contact Group 24 Reality
            </h1>
            <p className="text-white/70 font-inter text-base sm:text-lg max-w-2xl mx-auto">
              Talk to Sunil Sangwan directly. We respond within 2 business hours.
              Free consultation, no obligation.
            </p>
          </FadeInUp>
        </div>
      </div>

      <div className="bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <aside className="space-y-6">
              <FadeInUp>
                <h2 className="font-playfair font-bold text-navy-950 text-2xl mb-6">
                  How to Reach Us
                </h2>
              </FadeInUp>

              <StaggerContainer className="space-y-4">
                {/* Phone */}
                <StaggerItem>
                  <a
                    href="tel:+919560199247"
                    className="flex items-start gap-4 bg-sand-50 border border-sand-200 rounded-2xl p-5 hover:border-gold-400/40 hover:bg-gold-400/5 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gold-400/10 flex items-center justify-center shrink-0 group-hover:bg-gold-400/20 transition-colors">
                      <Phone className="w-5 h-5 text-gold-500" />
                    </div>
                    <div>
                      <div className="text-xs font-inter font-semibold text-slate-400 uppercase tracking-wide mb-1">Call / WhatsApp</div>
                      <div className="font-inter font-semibold text-navy-950">+91-9560199247</div>
                      <div className="text-slate-500 font-inter text-xs mt-0.5">Sunil Sangwan</div>
                    </div>
                  </a>
                </StaggerItem>

                {/* WhatsApp */}
                <StaggerItem>
                  <a
                    href={whatsappLink('Hello Sunil ji, I would like to enquire about a property.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 bg-[#25D366]/5 border border-[#25D366]/20 rounded-2xl p-5 hover:border-[#25D366]/40 hover:bg-[#25D366]/10 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 text-[#25D366]" />
                    </div>
                    <div>
                      <div className="text-xs font-inter font-semibold text-slate-400 uppercase tracking-wide mb-1">WhatsApp</div>
                      <div className="font-inter font-semibold text-navy-950">Chat with Us</div>
                      <div className="text-slate-500 font-inter text-xs mt-0.5">Usually replies within 1 hour</div>
                    </div>
                  </a>
                </StaggerItem>

                {/* Email */}
                <StaggerItem>
                  <a
                    href="mailto:info@group24reality.com"
                    className="flex items-start gap-4 bg-sand-50 border border-sand-200 rounded-2xl p-5 hover:border-gold-400/40 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gold-400/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-gold-500" />
                    </div>
                    <div>
                      <div className="text-xs font-inter font-semibold text-slate-400 uppercase tracking-wide mb-1">Email</div>
                      <div className="font-inter font-semibold text-navy-950 text-sm break-all">info@group24reality.com</div>
                    </div>
                  </a>
                </StaggerItem>

                {/* Address */}
                <StaggerItem>
                  <div className="flex items-start gap-4 bg-sand-50 border border-sand-200 rounded-2xl p-5">
                    <div className="w-10 h-10 rounded-xl bg-gold-400/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-gold-500" />
                    </div>
                    <div>
                      <div className="text-xs font-inter font-semibold text-slate-400 uppercase tracking-wide mb-1">Office Address</div>
                      <address className="font-inter text-sm text-navy-950 not-italic leading-relaxed">
                        Plot No. 6, Basai Enclave, Part 2,<br />
                        Sector 37C, Near Corona Optus,<br />
                        Gurugram, Haryana
                      </address>
                    </div>
                  </div>
                </StaggerItem>

                {/* Hours */}
                <StaggerItem>
                  <div className="flex items-start gap-4 bg-sand-50 border border-sand-200 rounded-2xl p-5">
                    <div className="w-10 h-10 rounded-xl bg-gold-400/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-gold-500" />
                    </div>
                    <div>
                      <div className="text-xs font-inter font-semibold text-slate-400 uppercase tracking-wide mb-1">Business Hours</div>
                      <div className="font-inter text-sm text-navy-950">
                        Mon – Sat: 9:00 AM – 7:00 PM<br />
                        Sunday: By Appointment Only
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
                  <h2 className="font-playfair font-bold text-navy-950 text-2xl mb-2">
                    Send Us an Enquiry
                  </h2>
                  <p className="text-slate-500 font-inter text-sm mb-8">
                    Fill in your details and property requirement. We will get back to you within 2 hours.
                  </p>
                  <ContactForm />
                </div>
              </FadeInUp>

              {/* Map */}
              <FadeInUp>
                <div>
                  <h3 className="font-playfair font-semibold text-navy-950 text-xl mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gold-400" />
                    Our Office Location
                  </h3>
                  <div className="rounded-2xl overflow-hidden border border-sand-200 aspect-[16/7]">
                    <iframe
                      src="https://maps.google.com/maps?q=Sector+37C+Gurugram+Haryana&output=embed&z=14"
                      title="Group 24 Reality office location in Gurugram"
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

      {/* Sticky mobile call + WhatsApp bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-navy-950 border-t border-white/10 p-3 flex gap-3">
        <a
          href="tel:+919560199247"
          className="flex-1 flex items-center justify-center gap-2 bg-gold-400 text-navy-950 font-inter font-bold py-3 rounded-xl text-sm"
        >
          <Phone className="w-4 h-4" />
          Call Now
        </a>
        <a
          href={whatsappLink('Hello, I want to enquire about properties.')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-inter font-bold py-3 rounded-xl text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
      </div>
    </>
  );
}
