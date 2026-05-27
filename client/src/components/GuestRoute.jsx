import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { Spinner } from './Spinner'

export function GuestRoute() {
  const { isAuthenticated, bootstrapping, token } = useAuth()

  if (bootstrapping && token) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner label="Loading session" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
