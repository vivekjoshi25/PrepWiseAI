import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Send } from 'lucide-react'
import { getMyInterviews, submitInterview } from '../api/interviews'
import { PageHeader } from '../components/ui/PageHeader'
import { GlassCard } from '../components/ui/GlassCard'
import { Spinner } from '../components/Spinner'

function isCompletedInterview(i) {
  return Boolean(i?.feedback && Array.isArray(i?.answers) && i.answers.length > 0)
}

export function Interview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [interview, setInterview] = useState(location.state?.interview)
  const [loading, setLoading] = useState(() => {
    const seed = location.state?.interview
    return !(seed && seed._id === id)
  })
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      await Promise.resolve()
      if (cancelled) return
      if (interview?._id === id) {
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
        if (!cancelled) setInterview(found)
      } catch {
        if (!cancelled) {
          toast.error('Could not load interview')
          navigate('/dashboard', { replace: true })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, interview, navigate])

  const questions = useMemo(() => interview?.questions ?? [], [interview])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      await Promise.resolve()
      if (cancelled) return
      if (!questions.length) return
      setAnswers((prev) => {
        if (prev.length === questions.length) return prev
        return questions.map((_, i) => prev[i] ?? '')
      })
    })()
    return () => {
      cancelled = true
    }
  }, [questions])

  useEffect(() => {
    if (!interview) return
    if (isCompletedInterview(interview)) {
      toast('This interview was already submitted', { icon: 'ℹ️' })
      navigate(`/results/${interview._id}`, { replace: true })
    }
  }, [interview, navigate])

  const total = questions.length
  const progress = total ? ((index + 1) / total) * 100 : 0

  const updateAnswer = (value) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const handleSubmit = async () => {
    if (!interview?._id) return
    const unanswered = answers.filter((a) => !String(a || '').trim()).length
    if (unanswered > 0) {
      const ok = window.confirm(
        `${unanswered} question(s) are still empty. Submit anyway? The model will evaluate whatever you provide.`,
      )
      if (!ok) return
    }
    setSubmitting(true)
    try {
      const { data } = await submitInterview(interview._id, answers)
      toast.success('Interview submitted')
      navigate(`/results/${interview._id}`, { state: { interview: data } })
    } catch (err) {
      const msg = err.response?.data?.message || 'Submit failed'
      toast.error(typeof msg === 'string' ? msg : 'Submit failed')
    } finally {
      setSubmitting(false)
    }
  }

  const questionText = useMemo(() => questions[index] || '', [questions, index])

  if (loading || !interview) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner label="Loading interview" />
      </div>
    )
  }

  if (!total) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-slate-400">This interview has no questions yet. Start a new session from the dashboard.</p>
      </div>
    )
  }

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Live session"
        title={interview.role}
        subtitle="Answer each prompt thoughtfully — you can move backward to refine earlier responses before submitting."
      />

      <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between gap-4 text-xs text-slate-400">
            <span>
              Question {index + 1} / {total}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-6 sm:p-8" glow>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/90">Question</p>
          <h2 className="mt-3 font-display text-xl font-semibold leading-relaxed text-white sm:text-2xl">{questionText}</h2>

          <label className="mt-8 block text-left text-sm text-slate-300">
            Your answer
            <textarea
              value={answers[index] ?? ''}
              onChange={(e) => updateAnswer(e.target.value)}
              rows={10}
              className="mt-3 w-full resize-y rounded-2xl border border-white/10 bg-surface-900/80 p-4 text-sm leading-relaxed text-white outline-none ring-1 ring-transparent transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-cyan-400/20"
              placeholder="Structure your thinking: context, tradeoffs, and a crisp conclusion."
            />
          </label>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition enabled:hover:border-cyan-400/40 enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                type="button"
                disabled={index >= total - 1}
                onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition enabled:hover:border-cyan-400/40 enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-surface-950 shadow-lg shadow-emerald-500/25 transition enabled:hover:brightness-110 disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {submitting ? 'Submitting…' : 'Submit interview'}
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
