import HeroSection from '@/components/sections/HeroSection'
import HomeStats from '@/components/sections/HomeStats'
import CategoryIndex from '@/components/sections/CategoryIndex'
import PreOrderSection from '@/components/sections/PreOrderSection'
import NewCollectionSection from '@/components/sections/NewCollectionSection'
import FeaturedCollectionSection from '@/components/sections/FeaturedCollectionSection'
import BestSellerSection from '@/components/sections/BestSellerSection'
import ScrubReel from '@/components/sections/ScrubReel'
import StackShowcase from '@/components/sections/StackShowcase'
import EditorialBanner from '@/components/sections/EditorialBanner'
import SocialCTA from '@/components/sections/SocialCTA'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HomeStats />
      <CategoryIndex />
      <PreOrderSection />
      <NewCollectionSection />
      <FeaturedCollectionSection />
      <BestSellerSection />
      <ScrubReel />
      <StackShowcase />
      <EditorialBanner />
      <SocialCTA />
    </>
  )
}
