'use client'
export default function ProductSort({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 hidden md:block">Sort</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="bg-white border border-gray-200 text-bg text-[11px] font-semibold uppercase tracking-wider px-3 py-2 outline-none cursor-pointer hover:border-bg transition-colors">
        <option value="default">Featured</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
        <option value="name-asc">Name A–Z</option>
      </select>
    </div>
  )
}
