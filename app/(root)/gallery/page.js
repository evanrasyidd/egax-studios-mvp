import { LOOKBOOK } from '@/constants/lookbook'
const COLORS = ['#4ADE80','#FF2E7E','#FACC15','#60A5FA','#F87171','#A78BFA','#34D399','#FB923C','#818CF8','#FCD34D','#6EE7B7','#FCA5A5']
export default function GalleryPage() {
  return (
    <div className="bg-bg min-h-screen px-6 md:px-10 py-12">
      <div className="mb-10 pb-6 border-b border-border">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-pink mb-2">Lookbook</p>
        <h1 className="font-display text-[48px] tracking-widest text-text1">Gallery SS 2025</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border">
        {LOOKBOOK.map((item,i) => (
          <div key={item.id} className="group relative overflow-hidden cursor-pointer border-2 border-transparent hover:border-pink transition-colors" style={{aspectRatio:'3/4'}}>
            <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{background:COLORS[i%COLORS.length]}}>
              <span className="font-display text-[40px] text-white/70">{(i+1).toString().padStart(2,'0')}</span>
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"/>
          </div>
        ))}
      </div>
    </div>
  )
}
