'use client';

import { useI18n } from '@/lib/i18n/context';

const collectedDataKeys = [
  'privacy.sections.collected.items.0',
  'privacy.sections.collected.items.1',
  'privacy.sections.collected.items.2',
  'privacy.sections.collected.items.3',
  'privacy.sections.collected.items.4',
];

const purposeKeys = [
  'privacy.sections.purpose.items.0',
  'privacy.sections.purpose.items.1',
  'privacy.sections.purpose.items.2',
  'privacy.sections.purpose.items.3',
];

const thirdPartyKeys = [
  'privacy.sections.thirdParty.items.0',
  'privacy.sections.thirdParty.items.1',
  'privacy.sections.thirdParty.items.2',
];

const rightsKeys = [
  'privacy.sections.rights.items.0',
  'privacy.sections.rights.items.1',
  'privacy.sections.rights.items.2',
  'privacy.sections.rights.items.3',
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 font-crimson text-[#d4cfc5] font-medium">
          <span className="text-gold mt-1.5 text-xs">◆</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ThirdPartyList() {
  const { t } = useI18n();
  return (
    <ul className="space-y-3">
      {thirdPartyKeys.map((key) => {
        const full = t(key);
        const parts = full.split(' — ');
        return (
          <li key={key} className="flex items-start gap-3 font-crimson text-[#d4cfc5] font-medium">
            <span className="text-gold mt-1.5 text-xs">◆</span>
            <span>
              <strong className="text-[#faf8f4] font-semibold">{parts[0]}</strong>
              {parts[1] ? ` — ${parts[1]}` : ''}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default function PrivacyContent() {
  const { t } = useI18n();
  const isTR = t('nav.about') === 'Hakkımda';

  return (
    <div className="min-h-screen bg-bg-dark">
      <main className="max-w-3xl mx-auto px-6 md:px-12 pt-32 pb-24">

        {/* Back to Home - Top */}
        <a
          href="/"
          className="inline-flex items-center gap-2 font-cinzel text-xs tracking-[0.1em] uppercase text-gold/70 hover:text-gold transition-colors duration-300 mb-12"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 2L4 8l6 6" />
          </svg>
          {isTR ? 'Ana Sayfaya Dön' : 'Back to Home'}
        </a>

        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-cinzel text-[11px] tracking-[0.2em] uppercase text-gold mb-4 font-medium">
            Legal
          </p>
          <h1 className="font-cinzel text-2xl md:text-3xl text-[#faf8f4] tracking-wide font-semibold mb-6">
            {t('privacy.title')}
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-[1px] bg-gold/40" />
            <svg width="6" height="6" viewBox="0 0 6 6">
              <circle cx="3" cy="3" r="2" fill="currentColor" className="text-gold" />
            </svg>
            <div className="w-16 h-[1px] bg-gold/40" />
          </div>
        </div>

        {/* Intro */}
        <p className="font-crimson text-lg text-[#d4cfc5] font-medium leading-relaxed mb-12">
          {t('privacy.intro')}
        </p>

        {/* Sections */}
        <div className="space-y-12">

          {/* Data Collected */}
          <section>
            <h2 className="font-cinzel text-xl text-[#faf8f4] tracking-wide font-semibold mb-4">
              {t('privacy.sections.collected.title')}
            </h2>
            <div className="w-12 h-[1px] bg-gold/40 mb-6" />
            <BulletList items={collectedDataKeys.map((k) => t(k))} />
          </section>

          {/* Purpose */}
          <section>
            <h2 className="font-cinzel text-xl text-[#faf8f4] tracking-wide font-semibold mb-4">
              {t('privacy.sections.purpose.title')}
            </h2>
            <div className="w-12 h-[1px] bg-gold/40 mb-6" />
            <BulletList items={purposeKeys.map((k) => t(k))} />
          </section>

          {/* Third Party */}
          <section>
            <h2 className="font-cinzel text-xl text-[#faf8f4] tracking-wide font-semibold mb-4">
              {t('privacy.sections.thirdParty.title')}
            </h2>
            <div className="w-12 h-[1px] bg-gold/40 mb-6" />
            <ThirdPartyList />
          </section>

          {/* Cookies */}
          <section>
            <h2 className="font-cinzel text-xl text-[#faf8f4] tracking-wide font-semibold mb-4">
              {t('privacy.sections.cookies.title')}
            </h2>
            <div className="w-12 h-[1px] bg-gold/40 mb-6" />
            <p className="font-crimson text-[#d4cfc5] font-medium leading-relaxed">
              {t('privacy.sections.cookies.text')}
            </p>
          </section>

          {/* Rights */}
          <section>
            <h2 className="font-cinzel text-xl text-[#faf8f4] tracking-wide font-semibold mb-4">
              {t('privacy.sections.rights.title')}
            </h2>
            <div className="w-12 h-[1px] bg-gold/40 mb-6" />
            <BulletList items={rightsKeys.map((k) => t(k))} />
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-cinzel text-xl text-[#faf8f4] tracking-wide font-semibold mb-4">
              {t('privacy.sections.contact.title')}
            </h2>
            <div className="w-12 h-[1px] bg-gold/40 mb-6" />
            <p className="font-crimson text-[#d4cfc5] font-medium leading-relaxed mb-4">
              {t('privacy.sections.contact.text')}
            </p>
            <a
              href="mailto:info@fatosyilmazcasting.com"
              className="font-crimson text-xl text-gold hover:text-gold/80 transition-colors duration-300"
            >
              info@fatosyilmazcasting.com
            </a>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-gold/20 text-center">
          <p className="font-cinzel text-[10px] tracking-[0.16em] uppercase text-[#a89e90]">
            {t('contact.copyright')}
          </p>
          <a
            href="/"
            className="mt-4 inline-block font-cinzel text-xs tracking-[0.1em] uppercase text-gold hover:text-gold/70 transition-colors duration-300"
          >
            ← {isTR ? 'Ana Sayfaya Dön' : 'Back to Home'}
          </a>
        </div>
      </main>
    </div>
  );
}
