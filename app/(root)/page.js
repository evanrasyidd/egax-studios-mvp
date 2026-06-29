import HeroSection from '@/components/sections/HeroSection'
import PreOrderSection from '@/components/sections/PreOrderSection'
import NewCollectionSection from '@/components/sections/NewCollectionSection'
import FeaturedCollectionSection from '@/components/sections/FeaturedCollectionSection'
import BestSellerSection from '@/components/sections/BestSellerSection'
import EditorialBanner from '@/components/sections/EditorialBanner'
import SocialCTA from '@/components/sections/SocialCTA'
import Newsletter from '@/components/sections/Newsletter'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PreOrderSection />
      <NewCollectionSection />
      <FeaturedCollectionSection />
      <BestSellerSection />
      <EditorialBanner />
      <SocialCTA />
      <Newsletter />
    </>
  )
}
