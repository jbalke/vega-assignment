import { addWeeks, formatISO } from 'date-fns'

import type { Asset, Portfolio, PricePoint } from '../types/portfolio'

type AssetBlueprint = Asset & {
  base: number
  drift: number
  oscillation: number
}

const assetBlueprints: AssetBlueprint[] = [
  {
    id: 'BTC',
    symbol: 'BTC',
    name: 'Bitcoin',
    class: 'crypto',
    currency: 'USD',
    base: 63000,
    drift: 420,
    oscillation: 0.05,
  },
  {
    id: 'ETH',
    symbol: 'ETH',
    name: 'Ethereum',
    class: 'crypto',
    currency: 'USD',
    base: 3200,
    drift: 24,
    oscillation: 0.06,
  },
  {
    id: 'AAPL',
    symbol: 'AAPL',
    name: 'Apple',
    class: 'stock',
    currency: 'USD',
    base: 190,
    drift: 1.35,
    oscillation: 0.03,
  },
  {
    id: 'MSFT',
    symbol: 'MSFT',
    name: 'Microsoft',
    class: 'stock',
    currency: 'USD',
    base: 360,
    drift: 1.1,
    oscillation: 0.028,
  },
  {
    id: 'TSLA',
    symbol: 'TSLA',
    name: 'Tesla',
    class: 'stock',
    currency: 'USD',
    base: 240,
    drift: 0.6,
    oscillation: 0.06,
  },
  {
    id: 'USD',
    symbol: 'USD',
    name: 'Cash (USD)',
    class: 'cash',
    currency: 'USD',
    base: 1,
    drift: 0,
    oscillation: 0,
  },
]

const startDate = new Date('2024-12-01T00:00:00Z')
const timeline = Array.from({ length: 40 }, (_, index) =>
  formatISO(addWeeks(startDate, index), { representation: 'complete' })
)

const clampPrice = (value: number) => Math.max(0.01, Number(value.toFixed(2)))

export const priceHistory: PricePoint[] = timeline.flatMap((date, index) => {
  return assetBlueprints.map(asset => {
    const sine = Math.sin(index / 3) * asset.oscillation * asset.base
    const price = asset.base + asset.drift * index + sine
    return {
      assetId: asset.id,
      asOf: date,
      price: clampPrice(price),
    }
  })
})

const latestByAsset = new Map<string, PricePoint>()
priceHistory.forEach(point => {
  if (!latestByAsset.has(point.assetId) || latestByAsset.get(point.assetId)!.asOf < point.asOf) {
    latestByAsset.set(point.assetId, point)
  }
})

export const latestPrices: PricePoint[] = Array.from(latestByAsset.values())

export const assets: Asset[] = assetBlueprints.map(
  ({ base: _base, drift: _drift, oscillation: _oscillation, ...rest }) => rest
)

export const portfolioSnapshot: Portfolio = {
  id: 'portfolio-primary',
  asOf: latestPrices[0]?.asOf ?? new Date().toISOString(),
  positions: [
    {
      id: 'pos-btc',
      assetId: 'BTC',
      quantity: 1.25,
      asOf: latestPrices[0]?.asOf ?? new Date().toISOString(),
    },
    {
      id: 'pos-eth',
      assetId: 'ETH',
      quantity: 9.5,
      asOf: latestPrices[0]?.asOf ?? new Date().toISOString(),
    },
    {
      id: 'pos-aapl',
      assetId: 'AAPL',
      quantity: 140,
      asOf: latestPrices[0]?.asOf ?? new Date().toISOString(),
    },
    {
      id: 'pos-msft',
      assetId: 'MSFT',
      quantity: 90,
      asOf: latestPrices[0]?.asOf ?? new Date().toISOString(),
    },
    {
      id: 'pos-tsla',
      assetId: 'TSLA',
      quantity: 60,
      asOf: latestPrices[0]?.asOf ?? new Date().toISOString(),
    },
    {
      id: 'pos-usd',
      assetId: 'USD',
      quantity: 25000,
      asOf: latestPrices[0]?.asOf ?? new Date().toISOString(),
    },
  ],
}
