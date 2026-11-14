'use client'
import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { useVoucherStore } from '@/store/voucherStore'
import { useHydrated } from '@/hooks/useHydrated'
import { formatPrice } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'
import Button from '@/components/ui/Button'
import Switch from '@/components/ui/Switch'
import { FieldInput, FieldLabel, FieldSelect } from '@/components/ui/Field'
import { useI18n } from '@/store/i18nStore'

const EMPTY = { code: '', type: 'percent', value: '', minSpend: '' }

function VoucherModal({ initial, onSubmit, onClose }) {
  const { t } = useI18n()
  const [form, setForm] = useState(initial)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  return (
    <div className="fixed inset-0 z-[90] bg-text1/60 flex items-center justify-center p-4">
      <div className="anim-rise bg-surface border border-text1 w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-2.5 bg-text1">
          <span className="arch-label text-bg">{initial?.id ? t('admin.editVoucher') : t('admin.addVoucher')}</span>
          <button onClick={onClose} className="text-bg/70 hover:text-bg p-1"><X size={14} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="p-5 space-y-4">
          <div>
            <FieldLabel>{t('admin.voucherCode')}</FieldLabel>
            <FieldInput required value={form.code} onChange={(e) => set('code', e.target.value.toUpperCase())} placeholder="EGAX10" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>{t('admin.voucherType')}</FieldLabel>
              <FieldSelect value={form.type} onChange={(e) => set('type', e.target.value)}>
                <option value="percent">% {t('admin.voucherPercent')}</option>
                <option value="fixed">{t('admin.voucherFixed')} (IDR)</option>
              </FieldSelect>
            </div>
            <div>
              <FieldLabel>{t('admin.voucherValue')}</FieldLabel>
              <FieldInput required type="number" min={1} value={form.value} onChange={(e) => set('value', Number(e.target.value))} placeholder="10" />
            </div>
          </div>
          <div>
            <FieldLabel>{t('admin.voucherMinSpend')}</FieldLabel>
            <FieldInput type="number" min={0} value={form.minSpend} onChange={(e) => set('minSpend', Number(e.target.value))} placeholder="0" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">{t('admin.saveVoucher')}</Button>
            <Button variant="outline" type="button" onClick={onClose}>{t('admin.cancel')}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminVouchersPage() {
  const { t } = useI18n()
  const hydrated = useHydrated()
  const { vouchers: raw, addVoucher, deleteVoucher, toggleVoucher } = useVoucherStore()
  const vouchers = hydrated ? raw : []
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const handleSave = (form) => {
    if (editId) {
      useVoucherStore.getState().updateVoucher(editId, form)
      toast(t('admin.voucherUpdated'))
    } else {
      addVoucher(form)
      toast(t('admin.voucherAdded'))
    }
    setShowAdd(false)
    setEditId(null)
  }

  const editVoucher = vouchers.find((v) => v.id === editId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="arch-label text-pink mb-1">{t('admin.panel')}</p>
          <h1 className="font-display text-[18px] font-bold tracking-[-0.01em] text-text1">{t('admin.vouchersTitle')}</h1>
        </div>
        <Button onClick={() => { setEditId(null); setShowAdd(true) }}>
          <Plus size={13} /> {t('admin.addVoucher')}
        </Button>
      </div>

      <div className="border border-border divide-y divide-border">
        {vouchers.length === 0 && (
          <p className="px-4 py-8 text-center arch-label text-text2">{t('admin.noVouchers')}</p>
        )}
        {vouchers.map((v) => (
          <div key={v.id} className="flex items-center gap-4 px-4 py-3 hover:bg-surface transition-colors">
            <span className="font-mono text-[12px] font-semibold text-text1 w-24">{v.code}</span>
            <span className="font-mono text-[11px] text-text2 w-28">
              {v.type === 'percent' ? `${v.value}% OFF` : formatPrice(v.value)}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-text2 hidden md:block">
              {t('admin.voucherMinSpend')} {formatPrice(v.minSpend)}
            </span>
            <span className={`font-mono text-[11px] uppercase tracking-widest px-2 py-0.5 border ${v.active ? 'border-green-700 text-green-800 bg-green-50' : 'border-border text-text2'}`}>
              {v.active ? t('admin.active') : t('admin.inactive')}
            </span>
            <div className="ml-auto flex items-center gap-3">
              <Switch checked={v.active} onChange={() => toggleVoucher(v.id)} label={t('admin.toggleVoucher')} />
              <button onClick={() => { setEditId(v.id); setShowAdd(true) }} className="arch-label text-text2 hover:text-text1 transition-colors" aria-label={t('admin.edit')}>
                {t('admin.edit')}
              </button>
              <button onClick={() => setConfirmDelete(v)} className="text-text2 hover:text-red-600 transition-colors" aria-label={t('admin.delete')}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-[90] bg-text1/60 flex items-center justify-center p-4">
          <div className="anim-rise bg-surface border border-text1 w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-2.5 bg-text1">
              <span className="arch-label text-bg">{t('admin.deleteVoucher')}</span>
              <button onClick={() => setConfirmDelete(null)} className="text-bg/70 hover:text-bg p-1"><X size={14} /></button>
            </div>
            <div className="p-5">
              <p className="text-[13px] text-text2 mb-5 leading-relaxed">{t('admin.deleteVoucherSure', { code: confirmDelete.code })}</p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(null)}>{t('admin.cancel')}</Button>
                <Button variant="danger" className="flex-1" onClick={() => { deleteVoucher(confirmDelete.id); toast(t('admin.voucherDeleted'), 'error'); setConfirmDelete(null) }}>{t('admin.delete')}</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <VoucherModal
          initial={editVoucher || EMPTY}
          onSubmit={handleSave}
          onClose={() => { setShowAdd(false); setEditId(null) }}
        />
      )}
    </div>
  )
}
