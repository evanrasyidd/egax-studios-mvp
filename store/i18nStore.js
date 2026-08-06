'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { translations } from '@/constants/translations'

/**
 * Store bahasa (EN/ID). Persist ke localStorage dengan skipHydration
 * sama kayak store lain -- locale baru dibaca setelah rehydrate manual
 * (masuk daftar di hooks/useHydrated.js), supaya render server vs client
 * pertama selalu identik (default 'en').
 */
export const useI18nStore = create(
  persist(
    (set) => ({
      locale: 'en',
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'egax-i18n', skipHydration: true }
  )
)

/**
 * Hook i18n: { t, locale, setLocale }
 * t(path, vars) -- path titik, fallback ke EN, lalu fallback ke path itu
 * sendiri kalau key gak ketemu (biar gak nge-render undefined).
 * Interpolasi: t('catalog.count', { n: 5 }) -> "5 products"
 */
export function useI18n() {
  const locale = useI18nStore((s) => s.locale)
  const setLocale = useI18nStore((s) => s.setLocale)
  const dict = translations[locale] || translations.en

  const t = (path, vars) => {
    const keys = path.split('.')
    const resolve = (d) => keys.reduce((acc, key) => (acc && typeof acc === 'object' ? acc[key] : undefined), d)
    let value = resolve(dict)
    if (typeof value !== 'string') value = resolve(translations.en)
    if (typeof value !== 'string') return path
    return vars ? value.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m) : value
  }

  const productName = (p) => {
    if (!p) return ''
    return locale === 'id' && p.nameId ? p.nameId : p.name
  }

  const productDesc = (p) => {
    if (!p) return ''
    return locale === 'id' && p.descriptionId ? p.descriptionId : p.description
  }

  return { t, locale, setLocale, productName, productDesc }
}
