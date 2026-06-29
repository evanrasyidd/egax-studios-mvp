import { cn } from '@/lib/utils'
export default function Badge({ children, variant = 'default', className }) {
  const variants = {
    default:  'bg-bg text-text1',
    sale:     'bg-pink text-black',
    new:      'bg-black text-white',
    preorder: 'bg-text1 text-bg',
    soldout:  'bg-text2 text-bg',
    accent:   'bg-accent text-text1',
  }
  return (
    <span className={cn('inline-block text-[9px] font-bold uppercase tracking-widest px-2 py-0.5', variants[variant], className)}>
      {children}
    </span>
  )
}
