import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { AUTH_STORAGE_KEY } from './providers/AuthProvider';
import { renderApp } from './utils/test/renderApp';

afterEach(() => {
  // clears application state between tests, including auth and language preferences
  window.localStorage.clear();
});

describe('App happy paths', () => {
  it('allows a user to login from the login page', async () => {
    const { user } = renderApp({
      initialEntries: ['/login'],
      isAuthenticated: false,
    });

    // Wait for lazy-loaded LoginPage to resolve (findByRole will wait for Suspense to resolve)
    const submitButton = await screen.findByRole('button', { name: /access portfolio/i });
    await user.click(submitButton);

    // Wait for lazy-loaded DashboardPage to resolve after navigation
    expect(await screen.findByRole('button', { name: /logout/i }, { timeout: 10000 })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /ava patel/i })).toBeInTheDocument();
  });

  it('allows an authenticated user to logout', async () => {
    const { user } = renderApp({
      initialEntries: ['/dashboard'],
    });

    const logoutButton = await screen.findByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    expect(await screen.findByRole('heading', { name: /investor login/i })).toBeInTheDocument();
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });

  it('redirects an unauthenticated visitor away from the dashboard', async () => {
    renderApp({
      initialEntries: ['/dashboard'],
      isAuthenticated: false,
    });

    expect(await screen.findByRole('heading', { name: /investor login/i })).toBeInTheDocument();
  });
});
