'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
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
        <p className="font-cinzel text-[11px] tracking-[0.2em] uppercase text-gold mb-4">
          Bağlantı
        </p>
        <h2 className="font-cinzel text-3xl md:text-4xl text-text-primary tracking-wide mb-10">
          İletişim
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
            className="inline-flex items-center gap-3 font-crimson text-text-secondary hover:text-gold transition-colors duration-300 group"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:text-gold transition-colors">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            <span className="text-lg">@fatosyilmazmanagement</span>
          </a>

          <a
            href="mailto:info@fatosyilmazcasting.com"
            className="block font-crimson text-text-secondary hover:text-gold transition-colors duration-300"
          >
            info@fatosyilmazcasting.com
          </a>
        </div>

        <div className="mt-20 pt-8 border-t border-gold/20">
          <p className="font-cinzel text-[10px] tracking-[0.16em] uppercase text-muted">
            © 2024 Fatoş Yılmaz Casting. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </section>
  );
}
