import { useCallback, useMemo, useState, useEffect } from 'react'
import { api } from '../api/client'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('prepwise_token'))
  const [bootstrapping, setBootstrapping] = useState(() =>
    Boolean(localStorage.getItem('prepwise_token')),
  )

  const logout = useCallback(() => {
    localStorage.removeItem('prepwise_token')
    setToken(null)
    setUser(null)
    setBootstrapping(false)
  }, [])

  const loadProfile = useCallback(async (activeToken) => {
    if (!activeToken) {
      setUser(null)
      return null
    }
    const { data } = await api.get('/api/users/profile')
    setUser(data.user)
    return data.user
  }, [])

  useEffect(() => {
    const onUnauthorized = () => logout()
    window.addEventListener('prepwise:unauthorized', onUnauthorized)
    return () => window.removeEventListener('prepwise:unauthorized', onUnauthorized)
  }, [logout])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!token) {
        setUser(null)
        setBootstrapping(false)
        return
      }
      try {
        await loadProfile(token)
      } catch {
        if (!cancelled) logout()
      } finally {
        if (!cancelled) setBootstrapping(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [token, loadProfile, logout])

  const login = useCallback(
    async (email, password) => {
      const { data } = await api.post('/api/users/login', { email, password })
      const next = data.token
      localStorage.setItem('prepwise_token', next)
      setToken(next)
      await loadProfile(next)
      return data
    },
    [loadProfile],
  )

  const register = useCallback(async (payload) => {
    const { data } = await api.post('/api/users/register', payload)
    return data
  }, [])

  const refreshProfile = useCallback(async () => {
    const t = localStorage.getItem('prepwise_token')
    if (!t) return null
    return loadProfile(t)
  }, [loadProfile])

  const value = useMemo(
    () => ({
      user,
      token,
      bootstrapping,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, token, bootstrapping, login, register, logout, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
