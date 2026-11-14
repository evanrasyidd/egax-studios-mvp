'use client'
import { Wallet, Building2, QrCode } from 'lucide-react'
import { useI18n } from '@/store/i18nStore'
import { cn } from '@/lib/utils'

export default function PaymentSelector({ selected, onChange }) {
  const { t } = useI18n()
  const GROUPS = [
    {
      label: t('pay.qris'),
      methods: [
        { id: 'qris', label: t('pay.qris'), desc: t('pay.qrisDesc'), icon: QrCode },
      ],
    },
    {
      label: t('pay.ewallet'),
      methods: [
        { id: 'gopay', label: t('pay.gopay'), desc: t('pay.gopayDesc'), icon: Wallet },
        { id: 'ovo', label: t('pay.ovo'), desc: t('pay.ovoDesc'), icon: Wallet },
        { id: 'dana', label: t('pay.dana'), desc: t('pay.danaDesc'), icon: Wallet },
      ],
    },
    {
      label: t('pay.va'),
      methods: [
        { id: 'bca', label: t('pay.bca'), desc: t('pay.bcaDesc'), icon: Building2 },
        { id: 'bni', label: t('pay.bni'), desc: t('pay.bniDesc'), icon: Building2 },
        { id: 'mandiri', label: t('pay.mandiri'), desc: t('pay.mandiriDesc'), icon: Building2 },
      ],
    },
  ]
  return (
    <div>
      <div className="flex items-baseline justify-between mb-5 pb-3 border-b border-border">
        <h2 className="font-display text-[22px] font-bold tracking-[-0.01em] text-text1">{t('checkout.payMethod')}</h2>
        <span className="arch-label text-text2">02</span>
      </div>
      <div className="space-y-5" role="radiogroup" aria-label={t('checkout.payMethod')}>
        {GROUPS.map((group) => (
          <div key={group.label}>
            <p className="arch-label text-text2 mb-2">{group.label}</p>
            <div className="space-y-2">
              {group.methods.map((m) => (
                <button key={m.id} type="button" role="radio" aria-checked={selected === m.id} onClick={() => onChange(m.id)}
                  className={cn('flex w-full items-center gap-4 border p-4 text-left transition-colors active:translate-y-px',
                    selected === m.id ? 'border-text1 bg-bg' : 'border-border bg-surface hover:border-text1')}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-bg">
                    <m.icon size={16} aria-hidden="true" className={selected === m.id ? 'text-text1' : 'text-text2'} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-text1">{m.label}</p>
                    <p className="text-[11px] text-text2">{m.desc}</p>
                  </div>
                  <div className={cn('w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors', selected === m.id ? 'border-text1' : 'border-border')}>
                    {selected === m.id && <div className="w-2 h-2 rounded-full bg-text1" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
