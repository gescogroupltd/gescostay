import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { supabase, type Car } from '../../lib/supabase'
import CarCard, { CarCardSkeleton } from '../ui/CarCard'
import ScrollReveal from '../ui/ScrollReveal'

const features = [
  'Daily, weekly & monthly rates',
  'Fully insured & roadworthy',
  'Pick-up & drop-off flexibility',
  'Verified local owners',
]

export default function CarRentalsSection() {
  const [cars,    setCars]    = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('cars')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(4)
      .then(({ data }) => { setCars(data || []); setLoading(false) })
  }, [])

  return (
    <section
      className="section-py overflow-hidden"
      style={{ background: 'linear-gradient(170deg, #1E1208 0%, #2F1E10 60%, #1A1008 100%)' }}
    >
      {/* Fond décoratif radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 80% at 20% 50%, rgba(188,95,56,0.07) 0%, transparent 65%)' }}
      />

      <div className="container-site relative">
        <div className="grid lg:grid-cols-5 gap-14 lg:gap-18 items-start">

          {/* Left — pitch éditorial */}
          <div className="lg:col-span-2">
            <ScrollReveal direction="left">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-px" style={{ background: '#BC5F38' }} />
                <p className="font-body text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-terracotta-400">
                  On the Road
                </p>
              </div>

              <h2
                className="font-display font-semibold text-white mb-5 leading-[1.10]"
                style={{ fontSize: 'clamp(2rem, 4vw, 2.875rem)', letterSpacing: '-0.03em' }}
              >
                Explore at your own{' '}
                <em
                  className="not-italic"
                  style={{
                    color: 'transparent',
                    backgroundImage: 'linear-gradient(130deg, #D9BE72 0%, #C8A84E 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                  }}
                >
                  pace
                </em>
              </h2>

              <p
                className="font-body leading-[1.78] mb-9"
                style={{ fontSize: '0.9375rem', color: 'rgba(210,198,186,0.60)' }}
              >
                From sleek city sedans to rugged 4×4s for the savannah —
                rent trusted vehicles from verified local owners across the continent.
              </p>

              {/* Feature list */}
              <div className="space-y-3.5 mb-10">
                {features.map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center"
                      style={{ background: 'rgba(188,95,56,0.18)', border: '1px solid rgba(188,95,56,0.28)' }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-terracotta-400" />
                    </div>
                    <span className="font-body text-[0.875rem]" style={{ color: 'rgba(210,198,186,0.70)' }}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                to="/cars"
                className="btn-primary inline-flex"
              >
                Browse All Vehicles
                <ArrowRight size={16} />
              </Link>
            </ScrollReveal>
          </div>

          {/* Right — cars grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <CarCardSkeleton key={i} />)}
              </div>
            ) : cars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cars.map((car, i) => (
                  <ScrollReveal key={car.id} delay={i * 80}>
                    <CarCard car={car} />
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div
                className="rounded-2xl p-12 text-center"
                style={{ border: '1px solid rgba(74,48,32,0.45)', background: 'rgba(74,48,32,0.12)' }}
              >
                <p className="font-body text-earth-500 mb-4">No vehicles listed yet.</p>
                <Link
                  to="/cars/create"
                  className="font-body text-sm text-terracotta-400 hover:text-terracotta-300 transition-colors"
                >
                  List your vehicle →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
