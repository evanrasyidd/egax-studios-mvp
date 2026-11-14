'use client'
import { useState } from 'react'
import { Ban, Check, Trash2, X } from 'lucide-react'
import { useUsersStore } from '@/store/usersStore'
import { useOrderStore } from '@/store/orderStore'
import { useHydrated } from '@/hooks/useHydrated'
import { formatDate, formatPrice } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'
import Button from '@/components/ui/Button'
import { useI18n } from '@/store/i18nStore'

/**
 * Halaman customer (pelanggan shop) — sumber data: registri customer
 * terpusat (usersStore) + order dari orderStore. Untuk kelola staff
 * internal (admin/kasir) lihat /admin/staff.
 */
export default function AdminUsersPage() {
  const { t } = useI18n()
  const hydrated = useHydrated()
  const { users: usersRaw, removeUser, toggleBan } = useUsersStore()
  const { orders: ordersRaw } = useOrderStore()
  const users = hydrated ? usersRaw : []
  const orders = hydrated ? ordersRaw : []
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  // Gabung dengan customer yang cuma pernah order (belum register)
  const merged = [...users]
  orders.forEach((o) => {
    const email = o.customer?.email
    if (!email || o.channel === 'pos') return
    if (!merged.some((u) => u.email === email)) {
      merged.push({
        id: email,
        name: `${o.customer?.firstName || ''} ${o.customer?.lastName || ''}`.trim() || 'Customer',
        email,
        role: 'customer',
        joined: o.date,
        banned: false,
      })
    }
  })

  const filtered = merged.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const ordersOf = (email) => orders.filter((o) => o.customer?.email === email)
  const totalSpent = (email) => ordersOf(email).reduce((a, o) => a + (o.total || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <p className="arch-label text-pink mb-1">{t('admin.panel')}</p>
        <h1 className="font-display text-[18px] font-bold tracking-[-0.01em] text-text1">{t('admin.usersTitle')}</h1>
        <p className="font-mono text-[11px] font-medium text-text2 mt-1">{t('admin.registeredUsers', { n: merged.length })}</p>
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t('admin.searchUsers')}
        className="w-full max-w-md bg-surface border border-border text-text1 font-mono text-[11px] font-medium px-4 py-2.5 focus:border-pink" />

      <div className="border border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface">
              {[t('admin.colUser'),t('admin.colEmail'),t('admin.colOrders'),t('admin.colSpent'),t('admin.colJoin'),t('admin.colStatus3'),t('admin.colActions')].map(h => (
                <th key={h} className="text-left py-3 px-4 font-mono text-[11px] font-medium text-pink">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="py-10 text-center arch-label text-text2">{t('admin.noUsers')}</td></tr>
            )}
            {filtered.map((u) => {
              const banned = u.banned
              return (
                <tr key={u.email} className="hover:bg-surface/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 flex items-center justify-center border border-border font-mono text-[11px] font-medium" style={{ background: '#111111', color: '#FFFFFF' }}>
                        {u.name[0]?.toUpperCase()}
                      </div>
                      <span className="font-body text-[13px] text-text1">{u.name}</span>
                      {u.role === 'admin' && <span className="arch-label text-text2 border border-border px-1.5 py-0.5">{t('admin.colRole')}</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-body text-[12px] text-text2">{u.email}</td>
                  <td className="py-3 px-4 font-mono text-[11px] font-medium text-text1">{ordersOf(u.email).length}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-text1">{formatPrice(totalSpent(u.email))}</td>
                  <td className="py-3 px-4 font-mono text-[11px] font-medium text-text2">{formatDate(u.joined)}</td>
                  <td className="py-3 px-4">
                    <span className={`font-mono text-[11px] font-medium px-2 py-1 border-2 ${banned ? 'border-red-500 text-red-700' : 'border-green-600 text-green-700'}`}>
                      {banned ? t('admin.banned') : t('admin.active')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (banned) { toggleBan(u.email); toast(t('admin.unbannedToast', { name: u.name })) }
                          else { toggleBan(u.email); toast(t('admin.bannedToast', { name: u.name }), 'error') }
                        }}
                        className={`w-7 h-7 flex items-center justify-center border transition-colors ${banned ? 'border-green-600 text-green-700 hover:border-green-600' : 'border-border text-text2 hover:border-red-400 hover:text-red-700'}`}>
                        {banned ? <Check size={11}/> : <Ban size={11}/>}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(u)}
                        className="w-7 h-7 flex items-center justify-center border border-border text-text2 hover:border-red-400 hover:text-red-700 transition-colors">
                        <Trash2 size={11}/>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-[90] bg-text1/60 flex items-center justify-center p-4">
          <div className="anim-rise bg-surface border border-text1 w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-2.5 bg-text1">
              <span className="arch-label text-bg">{t('admin.deleteUser')}</span>
              <button onClick={() => setConfirmDelete(null)} className="text-bg/70 hover:text-bg p-1"><X size={14} /></button>
            </div>
            <div className="p-5">
              <p className="text-[13px] text-text2 mb-5 leading-relaxed">{t('admin.deleteUserSure', { name: confirmDelete.name })}</p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(null)}>{t('admin.cancel')}</Button>
                <Button variant="danger" className="flex-1" onClick={() => { removeUser(confirmDelete.email); toast(t('admin.userDeleted', { name: confirmDelete.name }), 'error'); setConfirmDelete(null) }}>{t('admin.delete')}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
