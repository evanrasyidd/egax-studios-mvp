'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, Search } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { PRODUCTS } from '@/constants/products'
import { formatPrice } from '@/lib/utils'

export default function SearchModal() {
  const { isSearchOpen, closeSearch } = useUIStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const results = query.length > 1
    ? PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())).slice(0,6)
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
        <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products..."
          className="flex-1 bg-transparent font-display text-[18px] md:text-[24px] text-text1 placeholder:text-text2/40 outline-none tracking-widest"/>
        <button onClick={closeSearch} className="text-text2 hover:text-text1 border border-border hover:border-text2 p-1.5 transition-colors"><X size={14}/></button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {query.length > 1 && results.length === 0 && <p className="text-text2 text-sm">No results for &ldquo;{query}&rdquo;</p>}
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border max-w-3xl">
            {results.map(p => (
              <Link key={p.id} href={`/product/${p.slug}`} onClick={closeSearch}
                className="flex gap-4 p-4 bg-surface hover:bg-card transition-colors group">
                <div className="w-14 h-20 shrink-0 border border-border flex items-center justify-center bg-card overflow-hidden">
                  <span className="font-display text-[20px] text-text2">{p.name[0]}</span>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-text2 mb-1">{p.category}</p>
                  <p className="text-[14px] font-medium text-text1 mb-1 group-hover:text-pink transition-colors">{p.name}</p>
                  <p className="text-[13px] font-semibold text-pink">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
        {query.length === 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text2 mb-4">Popular Categories</p>
            <div className="flex flex-wrap gap-2">
              {['Tops','Hoodie','Pants','Shirt','Accessories','Essentials'].map(cat => (
                <Link key={cat} href={`/catalog?category=${cat.toLowerCase()}`} onClick={closeSearch}
                  className="text-[11px] font-semibold uppercase tracking-widest text-text2 border border-border px-4 py-2 hover:border-text2 hover:text-text1 transition-all">
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
