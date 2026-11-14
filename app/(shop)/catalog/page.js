'use client'
import { useState, useMemo, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { useAdminStore } from '@/store/adminStore'
import { useI18n } from '@/store/i18nStore'
import ProductFilter from '@/components/product/ProductFilter'
import ProductSort from '@/components/product/ProductSort'
import ProductCard from '@/components/product/ProductCard'

gsap.registerPlugin(Flip)

function CatalogContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useI18n()
  const { products } = useAdminStore()
  const paramCat = searchParams.get('category') || 'all'
  const [category, setCategory] = useState(paramCat)
  const [sort, setSort] = useState('default')

  const flipStateRef = useRef(null)

  useEffect(() => {
    if (flipStateRef.current) {
      Flip.from(flipStateRef.current, {
        duration: 0.5,
        ease: 'power2.inOut',
        stagger: 0.02,
        absolute: true,
        props: 'opacity',
      })
      flipStateRef.current = null
    }
  }, [category, sort])

  useEffect(() => {
    setCategory(searchParams.get('category') || 'all')
  }, [searchParams])

  const handleCategoryChange = (cat) => {
    flipStateRef.current = Flip.getState('.product-card')
    setCategory(cat)
    if (cat === 'all') router.push('/catalog')
    else router.push(`/catalog?category=${cat}`)
  }

  const handleSortChange = (s) => {
    flipStateRef.current = Flip.getState('.product-card')
    setSort(s)
  }

  const filtered = useMemo(() => {
    let items = [...products]
    if (category !== 'all') {
      items = items.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    }
    if (sort === 'price-asc') items.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') items.sort((a, b) => b.price - a.price)
    if (sort === 'name-asc') items.sort((a, b) => a.name.localeCompare(b.name))
    return items
  }, [category, sort, products])

  return (
    <div className="min-h-screen bg-surface">
      <div className="px-4 py-8 md:px-10 md:py-10">
        <div className="mb-6 flex flex-col gap-2 border-b border-border pb-5 sm:flex-row sm:items-baseline sm:justify-between">
          <div className="flex items-baseline gap-4">
            <span className="arch-label text-text2">{t('catalog.shop')}</span>
            <h1 className="font-display text-[32px] font-bold tracking-[-0.01em] text-text1 md:text-[40px]">
              {t(`cat.${category}`)}
            </h1>
          </div>
          <p aria-live="polite" className="font-mono text-[11px] uppercase tracking-[0.1em] text-text2 tnum">
            {t('catalog.count', { n: filtered.length })}
          </p>
        </div>

        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <ProductFilter active={category} onChange={handleCategoryChange} />
          <ProductSort value={sort} onChange={handleSortChange} />
        </div>

        {filtered.length === 0 ? (
          <div className="border border-border py-20 text-center">
            <p className="mb-4 text-[13px] text-text2">{t('catalog.empty')}</p>
            <Link href="/catalog" className="inline-flex min-h-11 items-center border border-text1 px-5 font-mono text-[11px] uppercase tracking-[0.1em] text-text1 hover:bg-text1 hover:text-bg">
              {t('catalog.reset')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function CatalogFallback() {
  const { t } = useI18n()
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <p className="arch-label text-text2">{t('common.loading')}</p>
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogContent />
    </Suspense>
  )
}
