'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

// Satu full page load = satu intro. Client navigation tidak mengulang preloader.
let introPlayed = false

/**
 * Preloader — "hanging garment tag" intro, tampil sekali per full page load.
 * Overlay visible dari CSS (gak nunggu hydration). Admin dan POS tidak
 * memakai intro ini karena itu area kerja, bukan storefront.
 */
export default function Preloader() {
  const root = useRef(null)
  const tagRef = useRef(null)
  const pathname = usePathname()
  const hidden = Boolean(pathname?.startsWith('/admin') || pathname?.startsWith('/pos'))

  const BAR_WIDTHS = [3, 1, 2, 1, 3, 1, 1, 2, 3, 1, 2, 3, 1, 1, 2, 1, 3, 2]

  useEffect(() => {
    if (hidden) introPlayed = true
  }, [hidden])

  const finish = () => {
    introPlayed = true
    if (root.current) root.current.style.display = 'none'
    window.__egaxIntroDone = true
    window.dispatchEvent(new Event('egax-intro-done'))
  }

  useGSAP(() => {
    if (hidden || introPlayed) return
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

      tl.fromTo(tagRef.current, { y: -36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.1)
        .fromTo(q('.pl-line'), { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, 0.1)
        .fromTo(q('.pl-bar'), { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.4, stagger: 0.025, ease: 'power2.out' }, 0.5)
        .fromTo(q('.pl-txt'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 }, 0.75)
        .to(root.current, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, 1.5)
        .call(() => {
          window.__egaxIntroDone = true
          window.dispatchEvent(new Event('egax-intro-done'))
        }, [], 1.55)
        .call(finish, [], 2.3)
    })

    return () => mm.revert()
  }, { scope: root, dependencies: [hidden] })

  if (hidden || introPlayed) return null

  return (
    <div ref={root} aria-hidden="true"
      className="preloader fixed inset-0 z-[95] bg-text1 flex items-center justify-center pointer-events-none select-none">
      <div ref={tagRef} className="flex flex-col items-center">
        <div className="pl-line w-px h-20 md:h-28 bg-bg/40 origin-top" />
        <div className="relative bg-bg px-9 py-6 text-center border border-bg">
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-text1 border-2 border-bg" />

          <p className="pl-txt arch-label text-text1 tracking-[0.28em]">EGAX STUDIOS</p>
          <p className="pl-txt mt-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-text2">Nº 001 / SS 2026 / Jakarta</p>

          <div className="pl-txt flex items-end justify-center gap-[3px] h-8 mt-4">
            {BAR_WIDTHS.map((w, i) => (
              <span key={i} className="pl-bar bg-text1" style={{ width: `${w}px`, height: '100%', transformOrigin: 'bottom' }} />
            ))}
          </div>

          <div className="pl-txt mt-4 pt-2 border-t border-dashed border-text1/50 flex items-center justify-between gap-8">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-text2">100% Cotton</span>
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-text2">Made in Jkt</span>
          </div>
        </div>
      </div>
    </div>
  )
}
