import type { BreakdownDatum, EnrichedPosition } from '../../types/portfolio';
import { formatCurrency, formatPercent } from '../../utils/format';

interface PositionsTableProps {
  assetRows: EnrichedPosition[];
  classRows: BreakdownDatum[];
  mode: 'asset' | 'class';
  activeId?: string | null;
  onSelect?: (id: string | null) => void;
}

const assetHeaders = ['Asset', 'Class', 'Quantity', 'Price', 'Value', 'Allocation'];
const classHeaders = ['Class', 'Holdings', 'Value', 'Allocation'];

const PositionsTable = ({
  assetRows,
  classRows,
  mode,
  activeId,
  onSelect,
}: PositionsTableProps) => {
  const rows = mode === 'asset' ? assetRows : classRows;

  return (
    <div className="glass-panel overflow-hidden p-0">
      <div className="flex items-center justify-between px-6 py-5">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted">
            {mode === 'asset' ? 'Positions' : 'Exposure by class'}
          </p>
          <p className="text-xl font-semibold text-white">{rows.length} rows</p>
        </div>
        {activeId ? (
          <button
            className="text-xs font-semibold uppercase tracking-[0.2em] text-accent transition hover:text-white"
            onClick={() => onSelect?.(null)}
          >
            Clear filter
          </button>
        ) : null}
      </div>
      <div className="overflow-x-auto">
        <table
          className="w-full min-w-[600px] table-fixed border-collapse text-sm"
          aria-label="Positions"
        >
          <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.2em] text-muted">
            <tr>
              {(mode === 'asset' ? assetHeaders : classHeaders).map(header => (
                <th key={header} scope="col" className="px-6 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mode === 'asset'
              ? assetRows.map(row => (
                  <tr
                    key={row.id}
                    onClick={() => onSelect?.(activeId === row.assetId ? null : row.assetId)}
                    className={`cursor-pointer border-t border-white/5 transition hover:bg-white/5 ${
                      activeId === row.assetId ? 'bg-white/10' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-white">
                      <div className="font-semibold">{row.symbol}</div>
                      <p className="text-xs text-muted">{row.name}</p>
                    </td>
                    <td className="px-6 py-4 capitalize text-muted">{row.class}</td>
                    <td className="px-6 py-4">{row.quantity.toLocaleString()}</td>
                    <td className="px-6 py-4">{formatCurrency(row.price)}</td>
                    <td className="px-6 py-4 font-semibold text-white">
                      {formatCurrency(row.value)}
                    </td>
                    <td className="px-6 py-4">{formatPercent(row.allocation * 100)}</td>
                  </tr>
                ))
              : classRows.map(row => (
                  <tr
                    key={row.id}
                    onClick={() => onSelect?.(activeId === row.id ? null : row.id)}
                    className={`cursor-pointer border-t border-white/5 transition hover:bg-white/5 ${
                      activeId === row.id ? 'bg-white/10' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-white font-semibold capitalize">{row.label}</td>
                    <td className="px-6 py-4 text-muted">
                      {assetRows.filter(asset => asset.class.toUpperCase() === row.label).length}
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      {formatCurrency(row.value)}
                    </td>
                    <td className="px-6 py-4">{formatPercent(row.allocation * 100)}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PositionsTable;
