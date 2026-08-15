'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { EDITORIALS } from '@/constants/editorial'
import { useI18n } from '@/store/i18nStore'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Stack showcase — momen ScrollTrigger klasik: kartu editorial nunggang
 * satu sama lain pas scroll (pin pendek, scrub). Setiap kartu punya
 * gerak internal (angka parallax, scale settle) — bolak-balik scroll
 * tetap bergerak. Mobile: kartu tampil statis berjajar (gak di-pin).
 */
export default function StackShowcase() {
  const root = useRef(null)
  const { t, locale } = useI18n()
  const items = EDITORIALS.slice(0, 3)
  const title = (item) => (locale === 'id' && item.titleId ? item.titleId : item.title)
  const sub = (item) => (locale === 'id' && item.subtitleId ? item.subtitleId : item.subtitle)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      const cards = q('.stack-card')
      if (cards.length === 0) return

      // Kartu naik & settle satu per satu (scrub, dua arah)
      cards.forEach((card, i) => {
        gsap.fromTo(card, { yPercent: 130, y: i * 96, scale: 0.94, rotate: i % 2 === 0 ? 2 : -2 }, {
          yPercent: 0, y: i * 96, scale: 1, rotate: 0, ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: `+=${(i + 1) * 300}`,
            scrub: 0.7,
          },
        })
      })

      // Angka raksasa di dalam kartu nge-drift lawan arah (parallax dalam)
      gsap.fromTo(q('.stack-num'), { yPercent: 26 }, {
        yPercent: -26, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.7 },
      })

      // Header + CTA drift pelan
      gsap.fromTo(q('.stack-head'), { yPercent: 40, opacity: 0.2 }, {
        yPercent: 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 95%', end: 'top top', scrub: 0.6 },
      })
    })

    return () => mm.revert()
  }, { scope: root })

  return (
    <section ref={root} className="relative bg-text1 border-b border-border overflow-hidden">
      <div className="md:h-[220vh] relative">
        <div className="md:sticky md:top-0 md:h-screen flex flex-col items-center justify-center px-6 py-16 md:py-0">
          <div className="stack-head w-full max-w-xl text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="h-px w-8 bg-bg/30" />
              <p className="arch-label text-bg/60">SS 2026 · ARCHIVE</p>
              <span className="h-px w-8 bg-bg/30" />
            </div>
            <h2 className="font-display text-[40px] md:text-[52px] font-black uppercase tracking-[-0.02em] text-bg leading-none">
              {t('stack.title')}
            </h2>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-bg/40 mt-3">ED 01 — ED 03</p>
          </div>

          <div className="relative w-full max-w-lg flex flex-col gap-4 md:block md:h-[820px]">
            {items.map((item, i) => (
              <div key={item.id}
                className="stack-card relative md:absolute md:left-0 md:right-0 md:top-10 md:h-[440px] bg-surface border border-text1 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]"
                style={{ zIndex: 10 - i }}>
                <div className="flex items-center justify-between px-5 py-2.5 bg-text1">
                  <span className="arch-label text-bg">EGAX · ED {String(i + 1).padStart(2, '0')}</span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-bg/60">SS 2026</span>
                </div>
                <div className="flex flex-col justify-between px-8 py-6 md:py-5 text-center" style={{ minHeight: '240px', height: 'calc(100% - 45px)' }}>
                  <div>
                    <p className="arch-label text-pink mb-2">{sub(item)}</p>
                    <div className="flex gap-1.5 mt-3 flex-wrap justify-center">
                      {(locale === 'id' && item.tagsId ? item.tagsId : item.tags).map((tag) => (
                        <span key={tag} className="font-mono text-[8px] uppercase tracking-[0.16em] text-text2 border border-border px-2 py-0.5">{tag}</span>
                      ))}
                    </div>
                  </div>
                  {/* Bottom band: JUDUL + NOMOR — bagian bawah tiap kartu yang
                      kebuka di stack, jadi kata & nomor semua kelihatan */}
                  <div className="flex items-end justify-between gap-4">
                    <p className="font-display text-[20px] font-bold tracking-[-0.01em] text-text1 leading-tight text-left">
                      {title(item)}
                    </p>
                    <span className="stack-num font-display font-black text-[92px] leading-[0.8] text-text1/[0.12] tracking-[-0.03em] shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-between px-5 py-2 border-t border-border bg-bg">
                  <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-text2">DOC {String(i + 1).padStart(2, '0')}</span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-text2">JKT · SS 2026</span>
                </div>
              </div>
            ))}
          </div>

          <Link href="/editorial" className="stack-cta mt-6 arch-label text-bg border border-bg/40 px-6 py-3 hover:bg-bg hover:text-text1 transition-colors">
            {t('stack.cta')}
          </Link>
        </div>
      </div>
    </section>
  )
}
