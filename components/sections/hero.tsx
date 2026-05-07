'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useI18n } from '@/lib/i18n/context';

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.from('.hero-eyebrow', { y: 24, opacity: 0, duration: 0.9 })
      .from('.hero-name', { y: 40, opacity: 0, duration: 1.2 }, '-=0.5')
      .from('.hero-separator', { scaleX: 0, opacity: 0, duration: 0.8 }, '-=0.6')
      .from('.hero-cities', { y: 16, opacity: 0, duration: 0.8 }, '-=0.4')
      .from('.hero-scroll', { y: 20, opacity: 0, duration: 0.6 }, '-=0.3');
  }, { scope: container });

  return (
    <section
      id="hero"
      ref={container}
      className="relative min-h-[100svh] bg-bg-dark overflow-hidden flex items-center justify-center"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-dark via-bg-dark/95 to-bg-dark/90" />

      <div className="relative z-10 text-center px-6">
        <p className="hero-eyebrow font-cinzel text-gold text-xs tracking-[0.22em] uppercase mb-6 font-medium">
          {t('hero.title')}
        </p>

        <h1 className="hero-name font-cinzel text-[clamp(2.4rem,7vw,5.5rem)] text-text-primary leading-tight tracking-wide font-semibold">
          {t('hero.name')}
        </h1>

        <div className="hero-separator flex items-center justify-center gap-4 my-6">
          <div className="w-12 h-[1px] bg-gold" />
          <svg width="8" height="8" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3" fill="currentColor" className="text-gold" />
          </svg>
          <div className="w-12 h-[1px] bg-gold" />
        </div>

        <p className="hero-cities font-cinzel text-[11px] tracking-[0.2em] uppercase text-muted">
          {t('hero.cities')}
        </p>
      </div>

      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-cinzel text-[9px] tracking-[0.2em] uppercase text-muted">
          {t('hero.scrollHint')}
        </span>
        <div className="w-[1px] h-8 bg-gold/60 animate-pulse" />
      </div>
    </section>
  );
}
