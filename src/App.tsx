import type { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import { useAuth } from './providers/useAuth'

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

const PublicRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

const App = () => (
  <Routes>
    <Route
      path="/login"
      element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      }
    />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
)

export default App
