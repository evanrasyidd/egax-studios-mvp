'use client'
import { CATEGORIES } from '@/constants/categories'
import { useI18n } from '@/store/i18nStore'
import { cn } from '@/lib/utils'
export default function ProductFilter({ active, onChange }) {
  const { t } = useI18n()
  return (
    <div className="flex flex-wrap gap-1.5">
      {CATEGORIES.map(cat => (
        <button key={cat.slug} onClick={() => onChange(cat.slug)}
          className={cn('font-mono text-[10px] font-medium uppercase tracking-[0.16em] px-3.5 py-2 border transition-all duration-150 active:translate-y-px',
            active === cat.slug ? 'bg-text1 text-bg border-text1' : 'bg-surface text-text1 border-border hover:border-text1 hover:bg-bg')}>
          {t(`cat.${cat.slug}`)}
        </button>
      ))}
    </div>
  )
}
