import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, User as UserIcon, BarChart3, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/useAuth'
import { getMyInterviews } from '../api/interviews'
import { PageHeader } from '../components/ui/PageHeader'
import { GlassCard } from '../components/ui/GlassCard'
import { Spinner } from '../components/Spinner'

function isCompletedInterview(i) {
  return Boolean(i?.feedback && Array.isArray(i?.answers) && i.answers.length > 0)
}

export function Profile() {
  const { user, refreshProfile } = useAuth()
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await refreshProfile?.()
        const { data } = await getMyInterviews()
        if (!cancelled) setInterviews(Array.isArray(data) ? data : [])
      } catch {
        if (!cancelled) toast.error('Could not refresh profile data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
  }, [refreshProfile])

  const stats = useMemo(() => {
    const completed = interviews.filter(isCompletedInterview)
    const avg =
      completed.length === 0
        ? null
        : completed.reduce((acc, i) => acc + Number(i.score || 0), 0) / completed.length
    return { total: interviews.length, avg }
  }, [interviews])

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Identity"
        title="Your profile"
        subtitle="Your profile information is given below : "
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner label="Loading profile" />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="overflow-hidden p-0" glow>
              <div className="relative bg-gradient-to-br from-cyan-500/25 via-transparent to-fuchsia-500/20 px-8 py-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                  <Sparkles className="h-8 w-8 text-cyan-200" />
                </div>
                <h2 className="mt-6 font-display text-3xl font-semibold text-white">{user?.name}</h2>
                <p className="mt-1 text-sm text-slate-300">PrepWise AI Learner</p>
              </div>
              <div className="space-y-4 px-8 py-8">
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500">Name</p>
                    <p className="text-sm text-white">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500">Email</p>
                    <p className="text-sm text-white">{user?.email}</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                      <BarChart3 className="h-3.5 w-3.5" />
                      Total interviews
                    </div>
                    <p className="mt-2 font-display text-3xl font-semibold text-white">{stats.total}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                      <BarChart3 className="h-3.5 w-3.5" />
                      Average score
                    </div>
                    <p className="mt-2 font-display text-3xl font-semibold text-white">
                      {stats.avg == null ? '—' : `${stats.avg.toFixed(1)}`}
                      {stats.avg != null && <span className="text-lg text-slate-500"> /10</span>}
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  )
}
