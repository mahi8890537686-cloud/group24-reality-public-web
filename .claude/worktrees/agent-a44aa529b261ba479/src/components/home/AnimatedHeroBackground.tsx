'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}
function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function getReducedMotionServerSnapshot() {
  return false;
}

// Self-hosted under public/images/hero/ — avoids a third-party CDN dependency
// on the LCP-critical homepage hero.
const HERO_IMAGES = [
  '/images/hero/hero-1.jpg',
  '/images/hero/hero-2.jpg',
  '/images/hero/hero-3.jpg',
  '/images/hero/hero-4.jpg',
];

/**
 * Video-like hero background with zero video payload: a slow Ken Burns zoom on
 * each image, cross-fading between a small set on a timer, plus a subtle light
 * sweep overlay. Reads as "alive" like an autoplay video without the multi-MB
 * download — the first image loads with normal page-load priority; the rest are
 * deferred to browser idle time so they never compete with critical first paint.
 */
export function AnimatedHeroBackground() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedCount, setLoadedCount] = useState(1);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    if (reducedMotion) return;

    const hasIdleCallback = typeof window.requestIdleCallback === 'function';
    const idleId = hasIdleCallback
      ? window.requestIdleCallback(() => setLoadedCount(HERO_IMAGES.length), { timeout: 3000 })
      : window.setTimeout(() => setLoadedCount(HERO_IMAGES.length), 1500);

    const cycle = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 6000);

    return () => {
      window.clearInterval(cycle);
      if (hasIdleCallback) window.cancelIdleCallback(idleId as number);
      else window.clearTimeout(idleId);
    };
  }, [reducedMotion]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-navy-950">
      {HERO_IMAGES.slice(0, loadedCount).map((src, i) => (
        <div
          key={src}
          aria-hidden={i !== activeIndex}
          className={cn(
            'absolute inset-0 transition-opacity duration-[1800ms] ease-in-out',
            i === activeIndex ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className={cn(
              'object-cover object-center',
              !reducedMotion && i === activeIndex && 'animate-kenburns'
            )}
          />
        </div>
      ))}

      {!reducedMotion && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none animate-light-sweep bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
      )}

      {/* Gradient overlays for text legibility — unchanged from the static hero */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-navy-950/30" />
    </div>
  );
}
