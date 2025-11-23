import { fireEvent, render, screen } from '@testing-library/react';
import i18next from 'i18next';
import type { ReactNode } from 'react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import HistoricalPerformance from './HistoricalPerformance';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children?: ReactNode }) => (
    <div data-testid="mock-responsive">{children}</div>
  ),
  AreaChart: ({ children }: { children?: ReactNode }) => (
    <div data-testid="mock-area-chart">{children}</div>
  ),
  Area: () => <div data-testid="mock-area" />,
  CartesianGrid: () => <div data-testid="mock-grid" />,
  XAxis: () => <div data-testid="mock-x-axis" />,
  YAxis: () => <div data-testid="mock-y-axis" />,
  Tooltip: () => <div data-testid="mock-tooltip" />,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: { type: '3rdParty', init: vi.fn() },
}));

const seriesData = [
  { date: '2024-01-01', value: 120 },
  { date: '2024-02-01', value: 180 },
  { date: '2024-03-01', value: 240 },
];

describe('HistoricalPerformance', () => {
  const onRangeChange = vi.fn();

  beforeAll(() => {
    (i18next as { language?: string }).language = 'en-GB';
  });

  beforeEach(() => {
    onRangeChange.mockReset();
  });

  it('shows the loading state when data is pending', () => {
    render(
      <HistoricalPerformance series={[]} range="1M" onRangeChange={onRangeChange} isLoading />
    );

    expect(screen.getByText('states.historicalLoading')).toBeVisible();
  });

  it('renders the chart when data is available and reacts to range changes', () => {
    render(<HistoricalPerformance series={seriesData} range="1M" onRangeChange={onRangeChange} />);

    expect(screen.getByText('dashboard.performance')).toBeVisible();
    const targetButton = screen.getByRole('button', { name: '6M' });
    fireEvent.click(targetButton);
    expect(onRangeChange).toHaveBeenCalledWith('6M');
    expect(screen.getByTestId('historical-performance-chart')).toBeInTheDocument();
  });

  it('shows the no-data placeholder when there are no points and loading is false', () => {
    render(
      <HistoricalPerformance
        series={[]}
        range="1M"
        onRangeChange={onRangeChange}
        isLoading={false}
      />
    );

    expect(screen.getByText('dashboard.noData')).toBeVisible();
  });
});
