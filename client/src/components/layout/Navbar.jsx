import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sparkles, LayoutDashboard, Mic2, History, User } from 'lucide-react'
import { useAuth } from '../../context/useAuth'

const linkClass =
  'rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white'

const activeClass = 'bg-white/10 text-white shadow-[0_0_20px_-6px_rgba(34,211,238,0.5)]'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const close = () => setOpen(false)

  const handleLogout = () => {
    logout()
    close()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="group flex items-center gap-2" onClick={close}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20 ring-1 ring-white/10 transition group-hover:glow-ring">
            <Sparkles className="h-5 w-5 text-cyan-300" aria-hidden />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
            PrepWise <span className="text-gradient">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''}`}>
            Home
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''}`}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/interview/start"
                className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''}`}
              >
                Start interview
              </NavLink>
              <NavLink
                to="/interview/history"
                className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''}`}
              >
                History
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''}`}
              >
                Profile
              </NavLink>
            </>
          ) : (
            <>
              <a href="/#features" className={linkClass}>
                Features
              </a>
              <a href="/#cta" className={linkClass}>
                Get access
              </a>
            </>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <span className="max-w-[140px] truncate text-xs text-slate-500" title={user?.email}>
                {user?.name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-cyan-500/90 to-violet-600/90 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110"
              >
                Create account
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex rounded-lg border border-white/10 bg-white/5 p-2 text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10 bg-surface-950/95 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              <Link to="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-200" onClick={close}>
                <Sparkles className="h-4 w-4 text-cyan-300" /> Home
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-200"
                    onClick={close}
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <Link
                    to="/interview/start"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-200"
                    onClick={close}
                  >
                    <Mic2 className="h-4 w-4" /> Start interview
                  </Link>
                  <Link
                    to="/interview/history"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-200"
                    onClick={close}
                  >
                    <History className="h-4 w-4" /> History
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-200"
                    onClick={close}
                  >
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 rounded-xl border border-white/10 bg-white/5 py-2 text-sm font-medium text-white"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <a href="/#features" className="rounded-lg px-3 py-2 text-slate-200" onClick={close}>
                    Features
                  </a>
                  <Link to="/login" className="rounded-lg px-3 py-2 text-slate-200" onClick={close}>
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 py-2 text-center text-sm font-semibold text-white"
                    onClick={close}
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
