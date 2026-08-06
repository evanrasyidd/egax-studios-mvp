'use client'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useI18n } from '@/store/i18nStore'
import { useHydrated } from '@/hooks/useHydrated'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { toast } from '@/components/ui/Toast'
export default function SettingsPage() {
  const { t } = useI18n()
  const hydrated = useHydrated()
  const { user, updateUser } = useAuthStore()
  const [name, setName] = useState('')

  // Sinkronkan field "name" begitu authStore selesai rehydrate dari
  // localStorage -- render pertama (sebelum hydrated) selalu pakai string
  // kosong supaya server & client identik, lalu di-isi setelah hydrated.
  useEffect(() => {
    if (hydrated) setName(user?.name || '')
  }, [hydrated, user])

  const handleSave = e => { e.preventDefault(); updateUser({name}); toast(t('account.profileUpdated')) }
  return (
    <div className="max-w-sm">
      <p className="arch-label text-pink mb-1">{t('account.myAccount')}</p>
      <h1 className="font-display text-[32px] tracking-widest text-text1 mb-6">{t('account.settings')}</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <Input label={t('account.displayName')} value={name} onChange={e=>setName(e.target.value)}/>
        <Input label={t('account.email')} value={hydrated ? (user?.email||'') : ''} disabled className="opacity-60 cursor-not-allowed"/>
        <Button type="submit" variant="primary">{t('account.saveChanges')}</Button>
      </form>
    </div>
  )
}
