'use client'
import ProductCard from '@/components/product/ProductCard'
import { getFeaturedProducts } from '@/constants/products'

export default function FeaturedCollectionSection() {
  const products = getFeaturedProducts()
  return (
    <section className="bg-white py-14 px-6 md:px-10 border-b border-gray-100">
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h2 className="font-display text-[38px] tracking-widest text-text1">Featured Collection</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
        {products.map((p, i) => <ProductCard key={p.id} product={p} index={i + 20}/>)}
      </div>
    </section>
  )
}
