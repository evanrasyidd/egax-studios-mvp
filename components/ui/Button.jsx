'use client'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Button — sistem tombol konsisten seluruh project:
 * - Sweep hover: layer solid nyapu naik dari bawah (bukan gradient, bukan glow)
 * - Press state: turun 1px + shadow ilang
 * - Teks & ikon ganti warna sinkron sama sweep
 * - Reduced-motion: sweep tetap jalan (solid color, aman)
 */
export default function Button({ children, variant = 'primary', size = 'md', className, disabled, onClick, type = 'button', href, ...props }) {
  const base = 'group relative inline-flex items-center justify-center gap-2 overflow-hidden font-mono font-semibold uppercase tracking-[0.18em] transition-all duration-200 ease-out disabled:opacity-40 disabled:cursor-not-allowed active:translate-y-px active:shadow-none will-change-transform select-none corner-brackets'
  const variants = {
    primary: 'bg-text1 text-bg border border-text1 shadow-ink-sm',
    outline: 'bg-transparent text-text1 border border-text1',
    ghost:   'bg-transparent text-text2 hover:text-text1 border border-transparent hover:border-border',
    accent:  'bg-text1 text-bg border border-text1',
    dark:    'bg-bg text-text1 border border-border hover:border-text1',
    white:   'bg-bg text-text1 border border-text1',
    danger:  'bg-red-700 text-white border border-red-700',
  }
  const sweeps = {
    primary: 'bg-bg',
    outline: 'bg-text1',
    accent:  'bg-bg',
    danger:  'bg-red-600',
  }
  const textSwap = {
    primary: 'group-hover:text-text1',
    outline: 'group-hover:text-bg',
    accent:  'group-hover:text-text1',
    danger:  'group-hover:text-white',
  }
  const sizes = { sm: 'text-[10px] px-4 py-2', md: 'text-[11px] px-6 py-3', lg: 'text-[11px] px-8 py-3.5' }

  const sweep = sweeps[variant]
  const swap = textSwap[variant]
  const cls = cn(base, variants[variant], sizes[size], className)

  const inner = (
    <>
      {sweep && (
        <span aria-hidden="true"
          className={cn('absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out', sweep)} />
      )}
      <span className={cn('relative z-10 transition-colors duration-300', swap)}>{children}</span>
    </>
  )

  if (href) return <Link href={href} className={cls} {...props}>{inner}</Link>
  return <button type={type} onClick={onClick} disabled={disabled} className={cls} {...props}>{inner}</button>
}
