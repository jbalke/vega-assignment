import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AuthProvider } from './AuthProvider';
import { useAuth } from './useAuth';

describe('useAuth hook', () => {
  it('throws when used outside of AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrowError(/AuthProvider/);
  });

  it('returns an auth context when wrapped with AuthProvider', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('logout');
  });
});
