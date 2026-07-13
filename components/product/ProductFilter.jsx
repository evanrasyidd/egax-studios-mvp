'use client'
import { CATEGORIES } from '@/constants/categories'
import { cn } from '@/lib/utils'
export default function ProductFilter({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {CATEGORIES.map(cat => (
        <button key={cat.slug} onClick={() => onChange(cat.slug)}
          className={cn('text-[10px] font-semibold uppercase tracking-widest px-3 py-2 border transition-all duration-150',
            active === cat.slug ? 'bg-text1 text-white border-text1' : 'bg-white text-text1 border-gray-200 hover:border-text1')}>
          {cat.label}
        </button>
      ))}
    </div>
  )
}
