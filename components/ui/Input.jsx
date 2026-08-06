'use client'
import { cn } from '@/lib/utils'
import { FieldLabel } from '@/components/ui/Field'
export default function Input({ label, error, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <FieldLabel>{label}</FieldLabel>}
      <input className={cn(
        'w-full bg-bg border border-border text-text1 text-[13px] px-3.5 py-2.5 outline-none',
        'placeholder:text-text2/50 focus:border-text1 focus:bg-surface transition-colors',
        error && 'border-red-500', className
      )} {...props}/>
      {error && <p className="font-mono text-[10px] text-red-600">{error}</p>}
    </div>
  )
}
