import { useMemo, useState } from 'react'

import HistoricalPerformance from '../components/charts/HistoricalPerformance'
import PortfolioDonut from '../components/charts/PortfolioDonut'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import PositionsTable from '../components/tables/PositionsTable'
import { usePortfolioOverview, usePriceHistory } from '../features/portfolio/hooks'
import type { TimeRange } from '../features/portfolio/hooks'
import { useAuth } from '../providers/AuthProvider'
import { formatRelativeTime } from '../utils/format'
import { buildHistoricalSeries } from '../utils/portfolio'

const DashboardPage = () => {
  const {
    positions,
    totalValue,
    breakdownByAsset,
    breakdownByClass,
    isLoading,
    error,
    refetch,
    lastUpdated,
  } = usePortfolioOverview()
  const { user, logout } = useAuth()

  const [mode, setMode] = useState<'asset' | 'class'>('asset')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [range, setRange] = useState<TimeRange>('3M')

  const handleModeChange = (newMode: 'asset' | 'class') => {
    setMode(newMode)
    setSelectedId(null)
  }

  const activeAssetIds = useMemo(() => {
    if (!positions.length) return []
    if (!selectedId) return positions.map(position => position.assetId)
    if (mode === 'asset') {
      return positions
        .filter(position => position.assetId === selectedId)
        .map(position => position.assetId)
    }
    return positions
      .filter(position => position.class.toUpperCase() === selectedId.toUpperCase())
      .map(position => position.assetId)
  }, [positions, selectedId, mode])

  const historyQuery = usePriceHistory(activeAssetIds, range)

  const historySeries = useMemo(
    () =>
      historyQuery.data
        ? buildHistoricalSeries({
            pricePoints: historyQuery.data,
            positions,
            assetFilter: activeAssetIds,
          })
        : [],
    [historyQuery.data, positions, activeAssetIds]
  )

  const filteredAssetRows = useMemo(() => {
    if (mode !== 'asset' || !selectedId) return positions
    return positions.filter(position => position.assetId === selectedId)
  }, [mode, positions, selectedId])

  const filteredClassRows = useMemo(() => {
    if (mode !== 'class' || !selectedId) return breakdownByClass
    return breakdownByClass.filter(item => item.id === selectedId)
  }, [mode, breakdownByClass, selectedId])

  const handleSelection = (id: string | null) => {
    setSelectedId(id)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.35),_rgba(7,9,15,1)_60%)] px-4 py-8 text-white md:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted">Welcome back</p>
          <h1 className="text-3xl font-semibold text-white">{user?.name}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-xs uppercase tracking-[0.2em] text-muted">
            Updated {lastUpdated ? formatRelativeTime(lastUpdated) : 'just now'}
          </div>
          <button
            onClick={refetch}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/50"
          >
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="mt-8 space-y-6">
        {error ? (
          <ErrorState onRetry={refetch} message={error.message} />
        ) : isLoading ? (
          <LoadingState />
        ) : (
          <>
            <PortfolioDonut
              data={mode === 'asset' ? breakdownByAsset : breakdownByClass}
              totalValue={totalValue}
              mode={mode}
              onModeChange={handleModeChange}
              activeId={selectedId}
              onSelect={handleSelection}
            />
            <HistoricalPerformance
              series={historySeries}
              range={range}
              onRangeChange={setRange}
              isLoading={historyQuery.isPending}
            />
            <PositionsTable
              assetRows={filteredAssetRows}
              classRows={filteredClassRows}
              mode={mode}
              activeId={selectedId}
              onSelect={handleSelection}
            />
          </>
        )}
      </section>
    </div>
  )
}

export default DashboardPage
