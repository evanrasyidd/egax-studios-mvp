'use client'
import { cn } from '@/lib/utils'
export default function Input({ label, error, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[11px] font-semibold uppercase tracking-widest text-text2">{label}</label>}
      <input className={cn(
        'w-full bg-surface border border-border text-text1 text-sm px-4 py-3 outline-none font-body',
        'placeholder:text-text2/50 focus:border-pink transition-colors',
        error && 'border-red-500', className
      )} {...props}/>
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  )
}
