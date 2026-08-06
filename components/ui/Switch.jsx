'use client'
import { cn } from '@/lib/utils'

export default function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-11 h-6 rounded-full border transition-colors duration-200 shrink-0',
        checked ? 'bg-text1 border-text1' : 'bg-bg border-border hover:border-text1'
      )}
    >
      <span
        className={cn(
          'absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full border transition-transform duration-200 ease-out',
          checked ? 'translate-x-[18px] bg-bg border-text1' : 'translate-x-0 bg-surface border-border'
        )}
      />
    </button>
  )
}
