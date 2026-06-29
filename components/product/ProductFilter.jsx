'use client'
import { CATEGORIES } from '@/constants/categories'
import { cn } from '@/lib/utils'
export default function ProductFilter({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {CATEGORIES.map(cat => (
        <button key={cat.slug} onClick={() => onChange(cat.slug)}
          className={cn('text-[10px] font-semibold uppercase tracking-widest px-3 py-2 border transition-all duration-150',
            active === cat.slug ? 'bg-bg text-white border-bg' : 'bg-white text-bg border-gray-200 hover:border-bg')}>
          {cat.label}
        </button>
      ))}
    </div>
  )
}
