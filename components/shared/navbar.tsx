'use client';

import { useState, useEffect } from 'react';

const navLinks = [
  { label: 'Hakkımda', href: '#about' },
  { label: 'Filmografi', href: '#filmography' },
  { label: 'Eğitimler', href: '#education' },
  { label: 'Katalog', href: '#catalog' },
  { label: 'İletişim', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-bg/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        <a
          href="#hero"
          onClick={(e) => handleClick(e, '#hero')}
          className="flex items-center gap-2 group"
        >
          <svg width="28" height="28" viewBox="0 0 100 100" className="transition-transform duration-300 group-hover:scale-105">
            <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-gold" />
            <text
              x="50%"
              y="62%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="currentColor"
              className="text-gold"
              style={{ fontFamily: "'Times New Roman', serif", fontSize: '72px', fontStyle: 'italic' }}
            >
              f
            </text>
          </svg>
          <span className="font-cinzel text-xs tracking-[0.12em] uppercase text-text-primary font-medium hidden sm:block">
            Fatoş Yılmaz
          </span>
        </a>

        <div className="flex items-center gap-6 md:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="font-cinzel text-[11px] tracking-[0.1em] uppercase text-text-secondary font-medium hover:text-gold transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
