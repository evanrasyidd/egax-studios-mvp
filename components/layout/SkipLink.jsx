'use client'
import { useI18n } from '@/store/i18nStore'

export default function SkipLink() {
  const { t } = useI18n()
  return <a href="#main" className="skip-link">{t('common.skip')}</a>
}
