'use client'
import ProductCard from '@/components/product/ProductCard'
import SectionHeading from '@/components/ui/SectionHeading'
import { getNewCollectionProducts } from '@/constants/products'
import { useI18n } from '@/store/i18nStore'

export default function NewCollectionSection() {
  const { t } = useI18n()
  const products = getNewCollectionProducts()
  return (
    <section className="relative overflow-hidden bg-surface py-14 px-6 md:px-10 border-b border-border">
      <span aria-hidden="true" data-ghost className="absolute top-8 right-4 md:right-10 font-display font-black leading-none text-[clamp(96px,18vw,220px)] text-text1/[0.04] tracking-[-0.04em] pointer-events-none select-none">02</span>
      <SectionHeading no="02" title={t('sections.newCollection')} href="/catalog?category=shirt" linkLabel={t('sections.viewAll')} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
        {products.map((p, i) => <ProductCard key={p.id} product={p} index={i + 10}/>)}
      </div>
    </section>
  )
}
