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
  const { t, locale } = useI18n();
  const [showAll, setShowAll] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [swipeHintShown, setSwipeHintShown] = useState(false);
  const [slideDirection, setSlideDirection] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);
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
    setSlideDirection(1);
    setCurrentIndex((currentIndex + 1) % allItems.length);
  }, [currentIndex, allItems.length]);

  const goPrev = useCallback(() => {
    if (currentIndex === null) return;
    setSlideDirection(-1);
    setCurrentIndex((currentIndex - 1 + allItems.length) % allItems.length);
  }, [currentIndex, allItems.length]);

  const goToIndex = useCallback((newIndex: number) => {
    if (currentIndex === null || newIndex === currentIndex) return;
    setSlideDirection(newIndex > currentIndex ? 1 : -1);
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  const getTitle = (item: EducationItem) =>
    locale === 'en' ? (item.title_en || item.title) : item.title;

  const getLocation = (item: EducationItem) =>
    locale === 'en' ? (item.location_en || item.location) : item.location;

  const SWIPE_THRESHOLD = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) < SWIPE_THRESHOLD) return;
    if (diff > 0) goNext();
    else goPrev();
    setTouchStartX(0);
    setTouchEndX(0);
  };

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

  // Swipe hint animation — plays once on first modal open
  useEffect(() => {
    if (currentIndex !== null && !swipeHintShown && slideRef.current) {
      setSwipeHintShown(true);
      gsap.fromTo(slideRef.current,
        { x: 0 },
        {
          x: 15,
          duration: 0.35,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(slideRef.current, {
              x: -15,
              duration: 0.35,
              ease: 'power2.out',
              onComplete: () => {
                gsap.to(slideRef.current, {
                  x: 0,
                  duration: 0.3,
                  ease: 'power2.out',
                });
              },
            });
          },
        }
      );
    }
  }, [currentIndex, swipeHintShown]);

  // Slide transition animation
  useEffect(() => {
    if (slideDirection === 0 || !slideRef.current) return;
    gsap.fromTo(slideRef.current,
      { x: `${slideDirection * 100}%` },
      {
        x: '0%',
        duration: 0.35,
        ease: 'power3.out',
        onComplete: () => setSlideDirection(0),
      }
    );
  }, [currentIndex, slideDirection]);

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
                  alt={getTitle(item) || 'Education'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  fallbackClassName="absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-bg-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-cinzel text-white text-sm md:text-base tracking-wide font-medium whitespace-pre-line">
                    {getTitle(item)}
                  </h3>
                  {getLocation(item) && (
                    <p className="font-crimson text-gold/80 text-xs mt-1">
                      {getLocation(item)}
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
              className="font-cinzel text-xs tracking-[0.16em] uppercase text-gold border border-gold/40 px-8 py-3 hover:bg-gold/10 hover:border-gold hover:shadow-[0_0_20px_rgba(201,169,110,0.1)] transition-all duration-500 cursor-pointer"
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
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm border border-bg-dark/20 flex items-center justify-center text-bg-dark active:scale-95 hover:bg-white/80 hover:border-bg-dark/40 transition-all duration-300"
              aria-label={t('common.close')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Image area */}
            <div className="relative flex-1 min-h-0 md:pt-5">
              {/* Edge gradient hints — "there's more" */}
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/15 to-transparent pointer-events-none z-10 sm:hidden" />
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/15 to-transparent pointer-events-none z-10 sm:hidden" />

              {/* Image - absolute fill on mobile */}
              <div
                ref={slideRef}
                className="absolute inset-0 sm:relative sm:inset-auto sm:aspect-[16/9]"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <SafeImage
                  key={currentIndex}
                  src={getMediaUrl(currentItem.file_name, 'education')}
                  alt={getTitle(currentItem) || 'Education'}
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

            {/* Info — directly below image */}
            <div className="px-5 py-4 md:px-8 md:py-5 flex-shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-cinzel text-sm md:text-base text-bg-dark tracking-wide font-semibold whitespace-pre-line leading-snug">
                    {getTitle(currentItem)}
                  </h3>
                  {getLocation(currentItem) && (
                    <p className="font-crimson text-gold/80 text-xs mt-1">
                      {getLocation(currentItem)}
                    </p>
                  )}
                </div>
                <p className="font-cinzel text-[10px] tracking-[0.16em] uppercase text-bg-dark/40 flex-shrink-0">
                  {currentIndex + 1} / {allItems.length}
                </p>
              </div>
            </div>

            {/* Dot indicators — below info on mobile */}
            <div className="flex items-center justify-center gap-1.5 pb-4 sm:hidden">
              {allItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToIndex(i)}
                  className={`block h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentIndex
                      ? 'w-5 bg-gold'
                      : 'w-1.5 bg-bg-dark/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
