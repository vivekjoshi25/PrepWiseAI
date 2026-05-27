import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, ArrowRight } from 'lucide-react'
import { PRESET_ROLES } from '../constants/roles'
import { createInterview } from '../api/interviews'
import { PageHeader } from '../components/ui/PageHeader'
import { GlassCard } from '../components/ui/GlassCard'

export function StartInterview() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [busyRole, setBusyRole] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return PRESET_ROLES
    return PRESET_ROLES.filter((r) => r.toLowerCase().includes(q))
  }, [query])

  const startWithRole = async (role) => {
    const trimmed = role.trim()
    if (!trimmed) {
      toast.error('Enter or select a role')
      return
    }
    setBusyRole(trimmed)
    try {
      const { data } = await createInterview(trimmed)
      toast.success('Interview generated')
      navigate(`/interview/${data._id}`, { state: { interview: data } })
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not create interview'
      toast.error(typeof msg === 'string' ? msg : 'Could not create interview')
    } finally {
      setBusyRole(null)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    startWithRole(query)
  }

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Configuration"
        title="Choose the Topic you are interviewing for"
        
      />

      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
        <GlassCard className="p-6 sm:p-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <label className="flex-1 text-left text-sm text-slate-300">
              Search or type a custom role
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-surface-900/80 px-4 py-3 ring-1 ring-transparent transition focus-within:border-cyan-400/40 focus-within:ring-cyan-400/20">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Staff Backend Engineer, Rust systems, etc."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                />
              </div>
            </label>
            <button
              type="submit"
              disabled={Boolean(busyRole)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition enabled:hover:brightness-110 disabled:opacity-60"
            >
              {busyRole && !PRESET_ROLES.includes(busyRole) ? 'Generating…' : 'Generate interview'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </GlassCard>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((role) => {
              const loading = busyRole === role
              return (
                <motion.button
                  layout
                  key={role}
                  type="button"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  disabled={Boolean(busyRole)}
                  onClick={() => startWithRole(role)}
                  className="text-left"
                >
                  <GlassCard
                    className={`h-full p-5 transition ${loading ? 'glow-ring' : 'hover:border-cyan-400/30'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/15 ring-1 ring-white/10">
                        <Sparkles className="h-5 w-5 text-cyan-200" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {loading ? 'Working' : 'Select'}
                      </span>
                    </div>
                    <p className="mt-4 font-display text-lg font-semibold text-white">{role}</p>
                    <p className="mt-2 text-sm text-slate-400">Generate a full question set for this track.</p>
                  </GlassCard>
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-sm text-slate-500">No preset roles match that filter — submit the search box to use your custom title.</p>
        )}
      </div>
    </div>
  )
}
