'use client'
import { useState, useEffect, useRef } from 'react'
import { Loader2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { simulatePayment } from '@/lib/mockPayment'
import { useI18n } from '@/store/i18nStore'
import Button from '@/components/ui/Button'
import FakeQRCode from './FakeQRCode'

export default function QRISPayment({ orderId, amount, onSuccess }) {
  const { t } = useI18n()
  const [sec, setSec] = useState(900)
  // Status: 'waiting' (nunggu scan) -> 'checking' (verifikasi) -> 'success' | 'failed'
  const [status, setStatus] = useState('waiting')
  const [errorMsg, setErrorMsg] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => setSec((s) => (s <= 1 ? 0 : s - 1)), 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  const mm = String(Math.floor(sec / 60)).padStart(2, '0')
  const ss = String(sec % 60).padStart(2, '0')

  const handleCheckStatus = async () => {
    if (status === 'checking') return
    setStatus('checking')
    setErrorMsg('')
    const result = await simulatePayment(orderId)
    if (result.success) {
      setStatus('success')
      clearInterval(timerRef.current)
      // Beri jeda singkat supaya checkmark sukses terlihat sebelum redirect,
      // konsisten dengan UX payment gateway sungguhan.
      setTimeout(() => onSuccess(), 900)
    } else {
      setStatus('failed')
      setErrorMsg(result.reason)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-text2">{t('pay.qrisTitle')}</p>

      <div className="relative w-52 h-52 bg-white border border-border flex items-center justify-center shadow-sm overflow-hidden">
        <FakeQRCode seed={orderId} size={208} />
        {status === 'checking' && (
          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center gap-2">
            <Loader2 size={28} className="text-text1 animate-spin" />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text1">{t('pay.verifying')}</p>
          </div>
        )}
        {status === 'success' && (
          <div className="absolute inset-0 bg-white flex flex-col items-center justify-center gap-2">
            <CheckCircle2 size={36} className="text-green-500" />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-green-600">{t('pay.verified')}</p>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-[12px] text-text2 mb-1">{t('pay.total')}</p>
        <p className="text-[26px] font-bold text-text1">{formatPrice(amount)}</p>
        <p className="text-[11px] text-text2 mt-1">{t('pay.order', { id: orderId })}</p>
      </div>

      {status === 'waiting' && (
        <>
          <div className={`text-[22px] font-bold font-mono ${sec < 60 ? 'text-red-600' : 'text-text1'}`}>{mm}:{ss}</div>
          <p className="text-[11px] text-text2 text-center max-w-xs leading-relaxed">
            {t('pay.qrisHint')}
          </p>
          <Button onClick={handleCheckStatus} className="px-10">
            {t('pay.paid')}
          </Button>
        </>
      )}

      {status === 'checking' && (
        <p className="text-[11px] text-text2 flex items-center gap-2">
          <Loader2 size={12} className="animate-spin" /> {t('pay.checking')}
        </p>
      )}

      {status === 'failed' && (
        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
          <div className="flex items-center gap-2 text-red-600">
            <XCircle size={18} />
            <p className="text-[11px] font-semibold uppercase tracking-widest">{t('pay.failed')}</p>
          </div>
          <p className="text-[11px] text-text2 text-center leading-relaxed">{errorMsg}</p>
          <Button onClick={handleCheckStatus} className="px-10">
            <RefreshCw size={12} /> {t('pay.retry')}
          </Button>
        </div>
      )}
    </div>
  )
}
