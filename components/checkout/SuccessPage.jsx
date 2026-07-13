'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
export default function SuccessPage({ order }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-16 text-center">
      <style>{`
        @keyframes successPop { 0% { opacity: 0; transform: scale(0.5) translateY(12px); } 60% { opacity: 1; transform: scale(1.08) translateY(0); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div className="mb-6" style={{ animation: mounted ? 'successPop 0.5s cubic-bezier(0.34,1.56,0.64,1)' : 'none', opacity: mounted ? 1 : 0 }}>
        <svg width="64" height="64" viewBox="0 0 16 16" style={{imageRendering:'pixelated',display:'block',margin:'0 auto'}}>
          <rect x="0" y="0" width="16" height="16" fill="#4ADE80"/>
          <rect x="3" y="7" width="4" height="3" fill="#000"/>
          <rect x="7" y="4" width="3" height="6" fill="#000"/>
          <rect x="5" y="9" width="2" height="2" fill="#000"/>
        </svg>
      </div>
      <div style={{ animation: mounted ? 'fadeUp 0.4s ease-out 0.15s backwards' : 'none', opacity: mounted ? undefined : 0 }}>
        <p className="font-body font-bold text-[8px] text-pink mb-2">PAYMENT SUCCESS!</p>
        <h1 className="font-display text-[18px] text-black mb-2">ORDER CONFIRMED</h1>
        <p className="font-body text-gray-500 mb-6 text-sm max-w-xs">Thank you for your order. We will process it shortly.</p>
      </div>
      <div className="border-4 border-black p-5 w-full max-w-xs text-left mb-8" style={{boxShadow:'6px 6px 0 #FF2E7E', animation: mounted ? 'fadeUp 0.4s ease-out 0.3s backwards' : 'none', opacity: mounted ? undefined : 0}}>
        <p className="font-body font-bold text-[7px] text-pink mb-3">ORDER DETAILS</p>
        <div className="space-y-2 font-body font-bold text-[8px]">
          <div className="flex justify-between"><span className="text-gray-400">ORDER ID</span><span className="text-black">{order?.id}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">TOTAL</span><span className="text-pink">{formatPrice(order?.total||0)}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">STATUS</span><span className="text-green-500">PAID</span></div>
        </div>
      </div>
      <div className="flex gap-3" style={{ animation: mounted ? 'fadeUp 0.4s ease-out 0.45s backwards' : 'none', opacity: mounted ? undefined : 0 }}>
        <Link href="/account/orders" className="font-body font-bold text-[8px] border-2 border-black text-black px-5 py-2.5 pixel-btn hover:bg-pink">VIEW ORDERS</Link>
        <Link href="/catalog" className="font-body font-bold text-[8px] bg-black text-white border-2 border-black px-5 py-2.5 pixel-btn hover:bg-pink hover:text-black">SHOP MORE</Link>
      </div>
    </div>
  )
}
