import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase, type Property } from '../../lib/supabase'
import ListingCard, { ListingCardSkeleton } from '../ui/ListingCard'
import ScrollReveal from '../ui/ScrollReveal'

export default function FeaturedStays() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading,    setLoading]    = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(8)
      setProperties(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.offsetWidth * 0.75
    scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
  }

  return (
    <section className="section-py bg-ivory-100">
      <div className="container-site">

        {/* Section header */}
        <ScrollReveal className="flex items-end justify-between mb-12 md:mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="section-line" />
              <p className="eyebrow">Curated Selection</p>
            </div>
            <h2 className="section-heading-xl">
              Handpicked{' '}
              <em className="not-italic text-gradient-warm">Stays</em>
            </h2>
            <p className="font-body text-earth-500 mt-4 max-w-md leading-[1.72]"
              style={{ fontSize: 'clamp(0.9375rem, 1.8vw, 1.0625rem)' }}>
              Chosen by our local experts — from riverside lodges to urban penthouses across Africa.
            </p>
          </div>

          {/* Carousel controls — premium */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => scroll('left')}
              className="group w-11 h-11 rounded-full flex items-center justify-center transition-all duration-250"
              style={{
                border: '1.5px solid var(--color-ivory-300)',
                color: 'var(--color-earth-500)',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--color-earth-900)'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-earth-900)'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#fff'
                ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.06)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-ivory-300)'
                ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-earth-500)'
                ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
              }}
            >
              <ChevronLeft size={17} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-250"
              style={{
                background: 'var(--color-earth-900)',
                color: '#fff',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--color-terracotta-600)'
                ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.06)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--color-earth-900)'
                ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
              }}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </ScrollReveal>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => <ListingCardSkeleton key={i} />)}
          </div>
        ) : properties.length > 0 ? (
          <div
            ref={scrollRef}
            className="carousel-track no-scrollbar"
            style={{ paddingBottom: '4px' }}
          >
            {properties.map((p, i) => (
              <div key={p.id} className="w-72 sm:w-80 xl:w-[22rem] shrink-0">
                <ScrollReveal delay={i * 70}>
                  <ListingCard property={p} />
                </ScrollReveal>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-body text-earth-400">No featured stays yet. Check back soon.</p>
          </div>
        )}

        {/* CTA */}
        <ScrollReveal className="flex justify-center mt-12">
          <Link to="/listings" className="btn-secondary inline-flex">
            Explore All Stays
            <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
