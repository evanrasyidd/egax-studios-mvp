'use client'
import { useEffect } from 'react'
import { useI18nStore } from '@/store/i18nStore'

/** Sinkronkan atribut lang di <html> dengan locale aktif. */
export default function LanguageSync() {
  const locale = useI18nStore((s) => s.locale)
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  return null
}
