'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Phone, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface LeadFormProps {
  propertyTitle: string;
  propertySlug: string;
}

export default function LeadForm({ propertyTitle, propertySlug }: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setSubmitError('');
    try {
      const res = await fetch('/api/public/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'lead',
          name: data.name,
          phone: data.phone,
          message: data.message,
          propertyTitle,
          propertySlug,
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setSubmitError('Something went wrong. Please call or WhatsApp us directly.');
    }
  };

  const waMessage = `Hello Sunil ji, I am interested in: ${propertyTitle}. Please share more details.`;

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="font-serif font-bold text-ink text-xl mb-2">Enquiry Sent!</h3>
        <p className="text-slate-600 font-inter text-sm">
          Thank you for your interest. Sunil Sangwan will contact you within 2 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-ink rounded-2xl p-6 text-white">
      <h3 className="font-serif font-bold text-xl mb-1">Enquire About This Property</h3>
      <p className="text-white/60 font-inter text-sm mb-5">
        Get a callback from our property expert within 2 hours.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {submitError && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-red-300 text-xs font-inter">{submitError}</p>
          </div>
        )}
        <div>
          <label htmlFor="lead-name" className="sr-only">Your Name</label>
          <input
            id="lead-name"
            type="text"
            placeholder="Your Name *"
            {...register('name')}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
          />
          {errors.name && <p className="mt-1 text-red-400 text-xs font-inter">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="lead-phone" className="sr-only">Mobile Number</label>
          <input
            id="lead-phone"
            type="tel"
            placeholder="Mobile Number (10 digits) *"
            {...register('phone')}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            maxLength={10}
          />
          {errors.phone && <p className="mt-1 text-red-400 text-xs font-inter">{errors.phone.message}</p>}
        </div>

        <div>
          <label htmlFor="lead-message" className="sr-only">Message</label>
          <textarea
            id="lead-message"
            placeholder="Any specific requirements? (optional)"
            {...register('message')}
            rows={3}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-ink font-inter font-bold py-3.5 px-6 rounded-xl transition-all duration-200 active:scale-[0.97] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          {isSubmitting ? (
            <span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
          ) : <Send className="w-4 h-4" />}
          {isSubmitting ? 'Sending…' : 'Send Enquiry'}
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/30 text-xs font-inter">or contact directly</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href="tel:+919266982400"
          className="flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white hover:bg-white/5 font-inter font-semibold text-sm py-3 px-4 rounded-xl transition-all"
        >
          <Phone className="w-4 h-4" />
          Call Now
        </a>
        <a
          href={whatsappLink(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366]/20 border border-[#25D366]/30 hover:bg-[#25D366]/30 text-white font-inter font-semibold text-sm py-3 px-4 rounded-xl transition-all"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366]" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
