import HeroSection from '../components/sections/HeroSection'
import TrustRibbon from '../components/sections/TrustRibbon'
import DiscoverSection from '../components/sections/DiscoverSection'
import FeaturedStays from '../components/sections/FeaturedStays'
import CarRentalsSection from '../components/sections/CarRentalsSection'
import HowItWorks from '../components/sections/HowItWorks'
import CommunityCTA from '../components/sections/CommunityCTA'
import { usePageMeta } from '../hooks/usePageMeta'

export default function Home() {
  usePageMeta({
    title: 'Discover Africa, One Stay at a Time',
    description: 'Curated stays, car rentals, and local experiences across Africa — chosen by people who call Africa home.',
  })
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
