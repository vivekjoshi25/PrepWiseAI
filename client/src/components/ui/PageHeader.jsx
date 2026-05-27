import { motion } from 'framer-motion'

export function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-6 sm:px-6 sm:pt-14">
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/90"
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl"
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-3 max-w-2xl text-base text-slate-400"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
