import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Award, LayoutDashboard } from 'lucide-react'
import { getMyInterviews } from '../api/interviews'
import { PageHeader } from '../components/ui/PageHeader'
import { GlassCard } from '../components/ui/GlassCard'
import { Spinner } from '../components/Spinner'

function isCompletedInterview(i) {
  return Boolean(i?.feedback && Array.isArray(i?.answers) && i.answers.length > 0)
}

export function Result() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [interview, setInterview] = useState(location.state?.interview)
  const [loading, setLoading] = useState(
    () => !(location.state?.interview?._id === id && isCompletedInterview(location.state?.interview)),
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      await Promise.resolve()
      if (cancelled) return
      if (interview?._id === id && isCompletedInterview(interview)) {
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const { data } = await getMyInterviews()
        const list = Array.isArray(data) ? data : []
        const found = list.find((i) => i._id === id)
        if (!found) {
          toast.error('Interview not found')
          navigate('/dashboard', { replace: true })
          return
        }
        if (!isCompletedInterview(found)) {
          toast.error('This interview is not finished yet')
          navigate(`/interview/${id}`, { replace: true })
          return
        }
        if (!cancelled) setInterview(found)
      } catch {
        if (!cancelled) toast.error('Could not load results')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, interview, navigate])

  const score = Number(interview?.score ?? 0)
  const pct = Math.min(100, Math.max(0, (score / 10) * 100))

  if (loading || !interview) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner label="Loading results" />
      </div>
    )
  }

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Evaluation"
        title="Your AI debrief is ready"
        subtitle={`Role: ${interview.role}`}
      />

      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <GlassCard className="flex flex-col items-center justify-center p-10 text-center" glow>
            <div className="relative flex h-48 w-48 items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120" aria-hidden>
                <circle cx="60" cy="60" r="52" stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="52"
                  stroke="url(#scoreGrad)"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 52}
                  initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - pct / 100) }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="relative">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Score</p>
                <p className="font-display text-5xl font-semibold text-white">
                  {score}
                  <span className="text-2xl text-slate-500">/10</span>
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm text-slate-400">
              Pulled directly from PUT /api/interviews/submit/:id — numeric score plus narrative feedback from the evaluator model.
            </p>
          </GlassCard>

          <GlassCard className="p-8 text-left">
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-amber-300" />
              <h2 className="font-display text-xl font-semibold text-white">AI feedback</h2>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{interview.feedback}</p>
          </GlassCard>
        </div>

        <div className="flex justify-center pt-2">
          <Link
            to="/dashboard"
            className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 px-10 py-3.5 text-sm font-semibold text-white shadow-[0_0_36px_-8px_rgba(34,211,238,0.55)] ring-1 ring-white/10 transition hover:brightness-110 hover:shadow-[0_0_48px_-6px_rgba(167,139,250,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/80"
          >
            <LayoutDashboard className="h-4 w-4 opacity-90 transition group-hover:scale-105" aria-hidden />
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
