import HeroSection from '../components/sections/HeroSection'
import TrustRibbon from '../components/sections/TrustRibbon'
import DiscoverSection from '../components/sections/DiscoverSection'
import FeaturedStays from '../components/sections/FeaturedStays'
import CarRentalsSection from '../components/sections/CarRentalsSection'
import HowItWorks from '../components/sections/HowItWorks'
import CommunityCTA from '../components/sections/CommunityCTA'

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustRibbon />
      <DiscoverSection />
      <FeaturedStays />
      <CarRentalsSection />
      <HowItWorks />
      <CommunityCTA />
    </>
  )
}
