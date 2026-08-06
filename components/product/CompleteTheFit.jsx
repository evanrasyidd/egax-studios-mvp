'use client'
import ProductCard from './ProductCard'
import { PRODUCTS } from '@/constants/products'
import { useI18n } from '@/store/i18nStore'
export default function CompleteTheFit({ currentId, category }) {
  const { t } = useI18n()
  const related = PRODUCTS.filter(p => p.id !== currentId && p.category === category).slice(0,4)
  if (related.length === 0) return null
  return (
    <section className="bg-surface py-12 px-6 md:px-10 border-t border-border">
      <h3 className="font-display text-[28px] tracking-widest text-text1 mb-6 pb-4 border-b border-border">{t('product.completeFit')}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
        {related.map((p,i) => <ProductCard key={p.id} product={p} index={i+40}/>)}
      </div>
    </section>
  )
}
