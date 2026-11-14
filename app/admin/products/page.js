'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Check } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import { useHydrated } from '@/hooks/useHydrated'
import { formatPrice } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'
import Button from '@/components/ui/Button'
import { FieldInput, FieldLabel, FieldSelect, FieldTextarea } from '@/components/ui/Field'
import { useI18n } from '@/store/i18nStore'

const EMPTY = { name:'', nameId:'', category:'Tops', price:'', originalPrice:'', description:'', descriptionId:'', sizes:['S','M','L','XL'], stock:{}, preOrder:false, featured:false, bestSeller:false, newCollection:false, soldOut:false }

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[90] bg-text1/50 flex items-center justify-center p-4">
      <div className="bg-surface border border-text1 w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ boxShadow:'0 8px 24px rgba(35,33,27,0.16)' }}>
        <div className="flex items-center justify-between px-5 py-2.5 bg-text1 sticky top-0">
          <span className="arch-label text-bg">{title}</span>
          <button onClick={onClose} className="text-text2 hover:text-pink"><X size={14} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

function ProductForm({ initial, onSubmit, onClose }) {
  const { t } = useI18n()
  const [form, setForm] = useState(initial)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleSize = (s) => {
    const sizes = form.sizes.includes(s) ? form.sizes.filter(x=>x!==s) : [...form.sizes, s]
    set('sizes', sizes)
  }
  const setStock = (s, v) => set('stock', { ...(form.stock || {}), [s]: v })
  const allSizes = ['XS','S','M','L','XL','XXL','One Size','28','30','32','34','36']
  const cats = ['Jacket','Tops','Shirt','Pants','Essentials','Accessories']
  const bools = [
    { k:'preOrder', label: t('admin.flagPreOrder') },
    { k:'featured', label: t('admin.flagFeatured') },
    { k:'bestSeller', label: t('admin.flagBestSeller') },
    { k:'newCollection', label: t('admin.flagNewCollection') },
    { k:'soldOut', label: t('admin.flagSoldOut') },
  ]
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>{t('admin.productName')}</FieldLabel>
          <FieldInput required value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Product name" />
        </div>
        <div>
          <FieldLabel>{t('admin.productNameId')}</FieldLabel>
          <FieldInput value={form.nameId || ''} onChange={e=>set('nameId',e.target.value)} placeholder="Nama Produk" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>{t('admin.categoryLabel')}</FieldLabel>
          <FieldSelect value={form.category} onChange={e=>set('category',e.target.value)}>
            {cats.map(c=><option key={c} value={c}>{c}</option>)}
          </FieldSelect>
        </div>
        <div>
          <FieldLabel>{t('admin.priceLabel')}</FieldLabel>
          <FieldInput required type="number" value={form.price} onChange={e=>set('price',Number(e.target.value))} placeholder="385000" />
        </div>
      </div>
      <div>
        <FieldLabel>{t('admin.originalPriceLabel')}</FieldLabel>
        <FieldInput type="number" value={form.originalPrice||''} onChange={e=>set('originalPrice',e.target.value?Number(e.target.value):null)} placeholder={t('admin.origPriceHint')} />
      </div>
      <div>
        <FieldLabel>{t('admin.descriptionLabel')}</FieldLabel>
        <FieldTextarea value={form.description} onChange={e=>set('description',e.target.value)} rows={3} />
      </div>
      <div>
        <FieldLabel>{t('admin.descriptionIdLabel')}</FieldLabel>
        <FieldTextarea value={form.descriptionId || ''} onChange={e=>set('descriptionId',e.target.value)} rows={3} />
      </div>
      <div>
        <FieldLabel className="mb-2">{t('admin.sizesLabel')}</FieldLabel>
        <div className="flex flex-wrap gap-1">
          {allSizes.map(s => (
            <button key={s} type="button" onClick={() => toggleSize(s)}
              className={`font-mono text-[11px] font-medium px-2.5 py-1.5 border transition-colors ${form.sizes.includes(s) ? 'bg-text1 text-bg border-text1' : 'bg-bg text-text2 border-border hover:border-text1'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel className="mb-2">{t('admin.stockLabel')}</FieldLabel>
        <div className="flex flex-wrap gap-1.5">
          {form.sizes.length === 0 && <p className="font-mono text-[11px] text-text2">{t('admin.stockHint')}</p>}
          {form.sizes.map(s => (
            <label key={s} className="flex items-center gap-1.5 border border-border bg-bg px-2 py-1">
              <span className="font-mono text-[11px] font-medium text-text2">{s}</span>
              <input type="number" min={0} value={form.stock?.[s] ?? ''} placeholder="0"
                onChange={e => setStock(s, Math.max(0, Number(e.target.value)))}
                className="w-11 bg-transparent text-text1 font-mono text-[11px] py-0.5 text-center placeholder:text-text2" />
            </label>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel className="mb-2">{t('admin.flagsLabel')}</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {bools.map(({ k, label }) => (
            <button key={k} type="button" onClick={() => set(k, !form[k])}
              className={`flex items-center gap-2 font-mono text-[11px] font-medium px-3 py-2 border transition-colors ${form[k] ? 'bg-text1 text-bg border-text1' : 'bg-bg text-text2 border-border hover:border-text1'}`}>
              {form[k] ? <Check size={10}/> : <X size={10}/>} {label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1">{t('admin.saveProduct')}</Button>
        <Button variant="outline" type="button" onClick={onClose}>{t('admin.cancel')}</Button>
      </div>
    </form>
  )
}

export default function AdminProductsPage() {
  const { t, productName } = useI18n()
  const hydrated = useHydrated()
  const { products: productsRaw, addProduct, updateProduct, deleteProduct, toggleSoldOut, togglePreOrder } = useAdminStore()
  const products = hydrated ? productsRaw : []
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = products.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = p.name.toLowerCase().includes(q) || (p.nameId || '').toLowerCase().includes(q)
    const matchCat = catFilter === 'all' || p.category === catFilter
    return matchSearch && matchCat
  })

  const cats = ['all','Jacket','Tops','Shirt','Pants','Essentials','Accessories']

  const handleAdd = (form) => {
    addProduct(form)
    setShowAdd(false)
    toast(t('admin.productAdded'))
  }

  const handleEdit = (form) => {
    updateProduct(editId, form)
    setEditId(null)
    toast(t('admin.productUpdated'))
  }

  const handleDelete = (id) => {
    deleteProduct(id)
    setConfirmDelete(null)
    toast(t('admin.productDeleted'), 'error')
  }

  const editProduct = products.find(p => p.id === editId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="arch-label text-pink mb-1">{t('admin.panel')}</p>
          <h1 className="font-display text-[18px] font-bold tracking-[-0.01em] text-text1">{t('admin.productsTitle')}</h1>
          <p className="font-mono text-[11px] text-text2 mt-1">{t('admin.productsTotal', { n: products.length })}</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus size={13} /> {t('admin.addProduct')}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t('admin.searchProducts')}
          className="flex-1 bg-bg border border-border text-text1 font-mono text-[11px] px-3.5 py-2.5 focus:border-text1 placeholder:text-text2" />
        <div className="flex gap-1 flex-wrap">
          {cats.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`font-mono text-[11px] font-medium px-3 py-2 border transition-colors ${catFilter===c ? 'bg-text1 text-bg border-text1' : 'bg-surface text-text2 border-border hover:border-text1'}`}>
              {c === 'all' ? t('cat.all').toUpperCase() : t(`cat.${c.toLowerCase()}`).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface">
              {[t('admin.colProduct'),t('admin.colCategory'),t('admin.colPrice'),t('admin.colStatus'),t('admin.colFlags'),t('admin.colActions')].map(h => (
                <th key={h} className="text-left py-3 px-4 font-mono text-[11px] font-medium text-pink">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-surface/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-10 shrink-0 flex items-center justify-center border border-border bg-card">
                      <span className="font-mono text-[11px] font-medium text-pink">{productName(p)[0]}</span>
                    </div>
                    <div>
                      <p className="font-body text-[13px] font-medium text-text1">{productName(p)}</p>
                      <p className="font-body font-bold text-[11px] text-text2">{p.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-text2">{p.category.toUpperCase()}</td>
                <td className="py-3 px-4">
                  <span className="font-mono text-[11px] font-medium text-pink">{formatPrice(p.price)}</span>
                  {p.originalPrice && <p className="font-body font-bold text-[11px] text-text2 line-through">{formatPrice(p.originalPrice)}</p>}
                </td>
                <td className="py-3 px-4">
                  <span className={`font-mono text-[11px] font-medium px-2 py-1 border ${p.soldOut ? 'border-red-500 text-red-700 bg-red-100' : 'border-green-600 text-green-700 bg-green-100'}`}>
                    {p.soldOut ? t('admin.statusSoldOut') : t('admin.statusActive')}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {p.preOrder && <span className="font-mono text-[11px] font-medium border border-text1 px-1 text-text1">PO</span>}
                    {p.featured && <span className="font-mono text-[11px] font-medium border border-pink px-1 text-pink">FT</span>}
                    {p.bestSeller && <span className="font-mono text-[11px] font-medium border border-border px-1 text-text2">BS</span>}
                    {p.newCollection && <span className="font-mono text-[11px] font-medium border border-green-600 px-1 text-green-700">NC</span>}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditId(p.id)} title={t('admin.edit')}
                      className="w-7 h-7 flex items-center justify-center border border-border text-text2 hover:border-pink hover:text-pink transition-colors">
                      <Pencil size={11} />
                    </button>
                    <button onClick={() => toggleSoldOut(p.id)} title={t('admin.toggleSoldOut')}
                      className="w-7 h-7 flex items-center justify-center border border-border text-text2 hover:border-yellow-400 hover:text-yellow-400 transition-colors">
                      {p.soldOut ? <ToggleLeft size={11}/> : <ToggleRight size={11}/>}
                    </button>
                    <button onClick={() => setConfirmDelete(p.id)} title={t('admin.deleteBtn')}
                      className="w-7 h-7 flex items-center justify-center border border-border text-text2 hover:border-red-400 hover:text-red-700 transition-colors">
                      <Trash2 size={11} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-10 text-center"><p className="font-mono text-[11px] text-text2">{t('admin.noProductsFound')}</p></div>
        )}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <Modal title={t('admin.addProductModal')} onClose={() => setShowAdd(false)}>
          <ProductForm initial={EMPTY} onSubmit={handleAdd} onClose={() => setShowAdd(false)} />
        </Modal>
      )}

      {/* Edit Modal */}
      {editId && editProduct && (
        <Modal title={t('admin.editProductModal')} onClose={() => setEditId(null)}>
          <ProductForm initial={editProduct} onSubmit={handleEdit} onClose={() => setEditId(null)} />
        </Modal>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[90] bg-text1/50 flex items-center justify-center p-4">
          <div className="bg-surface border border-red-600 p-6 max-w-sm w-full text-center" style={{ boxShadow:'0 8px 24px rgba(220,38,38,0.18)' }}>
            <p className="font-mono text-[11px] font-medium text-red-700 mb-2">{t('admin.confirmDelete')}</p>
            <p className="font-body text-sm text-text2 mb-6">{t('admin.deleteWarn')}</p>
            <div className="flex gap-3">
              <Button variant="danger" className="flex-1" onClick={() => handleDelete(confirmDelete)}>{t('admin.delete')}</Button>
              <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(null)}>{t('admin.cancel')}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
