'use client'
import { Minus, Plus } from 'lucide-react'
export default function QuantitySelector({ qty, onChange }) {
  return (
    <div className="flex items-center border border-gray-200 w-fit">
      <button onClick={() => onChange(Math.max(1, qty-1))} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-text1 border-r border-gray-200 transition-colors"><Minus size={13}/></button>
      <span className="w-12 text-center text-[14px] font-semibold text-text1">{qty}</span>
      <button onClick={() => onChange(qty+1)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-text1 border-l border-gray-200 transition-colors"><Plus size={13}/></button>
    </div>
  )
}
