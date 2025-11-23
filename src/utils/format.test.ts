import { beforeAll, describe, expect, it } from 'vitest';

import i18next from '../i18n/i18n';

import {
  formatCurrency,
  formatDateLabel,
  formatFullDate,
  formatPercent,
  formatRelativeTime,
} from './format';

describe('format utilities', () => {
  beforeAll(async () => {
    await i18next.changeLanguage('en-GB');
  });

  it('formats currencies with fewer decimals for large values', () => {
    expect(formatCurrency(1250)).toMatch(/1,250/);
    expect(formatCurrency(12.34)).toMatch(/12\.34/);
  });

  it('formats percentages with a single decimal place', () => {
    expect(formatPercent(12.34)).toBe('12.3%');
  });

  it('formats various date helpers', () => {
    expect(formatDateLabel('2025-01-10')).toMatch(/Jan/i);
    expect(formatFullDate('2025-01-10')).toMatch(/Jan 10, 2025/);
    expect(formatRelativeTime(new Date().toISOString())).toContain('ago');
  });
});
