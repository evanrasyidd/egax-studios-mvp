'use client'
import { useState } from 'react'
import { Plus, MapPin, Trash2, X, Check } from 'lucide-react'
import { toast } from '@/components/ui/Toast'

const EMPTY_ADDR = { label:'', firstName:'', lastName:'', phone:'', address:'', city:'', postalCode:'', province:'', isDefault:false }

function AddressModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_ADDR)
  const set = (k, v) => setForm(f => ({...f, [k]: v}))

  const fields = [
    { k:'label', label:'Label (e.g. Home, Office)', placeholder:'Home', full:true },
    { k:'firstName', label:'First Name', placeholder:'John' },
    { k:'lastName', label:'Last Name', placeholder:'Doe' },
    { k:'phone', label:'Phone', placeholder:'08xxxxxxxxxx', full:true },
    { k:'address', label:'Street Address', placeholder:'Jl. Sudirman No. 1', full:true },
    { k:'city', label:'City', placeholder:'Jakarta' },
    { k:'postalCode', label:'Postal Code', placeholder:'12345' },
    { k:'province', label:'Province', placeholder:'DKI Jakarta', full:true },
  ]

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="font-semibold text-text1 text-[15px]">{initial?.id ? 'Edit Address' : 'Add New Address'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-text1 p-1"><X size={16}/></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="p-5">
          <div className="grid grid-cols-2 gap-3">
            {fields.map(({ k, label, placeholder, full }) => (
              <div key={k} className={full ? 'col-span-2' : ''}>
                <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 block mb-1">{label}</label>
                <input value={form[k]} onChange={e => set(k, e.target.value)} placeholder={placeholder}
                  required={['label','firstName','lastName','address','city','postalCode'].includes(k)}
                  className="w-full border border-gray-200 text-text1 text-sm px-3 py-2.5 outline-none focus:border-pink transition-colors font-body"/>
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input type="checkbox" checked={form.isDefault} onChange={e => set('isDefault', e.target.checked)} className="accent-pink"/>
            <span className="text-[13px] text-gray-600">Set as default address</span>
          </label>
          <div className="flex gap-3 mt-5">
            <button type="submit" className="flex-1 bg-text1 text-white text-[11px] font-semibold uppercase tracking-widest py-3 hover:bg-pink transition-colors">
              Save Address
            </button>
            <button type="button" onClick={onClose} className="border border-gray-200 text-text1 text-[11px] font-semibold uppercase tracking-widest px-6 py-3 hover:border-text1 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editAddr, setEditAddr] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const handleSave = (form) => {
    if (form.id) {
      setAddresses(prev => prev.map(a => a.id === form.id ? form : a))
      toast('Address updated!')
    } else {
      const newAddr = { ...form, id: `addr-${Date.now()}` }
      if (newAddr.isDefault) setAddresses(prev => [...prev.map(a => ({...a, isDefault:false})), newAddr])
      else setAddresses(prev => [...prev, newAddr])
      toast('Address added!')
    }
    setShowModal(false)
    setEditAddr(null)
  }

  const handleDelete = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id))
    setDeleteId(null)
    toast('Address removed.', 'error')
  }

  const handleSetDefault = (id) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })))
    toast('Default address updated!')
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-pink mb-1">My Account</p>
            <h1 className="font-display text-[32px] tracking-widest text-text1">Addresses</h1>
          </div>
          <button onClick={() => { setEditAddr(null); setShowModal(true) }}
            className="flex items-center gap-2 bg-text1 text-white text-[11px] font-semibold uppercase tracking-widest px-5 py-2.5 hover:bg-pink transition-colors">
            <Plus size={13}/> Add Address
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="py-16 text-center border border-gray-200">
            <MapPin size={32} className="text-gray-200 mx-auto mb-3"/>
            <p className="text-[13px] text-gray-400 mb-4">No saved addresses yet.</p>
            <button onClick={() => setShowModal(true)}
              className="text-[11px] font-semibold uppercase tracking-widest text-text1 border border-gray-200 px-5 py-2.5 hover:bg-text1 hover:text-white transition-all">
              + Add your first address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {addresses.map(addr => (
              <div key={addr.id} className={`border p-4 relative transition-all ${addr.isDefault ? 'border-pink bg-pink/5' : 'border-gray-200 hover:border-gray-300'}`}>
                {addr.isDefault && (
                  <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-widest bg-pink text-black px-2 py-0.5">Default</span>
                )}
                <p className="text-[11px] font-bold uppercase tracking-widest text-text1 mb-2">{addr.label}</p>
                <p className="text-[13px] text-gray-700 font-medium">{addr.firstName} {addr.lastName}</p>
                <p className="text-[13px] text-gray-500">{addr.phone}</p>
                <p className="text-[13px] text-gray-500 mt-1">{addr.address}</p>
                <p className="text-[13px] text-gray-500">{addr.city}, {addr.postalCode}</p>
                <p className="text-[13px] text-gray-500">{addr.province}</p>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button onClick={() => { setEditAddr(addr); setShowModal(true) }}
                    className="text-[11px] font-semibold uppercase tracking-widest text-text1 border border-gray-200 px-3 py-1.5 hover:border-text1 transition-colors">
                    Edit
                  </button>
                  {!addr.isDefault && (
                    <button onClick={() => handleSetDefault(addr.id)}
                      className="text-[11px] font-semibold uppercase tracking-widest text-pink border border-pink/30 px-3 py-1.5 hover:bg-pink hover:text-black transition-colors">
                      Set Default
                    </button>
                  )}
                  <button onClick={() => setDeleteId(addr.id)} className="ml-auto text-gray-300 hover:text-red-600 transition-colors">
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
        <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-semibold text-text1 text-[15px] mb-2">Delete Address?</h3>
            <p className="text-[13px] text-gray-500 mb-6">This address will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-600 text-white text-[11px] font-semibold uppercase tracking-widest py-2.5 hover:bg-red-700 transition-colors">Delete</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-text1 text-[11px] font-semibold uppercase tracking-widest py-2.5 hover:border-text1 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
