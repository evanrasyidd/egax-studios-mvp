import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import MarqueeTicker from '@/components/layout/MarqueeTicker'
import CartDrawer from '@/components/cart/CartDrawer'
import SearchModal from '@/components/search/SearchModal'
import ToastContainer from '@/components/ui/Toast'
import AccountSidebar from '@/components/account/AccountSidebar'

export default function AccountLayout({ children }) {
  return (
    <>
      <MarqueeTicker />
      <Navbar />
      <SearchModal />
      <CartDrawer />
      <ToastContainer />
      <div className="min-h-screen bg-white px-6 md:px-10 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10">
            <AccountSidebar />
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
