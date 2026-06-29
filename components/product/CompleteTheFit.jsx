import ProductCard from './ProductCard'
import { PRODUCTS } from '@/constants/products'
export default function CompleteTheFit({ currentId, category }) {
  const related = PRODUCTS.filter(p => p.id !== currentId && p.category === category).slice(0,4)
  if (related.length === 0) return null
  return (
    <section className="bg-white py-12 px-6 md:px-10 border-t border-gray-200">
      <h3 className="font-display text-[28px] tracking-widest text-bg mb-6 pb-4 border-b border-gray-200">Complete the Fit</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100">
        {related.map((p,i) => <ProductCard key={p.id} product={p} index={i+40}/>)}
      </div>
    </section>
  )
}
