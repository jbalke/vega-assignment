import { fireEvent, render, screen } from '@testing-library/react';
import i18next from 'i18next';
import type { ReactNode } from 'react';
import { beforeAll, describe, expect, vi } from 'vitest';

import type { BreakdownDatum } from '../../types/portfolio';
import { formatCurrency } from '../../utils/format';

import PortfolioDonut from './PortfolioDonut';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children?: ReactNode }) => (
    <div data-testid="mock-responsive">{children}</div>
  ),
  PieChart: ({ children }: { children?: ReactNode }) => (
    <div data-testid="mock-pie-chart">{children}</div>
  ),
  Pie: ({ children }: { children?: ReactNode }) => <div data-testid="mock-pie">{children}</div>,
  Cell: () => <div data-testid="mock-cell" />,
  Tooltip: () => <div data-testid="mock-tooltip" />,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: { type: '3rdParty', init: vi.fn() },
}));

const chartData: BreakdownDatum[] = [
  { id: 'btc', label: 'Bitcoin', value: 3_000, allocation: 0.3 },
  { id: 'eth', label: 'Ethereum', value: 7_000, allocation: 0.7 },
];

describe('PortfolioDonut', () => {
  const onModeChange = vi.fn();
  const onSelect = vi.fn();
  const totalValue = chartData.reduce((sum, datum) => sum + datum.value, 0);

  beforeAll(() => {
    (i18next as { language?: string }).language = 'en-GB';
  });

  beforeEach(() => {
    onModeChange.mockReset();
    onSelect.mockReset();
  });

  it('renders the total value and handles mode switches', () => {
    render(
      <PortfolioDonut
        data={chartData}
        totalValue={totalValue}
        mode="asset"
        onModeChange={onModeChange}
        activeId={null}
        onSelect={onSelect}
      />
    );

    expect(screen.getByText(formatCurrency(totalValue))).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'donut.views.class' }));
    expect(onModeChange).toHaveBeenCalledWith('class');
  });

  it('toggles a selection when clicking the list entries', () => {
    const { rerender } = render(
      <PortfolioDonut
        data={chartData}
        totalValue={totalValue}
        mode="asset"
        onModeChange={onModeChange}
        activeId={null}
        onSelect={onSelect}
      />
    );

    const bitcoinButton = screen.getByRole('button', { name: /Bitcoin/i });
    fireEvent.click(bitcoinButton);
    expect(onSelect).toHaveBeenCalledWith('btc');

    rerender(
      <PortfolioDonut
        data={chartData}
        totalValue={totalValue}
        mode="asset"
        onModeChange={onModeChange}
        activeId="btc"
        onSelect={onSelect}
      />
    );

    fireEvent.click(bitcoinButton);
    expect(onSelect).toHaveBeenLastCalledWith(null);
  });
});
