'use client';

import { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SafeImage from '@/components/shared/safe-image';
import ProjectPosterPlaceholder from '@/components/shared/project-poster-placeholder';
import { getMediaUrl } from '@/lib/utils/media';
import { ProjectSchema, type Project } from '@/lib/validations/project';
import projectsData from '@/data/projects.json';

gsap.registerPlugin(ScrollTrigger);

const FEATURED_COUNT = 12;

function parseProjects(): Project[] {
  return projectsData
    .map((p) => ProjectSchema.safeParse(p))
    .filter((r): r is { success: true; data: Project } => r.success)
    .map((r) => r.data)
    .sort((a, b) => {
      // null year goes last
      if (!a.year && !b.year) return 0;
      if (!a.year) return 1;
      if (!b.year) return -1;
      // descending: newest first
      return parseInt(b.year, 10) - parseInt(a.year, 10);
    });
}

export default function Filmography() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAll, setShowAll] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const allProjects = parseProjects();
  const featured = allProjects.slice(0, FEATURED_COUNT);
  const remaining = allProjects.slice(FEATURED_COUNT);
  const displayProjects = showAll ? allProjects : featured;

  useGSAP(() => {
    gsap.utils.toArray('.poster-item').forEach((item, i) => {
      gsap.from(item as Element, {
        scrollTrigger: {
          trigger: item as Element,
          start: 'top 90%',
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        delay: (i % 4) * 0.1,
        ease: 'power3.out',
      });
    });
  }, { scope: container });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <section id="filmography" ref={container} className="py-24 md:py-32 px-6 md:px-12 bg-bg-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-cinzel text-[11px] tracking-[0.2em] uppercase text-gold mb-4 font-medium">
            Seçki
          </p>
          <h2 className="font-cinzel text-3xl md:text-4xl text-white tracking-wide font-semibold">
            Filmografi
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {displayProjects.map((project, index) => {
            const isLarge = index === 0;
            const isWide = index === 3 || index === 7;
            const hasPoster = !!project.fileName;

            return (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`poster-item relative group overflow-hidden cursor-pointer bg-bg-dark/50 ${
                  isLarge ? 'md:col-span-2 md:row-span-2' : ''
                } ${isWide ? 'md:col-span-2' : ''}`}
                style={{ aspectRatio: isLarge ? '1' : isWide ? '2/1' : '3/4' }}
              >
                {hasPoster ? (
                  <>
                    <SafeImage
                      src={getMediaUrl(project.fileName, 'afis')}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
                  <ProjectPosterPlaceholder
                    title={project.title}
                    year={project.year}
                    type={project.type}
                  />
                )}
              </button>
            );
          })}
        </div>

        {!showAll && remaining.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(true)}
              className="font-cinzel text-xs tracking-[0.16em] uppercase text-gold border border-gold/40 px-8 py-3 hover:bg-gold/10 transition-all duration-300"
            >
              Tüm Projeler ({remaining.length} daha)
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
              aria-label="Kapat"
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
                <ProjectPosterPlaceholder
                  title={selectedProject.title}
                  year={selectedProject.year}
                  type={selectedProject.type}
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
                    Yıl
                  </dt>
                  <dd className="text-white">{selectedProject.year ?? '—'}</dd>
                </div>
                <div>
                  <dt className="font-cinzel text-[10px] tracking-[0.16em] uppercase text-gold mb-1">
                    Tür
                  </dt>
                  <dd className="text-white">{selectedProject.type}</dd>
                </div>
                {selectedProject.director && (
                  <div>
                    <dt className="font-cinzel text-[10px] tracking-[0.16em] uppercase text-gold mb-1">
                      Yönetmen
                    </dt>
                    <dd className="text-white">{selectedProject.director}</dd>
                  </div>
                )}
                {selectedProject.production && (
                  <div>
                    <dt className="font-cinzel text-[10px] tracking-[0.16em] uppercase text-gold mb-1">
                      Yapım Şirketi
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
