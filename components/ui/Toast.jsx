'use client'
import { useEffect, useState } from 'react'
import { X, Check, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/store/i18nStore'

let toastListeners = []
let toastId = 0
export function toast(message, type = 'success') {
  const id = ++toastId
  toastListeners.forEach(fn => fn({ id, message, type }))
  return id
}

export default function ToastContainer() {
  const { t } = useI18n()
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const fn = (item) => {
      setToasts(p => [...p, item])
      setTimeout(() => setToasts(p => p.filter(x => x.id !== item.id)), 3000)
    }
    toastListeners.push(fn)
    return () => { toastListeners = toastListeners.filter(l => l !== fn) }
  }, [])

  return (
    <div aria-live="polite" aria-atomic="false" className="fixed bottom-24 right-4 z-[200] flex max-w-[calc(100vw-2rem)] flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map(item => (
        <div
          key={item.id}
          role={item.type === 'success' ? 'status' : 'alert'}
          className={cn(
            'anim-toast corner-brackets flex min-w-[260px] max-w-[380px] items-center gap-3 border px-4 py-3 text-[12px]',
            item.type === 'success' ? 'border-text1 bg-surface text-text1' : 'border-red-700 bg-surface text-text1'
          )}
        >
          {item.type === 'success'
            ? <Check size={15} aria-hidden="true" className="shrink-0 text-text1" />
            : <AlertCircle size={15} aria-hidden="true" className="shrink-0 text-red-700" />}
          <span className="flex-1 leading-snug">{item.message}</span>
          <button
            type="button"
            onClick={() => setToasts(p => p.filter(x => x.id !== item.id))}
            aria-label={t('common.dismiss')}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-text2 transition-colors hover:text-text1"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  )
}
