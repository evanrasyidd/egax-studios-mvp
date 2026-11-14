import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import MarqueeTicker from '@/components/layout/MarqueeTicker'
import CartDrawer from '@/components/cart/CartDrawer'
import SearchModal from '@/components/search/SearchModal'
import ToastContainer from '@/components/ui/Toast'

export default function ShopLayout({ children }) {
  return (
    <>
      <MarqueeTicker />
      <Navbar />
      <SearchModal />
      <CartDrawer />
      <ToastContainer />
      <main id="main">{children}</main>
      <Footer />
    </>
  )
}
