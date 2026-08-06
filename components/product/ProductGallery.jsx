'use client'
import { useState } from 'react'
import GarmentIcon from '@/components/product/GarmentIcon'
import { useI18n } from '@/store/i18nStore'

const COLORS = ['#A6A29A','#77736C','#5A5751','#3A3936','#222220','#8F8B84','#6E6A63','#4A4844']

export default function ProductGallery({ name, category, productIndex = 0 }) {
  const [hover, setHover] = useState(false)
  const { t } = useI18n()
  const c1 = COLORS[productIndex % COLORS.length]
  const c2 = COLORS[(productIndex+2) % COLORS.length]
  return (
    <div className="flex flex-col gap-2">
      <div className="relative overflow-hidden border border-border" style={{aspectRatio:'3/4'}}
        onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
        {/* Representasi garmen per kategori -- bukan foto produk asli.
            Begitu Ega punya foto produk real, ganti ke <img src={product.images[0]}/>. */}
        <div data-zoom className="w-full h-full flex flex-col items-center justify-center gap-4 transition-colors duration-500" style={{background: hover ? c2 : c1}}>
          <GarmentIcon category={category} fill="rgba(255,255,255,0.92)" shade="rgba(0,0,0,0.22)" detail="#111111" scale={hover ? 13 : 12}/>
          <div className="text-center px-6">
            <p className="font-body text-[11px] font-bold uppercase tracking-widest text-white/85 mb-1">{category}</p>
            <p className="font-body text-[13px] font-semibold text-white/70 leading-snug">{name}</p>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-text2 text-center">{t('product.photoNote')}</p>
    </div>
  )
}
