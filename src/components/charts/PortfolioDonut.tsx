import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from 'recharts'

import type { BreakdownDatum } from '../../types/portfolio'
import { formatCurrency, formatPercent } from '../../utils/format'

const COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#f97316', '#6366f1', '#22d3ee', '#facc15']

interface PortfolioDonutProps {
  data: BreakdownDatum[]
  totalValue: number
  mode: 'asset' | 'class'
  onModeChange: (mode: 'asset' | 'class') => void
  activeId?: string | null
  onSelect?: (id: string | null) => void
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{
    payload: {
      label: string
      value: number
      allocation: number
    }
  }>
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  return (
    <div className="rounded-2xl border border-white/10 bg-surface/90 px-4 py-2 text-sm shadow-card">
      <div className="font-semibold text-white">{entry.payload.label}</div>
      <div className="text-muted">{formatCurrency(entry.payload.value)}</div>
      <div className="text-xs text-muted/70">{formatPercent(entry.payload.allocation * 100)}</div>
    </div>
  )
}

const PortfolioDonut = ({
  data,
  totalValue,
  mode,
  onModeChange,
  activeId,
  onSelect,
}: PortfolioDonutProps) => {
  const handleSliceClick = (entry: BreakdownDatum | null) => {
    if (!onSelect || !entry) return
    onSelect(activeId === entry.id ? null : entry.id)
  }

  return (
    <div className="glass-panel flex flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Portfolio Value</p>
          <p className="text-3xl font-semibold text-white">{formatCurrency(totalValue)}</p>
        </div>
        <div className="flex gap-2 rounded-full bg-white/5 p-1 text-sm">
          {(['asset', 'class'] as const).map(view => (
            <button
              key={view}
              onClick={() => onModeChange(view)}
              className={`rounded-full px-4 py-1.5 capitalize transition ${
                mode === view ? 'bg-accent text-white' : 'text-muted hover:text-white'
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
        <div className="h-80">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius="60%"
                outerRadius="90%"
                strokeWidth={2}
                fill="#8884d8"
                onClick={event =>
                  handleSliceClick((event?.payload ?? null) as BreakdownDatum | null)
                }
              >
                {data.map((entry, idx) => (
                  <Cell
                    key={entry.id}
                    fill={COLORS[idx % COLORS.length]}
                    opacity={activeId && activeId !== entry.id ? 0.4 : 0.95}
                    className="cursor-pointer transition"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-4">
          {data.map((entry, idx) => (
            <button
              key={entry.id}
              onClick={() => handleSliceClick(entry)}
              className={`flex items-center justify-between rounded-2xl border border-white/5 px-4 py-3 text-left transition hover:border-accent/50 ${
                activeId === entry.id ? 'bg-white/10' : ''
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-white">{entry.label}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">
                  {formatPercent(entry.allocation * 100)}
                </p>
              </div>
              <div className="text-base font-semibold text-white/90">
                {formatCurrency(entry.value)}
              </div>
              <span
                className="ml-3 h-3 w-3 rounded-full"
                style={{
                  backgroundColor: COLORS[idx % COLORS.length],
                  opacity: activeId && activeId !== entry.id ? 0.4 : 1,
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PortfolioDonut
