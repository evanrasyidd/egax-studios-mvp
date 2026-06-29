'use client'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useHydrated } from '@/hooks/useHydrated'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { toast } from '@/components/ui/Toast'
export default function SettingsPage() {
  const hydrated = useHydrated()
  const { user, updateUser } = useAuthStore()
  const [name, setName] = useState('')

  // Sinkronkan field "name" begitu authStore selesai rehydrate dari
  // localStorage -- render pertama (sebelum hydrated) selalu pakai string
  // kosong supaya server & client identik, lalu di-isi setelah hydrated.
  useEffect(() => {
    if (hydrated) setName(user?.name || '')
  }, [hydrated, user])

  const handleSave = e => { e.preventDefault(); updateUser({name}); toast('Profile updated!') }
  return (
    <div className="max-w-sm">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-pink mb-1">My Account</p>
      <h1 className="font-display text-[32px] tracking-widest text-bg mb-6">Settings</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <Input label="Display Name" value={name} onChange={e=>setName(e.target.value)}/>
        <Input label="Email" value={hydrated ? (user?.email||'') : ''} disabled className="opacity-60 cursor-not-allowed"/>
        <Button type="submit" variant="white" className="border border-bg bg-bg text-white">Save Changes</Button>
      </form>
    </div>
  )
}
