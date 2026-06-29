'use client'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { getFeaturedProducts } from '@/constants/products'

export default function FeaturedCollectionSection() {
  const products = getFeaturedProducts()
  const ref = useRef(null)
  const scroll = d => ref.current?.scrollBy({ left: d * 320, behavior: 'smooth' })
  return (
    <section className="bg-white py-14 px-6 md:px-10 border-b border-gray-100">
      <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-gray-200">
        <h2 className="font-display text-[38px] tracking-widest text-bg">Featured Collection</h2>
        <div className="flex gap-1">
          {[ChevronLeft, ChevronRight].map((Icon, i) => (
            <button key={i} onClick={() => scroll(i === 0 ? -1 : 1)}
              className="w-9 h-9 flex items-center justify-center border border-gray-200 text-bg hover:bg-bg hover:text-white hover:border-bg transition-all">
              <Icon size={14}/>
            </button>
          ))}
        </div>
      </div>
      <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
        {products.map((p, i) => <ProductCard key={p.id} product={p} index={i + 20}/>)}
      </div>
    </section>
  )
}
