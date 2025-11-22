import { http, HttpResponse, delay } from 'msw'
import { addMilliseconds } from 'date-fns'
import { assets, latestPrices, portfolioSnapshot, priceHistory } from '../data/mockData'

const API_BASE = '/api'
const RESPONSE_DELAY_MS = 300

const deepCopy = <T>(value: T): T =>
  typeof structuredClone !== 'undefined' ? structuredClone(value) : JSON.parse(JSON.stringify(value))

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

export const handlers = [
  http.get(`${API_BASE}/assets`, async () => {
    await delay(RESPONSE_DELAY_MS)
    return HttpResponse.json(deepCopy(assets))
  }),

  http.get(`${API_BASE}/portfolios`, async ({ request }) => {
    await delay(RESPONSE_DELAY_MS)
    const url = new URL(request.url)
    const asOf = url.searchParams.get('asOf')

    let portfolio = deepCopy(portfolioSnapshot)
    if (asOf) {
      portfolio.asOf = asOf
      portfolio.positions = portfolio.positions.map((pos) => ({ ...pos, asOf }))
    }

    return HttpResponse.json(portfolio)
  }),

  http.get(`${API_BASE}/prices`, async ({ request }) => {
    await delay(RESPONSE_DELAY_MS)
    const url = new URL(request.url)
    const assetParam = url.searchParams.get('assets')
    const asOf = url.searchParams.get('asOf')
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')

    const assetIds = assetParam ? assetParam.split(',').map((a) => a.trim()) : undefined

    if (!from && !to && !asOf) {
      return HttpResponse.json(deepCopy(filterAssets(latestPrices, assetIds)))
    }

    let dataset = priceHistory

    if (asOf) {
      const target = asOf.slice(0, 10)
      dataset = dataset.filter((item) => item.asOf.slice(0, 10) === target)
    }

    dataset = filterByDateRange(dataset, from ?? undefined, to ?? undefined)
    dataset = filterAssets(dataset, assetIds)
    return HttpResponse.json(deepCopy(dataset))
  }),
]

