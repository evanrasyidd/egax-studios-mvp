'use client'
import { useI18n } from '@/store/i18nStore'
import WishlistGrid from '@/components/account/WishlistGrid'
export default function WishlistPage() {
  const { t } = useI18n()
  return (
    <div>
      <p className="arch-label text-pink mb-1">{t('account.myAccount')}</p>
      <h1 className="font-display text-[32px] font-bold tracking-[-0.01em] text-text1 mb-6">{t('account.wishlist')}</h1>
      <WishlistGrid/>
    </div>
  )
}
