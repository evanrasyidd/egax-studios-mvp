'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import SectionHeading from '@/components/ui/SectionHeading'
import { CATEGORIES } from '@/constants/categories'
import { useAdminStore } from '@/store/adminStore'
import { useI18n } from '@/store/i18nStore'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function CategoryIndex() {
  const root = useRef(null)
  const { t } = useI18n()
  const { products } = useAdminStore()

  const rows = CATEGORIES
    .filter((c) => c.slug !== 'all')
    .map((c) => ({
      ...c,
      count: products.filter((p) => p.category.toLowerCase() === c.slug).length,
    }))

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      gsap.fromTo(q('.index-row'), { y: 18, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 86%', once: true },
      })
    })
    return () => mm.revert()
  }, { scope: root })

  return (
    <section ref={root} className="border-b border-border bg-bg">
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-10">
        <SectionHeading no="00" title={t('sections.index')} href="/catalog" linkLabel={t('sections.viewAll')} />
        <p className="-mt-4 mb-5 font-mono text-[11px] uppercase tracking-[0.12em] text-text2">
          {t('sections.indexKicker')}
        </p>

        <div className="border border-border">
          {rows.map((row, i) => (
            <Link
              key={row.slug}
              href={`/catalog?category=${row.slug}`}
              className="index-row group grid grid-cols-[36px_1fr_auto] items-center gap-4 border-b border-border bg-surface px-4 py-4 last:border-b-0 md:grid-cols-[48px_1fr_auto_88px] md:px-6 md:py-5"
            >
              <span className="font-mono text-[11px] text-text2 tnum">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-display text-[22px] font-bold leading-none tracking-[-0.01em] text-text1 transition-transform duration-300 group-hover:translate-x-1 md:text-[30px]">
                {t(`cat.${row.slug}`)}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-text2">
                {t('sections.items', { n: row.count })}
              </span>
              <span className="hidden text-right font-mono text-[11px] uppercase tracking-[0.12em] text-text2 transition-colors group-hover:text-text1 md:block">
                {t('sections.view')}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
