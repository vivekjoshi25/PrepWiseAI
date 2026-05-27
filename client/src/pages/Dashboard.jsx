import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mic2, TrendingUp, Trophy, Clock, ArrowUpRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/useAuth'
import { getMyInterviews } from '../api/interviews'
import { PageHeader } from '../components/ui/PageHeader'
import { GlassCard } from '../components/ui/GlassCard'
import { Spinner } from '../components/Spinner'

function isCompletedInterview(i) {
  return Boolean(i?.feedback && Array.isArray(i?.answers) && i.answers.length > 0)
}

export function Dashboard() {
  const { user } = useAuth()
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await getMyInterviews()
        if (!cancelled) setInterviews(Array.isArray(data) ? data : [])
      } catch {
        if (!cancelled) toast.error('Could not load interviews')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const stats = useMemo(() => {
    const completed = interviews.filter(isCompletedInterview)
    const avg =
      completed.length === 0
        ? null
        : completed.reduce((acc, i) => acc + Number(i.score || 0), 0) / completed.length
    const recent = [...interviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
    return { completedCount: completed.length, avg, recent, total: interviews.length }
  }, [interviews])

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Mission control"
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'founder'}`}
        subtitle="Track how your answers are trending, jump into a fresh session, or review what the model flagged last time."
      />

      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner label="Syncing interviews" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: 'Total sessions',
                  value: stats.total,
                  icon: Mic2,
                  hint: 'All generated interviews',
                },
                {
                  label: 'Completed',
                  value: stats.completedCount,
                  icon: Trophy,
                  hint: 'Submitted for scoring',
                },
                {
                  label: 'Average score',
                  value: stats.avg == null ? '—' : `${stats.avg.toFixed(1)} / 10`,
                  icon: TrendingUp,
                  hint: 'Across finished sessions',
                },
                {
                  label: 'Practice streak',
                  value: stats.total > 0 ? 'Active' : 'Start now',
                  icon: Clock,
                  hint: 'Consistency compounds',
                },
              ].map((card, idx) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <GlassCard className="p-5 text-left" glow={idx === 0}>
                    <div className="flex items-center justify-between">
                      <card.icon className="h-5 w-5 text-cyan-300" />
                      <span className="text-[11px] uppercase tracking-widest text-slate-500">{card.hint}</span>
                    </div>
                    <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-500">{card.label}</p>
                    <p className="mt-1 font-display text-3xl font-semibold text-white">{card.value}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-white">Continue your runway</h2>
                <p className="text-sm text-slate-400">Launch a new AI session — questions are generated for the exact role you specify.</p>
              </div>
              <Link
                to="/interview/start"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-600 px-6 py-3 text-sm font-semibold text-surface-950 shadow-lg shadow-cyan-500/30 transition hover:brightness-110"
              >
                <Mic2 className="h-4 w-4" />
                Start interview
              </Link>
            </div>

            <GlassCard className="p-6 text-left">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-lg font-semibold text-white">Recent interviews</h3>
                <Link to="/interview/history" className="text-xs font-semibold text-cyan-300 hover:text-cyan-200">
                  View all
                </Link>
              </div>
              <div className="mt-6 space-y-3">
                {stats.recent.length === 0 ? (
                  <p className="text-sm text-slate-500">No interviews yet — your first session will show up here.</p>
                ) : (
                  stats.recent.map((i) => (
                    <div
                      key={i._id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-white">{i.role}</p>
                        <p className="text-xs text-slate-500">
                          {i.createdAt ? new Date(i.createdAt).toLocaleString() : '—'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                          {isCompletedInterview(i) ? `Score ${i.score ?? '—'}` : 'In progress'}
                        </span>
                        {isCompletedInterview(i) ? (
                          <Link
                            to={`/results/${i._id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200"
                          >
                            Open results
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        ) : (
                          <Link
                            to={`/interview/${i._id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-violet-300 hover:text-violet-200"
                          >
                            Resume
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
          </>
        )}
      </div>
    </div>
  )
}
