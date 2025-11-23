import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderResult } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';

import App from '../../App';
import type { AuthUser } from '../../providers/AuthContext';
import { AUTH_STORAGE_KEY, AuthProvider } from '../../providers/AuthProvider';

const defaultAuthUser: AuthUser = {
  name: 'Test Investor',
  email: 'investor@vega.app',
};

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

type RenderAppOptions = {
  initialEntries?: MemoryRouterProps['initialEntries'];
  isAuthenticated?: boolean;
  authUser?: AuthUser;
  userEventOptions?: Parameters<typeof userEvent.setup>[0];
};

export type RenderAppResult = RenderResult & {
  user: UserEvent;
  queryClient: QueryClient;
};

const syncAuthState = (isAuthenticated: boolean, authUser: AuthUser) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (isAuthenticated) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
  } else {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

export const renderApp = (options: RenderAppOptions = {}): RenderAppResult => {
  const {
    initialEntries = ['/'],
    isAuthenticated = true,
    authUser = defaultAuthUser,
    userEventOptions,
  } = options;

  syncAuthState(isAuthenticated, authUser);

  const queryClient = createTestQueryClient();
  const user = userEvent.setup(userEventOptions);

  const renderResult = render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <App />
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>
  );

  return {
    user,
    queryClient,
    ...renderResult,
  };
};
