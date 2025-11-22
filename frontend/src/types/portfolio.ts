export type AssetClass = 'stock' | 'crypto' | 'cash'

export interface Asset {
  id: string
  symbol: string
  name: string
  class: AssetClass
  currency: string
}

export interface Position {
  id: string
  assetId: string
  quantity: number
  asOf: string
}

export interface Portfolio {
  id: string
  asOf: string
  positions: Position[]
}

export interface PricePoint {
  assetId: string
  asOf: string
  price: number
}

export interface HistoricalPoint {
  date: string
  value: number
}

export interface EnrichedPosition {
  id: string
  assetId: string
  symbol: string
  name: string
  class: AssetClass
  quantity: number
  price: number
  value: number
  allocation: number
}

export interface BreakdownDatum {
  id: string
  label: string
  value: number
  allocation: number
  [key: string]: string | number
}

