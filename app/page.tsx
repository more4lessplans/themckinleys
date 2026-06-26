'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

function handleContact(e: React.MouseEvent) {
  e.preventDefault()
  const p = ['\x64\x65\x76', '\x40', '\x74\x68\x65\x6d\x63\x6b\x69\x6e\x6c\x65\x79\x73', '\x2e\x63\x61']
  window.location.href = `mailto:${p.join('')}?subject=Let%27s%20work%20together`
}

function Clock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('en-CA', {
        timeZone: 'America/Toronto', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])
  return <>{time}</>
}

function Cursor() {
  const mx = useMotionValue(-200)
  const my = useMotionValue(-200)
  const rx = useSpring(mx, { damping: 22, stiffness: 180, mass: 0.6 })
  const ry = useSpring(my, { damping: 22, stiffness: 180, mass: 0.6 })
  const [hover, setHover] = useState(false)
  const [vis, setVis] = useState(false)
  const [label, setLabel] = useState('')

  useEffect(() => {
    const move = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY); if (!vis) setVis(true) }
    const over = (e: MouseEvent) => {
      const el = (e.target as Element)?.closest('a,button')
      if (el) { setHover(true); setLabel(el.getAttribute('data-cursor') || '') }
      else { setHover(false); setLabel('') }
    }
    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    return () => { window.removeEventListener('mousemove', move); document.removeEventListener('mouseover', over) }
  }, [mx, my, vis])

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed', left: rx, top: ry,
        x: '-50%', y: '-50%',
        pointerEvents: 'none', zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Outer ring */}
      <motion.div
        animate={{
          width: hover ? 64 : 36,
          height: hover ? 64 : 36,
          opacity: vis ? 1 : 0,
          backgroundColor: hover ? 'rgba(17,17,17,0.9)' : 'transparent',
          border: hover ? '1px solid rgba(17,17,17,0.9)' : '1.5px solid rgba(17,17,17,0.55)',
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{ borderRadius: '50%', position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <AnimatePresence>
          {hover && label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ fontSize: 8, fontFamily: "'Inter', sans-serif", fontWeight: 500, letterSpacing: '0.08em', color: '#fff', textTransform: 'uppercase', whiteSpace: 'nowrap' }}
            >{label}</motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      {/* Center dot — always visible */}
      <motion.div
        animate={{ opacity: vis ? (hover ? 0 : 1) : 0, scale: hover ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        style={{ width: 5, height: 5, borderRadius: '50%', background: '#111', position: 'absolute' }}
      />
    </motion.div>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const mouseX = useRef(0)
  const mouseY = useRef(0)

  // Portrait parallax — very slow, very subtle
  const portraitX = useMotionValue(0)
  const portraitY = useMotionValue(0)
  const psx = useSpring(portraitX, { damping: 60, stiffness: 60 })
  const psy = useSpring(portraitY, { damping: 60, stiffness: 60 })

  // Text parallax — opposite direction, even slower
  const textX = useMotionValue(0)
  const textY = useMotionValue(0)
  const tsx = useSpring(textX, { damping: 60, stiffness: 60 })
  const tsy = useSpring(textY, { damping: 60, stiffness: 60 })

  useEffect(() => {
    setMounted(true)
    const track = (e: MouseEvent) => {
      mouseX.current = e.clientX
      mouseY.current = e.clientY
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      portraitX.set((e.clientX - cx) * 0.022)
      portraitY.set((e.clientY - cy) * 0.022)
      textX.set((e.clientX - cx) * -0.008)
      textY.set((e.clientY - cy) * -0.008)
    }
    window.addEventListener('mousemove', track)
    return () => window.removeEventListener('mousemove', track)
  }, [portraitX, portraitY, textX, textY])

  const ease = [0.16, 1, 0.3, 1] as const

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#FAFAF8', overflow: 'hidden', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Cursor />

      {/* ── GHOSTED PORTRAIT ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ duration: 3, ease: 'easeOut', delay: 0.6 }}
        style={{
          position: 'absolute',
          right: '-2vw',
          bottom: 0,
          width: 'clamp(300px, 44vw, 660px)',
          pointerEvents: 'none',
          zIndex: 1,
          x: psx,
          y: psy,
        }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Image
            src="/portrait.png"
            alt=""
            aria-hidden="true"
            width={660}
            height={820}
            style={{
              width: '100%',
              height: 'auto',
              opacity: 0.09,
              mixBlendMode: 'multiply',
              maskImage: 'linear-gradient(to top, black 40%, rgba(0,0,0,0.5) 70%, transparent 100%), linear-gradient(to left, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to top, black 40%, rgba(0,0,0,0.5) 70%, transparent 100%), linear-gradient(to left, black 60%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in',
            }}
            priority
          />
        </motion.div>
      </motion.div>

      {/* ── AMBIENT LIGHT ───────────────────────────────── */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '-30%', left: '-20%', width: '70vw', height: '70vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,185,165,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.05, 1], x: [0, 20, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
          style={{ position: 'absolute', bottom: '-10%', right: '20%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(160,175,200,0.07) 0%, transparent 70%)', filter: 'blur(100px)' }}
        />
      </div>

      {/* ── HEADER ──────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}
      >
        <span style={{ fontSize: 11, fontWeight: 400, letterSpacing: '0.2em', textTransform: 'lowercase', color: '#111', opacity: 0.5 }}>
          micah mckinley
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.2, 0.9] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ display: 'block', width: 5, height: 5, borderRadius: '50%', background: '#4a7a5a' }}
            />
            <span style={{ fontSize: 10, letterSpacing: '0.15em', color: '#4a7a5a', textTransform: 'lowercase', opacity: 0.9 }}>available</span>
          </div>
          <span style={{ fontSize: 10, letterSpacing: '0.06em', color: '#111', opacity: 0.22, fontVariantNumeric: 'tabular-nums' }}>
            <Clock />
          </span>
        </div>
      </motion.header>

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <main
        role="main"
        style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 48px', zIndex: 5 }}
      >
        <motion.div style={{ x: tsx, y: tsy, maxWidth: 720 }}>

          {/* Index label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.25 }}
            style={{ marginBottom: 44 }}
          >
            <span style={{ fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#9B8B72', opacity: 0.9 }}>
              Creative Developer
            </span>
          </motion.div>

          {/* Large headline — staggered lines */}
          <h1 style={{ margin: 0, lineHeight: 0.95 }}>
            {['I imagine', 'and build', 'the web.'].map((line, i) => (
              <div key={i} style={{ overflow: 'hidden', paddingBottom: '0.06em' }}>
                <motion.div
                  initial={{ y: '100%', opacity: 0 }}
                  animate={mounted ? { y: '0%', opacity: 1 } : {}}
                  transition={{ duration: 1.0, ease, delay: 0.35 + i * 0.12 }}
                >
                  <span style={{
                    display: 'block',
                    fontSize: 'clamp(52px, 8.5vw, 108px)',
                    fontWeight: 300,
                    letterSpacing: '-0.04em',
                    color: i === 2 ? 'transparent' : '#111',
                    WebkitTextStroke: i === 2 ? '1px rgba(17,17,17,0.22)' : undefined,
                    fontStyle: i === 1 ? 'italic' : 'normal',
                  }}>
                    {line}
                  </span>
                </motion.div>
              </div>
            ))}
          </h1>

          {/* Thin ruled line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={mounted ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 1.1, ease, delay: 0.75 }}
            style={{ height: 1, background: 'rgba(17,17,17,0.1)', marginTop: 48, marginBottom: 36, originX: 0, maxWidth: 500 }}
          />

          {/* Sub + CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease, delay: 0.85 }}
            style={{ display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}
          >
            <p style={{ margin: 0, fontSize: 'clamp(13px, 1.4vw, 15px)', fontWeight: 300, lineHeight: 1.8, color: '#111', opacity: 0.4, letterSpacing: '0.01em', maxWidth: 300 }}>
              Turning creative ideas into experiences people remember.
            </p>

            <motion.a
              href="#"
              onClick={handleContact}
              data-cursor="say hi"
              aria-label="Start a project"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                fontSize: 11, fontWeight: 400, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: '#FAFAF8',
                background: '#111', border: '1px solid #111',
                padding: '16px 36px', borderRadius: 2,
                textDecoration: 'none',
                transition: 'background 0.3s ease, color 0.3s ease',
                flexShrink: 0,
              }}
            >
              Start a project
              <span aria-hidden="true" style={{ fontSize: 14 }}>→</span>
            </motion.a>
          </motion.div>
        </motion.div>
      </main>

      {/* ── BOTTOM STRIP ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 1.1 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 }}
      >
        {/* Scrolling discipline strip */}
        <div style={{ borderTop: '1px solid rgba(17,17,17,0.07)', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(90deg, #FAFAF8, transparent)', zIndex: 1 }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(-90deg, #FAFAF8, transparent)', zIndex: 1 }} />
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            style={{ display: 'flex', width: 'max-content', padding: '14px 0' }}
          >
            {[...Array(2)].map((_, rep) => (
              ['Visual Design', 'Web Development', 'Creative Direction', 'Motion & Interaction', 'Brand Identity', 'Digital Experiences'].map((item, i) => (
                <span key={`${rep}-${i}`} style={{ fontSize: 9, fontWeight: 400, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#111', opacity: 0.2, padding: '0 32px', whiteSpace: 'nowrap' }}>
                  {item} <span style={{ opacity: 0.5 }}>◦</span>
                </span>
              ))
            ))}
          </motion.div>
        </div>

        {/* Footer row */}
        <div style={{ borderTop: '1px solid rgba(17,17,17,0.06)', padding: '16px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 9, letterSpacing: '0.16em', color: '#111', opacity: 0.22, textTransform: 'lowercase' }}>toronto, canada</span>
          <span style={{ fontSize: 9, letterSpacing: '0.1em', color: '#111', opacity: 0.22 }}>© {new Date().getFullYear()}</span>
        </div>
      </motion.div>

      {/* Vertical line accent — left edge detail */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={mounted ? { scaleY: 1, opacity: 1 } : {}}
        transition={{ duration: 1.4, ease, delay: 0.5 }}
        aria-hidden="true"
        style={{ position: 'absolute', left: 28, top: '15%', bottom: '15%', width: 1, background: 'linear-gradient(to bottom, transparent, rgba(17,17,17,0.08) 30%, rgba(17,17,17,0.08) 70%, transparent)', originY: 0.5, zIndex: 2 }}
      />
    </div>
  )
}
