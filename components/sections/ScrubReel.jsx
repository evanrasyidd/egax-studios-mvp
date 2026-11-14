'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import GarmentPlate from '@/components/product/GarmentPlate'
import { useAdminStore } from '@/store/adminStore'
import { useI18n } from '@/store/i18nStore'
import { formatPrice } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Drop reel — strip horizontal.
 * Desktop + motion allowed: ScrollTrigger scrub, pin pendek.
 * Mobile / reduced-motion: native horizontal scroll dengan snap.
 */
export default function ScrubReel() {
  const root = useRef(null)
  const reelRef = useRef(null)
  const barRef = useRef(null)
  const { t, productName } = useI18n()
  const { products } = useAdminStore()
  const items = products.slice(0, 6)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      if (!reelRef.current) return
      const travel = () => Math.max(0, reelRef.current.scrollWidth - window.innerWidth)
      // ScrollTrigger membaca angka sebagai posisi absolut; pakai "+=" untuk jarak relatif.
      const end = () => `+=${travel() + 60}`

      gsap.fromTo(reelRef.current, { x: 0 }, {
        x: () => -travel(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
      gsap.fromTo(barRef.current, { scaleX: 0 }, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
      gsap.fromTo('.reel-head', { yPercent: 24, opacity: 0.35 }, {
        yPercent: 0,
        opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 95%', end: 'top top', scrub: 0.6 },
      })
    })

    return () => mm.revert()
  }, { scope: root, dependencies: [items.length] })

  return (
    <section ref={root} className="relative overflow-x-clip border-b border-border bg-bg">
      <div className="relative md:h-[170vh]">
        <div className="flex flex-col justify-center py-16 md:sticky md:top-24 md:h-[calc(100vh-6rem)] md:py-0">
          <div className="reel-head mb-6 flex items-baseline justify-between px-6 md:px-10">
            <div className="flex items-baseline gap-4">
              <span className="arch-label text-text2">{t('reel.label')}</span>
              <h2 className="font-display text-[28px] font-bold tracking-[-0.01em] text-text1 md:text-[36px]">{t('reel.title')}</h2>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-text2">{t('reel.scroll')}</span>
              <div className="h-px w-32 overflow-hidden bg-border">
                <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-text1" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto px-6 pb-2 md:overflow-visible md:px-0 md:pb-0">
            <div ref={reelRef} className="flex w-max snap-x snap-mandatory gap-4 md:snap-none md:px-10 md:will-change-transform">
              {items.map((p, i) => (
                <Link key={p.id} href={`/product/${p.slug}`}
                  className="group w-[280px] shrink-0 snap-start overflow-hidden border border-border bg-surface">
                  <div className="flex items-center justify-between border-b border-border px-4 py-2">
                    <span className="arch-label text-text1">EGAX</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-text2">Nº {String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <GarmentPlate product={p} showMeta={false} marks={false} className="aspect-[3/4] w-full transition-transform duration-500 ease-out group-hover:scale-[1.015]" />
                  <div className="px-4 py-3">
                    <p className="text-[13px] font-medium leading-snug text-text1">{productName(p)}</p>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-text2">{t(`cat.${p.category.toLowerCase()}`)}</span>
                      <span className="tnum font-mono text-[12px] font-medium text-text1">{formatPrice(p.price)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <p className="mt-3 px-6 font-mono text-[11px] uppercase tracking-[0.12em] text-text2 md:hidden">
            {t('reel.scroll')} · {t('sections.items', { n: items.length })}
          </p>
        </div>
      </div>
    </section>
  )
}
