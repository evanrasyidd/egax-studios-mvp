'use client'
import { useId } from 'react'
import { cn } from '@/lib/utils'
import { FieldLabel } from '@/components/ui/Field'

export default function Input({ label, error, className, id, ...props }) {
  const autoId = useId()
  const inputId = id || `in-${autoId.replace(/:/g, '')}`
  return (
    <div className="flex flex-col gap-1.5">
      {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(
          'w-full border border-text2 bg-bg px-3.5 py-2.5 text-[13px] text-text1 placeholder:text-text2 transition-colors focus:border-text1 focus:bg-surface',
          error && 'border-red-600', className
        )}
        {...props}
      />
      {error && <p id={`${inputId}-error`} role="alert" className="font-mono text-[11px] text-red-700">{error}</p>}
    </div>
  )
}
