import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { User, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { GlassCard } from '../components/ui/GlassCard'

export function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await register({ name: name.trim(), email: email.trim(), password })
      toast.success('Account created — log in to continue')
      navigate('/login', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 sm:py-20">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-300/90">Onboarding</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white">Create your PrepWise workspace</h1>
        <p className="mt-2 text-sm text-slate-400">register with an account to start preparing</p>
      </motion.div>

      <GlassCard className="mt-10 p-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block text-left text-sm text-slate-300">
            Full name
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-surface-900/80 px-3 py-2.5 ring-1 ring-transparent transition focus-within:border-fuchsia-400/40 focus-within:ring-fuchsia-400/20">
              <User className="h-4 w-4 text-slate-500" />
              <input
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                placeholder="Alex Rivera"
              />
            </div>
          </label>

          <label className="block text-left text-sm text-slate-300">
            Email
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-surface-900/80 px-3 py-2.5 ring-1 ring-transparent transition focus-within:border-fuchsia-400/40 focus-within:ring-fuchsia-400/20">
              <Mail className="h-4 w-4 text-slate-500" />
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                placeholder="you@company.com"
              />
            </div>
          </label>

          <label className="block text-left text-sm text-slate-300">
            Password
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-surface-900/80 px-3 py-2.5 ring-1 ring-transparent transition focus-within:border-fuchsia-400/40 focus-within:ring-fuchsia-400/20">
              <Lock className="h-4 w-4 text-slate-500" />
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                placeholder="At least 6 characters"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Creating account…' : 'Register'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-fuchsia-300 hover:text-fuchsia-200">
            Log in
          </Link>
        </p>
      </GlassCard>
    </div>
  )
}
