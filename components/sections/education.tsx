'use client';

import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SafeImage from '@/components/shared/safe-image';
import { getMediaUrl } from '@/lib/utils/media';
import { useI18n } from '@/lib/i18n/context';
import educationData from '@/data/education.json';

gsap.registerPlugin(ScrollTrigger);

const cities = ['İstanbul', 'Zurich', 'Berlin', 'Amsterdam'] as const;
type City = (typeof cities)[number];

type EducationItem = typeof educationData.education_gallery[number];

export default function Education() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  const educationItems = educationData.education_gallery;

  const cityGroups: Record<City, EducationItem[]> = {
    'İstanbul': educationItems.filter((item) => item.location === 'İstanbul'),
    'Zurich': educationItems.filter((item) => item.location === 'Zurich'),
    'Berlin': educationItems.filter((item) => item.location === 'Berlin'),
    'Amsterdam': educationItems.filter((item) => item.location === 'Amsterdam'),
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
          <p className="font-cinzel text-[11px] tracking-[0.2em] uppercase text-gold mb-4 font-medium">
            {t('education.eyebrow')}
          </p>
          <h2 className="font-cinzel text-3xl md:text-4xl text-text-primary tracking-wide font-semibold">
            {t('education.title')}
          </h2>
          <p className="font-crimson text-muted mt-4 max-w-lg mx-auto">
            {t('education.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cities.map((city) => {
            const items = cityGroups[city];
            const coverImage = items[0];

            return (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className="edu-city group relative overflow-hidden cursor-pointer text-left"
                style={{ aspectRatio: '4/3' }}
              >
                {coverImage ? (
                  <SafeImage
                    src={getMediaUrl(coverImage.file_name, 'education')}
                    alt={coverImage.title || city}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    fallbackClassName="absolute inset-0"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted/20" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-bg-dark/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-cinzel text-white text-xl tracking-wide font-medium">
                    {city}
                  </h3>
                  {coverImage?.title && (
                    <p className="font-crimson text-gold/80 text-sm mt-1">
                      {coverImage.title}
                    </p>
                  )}
                  <p className="font-crimson text-white/50 text-xs mt-1">
                    {items.length} {t('education.events')}
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
              aria-label={t('common.close')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="p-8 md:p-12">
              <h3 className="font-cinzel text-2xl text-text-primary tracking-wide font-semibold mb-2">
                {selectedCity}
              </h3>
              <div className="w-8 h-[1px] bg-gold mb-8" />

              <div className="columns-2 md:columns-3 gap-3 space-y-3">
                {cityGroups[selectedCity].map((item) => (
                  <div key={item.id} className="break-inside-avoid mb-3 relative group">
                    <img
                      src={getMediaUrl(item.file_name, 'education')}
                      alt={item.title || selectedCity}
                      className="w-full rounded-sm"
                      loading="lazy"
                    />
                    {item.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="font-cinzel text-white text-[10px] tracking-wider leading-tight">
                          {item.title}
                        </p>
                        {item.year && (
                          <p className="font-crimson text-gold/70 text-[9px] mt-0.5">
                            {item.year}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {cityGroups[selectedCity].length === 0 && (
                <p className="font-crimson text-muted italic text-center py-12">
                  {t('education.comingSoon')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
