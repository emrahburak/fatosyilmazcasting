'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SafeImage from '@/components/shared/safe-image';
import { getMediaUrl } from '@/lib/utils/media';
import { ProjectSchema, type Project } from '@/lib/validations/project';
import { useI18n } from '@/lib/i18n/context';
import projectsData from '@/data/projects.json';

gsap.registerPlugin(ScrollTrigger);

const FEATURED_COUNT = 6;

function parseProjects(): Project[] {
  return projectsData
    .map((p) => ProjectSchema.safeParse(p))
    .filter((r): r is { success: true; data: Project } => r.success)
    .map((r) => r.data)
    .sort((a, b) => {
      if (!a.fileName && !b.fileName) {
        if (!a.year && !b.year) return 0;
        if (!a.year) return 1;
        if (!b.year) return -1;
        return parseInt(b.year, 10) - parseInt(a.year, 10);
      }
      if (!a.fileName) return 1;
      if (!b.fileName) return -1;
      if (!a.year && !b.year) return 0;
      if (!a.year) return 1;
      if (!b.year) return -1;
      return parseInt(b.year, 10) - parseInt(a.year, 10);
    });
}

export default function Filmography() {
  const { t } = useI18n();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAll, setShowAll] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const allProjects = parseProjects();
  const featured = allProjects.slice(0, FEATURED_COUNT);
  const remaining = allProjects.slice(FEATURED_COUNT);
  const displayProjects = showAll ? allProjects : featured;

  useGSAP(() => {
    // Initial poster reveal
    gsap.utils.toArray('.poster-item').forEach((item, i) => {
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

  // Animate newly revealed posters on expand
  useEffect(() => {
    if (showAll && gridRef.current) {
      const extraPosters = gridRef.current.querySelectorAll('.poster-item[data-extra="true"]');
      gsap.fromTo(extraPosters,
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

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <section id="filmography" ref={container} className="py-24 md:py-32 px-6 md:px-12 bg-bg-dark">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-cinzel text-[11px] tracking-[0.2em] uppercase text-gold mb-4 font-medium">
            {t('filmography.eyebrow')}
          </p>
          <h2 className="font-cinzel text-3xl md:text-4xl text-white tracking-wide font-semibold">
            {t('filmography.title')}
          </h2>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
          {displayProjects.map((project, index) => {
            const hasPoster = !!project.fileName;
            const isExtra = index >= FEATURED_COUNT;

            return (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`poster-item relative group overflow-hidden cursor-pointer bg-bg-dark/50 ${!showAll && index >= 3 ? 'hidden sm:block' : ''}`}
                style={{ aspectRatio: '3/4', maxWidth: '340px', width: '100%', margin: '0 auto' }}
                data-extra={isExtra ? 'true' : 'false'}
              >
                {hasPoster ? (
                  <>
                    <SafeImage
                      src={getMediaUrl(project.fileName, 'afis')}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      fallbackClassName="absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-bg-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="font-cinzel text-white text-sm md:text-base tracking-wide font-medium">
                        {project.title}
                      </h3>
                      <p className="font-crimson text-gold/80 text-xs mt-1">
                        {project.year ?? '—'} · {project.type}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Image
                      src="/placeholder-poster.svg"
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-bg-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="font-cinzel text-white text-sm md:text-base tracking-wide font-medium">
                        {project.title}
                      </h3>
                      <p className="font-crimson text-gold/80 text-xs mt-1">
                        {project.year ?? '—'} · {project.type}
                      </p>
                    </div>
                  </>
                )}
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
                ? t('filmography.collapse')
                : `${t('filmography.showAll')} (${remaining.length})`
              }
            </button>
          </div>
        )}
      </div>

      {selectedProject && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex justify-end"
          onClick={() => setSelectedProject(null)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <div
            className="relative w-full max-w-lg bg-bg-dark h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label={t('common.close')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="relative aspect-[3/4]">
              {selectedProject.fileName ? (
                <SafeImage
                  src={getMediaUrl(selectedProject.fileName, 'afis')}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                  fallbackClassName="absolute inset-0"
                />
              ) : (
                <Image
                  src="/placeholder-poster.svg"
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <div className="p-8 md:p-12">
              <h3 className="font-cinzel text-2xl md:text-3xl text-white tracking-wide font-semibold mb-2">
                {selectedProject.title}
              </h3>
              <div className="w-8 h-[1px] bg-gold mb-6" />

              <dl className="space-y-4 font-crimson text-text-secondary">
                <div>
                  <dt className="font-cinzel text-[10px] tracking-[0.16em] uppercase text-gold mb-1">
                    {t('filmography.year')}
                  </dt>
                  <dd className="text-white">{selectedProject.year ?? '—'}</dd>
                </div>
                <div>
                  <dt className="font-cinzel text-[10px] tracking-[0.16em] uppercase text-gold mb-1">
                    {t('filmography.type')}
                  </dt>
                  <dd className="text-white">{selectedProject.type}</dd>
                </div>
                {selectedProject.director && (
                  <div>
                    <dt className="font-cinzel text-[10px] tracking-[0.16em] uppercase text-gold mb-1">
                      {t('filmography.director')}
                    </dt>
                    <dd className="text-white">{selectedProject.director}</dd>
                  </div>
                )}
                {selectedProject.production && (
                  <div>
                    <dt className="font-cinzel text-[10px] tracking-[0.16em] uppercase text-gold mb-1">
                      {t('filmography.production')}
                    </dt>
                    <dd className="text-white">{selectedProject.production}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
