'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const prev = () => setSelected((s) => (s - 1 + images.length) % images.length);
  const next = () => setSelected((s) => (s + 1) % images.length);

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <div
          className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-sand-100 cursor-zoom-in group"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={images[selected]}
            alt={`${alt} — image ${selected + 1}`}
            fill
            className="object-cover"
            priority={selected === 0}
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
          </div>
          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-inter px-3 py-1 rounded-full">
                {selected + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`relative w-20 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
                  i === selected ? 'border-gold-400' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                aria-label={`View image ${i + 1}`}
                aria-pressed={i === selected}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>
            <div
              className="relative w-full max-w-5xl aspect-[16/9]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selected]}
                alt={`${alt} — image ${selected + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
