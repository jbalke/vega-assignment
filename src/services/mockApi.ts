import type { Asset, Portfolio, PricePoint } from '../types/portfolio'

const API_BASE = '/api'

export interface PriceRequest {
  assets?: string[]
  asOf?: string
  from?: string
  to?: string
}

export async function fetchAssets(): Promise<Asset[]> {
  const response = await fetch(`${API_BASE}/assets`)
  if (!response.ok) {
    throw new Error(`Failed to fetch assets: ${response.statusText}`)
  }
  return response.json()
}

export async function fetchPortfolio(asOf?: string): Promise<Portfolio> {
  const url = new URL(`${API_BASE}/portfolios`, window.location.origin)
  if (asOf) {
    url.searchParams.set('asOf', asOf)
  }
  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Failed to fetch portfolio: ${response.statusText}`)
  }
  return response.json()
}

export async function fetchPrices(params?: PriceRequest): Promise<PricePoint[]> {
  const url = new URL(`${API_BASE}/prices`, window.location.origin)
  if (params?.assets && params.assets.length > 0) {
    url.searchParams.set('assets', params.assets.join(','))
  }
  if (params?.asOf) {
    url.searchParams.set('asOf', params.asOf)
  }
  if (params?.from) {
    url.searchParams.set('from', params.from)
  }
  if (params?.to) {
    url.searchParams.set('to', params.to)
  }
  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Failed to fetch prices: ${response.statusText}`)
  }
  return response.json()
}
