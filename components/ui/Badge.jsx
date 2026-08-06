import { cn } from '@/lib/utils'
export default function Badge({ children, variant = 'default', className }) {
  const variants = {
    default:  'ink-frame-sm bg-bg text-text1',
    sale:     'bg-text1 text-bg',
    new:      'bg-text1 text-bg',
    preorder: 'bg-text1 text-bg',
    soldout:  'bg-text2 text-bg',
    accent:   'bg-text1 text-bg',
  }
  return (
    <span className={cn('inline-flex items-center gap-1.5 font-mono text-[8px] font-semibold uppercase tracking-[0.18em] px-2 py-1', variants[variant], className)}>
      <span aria-hidden="true" className={cn('w-[5px] h-[5px] rounded-full border', variant === 'default' ? 'border-text1' : 'border-bg/70')} />
      {children}
    </span>
  )
}
