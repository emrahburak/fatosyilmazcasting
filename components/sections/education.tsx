'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SafeImage from '@/components/shared/safe-image';
import { getMediaUrl } from '@/lib/utils/media';
import { useI18n } from '@/lib/i18n/context';
import educationData from '@/data/education.json';

gsap.registerPlugin(ScrollTrigger);

const FEATURED_COUNT = 6;

type EducationItem = typeof educationData.education_gallery[number];

export default function Education() {
  const { t } = useI18n();
  const [showAll, setShowAll] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const allItems = educationData.education_gallery;
  const featured = allItems.slice(0, FEATURED_COUNT);
  const remaining = allItems.slice(FEATURED_COUNT);
  const displayItems = showAll ? allItems : featured;

  const currentItem = currentIndex !== null ? allItems[currentIndex] : null;

  const goNext = useCallback(() => {
    if (currentIndex === null) return;
    setCurrentIndex((currentIndex + 1) % allItems.length);
  }, [currentIndex, allItems.length]);

  const goPrev = useCallback(() => {
    if (currentIndex === null) return;
    setCurrentIndex((currentIndex - 1 + allItems.length) % allItems.length);
  }, [currentIndex, allItems.length]);

  useGSAP(() => {
    gsap.utils.toArray('.edu-item').forEach((item, i) => {
      gsap.from(item as Element, {
        scrollTrigger: {
          trigger: item as Element,
          start: 'top 90%',
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        delay: (i % 3) * 0.1,
        ease: 'power3.out',
      });
    });
  }, { scope: container });

  useEffect(() => {
    if (showAll && gridRef.current) {
      const extraItems = gridRef.current.querySelectorAll('.edu-item[data-extra="true"]');
      gsap.fromTo(extraItems,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.06,
          ease: 'power3.out',
        }
      );
    }
  }, [showAll]);

  // Modal open/close animation
  useEffect(() => {
    if (currentIndex !== null && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (currentIndex === null) return;
      if (e.key === 'Escape') setCurrentIndex(null);
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex, goNext, goPrev]);

  return (
    <section id="education" ref={container} className="py-24 md:py-32 px-6 md:px-12 bg-bg-dark">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-cinzel text-[11px] tracking-[0.2em] uppercase text-gold mb-4 font-medium">
            {t('education.eyebrow')}
          </p>
          <h2 className="font-cinzel text-3xl md:text-4xl text-white tracking-wide font-semibold">
            {t('education.title')}
          </h2>
          <p className="font-crimson text-muted mt-4 max-w-lg mx-auto">
            {t('education.description')}
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
          {displayItems.map((item, index) => {
            const isExtra = index >= FEATURED_COUNT;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(allItems.findIndex((a) => a.id === item.id))}
                className={`edu-item relative group overflow-hidden cursor-pointer bg-bg-dark/50 ${!showAll && index >= 3 ? 'hidden sm:block' : ''}`}
                style={{ aspectRatio: '3/4', maxWidth: '340px', width: '100%', margin: '0 auto' }}
                data-extra={isExtra ? 'true' : 'false'}
              >
                <SafeImage
                  src={getMediaUrl(item.file_name, 'education')}
                  alt={item.title || 'Education'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  fallbackClassName="absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-bg-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-cinzel text-white text-sm md:text-base tracking-wide font-medium whitespace-pre-line">
                    {item.title}
                  </h3>
                  {item.location && (
                    <p className="font-crimson text-gold/80 text-xs mt-1">
                      {item.location}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {remaining.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="font-cinzel text-xs tracking-[0.16em] uppercase text-gold border border-gold/40 px-8 py-3 hover:bg-gold/10 hover:border-gold hover:shadow-[0_0_20px_rgba(201,169,110,0.1)] transition-all duration-500"
            >
              {showAll
                ? t('education.collapse')
                : `${t('education.showAll')} (${remaining.length})`
              }
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {currentIndex !== null && currentItem && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-20"
          onClick={() => setCurrentIndex(null)}
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

          <div
            ref={modalRef}
            className="relative w-full h-full md:h-auto md:max-w-5xl md:max-h-[75vh] flex flex-col bg-[#f5f0e8] md:rounded-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setCurrentIndex(null)}
              className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center text-bg-dark/50 hover:text-bg-dark transition-colors"
              aria-label={t('common.close')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Image area */}
            <div className="relative flex-1 min-h-0">
              {/* Mobile arrows - overlay on image */}
              <button
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 sm:hidden w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white active:scale-95 transition-transform"
                aria-label={t('education.prev')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <button
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 sm:hidden w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white active:scale-95 transition-transform"
                aria-label={t('education.next')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              {/* Image - absolute fill on mobile */}
              <div className="absolute inset-0 sm:relative sm:inset-auto sm:aspect-[16/9]">
                <SafeImage
                  src={getMediaUrl(currentItem.file_name, 'education')}
                  alt={currentItem.title || 'Education'}
                  fill
                  className="object-contain bg-[#f5f0e8]"
                  sizes="(max-width: 640px) 100vw, 80vw"
                />
              </div>

              {/* Desktop arrows - outside image */}
              <button
                onClick={goPrev}
                className="hidden sm:inline-flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-gold/50 items-center justify-center text-gold hover:bg-gold/10 hover:scale-110 transition-all duration-300"
                aria-label={t('education.prev')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <button
                onClick={goNext}
                className="hidden sm:inline-flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-gold/50 items-center justify-center text-gold hover:bg-gold/10 hover:scale-110 transition-all duration-300"
                aria-label={t('education.next')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Info */}
            <div className="px-5 py-4 md:px-8 md:py-5 flex-shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-cinzel text-sm md:text-base text-bg-dark tracking-wide font-semibold whitespace-pre-line leading-snug">
                    {currentItem.title}
                  </h3>
                  {currentItem.location && (
                    <p className="font-crimson text-gold/80 text-xs mt-1">
                      {currentItem.location}
                    </p>
                  )}
                </div>
                <p className="font-cinzel text-[10px] tracking-[0.16em] uppercase text-bg-dark/40 flex-shrink-0">
                  {currentIndex + 1} / {allItems.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
