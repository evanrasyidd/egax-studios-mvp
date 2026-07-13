'use client'
import { useEffect, useState } from 'react'
import { X, Check, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

let toastListeners = []
let toastId = 0
export function toast(message, type = 'success') {
  const id = ++toastId
  toastListeners.forEach(fn => fn({ id, message, type }))
  return id
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])
  useEffect(() => {
    const fn = (t) => {
      setToasts(p => [...p, t])
      setTimeout(() => setToasts(p => p.filter(x => x.id !== t.id)), 3000)
    }
    toastListeners.push(fn)
    return () => { toastListeners = toastListeners.filter(l => l !== fn) }
  }, [])
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className={cn('flex items-center gap-3 px-4 py-3 text-sm min-w-[260px] shadow-xl border',
          t.type === 'success' ? 'bg-surface border-pink text-text1' : 'bg-surface border-red-500 text-text1')}>
          {t.type === 'success' ? <Check size={13} className="text-pink shrink-0"/> : <AlertCircle size={13} className="text-red-600 shrink-0"/>}
          <span className="flex-1 text-[13px]">{t.message}</span>
          <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))} className="text-text2 hover:text-text1"><X size={12}/></button>
        </div>
      ))}
    </div>
  )
}
