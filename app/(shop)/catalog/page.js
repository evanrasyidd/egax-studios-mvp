'use client'
import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAdminStore } from '@/store/adminStore'
import { useHydrated } from '@/hooks/useHydrated'
import ProductFilter from '@/components/product/ProductFilter'
import ProductSort from '@/components/product/ProductSort'
import ProductCard from '@/components/product/ProductCard'

function CatalogContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const hydrated = useHydrated()
  const { products: productsRaw } = useAdminStore()
  const products = hydrated ? productsRaw : []
  const paramCat = searchParams.get('category') || 'all'
  const [category, setCategory] = useState(paramCat)
  const [sort, setSort] = useState('default')

  // Sync URL param → state when user navigates via mega menu
  useEffect(() => {
    setCategory(searchParams.get('category') || 'all')
  }, [searchParams])

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    if (cat === 'all') router.push('/catalog')
    else router.push(`/catalog?category=${cat}`)
  }

  const filtered = useMemo(() => {
    let items = [...products]
    if (category !== 'all') {
      items = items.filter(p => p.category.toLowerCase() === category.toLowerCase())
    }
    if (sort === 'price-asc')  items.sort((a,b) => a.price - b.price)
    if (sort === 'price-desc') items.sort((a,b) => b.price - a.price)
    if (sort === 'name-asc')   items.sort((a,b) => a.name.localeCompare(b.name))
    return items
  }, [category, sort, products])

  return (
    <div className="bg-white min-h-screen">
      <div className="px-6 md:px-10 py-10">
        <div className="mb-8 pb-5 border-b border-gray-200">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-pink mb-1">Shop</p>
          <h1 className="font-display text-[48px] tracking-widest text-text1">
            {category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1)}
          </h1>
          <p className="text-[12px] text-gray-400 mt-1">{filtered.length} products</p>
        </div>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <ProductFilter active={category} onChange={handleCategoryChange}/>
          <ProductSort value={sort} onChange={setSort}/>
        </div>
        {filtered.length === 0 ? (
          <div className="py-24 text-center border border-gray-200">
            <p className="text-[13px] text-gray-400">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-100">
            {filtered.map((p,i) => <ProductCard key={p.id} product={p} index={i}/>)}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>}>
      <CatalogContent/>
    </Suspense>
  )
}
