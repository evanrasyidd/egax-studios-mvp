'use client'
import Link from 'next/link'
import { useAdminStore } from '@/store/adminStore'
import { useHydrated } from '@/hooks/useHydrated'
import FragmentSceneLazy from '@/components/three/FragmentSceneLazy'

export default function HeroSection() {
  const hydrated = useHydrated()
  const { products } = useAdminStore()
  const dropCount = hydrated ? products.filter(p => p.preOrder).length : 0

  return (
    <section className="relative overflow-hidden bg-bg" style={{ height: '92vh', minHeight: 560 }}>
      <style>{`
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0; }
        }
      `}</style>

      {/* ── 3D abstract fragmented geometry, lazy-mounted ── */}
      <FragmentSceneLazy />

      {/* ── Radial vignette so text stays readable over the geometry ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 75% 50%, transparent 0%, rgba(10,10,10,0.35) 45%, rgba(10,10,10,0.94) 85%)',
        }}
      />

      <div className="relative h-full max-w-6xl mx-auto px-6 md:px-10 flex items-center">
        <div className="max-w-lg">
          <div
            className="inline-flex items-center gap-2 font-pixel text-[8px] text-black mb-5 px-3 py-2"
            style={{ background: '#FF2D9B', border: '2px solid #000', boxShadow: '3px 3px 0 #000' }}
          >
            <span style={{ animation: 'blink-cursor 1s step-end infinite' }}>★</span>
            {dropCount > 0 ? `${dropCount} PRE-ORDER OPEN` : 'NEW DROP — SS 2025'}
          </div>

          <h1
            className="font-pixel text-text1 mb-4 leading-relaxed"
            style={{ fontSize: 'clamp(18px, 4vw, 44px)', textShadow: '3px 3px 0 rgba(0,0,0,0.9)', letterSpacing: '0.04em' }}
          >
            BUILT IN<br />THE DARK.
          </h1>

          <p
            className="font-pixel mb-3 leading-relaxed"
            style={{ fontSize: 'clamp(12px, 2.2vw, 27px)', color: '#FF2D9B', textShadow: '2px 2px 0 rgba(0,0,0,0.9)', letterSpacing: '0.03em' }}
          >
            WORN IN THE STREETS.
          </p>

          <p className="font-pixel text-[8px] mb-8 leading-loose text-text2">
            DARK STREETWEAR · LIMITED DROPS · PIXEL EDITION
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/catalog"
              className="font-pixel text-[9px] text-black px-6 py-3 transition-all hover:brightness-110 active:translate-x-0.5 active:translate-y-0.5"
              style={{ background: '#FF2D9B', border: '2px solid #000', boxShadow: '4px 4px 0 #000' }}
            >
              EXPLORE &gt;&gt;
            </Link>
            <Link
              href="/editorial"
              className="font-pixel text-[9px] text-text1 px-6 py-3 transition-all hover:bg-white/10"
              style={{ background: 'transparent', border: '2px solid rgba(245,245,243,0.4)', boxShadow: '4px 4px 0 rgba(245,245,243,0.15)' }}
            >
              EDITORIAL &gt;&gt;
            </Link>
          </div>
        </div>
      </div>

      {/* ── Corner labels ── */}
      <div className="absolute bottom-6 left-6 font-pixel text-[7px] z-10" style={{ color: '#FF2D9B' }}>
        EGAX.EXE v1.2
      </div>
      <div
        className="absolute bottom-6 right-6 font-pixel text-[7px] z-10 text-text2"
        style={{ animation: 'blink-cursor 1s step-end infinite' }}
      >
        ▮ READY
      </div>
    </section>
  )
}
