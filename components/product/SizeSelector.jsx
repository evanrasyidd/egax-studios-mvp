'use client'
import { cn } from '@/lib/utils'
import { useI18n } from '@/store/i18nStore'

export default function SizeSelector({ sizes, selected, onChange, soldOut, product }) {
  const { t } = useI18n()
  const stockLeft = (s) => (product?.stock?.[s] ?? 99)
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="arch-label text-text2">
          {t('product.size')}{selected && <span className="ml-1.5 text-text1">: {selected}</span>}
        </p>
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-text2">CM</span>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={t('product.size')}>
        {sizes.map(s => {
          const left = stockLeft(s)
          const empty = left <= 0
          return (
            <button
              key={s}
              type="button"
              aria-pressed={selected === s}
              onClick={() => !soldOut && !empty && onChange(s)}
              disabled={soldOut || empty}
              className={cn('min-h-11 border px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] transition-colors duration-150 active:translate-y-px',
                selected === s ? 'border-text1 bg-text1 text-bg'
                  : empty ? 'cursor-not-allowed border-border text-text2 line-through'
                  : 'border-border text-text1 hover:border-text1 hover:bg-bg')}>
              {s}
            </button>
          )
        })}
      </div>
      {product && (
        <p aria-live="polite" className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-text2">
          {selected && stockLeft(selected) > 0 && stockLeft(selected) <= 3
            ? `${t('product.onlyLeft', { n: stockLeft(selected) })}`
            : t('product.stockNote')}
        </p>
      )}
    </div>
  )
}
