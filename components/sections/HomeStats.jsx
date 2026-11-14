'use client'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useAdminStore } from '@/store/adminStore'
import { useI18n } from '@/store/i18nStore'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function HomeStats() {
  const root = useRef(null)
  const { t } = useI18n()
  const { products } = useAdminStore()

  const cats = new Set(products.map((p) => p.category)).size
  const preOrder = products.filter((p) => p.preOrder).length

  const stats = [
    { k: '01', v: products.length, label: t('homeStats.products') },
    { k: '02', v: cats, label: t('homeStats.categories') },
    { k: '03', v: preOrder, label: t('sections.preOrder') },
    { k: '04', v: null, text: 'JKT', label: t('homeStats.origin') },
  ]

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const els = gsap.utils.toArray('.hs-value')
      if (els.length === 0) return
      els.forEach((el, i) => {
        const target = Number(el.dataset.value) || 0
        if (!el.dataset.value) return
        const counter = { val: 0 }
        gsap.fromTo(el, { opacity: 0, y: 14 }, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
          delay: i * 0.06,
          scrollTrigger: { trigger: root.current, start: 'top 90%', once: true },
          onStart: () => {
            gsap.to(counter, {
              val: target,
              duration: 0.9,
              ease: 'power2.out',
              onUpdate: () => { el.textContent = String(Math.round(counter.val)).padStart(2, '0') },
            })
          },
        })
      })
    })
    return () => mm.revert()
  }, { scope: root, dependencies: [products.length] })

  return (
    <section ref={root} className="border-b border-border bg-bg">
      <div className="mx-auto grid max-w-6xl grid-cols-2 border-x border-border lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.k} className={`px-6 py-7 md:px-8 md:py-8 ${i % 2 === 0 ? 'border-r border-border' : ''} ${i < 2 ? 'border-b border-border lg:border-b-0' : ''} ${i === 1 ? 'lg:border-r lg:border-border' : ''}`}>
            <p className="arch-label mb-3 text-text2">{s.k}</p>
            <p
              data-value={s.v ?? undefined}
              className="hs-value font-display text-[40px] font-black leading-none tracking-[-0.03em] text-text1 md:text-[52px]"
            >
              {s.text || String(s.v).padStart(2, '0')}
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-text2">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
