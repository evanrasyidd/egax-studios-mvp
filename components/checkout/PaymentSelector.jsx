'use client'
import { Wallet, Building2, QrCode } from 'lucide-react'
import { cn } from '@/lib/utils'

const GROUPS = [
  {
    label: 'QRIS',
    methods: [
      { id: 'qris', label: 'QRIS', desc: 'Scan & bayar instan dari e-wallet/m-banking apa saja', icon: QrCode, color: '#FF2D9B' },
    ],
  },
  {
    label: 'E-Wallet',
    methods: [
      { id: 'gopay', label: 'GoPay', desc: 'Bayar dengan saldo GoPay', icon: Wallet, color: '#00AED6' },
      { id: 'ovo', label: 'OVO', desc: 'Bayar dengan saldo OVO', icon: Wallet, color: '#4C3494' },
      { id: 'dana', label: 'DANA', desc: 'Bayar dengan saldo DANA', icon: Wallet, color: '#118EEA' },
    ],
  },
  {
    label: 'Virtual Account',
    methods: [
      { id: 'bca', label: 'BCA Virtual Account', desc: 'Transfer via BCA', icon: Building2, color: '#005BAA' },
      { id: 'bni', label: 'BNI Virtual Account', desc: 'Transfer via BNI', icon: Building2, color: '#F47920' },
      { id: 'mandiri', label: 'Mandiri Virtual Account', desc: 'Transfer via Mandiri', icon: Building2, color: '#003D79' },
    ],
  },
]

export default function PaymentSelector({ selected, onChange }) {
  return (
    <div>
      <h2 className="font-display text-[22px] tracking-widest text-text1 mb-5">Payment Method</h2>
      <div className="space-y-5">
        {GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text2 mb-2">{group.label}</p>
            <div className="space-y-2">
              {group.methods.map((m) => (
                <button key={m.id} type="button" onClick={() => onChange(m.id)}
                  className={cn('w-full flex items-center gap-4 p-4 border text-left transition-all',
                    selected === m.id ? 'border-pink bg-surface' : 'border-border hover:border-text2')}>
                  <div className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center" style={{ background: `${m.color}1A` }}>
                    <m.icon size={16} style={{ color: m.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-text1">{m.label}</p>
                    <p className="text-[11px] text-text2">{m.desc}</p>
                  </div>
                  <div className={cn('w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center', selected === m.id ? 'border-pink' : 'border-border')}>
                    {selected === m.id && <div className="w-2 h-2 rounded-full bg-pink" />}
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
