/**
 * i18n Helper Functions
 * 
 * Kullanım:
 * ```ts
 * import { t } from '@/lib/i18n';
 * 
 * const label = t('eyeColors.blue', 'tr'); // "Mavi"
 * ```
 */

import translations from './data.json';

type Locale = 'tr' | 'en';
type TranslationKey = 
  | 'genders'
  | 'eyeColors'
  | 'hairColors'
  | 'skinColors'
  | 'drivingLicenses'
  | 'experienceTypes'
  | 'mediaTypes'
  | 'skillCategories';

/**
 * Çeviri al
 * 
 * @param key - Translation category key (e.g., "eyeColors")
 * @param value - The value to translate (e.g., "blue")
 * @param locale - Locale (tr or en)
 * @returns Translated label or the original value if not found
 */
export function t(
  key: TranslationKey,
  value: string,
  locale: Locale = 'tr'
): string {
  const data = translations[locale] as Record<string, Record<string, string>>;
  
  if (!data || !data[key]) {
    return value;
  }
  
  return data[key][value] || value;
}

/**
 * Tüm çeviri seçeneklerini al
 * 
 * @param key - Translation category key
 * @param locale - Locale
 * @returns Array of { value, label } objects
 */
export function getTranslationOptions(
  key: TranslationKey,
  locale: Locale = 'tr'
): { value: string; label: string }[] {
  const data = translations[locale] as Record<string, Record<string, string>>;
  
  if (!data || !data[key]) {
    return [];
  }
  
  return Object.entries(data[key]).map(([value, label]) => ({
    value,
    label,
  }));
}

/**
 * Talent için çok dilli bio al
 * 
 * @param bioTr - Turkish bio
 * @param bioEn - English bio
 * @param locale - Preferred locale
 * @returns Bio in preferred language, fallback to available
 */
export function getTalentBio(
  bioTr: string | null,
  bioEn: string | null,
  locale: Locale = 'tr'
): string | null {
  if (locale === 'tr') {
    return bioTr || bioEn;
  }
  
  return bioEn || bioTr;
}

/**
 * Talent için çok dilli education al
 */
export function getTalentEducation(
  educationTr: string | null,
  educationEn: string | null,
  locale: Locale = 'tr'
): string | null {
  if (locale === 'tr') {
    return educationTr || educationEn;
  }
  
  return educationEn || educationTr;
}

export type { Locale };
