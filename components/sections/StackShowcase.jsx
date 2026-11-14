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
 * Stack showcase — kartu editorial menumpuk saat scroll.
 * Desktop + motion allowed: pin pendek + scrub.
 * Mobile / reduced-motion: tumpukan statis, ketiga kartu tetap terbaca.
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

      gsap.set(cards, { transformOrigin: 'center top' })
      if (cards[0]) gsap.set(cards[0], { y: 0, scale: 1, opacity: 1 })
      if (cards[1]) gsap.set(cards[1], { yPercent: 110, scale: 0.97, rotate: 1.5, opacity: 1 })
      if (cards[2]) gsap.set(cards[2], { yPercent: 110, scale: 0.97, rotate: -1.5, opacity: 1 })

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
        },
      })

      if (cards[1]) {
        tl.fromTo(cards[1], { yPercent: 110, scale: 0.97, rotate: 1.5 }, {
          yPercent: 0, scale: 1, rotate: 0, duration: 1.1,
        }, 0.15)
        if (cards[0]) tl.to(cards[0], { scale: 0.94, y: -14, opacity: 0.45, duration: 1.1, ease: 'none' }, 0.15)
      }

      if (cards[2]) {
        tl.fromTo(cards[2], { yPercent: 110, scale: 0.97, rotate: -1.5 }, {
          yPercent: 0, scale: 1, rotate: 0, duration: 1.1,
        }, 1.3)
        if (cards[1]) tl.to(cards[1], { scale: 0.94, y: -14, opacity: 0.45, duration: 1.1, ease: 'none' }, 1.3)
      }

      gsap.fromTo(q('.stack-head'), { yPercent: 30, opacity: 0.3 }, {
        yPercent: 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 95%', end: 'top top', scrub: 0.6 },
      })
    })

    return () => mm.revert()
  }, { scope: root })

  return (
    <section ref={root} className="relative overflow-x-clip border-b border-border bg-text1">
      <div className="relative motion-safe:md:h-[220vh]">
        <div className="flex flex-col items-center justify-center px-6 py-16 motion-safe:md:sticky motion-safe:md:top-24 motion-safe:md:h-[calc(100vh-6rem)] motion-safe:md:py-0">
          <div className="stack-head mb-6 w-full max-w-xl text-center">
            <div className="mb-3 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-bg/30" />
              <p className="arch-label text-bg/70">SS 2026 · ARCHIVE</p>
              <span className="h-px w-8 bg-bg/30" />
            </div>
            <h2 className="font-display text-[40px] font-black uppercase leading-none tracking-[-0.02em] text-bg md:text-[52px]">
              {t('stack.title')}
            </h2>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-bg/60">ED 01 / ED 03</p>
          </div>

          <div className="relative flex w-full max-w-lg flex-col gap-4 motion-safe:md:block motion-safe:md:h-[620px]">
            {items.map((item, i) => (
              <div key={item.id}
                className="stack-card relative border border-text1 bg-surface motion-safe:md:absolute motion-safe:md:left-0 motion-safe:md:right-0 motion-safe:md:top-8 motion-safe:md:h-[360px] motion-safe:md:will-change-transform"
                style={{ zIndex: i + 1 }}>
                <div className="flex items-center justify-between bg-text1 px-5 py-2.5">
                  <span className="arch-label text-bg">EGAX · ED {String(i + 1).padStart(2, '0')}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-bg/70">SS 2026</span>
                </div>
                <div className="flex flex-col justify-between px-8 py-5 text-center" style={{ minHeight: '220px', height: 'calc(100% - 45px)' }}>
                  <div>
                    <p className="arch-label mb-2 text-text2">{sub(item)}</p>
                    <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                      {(locale === 'id' && item.tagsId ? item.tagsId : item.tags).map((tag) => (
                        <span key={tag} className="border border-border px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-text2">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    <p className="text-left font-display text-[20px] font-bold leading-tight tracking-[-0.01em] text-text1">
                      {title(item)}
                    </p>
                    <span className="shrink-0 font-display text-[92px] font-black leading-[0.8] tracking-[-0.03em] text-text1/[0.12]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
                <div className="hidden items-center justify-between border-t border-border bg-bg px-5 py-2 motion-safe:md:flex">
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-text2">DOC {String(i + 1).padStart(2, '0')}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-text2">JKT · SS 2026</span>
                </div>
              </div>
            ))}
          </div>

          <Link href="/editorial" className="stack-cta mt-6 border border-bg/40 px-6 py-3 arch-label text-bg transition-colors hover:bg-bg hover:text-text1">
            {t('stack.cta')}
          </Link>
        </div>
      </div>
    </section>
  )
}
