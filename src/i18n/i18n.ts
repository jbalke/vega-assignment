import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import deDE from './translations/de-DE.json' with { type: 'json' };
import enGB from './translations/en-GB.json' with { type: 'json' };
import frFR from './translations/fr-FR.json' with { type: 'json' };

export const LANGUAGE_STORAGE_KEY = 'vega-language';

const fallbackLng = 'en-GB';

const resources = {
  'en-GB': { translation: enGB },
  'fr-FR': { translation: frFR },
  'de-DE': { translation: deDE },
} as const;

export type SupportedLngs = keyof typeof resources;

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: {
      // Map English variants to en-GB
      en: ['en-GB'],
      'en-US': ['en-GB'],
      'en-CA': ['en-GB'],
      'en-AU': ['en-GB'],
      // Map French variants to fr-FR
      fr: ['fr-FR'],
      'fr-CA': ['fr-FR'],
      'fr-BE': ['fr-FR'],
      'fr-CH': ['fr-FR'],
      // Map German variants to de-DE
      de: ['de-DE'],
      'de-AT': ['de-DE'],
      'de-CH': ['de-DE'],
      // Default fallback for all other languages
      default: ['en-GB'],
    },
    supportedLngs: Object.keys(resources),
    detection: {
      // Order of detection: localStorage -> navigator -> fallback
      order: ['localStorage', 'navigator'],
      // Key to use in localStorage
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      // Cache user language preference
      caches: ['localStorage'],
      // Convert detected language to supported language
      convertDetectedLanguage: (lng: string): string => {
        // If already a supported language, return as-is
        if (Object.keys(resources).includes(lng)) {
          return lng;
        }
        // Extract base language code and map to supported language
        const baseCode = lng.split('-')[0];
        const languageMap: Record<string, SupportedLngs> = {
          en: 'en-GB',
          fr: 'fr-FR',
          de: 'de-DE',
        };
        return languageMap[baseCode] || fallbackLng;
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18next.resolvedLanguage || i18next.language;
}

// Update <html lang="..."> on language change
i18next.on('languageChanged', lng => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
});

export default i18next;
