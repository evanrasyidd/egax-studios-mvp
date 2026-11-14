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

export default function BestSellerSection() {
  const root = useRef(null)
  const { t, productName } = useI18n()
  const { products } = useAdminStore()
  const items = products.filter((p) => p.bestSeller).slice(0, 5)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      gsap.fromTo(q('.rank-row'), { y: 16, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.rank-list')[0], start: 'top 86%', once: true },
      })
    })
    return () => mm.revert()
  }, { scope: root, dependencies: [items.length] })

  return (
    <section ref={root} className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-10">
        <SectionHeading no="04" title={t('sections.bestSeller')} href="/catalog" linkLabel={t('sections.viewAll')} />
        <p className="-mt-4 mb-6 font-mono text-[11px] uppercase tracking-[0.12em] text-text2">{t('sections.bestKicker')}</p>

        <div className="rank-list border-t border-text1">
          <div className="hidden grid-cols-[48px_72px_1fr_140px_110px] items-center gap-4 border-b border-border px-2 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-text2 md:grid">
            <span>{t('sections.rank')}</span>
            <span />
            <span>{t('sections.product')}</span>
            <span>{t('sections.category')}</span>
            <span className="text-right">{t('sections.price')}</span>
          </div>

          {items.map((p, i) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="rank-row group grid grid-cols-[32px_64px_1fr] items-center gap-4 border-b border-border px-2 py-3 transition-colors hover:bg-bg md:grid-cols-[48px_72px_1fr_140px_110px]"
            >
              <span className="font-mono text-[12px] text-text1 tnum">{String(i + 1).padStart(2, '0')}</span>
              <GarmentPlate product={p} showMeta={false} compact className="aspect-[3/4] w-full border border-border" />
              <div className="min-w-0">
                <p className="truncate text-[14px] font-medium leading-snug text-text1 transition-transform duration-300 group-hover:translate-x-0.5">
                  {productName(p)}
                </p>
                <p className="mt-0.5 truncate font-mono text-[11px] uppercase tracking-[0.08em] text-text2">
                  {p.vendor} · {(p.fabric || '').split('·')[0].trim()}
                </p>
              </div>
              <span className="hidden font-mono text-[11px] uppercase tracking-[0.08em] text-text2 md:block">
                {t(`cat.${p.category.toLowerCase()}`)}
              </span>
              <span className="tnum hidden text-right font-mono text-[12px] font-medium text-text1 md:block">
                {formatPrice(p.price)}
              </span>
              <span className="tnum col-start-3 font-mono text-[12px] font-medium text-text1 md:hidden">
                {formatPrice(p.price)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
