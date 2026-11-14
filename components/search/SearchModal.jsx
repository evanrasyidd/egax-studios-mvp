'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { X, Search } from 'lucide-react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useUIStore } from '@/store/uiStore'
import { useAdminStore } from '@/store/adminStore'
import { useI18n } from '@/store/i18nStore'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { formatPrice } from '@/lib/utils'
import { CATEGORIES } from '@/constants/categories'
import GarmentPlate from '@/components/product/GarmentPlate'

gsap.registerPlugin(useGSAP)

export default function SearchModal() {
  const { t, productName } = useI18n()
  const { isSearchOpen, closeSearch } = useUIStore()
  const { products } = useAdminStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const panelRef = useRef(null)

  useFocusTrap(isSearchOpen, panelRef, closeSearch)

  useEffect(() => {
    if (isSearchOpen) inputRef.current?.focus()
    else setQuery('')
  }, [isSearchOpen])

  useGSAP(() => {
    if (!isSearchOpen) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(panelRef.current, { y: -14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' })
      const results = gsap.utils.toArray('.search-result')
      if (results.length) {
        gsap.fromTo(results, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.04, delay: 0.08, ease: 'power3.out' })
      }
    })
    return () => mm.revert()
  }, { scope: panelRef, dependencies: [isSearchOpen, query] })

  const results = query.length > 1
    ? products.filter((p) => {
        const q = query.toLowerCase()
        return p.name.toLowerCase().includes(q) || (p.nameId || '').toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      }).slice(0, 6)
    : []

  if (!isSearchOpen) return null

  return (
    <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="search-title" className="fixed inset-0 z-[80] flex flex-col bg-bg">
      <h2 id="search-title" className="sr-only">{t('search.title')}</h2>
      <div className="flex items-center gap-4 border-b border-border px-4 py-3 md:px-6">
        <Search size={18} aria-hidden="true" className="shrink-0 text-text2" />
        <label htmlFor="site-search" className="sr-only">{t('search.placeholder')}</label>
        <input
          ref={inputRef}
          id="site-search"
          type="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search.placeholder')}
          className="flex-1 bg-transparent font-display text-[18px] font-medium text-text1 placeholder:text-text2 md:text-[24px]"
        />
        <button type="button" onClick={closeSearch} aria-label={t('nav.close')} className="flex h-11 w-11 items-center justify-center border border-border text-text2 transition-colors hover:border-text1 hover:text-text1">
          <X size={17} aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
        <div aria-live="polite" className="sr-only">
          {query.length > 1 ? t('search.resultCount', { n: results.length }) : ''}
        </div>

        {query.length > 1 && results.length === 0 && (
          <p className="text-[13px] text-text2">{t('search.noResults', { q: query })}</p>
        )}

        {results.length > 0 && (
          <div className="grid max-w-3xl grid-cols-1 gap-px bg-border md:grid-cols-2">
            {results.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} onClick={closeSearch}
                className="search-result group flex gap-4 bg-surface p-4 transition-colors hover:bg-bg">
                <GarmentPlate product={p} showMeta={false} compact className="aspect-[3/4] w-14 shrink-0 border border-border" />
                <div className="min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text2">{t(`cat.${p.category.toLowerCase()}`)}</p>
                  <p className="mb-1 truncate text-[14px] font-medium text-text1">{productName(p)}</p>
                  <p className="tnum font-mono text-[12px] font-medium text-text1">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {query.length === 0 && (
          <div>
            <p className="arch-label mb-4 text-text2">{t('search.popular')}</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.filter((c) => c.slug !== 'all').map((cat) => (
                <Link key={cat.slug} href={`/catalog?category=${cat.slug}`} onClick={closeSearch}
                  className="border border-border px-4 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-text2 transition-colors hover:border-text1 hover:text-text1">
                  {t(`cat.${cat.slug}`)}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
