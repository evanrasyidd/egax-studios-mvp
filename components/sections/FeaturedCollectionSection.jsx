'use client'
import ProductCard from '@/components/product/ProductCard'
import SectionHeading from '@/components/ui/SectionHeading'
import { getFeaturedProducts } from '@/constants/products'
import { useI18n } from '@/store/i18nStore'

export default function FeaturedCollectionSection() {
  const { t } = useI18n()
  const products = getFeaturedProducts()
  return (
    <section className="bg-surface py-14 px-6 md:px-10 border-b border-border">
      <SectionHeading no="03" title={t('sections.featured')} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
        {products.map((p, i) => <ProductCard key={p.id} product={p} index={i + 20}/>)}
      </div>
    </section>
  )
}
