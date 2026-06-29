'use client'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function Button({ children, variant = 'primary', size = 'md', className, disabled, onClick, type = 'button', href, ...props }) {
  const base = 'relative inline-flex items-center justify-center font-body font-semibold uppercase tracking-widest transition-all duration-200 ease-out disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] will-change-transform'
  const variants = {
    primary: 'bg-pink text-black hover:bg-pink-dark shadow-[0_2px_12px_-2px_rgba(255,45,155,0.5)] hover:shadow-[0_4px_20px_-2px_rgba(255,45,155,0.65)] hover:-translate-y-px',
    outline: 'bg-transparent text-text1 border border-text1/25 hover:border-text1/70 hover:bg-text1/[0.04]',
    ghost:   'bg-transparent text-text2 hover:text-text1 hover:bg-text1/[0.04]',
    accent:  'bg-accent text-text1 hover:bg-accent/80',
    dark:    'bg-bg text-text1 border border-border hover:border-text2/60 hover:bg-surface',
    white:   'bg-text1 text-bg hover:bg-text2 shadow-[0_2px_12px_-2px_rgba(245,245,243,0.25)]',
    danger:  'bg-red-600 text-white hover:bg-red-700 shadow-[0_2px_12px_-2px_rgba(220,38,38,0.5)]',
  }
  const sizes = { sm:'text-[10px] px-4 py-2', md:'text-[11px] px-6 py-3', lg:'text-[11px] px-8 py-3.5' }
  const cls = cn(base, variants[variant], sizes[size], className)
  if (href) return <Link href={href} className={cls}>{children}</Link>
  return <button type={type} onClick={onClick} disabled={disabled} className={cls} {...props}>{children}</button>
}
