'use client'
import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAdminStore } from '@/store/adminStore'
import { useI18n } from '@/store/i18nStore'
import { useHydrated } from '@/hooks/useHydrated'
import ProductFilter from '@/components/product/ProductFilter'
import ProductSort from '@/components/product/ProductSort'
import ProductCard from '@/components/product/ProductCard'

function CatalogContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const hydrated = useHydrated()
  const { t } = useI18n()
  const { products: productsRaw } = useAdminStore()
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
    const source = hydrated ? productsRaw : []
    let items = [...source]
    if (category !== 'all') {
      items = items.filter(p => p.category.toLowerCase() === category.toLowerCase())
    }
    if (sort === 'price-asc')  items.sort((a,b) => a.price - b.price)
    if (sort === 'price-desc') items.sort((a,b) => b.price - a.price)
    if (sort === 'name-asc')   items.sort((a,b) => a.name.localeCompare(b.name))
    return items
  }, [category, sort, productsRaw, hydrated])

  return (
    <div className="bg-surface min-h-screen">
      <div className="px-6 md:px-10 py-10">
        <div className="mb-8 pb-5 border-b border-border flex items-baseline justify-between">
          <div className="flex items-baseline gap-4">
            <span className="arch-label text-pink">{t('catalog.shop')}</span>
            <h1 className="font-display text-[40px] font-bold tracking-[-0.01em] text-text1">
              {t(`cat.${category}`)}
            </h1>
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text2">{t('catalog.count', { n: filtered.length })}</p>
        </div>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <ProductFilter active={category} onChange={handleCategoryChange}/>
          <ProductSort value={sort} onChange={setSort}/>
        </div>
        {filtered.length === 0 ? (
          <div className="py-24 text-center border border-border">
            <p className="arch-label text-text2">{t('catalog.empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border">
            {filtered.map((p,i) => <ProductCard key={p.id} product={p} index={i}/>)}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center"><p className="arch-label text-text2">Loading...</p></div>}>
      <CatalogContent/>
    </Suspense>
  )
}
