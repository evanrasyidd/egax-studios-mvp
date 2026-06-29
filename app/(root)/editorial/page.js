import { EDITORIALS } from '@/constants/editorial'
const COLORS = ['#4ADE80','#FF2D9B','#FACC15','#60A5FA','#F87171','#A78BFA']
export default function EditorialPage() {
  return (
    <div className="bg-bg min-h-screen px-6 md:px-10 py-12">
      <div className="mb-10 pb-6 border-b border-border">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-pink mb-2">Visual Stories</p>
        <h1 className="font-display text-[48px] tracking-widest text-text1 italic">Editorial</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
        {EDITORIALS.map((item,i) => (
          <div key={item.id} className="group relative overflow-hidden cursor-pointer" style={{aspectRatio:'3/4'}}>
            <div className="w-full h-full flex flex-col items-center justify-center" style={{background:COLORS[i%COLORS.length]}}>
              <div className="w-20 h-20 border-4 border-white/40 flex items-center justify-center mb-3">
                <span className="font-display text-[36px] text-white">{(i+1).toString().padStart(2,'0')}</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent group-hover:from-black/60 transition-all"/>
            <div className="absolute bottom-0 left-0 p-5">
              <div className="flex gap-1 mb-2 flex-wrap">
                {item.tags.map(tag=><span key={tag} className="text-[9px] font-bold uppercase tracking-widest border border-pink/60 text-pink px-1.5 py-0.5">{tag}</span>)}
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-pink mb-1">{item.subtitle}</p>
              <p className="font-display text-[22px] tracking-wider text-white">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
