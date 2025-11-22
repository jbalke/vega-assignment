import { describe, expect, it } from 'vitest';

import type { Asset, PricePoint } from '../types/portfolio';

import {
  buildHistoricalSeries,
  enrichPositions,
  getBreakdownByAsset,
  getBreakdownByClass,
} from './portfolio';

const assets: Asset[] = [
  { id: 'BTC', symbol: 'BTC', name: 'Bitcoin', class: 'crypto', currency: 'USD' },
  { id: 'ETH', symbol: 'ETH', name: 'Ethereum', class: 'crypto', currency: 'USD' },
];

const positions = [
  { id: '1', assetId: 'BTC', quantity: 1 },
  { id: '2', assetId: 'ETH', quantity: 2 },
];

const prices: PricePoint[] = [
  { assetId: 'BTC', asOf: '2025-01-01', price: 50000 },
  { assetId: 'ETH', asOf: '2025-01-01', price: 4000 },
];

describe('portfolio utilities', () => {
  it('enriches positions with price and allocation', () => {
    const enriched = enrichPositions({ positions, assets, prices });
    expect(enriched).toHaveLength(2);
    const btc = enriched.find(entry => entry.assetId === 'BTC');
    expect(btc?.value).toBe(50000);
    expect(btc?.allocation).toBeCloseTo(50000 / (50000 + 8000));
  });

  it('builds correct breakdowns', () => {
    const enriched = enrichPositions({ positions, assets, prices });
    const byAsset = getBreakdownByAsset(enriched);
    const byClass = getBreakdownByClass(enriched);

    expect(byAsset).toHaveLength(2);
    expect(byClass).toHaveLength(1);
    expect(byClass[0].label).toBe('CRYPTO');
    expect(byClass[0].value).toBeCloseTo(58000);
  });

  it('aggregates historical series by asset filter', () => {
    const enriched = enrichPositions({ positions, assets, prices });
    const series = buildHistoricalSeries({
      pricePoints: [
        { assetId: 'BTC', asOf: '2025-01-01', price: 50000 },
        { assetId: 'ETH', asOf: '2025-01-01', price: 4000 },
        { assetId: 'BTC', asOf: '2025-02-01', price: 55000 },
        { assetId: 'ETH', asOf: '2025-02-01', price: 4200 },
      ],
      positions: enriched,
      assetFilter: ['BTC'],
    });

    expect(series).toEqual([
      { date: '2025-01-01', value: 50000 },
      { date: '2025-02-01', value: 55000 },
    ]);
  });
});
