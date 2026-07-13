'use client'
import ProductCard from '@/components/product/ProductCard'
import { getPreOrderProducts } from '@/constants/products'

export default function PreOrderSection() {
  const products = getPreOrderProducts()
  return (
    <section className="bg-white py-14 px-6 md:px-10 border-b border-gray-100">
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h2 className="font-display text-[38px] tracking-widest text-text1">PRE ORDER</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100">
        {products.map((p, i) => <ProductCard key={p.id} product={p} index={i}/>)}
      </div>
    </section>
  )
}
