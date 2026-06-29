'use client'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useHydrated } from '@/hooks/useHydrated'
import { loginUser, registerUser } from '@/lib/mockAuth'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
export default function AccountPage() {
  const hydrated = useHydrated()
  const { user, isAuthenticated, login } = useAuthStore()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email:'', password:'', name:'' })
  const [error, setError] = useState('')
  const handleSubmit = e => {
    e.preventDefault(); setError('')
    if (mode==='login') {
      const r = loginUser(form.email,form.password)
      if (r.success) { login(r.user); toast('Welcome back!') } else setError(r.error)
    } else {
      const r = registerUser(form.email,form.name,form.password)
      if (r.success) { login(r.user); toast('Account created!') } else setError(r.error)
    }
  }
  // Tunggu rehydrate selesai sebelum memutuskan tampilkan form login atau
  // profile -- authStore baru kebaca dari localStorage setelah hydrated.
  if (!hydrated) return null
  if (isAuthenticated && user) return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-pink mb-1">My Account</p>
      <h1 className="font-display text-[32px] tracking-widest text-bg mb-6">Profile</h1>
      <div className="border border-gray-200 p-5 max-w-sm">
        {[['Name',user.name],['Email',user.email],['Role',user.role?.toUpperCase()]].map(([k,v])=>(
          <div key={k} className="flex gap-3 py-2.5 border-b border-gray-100 last:border-0">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 w-16 shrink-0 mt-0.5">{k}</span>
            <span className="text-[14px] font-medium text-bg">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
  return (
    <div className="max-w-sm">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-pink mb-1">My Account</p>
      <h1 className="font-display text-[32px] tracking-widest text-bg mb-6">{mode==='login'?'Sign In':'Register'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode==='register' && <Input label="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name"/>}
        <Input label="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@email.com"/>
        <Input label="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••"/>
        {error && <p className="text-[12px] text-red-500">{error}</p>}
        <Button type="submit" variant="primary" className="w-full">{mode==='login'?'Sign In':'Create Account'}</Button>
      </form>
      <button onClick={()=>setMode(mode==='login'?'register':'login')} className="mt-4 text-[12px] text-gray-400 hover:text-pink underline">
        {mode==='login'?'Create an account':'Already have an account?'}
      </button>
    </div>
  )
}
