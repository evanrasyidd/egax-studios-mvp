'use client'
import { Minus, Plus } from 'lucide-react'
export default function QuantitySelector({ qty, onChange }) {
  return (
    <div className="flex items-center border border-border w-fit">
      <button onClick={() => onChange(Math.max(1, qty-1))} className="w-10 h-10 flex items-center justify-center text-text2 hover:text-text1 hover:bg-bg border-r border-border transition-colors active:translate-y-px"><Minus size={13}/></button>
      <span className="w-12 text-center font-mono text-[13px] font-medium text-text1">{qty}</span>
      <button onClick={() => onChange(qty+1)} className="w-10 h-10 flex items-center justify-center text-text2 hover:text-text1 hover:bg-bg border-l border-border transition-colors active:translate-y-px"><Plus size={13}/></button>
    </div>
  )
}
