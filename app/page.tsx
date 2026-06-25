'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

// Bot-proof email via hex encoding assembled at click-time only
function handleContact(e: React.MouseEvent) {
  e.preventDefault()
  const p = ['\x64\x65\x76', '\x40', '\x74\x68\x65\x6d\x63\x6b\x69\x6e\x6c\x65\x79\x73', '\x2e\x63\x61']
  window.location.href = `mailto:${p.join('')}?subject=Project%20Inquiry`
}

function Cursor() {
  const mx = useMotionValue(-100)
  const my = useMotionValue(-100)
  const cfg = { damping: 28, stiffness: 220, mass: 0.5 }
  const dotCfg = { damping: 50, stiffness: 600, mass: 0.1 }
  const cx = useSpring(mx, cfg)
  const cy = useSpring(my, cfg)
  const dx = useSpring(mx, dotCfg)
  const dy = useSpring(my, dotCfg)
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

  const scale = useSpring(hover ? 2.0 : 1, { damping: 22, stiffness: 300 })
  const opacity = useSpring(vis ? 1 : 0, { damping: 30, stiffness: 200 })

  return (
    <>
      <motion.div aria-hidden="true" style={{ position: 'fixed', left: cx, top: cy, x: '-50%', y: '-50%', width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(17,17,17,0.3)', pointerEvents: 'none', zIndex: 9999, scale, opacity }} />
      <motion.div aria-hidden="true" style={{ position: 'fixed', left: dx, top: dy, x: '-50%', y: '-50%', width: 4, height: 4, borderRadius: '50%', backgroundColor: '#111', pointerEvents: 'none', zIndex: 9999, opacity }} />
    </>
  )
}

function AmbientGradient() {
  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      <motion.div
        style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,115,85,0.055) 0%, transparent 70%)', filter: 'blur(60px)' }}
        animate={{ x: [0, 18, 0], y: [0, -12, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '45vw', height: '45vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(17,17,17,0.028) 0%, transparent 70%)', filter: 'blur(80px)' }}
        animate={{ x: [0, -14, 0], y: [0, 10, 0], scale: [1, 1.03, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
      <motion.div
        style={{ position: 'absolute', top: '30%', left: '25%', width: '50vw', height: '30vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,115,85,0.022) 0%, transparent 70%)', filter: 'blur(100px)' }}
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.05, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </div>
  )
}

function useParallax(strength: number) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(useTransform(mx, v => v * strength), { damping: 40, stiffness: 120 })
  const y = useSpring(useTransform(my, v => v * strength), { damping: 40, stiffness: 120 })
  useEffect(() => {
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const fn = (e: MouseEvent) => { mx.set(e.clientX - cx); my.set(e.clientY - cy) }
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [mx, my])
  return { x, y }
}

const ease = [0.16, 1, 0.3, 1] as const

export default function Home() {
  const para = useParallax(0.014)
  const paraSub = useParallax(0.007)
  const [btnHover, setBtnHover] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const revealProps = (delay: number) => ({
    initial: { opacity: 0, y: 20, filter: 'blur(4px)' },
    animate: mounted ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {},
    transition: { duration: 0.9, ease, delay },
  })

  const fadeProps = (delay: number) => ({
    initial: { opacity: 0 },
    animate: mounted ? { opacity: 1 } : {},
    transition: { duration: 1.2, ease: 'easeOut' as const, delay },
  })

  return (
    <>
      <Cursor />
      <AmbientGradient />

      {/* Top rule */}
      <motion.div aria-hidden="true" {...fadeProps(0)} style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, #EAEAEA 20%, #EAEAEA 80%, transparent)', zIndex: 10 }} />

      {/* Header */}
      <motion.header {...fadeProps(0.2)} style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '28px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 11, fontWeight: 400, letterSpacing: '0.18em', color: '#111', textTransform: 'lowercase' as const, opacity: 0.65 }}>
          micah mckinley
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <motion.span aria-hidden="true" animate={{ opacity: [0.35, 0.85, 0.35] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }} style={{ display: 'block', width: 5, height: 5, borderRadius: '50%', background: '#5a8a6a' }} />
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 10, fontWeight: 400, letterSpacing: '0.14em', color: '#5a8a6a', textTransform: 'lowercase' as const, opacity: 0.8 }}>available</span>
        </div>
      </motion.header>

      {/* Main */}
      <main role="main" style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
        <motion.div style={{ x: para.x, y: para.y }}>
          <div style={{ textAlign: 'center', maxWidth: 720, padding: '0 32px' }}>

            {/* Eyebrow */}
            <motion.div {...revealProps(0.35)} style={{ marginBottom: 36 }}>
              <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 10, fontWeight: 400, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#8B7355', opacity: 0.85 }}>
                Web Design & Development
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 {...revealProps(0.5)} style={{ margin: 0, x: paraSub.x, y: paraSub.y }}>
              <span style={{ display: 'block', fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(44px, 7.5vw, 90px)', fontWeight: 300, letterSpacing: '-0.035em', lineHeight: 1.06, color: '#111' }}>
                Digital experiences
              </span>
              <span style={{ display: 'block', fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(44px, 7.5vw, 90px)', fontWeight: 300, letterSpacing: '-0.035em', lineHeight: 1.06, color: '#111', fontStyle: 'italic', opacity: 0.38 }}>
                designed with precision.
              </span>
            </motion.h1>

            {/* Divider */}
            <motion.div {...revealProps(0.65)} aria-hidden="true" style={{ width: 28, height: 1, background: '#EAEAEA', margin: '40px auto' }} />

            {/* Subtext */}
            <motion.p {...revealProps(0.75)} style={{ margin: 0 }}>
              <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(14px, 1.5vw, 16px)', fontWeight: 300, letterSpacing: '0.005em', lineHeight: 1.75, color: '#111', opacity: 0.4 }}>
                I build websites that feel effortless — every pixel,<br />interaction, and moment intentional.
              </span>
            </motion.p>

            {/* CTA */}
            <motion.div {...revealProps(0.9)} style={{ marginTop: 52 }}>
              <motion.a
                href="#"
                onClick={handleContact}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
                aria-label="Start a project — opens email client"
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 12,
                  fontWeight: 400,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                  color: btnHover ? '#FFF' : '#111',
                  background: btnHover ? '#111' : 'transparent',
                  border: '1px solid',
                  borderColor: btnHover ? '#111' : '#DDDDD5',
                  padding: '15px 34px',
                  borderRadius: 2,
                  textDecoration: 'none',
                  transition: 'all 0.38s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                Start a project
                <motion.span
                  aria-hidden="true"
                  animate={{ x: btnHover ? 4 : 0 }}
                  transition={{ duration: 0.35, ease }}
                  style={{ display: 'inline-block', fontSize: 12 }}
                >
                  →
                </motion.span>
              </motion.a>
            </motion.div>

          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer {...fadeProps(1.1)} style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '22px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 10, fontWeight: 400, letterSpacing: '0.16em', color: '#111', opacity: 0.28, textTransform: 'lowercase' as const }}>toronto, canada</span>
        <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 10, fontWeight: 400, letterSpacing: '0.1em', color: '#111', opacity: 0.28 }}>© {new Date().getFullYear()}</span>
      </motion.footer>

      {/* Bottom rule */}
      <motion.div aria-hidden="true" {...fadeProps(1.0)} style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, #EAEAEA 20%, #EAEAEA 80%, transparent)', zIndex: 10 }} />
    </>
  )
}
