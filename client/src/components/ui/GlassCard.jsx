import { motion } from 'framer-motion'

export function GlassCard({ children, className = '', glow = false, ...props }) {
  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`glass-panel ${glow ? 'glow-ring' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
