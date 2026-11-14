'use client'
import { useState } from 'react'
import { Delete } from 'lucide-react'
import { usePosStore } from '@/store/posStore'
import { toast } from '@/components/ui/Toast'
import { useI18n } from '@/store/i18nStore'

export default function PosPinGate() {
  const { t } = useI18n()
  const { unlock } = usePosStore()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDigit = (d) => {
    if (pin.length >= 6 || loading) return
    setError('')
    setPin((p) => p + d)
  }
  const handleBackspace = () => { if (!loading) setPin((p) => p.slice(0, -1)) }

  const handleSubmit = async () => {
    setLoading(true)
    const result = await unlock(pin)
    if (!result.success) {
      setError(result.error)
      setPin('')
      toast(result.error, 'error')
      setLoading(false)
      return
    }
    toast(t('pos.welcome', { name: result.name }))
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-[340px]">
        <div className="text-center mb-8">
          <p className="arch-label text-pink mb-2">{t('pos.badge')}</p>
          <h1 className="font-display text-[18px] text-text1">{t('pos.title')}</h1>
          <p className="font-mono text-[11px] font-medium text-text2 mt-2">{t('pos.pinSub')}</p>
        </div>

        {/* PIN dots display */}
        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`h-3 w-3 border border-border ${i < pin.length ? 'bg-text1' : 'bg-transparent'}`}
            />
          ))}
        </div>

        {error && (
          <p className="text-center font-mono text-[11px] font-medium text-red-600 mb-4">{error}</p>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {['1','2','3','4','5','6','7','8','9'].map((d) => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="aspect-square bg-surface border border-border text-text1 font-display text-[14px] hover:border-text1 hover:text-text1 transition-colors"
            >
              {d}
            </button>
          ))}
          <button
            onClick={() => setPin('')}
            className="aspect-square bg-surface border border-border text-text2 font-mono text-[11px] font-medium hover:border-red-400 hover:text-red-600 transition-colors"
          >
            {t('pos.clr')}
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="aspect-square bg-surface border border-border text-text1 font-display text-[14px] hover:border-text1 hover:text-text1 transition-colors"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="aspect-square bg-surface border border-border text-text2 flex items-center justify-center hover:border-text1 hover:text-text1 transition-colors"
            aria-label={t('pos.backspace')}
          >
            <Delete size={14} />
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={pin.length === 0 || loading}
          className="w-full font-mono text-[11px] font-medium text-bg bg-text1 border border-text1 py-3.5 transition-colors hover:bg-text2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {loading ? t('pos.checking') : t('pos.enter')}
        </button>
      </div>
    </div>
  )
}
