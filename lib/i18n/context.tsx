'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import trMessages from '@/messages/tr.json';
import enMessages from '@/messages/en.json';

type Locale = 'tr' | 'en';
type Messages = typeof trMessages;

/**
 * Recursively resolves a dot-path key (e.g. 'nav.about') against a nested object.
 * Returns the key string itself as fallback when the path is not found.
 */
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // fallback: return the key itself
    }
  }
  return String(current);
}

const dictionaries: Record<Locale, Messages> = { tr: trMessages, en: enMessages };

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof Messages | string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('tr');

  const t = useCallback(
    (key: string) =>
      getNestedValue(dictionaries[locale] as unknown as Record<string, unknown>, key),
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}

/**
 * Simple TR | EN toggle button for the navbar.
 * Matches the navbar design: font-cinzel, gold accent, same text size as nav links.
 */
export function I18nToggle() {
  const { locale, setLocale } = useI18n();
  return (
    <div className="flex items-center gap-1 font-cinzel text-xs tracking-[0.1em] uppercase">
      <button
        type="button"
        onClick={() => setLocale('tr')}
        className={`px-2 py-1 font-semibold transition-colors duration-300 cursor-pointer ${
          locale === 'tr' ? 'text-gold' : 'text-text-secondary hover:text-gold'
        }`}
      >
        TR
      </button>
      <span className="text-muted/40">|</span>
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`px-2 py-1 font-semibold transition-colors duration-300 cursor-pointer ${
          locale === 'en' ? 'text-gold' : 'text-text-secondary hover:text-gold'
        }`}
      >
        EN
      </button>
    </div>
  );
}
