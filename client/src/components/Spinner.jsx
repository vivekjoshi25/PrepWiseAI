import { motion } from 'framer-motion'

export function Spinner({ label = 'Loading' }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="h-12 w-12 rounded-full border-2 border-white/15 border-t-cyan-400 border-r-violet-400"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        aria-hidden
      />
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  )
}
