'use client'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useUsersStore } from '@/store/usersStore'
import { useI18n } from '@/store/i18nStore'
import { useHydrated } from '@/hooks/useHydrated'
import { loginUser, registerUser } from '@/lib/mockAuth'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
export default function AccountPage() {
  const { t } = useI18n()
  const hydrated = useHydrated()
  const { user, isAuthenticated, login } = useAuthStore()
  const addUser = useUsersStore((s) => s.addUser)
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email:'', password:'', name:'' })
  const [error, setError] = useState('')
  const handleSubmit = e => {
    e.preventDefault(); setError('')
    if (mode==='login') {
      const r = loginUser(form.email,form.password)
      if (r.success) { login(r.user); toast(t('account.welcome')) } else setError(r.error)
    } else {
      const r = registerUser(form.email,form.name,form.password)
      if (r.success) {
        // Daftar ke registri customer terpusat (dibaca admin/users)
        addUser({ name: form.name, email: form.email })
        login(r.user); toast(t('account.created'))
      } else setError(r.error)
    }
  }
  // Tunggu rehydrate selesai sebelum memutuskan tampilkan form login atau
  // profile -- authStore baru kebaca dari localStorage setelah hydrated.
  if (!hydrated) return null
  if (isAuthenticated && user) return (
    <div>
      <p className="arch-label text-pink mb-1">{t('account.myAccount')}</p>
      <h1 className="font-display text-[32px] font-bold tracking-[-0.01em] text-text1 mb-6">{t('account.profile')}</h1>
      <div className="border border-text1 bg-bg max-w-sm">
        <div className="flex items-center justify-between px-5 py-2.5 bg-text1">
          <span className="arch-label text-bg">PROFILE</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-bg/60">Nº 001</span>
        </div>
        <div className="px-5 py-3">
          {[[t('account.name'),user.name],[t('account.email'),user.email],[t('account.roleLabel'),user.role?.toUpperCase()]].map(([k,v])=>(
            <div key={k} className="flex gap-3 py-2.5 border-b border-border last:border-0">
              <span className="arch-label text-text2 w-20 shrink-0 mt-0.5">{k}</span>
              <span className="text-[14px] font-medium text-text1">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
  return (
    <div className="max-w-sm">
      <p className="arch-label text-pink mb-1">{t('account.myAccount')}</p>
      <h1 className="font-display text-[32px] font-bold tracking-[-0.01em] text-text1 mb-6">{mode==='login'?t('account.signIn'):t('account.register')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode==='register' && <Input label={t('account.fullName')} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name"/>}
        <Input label={t('account.email')} type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@email.com"/>
        <Input label={t('account.password')} type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••"/>
        {error && <p className="font-mono text-[11px] text-red-600">{error}</p>}
        <Button type="submit" variant="primary" className="w-full">{mode==='login'?t('account.signIn'):t('account.create')}</Button>
      </form>
      <button onClick={()=>setMode(mode==='login'?'register':'login')} className="mt-4 arch-label text-text2 hover:text-pink underline underline-offset-4">
        {mode==='login'?t('account.createOne'):t('account.already')}
      </button>
    </div>
  )
}
