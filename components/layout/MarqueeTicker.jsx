'use client'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useI18n } from '@/store/i18nStore'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Ticker marquee — GSAP loop (repeat -1, xPercent -50).
 * Bonus: kecepatan ticker bereaksi ke kecepatan scroll — makin kencang
 * scroll, makin kencang ticker-nya (klasik demo ScrollTrigger velocity).
 */
export default function MarqueeTicker() {
  const { t } = useI18n()
  const root = useRef(null)
  const trackRef = useRef(null)
  const text = t('ticker')

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Matikan CSS animation biar GSAP yang pegang transform
      gsap.set(trackRef.current, { animation: 'none' })
      // Base lambat (40s/loop) — velocity cuma nge-boost tipis pas scroll kencang
      const tween = gsap.to(trackRef.current, { xPercent: -50, ease: 'none', duration: 40, repeat: -1 })

      // Scroll velocity → timeScale ticker (cap 1x–2.2x, threshold di atas 800px/s)
      const st = ScrollTrigger.create({
        start: 0,
        onUpdate(self) {
          const vel = self.getVelocity()
          const ts = gsap.utils.clamp(1, 2.2, 1 + Math.abs(vel) / 4000)
          gsap.to(tween, { timeScale: ts, duration: 0.6, overwrite: true })
        },
      })

      return () => st.kill()
    })

    return () => mm.revert()
  }, { scope: root })

  return (
    <div ref={root} className="sticky top-0 z-50 overflow-hidden h-8 flex items-center bg-text1 border-b border-border">
      <div ref={trackRef} className="ticker-track">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="font-mono text-[9px] uppercase font-medium tracking-[0.22em] text-bg/80 px-8">
            <span className="mr-8 text-bg/40">/</span>{text}
          </span>
        ))}
      </div>
    </div>
  )
}
