'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Instagram } from 'lucide-react'
export default function Footer() {
  const [email, setEmail] = useState('')
  return (
    <footer className="bg-bg border-t border-border">
      <div className="px-6 md:px-10 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-10 border-b border-border">
          <div>
            <div className="font-display text-[26px] tracking-widest text-text1 mb-1">EGAX STUDIOS</div>
            <p className="text-[12px] text-text2 tracking-wider mb-6">Built in the Dark. Worn in the Streets.</p>
            <form onSubmit={e=>e.preventDefault()} className="flex border border-border overflow-hidden">
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your email"
                className="flex-1 bg-transparent px-3 py-2.5 text-[12px] text-text1 placeholder:text-text2/50 outline-none"/>
              <button type="submit" className="border-l border-border px-3 text-text2 hover:text-pink transition-colors"><ArrowRight size={13}/></button>
            </form>
          </div>
          {[
            { title:'Customer Care', links:[{l:'Contact',h:'/contact'},{l:'Refund Policy',h:'/contact'},{l:'Privacy Policy',h:'/contact'},{l:'Shipping Policy',h:'/contact'}] },
            { title:'EGAX Studios', links:[{l:'About Us',h:'/about'},{l:'Editorial',h:'/editorial'},{l:'Gallery',h:'/gallery'},{l:'Catalog',h:'/catalog'}] },
            { title:'Legal', links:[{l:'Terms of Service',h:'/contact'},{l:'Legal Notice',h:'/contact'},{l:'Cookie Policy',h:'/contact'}] },
          ].map(col => (
            <div key={col.title}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-text2 mb-4">{col.title}</p>
              {col.links.map(l => <Link key={l.l} href={l.h} className="block text-[13px] text-text2 hover:text-pink mb-2 transition-colors">{l.l}</Link>)}
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-[11px] text-text2">© 2025 EGAX STUDIOS. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {['QRIS','BCA','BNI','Mandiri','OVO'].map(p => (
              <span key={p} className="text-[9px] font-bold uppercase tracking-wider text-text2 border border-border px-2 py-0.5 hover:border-pink transition-colors">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
