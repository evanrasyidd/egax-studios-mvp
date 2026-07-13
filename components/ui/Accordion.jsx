'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Accordion({ items, variant = 'light' }) {
  const [open, setOpen] = useState(null)
  const isDark = variant === 'dark'
  return (
    <div className={cn('divide-y border-t', isDark ? 'divide-border border-border' : 'divide-gray-100 border-gray-100')}>
      {items.map((item, i) => (
        <div key={i}>
          <button className="w-full flex items-center justify-between py-4 text-left" onClick={() => setOpen(open === i ? null : i)}>
            <span className={cn('text-[11px] font-semibold uppercase tracking-widest', isDark ? 'text-bg' : 'text-text1')}>{item.title}</span>
            <ChevronDown size={14} className={cn('transition-transform duration-200', isDark ? 'text-text2' : 'text-gray-400', open === i && 'rotate-180')}/>
          </button>
          {open === i && <div className={cn('pb-4 text-sm leading-relaxed', isDark ? 'text-text2' : 'text-gray-500')}>{item.content}</div>}
        </div>
      ))}
    </div>
  )
}
