'use client'
import { useState } from 'react'
import { Ban, Check } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import { useOrderStore } from '@/store/orderStore'
import { useHydrated } from '@/hooks/useHydrated'
import { formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'

/**
 * Halaman ini khusus customer (pelanggan shop), bukan staff internal.
 * Untuk kelola admin/kasir, lihat Staff Management di /admin/staff
 * (store/staffStore.js) -- itu sumber data yang benar untuk staff.
 *
 * NOTE: belum ada store customer terpusat di project ini -- data customer
 * sebenarnya hanya tersirat dari `order.customer` di orderStore. Daftar
 * di bawah ini diturunkan dari order yang ada, bukan dummy lagi.
 */
export default function AdminUsersPage() {
  const hydrated = useHydrated()
  const { bannedUsers: bannedUsersRaw, banUser, unbanUser } = useAdminStore()
  const { orders: ordersRaw } = useOrderStore()
  const bannedUsers = hydrated ? bannedUsersRaw : []
  const orders = hydrated ? ordersRaw : []
  const [search, setSearch] = useState('')

  // Derive daftar customer unik dari order yang sudah pernah masuk,
  // bukan dummy hardcoded -- lebih akurat merefleksikan siapa yang
  // benar-benar pernah belanja.
  const customerMap = new Map()
  orders.forEach((o) => {
    const email = o.customer?.email
    if (!email || o.channel === 'pos') return // order POS tidak punya email customer asli
    if (!customerMap.has(email)) {
      customerMap.set(email, {
        id: email,
        name: `${o.customer?.firstName || ''} ${o.customer?.lastName || ''}`.trim() || 'Customer',
        email,
        joinDate: o.date,
      })
    }
  })
  const users = Array.from(customerMap.values())
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const getOrderCount = (email) => orders.filter(o => o.customer?.email === email).length

  return (
    <div className="space-y-6">
      <div>
        <p className="font-pixel text-[8px] text-pink mb-1">ADMIN PANEL</p>
        <h1 className="font-pixel text-[16px] text-text1">USERS.EXE</h1>
        <p className="font-pixel text-[7px] text-text2 mt-1">{users.length} REGISTERED USERS</p>
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="SEARCH USERS..."
        className="w-full max-w-md bg-surface border-2 border-border text-text1 font-pixel text-[8px] px-4 py-2.5 outline-none focus:border-pink" />

      {bannedUsers.length > 0 && (
        <div className="border-2 border-red-500 p-4 bg-red-900/10">
          <p className="font-pixel text-[8px] text-red-400 mb-2">★ BANNED USERS ({bannedUsers.length})</p>
          <div className="flex flex-wrap gap-2">
            {bannedUsers.map(email => (
              <div key={email} className="flex items-center gap-2 border-2 border-red-500 px-2 py-1">
                <span className="font-pixel text-[7px] text-red-400">{email}</span>
                <button onClick={() => { unbanUser(email); toast(`${email} unbanned`) }}
                  className="text-green-400 hover:text-green-300">
                  <Check size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-2 border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-border bg-surface">
              {['USER','EMAIL','ORDERS','JOIN DATE','STATUS','ACTIONS'].map(h => (
                <th key={h} className="text-left py-3 px-4 font-pixel text-[7px] text-pink">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-border">
            {filtered.map((u) => {
              const banned = bannedUsers.includes(u.email)
              return (
                <tr key={u.id} className="hover:bg-surface/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 flex items-center justify-center border-2 border-border font-pixel text-[8px]" style={{ background: '#1B1B1B', color: '#F5F5F3' }}>
                        {u.name[0]?.toUpperCase()}
                      </div>
                      <span className="font-body text-[13px] text-text1">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-body text-[12px] text-text2">{u.email}</td>
                  <td className="py-3 px-4 font-pixel text-[8px] text-text1">{getOrderCount(u.email)}</td>
                  <td className="py-3 px-4 font-pixel text-[7px] text-text2">{formatDate(u.joinDate)}</td>
                  <td className="py-3 px-4">
                    <span className={`font-pixel text-[7px] px-2 py-1 border-2 ${banned ? 'border-red-500 text-red-400' : 'border-green-600 text-green-400'}`}>
                      {banned ? 'BANNED' : 'ACTIVE'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        if (banned) { unbanUser(u.email); toast(`${u.name} unbanned`) }
                        else { banUser(u.email); toast(`${u.name} banned`, 'error') }
                      }}
                      className={`w-7 h-7 flex items-center justify-center border-2 transition-all ${banned ? 'border-green-600 text-green-400 hover:border-green-400' : 'border-border text-text2 hover:border-red-400 hover:text-red-400'}`}>
                      {banned ? <Check size={11}/> : <Ban size={11}/>}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
