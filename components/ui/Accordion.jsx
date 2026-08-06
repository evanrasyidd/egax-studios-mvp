'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Accordion({ items, variant = 'light' }) {
  const [open, setOpen] = useState(null)
  const isDark = variant === 'dark'
  return (
    <div className={cn('divide-y border-t', isDark ? 'divide-border border-border' : 'divide-border border-border')}>
      {items.map((item, i) => (
        <div key={i}>
          <button className="w-full flex items-center justify-between py-4 text-left group" onClick={() => setOpen(open === i ? null : i)}>
            <span className={cn('text-[11px] font-semibold uppercase tracking-widest transition-colors group-hover:text-pink', isDark ? 'text-bg' : 'text-text1')}>{item.title}</span>
            <ChevronDown size={14} className={cn('text-text2 transition-transform duration-300 ease-out group-hover:translate-y-px', open === i && 'rotate-180')}/>
          </button>
          <div className={cn('grid transition-[grid-template-rows] duration-300 ease-out', open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
            <div className="overflow-hidden">
              <div className={cn('pb-4 text-sm leading-relaxed', isDark ? 'text-text2' : 'text-text2')}>{item.content}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
