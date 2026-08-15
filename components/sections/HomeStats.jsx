'use client'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useAdminStore } from '@/store/adminStore'
import { useOrderStore } from '@/store/orderStore'
import { useHydrated } from '@/hooks/useHydrated'
import { useI18n } from '@/store/i18nStore'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Strip statistik home — angka count-up dari data asli (produk/kategori/
 * pesanan 7 hari), bukan karangan. Grid 4 sel ala lembar kerja.
 */
export default function HomeStats() {
  const root = useRef(null)
  const hydrated = useHydrated()
  const { t } = useI18n()
  const { products } = useAdminStore()
  const { orders: ordersRaw } = useOrderStore()

  const now = Date.now()
  const orders = hydrated ? ordersRaw : []
  const last7 = orders.filter((o) => {
    const ts = new Date(o.date).getTime()
    return !isNaN(ts) && now - ts <= 7 * 86400000
  })
  const cats = new Set((hydrated ? products : []).map((p) => p.category)).size

  const stats = [
    { k: '01', v: hydrated ? products.length : 0, label: t('homeStats.products') },
    { k: '02', v: cats, label: t('homeStats.categories') },
    { k: '03', v: orders.length, label: t('homeStats.orders') },
    { k: '04', v: last7.length, label: t('homeStats.week') },
  ]

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const els = gsap.utils.toArray('.hs-value')
      if (els.length === 0) return
      els.forEach((el, i) => {
        const target = Number(el.dataset.value) || 0
        const counter = { val: 0 }
        gsap.fromTo(el, { opacity: 0, y: 18 }, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          delay: i * 0.08,
          scrollTrigger: { trigger: root.current, start: 'top 88%', once: true },
          onStart: () => {
            gsap.to(counter, {
              val: target,
              duration: 1.1,
              ease: 'power2.out',
              onUpdate: () => { el.textContent = String(Math.round(counter.val)).padStart(2, '0') },
            })
          },
        })
      })
    })

    return () => mm.revert()
  }, { scope: root, dependencies: [hydrated] })

  return (
    <section ref={root} className="bg-bg border-b border-border">
      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-border border-x border-border">
        {stats.map((s) => (
          <div key={s.k} className="px-6 md:px-10 py-8 md:py-10">
            <p className="arch-label text-text2 mb-3">{s.k}</p>
            <p data-value={s.v} className="hs-value font-display text-[40px] md:text-[52px] font-black leading-none text-text1 tracking-[-0.02em]">
              {String(s.v).padStart(2, '0')}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text2 mt-2">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
