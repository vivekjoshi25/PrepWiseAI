import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain,
  LineChart,
  ShieldCheck,
  Zap,
  MessageSquare,
  Cpu,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { useAuth } from '../context/useAuth'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
}

const features = [
  {
    title: 'Role-aware questioning',
    body: 'Every session adapts to the stack you target — from MERN to ML — powered by frontier models.',
    icon: Brain,
  },
  {
    title: 'Structured scoring',
    body: 'Receive a concise numeric score plus written feedback aligned to your answers.',
    icon: LineChart,
  },
  {
    title: 'Interview-grade tone',
    body: 'Practice under pressure with realistic pacing, clarity, and depth — not generic trivia.',
    icon: MessageSquare,
  },
  {
    title: 'Secure sessions',
    body: 'Your progress stays tied to your account with token-protected APIs and clean data hygiene.',
    icon: ShieldCheck,
  },
  {
    title: 'Velocity mode',
    body: 'Spin up a new mock interview in seconds whenever inspiration — or a recruiter — strikes.',
    icon: Zap,
  },
  {
    title: 'Signal for hiring loops',
    body: 'Sharpen narratives recruiters actually probe: system design, tradeoffs, and ownership.',
    icon: Cpu,
  },
]

export function Landing() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="relative">
      <section className="relative overflow-hidden px-4 pb-20 pt-12 sm:px-6 sm:pb-28 sm:pt-16">
        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-cyan-200/90"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI interview studio
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.6 }}
            className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl sm:leading-[1.05]"
          >
            The mock interview that{' '}
            <span className="text-gradient">thinks in job descriptions</span>, not flashcards.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-6 max-w-2xl text-lg text-slate-400"
          >
            PrepWise AI generates targeted questions for your role, captures your answers, and returns a calibrated
            score with actionable feedback — end to end on your stack.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-4"
            id="cta"
          >
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-600 px-7 py-3.5 text-sm font-semibold text-surface-950 shadow-[0_0_40px_-6px_rgba(34,211,238,0.65)] transition hover:brightness-110"
            >
              Start practicing free
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="rounded-2xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:border-cyan-400/40 hover:bg-white/10"
              >
                I already have an account
              </Link>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-16 grid gap-4 sm:grid-cols-3"
          >
            {[
              { label: 'Adaptive questioning', value: 'Per-role' },
              { label: 'Feedback loop', value: 'Score + AI' },
              { label: 'Built for depth', value: '10 prompts' },
            ].map((item) => (
              <GlassCard key={item.label} className="p-5 text-left" glow>
                <p className="text-xs uppercase tracking-widest text-slate-500">{item.label}</p>
                <p className="mt-2 font-display text-xl font-semibold text-white">{item.value}</p>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="features" className="border-y border-white/10 bg-surface-900/40 py-20 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fadeUp} className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/90">Product surface</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">Everything you need to rehearse like it is real.</h2>
            <p className="mt-4 text-slate-400">
              A focused workflow: choose a role, answer under time pressure, submit for scoring, and review your history
              whenever you need conviction.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div key={f.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.05 }}>
                <GlassCard className="h-full p-6 text-left">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/15 to-fuchsia-500/15 ring-1 ring-white/10">
                    <f.icon className="h-5 w-5 text-cyan-300" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.body}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-10 shadow-[0_0_80px_-20px_rgba(167,139,250,0.35)] sm:p-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-300/90">Ready when you are</p>
              <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold text-white sm:text-4xl">
                Ship answers that sound like you have already done the job.
              </h2>
              <p className="mt-4 max-w-xl text-slate-400">
                Join PrepWise AI, pick a track, and run a full interview loop backed by your live API — no mock data
                paths, no disconnected UI.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-sm font-semibold text-surface-950 transition hover:bg-slate-100"
              >
                Create your workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/5"
                >
                  Log in to continue
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
