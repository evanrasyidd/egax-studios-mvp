'use client'
import { useState } from 'react'
import { Delete } from 'lucide-react'
import { usePosStore } from '@/store/posStore'
import { toast } from '@/components/ui/Toast'

export default function PosPinGate() {
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
    toast(`Selamat bertugas, ${result.name}!`)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-[340px]">
        <div className="text-center mb-8">
          <p className="font-body font-bold text-[8px] text-pink mb-2">★ EGAX STUDIOS ★</p>
          <h1 className="font-display text-[18px] text-text1">POS.EXE</h1>
          <p className="font-body font-bold text-[7px] text-text2 mt-2">MASUKKAN PIN KASIR</p>
        </div>

        {/* PIN dots display */}
        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 border-2 border-border"
              style={{ background: i < pin.length ? '#FF2E7E' : 'transparent' }}
            />
          ))}
        </div>

        {error && (
          <p className="text-center font-body font-bold text-[7px] text-red-600 mb-4">{error}</p>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {['1','2','3','4','5','6','7','8','9'].map((d) => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="aspect-square bg-surface border-2 border-border text-text1 font-display text-[14px] hover:border-pink hover:text-pink transition-colors"
            >
              {d}
            </button>
          ))}
          <button
            onClick={() => setPin('')}
            className="aspect-square bg-surface border-2 border-border text-text2 font-body font-bold text-[8px] hover:border-red-400 hover:text-red-600 transition-colors"
          >
            CLR
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="aspect-square bg-surface border-2 border-border text-text1 font-display text-[14px] hover:border-pink hover:text-pink transition-colors"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="aspect-square bg-surface border-2 border-border text-text2 flex items-center justify-center hover:border-pink hover:text-pink transition-colors"
            aria-label="Backspace"
          >
            <Delete size={14} />
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={pin.length === 0 || loading}
          className="w-full font-body font-bold text-[10px] text-black py-3.5 transition-all hover:brightness-110 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: '#FF2E7E', border: '2px solid #14120F', boxShadow: '3px 3px 0 #14120F' }}
        >
          {loading ? 'MEMERIKSA...' : 'MASUK >>'}
        </button>
      </div>
    </div>
  )
}
