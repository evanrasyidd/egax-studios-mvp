'use client'
import ProductCard from '@/components/product/ProductCard'
import SectionHeading from '@/components/ui/SectionHeading'
import { getNewCollectionProducts } from '@/constants/products'
import { useI18n } from '@/store/i18nStore'

export default function NewCollectionSection() {
  const { t } = useI18n()
  const products = getNewCollectionProducts()
  return (
    <section className="bg-surface py-14 px-6 md:px-10 border-b border-border">
      <SectionHeading no="02" title={t('sections.newCollection')} href="/catalog?category=shirt" linkLabel={t('sections.viewAll')} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
        {products.map((p, i) => <ProductCard key={p.id} product={p} index={i + 10}/>)}
      </div>
    </section>
  )
}
