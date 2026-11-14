import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import MarqueeTicker from '@/components/layout/MarqueeTicker'
import CartDrawer from '@/components/cart/CartDrawer'
import SearchModal from '@/components/search/SearchModal'
import ToastContainer from '@/components/ui/Toast'
import AccountSidebar from '@/components/account/AccountSidebar'

export const metadata = {
  title: 'Account',
  description: 'Your EGAX Studios account, orders, wishlist, and addresses.',
  robots: { index: false, follow: false },
}

export default function AccountLayout({ children }) {
  return (
    <>
      <MarqueeTicker />
      <Navbar />
      <SearchModal />
      <CartDrawer />
      <ToastContainer />
      <main id="main" className="min-h-screen bg-surface px-6 py-10 md:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-10 md:flex-row">
            <AccountSidebar />
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
