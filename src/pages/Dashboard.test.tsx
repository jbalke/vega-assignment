import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderApp } from '../utils/test/renderApp';

const renderDashboard = async () => {
  const utils = renderApp({ initialEntries: ['/dashboard'] });
  await screen.findByText(/6 rows/i);
  await screen.findByTestId('historical-performance-chart');
  return utils;
};

describe('Dashboard interactions', () => {
  it('allows switching donut mode and filtering positions from the donut list', async () => {
    const { user } = await renderDashboard();

    await user.click(screen.getByRole('button', { name: /class/i }));
    expect(screen.getByText(/exposure by class/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /asset/i }));

    const bitcoinRow = (await screen.findAllByText('Bitcoin'))[0].closest('tr');
    expect(bitcoinRow).toBeTruthy();
    await user.click(bitcoinRow!);

    expect(screen.getByText(/1 row/i)).toBeInTheDocument();

    const clearFilterButton = await screen.findByRole('button', { name: /clear filter/i });
    await user.click(clearFilterButton);
    expect(screen.getByText(/6 rows/i)).toBeInTheDocument();
  });

  it('updates the historical range selection when a new period is chosen', async () => {
    const { user } = await renderDashboard();

    const defaultRangeButton = await screen.findByRole('button', { name: '3M' });
    expect(defaultRangeButton).toHaveClass('bg-accent', 'text-white');

    const oneYearButton = await screen.findByRole('button', { name: '1Y' });
    await user.click(oneYearButton);

    const refreshedOneYearButton = await screen.findByRole('button', { name: '1Y' });
    const refreshedThreeMonthButton = await screen.findByRole('button', { name: '3M' });

    expect(refreshedOneYearButton).toHaveClass('bg-accent', 'text-white');
    expect(refreshedThreeMonthButton).not.toHaveClass('bg-accent', 'text-white');
  });

  it('updates translations when the language is changed via the footer selector', async () => {
    const { user } = await renderDashboard();

    const languageSelect = screen.getByTestId('language-select');
    await user.selectOptions(languageSelect, 'fr-FR');

    await screen.findByText(/valeur du portefeuille/i);
    expect(screen.getByRole('button', { name: /classe/i })).toBeVisible();
  });
});
