import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import deDE from './translations/de-DE.json' with { type: 'json' };
import enGB from './translations/en-GB.json' with { type: 'json' };
import frFR from './translations/fr-FR.json' with { type: 'json' };

export const LANGUAGE_STORAGE_KEY = 'vega-language';

const fallbackLng = 'en-GB';

const getStoredLanguage = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
};

const resources = {
  'en-GB': { translation: enGB },
  'fr-FR': { translation: frFR },
  'de-DE': { translation: deDE },
} as const;

i18next.use(initReactI18next).init({
  resources,
  fallbackLng,
  lng: getStoredLanguage() ?? fallbackLng,
  supportedLngs: Object.keys(resources),
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
