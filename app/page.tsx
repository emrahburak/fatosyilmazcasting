'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ComingSoon() {
  const container = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null); // Eksik olan referans eklendi

  useGSAP(() => {
    // 3D Derinlikli Dönüş (RotateY)
    gsap.to(logoRef.current, {
      rotationY: 360,
      duration: 8,
      repeat: -1,
      ease: "none",
    });

    // Yazıların sırayla gelmesi (Stagger efekti)
    if (textRef.current) {
      gsap.from(textRef.current.querySelectorAll(".animate-text"), {
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.5
      });
    }
  }, { scope: container });

  return (
    <main
      ref={container}
      className="min-h-screen bg-[#080808] flex flex-col items-center justify-center text-white overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* Arka Plan Glow */}
      <div className="absolute w-[800px] h-[800px] bg-indigo-900/5 rounded-full blur-[150px] -z-10" />

      {/* 3D Logo Bölümü */}
      <div ref={logoRef} className="relative mb-16 select-none">
        <svg width="160" height="160" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="fashion-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#a5b4fc" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="0.2" fill="none" opacity="0.2" />
          <text
            x="50%" y="65%" dominantBaseline="middle" textAnchor="middle"
            fill="url(#fashion-grad)"
            style={{ fontFamily: "'Times New Roman', serif", fontSize: "70px", fontWeight: "300", fontStyle: "italic" }}
          >
            f
          </text>
        </svg>
      </div>

      {/* Metinler ve Butonlar */}
      <div ref={textRef} className="text-center z-10 px-4 max-w-3xl">
        <div className="space-y-2 mb-8">
          <h1 className="animate-text text-5xl md:text-8xl font-light tracking-tighter uppercase leading-none">
            Fatoş Yılmaz
          </h1>
          <h2 className="animate-text text-2xl md:text-4xl font-extralight tracking-[0.4em] text-indigo-200/40 uppercase">
            Management & Casting
          </h2>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <div className="animate-text w-16 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

          <p className="animate-text text-gray-300 font-medium text-xs md:text-sm tracking-[0.3em] uppercase">
            Cast Direktörü • Menajer • Yetenek Yönetimi
          </p>

          <p className="animate-text text-gray-500 font-light text-sm md:text-base leading-relaxed italic px-8">
            Sinema, dizi ve reklam projeleri için profesyonel cast direktörlüğü
            ve yönetmenlerle çözüm ortaklığı... Çok yakında yeni yüzlerimizle buradayız.
          </p>

          <div className="animate-text flex flex-col md:flex-row gap-4 pt-6">
            <a
              href="https://www.instagram.com/fatosyilmazmanagement/"
              target="_blank"
              className="flex items-center space-x-3 border border-white/5 px-8 py-2.5 rounded-full hover:bg-white/5 transition-all duration-500"
            >
              <span className="text-[10px] tracking-[0.3em] text-gray-400">MANAGEMENT</span>
            </a>
            <a
              href="https://www.instagram.com/gizemmsoncul/"
              target="_blank"
              className="flex items-center space-x-3 border border-white/5 px-8 py-2.5 rounded-full hover:bg-white/5 transition-all duration-500"
            >
              <span className="text-[10px] tracking-[0.3em] text-gray-400">REKLAM MANAGER</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
