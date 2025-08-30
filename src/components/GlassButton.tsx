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

      {/* Shimmering DIAMOND sweep — right ➜ left, light blur, no solid white */}
      <motion.span
        className="absolute inset-y-0 left-0 rounded-2xl pointer-events-none mix-blend-screen"
        style={{
          width: '180%',
          filter: 'blur(1.2px)',
          background:
            // icy blue → soft pearl → lilac → back to ice; all semi-transparent
            'linear-gradient(270deg,\
              rgba(0,0,0,0) 0%,\
              rgba(176,216,255,0.10) 18%,\
              rgba(196,228,255,0.22) 30%,\
              rgba(255,248,236,0.36) 42%,\
              rgba(231,214,255,0.26) 54%,\
              rgba(176,216,255,0.12) 68%,\
              rgba(0,0,0,0) 100%)',
        }}
        animate={{ x: ['-130%', '120%'], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 6.24, repeat: Infinity, ease: 'linear' }} // same brightness/speed pattern, RTL
      />

      {/* A thinner inner glint for a more "diamond" feel */}
      <motion.span
        className="absolute inset-y-[20%] right-0 rounded-2xl pointer-events-none mix-blend-screen"
        style={{
          width: '180%',
          filter: 'blur(1.2px)',
          background:
            'linear-gradient(270deg,\
              rgba(0,0,0,0) 0%,\
              rgba(190,230,255,0.08) 30%,\
              rgba(255,255,245,0.22) 50%,\
              rgba(215,205,255,0.14) 70%,\
              rgba(0,0,0,0) 100%)',
        }}
        animate={{ x: ['-2000%', '120%'], opacity: [1, 1.5, 1] }}
        transition={{ duration: 6.24, repeat: Infinity, ease: 'linear' }}
      />

      {/* Label (flies right on click) */}
      <motion.span
        className="relative z-10"
        animate={flying ? { x: 600, opacity: 0.8, rotate: 8 } : { x: 0, opacity: 2, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      >
        {label}
      </motion.span>
    </motion.button>
  )
}
