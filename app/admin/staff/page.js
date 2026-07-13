'use client'
import { useState } from 'react'
import { Plus, Trash2, Ban, Check, X, Edit2, ShieldCheck, UserCheck } from 'lucide-react'
import { useStaffStore } from '@/store/staffStore'
import { useAdminAuthStore } from '@/store/adminAuthStore'
import { useHydrated } from '@/hooks/useHydrated'
import { formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'

function StaffFormModal({ onClose, editTarget }) {
  const { addStaff, updateStaff } = useStaffStore()
  const isEdit = !!editTarget
  const [role, setRole] = useState(editTarget?.role || 'kasir')
  const [name, setName] = useState(editTarget?.name || '')
  const [username, setUsername] = useState(editTarget?.username || '')
  const [password, setPassword] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isEdit) {
      const updates = { name }
      if (role === 'admin') {
        if (username) updates.username = username
        if (password) updates.password = password
      } else {
        if (pin) updates.pin = pin
      }
      const result = await updateStaff(editTarget.id, updates)
      if (!result.success) { setError(result.error); setLoading(false); return }
      toast(`${name} diperbarui.`)
    } else {
      const result = await addStaff(role === 'admin' ? { role, name, username, password } : { role, name, pin })
      if (!result.success) { setError(result.error); setLoading(false); return }
      toast(`${name} ditambahkan sebagai ${role}.`)
    }
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[90] bg-text1/50 flex items-center justify-center p-4">
      <div className="bg-surface border-4 border-pink w-full max-w-sm" style={{ boxShadow: '8px 8px 0 #FF2E7E' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-border">
          <span className="font-body font-bold text-[10px] text-text1">{isEdit ? 'EDIT STAFF' : 'TAMBAH STAFF'}</span>
          <button onClick={onClose} className="text-text2 hover:text-pink"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {!isEdit && (
            <div className="grid grid-cols-2 gap-2">
              {['kasir', 'admin'].map((r) => (
                <button key={r} type="button" onClick={() => setRole(r)}
                  className={`font-body font-bold text-[8px] py-3 border-2 transition-colors ${role === r ? 'border-pink text-pink bg-pink/10' : 'border-border text-text2'}`}>
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-body font-bold text-[7px] text-text2">NAMA</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full bg-bg border-2 border-border text-text1 font-body font-bold text-[9px] px-4 py-2.5 outline-none focus:border-pink" />
          </div>

          {role === 'admin' ? (
            <>
              <div className="space-y-1.5">
                <label className="font-body font-bold text-[7px] text-text2">USERNAME</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} required={!isEdit}
                  className="w-full bg-bg border-2 border-border text-text1 font-body font-bold text-[9px] px-4 py-2.5 outline-none focus:border-pink" />
              </div>
              <div className="space-y-1.5">
                <label className="font-body font-bold text-[7px] text-text2">{isEdit ? 'PASSWORD BARU (opsional)' : 'PASSWORD'}</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={!isEdit}
                  className="w-full bg-bg border-2 border-border text-text1 font-body font-bold text-[9px] px-4 py-2.5 outline-none focus:border-pink" />
              </div>
            </>
          ) : (
            <div className="space-y-1.5">
              <label className="font-body font-bold text-[7px] text-text2">{isEdit ? 'PIN BARU (opsional)' : 'PIN (4-6 digit)'}</label>
              <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} maxLength={6} required={!isEdit}
                className="w-full bg-bg border-2 border-border text-text1 font-body font-bold text-[9px] px-4 py-2.5 outline-none focus:border-pink" />
            </div>
          )}

          {error && <p className="font-body font-bold text-[7px] text-red-700">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full font-body font-bold text-[9px] text-black py-3.5 transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: '#FF2E7E', border: '2px solid #14120F', boxShadow: '3px 3px 0 #14120F' }}>
            {loading ? 'MENYIMPAN...' : `${isEdit ? 'SIMPAN PERUBAHAN' : 'TAMBAH STAFF'} >>`}
          </button>
        </form>
      </div>
    </div>
  )
}

function StaffRow({ s, currentUserId, onEdit, onToggle, onDeleteRequest }) {
  const isSelf = s.id === currentUserId
  return (
    <tr className="hover:bg-surface/50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center border-2 border-border font-body font-bold text-[8px]"
            style={{ background: s.role === 'admin' ? '#FF2E7E' : '#14120F', color: s.role === 'admin' ? '#14120F' : '#FAF7F0' }}>
            {s.name[0]?.toUpperCase()}
          </div>
          <span className="font-body text-[13px] text-text1">{s.name}</span>
          {isSelf && <span className="font-body font-bold text-[6px] text-pink border border-pink px-1.5 py-0.5">YOU</span>}
        </div>
      </td>
      <td className="py-3 px-4 font-body font-bold text-[7px] text-text2">
        {s.role === 'admin' ? `@${s.username}` : 'PIN: ••••••'}
      </td>
      <td className="py-3 px-4 font-body font-bold text-[7px] text-text2">{formatDate(s.createdAt)}</td>
      <td className="py-3 px-4">
        <span className={`font-body font-bold text-[6px] px-2 py-1 border-2 ${s.active ? 'border-green-600 text-green-700' : 'border-red-500 text-red-700'}`}>
          {s.active ? 'ACTIVE' : 'INACTIVE'}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1.5">
          <button onClick={() => onEdit(s)}
            className="w-7 h-7 flex items-center justify-center border-2 border-border text-text2 hover:border-pink hover:text-pink transition-all">
            <Edit2 size={11} />
          </button>
          {!isSelf && (
            <>
              <button onClick={() => onToggle(s)}
                className={`w-7 h-7 flex items-center justify-center border-2 transition-all ${s.active ? 'border-border text-text2 hover:border-red-400 hover:text-red-700' : 'border-green-600 text-green-700 hover:border-green-600'}`}>
                {s.active ? <Ban size={11} /> : <Check size={11} />}
              </button>
              <button onClick={() => onDeleteRequest(s)}
                className="w-7 h-7 flex items-center justify-center border-2 border-border text-text2 hover:border-red-400 hover:text-red-700 transition-all">
                <Trash2 size={11} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

export default function StaffPage() {
  const hydrated = useHydrated()
  const { staff: staffRaw, removeStaff, toggleActive } = useStaffStore()
  const { staffId: currentUserId } = useAdminAuthStore()
  const staff = hydrated ? staffRaw : []
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const admins = staff.filter((s) => s.role === 'admin')
  const kasirs = staff.filter((s) => s.role === 'kasir')

  const handleEdit = (s) => { setEditTarget(s); setShowModal(true) }

  const handleToggle = (s) => {
    const result = toggleActive(s.id, currentUserId)
    if (!result.success) { toast(result.error, 'error'); return }
    toast(`${s.name} ${s.active ? 'dinonaktifkan' : 'diaktifkan'}.`)
  }

  const handleDelete = (s) => {
    const result = removeStaff(s.id, currentUserId)
    if (!result.success) { toast(result.error, 'error'); setConfirmDelete(null); return }
    toast(`${s.name} dihapus.`)
    setConfirmDelete(null)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-body font-bold text-[8px] text-pink mb-1">ADMIN PANEL</p>
          <h1 className="font-display text-[16px] text-text1">STAFF.EXE</h1>
          <p className="font-body font-bold text-[7px] text-text2 mt-1">{admins.length} ADMIN · {kasirs.length} KASIR</p>
        </div>
        <button onClick={() => { setEditTarget(null); setShowModal(true) }}
          className="flex items-center gap-2 font-body font-bold text-[9px] text-black px-5 py-3 transition-all hover:brightness-110"
          style={{ background: '#FF2E7E', border: '2px solid #14120F', boxShadow: '3px 3px 0 #14120F' }}>
          <Plus size={13} /> TAMBAH STAFF
        </button>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={13} className="text-pink" />
          <p className="font-body font-bold text-[8px] text-pink">ADMIN ({admins.length})</p>
        </div>
        <div className="border-2 border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border bg-surface">
                {['NAMA', 'USERNAME', 'DIBUAT', 'STATUS', 'ACTIONS'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 font-body font-bold text-[7px] text-pink">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              {admins.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center font-body font-bold text-[8px] text-text2">BELUM ADA ADMIN.</td></tr>
              ) : admins.map((s) => (
                <StaffRow key={s.id} s={s} currentUserId={currentUserId} onEdit={handleEdit} onToggle={handleToggle} onDeleteRequest={setConfirmDelete} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <UserCheck size={13} className="text-pink" />
          <p className="font-body font-bold text-[8px] text-pink">KASIR ({kasirs.length})</p>
        </div>
        <div className="border-2 border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border bg-surface">
                {['NAMA', 'PIN', 'DIBUAT', 'STATUS', 'ACTIONS'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 font-body font-bold text-[7px] text-pink">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              {kasirs.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center font-body font-bold text-[8px] text-text2">BELUM ADA KASIR.</td></tr>
              ) : kasirs.map((s) => (
                <StaffRow key={s.id} s={s} currentUserId={currentUserId} onEdit={handleEdit} onToggle={handleToggle} onDeleteRequest={setConfirmDelete} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <StaffFormModal onClose={() => setShowModal(false)} editTarget={editTarget} />}

      {confirmDelete && (
        <div className="fixed inset-0 z-[90] bg-text1/50 flex items-center justify-center p-4">
          <div className="bg-surface border-4 border-red-500 w-full max-w-sm p-6" style={{ boxShadow: '8px 8px 0 #ef4444' }}>
            <p className="font-body font-bold text-[9px] text-text1 mb-2">HAPUS STAFF?</p>
            <p className="font-body font-bold text-[7px] text-text2 mb-5 leading-relaxed">
              {confirmDelete.name} akan dihapus permanen dan tidak bisa login lagi.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 font-body font-bold text-[8px] text-text2 border-2 border-border py-3 hover:border-text2">
                BATAL
              </button>
              <button onClick={() => handleDelete(confirmDelete)}
                className="flex-1 font-body font-bold text-[8px] text-white bg-red-600 border-2 border-red-700 py-3 hover:bg-red-700">
                HAPUS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
