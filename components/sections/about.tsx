'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '@/lib/i18n/context';
import SafeImage from '@/components/shared/safe-image';
import { getMediaUrl } from '@/lib/utils/media';
import heroData from '@/data/hero.json';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const container = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  const photoUrl = getMediaUrl(heroData.profile.fileName);

  useGSAP(() => {
    // Quote slide-up animation
    gsap.from('.about-quote', {
      scrollTrigger: {
        trigger: '.about-quote',
        start: 'top 80%',
      },
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });

    // Photo fade-in
    gsap.from('.about-photo', {
      scrollTrigger: {
        trigger: '.about-photo',
        start: 'top 85%',
      },
      opacity: 0,
      scale: 0.95,
      duration: 1,
      ease: 'power3.out',
    });

    // Bio text fade-in
    gsap.from('.about-bio', {
      scrollTrigger: {
        trigger: '.about-bio',
        start: 'top 85%',
      },
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, { scope: container });

  return (
    <section id="about" ref={container} className="py-24 md:py-32 px-6 md:px-12 bg-bg">
      <div className="max-w-5xl mx-auto">
        {/* Section header — centered */}
        <div className="text-center mb-16">
          <p className="font-cinzel text-[11px] tracking-[0.2em] uppercase text-gold mb-4 font-medium">
            {t('about.eyebrow')}
          </p>
          <h2 className="font-cinzel text-3xl md:text-4xl text-text-primary tracking-wide font-semibold">
            {t('about.title')}
          </h2>
        </div>

        {/* Two-column layout: photo + bio */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-16">
          {/* Left column — portrait photo */}
          <div className="about-photo flex-shrink-0 mx-auto md:mx-0">
            <div className="relative w-64 md:w-72 aspect-[3/4] overflow-hidden rounded-sm shadow-lg">
              <SafeImage
                src={photoUrl}
                alt={heroData.profile.altText}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 256px, 288px"
              />
            </div>
          </div>

          {/* Right column — bio + quote */}
          <div className="flex-1 text-center md:text-left">
            <p className="about-bio font-crimson text-text-secondary leading-relaxed text-base md:text-lg mb-12">
              {t('about.bio')}
            </p>

            <blockquote className="about-quote">
              <p className="font-crimson text-xl md:text-2xl text-text-secondary italic leading-relaxed">
                &ldquo;{t('about.quote')}&rdquo;
              </p>
              <cite className="block mt-4 font-cinzel text-xs tracking-[0.16em] uppercase text-muted not-italic">
                — {t('about.quoteAttribution')}
              </cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
