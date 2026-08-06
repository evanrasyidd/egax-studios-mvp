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
          {t('product.size')}{selected && <span className="text-text1 ml-1.5">— {selected}</span>}
        </p>
        <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-text2/60">CM</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map(s => {
          const left = stockLeft(s)
          const empty = left <= 0
          return (
            <button key={s} onClick={() => !soldOut && !empty && onChange(s)} disabled={soldOut || empty}
              className={cn('font-mono text-[11px] font-medium uppercase tracking-wider px-4 py-2.5 border transition-all duration-150 active:translate-y-px',
                selected === s ? 'bg-text1 text-bg border-text1'
                  : empty ? 'border-border text-text2/40 cursor-not-allowed line-through'
                  : 'border-border text-text1 hover:border-text1 hover:bg-bg')}>
              {s}
            </button>
          )
        })}
      </div>
      {product && (
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-text2 mt-2">
          {selected && stockLeft(selected) > 0 && stockLeft(selected) <= 3
            ? `${t('product.onlyLeft', { n: stockLeft(selected) })}`
            : t('product.stockNote')}
        </p>
      )}
    </div>
  )
}
