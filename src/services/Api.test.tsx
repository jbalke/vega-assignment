import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { errorHandlers, successHandlers } from '../mocks/handlers';
import { server } from '../mocks/server';
import { renderApp } from '../utils/test/renderApp';

afterEach(() => {
  window.localStorage.clear();
});

describe('Dashboard API integration', () => {
  it('renders portfolio data when APIs succeed', async () => {
    renderApp({ initialEntries: ['/dashboard'] });

    expect(await screen.findByText(/portfolio value/i)).toBeInTheDocument();
    expect(await screen.findByText(/bitcoin/i)).toBeInTheDocument();
    expect(await screen.findByRole('table', { name: /positions/i })).toBeInTheDocument();
  });

  const failureCases = [
    { name: 'assets', handler: errorHandlers.assets },
    { name: 'portfolio', handler: errorHandlers.portfolios },
    { name: 'prices', handler: errorHandlers.prices },
  ] as const;

  failureCases.forEach(({ name, handler }) => {
    it(`shows an error and recovers when the ${name} API fails`, async () => {
      server.use(handler);

      const { user } = renderApp({ initialEntries: ['/dashboard'] });

      const retryButton = await screen.findByRole('button', { name: /retry/i });
      expect(screen.getByText(new RegExp(`Failed to fetch ${name}`, 'i'))).toBeInTheDocument();

      server.use(...successHandlers);
      await user.click(retryButton);

      expect(await screen.findByRole('table', { name: /positions/i })).toBeInTheDocument();
    });
  });
});
