'use client'
import { Minus, Plus } from 'lucide-react'
import { useI18n } from '@/store/i18nStore'

export default function QuantitySelector({ qty, onChange }) {
  const { t } = useI18n()
  return (
    <div className="flex w-fit items-center border border-border">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, qty - 1))}
        aria-label={t('cart.decrease')}
        className="flex h-11 w-11 items-center justify-center border-r border-border text-text2 transition-colors hover:bg-bg hover:text-text1"
      >
        <Minus size={14} aria-hidden="true" />
      </button>
      <span className="w-12 text-center font-mono text-[13px] font-medium text-text1 tnum">{qty}</span>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        aria-label={t('cart.increase')}
        className="flex h-11 w-11 items-center justify-center border-l border-border text-text2 transition-colors hover:bg-bg hover:text-text1"
      >
        <Plus size={14} aria-hidden="true" />
      </button>
    </div>
  )
}
