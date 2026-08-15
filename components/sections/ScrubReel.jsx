'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import GarmentIcon from '@/components/product/GarmentIcon'
import { useAdminStore } from '@/store/adminStore'
import { useHydrated } from '@/hooks/useHydrated'
import { useI18n } from '@/store/i18nStore'
import { formatPrice } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const GARMENT_TONES = ['#F0EFEA', '#E4E2DC', '#D8D6CF', '#C6C3BB', '#A6A29A', '#77736C', '#4A4844', '#222220']

/**
 * Drop reel — ScrollTrigger beneran: strip kartu produk ngegeser HORIZONTAL
 * ngikutin scroll (scrub dua arah, pin pendek). Bukan reveal — posisi kartu
 * langsung terikat ke progress scroll.
 */
export default function ScrubReel() {
  const root = useRef(null)
  const reelRef = useRef(null)
  const barRef = useRef(null)
  const hydrated = useHydrated()
  const { t, productName } = useI18n()
  const { products } = useAdminStore()
  const items = hydrated ? products.slice(0, 6) : []

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      if (reelRef.current) {
        // Jarak geser = lebar reel - lebar viewport → SEMUA kartu kebagian
        // sebelum section selesai, gak ada yang kelewat & gak ada ruang kosong
        const travel = () => Math.max(0, reelRef.current.scrollWidth - window.innerWidth)
        const end = () => travel() + 60

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
        // Progress bar ikut scrub
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
        // Label header drift pelan
        gsap.fromTo('.reel-head', { yPercent: 30, opacity: 0.3 }, {
          yPercent: 0, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 95%', end: 'top top', scrub: 0.6 },
        })
      }
    })

    return () => mm.revert()
  }, { scope: root, dependencies: [items.length] })

  return (
    <section ref={root} className="relative bg-bg border-b border-border overflow-hidden">
      <div className="md:h-[170vh] relative">
        <div className="md:sticky md:top-0 md:h-screen flex flex-col justify-center py-16 md:py-0">
          <div className="reel-head flex items-baseline justify-between px-6 md:px-10 mb-6">
            <div className="flex items-baseline gap-4">
              <span className="arch-label text-pink">{t('reel.label')}</span>
              <h2 className="font-display text-[28px] md:text-[36px] font-bold tracking-[-0.01em] text-text1">{t('reel.title')}</h2>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-text2">SCROLL →</span>
              <div className="w-32 h-px bg-border overflow-hidden">
                <div ref={barRef} className="h-full w-full bg-text1 origin-left scale-x-0" />
              </div>
            </div>
          </div>

          <div ref={reelRef} className="flex gap-4 px-6 md:px-10 w-max will-change-transform">
            {items.map((p, i) => (
              <Link key={p.id} href={`/product/${p.slug}`}
                className="group w-[280px] md:w-[280px] shrink-0 bg-white border border-border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                  <span className="arch-label text-text1">EGAX</span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-text2">Nº {String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="flex items-center justify-center border-b border-border transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                  style={{ height: '17rem', background: GARMENT_TONES[i % GARMENT_TONES.length] }}>
                  <GarmentIcon category={p.category} fill="rgba(255,255,255,0.92)" shade="rgba(0,0,0,0.16)" detail="#111111" scale={6} />
                </div>
                <div className="px-4 py-3">
                  <p className="text-[12px] font-medium text-text1 leading-snug group-hover:text-pink transition-colors">{productName(p)}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-text2">{t(`cat.${p.category.toLowerCase()}`)}</span>
                    <span className="font-mono text-[10px] font-semibold text-text1">{formatPrice(p.price)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
