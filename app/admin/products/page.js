'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Check } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import { useHydrated } from '@/hooks/useHydrated'
import { formatPrice } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'

const EMPTY = { name:'', category:'Tops', price:'', originalPrice:'', description:'', sizes:['S','M','L','XL'], preOrder:false, featured:false, bestSeller:false, newCollection:false, soldOut:false }

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[90] bg-bg/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border-4 border-pink w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ boxShadow:'8px 8px 0 #FF2D9B' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b-4 border-border sticky top-0 bg-surface">
          <h2 className="font-pixel text-[10px] text-pink">{title}</h2>
          <button onClick={onClose} className="text-text2 hover:text-pink"><X size={14} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

function ProductForm({ initial, onSubmit, onClose }) {
  const [form, setForm] = useState(initial)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleSize = (s) => {
    const sizes = form.sizes.includes(s) ? form.sizes.filter(x=>x!==s) : [...form.sizes, s]
    set('sizes', sizes)
  }
  const allSizes = ['XS','S','M','L','XL','XXL','One Size','28','30','32','34','36']
  const cats = ['Tops','Hoodie','Pants','Shirt','Accessories','Essentials']
  const bools = [
    { k:'preOrder', label:'PRE ORDER' },
    { k:'featured', label:'FEATURED' },
    { k:'bestSeller', label:'BEST SELLER' },
    { k:'newCollection', label:'NEW COLLECTION' },
    { k:'soldOut', label:'SOLD OUT' },
  ]
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div>
        <label className="font-pixel text-[7px] text-text2 block mb-1">PRODUCT NAME *</label>
        <input required value={form.name} onChange={e=>set('name',e.target.value)}
          className="w-full bg-bg border-2 border-border text-text1 font-body text-sm px-3 py-2 outline-none focus:border-pink" placeholder="Product name" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-pixel text-[7px] text-text2 block mb-1">CATEGORY *</label>
          <select value={form.category} onChange={e=>set('category',e.target.value)}
            className="w-full bg-bg border-2 border-border text-text1 font-body text-sm px-3 py-2 outline-none focus:border-pink">
            {cats.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="font-pixel text-[7px] text-text2 block mb-1">PRICE (IDR) *</label>
          <input required type="number" value={form.price} onChange={e=>set('price',Number(e.target.value))}
            className="w-full bg-bg border-2 border-border text-text1 font-body text-sm px-3 py-2 outline-none focus:border-pink" placeholder="385000" />
        </div>
      </div>
      <div>
        <label className="font-pixel text-[7px] text-text2 block mb-1">ORIGINAL PRICE (for sale)</label>
        <input type="number" value={form.originalPrice||''} onChange={e=>set('originalPrice',e.target.value?Number(e.target.value):null)}
          className="w-full bg-bg border-2 border-border text-text1 font-body text-sm px-3 py-2 outline-none focus:border-pink" placeholder="Leave empty if no sale" />
      </div>
      <div>
        <label className="font-pixel text-[7px] text-text2 block mb-1">DESCRIPTION</label>
        <textarea value={form.description} onChange={e=>set('description',e.target.value)} rows={3}
          className="w-full bg-bg border-2 border-border text-text1 font-body text-sm px-3 py-2 outline-none focus:border-pink resize-none" />
      </div>
      <div>
        <label className="font-pixel text-[7px] text-text2 block mb-2">SIZES</label>
        <div className="flex flex-wrap gap-1">
          {allSizes.map(s => (
            <button key={s} type="button" onClick={() => toggleSize(s)}
              className={`font-pixel text-[7px] px-2 py-1 border-2 transition-all ${form.sizes.includes(s) ? 'bg-pink text-black border-black' : 'bg-bg text-text2 border-border hover:border-pink'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="font-pixel text-[7px] text-text2 block mb-2">FLAGS</label>
        <div className="grid grid-cols-2 gap-2">
          {bools.map(({ k, label }) => (
            <button key={k} type="button" onClick={() => set(k, !form[k])}
              className={`flex items-center gap-2 font-pixel text-[7px] px-3 py-2 border-2 transition-all ${form[k] ? 'bg-pink text-black border-black' : 'bg-bg text-text2 border-border hover:border-pink'}`}>
              {form[k] ? <Check size={10}/> : <X size={10}/>} {label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 font-pixel text-[8px] bg-pink text-black border-2 border-black py-2.5 pixel-btn">SAVE PRODUCT</button>
        <button type="button" onClick={onClose} className="font-pixel text-[8px] text-text2 border-2 border-border px-5 py-2.5 hover:border-pink hover:text-pink">CANCEL</button>
      </div>
    </form>
  )
}

export default function AdminProductsPage() {
  const hydrated = useHydrated()
  const { products: productsRaw, addProduct, updateProduct, deleteProduct, toggleSoldOut, togglePreOrder } = useAdminStore()
  const products = hydrated ? productsRaw : []
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'all' || p.category === catFilter
    return matchSearch && matchCat
  })

  const cats = ['all','Tops','Hoodie','Pants','Shirt','Accessories','Essentials']

  const handleAdd = (form) => {
    addProduct(form)
    setShowAdd(false)
    toast('Product added! ★')
  }

  const handleEdit = (form) => {
    updateProduct(editId, form)
    setEditId(null)
    toast('Product updated! ★')
  }

  const handleDelete = (id) => {
    deleteProduct(id)
    setConfirmDelete(null)
    toast('Product deleted.', 'error')
  }

  const editProduct = products.find(p => p.id === editId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="font-pixel text-[8px] text-pink mb-1">ADMIN PANEL</p>
          <h1 className="font-pixel text-[16px] text-text1">PRODUCTS.EXE</h1>
          <p className="font-pixel text-[7px] text-text2 mt-1">{products.length} PRODUCTS TOTAL</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 font-pixel text-[8px] bg-pink text-black border-2 border-black px-5 py-2.5 pixel-btn w-fit">
          <Plus size={12} /> ADD PRODUCT
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="SEARCH PRODUCTS..."
          className="flex-1 bg-surface border-2 border-border text-text1 font-pixel text-[8px] px-4 py-2.5 outline-none focus:border-pink" />
        <div className="flex gap-1 flex-wrap">
          {cats.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`font-pixel text-[7px] px-3 py-2 border-2 transition-all ${catFilter===c ? 'bg-pink text-black border-black' : 'bg-surface text-text2 border-border hover:border-pink'}`}>
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border-2 border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-border bg-surface">
              {['PRODUCT','CATEGORY','PRICE','STATUS','FLAGS','ACTIONS'].map(h => (
                <th key={h} className="text-left py-3 px-4 font-pixel text-[7px] text-pink">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-border">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-surface/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-10 shrink-0 flex items-center justify-center border-2 border-border bg-card">
                      <span className="font-pixel text-[7px] text-pink">{p.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-body text-[13px] font-medium text-text1">{p.name}</p>
                      <p className="font-pixel text-[7px] text-text2">{p.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-pixel text-[7px] text-text2">{p.category.toUpperCase()}</td>
                <td className="py-3 px-4">
                  <span className="font-pixel text-[8px] text-pink">{formatPrice(p.price)}</span>
                  {p.originalPrice && <p className="font-pixel text-[7px] text-text2 line-through">{formatPrice(p.originalPrice)}</p>}
                </td>
                <td className="py-3 px-4">
                  <span className={`font-pixel text-[7px] px-2 py-1 border-2 ${p.soldOut ? 'border-red-500 text-red-400 bg-red-900/20' : 'border-green-600 text-green-400 bg-green-900/20'}`}>
                    {p.soldOut ? 'SOLD OUT' : 'ACTIVE'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {p.preOrder && <span className="font-pixel text-[6px] border border-text1 px-1 text-text1">PO</span>}
                    {p.featured && <span className="font-pixel text-[6px] border border-pink px-1 text-pink">FT</span>}
                    {p.bestSeller && <span className="font-pixel text-[6px] border border-yellow-400 px-1 text-yellow-400">BS</span>}
                    {p.newCollection && <span className="font-pixel text-[6px] border border-green-400 px-1 text-green-400">NC</span>}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditId(p.id)} title="Edit"
                      className="w-7 h-7 flex items-center justify-center border-2 border-border text-text2 hover:border-pink hover:text-pink transition-all">
                      <Pencil size={11} />
                    </button>
                    <button onClick={() => toggleSoldOut(p.id)} title="Toggle Sold Out"
                      className="w-7 h-7 flex items-center justify-center border-2 border-border text-text2 hover:border-yellow-400 hover:text-yellow-400 transition-all">
                      {p.soldOut ? <ToggleLeft size={11}/> : <ToggleRight size={11}/>}
                    </button>
                    <button onClick={() => setConfirmDelete(p.id)} title="Delete"
                      className="w-7 h-7 flex items-center justify-center border-2 border-border text-text2 hover:border-red-400 hover:text-red-400 transition-all">
                      <Trash2 size={11} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-10 text-center"><p className="font-pixel text-[8px] text-text2">NO PRODUCTS FOUND.</p></div>
        )}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <Modal title="★ ADD NEW PRODUCT ★" onClose={() => setShowAdd(false)}>
          <ProductForm initial={EMPTY} onSubmit={handleAdd} onClose={() => setShowAdd(false)} />
        </Modal>
      )}

      {/* Edit Modal */}
      {editId && editProduct && (
        <Modal title="★ EDIT PRODUCT ★" onClose={() => setEditId(null)}>
          <ProductForm initial={editProduct} onSubmit={handleEdit} onClose={() => setEditId(null)} />
        </Modal>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[90] bg-bg/80 flex items-center justify-center p-4">
          <div className="bg-surface border-4 border-red-500 p-6 max-w-sm w-full text-center" style={{ boxShadow:'8px 8px 0 #ef4444' }}>
            <p className="font-pixel text-[10px] text-red-400 mb-2">⚠ CONFIRM DELETE</p>
            <p className="font-body text-sm text-text2 mb-6">This action cannot be undone. Product will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 font-pixel text-[8px] bg-red-600 text-white border-2 border-red-900 py-2.5 pixel-btn">DELETE</button>
              <button onClick={() => setConfirmDelete(null)} className="flex-1 font-pixel text-[8px] text-text2 border-2 border-border py-2.5 hover:border-pink">CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
