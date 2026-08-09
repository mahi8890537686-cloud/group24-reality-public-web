'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MapPin, Shield } from 'lucide-react';
import { AnimatedHeroBackground } from './AnimatedHeroBackground';

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden"
      aria-label="Hero — Group24 Reality"
    >
      <AnimatedHeroBackground />

      {/* Decorative gold line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-gold to-transparent z-10" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="max-w-2xl xl:max-w-3xl">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-gold text-xs font-inter font-semibold tracking-widest uppercase mb-3"
          >
            Group24 Reality
          </motion.p>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-5"
          >
            <Shield className="w-4 h-4 text-gold" />
            <span className="text-white text-xs sm:text-sm font-inter font-medium">
              Verified Properties · Transparent Pricing · Local Expertise
            </span>
          </motion.div>

          {/* H1 Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-white leading-tight text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-5"
          >
            Find Your Perfect{' '}
            <span className="text-gold">Plot, Villa</span>
            {' '}or Flat in{' '}
            <span className="text-gold">Behror, Neemrana</span>
            {' '}&amp; Kotputli
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-white/80 text-base sm:text-lg lg:text-xl font-inter leading-relaxed mb-6 max-w-xl"
          >
            Trusted real estate dealer in Rajasthan. We connect you with verified properties
            at fair prices — from affordable plots to premium villas on the Delhi–Jaipur corridor.
          </motion.p>

          {/* Location Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {['Behror', 'Neemrana', 'Kotputli'].map((loc) => (
              <span
                key={loc}
                className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-white text-xs font-inter"
              >
                <MapPin className="w-3 h-3 text-gold" />
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
              className="group inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-ink font-inter font-bold px-7 py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-gold/30 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink text-sm sm:text-base"
            >
              Explore Properties
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-inter font-semibold px-7 py-4 rounded-xl transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white text-sm sm:text-base"
            >
              Schedule a Site Visit
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-6"
          >
            {[
              { label: 'Properties Listed', value: '150+' },
              { label: 'Happy Families', value: '500+' },
              { label: 'Locations Served', value: '3' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-serif text-gold">
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
