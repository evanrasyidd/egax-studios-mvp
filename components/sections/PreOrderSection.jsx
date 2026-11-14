'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import SectionHeading from '@/components/ui/SectionHeading'
import GarmentPlate from '@/components/product/GarmentPlate'
import { useAdminStore } from '@/store/adminStore'
import { useI18n } from '@/store/i18nStore'
import { formatPrice } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function PreOrderSection() {
  const root = useRef(null)
  const { t, productName } = useI18n()
  const { products } = useAdminStore()
  const items = products.filter((p) => p.preOrder)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      gsap.fromTo(q('.po-row'), { y: 20, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.po-list')[0], start: 'top 86%', once: true },
      })
      gsap.fromTo(q('.po-count'), { y: 24, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 82%', once: true },
      })
    })
    return () => mm.revert()
  }, { scope: root, dependencies: [items.length] })

  return (
    <section ref={root} className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-10">
        <SectionHeading no="01" title={t('sections.preOrder')} href="/catalog" linkLabel={t('sections.viewAll')} />

        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          <div className="h-fit lg:sticky lg:top-28">
            <p className="arch-label mb-3 text-text2">{t('sections.preOrderKicker')}</p>
            <p className="po-count font-display text-[84px] font-black leading-[0.8] tracking-[-0.04em] text-text1 md:text-[112px]">
              {String(items.length).padStart(2, '0')}
            </p>
            <p className="mt-5 max-w-[280px] text-[13px] leading-relaxed text-text2">
              {t('sections.preOrderDesc')}
            </p>
            <p className="mt-5 border-t border-border pt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-text2">
              {t('sections.preOrderNote')}
            </p>
          </div>

          <div className="po-list border-t border-border">
            {items.length === 0 && (
              <p className="border-b border-border py-10 font-mono text-[11px] uppercase tracking-[0.1em] text-text2">
                {t('catalog.empty')}
              </p>
            )}
            {items.map((p, i) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="po-row group grid grid-cols-[32px_68px_1fr] items-center gap-4 border-b border-border py-4 transition-colors hover:bg-bg md:grid-cols-[40px_84px_1fr_auto] md:gap-5"
              >
                <span className="font-mono text-[11px] text-text2 tnum">{String(i + 1).padStart(2, '0')}</span>
                <GarmentPlate product={p} showMeta={false} compact className="aspect-[3/4] w-full border border-border" />
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium leading-snug text-text1 transition-transform duration-300 group-hover:translate-x-0.5 md:text-[15px]">
                    {productName(p)}
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-text2">
                    {t(`cat.${p.category.toLowerCase()}`)} · {(p.fabric || '').split('·')[0].trim()}
                  </p>
                  <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 md:hidden">
                    <p className="tnum font-mono text-[12px] font-medium text-text1">{formatPrice(p.price)}</p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-text2">{t('sections.ship')}</p>
                  </div>
                </div>
                <div className="hidden text-right md:block">
                  <p className="tnum font-mono text-[12px] font-medium text-text1">{formatPrice(p.price)}</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-text2">{t('sections.ship')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
