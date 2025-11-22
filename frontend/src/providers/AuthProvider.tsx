import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

interface AuthUser {
  name: string
  email: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  error: string | null
}

const AUTH_STORAGE_KEY = 'vega-auth-user'

const allowedUser: AuthUser & { password: string } = {
  name: 'Ava Patel',
  email: 'investor@vega.app',
  password: 'portfolio',
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const readStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [user])

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    if (email === allowedUser.email && password === allowedUser.password) {
      setUser({ name: allowedUser.name, email: allowedUser.email })
      setError(null)
      return
    }
    setError('Invalid email or password')
    throw new Error('Invalid email or password')
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      error,
    }),
    [user, login, logout, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

