'use client'
import { useState, useEffect, useRef } from 'react'
import { Loader2, CheckCircle2, XCircle, RefreshCw, Smartphone, ExternalLink } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { simulatePayment } from '@/lib/mockPayment'

const WALLET_META = {
  gopay: { label: 'GoPay', color: '#00AED6' },
  ovo: { label: 'OVO', color: '#4C3494' },
  dana: { label: 'DANA', color: '#118EEA' },
}

export default function EwalletPayment({ wallet, amount, orderId, onSuccess }) {
  const meta = WALLET_META[wallet] || WALLET_META.gopay
  const [sec, setSec] = useState(900)
  const [status, setStatus] = useState('redirect') // redirect -> waiting -> checking -> success | failed
  const [errorMsg, setErrorMsg] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => setSec((s) => (s <= 1 ? 0 : s - 1)), 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  const mm = String(Math.floor(sec / 60)).padStart(2, '0')
  const ss = String(sec % 60).padStart(2, '0')

  const handleOpenApp = () => {
    // Simulasi "redirect ke app" -- delay singkat seolah membuka deep-link,
    // lalu transisi ke status menunggu konfirmasi di dalam app wallet.
    setStatus('opening')
    setTimeout(() => setStatus('waiting'), 1200)
  }

  const handleCheckStatus = async () => {
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
        <p className="text-[13px] font-semibold uppercase tracking-widest text-green-600">Pembayaran Diterima</p>
        <p className="text-[11px] text-text2">Mengarahkan ke halaman konfirmasi...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: meta.color }}>
        <Smartphone size={26} className="text-white" />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-text2">Bayar dengan {meta.label}</p>

      <div className="text-center">
        <p className="text-[12px] text-text2 mb-1">Total Pembayaran</p>
        <p className="text-[26px] font-bold text-text1">{formatPrice(amount)}</p>
        <p className="text-[11px] text-text2 mt-1">Order: {orderId}</p>
      </div>

      {status === 'redirect' && (
        <button
          onClick={handleOpenApp}
          className="flex items-center gap-2 text-black text-[11px] font-semibold uppercase tracking-widest px-8 py-3 transition-opacity hover:opacity-90"
          style={{ background: meta.color, color: '#fff' }}
        >
          <ExternalLink size={13} /> Buka App {meta.label}
        </button>
      )}

      {status === 'opening' && (
        <p className="text-[11px] text-text2 flex items-center gap-2">
          <Loader2 size={12} className="animate-spin" /> Membuka aplikasi {meta.label}...
        </p>
      )}

      {status === 'waiting' && (
        <>
          <div className={`text-[22px] font-bold font-mono ${sec < 60 ? 'text-red-600' : 'text-text1'}`}>{mm}:{ss}</div>
          <p className="text-[11px] text-text2 text-center max-w-xs leading-relaxed">
            Konfirmasi pembayaran di aplikasi {meta.label} kamu, lalu klik tombol di bawah.
          </p>
          <button
            onClick={handleCheckStatus}
            className="bg-pink text-black text-[11px] font-semibold uppercase tracking-widest px-8 py-3 hover:bg-pink-dark transition-colors"
          >
            Saya Sudah Konfirmasi
          </button>
        </>
      )}

      {status === 'checking' && (
        <p className="text-[11px] text-text2 flex items-center gap-2">
          <Loader2 size={12} className="animate-spin" /> Memverifikasi pembayaran...
        </p>
      )}

      {status === 'failed' && (
        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
          <div className="flex items-center gap-2 text-red-600">
            <XCircle size={18} />
            <p className="text-[11px] font-semibold uppercase tracking-widest">Verifikasi Gagal</p>
          </div>
          <p className="text-[11px] text-text2 text-center leading-relaxed">{errorMsg}</p>
          <button
            onClick={handleCheckStatus}
            className="flex items-center gap-2 bg-pink text-black text-[11px] font-semibold uppercase tracking-widest px-8 py-3 hover:bg-pink-dark transition-colors"
          >
            <RefreshCw size={12} /> Coba Lagi
          </button>
        </div>
      )}
    </div>
  )
}
