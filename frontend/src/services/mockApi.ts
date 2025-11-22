import { addMilliseconds } from 'date-fns'
import { assets, latestPrices, portfolioSnapshot, priceHistory } from '../data/mockData'
import type { Asset, Portfolio, PricePoint } from '../types/portfolio'

const deepCopy = <T>(value: T): T =>
  typeof structuredClone !== 'undefined' ? structuredClone(value) : JSON.parse(JSON.stringify(value))

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export interface PriceRequest {
  assets?: string[]
  asOf?: string
  from?: string
  to?: string
}

const filterAssets = <T extends { assetId: string }>(collection: T[], assetIds?: string[]) => {
  if (!assetIds || assetIds.length === 0) return collection
  return collection.filter((entry) => assetIds.includes(entry.assetId))
}

const filterByDateRange = <T extends { asOf: string }>(collection: T[], from?: string, to?: string) => {
  if (!from && !to) return collection
  const fromDate = from ? new Date(from) : null
  const toDate = to ? new Date(to) : null

  return collection.filter((entry) => {
    const current = new Date(entry.asOf)
    if (fromDate && current < fromDate) return false
    if (toDate && current > addMilliseconds(toDate, 1)) return false
    return true
  })
}

export async function fetchAssets(): Promise<Asset[]> {
  await delay()
  return deepCopy(assets)
}

export async function fetchPortfolio(): Promise<Portfolio> {
  await delay()
  return deepCopy(portfolioSnapshot)
}

export async function fetchPrices(params?: PriceRequest): Promise<PricePoint[]> {
  await delay()
  if (!params?.from && !params?.to && !params?.asOf) {
    return deepCopy(filterAssets(latestPrices, params?.assets))
  }

  let dataset = priceHistory

  if (params?.asOf) {
    const target = params.asOf.slice(0, 10)
    dataset = dataset.filter((item) => item.asOf.slice(0, 10) === target)
  }

  dataset = filterByDateRange(dataset, params?.from, params?.to)
  dataset = filterAssets(dataset, params?.assets)
  return deepCopy(dataset)
}

