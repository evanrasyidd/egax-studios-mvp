'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useI18n } from '@/store/i18nStore'
export default function SuccessPage({ order }) {
  const { t } = useI18n()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 py-16 text-center">
      <style>{`
        @keyframes successPop { 0% { opacity: 0; transform: scale(0.5) translateY(12px); } 60% { opacity: 1; transform: scale(1.08) translateY(0); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div className="mb-6" style={{ animation: mounted ? 'successPop 0.5s cubic-bezier(0.34,1.56,0.64,1)' : 'none', opacity: mounted ? 1 : 0 }}>
        <div className="w-16 h-16 flex items-center justify-center border border-text1 bg-text1 text-bg rotate-3">
          <Check size={28} />
        </div>
      </div>
      <div style={{ animation: mounted ? 'fadeUp 0.4s ease-out 0.15s backwards' : 'none', opacity: mounted ? undefined : 0 }}>
        <p className="arch-label text-pink mb-2">{t('pay.successKicker')}</p>
        <h1 className="font-display text-[22px] font-bold tracking-[-0.01em] text-text1 mb-2">{t('pay.confirmed2')}</h1>
        <p className="font-body text-text2 mb-6 text-sm max-w-xs">{t('pay.thanks')}</p>
      </div>
      <div className="border border-text1 p-5 w-full max-w-xs text-left mb-8" style={{boxShadow:'0 6px 24px rgba(35,33,27,0.16)', animation: mounted ? 'fadeUp 0.4s ease-out 0.3s backwards' : 'none', opacity: mounted ? undefined : 0}}>
        <p className="arch-label text-pink mb-3">{t('pay.details')}</p>
        <div className="space-y-2 arch-label">
          <div className="flex justify-between"><span className="text-text2">{t('pay.orderId')}</span><span className="text-text1">{order?.id}</span></div>
          <div className="flex justify-between"><span className="text-text2">{t('checkout.total')}</span><span className="text-pink">{formatPrice(order?.total||0)}</span></div>
          <div className="flex justify-between"><span className="text-text2">{t('pay.status')}</span><span className="text-green-700">{t('pay.paid')}</span></div>
        </div>
      </div>
      <div className="flex gap-3" style={{ animation: mounted ? 'fadeUp 0.4s ease-out 0.45s backwards' : 'none', opacity: mounted ? undefined : 0 }}>
        <Link href="/account/orders" className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] border border-text1 text-text1 px-5 py-2.5 hover:bg-text1 hover:text-bg transition-colors">{t('pay.viewOrders')}</Link>
        <Link href="/catalog" className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] bg-text1 text-bg border border-text1 px-5 py-2.5 hover:bg-text2 hover:border-text2 transition-colors">{t('pay.shopMore')}</Link>
      </div>
    </div>
  )
}
