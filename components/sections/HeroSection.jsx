'use client'
import Link from 'next/link'
import { useAdminStore } from '@/store/adminStore'
import { useHydrated } from '@/hooks/useHydrated'
import HeroIllustration from '@/components/sections/HeroIllustration'

export default function HeroSection() {
  const hydrated = useHydrated()
  const { products, heroPreOrderBadge } = useAdminStore()
  const dropCount = hydrated && heroPreOrderBadge ? products.filter(p => p.preOrder).length : 0

  return (
    <section className="relative overflow-hidden bg-bg" style={{ height: '92vh', minHeight: 560 }}>
      <style>{`
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0; }
        }
      `}</style>

      {/* ── Ilustrasi flat-vector (hoodie/cap), bukan 3D lagi ── */}
      <HeroIllustration />

      {/* ── Vignette ringan di sisi kiri biar teks tetap kebaca kalau
          ilustrasi melebar ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, var(--bg) 0%, var(--bg) 38%, transparent 62%)',
        }}
      />

      <div className="relative h-full max-w-6xl mx-auto px-6 md:px-10 flex items-center">
        <div className="max-w-lg">
          <div className="ink-frame-sm inline-flex items-center gap-2 font-comic text-xs text-text1 bg-yellow mb-5 px-3 py-2">
            <span style={{ animation: 'blink-cursor 1s step-end infinite' }}>★</span>
            {dropCount > 0 ? `${dropCount} PRE-ORDER OPEN` : 'NEW DROP — SS 2025'}
          </div>

          <h1
            className="font-display text-text1 mb-2 uppercase"
            style={{ fontSize: 'clamp(40px, 8vw, 88px)', lineHeight: 0.95, textShadow: '4px 4px 0 rgba(20,18,15,0.15)' }}
          >
            LOUD ON<br />THE STREETS.
          </h1>

          <p className="font-comic text-accent mb-4" style={{ fontSize: 'clamp(18px, 3vw, 30px)' }}>
            NO VOLUME KNOB.
          </p>

          <p className="font-display text-xs mb-8 tracking-wide text-text2">
            BOLD STREETWEAR · LIMITED DROPS · MADE LOUD
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/catalog"
              className="ink-frame font-display text-sm text-text1 bg-pink px-6 py-3 transition-all hover:brightness-110"
            >
              EXPLORE &gt;&gt;
            </Link>
            <Link
              href="/editorial"
              className="ink-frame font-display text-sm text-text1 bg-white px-6 py-3 transition-all hover:bg-yellow"
            >
              EDITORIAL &gt;&gt;
            </Link>
          </div>
        </div>
      </div>

      {/* ── Corner labels ── */}
      <div className="absolute bottom-6 left-6 font-comic text-sm z-10 text-accent">
        EGAX™
      </div>
      <div
        className="absolute bottom-6 right-6 font-display text-xs z-10 text-text2"
        style={{ animation: 'blink-cursor 1s step-end infinite' }}
      >
        ▮ IN STOCK
      </div>
    </section>
  )
}
