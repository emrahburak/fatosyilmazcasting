'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const timelineItems = [
  {
    year: '2004',
    title: 'Ay Yapım',
    description: 'Türk televizyon tarihinin en etkili yapımlarında cast direktörlüğüne ilk adım.',
  },
  {
    year: '2010',
    title: 'Büyük Ekran',
    description: 'Sinema filmlerinde karakter odaklı oyuncu seçimi ve kadro yönetimi.',
  },
  {
    year: '2016',
    title: 'Dijital Dönüşüm',
    description: 'İnternet dizileri ve platform yapımlarında yeni nesil cast yaklaşımı.',
  },
  {
    year: '2020',
    title: 'Avrupa\'ya Açılma',
    description: 'Zurich, Berlin, Amsterdam\'da workshop ve eğitimlerle uluslararası ağ.',
  },
  {
    year: '2024',
    title: 'Fatoş Yılmaz Casting',
    description: '20 yılı aşkın deneyimle bağımsız cast direktörlüğü ve yetenek danışmanlığı.',
  },
];

export default function About() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
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

    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      gsap.from(item as Element, {
        scrollTrigger: {
          trigger: item as Element,
          start: 'top 85%',
        },
        x: i % 2 === 0 ? -40 : 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    });
  }, { scope: container });

  return (
    <section id="about" ref={container} className="py-24 md:py-32 px-6 md:px-12 bg-bg">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-cinzel text-[11px] tracking-[0.2em] uppercase text-gold mb-4 font-medium">
            Hikaye
          </p>
          <h2 className="font-cinzel text-3xl md:text-4xl text-text-primary tracking-wide font-semibold">
            Hakkımda
          </h2>
        </div>

        <blockquote className="about-quote text-center mb-20">
          <p className="font-crimson text-xl md:text-2xl text-text-secondary italic leading-relaxed max-w-2xl mx-auto">
            &ldquo;Her karakter bir hikaye anlatır. Benim işim, o hikayeyi doğru yüzle buluşturmak.&rdquo;
          </p>
          <cite className="block mt-4 font-cinzel text-xs tracking-[0.16em] uppercase text-muted not-italic">
            — Fatoş Yılmaz
          </cite>
        </blockquote>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gold/30 -translate-x-1/2 hidden md:block" />

          {timelineItems.map((item, index) => (
            <div
              key={item.year}
              className={`timeline-item flex flex-col md:flex-row items-center gap-6 mb-16 last:mb-0 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                <span className="font-cinzel text-gold text-sm tracking-[0.16em]">
                  {item.year}
                </span>
                <h3 className="font-cinzel text-xl text-text-primary mt-1 mb-2 font-medium">
                  {item.title}
                </h3>
                <p className="font-crimson text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="w-3 h-3 rounded-full bg-gold border-2 border-bg z-10 hidden md:block" />

              <div className="flex-1 hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
