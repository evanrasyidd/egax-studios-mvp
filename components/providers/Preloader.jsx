'use client'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

/**
 * Preloader — "hanging garment tag" intro, tampil SETIAP full page load
 * (refresh ikut muncul). Overlay visible dari CSS (gak nunggu hydration,
 * jadi gak ada flash konten). CSS auto-hide 1.9s jadi safety net kalau
 * JS telat; prefers-reduced-motion = overlay gak pernah muncul.
 * Setelah curtain selesai → dispatch event 'egax-intro-done' + flag
 * window.__egaxIntroDone buat hero mulai entrance-nya.
 */
export default function Preloader() {
  const root = useRef(null)
  const tagRef = useRef(null)
  const barRef = useRef(null)

  const BAR_WIDTHS = [3, 1, 2, 1, 3, 1, 1, 2, 3, 1, 2, 3, 1, 1, 2, 1, 3, 2]

  const finish = () => {
    if (root.current) root.current.style.display = 'none'
    window.__egaxIntroDone = true
    window.dispatchEvent(new Event('egax-intro-done'))
  }

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

      // Tag "nempel" turun pelan + settle
      tl.fromTo(tagRef.current, { y: -36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.1)
        .fromTo(q('.pl-line'), { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, 0.1)
        .fromTo(q('.pl-bar'), { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.4, stagger: 0.025, ease: 'power2.out' }, 0.5)
        .fromTo(q('.pl-txt'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 }, 0.75)
        // Curtain naik — event dikirim PAS curtain mulai biar hero
        // entrance jalan BAREng curtain naik, transisinya nyambung
        .to(root.current, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, 1.5)
        .call(() => {
          window.__egaxIntroDone = true
          window.dispatchEvent(new Event('egax-intro-done'))
        }, [], 1.55)
        .call(finish, [], 2.3)
    })

    return () => mm.revert()
  }, { scope: root })

  return (
    <div ref={root} aria-hidden="true"
      className="preloader fixed inset-0 z-[95] bg-text1 flex items-center justify-center pointer-events-none select-none">
      {/* Tali gantungan tag */}
      <div ref={tagRef} className="flex flex-col items-center">
        <div className="pl-line w-px h-20 md:h-28 bg-bg/40 origin-top" />
        <div className="relative bg-bg px-9 py-6 text-center border border-bg">
          {/* Lubang tag */}
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-text1 border-2 border-bg" />

          <p className="pl-txt arch-label text-text1 tracking-[0.32em]">EGAX STUDIOS</p>
          <p className="pl-txt font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-text2 mt-2">Nº 001 · SS 2026 · Jakarta</p>

          {/* Barcode */}
          <div className="pl-txt flex items-end justify-center gap-[3px] h-8 mt-4">
            {BAR_WIDTHS.map((w, i) => (
              <span key={i} className="pl-bar bg-text1" style={{ width: `${w}px`, height: '100%', transformOrigin: 'bottom' }} />
            ))}
          </div>

          <div className="pl-txt mt-4 pt-2 border-t border-dashed border-text1/50 flex items-center justify-between gap-8">
            <span className="font-mono text-[7px] font-medium uppercase tracking-[0.18em] text-text2">100% Cotton</span>
            <span className="font-mono text-[7px] font-medium uppercase tracking-[0.18em] text-text2">Made in Jkt</span>
          </div>
        </div>
      </div>
    </div>
  )
}
