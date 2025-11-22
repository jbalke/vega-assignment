import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { timeRangeOptions } from '../../features/portfolio/hooks'
import type { TimeRange } from '../../features/portfolio/hooks'
import type { HistoricalPoint } from '../../types/portfolio'
import { formatCurrency, formatDateLabel } from '../../utils/format'
import LoadingState from '../common/LoadingState'

interface HistoricalPerformanceProps {
  series: HistoricalPoint[]
  range: TimeRange
  onRangeChange: (range: TimeRange) => void
  isLoading?: boolean
}

const HistoricalPerformance = ({ series, range, onRangeChange, isLoading }: HistoricalPerformanceProps) => {
  if (!series.length && isLoading) {
    return <LoadingState label="Crunching historical performance..." />
  }

  return (
    <div className="glass-panel flex flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted">Performance</p>
          {series.length ? (
            <p className="text-2xl font-semibold text-white">
              {formatCurrency(series[series.length - 1]?.value ?? 0)}
            </p>
          ) : null}
        </div>
        <div className="flex gap-2">
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onRangeChange(option.value)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                range === option.value ? 'bg-accent text-white' : 'bg-white/5 text-muted hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-80">
        {series.length ? (
          <ResponsiveContainer>
            <AreaChart data={series}>
              <defs>
                <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDateLabel} stroke="#94a3b8" fontSize={12} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value).replace('$', '')}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15,23,42,0.95)',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '0.75rem 1rem',
                }}
                labelFormatter={(label) => formatDateLabel(label)}
                formatter={(value: number) => [formatCurrency(value), 'Value']}
              />
              <Area type="monotone" dataKey="value" stroke="#c4b5fd" strokeWidth={2} fill="url(#performanceGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-muted">No data for selected range.</div>
        )}
      </div>
    </div>
  )
}

export default HistoricalPerformance

