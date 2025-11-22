import { format, formatDistanceToNowStrict, parseISO } from 'date-fns';
import type { Locale } from 'date-fns';
import { de, enGB, fr } from 'date-fns/locale';
import i18next from 'i18next';

const localeMap: Record<string, Locale> = {
  'en-GB': enGB,
  'fr-FR': fr,
  'de-DE': de,
};

const resolveLanguage = () => i18next.language ?? 'en-GB';
const resolveLocale = () => localeMap[resolveLanguage()] ?? enGB;

export const formatCurrency = (value: number, currency = 'USD') =>
  new Intl.NumberFormat(resolveLanguage(), {
    style: 'currency',
    currency,
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);

export const formatPercent = (value: number) =>
  new Intl.NumberFormat(resolveLanguage(), {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(value / 100);

export const formatDateLabel = (isoDate: string) =>
  format(parseISO(isoDate), 'MMM d', { locale: resolveLocale() });

export const formatFullDate = (isoDate: string) =>
  format(parseISO(isoDate), 'MMM d, yyyy', { locale: resolveLocale() });

export const formatRelativeTime = (isoDate: string) =>
  formatDistanceToNowStrict(parseISO(isoDate), { addSuffix: true, locale: resolveLocale() });
