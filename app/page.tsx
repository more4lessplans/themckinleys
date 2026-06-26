'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion'
import Image from 'next/image'

function handleContact(e: React.MouseEvent) {
  e.preventDefault()
  const p = ['\x64\x65\x76', '\x40', '\x74\x68\x65\x6d\x63\x6b\x69\x6e\x6c\x65\x79\x73', '\x2e\x63\x61']
  window.location.href = `mailto:${p.join('')}?subject=Project%20Inquiry`
}

// Live clock
function Clock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => {
      const t = new Date().toLocaleTimeString('en-CA', {
        timeZone: 'America/Toronto',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      })
      setTime(t)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])
  return <span>{time}</span>
}

// Custom cursor
function Cursor() {
  const mx = useMotionValue(-100)
  const my = useMotionValue(-100)
  const cx = useSpring(mx, { damping: 26, stiffness: 200, mass: 0.5 })
  const cy = useSpring(my, { damping: 26, stiffness: 200, mass: 0.5 })
  const dx = useSpring(mx, { damping: 50, stiffness: 700, mass: 0.1 })
  const dy = useSpring(my, { damping: 50, stiffness: 700, mass: 0.1 })
  const [hover, setHover] = useState(false)
  const [vis, setVis] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY); setVis(true) }
    const over = (e: MouseEvent) => { if ((e.target as Element)?.closest('a,button')) setHover(true) }
    const out = () => setHover(false)
    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)
    return () => { window.removeEventListener('mousemove', move); document.removeEventListener('mouseover', over); document.removeEventListener('mouseout', out) }
  }, [mx, my])

  const scale = useSpring(hover ? 2.2 : 1, { damping: 20, stiffness: 280 })
  const opacity = useSpring(vis ? 1 : 0, { damping: 30, stiffness: 200 })

  return (
    <>
      <motion.div aria-hidden="true" style={{ position: 'fixed', left: cx, top: cy, x: '-50%', y: '-50%', width: 30, height: 30, borderRadius: '50%', border: '1px solid rgba(17,17,17,0.25)', pointerEvents: 'none', zIndex: 9999, scale, opacity }} />
      <motion.div aria-hidden="true" style={{ position: 'fixed', left: dx, top: dy, x: '-50%', y: '-50%', width: 4, height: 4, borderRadius: '50%', background: '#111', pointerEvents: 'none', zIndex: 9999, opacity }} />
    </>
  )
}

// Animated word that reacts to mouse proximity
function ProximityWord({ children, mouseX, mouseY }: { children: string; mouseX: React.MutableRefObject<number>; mouseY: React.MutableRefObject<number> }) {
  const ref = useRef<HTMLSpanElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { damping: 18, stiffness: 150 })
  const sy = useSpring(y, { damping: 18, stiffness: 150 })

  useEffect(() => {
    const update = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = mouseX.current - cx
      const dy = mouseY.current - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxDist = 140
      if (dist < maxDist) {
        const force = (1 - dist / maxDist) * 10
        x.set(-dx / dist * force)
        y.set(-dy / dist * force)
      } else {
        x.set(0)
        y.set(0)
      }
    }
    window.addEventListener('mousemove', update)
    return () => window.removeEventListener('mousemove', update)
  }, [x, y, mouseX, mouseY])

  return (
    <motion.span ref={ref} style={{ display: 'inline-block', x: sx, y: sy }}>
      {children}
    </motion.span>
  )
}

// Ghosted portrait with parallax
function GhostedPortrait({ mouseX, mouseY }: { mouseX: React.MutableRefObject<number>; mouseY: React.MutableRefObject<number> }) {
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { damping: 50, stiffness: 80 })
  const sy = useSpring(py, { damping: 50, stiffness: 80 })

  useEffect(() => {
    const update = () => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      px.set((mouseX.current - cx) * 0.018)
      py.set((mouseY.current - cy) * 0.018)
    }
    window.addEventListener('mousemove', update)
    return () => window.removeEventListener('mousemove', update)
  }, [px, py, mouseX, mouseY])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 1.0 }}
      style={{
        position: 'fixed',
        right: '-4vw',
        bottom: '-2vh',
        width: 'clamp(320px, 38vw, 580px)',
        height: 'auto',
        pointerEvents: 'none',
        zIndex: 2,
        x: sx,
        y: sy,
      }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image
          src="/portrait.png"
          alt="Micah McKinley"
          width={580}
          height={720}
          style={{
            width: '100%',
            height: 'auto',
            opacity: 0.11,
            filter: 'grayscale(20%) contrast(1.1)',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)',
          }}
          priority
        />
      </motion.div>
    </motion.div>
  )
}

// Breathing ambient blobs
function AmbientBlobs() {
  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      <motion.div
        style={{ position: 'absolute', top: '-30%', left: '-15%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,115,85,0.06) 0%, transparent 65%)', filter: 'blur(80px)' }}
        animate={{ x: [0, 24, 0], y: [0, -16, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{ position: 'absolute', bottom: '-20%', left: '10%', width: '45vw', height: '45vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(100,120,160,0.04) 0%, transparent 65%)', filter: 'blur(100px)' }}
        animate={{ x: [0, -18, 0], y: [0, 14, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />
      <motion.div
        style={{ position: 'absolute', top: '20%', right: '5%', width: '35vw', height: '35vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,115,85,0.03) 0%, transparent 65%)', filter: 'blur(60px)' }}
        animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.08, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
    </div>
  )
}

// Animated ticker
function Ticker() {
  const items = ['React', 'Next.js', 'TypeScript', 'Motion', 'Tailwind', 'Node.js', 'Figma', 'Framer']
  const doubled = [...items, ...items]
  return (
    <div style={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(90deg, #fff, transparent)', zIndex: 1 }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(-90deg, #fff, transparent)', zIndex: 1 }} />
      <motion.div
        style={{ display: 'flex', gap: 0, width: 'max-content' }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((item, i) => (
          <span key={i} style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 10, fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#111', opacity: 0.2, padding: '0 28px', whiteSpace: 'nowrap' as const }}>
            {item} <span style={{ opacity: 0.4 }}>·</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

const ease = [0.16, 1, 0.3, 1] as const

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [btnHover, setBtnHover] = useState(false)
  const mouseX = useRef(0)
  const mouseY = useRef(0)

  useEffect(() => {
    setMounted(true)
    const track = (e: MouseEvent) => { mouseX.current = e.clientX; mouseY.current = e.clientY }
    window.addEventListener('mousemove', track)
    return () => window.removeEventListener('mousemove', track)
  }, [])

  const rev = (delay: number) => ({
    initial: { opacity: 0, y: 28, filter: 'blur(6px)' },
    animate: mounted ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {},
    transition: { duration: 1.0, ease, delay },
  })

  const fade = (delay: number) => ({
    initial: { opacity: 0 },
    animate: mounted ? { opacity: 1 } : {},
    transition: { duration: 1.4, ease: 'easeOut' as const, delay },
  })

  const headline1 = 'I craft digital'
  const headline2 = 'experiences.'

  return (
    <>
      <Cursor />
      <AmbientBlobs />
      <GhostedPortrait mouseX={mouseX} mouseY={mouseY} />

      {/* Top rule */}
      <motion.div aria-hidden="true" {...fade(0)} style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, #E8E8E4 25%, #E8E8E4 75%, transparent)', zIndex: 10 }} />

      {/* Header */}
      <motion.header {...fade(0.25)} style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '26px 44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 11, fontWeight: 400, letterSpacing: '0.2em', color: '#111', textTransform: 'lowercase' as const, opacity: 0.6 }}>
          micah mckinley
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <motion.span
            aria-hidden="true"
            animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.3, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'block', width: 5, height: 5, borderRadius: '50%', background: '#5a8a6a' }}
          />
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 10, fontWeight: 400, letterSpacing: '0.14em', color: '#5a8a6a', textTransform: 'lowercase' as const, opacity: 0.85 }}>
            available
          </span>
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: '0.06em', color: '#111', opacity: 0.25, marginLeft: 16 }}>
            toronto · <Clock />
          </span>
        </div>
      </motion.header>

      {/* Main */}
      <main role="main" style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', zIndex: 5, padding: '0 44px' }}>
        <div style={{ maxWidth: 680 }}>

          {/* Eyebrow */}
          <motion.div {...rev(0.3)} style={{ marginBottom: 28 }}>
            <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 10, fontWeight: 400, letterSpacing: '0.24em', textTransform: 'uppercase' as const, color: '#8B7355', opacity: 0.9 }}>
              Web Design & Development
            </span>
          </motion.div>

          {/* Headline with proximity repulsion */}
          <motion.h1
            {...rev(0.45)}
            style={{ margin: 0, fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(48px, 7vw, 96px)', fontWeight: 300, letterSpacing: '-0.038em', lineHeight: 1.04, color: '#111' }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0 0.22em' }}>
              {headline1.split(' ').map((word, i) => (
                <ProximityWord key={i} mouseX={mouseX} mouseY={mouseY}>{word}</ProximityWord>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0 0.22em' }}>
              {headline2.split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  style={{ display: 'inline-block', fontStyle: 'italic', opacity: 0.35 }}
                >
                  <ProximityWord mouseX={mouseX} mouseY={mouseY}>{word}</ProximityWord>
                </motion.span>
              ))}
            </div>
          </motion.h1>

          {/* Thin line */}
          <motion.div {...rev(0.65)} aria-hidden="true">
            <motion.div
              style={{ height: 1, background: '#EAEAEA', marginTop: 40, marginBottom: 36, originX: 0 }}
              initial={{ scaleX: 0 }}
              animate={mounted ? { scaleX: 1 } : {}}
              transition={{ duration: 1.0, ease, delay: 0.7 }}
            />
          </motion.div>

          {/* Subtext */}
          <motion.p {...rev(0.75)} style={{ margin: 0 }}>
            <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(14px, 1.4vw, 16px)', fontWeight: 300, lineHeight: 1.8, color: '#111', opacity: 0.42, letterSpacing: '0.01em' }}>
              Every pixel intentional. Every interaction considered.<br />Built for clients who care about the details.
            </span>
          </motion.p>

          {/* CTA */}
          <motion.div {...rev(0.9)} style={{ marginTop: 48, display: 'flex', alignItems: 'center', gap: 28 }}>
            <motion.a
              href="#"
              onClick={handleContact}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              aria-label="Start a project"
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 12, fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase' as const,
                color: btnHover ? '#FFF' : '#111',
                background: btnHover ? '#111' : 'transparent',
                border: '1px solid', borderColor: btnHover ? '#111' : '#DDDDD5',
                padding: '14px 32px', borderRadius: 2, textDecoration: 'none',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              Start a project
              <motion.span
                aria-hidden="true"
                animate={{ x: btnHover ? 5 : 0 }}
                transition={{ duration: 0.35, ease }}
                style={{ display: 'inline-block', fontSize: 13 }}
              >→</motion.span>
            </motion.a>
            <motion.span
              animate={{ opacity: btnHover ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 11, fontWeight: 300, letterSpacing: '0.06em', color: '#111', opacity: 0.28 }}
            >
              or scroll to explore
            </motion.span>
          </motion.div>
        </div>
      </main>

      {/* Ticker */}
      <motion.div
        {...fade(1.4)}
        style={{ position: 'fixed', bottom: 52, left: 0, right: 0, zIndex: 6 }}
      >
        <Ticker />
      </motion.div>

      {/* Footer */}
      <motion.footer {...fade(1.1)} style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '18px 44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 10, fontWeight: 400, letterSpacing: '0.14em', color: '#111', opacity: 0.25, textTransform: 'lowercase' as const }}>
          designed & built by micah
        </span>
        <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 10, fontWeight: 400, letterSpacing: '0.1em', color: '#111', opacity: 0.25 }}>
          © {new Date().getFullYear()}
        </span>
      </motion.footer>

      {/* Bottom rule */}
      <motion.div aria-hidden="true" {...fade(1.0)} style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, #E8E8E4 25%, #E8E8E4 75%, transparent)', zIndex: 10 }} />
    </>
  )
}
