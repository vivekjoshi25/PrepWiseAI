import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { Spinner } from './Spinner'

export function ProtectedRoute() {
  const { isAuthenticated, bootstrapping, token } = useAuth()
  const location = useLocation()

  if (bootstrapping && token) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner label="Loading session" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
