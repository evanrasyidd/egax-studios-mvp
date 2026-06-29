import { Instagram } from 'lucide-react'
const COLORS = ['#4ADE80','#FF2D9B','#FACC15']
export default function SocialCTA() {
  return (
    <section className="bg-surface border-t border-border grid grid-cols-1 md:grid-cols-[1fr_3fr] min-h-[360px]">
      <div className="flex flex-col justify-center px-8 md:px-10 py-12 border-b md:border-b-0 md:border-r border-border">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-pink mb-4">Recent Updates</p>
        <h2 className="font-display text-[48px] md:text-[56px] leading-none text-text1 mb-8">Visit our<br/>social<br/>media</h2>
        <a href="https://instagram.com/egaxstudios" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-text1 border border-text1/20 px-5 py-3 hover:border-text1 hover:bg-text1/5 transition-all w-fit">
          <Instagram size={14}/> @egaxstudios
        </a>
      </div>
      <div className="grid grid-cols-3 gap-3 p-6 md:p-8">
        {COLORS.map((c, i) => (
          <div key={i} className="relative overflow-hidden border border-border hover:border-pink transition-colors" style={{aspectRatio:'1', background:c}}>
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-[32px] text-white/70">{(i+1).toString().padStart(2,'0')}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
