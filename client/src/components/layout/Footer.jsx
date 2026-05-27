import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-surface-950/80 py-10 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan-300" />
          <span className="font-display text-lg font-semibold text-white">PrepWise AI</span>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-slate-400">
          <Link to="/" className="transition hover:text-white">
            Home
          </Link>
          <a href="/#features" className="transition hover:text-white">
            Features
          </a>
          <Link to="/login" className="transition hover:text-white">
            Log in
          </Link>
          <Link to="/register" className="transition hover:text-white">
            Register
          </Link>
        </div>
        <p className="text-xs text-slate-500 sm:text-right">© {new Date().getFullYear()} PrepWise AI. Built for serious practice.</p>
      </div>
    </footer>
  )
}
