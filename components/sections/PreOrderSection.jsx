'use client'
import ProductCard from '@/components/product/ProductCard'
import SectionHeading from '@/components/ui/SectionHeading'
import { getPreOrderProducts } from '@/constants/products'
import { useI18n } from '@/store/i18nStore'

export default function PreOrderSection() {
  const { t } = useI18n()
  const products = getPreOrderProducts()
  return (
    <section className="bg-surface py-14 px-6 md:px-10 border-b border-border">
      <SectionHeading no="01" title={t('sections.preOrder')} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
        {products.map((p, i) => <ProductCard key={p.id} product={p} index={i}/>)}
      </div>
    </section>
  )
}
