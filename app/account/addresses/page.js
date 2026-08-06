'use client'
import { useState } from 'react'
import { Plus, MapPin, Trash2, X, Check } from 'lucide-react'
import Button from '@/components/ui/Button'
import { FieldInput, FieldLabel } from '@/components/ui/Field'
import { toast } from '@/components/ui/Toast'
import { useI18n } from '@/store/i18nStore'

const EMPTY_ADDR = { label:'', firstName:'', lastName:'', phone:'', address:'', city:'', postalCode:'', province:'', isDefault:false }

function AddressModal({ initial, onSave, onClose }) {
  const { t } = useI18n()
  const [form, setForm] = useState(initial || EMPTY_ADDR)
  const set = (k, v) => setForm(f => ({...f, [k]: v}))

  const fields = [
    { k:'label', label:t('account.labelField'), placeholder:'Home', full:true },
    { k:'firstName', label:t('checkout.firstName'), placeholder:'John' },
    { k:'lastName', label:t('checkout.lastName'), placeholder:'Doe' },
    { k:'phone', label:t('checkout.phone'), placeholder:'08xxxxxxxxxx', full:true },
    { k:'address', label:t('checkout.address'), placeholder:'Jl. Sudirman No. 1', full:true },
    { k:'city', label:t('checkout.city'), placeholder:'Jakarta' },
    { k:'postalCode', label:t('checkout.postalCode'), placeholder:'12345' },
    { k:'province', label:t('checkout.province'), placeholder:'DKI Jakarta', full:true },
  ]

  return (
    <div className="fixed inset-0 z-[90] bg-text1/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="anim-rise bg-surface border border-text1 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-2.5 bg-text1 sticky top-0">
          <span className="arch-label text-bg">{initial?.id ? t('account.editAddr') : t('account.addNew')}</span>
          <button onClick={onClose} className="text-bg/70 hover:text-bg p-1"><X size={15}/></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="p-5">
          <div className="grid grid-cols-2 gap-3">
            {fields.map(({ k, label, placeholder, full }) => (
              <div key={k} className={full ? 'col-span-2' : ''}>
                <FieldLabel>{label}</FieldLabel>
                <FieldInput value={form[k]} onChange={e => set(k, e.target.value)} placeholder={placeholder}
                  required={['label','firstName','lastName','address','city','postalCode'].includes(k)}/>
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2.5 mt-4 cursor-pointer w-fit">
            <input type="checkbox" checked={form.isDefault} onChange={e => set('isDefault', e.target.checked)}
              className="w-4 h-4 accent-text1"/>
            <span className="text-[13px] text-text1">{t('account.setAsDefault')}</span>
          </label>
          <div className="flex gap-3 mt-5">
            <Button type="submit" className="flex-1">{t('account.saveAddress')}</Button>
            <Button variant="outline" type="button" onClick={onClose}>{t('account.cancel')}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AddressesPage() {
  const { t } = useI18n()
  const [addresses, setAddresses] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editAddr, setEditAddr] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const handleSave = (form) => {
    if (form.id) {
      setAddresses(prev => prev.map(a => a.id === form.id ? form : a))
      toast(t('account.addressUpdated'))
    } else {
      const newAddr = { ...form, id: `addr-${Date.now()}` }
      if (newAddr.isDefault) setAddresses(prev => [...prev.map(a => ({...a, isDefault:false})), newAddr])
      else setAddresses(prev => [...prev, newAddr])
      toast(t('account.addressAdded'))
    }
    setShowModal(false)
    setEditAddr(null)
  }

  const handleDelete = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id))
    setDeleteId(null)
    toast(t('account.addressRemoved'), 'error')
  }

  const handleSetDefault = (id) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })))
    toast(t('account.defaultUpdated'))
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="arch-label text-pink mb-1">{t('account.myAccount')}</p>
            <h1 className="font-display text-[32px] font-bold tracking-[-0.01em] text-text1">{t('account.addresses')}</h1>
          </div>
          <Button onClick={() => { setEditAddr(null); setShowModal(true) }}>
            <Plus size={13}/> {t('account.addAddress')}
          </Button>
        </div>

        {addresses.length === 0 ? (
          <div className="py-16 text-center border border-border bg-bg">
            <MapPin size={32} className="text-border mx-auto mb-3"/>
            <p className="text-[13px] text-text2 mb-4">{t('account.noAddresses')}</p>
            <Button variant="outline" onClick={() => setShowModal(true)}>{t('account.addFirst')}</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {addresses.map(addr => (
              <div key={addr.id} className={`border p-4 relative transition-all ${addr.isDefault ? 'border-text1 bg-bg' : 'border-border bg-surface hover:border-text1'}`}>
                {addr.isDefault && (
                  <span className="absolute top-3 right-3 arch-label bg-text1 text-bg px-2 py-0.5">{t('account.default')}</span>
                )}
                <p className="arch-label text-text1 mb-2">{addr.label}</p>
                <p className="text-[13px] font-medium text-text1">{addr.firstName} {addr.lastName}</p>
                <p className="text-[13px] text-text2">{addr.phone}</p>
                <p className="text-[13px] text-text2 mt-1">{addr.address}</p>
                <p className="text-[13px] text-text2">{addr.city}, {addr.postalCode}</p>
                <p className="text-[13px] text-text2">{addr.province}</p>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                  <Button variant="outline" size="sm" onClick={() => { setEditAddr(addr); setShowModal(true) }}>{t('account.edit')}</Button>
                  {!addr.isDefault && (
                    <Button variant="outline" size="sm" className="border-text1" onClick={() => handleSetDefault(addr.id)}>{t('account.setDefault')}</Button>
                  )}
                  <button onClick={() => setDeleteId(addr.id)} className="ml-auto text-text2/70 hover:text-red-600 transition-colors" aria-label={t('account.delete')}>
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddressModal
          initial={editAddr}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditAddr(null) }}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 z-[90] bg-text1/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="anim-rise bg-surface border border-text1 w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-2.5 bg-text1">
              <span className="arch-label text-bg">{t('account.deleteAddress')}</span>
              <button onClick={() => setDeleteId(null)} className="text-bg/70 hover:text-bg p-1"><X size={14}/></button>
            </div>
            <div className="p-6">
              <p className="text-[13px] text-text2 mb-6">{t('account.deleteSure')}</p>
              <div className="flex gap-3">
                <Button variant="danger" className="flex-1" onClick={() => handleDelete(deleteId)}>{t('account.delete')}</Button>
                <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>{t('account.cancel')}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
