import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import { getNewCollectionProducts } from '@/constants/products'

export default function NewCollectionSection() {
  const products = getNewCollectionProducts()
  return (
    <section className="bg-white py-14 px-6 md:px-10 border-b border-gray-100">
      <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-gray-200">
        <h2 className="font-display text-[38px] tracking-widest text-bg italic">New Collection</h2>
        <Link href="/catalog?category=hoodie" className="text-[11px] font-semibold uppercase tracking-widest text-bg border border-gray-200 px-4 py-2 hover:bg-bg hover:text-white transition-all">View All</Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
        {products.map((p, i) => <ProductCard key={p.id} product={p} index={i + 10}/>)}
      </div>
    </section>
  )
}
