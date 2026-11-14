'use client'
import { useState } from 'react'
import { Plus, Trash2, Ban, Check, X, Edit2, ShieldCheck, UserCheck } from 'lucide-react'
import { useStaffStore } from '@/store/staffStore'
import { useAdminAuthStore } from '@/store/adminAuthStore'
import { useHydrated } from '@/hooks/useHydrated'
import { formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'
import Button from '@/components/ui/Button'
import { FieldInput, FieldLabel } from '@/components/ui/Field'
import { useI18n } from '@/store/i18nStore'

function StaffFormModal({ onClose, editTarget }) {
  const { t } = useI18n()
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
      toast(t('admin.staffUpdated', { name }))
    } else {
      const result = await addStaff(role === 'admin' ? { role, name, username, password } : { role, name, pin })
      if (!result.success) { setError(result.error); setLoading(false); return }
      toast(t('admin.staffAdded', { name, role: t(`admin.role${role === 'admin' ? 'Admin' : 'Cashier'}`) }))
    }
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[90] bg-text1/50 flex items-center justify-center p-4">
      <div className="anim-rise bg-surface border border-text1 w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-2.5 bg-text1">
          <span className="arch-label text-bg">{isEdit ? t('admin.editStaff') : t('admin.addStaff')}</span>
          <button onClick={onClose} className="text-bg/70 hover:text-bg p-1"><X size={14} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {!isEdit && (
            <div className="grid grid-cols-2 gap-2">
              {['kasir', 'admin'].map((r) => (
                <button key={r} type="button" onClick={() => setRole(r)}
                  className={`font-mono text-[11px] font-medium py-3 border transition-colors ${role === r ? 'border-pink text-pink bg-pink/10' : 'border-border text-text2'}`}>
                  {r === 'admin' ? t('admin.roleAdmin') : t('admin.roleCashier')}
                </button>
              ))}
            </div>
          )}

          <div>
            <FieldLabel>{t('admin.fieldName')}</FieldLabel>
            <FieldInput value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          {role === 'admin' ? (
            <>
              <div>
                <FieldLabel>{t('admin.colUsername')}</FieldLabel>
                <FieldInput value={username} onChange={(e) => setUsername(e.target.value)} required={!isEdit} />
              </div>
              <div>
                <FieldLabel>{isEdit ? t('admin.fieldNewPassword') : t('admin.fieldPassword')}</FieldLabel>
                <FieldInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={!isEdit} />
              </div>
            </>
          ) : (
            <div className="space-y-1.5">
              <label className="font-mono text-[11px] font-medium text-text2">{isEdit ? t('admin.fieldNewPin') : t('admin.fieldPin')}</label>
              <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} maxLength={6} required={!isEdit}
                className="w-full bg-bg border border-border text-text1 font-mono text-[11px] font-medium px-4 py-2.5 focus:border-text1" />
            </div>
          )}

          {error && <p className="font-mono text-[11px] font-medium text-red-700">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t('admin.saving') : (isEdit ? t('admin.saveChanges') : t('admin.addStaff'))}
          </Button>
        </form>
      </div>
    </div>
  )
}

function StaffRow({ s, currentUserId, onEdit, onToggle, onDeleteRequest }) {
  const { t } = useI18n()
  const isSelf = s.id === currentUserId
  return (
    <tr className="hover:bg-surface/50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center border border-border font-mono text-[11px] font-medium"
            style={{ background: s.role === 'admin' ? '#111111' : '#FFFFFF', color: s.role === 'admin' ? '#FFFFFF' : '#111111' }}>
            {s.name[0]?.toUpperCase()}
          </div>
          <span className="font-body text-[13px] text-text1">{s.name}</span>
          {isSelf && <span className="font-mono text-[11px] font-medium text-pink border border-pink px-1.5 py-0.5">{t('admin.you')}</span>}
        </div>
      </td>
      <td className="py-3 px-4 font-mono text-[11px] font-medium text-text2">
        {s.role === 'admin' ? `@${s.username}` : t('admin.pinMask')}
      </td>
      <td className="py-3 px-4 font-mono text-[11px] font-medium text-text2">{formatDate(s.createdAt)}</td>
      <td className="py-3 px-4">
        <span className={`font-mono text-[11px] font-medium px-2 py-1 border ${s.active ? 'border-green-600 text-green-700' : 'border-red-500 text-red-700'}`}>
          {s.active ? t('admin.active') : t('admin.inactive')}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1.5">
          <button onClick={() => onEdit(s)}
            className="w-8 h-8 flex items-center justify-center border border-border text-text2 hover:border-pink hover:text-pink transition-colors">
            <Edit2 size={11} />
          </button>
          {!isSelf && (
            <>
              <button onClick={() => onToggle(s)}
                className={`w-8 h-8 flex items-center justify-center border transition-colors ${s.active ? 'border-border text-text2 hover:border-red-400 hover:text-red-700' : 'border-green-600 text-green-700 hover:border-green-600'}`}>
                {s.active ? <Ban size={11} /> : <Check size={11} />}
              </button>
              <button onClick={() => onDeleteRequest(s)}
                className="w-8 h-8 flex items-center justify-center border border-border text-text2 hover:border-red-400 hover:text-red-700 transition-colors">
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
  const { t } = useI18n()
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
    toast(s.active ? t('admin.staffDeactivated', { name: s.name }) : t('admin.staffActivated', { name: s.name }))
  }

  const handleDelete = (s) => {
    const result = removeStaff(s.id, currentUserId)
    if (!result.success) { toast(result.error, 'error'); setConfirmDelete(null); return }
    toast(t('admin.staffDeleted', { name: s.name }))
    setConfirmDelete(null)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="arch-label text-pink mb-1">{t('admin.panel')}</p>
          <h1 className="font-display text-[18px] font-bold tracking-[-0.01em] text-text1">{t('admin.staffTitle')}</h1>
          <p className="font-mono text-[11px] font-medium text-text2 mt-1">{t('admin.staffCount', { admins: admins.length, kasirs: kasirs.length })}</p>
        </div>
        <Button onClick={() => { setEditTarget(null); setShowModal(true) }}>
          <Plus size={13} /> {t('admin.addStaff')}
        </Button>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={13} className="text-pink" />
          <p className="font-mono text-[11px] font-medium text-pink">{t('admin.roleAdmin')} ({admins.length})</p>
        </div>
        <div className="border border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface">
                {[t('admin.colName'), t('admin.colUsername'), t('admin.colCreated'), t('admin.colStatus2'), t('admin.colActions')].map((h) => (
                  <th key={h} className="text-left py-3 px-4 font-mono text-[11px] font-medium text-pink">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {admins.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center font-mono text-[11px] font-medium text-text2">{t('admin.noAdmins')}</td></tr>
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
          <p className="font-mono text-[11px] font-medium text-pink">{t('admin.roleCashier')} ({kasirs.length})</p>
        </div>
        <div className="border border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface">
                {[t('admin.colName'), t('admin.colPin'), t('admin.colCreated'), t('admin.colStatus2'), t('admin.colActions')].map((h) => (
                  <th key={h} className="text-left py-3 px-4 font-mono text-[11px] font-medium text-pink">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {kasirs.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center font-mono text-[11px] font-medium text-text2">{t('admin.noCashiers')}</td></tr>
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
          <div className="anim-rise bg-surface border border-text1 w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-2.5 bg-text1">
              <span className="arch-label text-bg">{t('admin.deleteStaff')}</span>
              <button onClick={() => setConfirmDelete(null)} className="text-bg/70 hover:text-bg p-1"><X size={14} /></button>
            </div>
            <div className="p-5">
              <p className="text-[13px] text-text2 mb-5 leading-relaxed">
                {t('admin.deleteStaffWarn', { name: confirmDelete.name })}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(null)}>{t('admin.cancel2')}</Button>
                <Button variant="danger" className="flex-1" onClick={() => handleDelete(confirmDelete)}>{t('admin.delete2')}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
