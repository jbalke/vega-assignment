import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import AppErrorBoundary from './components/common/AppErrorBoundary';
import './i18n/i18n';
import './index.css';
import { AuthProvider } from './providers/AuthProvider';

async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return;
  }

  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container missing in index.html');
}

enableMocking().then(() => {
  createRoot(container).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <AppErrorBoundary
              onReset={() => {
                queryClient.clear();
                window.location.reload();
              }}
            >
              <App />
            </AppErrorBoundary>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
});
