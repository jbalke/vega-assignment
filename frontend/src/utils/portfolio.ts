import type { Asset, BreakdownDatum, EnrichedPosition, PricePoint } from '../types/portfolio'

const sumValues = (values: number[]) => values.reduce((acc, value) => acc + value, 0)

export const enrichPositions = (params: {
  positions: { id: string; assetId: string; quantity: number }[]
  assets: Asset[]
  prices: PricePoint[]
}): EnrichedPosition[] => {
  const assetMap = new Map(params.assets.map((asset) => [asset.id, asset]))
  const priceMap = new Map(params.prices.map((price) => [price.assetId, price.price]))
  const totalValue = params.positions.reduce((acc, position) => {
    const price = priceMap.get(position.assetId) ?? 0
    return acc + position.quantity * price
  }, 0)

  if (totalValue === 0) return []

  return params.positions.map((position) => {
    const asset = assetMap.get(position.assetId)
    const price = priceMap.get(position.assetId) ?? 0
    const value = position.quantity * price
    return {
      id: position.id,
      assetId: position.assetId,
      symbol: asset?.symbol ?? position.assetId,
      name: asset?.name ?? position.assetId,
      class: asset?.class ?? 'cash',
      quantity: position.quantity,
      price,
      value,
      allocation: value / totalValue,
    }
  })
}

export const getBreakdownByAsset = (positions: EnrichedPosition[]): BreakdownDatum[] =>
  positions.map((position) => ({
    id: position.assetId,
    label: position.symbol,
    value: position.value,
    allocation: position.allocation,
  }))

export const getBreakdownByClass = (positions: EnrichedPosition[]): BreakdownDatum[] => {
  const grouped = positions.reduce<Record<string, { value: number; allocation: number }>>((acc, position) => {
    if (!acc[position.class]) {
      acc[position.class] = { value: 0, allocation: 0 }
    }
    acc[position.class].value += position.value
    acc[position.class].allocation += position.allocation
    return acc
  }, {})

  return Object.entries(grouped).map(([key, stats]) => ({
    id: key,
    label: key.toUpperCase(),
    value: stats.value,
    allocation: stats.allocation,
  }))
}

export const buildHistoricalSeries = (params: {
  pricePoints: PricePoint[]
  positions: EnrichedPosition[]
  assetFilter?: string[]
}) => {
  const quantityMap = new Map(
    params.positions
      .filter((position) => !params.assetFilter || params.assetFilter.includes(position.assetId))
      .map((position) => [position.assetId, position.quantity]),
  )

  if (!quantityMap.size) return []

  const groupedByDate = params.pricePoints.reduce<Record<string, PricePoint[]>>((acc, point) => {
    if (!acc[point.asOf]) {
      acc[point.asOf] = []
    }
    acc[point.asOf].push(point)
    return acc
  }, {})

  return Object.entries(groupedByDate)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([date, points]) => {
      const values = points.map((point) => {
        const quantity = quantityMap.get(point.assetId)
        if (!quantity) return 0
        return quantity * point.price
      })

      return {
        date,
        value: Number(sumValues(values).toFixed(2)),
      }
    })
}

