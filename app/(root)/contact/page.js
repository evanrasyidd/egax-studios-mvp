'use client'
import { useState } from 'react'
import { toast } from '@/components/ui/Toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    toast('Message sent!')
  }

  return (
    <div className="bg-bg min-h-screen px-6 md:px-10 py-16">
      <div className="max-w-xl">
        <p className="font-pixel text-[8px] text-pink mb-4">CONTACT.EXE</p>
        <h1 className="font-pixel text-[28px] leading-tight text-text1 mb-8">GET IN TOUCH</h1>
        {sent ? (
          <div className="border-2 border-pink p-6" style={{boxShadow:'4px 4px 0 #FF2D9B'}}>
            <p className="font-pixel text-[10px] text-pink">MESSAGE SENT!</p>
            <p className="font-body text-text2 text-sm mt-2">We will get back to you within 1-2 business days.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-pixel text-[7px] text-text2 block mb-1">NAME</label>
              <input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" required
                className="w-full bg-surface border-2 border-border text-text1 font-body text-sm px-4 py-3 outline-none focus:border-pink transition-colors" />
            </div>
            <div>
              <label className="font-pixel text-[7px] text-text2 block mb-1">EMAIL</label>
              <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com" required
                className="w-full bg-surface border-2 border-border text-text1 font-body text-sm px-4 py-3 outline-none focus:border-pink transition-colors" />
            </div>
            <div>
              <label className="font-pixel text-[7px] text-text2 block mb-1">MESSAGE</label>
              <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} rows={5} required
                className="w-full bg-surface border-2 border-border text-text1 font-body text-sm px-4 py-3 outline-none focus:border-pink resize-none transition-colors" />
            </div>
            <button type="submit" className="font-pixel text-[9px] bg-pink text-black border-2 border-black px-8 py-3 pixel-btn">
              SEND MESSAGE
            </button>
          </form>
        )}
        <div className="mt-12 pt-8 border-t-2 border-border">
          <p className="font-pixel text-[7px] text-pink mb-3">DIRECT CONTACT</p>
          <p className="font-body text-text1 text-sm">hello@egaxstudios.com</p>
          <p className="font-body text-text2 text-sm mt-1">Jakarta Selatan, Indonesia</p>
        </div>
      </div>
    </div>
  )
}
