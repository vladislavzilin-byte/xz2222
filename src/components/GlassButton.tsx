import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

type Props = { label: string; to: string; delay?: number }

export default function GlassButton({ label, to, delay = 0 }: Props) {
  const nav = useNavigate()
  const [flying, setFlying] = React.useState(false)

  return (
    <motion.button
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      onClick={() => {
        setFlying(true)
        setTimeout(() => nav(to), 420)
      }}
      className="relative w-56 h-14 rounded-2xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-xl text-white font-medium tracking-wide"
      style={{ WebkitBackdropFilter: 'blur(20px)' as any }}
    >
      {/* glass base */}
      <span className="absolute inset-0 bg-gradient-to-br from-white/12 to-white/5" />
      <span className="absolute inset-0 rounded-2xl ring-1 ring-white/20" />

      {/* Main diamond sweep — R ➜ L, full height, softer brightness */}
      <motion.span
        className="absolute inset-y-0 right-0 rounded-2xl pointer-events-none mix-blend-screen"
        style={{
          width: '160%',
          filter: 'blur(1.2px)',
          background:
            'linear-gradient(90deg,\
              rgba(0,0,0,0) 0%,\
              rgba(176,216,255,0.06) 18%,\
              rgba(196,228,255,0.14) 30%,\
              rgba(255,248,236,0.22) 42%,\
              rgba(231,214,255,0.16) 54%,\
              rgba(176,216,255,0.08) 68%,\
              rgba(0,0,0,0) 100%)',
        }}
        animate={{ x: ['110%', '-120%'], opacity: [0.55, 0.75, 0.55] }}
        transition={{ duration: 6.24, repeat: Infinity, ease: 'linear' }}
      />

      {/* Center glint — now also full height, even dimmer */}
      <motion.span
        className="absolute inset-y-0 right-0 rounded-2xl pointer-events-none mix-blend-screen"
        style={{
          width: '140%',
          filter: 'blur(0.9px)',
          background:
            'linear-gradient(90deg,\
              rgba(0,0,0,0) 0%,\
              rgba(190,230,255,0.04) 30%,\
              rgba(255,255,245,0.12) 50%,\
              rgba(215,205,255,0.08) 70%,\
              rgba(0,0,0,0) 100%)',
        }}
        animate={{ x: ['110%', '-120%'], opacity: [0.45, 0.65, 0.45] }}
        transition={{ duration: 6.24, repeat: Infinity, ease: 'linear' }}
      />

      {/* Label (flies right on click) */}
      <motion.span
        className="relative z-10"
        animate={flying ? { x: 600, opacity: 0.3, rotate: -8 } : { x: 0, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 16 }}
      >
        {label}
      </motion.span>
    </motion.button>
  )
}
