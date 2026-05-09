'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '@/lib/i18n/context';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const { t } = useI18n();
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.contact-content', {
      scrollTrigger: {
        trigger: '.contact-content',
        start: 'top 85%',
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, { scope: container });

  return (
    <section id="contact" ref={container} className="py-24 md:py-32 px-6 md:px-12 bg-bg">
      <div className="max-w-2xl mx-auto text-center contact-content">
        <p className="font-cinzel text-[11px] tracking-[0.2em] uppercase text-gold mb-4 font-medium">
          {t('contact.eyebrow')}
        </p>
        <h2 className="font-cinzel text-3xl md:text-4xl text-text-primary tracking-wide font-semibold mb-10">
          {t('contact.title')}
        </h2>

        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-16 h-[1px] bg-gold/40" />
          <svg width="6" height="6" viewBox="0 0 6 6">
            <circle cx="3" cy="3" r="2" fill="currentColor" className="text-gold" />
          </svg>
          <div className="w-16 h-[1px] bg-gold/40" />
        </div>

        <div className="space-y-6">
          <a
            href="https://www.instagram.com/fatosyilmazmanagement/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 font-crimson text-xl text-text-secondary hover:text-gold transition-colors duration-300 group"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:text-gold transition-colors">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            <span>@fatosyilmazmanagement</span>
          </a>

          <a
            href="mailto:info@fatosyilmazcasting.com"
            className="block font-crimson text-xl text-text-secondary hover:text-gold transition-colors duration-300"
          >
            info@fatosyilmazcasting.com
          </a>
        </div>

        <div className="mt-20 pt-8 border-t border-gold/20">
          <p className="font-cinzel text-[10px] tracking-[0.16em] uppercase text-muted">
            {t('contact.copyright')}
          </p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <a
              href="/privacy"
              className="font-cinzel text-[11px] tracking-wider text-muted/60 hover:text-gold transition-colors duration-300"
            >
              {t('contact.privacy')}
            </a>
            <span className="text-muted/30">|</span>
            <a
              href="https://github.com/emrahburak"
              target="_blank"
              rel="noopener noreferrer"
              className="font-cinzel text-[11px] tracking-wider text-muted/40 hover:text-bg-dark transition-colors duration-300"
            >
              developed by emrahburak
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
