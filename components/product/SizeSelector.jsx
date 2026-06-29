'use client'
import { cn } from '@/lib/utils'
export default function SizeSelector({ sizes, selected, onChange, soldOut }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-2">
        Size {selected && <span className="text-bg">— {selected}</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {sizes.map(s => (
          <button key={s} onClick={() => !soldOut && onChange(s)} disabled={soldOut}
            className={cn('text-[11px] font-semibold uppercase tracking-wider px-4 py-2 border transition-all',
              selected===s ? 'bg-bg text-white border-bg' : soldOut ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-bg hover:border-bg')}>
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
