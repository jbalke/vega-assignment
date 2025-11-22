import { useEffect, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { LANGUAGE_STORAGE_KEY } from '../../i18n/i18n';

const supportedLanguages = ['en-GB', 'fr-FR', 'de-DE'] as const;

const AppFooter = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language ?? supportedLanguages[0]);

  useEffect(() => {
    const handleLanguageChange = (language: string) => {
      setSelectedLanguage(language);
    };
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLanguage = event.target.value;
    setSelectedLanguage(nextLanguage);
    i18n.changeLanguage(nextLanguage);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    }
  };

  return (
    <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 text-sm text-muted">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          {t('footer.languageLabel')}
        </p>
        <p className="text-sm text-white/70">{t('footer.helper')}</p>
      </div>
      <label className="flex items-center gap-3 text-white/90">
        <span className="text-sm font-medium text-muted">{t('footer.languageLabel')}</span>
        <select
          value={selectedLanguage}
          onChange={handleChange}
          data-testid="language-select"
          className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white focus:border-accent focus:outline-none"
        >
          {supportedLanguages.map(code => {
            const optionKey = code.replace('-', '');
            return (
              <option key={code} value={code} className="bg-surface text-white">
                {t(`footer.options.${optionKey}`)}
              </option>
            );
          })}
        </select>
      </label>
    </footer>
  );
};

export default AppFooter;
