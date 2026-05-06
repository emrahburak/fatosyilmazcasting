'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getMediaUrl } from '@/lib/utils/media';
import educationData from '@/data/education.json';

gsap.registerPlugin(ScrollTrigger);

const cities = ['İstanbul', 'Zurich', 'Berlin', 'Amsterdam'] as const;
type City = (typeof cities)[number];

export default function Education() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const container = useRef<HTMLDivElement>(null);

  const educationItems = educationData.education_gallery;

  const itemsPerCity = Math.ceil(educationItems.length / cities.length);
  const cityImages: Record<City, typeof educationItems> = {
    'İstanbul': educationItems.slice(0, itemsPerCity),
    'Zurich': educationItems.slice(itemsPerCity, itemsPerCity * 2),
    'Berlin': educationItems.slice(itemsPerCity * 2, itemsPerCity * 3),
    'Amsterdam': educationItems.slice(itemsPerCity * 3),
  };

  useGSAP(() => {
    gsap.utils.toArray('.edu-city').forEach((item) => {
      gsap.from(item as Element, {
        scrollTrigger: {
          trigger: item as Element,
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    });
  }, { scope: container });

  return (
    <section id="education" ref={container} className="py-24 md:py-32 px-6 md:px-12 bg-bg">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-cinzel text-[11px] tracking-[0.2em] uppercase text-gold mb-4">
            Atölyeler
          </p>
          <h2 className="font-cinzel text-3xl md:text-4xl text-text-primary tracking-wide">
            Eğitimler
          </h2>
          <p className="font-crimson text-muted mt-4 max-w-lg mx-auto">
            Uluslararası cast direktörlüğü atölyeleri ve oyuncu gelişim programları.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cities.map((city) => {
            const images = cityImages[city];
            const coverImage = images[0];

            return (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className="edu-city group relative overflow-hidden cursor-pointer text-left"
                style={{ aspectRatio: '4/3' }}
              >
                {coverImage ? (
                  <Image
                    src={getMediaUrl(coverImage.file_name, 'education')}
                    alt={city}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted/20" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-bg-dark/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-cinzel text-white text-xl tracking-wide">
                    {city}
                  </h3>
                  <p className="font-crimson text-gold/80 text-sm mt-1">
                    {images.length} görsel
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedCity && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedCity(null)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-bg rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCity(null)}
              className="sticky top-0 right-0 z-10 float-right m-4 w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Kapat"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="p-8 md:p-12">
              <h3 className="font-cinzel text-2xl text-text-primary tracking-wide mb-2">
                {selectedCity}
              </h3>
              <div className="w-8 h-[1px] bg-gold mb-8" />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {cityImages[selectedCity].map((item) => (
                  <div key={item.id} className="relative aspect-square bg-muted/10">
                    <Image
                      src={getMediaUrl(item.file_name, 'education')}
                      alt={item.title || selectedCity}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              {cityImages[selectedCity].length === 0 && (
                <p className="font-crimson text-muted italic text-center py-12">
                  İçerik yakında eklenecek.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
