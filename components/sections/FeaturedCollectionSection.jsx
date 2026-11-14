'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import GarmentPlate from '@/components/product/GarmentPlate'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useAdminStore } from '@/store/adminStore'
import { useI18n } from '@/store/i18nStore'
import { formatPrice } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function FeaturedCollectionSection() {
  const root = useRef(null)
  const { t, productName, productDesc } = useI18n()
  const { products } = useAdminStore()
  const product = products.find((p) => p.featured) || products[0]

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      gsap.fromTo(q('.specimen-plate'), { yPercent: 3, scale: 1.035 }, {
        yPercent: -3,
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.7 },
      })
    })
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      gsap.fromTo(q('.spec-row'), { y: 20, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.spec-list')[0], start: 'top 86%', once: true },
      })
    })
    return () => mm.revert()
  }, { scope: root, dependencies: [product?.id] })

  if (!product) return null

  const specs = [
    { k: t('product.fabric'), v: product.fabric },
    { k: t('product.fit'), v: product.fit },
    { k: t('product.care'), v: product.care },
  ]

  return (
    <section ref={root} className="border-b border-border bg-text1 text-bg">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
        <div>
          <div className="mb-3 flex items-center justify-between border-b border-bg/20 pb-2">
            <span className="arch-label text-bg/70">{t('plate.flat')}</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-bg/60">FIG. 01</span>
          </div>
          <div className="specimen-plate border border-bg/20 bg-bg">
            <GarmentPlate product={product} className="aspect-[3/4] w-full" />
          </div>
          <div className="mt-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.1em] text-bg/60">
            <span>{t('plate.front')}</span>
            <span>{t('plate.scale')}</span>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="arch-label mb-3 text-bg/70">{t('sections.featuredKicker')}</p>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h2 className="font-display text-[44px] font-black uppercase leading-[0.9] tracking-[-0.03em] text-bg md:text-[64px]">
              {productName(product)}
            </h2>
            {product.preOrder && <Badge variant="outline">{t('product.preOrder')}</Badge>}
          </div>
          <p className="tnum mb-6 font-mono text-[20px] font-medium text-bg">{formatPrice(product.price)}</p>
          <p className="mb-8 max-w-[440px] text-[14px] leading-relaxed text-bg/70">{productDesc(product)}</p>

          <div className="spec-list border-t border-bg/20">
            {specs.map((spec) => (
              <div key={spec.k} className="spec-row grid grid-cols-[88px_1fr] gap-4 border-b border-bg/20 py-3.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-bg/60">{spec.k}</span>
                <span className="text-[13px] leading-relaxed text-bg">{spec.v}</span>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Button variant="white" href={`/product/${product.slug}`}>{t('compare.view')}</Button>
            <Link href="/catalog" className="font-mono text-[11px] uppercase tracking-[0.12em] text-bg/70 underline underline-offset-4 hover:text-bg">
              {t('sections.viewAll')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
