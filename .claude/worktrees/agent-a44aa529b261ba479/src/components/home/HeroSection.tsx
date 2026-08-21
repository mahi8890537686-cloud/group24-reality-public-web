'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Phone, ArrowRight, MapPin, Shield } from 'lucide-react';
import { PHONE_HREF, whatsappLink } from '@/lib/utils';
import { AnimatedHeroBackground } from './AnimatedHeroBackground';

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero — Group24 Reality"
    >
      <AnimatedHeroBackground />

      {/* Decorative gold line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-gold-400 to-transparent z-10" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-2xl xl:max-w-3xl">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
          >
            <Shield className="w-4 h-4 text-gold-400" />
            <span className="text-white text-xs sm:text-sm font-inter font-medium">
              Verified Properties · Transparent Pricing · Local Expertise
            </span>
          </motion.div>

          {/* H1 Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-playfair font-bold text-white leading-tight text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-6"
          >
            Find Your Perfect{' '}
            <span className="text-gold-400">Plot, Villa</span>
            {' '}or Flat in{' '}
            <span className="text-gold-400">Behror, Neemrana</span>
            {' '}&amp; Kotputli
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-white/80 text-base sm:text-lg lg:text-xl font-inter leading-relaxed mb-8 max-w-xl"
          >
            Trusted real estate dealer in Rajasthan. We connect you with verified properties
            at fair prices — from affordable plots to premium villas on the Delhi–Jaipur corridor.
          </motion.p>

          {/* Location Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {['Behror', 'Neemrana', 'Kotputli'].map((loc) => (
              <span
                key={loc}
                className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-white text-xs font-inter"
              >
                <MapPin className="w-3 h-3 text-gold-400" />
                {loc}, Rajasthan
              </span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/properties"
              className="group inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-navy-950 font-inter font-bold px-7 py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-gold-400/30 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 text-sm sm:text-base"
            >
              Explore Properties
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-inter font-semibold px-7 py-4 rounded-xl transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white text-sm sm:text-base"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
            <a
              href={whatsappLink(
                'Hello, I want to enquire about properties in Behror/Neemrana/Kotputli.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-white font-inter font-semibold px-7 py-4 rounded-xl transition-all duration-200 active:scale-[0.97] text-sm sm:text-base"
            >
              {/* WhatsApp icon inline */}
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366]" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.304A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.63 0-3.155-.46-4.45-1.26l-.318-.19-3.295.864.88-3.22-.207-.332A7.96 7.96 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8zm4.29-5.93c-.233-.116-1.38-.68-1.593-.758-.214-.078-.37-.116-.525.116-.155.232-.601.758-.737.913-.135.155-.27.174-.502.058-.233-.116-.983-.362-1.873-1.154-.692-.617-1.16-1.38-1.296-1.612-.136-.233-.014-.358.102-.474.105-.104.233-.27.349-.407.116-.135.155-.232.233-.387.078-.155.039-.29-.02-.406-.058-.116-.525-1.265-.72-1.732-.19-.455-.383-.393-.525-.4H8.7c-.155 0-.406.058-.618.29-.213.232-.812.794-.812 1.934 0 1.14.831 2.242 1.947 3.358 1.116 1.116 2.242 1.947 3.358 1.947.564 0 1.14-.193 1.586-.58.446-.386.735-.91.75-1.274.015-.36-.019-.66-.136-.776z" />
              </svg>
              WhatsApp
            </a>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 pt-8 border-t border-white/10 grid grid-cols-3 gap-6"
          >
            {[
              { label: 'Properties Listed', value: '150+' },
              { label: 'Happy Families', value: '500+' },
              { label: 'Locations Served', value: '3' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-playfair font-bold text-gold-400">
                  {stat.value}
                </div>
                <div className="text-white/60 text-xs sm:text-sm font-inter mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-white/40 text-xs font-inter tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
