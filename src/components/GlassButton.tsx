import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

type Props = { label: string; to: string; delay?: number }

function Spark({ left, top, delay = 0 }: { left: string; top: string; delay?: number }) {
  // Small diamond-like sparkle with cross glow
  return (
    <motion.span
      className="absolute pointer-events-none"
      style={{ left, top, width: 18, height: 18 }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: [0, 0.85, 0],
        scale: [0.6, 1.1, 0.7],
      }}
      transition={{ duration: 1.8, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <span
        className="absolute inset-0 rounded-[2px] rotate-45"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 35%, rgba(255,255,255,0) 70%)',
          filter:
            'drop-shadow(0 0 6px rgba(255,255,255,0.65)) drop-shadow(0 0 12px rgba(255,255,255,0.35))',
        }}
      />
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 28,
          height: 2,
          background:
            'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 100%)',
          filter: 'blur(0.4px)',
        }}
      />
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 2,
          height: 28,
          background:
            'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 100%)',
          filter: 'blur(0.4px)',
        }}
      />
    </motion.span>
  )
}

export default function GlassButton({ label, to, delay = 0 }: Props) {
  const nav = useNavigate()
  const [flying, setFlying] = React.useState(false)
  const [hovered, setHovered] = React.useState(false)

  return (
    <motion.button
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      onClick={() => {
        setFlying(true)
        setTimeout(() => nav(to), 420)
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative w-56 h-14 rounded-2xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-xl text-white font-medium tracking-wide"
      style={{ WebkitBackdropFilter: 'blur(20px)' as any }}
    >
      {/* glass layers */}
      <motion.span
        className="absolute inset-0"
        animate={{ opacity: hovered ? 1 : 0.85 }}
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06))' }}
        transition={{ duration: 0.35 }}
      />
      <motion.span
        className="absolute inset-0 rounded-2xl"
        animate={{ boxShadow: hovered ? '0 0 24px rgba(255,255,255,0.18) inset' : '0 0 14px rgba(255,255,255,0.10) inset' }}
        transition={{ duration: 0.35 }}
      />

      {/* diamond sparkles (no moving sweep) */}
      <Spark left="12%" top="45%" delay={0.05} />
      <Spark left="38%" top="30%" delay={0.25} />
      <Spark left="58%" top="60%" delay={0.55} />
      <Spark left="78%" top="40%" delay={0.85} />
      <Spark left="22%" top="68%" delay={1.05} />

      {/* Label (flies right on click) */}
      <motion.span
        className="relative z-10"
        animate={flying ? { x: 600, opacity: 0.3, rotate: -8 } : { x: 0, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 16 }}
      >
        {label}
      </motion.span>

      {/* subtle outer glow on hover */}
      <motion.span
        className="absolute -inset-px rounded-2xl pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        style={{ boxShadow: '0 0 24px rgba(255,255,255,0.18)' }}
        transition={{ duration: 0.35 }}
      />
    </motion.button>
  )
}
