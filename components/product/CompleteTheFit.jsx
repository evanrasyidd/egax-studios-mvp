'use client'
import ProductCard from './ProductCard'
import { useAdminStore } from '@/store/adminStore'
import { useI18n } from '@/store/i18nStore'
export default function CompleteTheFit({ currentId, category }) {
  const { t } = useI18n()
  const { products } = useAdminStore()
  const related = products.filter(p => p.id !== currentId && p.category === category).slice(0,4)
  if (related.length === 0) return null
  return (
    <section className="border-t border-border bg-surface px-6 py-12 md:px-10">
      <h3 className="mb-6 border-b border-border pb-4 font-display text-[24px] font-bold tracking-[-0.01em] text-text1 md:text-[28px]">{t('product.completeFit')}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
        {related.map((p,i) => <ProductCard key={p.id} product={p} index={i+40}/>)}
      </div>
    </section>
  )
}
