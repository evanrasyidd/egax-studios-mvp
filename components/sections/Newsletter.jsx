'use client'
import { useState } from 'react'
export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  return (
    <section className="bg-bg border-t border-border py-16 px-6 md:px-10 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-pink mb-3">Stay in the Loop</p>
      <h2 className="font-display text-[42px] text-text1 tracking-widest mb-2">Subscribe to our emails</h2>
      <p className="text-[13px] text-text2 mb-8">New drops, campaign previews, limited access — straight to your inbox.</p>
      {done ? (
        <p className="text-[13px] text-text2 italic">Thanks for subscribing.</p>
      ) : (
        <form onSubmit={e=>{e.preventDefault();setDone(true)}} className="flex max-w-md mx-auto border border-border overflow-hidden">
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required
            className="flex-1 bg-transparent px-4 py-3 text-[13px] text-text1 placeholder:text-text2/50 outline-none"/>
          <button type="submit" className="border-l border-border px-5 text-text2 hover:text-pink hover:bg-surface transition-colors text-[13px]">→</button>
        </form>
      )}
    </section>
  )
}
