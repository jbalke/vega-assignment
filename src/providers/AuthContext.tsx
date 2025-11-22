import { createContext } from 'react'

export interface AuthUser {
  name: string
  email: string
}

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  error: string | null
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
