'use client'
import { cn } from '@/lib/utils'

const fieldBase =
  'w-full bg-bg border border-border px-3.5 py-2.5 text-[13px] text-text1 placeholder:text-text2/50 outline-none transition-colors focus:border-text1 focus:bg-surface'

export function FieldLabel({ children, className }) {
  return (
    <label className={cn('block arch-label text-text2 mb-1.5', className)}>{children}</label>
  )
}

export function FieldInput({ className, ...props }) {
  return <input className={cn(fieldBase, className)} {...props} />
}

export function FieldTextarea({ className, ...props }) {
  return <textarea className={cn(fieldBase, 'resize-none', className)} {...props} />
}

export function FieldSelect({ className, children, ...props }) {
  return (
    <select className={cn(fieldBase, 'appearance-none cursor-pointer pr-8 bg-no-repeat', className)}
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%23111111' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")", backgroundPosition: 'right 12px center' }}
      {...props}>
      {children}
    </select>
  )
}
