'use client';

import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getCatalogPdfUrl } from '@/lib/utils/media';

gsap.registerPlugin(ScrollTrigger);

export default function Catalog() {
  const [isOpen, setIsOpen] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const pdfUrl = getCatalogPdfUrl();

  useGSAP(() => {
    gsap.from('.catalog-content', {
      scrollTrigger: {
        trigger: '.catalog-content',
        start: 'top 85%',
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, { scope: container });

  const handleOpenNewTab = () => {
    window.open(pdfUrl, '_blank');
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'fatosyilmazcasting-catalog.pdf';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <section id="catalog" ref={container} className="py-24 md:py-32 px-6 md:px-12 bg-bg">
      <div className="max-w-3xl mx-auto text-center catalog-content">
        <p className="font-cinzel text-[11px] tracking-[0.2em] uppercase text-gold mb-4 font-medium">
          Kadro
        </p>
        <h2 className="font-cinzel text-3xl md:text-4xl text-text-primary tracking-wide font-semibold mb-6">
          Yetenek Kataloğu
        </h2>
        <p className="font-crimson text-muted leading-relaxed max-w-lg mx-auto mb-10">
          Bünyemizde çalışan oyuncuların cast bilgileri ve görsellerini içeren
          kapsamlı katalog.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="font-cinzel text-xs tracking-[0.16em] uppercase text-bg bg-gold px-8 py-3 hover:bg-gold/80 transition-all duration-300"
          >
            Kataloğu Görüntüle
          </button>
          <button
            onClick={handleOpenNewTab}
            className="font-cinzel text-xs tracking-[0.16em] uppercase text-text-secondary border border-gold/40 px-8 py-3 hover:bg-gold/10 transition-all duration-300"
          >
            Yeni Sekmede Aç
          </button>
          <button
            onClick={handleDownload}
            className="font-cinzel text-xs tracking-[0.16em] uppercase text-muted px-8 py-3 hover:text-gold transition-colors duration-300 flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 3v13M5 12l7 7 7-7M4 21h16" />
            </svg>
            İndir
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={() => { setIsOpen(false); setPdfLoaded(false); }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-5xl h-[85vh] bg-white rounded-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-3 bg-bg-dark">
              <span className="font-cinzel text-xs tracking-[0.16em] uppercase text-white">
                Yetenek Kataloğu
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownload}
                  className="text-gold/80 hover:text-gold transition-colors text-xs font-cinzel tracking-wider uppercase"
                >
                  İndir
                </button>
                <button
                  onClick={() => { setIsOpen(false); setPdfLoaded(false); }}
                  className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  aria-label="Kapat"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {!pdfLoaded && (
              <div className="absolute inset-0 top-[44px] bg-bg flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                <span className="font-cinzel text-xs tracking-[0.16em] uppercase text-muted">
                  Katalog yükleniyor...
                </span>
              </div>
            )}

            <object
              data={pdfUrl}
              type="application/pdf"
              className="w-full h-[calc(100%-44px)]"
              onLoad={() => setPdfLoaded(true)}
            >
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <p className="font-crimson text-text-secondary text-lg mb-4">
                  PDF görüntülenemiyor.
                </p>
                <button
                  onClick={handleOpenNewTab}
                  className="font-cinzel text-xs tracking-[0.16em] uppercase text-gold border border-gold/40 px-6 py-2 hover:bg-gold/10 transition-all"
                >
                  Yeni Sekmede Aç
                </button>
              </div>
            </object>
          </div>
        </div>
      )}
    </section>
  );
}
