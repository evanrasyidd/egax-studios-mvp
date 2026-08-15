'use client'
import ProductCard from '@/components/product/ProductCard'
import SectionHeading from '@/components/ui/SectionHeading'
import { getFeaturedProducts } from '@/constants/products'
import { useI18n } from '@/store/i18nStore'

export default function FeaturedCollectionSection() {
  const { t } = useI18n()
  const products = getFeaturedProducts()
  return (
    <section className="relative overflow-hidden bg-surface py-14 px-6 md:px-10 border-b border-border">
      <span aria-hidden="true" data-ghost className="absolute top-8 right-4 md:right-10 font-display font-black leading-none text-[clamp(96px,18vw,220px)] text-text1/[0.04] tracking-[-0.04em] pointer-events-none select-none">03</span>
      <SectionHeading no="03" title={t('sections.featured')} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
        {products.map((p, i) => <ProductCard key={p.id} product={p} index={i + 20}/>)}
      </div>
    </section>
  )
}
