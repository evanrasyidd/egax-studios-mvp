import WishlistGrid from '@/components/account/WishlistGrid'
export default function WishlistPage() {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-pink mb-1">My Account</p>
      <h1 className="font-display text-[32px] tracking-widest text-bg mb-6">Wishlist</h1>
      <WishlistGrid/>
    </div>
  )
}
