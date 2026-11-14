'use client'
import { useState, useEffect, useRef } from 'react'
import { Copy, Check, Loader2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { simulatePayment } from '@/lib/mockPayment'
import { useI18n } from '@/store/i18nStore'
import Button from '@/components/ui/Button'

export default function VirtualAccount({ bank, vaNumber, amount, orderId, onSuccess }) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const [sec, setSec] = useState(900)
  const [status, setStatus] = useState('waiting') // waiting -> checking -> success | failed
  const [errorMsg, setErrorMsg] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => setSec((s) => (s <= 1 ? 0 : s - 1)), 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  const mm = String(Math.floor(sec / 60)).padStart(2, '0')
  const ss = String(sec % 60).padStart(2, '0')

  const copy = () => {
    navigator.clipboard.writeText(vaNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCheckStatus = async () => {
    if (status === 'checking') return
    setStatus('checking')
    setErrorMsg('')
    const result = await simulatePayment(orderId)
    if (result.success) {
      setStatus('success')
      clearInterval(timerRef.current)
      setTimeout(() => onSuccess(), 900)
    } else {
      setStatus('failed')
      setErrorMsg(result.reason)
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <CheckCircle2 size={40} className="text-green-500" />
        <p className="text-[13px] font-semibold uppercase tracking-widest text-green-600">{t('pay.verified')}</p>
        <p className="text-[11px] text-text2">{t('pay.redirecting')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-text2">{t('pay.vaTitle', { bank })}</p>

      <div className="bg-surface border border-border p-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-text2 mb-1">{t('pay.vaNumber')}</p>
          <p className="text-[18px] font-bold font-mono text-text1 tracking-widest">{vaNumber}</p>
        </div>
        <button onClick={copy} className="flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-text2 border border-border px-3 py-2 hover:border-text1 hover:text-text1 transition-colors">
          {copied ? <Check size={12} className="text-green-700" /> : <Copy size={12} />} {copied ? t('pay.copied') : t('pay.copy')}
        </button>
      </div>

      <div className="flex justify-between text-[13px] py-3 border-b border-border">
        <span className="text-text2">{t('pay.transferTotal')}</span>
        <span className="font-bold text-text1">{formatPrice(amount)}</span>
      </div>

      <ol className="text-[11px] text-text2 leading-relaxed list-decimal list-inside space-y-1">
        <li>{t('pay.vaStep1', { bank })}</li>
        <li>{t('pay.vaStep2', { bank })}</li>
        <li>{t('pay.vaStep3', { bank })}</li>
        <li>{t('pay.vaStep4', { bank })}</li>
      </ol>

      {status === 'waiting' && (
        <>
          <div className={`text-[20px] font-bold font-mono ${sec < 60 ? 'text-red-600' : 'text-text1'}`}>{mm}:{ss}</div>
          <Button onClick={handleCheckStatus} className="w-full">
            {t('pay.checkStatus')}
          </Button>
        </>
      )}

      {status === 'checking' && (
        <div className="flex items-center justify-center gap-2 py-3 text-text2">
          <Loader2 size={14} className="animate-spin" />
          <p className="text-[11px]">{t('pay.connecting', { bank })}</p>
        </div>
      )}

      {status === 'failed' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-red-600">
            <XCircle size={16} />
            <p className="text-[11px] font-semibold uppercase tracking-widest">{t('pay.undetected')}</p>
          </div>
          <p className="text-[11px] text-text2 leading-relaxed">{errorMsg}</p>
          <Button onClick={handleCheckStatus} className="w-full">
            <RefreshCw size={12} /> {t('pay.checkAgain')}
          </Button>
        </div>
      )}
    </div>
  )
}
