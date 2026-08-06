'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, Search } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useAdminStore } from '@/store/adminStore'
import { useI18n } from '@/store/i18nStore'
import { useHydrated } from '@/hooks/useHydrated'
import { formatPrice } from '@/lib/utils'

export default function SearchModal() {
  const { t, productName } = useI18n()
  const { isSearchOpen, closeSearch } = useUIStore()
  const hydrated = useHydrated()
  const { products } = useAdminStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const list = hydrated ? products : []
  const results = query.length > 1
    ? list.filter(p => {
        const q = query.toLowerCase()
        return p.name.toLowerCase().includes(q) || (p.nameId || '').toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      }).slice(0,6)
    : []

  useEffect(() => {
    if (isSearchOpen) { setTimeout(() => inputRef.current?.focus(), 100); document.body.style.overflow = 'hidden' }
    else { setQuery(''); document.body.style.overflow = '' }
    return () => { document.body.style.overflow = '' }
  }, [isSearchOpen])

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') closeSearch() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [closeSearch])

  if (!isSearchOpen) return null
  return (
    <div className="fixed inset-0 z-[80] bg-bg/95 backdrop-blur-md flex flex-col">
      <div className="flex items-center gap-4 px-6 py-5 border-b border-border">
        <Search size={16} className="text-pink shrink-0"/>
        <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder={t('search.placeholder')}
          className="flex-1 bg-transparent font-display text-[18px] md:text-[24px] font-medium text-text1 placeholder:text-text2/40 outline-none"/>
        <button onClick={closeSearch} className="text-text2 hover:text-text1 border border-border hover:border-text2 p-1.5 transition-colors"><X size={14}/></button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {query.length > 1 && results.length === 0 && <p className="text-text2 text-sm">{t('search.noResults', { q: query })}</p>}
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border max-w-3xl">
            {results.map(p => (
              <Link key={p.id} href={`/product/${p.slug}`} onClick={closeSearch}
                className="flex gap-4 p-4 bg-surface hover:bg-card transition-colors group">
                <div className="w-14 h-20 shrink-0 border border-border flex items-center justify-center bg-card overflow-hidden">
                  <span className="font-display text-[20px] font-bold text-text2">{productName(p)[0]}</span>
                </div>
                <div>
                  <p className="arch-label text-text2 mb-1">{p.category}</p>
                  <p className="text-[14px] font-medium text-text1 mb-1 group-hover:text-pink transition-colors">{productName(p)}</p>
                  <p className="font-mono text-[12px] font-medium text-pink">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
        {query.length === 0 && (
          <div>
            <p className="arch-label text-text2 mb-4">{t('search.popular')}</p>
            <div className="flex flex-wrap gap-2">
              {['Jacket','Tops','Shirt','Pants','Essentials','Accessories'].map(cat => (
                <Link key={cat} href={`/catalog?category=${cat.toLowerCase()}`} onClick={closeSearch}
                  className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-text2 border border-border px-4 py-2 hover:border-text2 hover:text-text1 transition-all">
                  {t(`cat.${cat.toLowerCase()}`)}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
