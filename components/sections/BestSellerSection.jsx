'use client'
import ProductCard from '@/components/product/ProductCard'
import SectionHeading from '@/components/ui/SectionHeading'
import { getBestSellerProducts } from '@/constants/products'
import { useI18n } from '@/store/i18nStore'

export default function BestSellerSection() {
  const { t } = useI18n()
  const products = getBestSellerProducts()
  return (
    <section className="bg-surface py-14 px-6 md:px-10 border-b border-border">
      <SectionHeading no="04" title={t('sections.bestSeller')} href="/catalog" linkLabel={t('sections.viewAll')} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-border">
        {products.map((p, i) => <ProductCard key={p.id} product={p} index={i + 30}/>)}
      </div>
    </section>
  )
}
