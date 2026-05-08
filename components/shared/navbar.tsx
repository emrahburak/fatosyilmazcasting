'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useI18n, I18nToggle } from '@/lib/i18n/context';

const navLinks = [
  { label: 'nav.about', href: '#about' },
  { label: 'nav.filmography', href: '#filmography' },
  { label: 'nav.education', href: '#education' },
  { label: 'nav.catalog', href: '#catalog' },
  { label: 'nav.contact', href: '#contact' },
];

export default function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const hamburgerColor = scrolled ? 'text-text-primary' : 'text-white/80';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-bg/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => handleClick(e, '#hero')}
          className="flex items-center gap-2 group"
        >
          <svg width="48" height="48" viewBox="0 0 100 100" className="transition-transform duration-300 group-hover:scale-105">
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
          <span className={`font-cinzel text-sm tracking-[0.12em] uppercase font-semibold hidden sm:block ${
            scrolled ? 'text-text-primary' : 'text-white/80'
          }`}>
            Fatoş Yılmaz
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className={`font-cinzel text-xs tracking-[0.1em] uppercase font-semibold hover:text-gold transition-colors duration-300 ${
                scrolled ? 'text-text-secondary' : 'text-white/80'
              }`}
            >
              {t(link.label)}
            </a>
          ))}
          <I18nToggle />
        </div>

        {/* Hamburger button (mobile only) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden p-2 transition-colors duration-300 ${hamburgerColor} hover:text-gold`}
          aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer — portal to body to escape nav stacking context */}
      {mounted && menuOpen && createPortal(
        <div
          className="fixed inset-0 z-[9999] md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Drawer panel */}
          <div
            ref={drawerRef}
            className="absolute top-0 right-0 h-full w-72 bg-bg-dark shadow-2xl animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-5 right-5 p-2 text-white/60 hover:text-gold transition-colors duration-300"
              aria-label="Menüyü kapat"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="flex flex-col pt-24 px-8">
              {navLinks.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="font-cinzel text-sm tracking-[0.12em] uppercase font-semibold text-white/80 hover:text-gold transition-colors duration-300 py-4 border-b border-white/5 animate-fade-in-link"
                  style={{ animationDelay: `${i * 80 + 200}ms` }}
                >
                  {t(link.label)}
                </a>
              ))}
              <div className="mt-6 animate-fade-in-link" style={{ animationDelay: `${navLinks.length * 80 + 200}ms` }}>
                <I18nToggle />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </nav>
  );
}
