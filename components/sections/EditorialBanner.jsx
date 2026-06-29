import Link from 'next/link'
import { EDITORIALS } from '@/constants/editorial'

const COLORS = ['#4ADE80','#FF2D9B','#FACC15']

export default function EditorialBanner() {
  const items = EDITORIALS.slice(0, 3)
  return (
    <section className="bg-bg py-14 px-6 md:px-10">
      <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-border">
        <h2 className="font-display text-[38px] tracking-widest text-text1 italic">Editorial</h2>
        <Link href="/editorial" className="text-[11px] font-semibold uppercase tracking-widest text-text2 border border-border px-4 py-2 hover:border-text2 hover:text-text1 transition-all">View All</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
        {items.map((item, i) => (
          <Link key={item.id} href="/editorial" className="group relative overflow-hidden block" style={{aspectRatio:'3/4'}}>
            <div className="w-full h-full flex flex-col items-center justify-center" style={{background: COLORS[i]}}>
              <div className="w-16 h-16 border-4 border-white/50 flex items-center justify-center">
                <span className="font-display text-[28px] text-white">{(i+1).toString().padStart(2,'0')}</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent group-hover:from-black/60 transition-all"/>
            <div className="absolute bottom-0 left-0 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-pink mb-1">{item.subtitle}</p>
              <p className="font-display text-[22px] tracking-wider text-white">{item.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
