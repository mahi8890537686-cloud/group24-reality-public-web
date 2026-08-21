'use client';

import { useState } from 'react';
import { CheckCircle2, Sparkles, Send, Loader2 } from 'lucide-react';

interface LeadCaptureFormProps {
  blogTitle: string;
  locationSlug?: string;
}

export default function LeadCaptureForm({ blogTitle, locationSlug }: LeadCaptureFormProps) {
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', message: '' });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState('');

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSubmitting(true);
    setLeadError('');
    try {
      const res = await fetch('/api/public/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'enquiry',
          name: leadForm.name,
          phone: leadForm.phone,
          location: locationSlug,
          message: leadForm.message || `Inquiry from blog article: ${blogTitle}`,
        }),
      });
      if (!res.ok) throw new Error();
      setLeadSuccess(true);
      setLeadForm({ name: '', phone: '', message: '' });
    } catch {
      setLeadError('Something went wrong. Please call or WhatsApp us directly.');
    } finally {
      setLeadSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md mb-16">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gold/10 text-gold-dark rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-serif text-gray-900">
            Interested in Real Estate Opportunities?
          </h3>
          <p className="text-sm text-gray-500 font-inter">
            Have questions about this article or want expert advice on property investments? Fill in your details below.
          </p>
        </div>

        {leadSuccess ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-emerald-900 font-inter text-base">Inquiry Submitted!</h4>
            <p className="text-xs text-emerald-700 font-inter">
              Thank you! Our property advisory team will call you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleLeadSubmit} className="space-y-4">
            {leadError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-xs text-red-600 font-inter">{leadError}</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 font-inter mb-1">
                  Your Name *
                </label>
                <input
                  required
                  type="text"
                  value={leadForm.name}
                  onChange={(e) => setLeadForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Rajesh Kumar"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-inter focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 font-inter mb-1">
                  Phone Number *
                </label>
                <input
                  required
                  type="tel"
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-inter focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 font-inter mb-1">
                Message / Question
              </label>
              <textarea
                rows={3}
                value={leadForm.message}
                onChange={(e) => setLeadForm((f) => ({ ...f, message: e.target.value }))}
                placeholder={`I would like more information about properties in ${locationSlug || 'this area'}...`}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-inter focus:outline-none focus:ring-2 focus:ring-gold resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={leadSubmitting}
              className="w-full py-3 bg-ink hover:bg-charcoal text-white font-bold rounded-xl text-xs font-inter transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {leadSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit Inquiry
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
