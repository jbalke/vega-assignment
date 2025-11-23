import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { AuthContext, type AuthUser } from './AuthContext';

export const AUTH_STORAGE_KEY = 'vega-auth-user';

const allowedUser: AuthUser & { password: string } = {
  name: 'Ava Patel',
  email: 'investor@vega.app',
  password: 'portfolio',
};
const INVALID_CREDENTIALS_ERROR = 'invalidCredentials';

const readStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    if (email === allowedUser.email && password === allowedUser.password) {
      setUser({ name: allowedUser.name, email: allowedUser.email });
      setError(null);
      return;
    }
    setError(INVALID_CREDENTIALS_ERROR);
    throw new Error(INVALID_CREDENTIALS_ERROR);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      error,
    }),
    [user, login, logout, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
