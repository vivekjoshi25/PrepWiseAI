import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Eye, History } from 'lucide-react'
import { getMyInterviews } from '../api/interviews'
import { PageHeader } from '../components/ui/PageHeader'
import { GlassCard } from '../components/ui/GlassCard'
import { Spinner } from '../components/Spinner'

function isCompletedInterview(i) {
  return Boolean(i?.feedback && Array.isArray(i?.answers) && i.answers.length > 0)
}

export function InterviewHistory() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await getMyInterviews()
        if (!cancelled) setRows(Array.isArray(data) ? data : [])
      } catch {
        if (!cancelled) toast.error('Could not load history')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const sorted = useMemo(
    () => [...rows].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [rows],
  )

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="history"
        title="Interview history"
        subtitle="Your completed interview history appears here: "
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner label="Fetching history" />
          </div>
        ) : (
          <GlassCard className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4">
              <History className="h-5 w-5 text-cyan-300" />
              <h2 className="font-display text-lg font-semibold text-white">Sessions</h2>
              <span className="ml-auto text-xs text-slate-500">{sorted.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                <thead className="bg-white/[0.02] text-xs uppercase tracking-widest text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Score</th>
                    <th className="px-6 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sorted.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                        No interviews logged yet.
                      </td>
                    </tr>
                  ) : (
                    sorted.map((row, idx) => (
                      <motion.tr
                        key={row._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="hover:bg-white/[0.02]"
                      >
                        <td className="px-6 py-4 font-medium text-white">{row.role}</td>
                        <td className="px-6 py-4 text-slate-400">
                          {row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {isCompletedInterview(row) ? `${row.score ?? '—'} / 10` : 'Pending'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isCompletedInterview(row) ? (
                            <Link
                              to={`/results/${row._id}`}
                              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition hover:border-cyan-400/40 hover:text-cyan-200"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Link>
                          ) : (
                            <Link
                              to={`/interview/${row._id}`}
                              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-violet-300 transition hover:border-violet-400/40 hover:text-violet-200"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Continue
                            </Link>
                          )}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  )
}
