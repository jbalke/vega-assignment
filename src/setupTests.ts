import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import { server } from './mocks/server';

// Preload lazy-loaded components for tests
// This ensures React.lazy() resolves synchronously in test environment
beforeAll(async () => {
  // Preload page components so lazy loading works in tests
  await Promise.all([import('./pages/LoginPage'), import('./pages/DashboardPage')]);
});

beforeAll(() => {
  // Mock ResizeObserver for Recharts ResponsiveContainer
  if (typeof window !== 'undefined') {
    class ResizeObserverMock {
      callback: ResizeObserverCallback;

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }

      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }

    window.ResizeObserver = ResizeObserverMock;
  }

  // Mock getBoundingClientRect for Recharts ResponsiveContainer
  const mockRect = {
    width: 800,
    height: 400,
    top: 0,
    left: 0,
    right: 800,
    bottom: 400,
    x: 0,
    y: 0,
    toJSON: () => {},
  };

  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value: vi.fn(() => mockRect),
  });

  Object.defineProperty(SVGElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value: vi.fn(() => mockRect),
  });

  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
