import Link from 'next/link';
import { Phone, MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/utils';

export default function ContactStrip() {
  return (
    <section
      className="py-16 sm:py-20 bg-navy-950 relative overflow-hidden"
      aria-labelledby="contact-strip-heading"
    >
      {/* Decorative gold blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            id="contact-strip-heading"
            className="font-playfair font-bold text-white text-3xl sm:text-4xl lg:text-5xl mb-4"
          >
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-white/70 font-inter text-base sm:text-lg mb-10 max-w-2xl mx-auto">
            Talk to Sunil Sangwan — our local property expert in Behror, Neemrana, and
            Kotputli. Free consultation, no pressure.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
            {/* Call Button */}
            <a
              href="tel:+919560199247"
              className="group flex items-center gap-3 bg-gold-400 hover:bg-gold-500 text-navy-950 font-inter font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-gold-400/30 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 text-base min-w-56"
            >
              <Phone className="w-5 h-5" />
              <div className="text-left">
                <div className="text-xs font-medium opacity-70 leading-none mb-0.5">Call Now</div>
                <div className="leading-none">+91-95601-99247</div>
              </div>
            </a>

            {/* WhatsApp Button */}
            <a
              href={whatsappLink(
                'Hello Sunil ji, I am interested in properties in Behror/Neemrana/Kotputli. Please share details.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366] hover:bg-[#22c55e] text-white font-inter font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-[#25D366]/30 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] text-base min-w-56"
            >
              <MessageCircle className="w-5 h-5" />
              <div className="text-left">
                <div className="text-xs font-medium opacity-80 leading-none mb-0.5">WhatsApp</div>
                <div className="leading-none">Chat with Us</div>
              </div>
            </a>

            {/* Enquiry Form */}
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white text-white font-inter font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:bg-white/5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white text-base"
            >
              Send an Enquiry
            </Link>
          </div>

          <p className="mt-8 text-white/30 text-xs font-inter">
            Mon – Sat: 9:00 AM – 7:00 PM · Sunday by appointment · We respond within 2 hours
          </p>
        </div>
      </div>
    </section>
  );
}
