'use client'
import { CATEGORIES } from '@/constants/categories'
import { useI18n } from '@/store/i18nStore'
import { cn } from '@/lib/utils'

export default function ProductFilter({ active, onChange }) {
  const { t } = useI18n()
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('nav.categories')}>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.slug}
          type="button"
          onClick={() => onChange(cat.slug)}
          aria-pressed={active === cat.slug}
          className={cn(
            'min-h-11 border px-3.5 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] transition-colors',
            active === cat.slug ? 'border-text1 bg-text1 text-bg' : 'border-border bg-surface text-text1 hover:border-text1 hover:bg-bg'
          )}
        >
          {t(`cat.${cat.slug}`)}
        </button>
      ))}
    </div>
  )
}
