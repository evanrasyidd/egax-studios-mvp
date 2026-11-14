import { cn } from '@/lib/utils'
export default function Badge({ children, variant = 'default', className }) {
  const variants = {
    default:  'ink-frame-sm bg-bg text-text1',
    sale:     'bg-text1 text-bg',
    new:      'bg-text1 text-bg',
    preorder: 'bg-text1 text-bg',
    soldout:  'bg-text2 text-bg',
    accent:   'bg-text1 text-bg',
    outline:  'bg-bg text-text1',
  }
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.1em]', variants[variant], className)}>
      <span aria-hidden="true" className={cn('h-1 w-1 border', variant === 'default' ? 'border-text1' : 'border-bg/70')} />
      {children}
    </span>
  )
}
