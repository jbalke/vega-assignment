import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { formatISO, startOfYear, subMonths } from 'date-fns'
import { fetchAssets, fetchPortfolio, fetchPrices } from '../../services/mockApi'
import type { BreakdownDatum, EnrichedPosition, PricePoint } from '../../types/portfolio'
import { enrichPositions, getBreakdownByAsset, getBreakdownByClass } from '../../utils/portfolio'

export const usePortfolioOverview = () => {
  const assetsQuery = useQuery({ queryKey: ['assets'], queryFn: fetchAssets })
  const portfolioQuery = useQuery({ queryKey: ['portfolio'], queryFn: fetchPortfolio })

  const assetIds = portfolioQuery.data?.positions.map((position) => position.assetId) ?? []
  const pricesQuery = useQuery({
    queryKey: ['prices', assetIds.sort().join('-')],
    queryFn: () => fetchPrices({ assets: assetIds }),
    enabled: assetIds.length > 0,
  })

  const isLoading = assetsQuery.isPending || portfolioQuery.isPending || pricesQuery.isPending
  const error = assetsQuery.error ?? portfolioQuery.error ?? pricesQuery.error

  const positions: EnrichedPosition[] = useMemo(() => {
    if (!assetsQuery.data || !portfolioQuery.data || !pricesQuery.data) return []
    return enrichPositions({
      positions: portfolioQuery.data.positions,
      assets: assetsQuery.data,
      prices: pricesQuery.data,
    })
  }, [assetsQuery.data, portfolioQuery.data, pricesQuery.data])

  const totalValue = positions.reduce((acc, position) => acc + position.value, 0)

  const breakdownByAsset: BreakdownDatum[] = useMemo(() => getBreakdownByAsset(positions), [positions])
  const breakdownByClass: BreakdownDatum[] = useMemo(() => getBreakdownByClass(positions), [positions])

  return {
    positions,
    totalValue,
    breakdownByAsset,
    breakdownByClass,
    isLoading,
    error: error as Error | null,
    refetch: () => {
      assetsQuery.refetch()
      portfolioQuery.refetch()
      pricesQuery.refetch()
    },
    lastUpdated: portfolioQuery.data?.asOf ?? null,
  }
}

export type TimeRange = '1M' | '3M' | '6M' | 'YTD' | '1Y' | 'MAX'

const rangeToFromDate = (range: TimeRange) => {
  const reference = new Date()
  switch (range) {
    case '1M':
      return subMonths(reference, 1)
    case '3M':
      return subMonths(reference, 3)
    case '6M':
      return subMonths(reference, 6)
    case '1Y':
      return subMonths(reference, 12)
    case 'YTD':
      return startOfYear(reference)
    case 'MAX':
    default:
      return undefined
  }
}

export const timeRangeOptions: { label: string; value: TimeRange }[] = [
  { label: '1M', value: '1M' },
  { label: '3M', value: '3M' },
  { label: '6M', value: '6M' },
  { label: 'YTD', value: 'YTD' },
  { label: '1Y', value: '1Y' },
  { label: 'MAX', value: 'MAX' },
]

export const usePriceHistory = (assetIds: string[], range: TimeRange) => {
  const fromDate = rangeToFromDate(range)
  const toDate = new Date()

  return useQuery<PricePoint[]>({
    queryKey: ['price-history', assetIds.sort().join('-'), range],
    queryFn: () =>
      fetchPrices({
        assets: assetIds,
        from: fromDate ? formatISO(fromDate) : undefined,
        to: formatISO(toDate),
      }),
    enabled: assetIds.length > 0,
  })
}

