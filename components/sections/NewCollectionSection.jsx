'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import SectionHeading from '@/components/ui/SectionHeading'
import GarmentPlate from '@/components/product/GarmentPlate'
import Badge from '@/components/ui/Badge'
import { useAdminStore } from '@/store/adminStore'
import { useI18n } from '@/store/i18nStore'
import { formatPrice } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function NewCollectionSection() {
  const root = useRef(null)
  const { t, productName } = useI18n()
  const { products } = useAdminStore()
  const items = products.filter((p) => p.newCollection).slice(0, 5)
  const lead = items[0]
  const rest = items.slice(1, 5)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      if (q('.new-lead')[0]) {
        gsap.fromTo(q('.new-lead'), { clipPath: 'inset(100% 0% 0% 0%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.9,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: q('.new-grid')[0], start: 'top 82%', once: true },
        })
      }
      gsap.fromTo(q('.new-side'), { y: 22, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.new-grid')[0], start: 'top 80%', once: true },
      })
    })
    return () => mm.revert()
  }, { scope: root, dependencies: [items.length] })

  if (!lead) return null

  return (
    <section ref={root} className="border-b border-border bg-bg">
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-10">
        <SectionHeading no="02" title={t('sections.newCollection')} href="/catalog" linkLabel={t('sections.viewAll')} />
        <p className="-mt-4 mb-6 font-mono text-[11px] uppercase tracking-[0.12em] text-text2">{t('sections.newKicker')}</p>

        <div className="new-grid grid grid-cols-1 gap-px bg-border lg:grid-cols-2">
          <Link href={`/product/${lead.slug}`} className="group block bg-surface">
            <div className="relative overflow-hidden">
              <GarmentPlate product={lead} showMeta={false} className="new-lead aspect-[3/4] w-full transition-transform duration-700 ease-out group-hover:scale-[1.015]" />
              <div className="absolute left-3 top-3">
                <Badge variant="new">{t('product.new')}</Badge>
              </div>
            </div>
            <div className="flex items-end justify-between gap-4 border-t border-border px-5 py-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text2">{lead.vendor}</p>
                <p className="mt-1 text-[15px] font-medium leading-snug text-text1">{productName(lead)}</p>
              </div>
              <div className="text-right">
                <p className="tnum font-mono text-[13px] font-medium text-text1">{formatPrice(lead.price)}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-text2">{t(`cat.${lead.category.toLowerCase()}`)}</p>
              </div>
            </div>
          </Link>

          <div className="grid grid-cols-2 gap-px bg-border">
            {rest.map((p, i) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="new-side group flex flex-col bg-surface transition-colors hover:bg-bg">
                <GarmentPlate product={p} showMeta={false} marks={false} className="aspect-[3/4] w-full transition-transform duration-700 ease-out group-hover:scale-[1.015]" />
                <div className="flex flex-1 flex-col justify-between border-t border-border px-3 py-2.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-text2">{t(`cat.${p.category.toLowerCase()}`)}</p>
                    <span aria-hidden="true" className="font-mono text-[11px] text-text2">{String(i + 2).padStart(2, '0')}</span>
                  </div>
                  <p className="mt-1 truncate text-[13px] font-medium leading-snug text-text1">{productName(p)}</p>
                  <p className="tnum mt-1 font-mono text-[12px] font-medium text-text1">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
