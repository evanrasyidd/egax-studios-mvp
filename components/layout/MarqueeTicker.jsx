'use client'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useI18n } from '@/store/i18nStore'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Index strip — bukan marquee yang jalan terus. Strip ini bergerak
 * mengikuti scroll halaman, jadi tidak ada animasi tanpa henti dan
 * tidak perlu pause control.
 */
export default function MarqueeTicker() {
  const { t } = useI18n()
  const trackRef = useRef(null)
  const text = t('ticker')

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(trackRef.current, { xPercent: 0 }, {
        xPercent: -34,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 1 },
      })
    })
    return () => mm.revert()
  }, { dependencies: [text] })

  return (
    <div className="ticker-mask sticky top-0 z-50 flex h-8 items-center overflow-hidden border-b border-border bg-text1">
      <p className="sr-only">{text}</p>
      <div ref={trackRef} aria-hidden="true" className="ticker-track">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="px-8 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-bg/90">
            <span className="mr-8 text-bg/60">/</span>{text}
          </span>
        ))}
      </div>
    </div>
  )
}
