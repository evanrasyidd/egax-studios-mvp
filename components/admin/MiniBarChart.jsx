'use client'
import { useMemo, useState } from 'react'

/**
 * Bar chart ringan, custom SVG -- sengaja tidak pakai recharts/chart.js
 * supaya tidak nambah bundle size besar untuk satu mini-chart di dashboard.
 * Menampilkan revenue per hari dari data order asli (7 hari terakhir),
 * bukan data dummy/placeholder.
 */
export default function MiniBarChart({ orders }) {
  const [hoverIdx, setHoverIdx] = useState(null)

  const days = useMemo(() => {
    const today = new Date()
    const buckets = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() - (6 - i))
      return { key: d.toISOString().slice(0, 10), label: d.toLocaleDateString('id-ID', { weekday: 'short' }), total: 0 }
    })
    const map = new Map(buckets.map((b) => [b.key, b]))
    orders.forEach((o) => {
      const d = new Date(o.date)
      if (isNaN(d.getTime())) return // skip data lama yang formatnya bukan ISO
      const key = d.toISOString().slice(0, 10)
      const bucket = map.get(key)
      if (bucket) bucket.total += o.total || 0
    })
    return buckets
  }, [orders])

  const max = Math.max(...days.map((d) => d.total), 1)
  const W = 280
  const H = 90
  const barW = W / days.length - 8

  return (
    <div className="relative">
      <svg width="100%" viewBox={`0 0 ${W} ${H + 20}`} preserveAspectRatio="xMidYMax meet" aria-hidden="true">
        {days.map((d, i) => {
          const h = (d.total / max) * H
          const x = i * (W / days.length) + 4
          const y = H - h
          const isHover = hoverIdx === i
          return (
            <g key={d.key}>
              <rect
                x={x} y={y} width={barW} height={Math.max(h, 2)}
                fill={isHover ? '#111111' : d.total > 0 ? 'rgba(17,17,17,0.55)' : 'rgba(255,255,255,0.08)'}
                style={{ transition: 'fill 0.15s ease' }}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
              />
              <text x={x + barW / 2} y={H + 14} textAnchor="middle" fontSize="10" fill="#7A7A7A" fontFamily="monospace">
                {d.label.toUpperCase().slice(0, 3)}
              </text>
            </g>
          )
        })}
      </svg>
      {hoverIdx !== null && (
        <div className="absolute top-0 left-0 font-mono text-[11px] font-medium text-pink bg-bg border border-pink px-2 py-1">
          {days[hoverIdx].total > 0
            ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(days[hoverIdx].total)
            : 'NO SALES'}
        </div>
      )}
    </div>
  )
}
