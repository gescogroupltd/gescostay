import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Calendar, MapPin, Car, Home, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase, type Booking } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { usePageMeta } from '../hooks/usePageMeta'
import ScrollReveal from '../components/ui/ScrollReveal'

interface CarBooking {
  id: string
  car_id: string
  user_id: string
  start_date: string
  end_date: string
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled'
  duration_type?: string
  created_at: string
  car?: { title: string; make: string; model: string; location: string; images?: string[] }
}

type Tab = 'stays' | 'cars'

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   icon: Clock,        color: 'text-ocre-600',     bg: 'bg-ocre-100    border-ocre-200' },
  confirmed: { label: 'Confirmed', icon: CheckCircle,  color: 'text-forest-700',   bg: 'bg-forest-100  border-forest-200' },
  cancelled: { label: 'Cancelled', icon: XCircle,      color: 'text-earth-500',    bg: 'bg-ivory-200   border-ivory-400' },
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function fmt(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

export default function Bookings() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState<Tab>('stays')
  const [stayBookings,  setStayBookings]  = useState<(Booking & { property?: { title: string; location: string; images?: string[] } })[]>([])
  const [carBookings,   setCarBookings]   = useState<CarBooking[]>([])
  const [loading,       setLoading]       = useState(true)

  usePageMeta({
    title: 'My Bookings',
    description: 'View and manage all your Gescostay bookings — stays and car rentals.',
  })

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth')
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const [{ data: stays }, { data: cars }] = await Promise.all([
        supabase
          .from('bookings')
          .select('*, property:properties(title, location, images)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('car_bookings')
          .select('*, car:cars(title, make, model, location, images)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ])
      setStayBookings((stays as typeof stayBookings) || [])
      setCarBookings((cars as CarBooking[]) || [])
      setLoading(false)
    }
    load()
  }, [user])

  if (authLoading || loading) {
    return (
      <div className="nav-offset min-h-screen bg-ivory-100">
        <div className="container-site py-12 max-w-3xl mx-auto space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-40 rounded-3xl" />
          ))}
        </div>
      </div>
    )
  }

  const currentList = tab === 'stays' ? stayBookings : carBookings

  return (
    <div className="nav-offset min-h-screen bg-ivory-100">
      {/* Header */}
      <div className="relative bg-earth-950 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        <div className="absolute inset-0 bg-gradient-to-b from-earth-900/60 to-earth-950" />
        <div className="container-site relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <p className="eyebrow text-terracotta-400 mb-3">Account</p>
            <h1 className="font-display text-4xl md:text-5xl text-ivory-50 mb-3 tracking-tight">My Bookings</h1>
            <p className="font-body text-earth-300 text-base">
              {stayBookings.length + carBookings.length} total reservation{stayBookings.length + carBookings.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-site py-8 max-w-3xl mx-auto">
        {/* Tab switcher */}
        <div className="flex gap-2 mb-8 bg-ivory-200/60 p-1 rounded-xl border border-ivory-300 w-fit">
          {(['stays', 'cars'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg font-body text-sm font-semibold transition-all duration-200 ${
                tab === t ? 'text-earth-900' : 'text-earth-500 hover:text-earth-700'
              }`}
            >
              {t === 'stays' ? <Home size={14} /> : <Car size={14} />}
              {t === 'stays' ? `Stays (${stayBookings.length})` : `Cars (${carBookings.length})`}
              {tab === t && (
                <motion.span
                  layoutId="bookingTab"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm border border-ivory-200/50"
                  style={{ zIndex: -1 }}
                  initial={false}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* List */}
        {currentList.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-ivory-200 flex items-center justify-center mx-auto mb-4">
              {tab === 'stays' ? <Home size={24} className="text-earth-300" /> : <Car size={24} className="text-earth-300" />}
            </div>
            <h3 className="font-display text-xl text-earth-700 mb-2">No {tab === 'stays' ? 'stay' : 'car'} bookings yet</h3>
            <p className="font-body text-earth-400 mb-6">
              {tab === 'stays'
                ? 'Discover handpicked properties across Africa.'
                : 'Find the perfect vehicle for your journey.'}
            </p>
            <Link to={tab === 'stays' ? '/listings' : '/cars'} className="btn-primary">
              Browse {tab === 'stays' ? 'Stays' : 'Cars'}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tab === 'stays'
              ? stayBookings.map((b, i) => {
                  const status = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending
                  const StatusIcon = status.icon
                  const thumb = b.property?.images?.[0] || 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&q=70'
                  return (
                    <ScrollReveal key={b.id} delay={i * 60}>
                      <Link
                        to={`/listings/${b.property_id}`}
                        className="flex gap-5 bg-white rounded-3xl border border-ivory-300 shadow-card p-5 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group"
                      >
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0">
                          <img src={thumb} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-display text-lg font-medium text-earth-900 leading-tight line-clamp-2">
                              {b.property?.title || 'Property'}
                            </h3>
                            <span className={`badge shrink-0 ${status.bg} ${status.color} border`}>
                              <StatusIcon size={10} />
                              {status.label}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 mb-3">
                            <span className="font-body text-xs text-earth-500 flex items-center gap-1">
                              <MapPin size={11} /> {b.property?.location}
                            </span>
                            <span className="font-body text-xs text-earth-500 flex items-center gap-1">
                              <Calendar size={11} />
                              {formatDate(b.check_in)} – {formatDate(b.check_out)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="font-display text-base font-semibold text-earth-900">{fmt(b.total_price)}</p>
                            <ChevronRight size={16} className="text-earth-300 group-hover:text-earth-500 transition-colors" />
                          </div>
                        </div>
                      </Link>
                    </ScrollReveal>
                  )
                })
              : carBookings.map((b, i) => {
                  const status = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending
                  const StatusIcon = status.icon
                  const thumb = b.car?.images?.[0] || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=70'
                  return (
                    <ScrollReveal key={b.id} delay={i * 60}>
                      <Link
                        to={`/cars/${b.car_id}`}
                        className="flex gap-5 bg-white rounded-3xl border border-ivory-300 shadow-card p-5 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group"
                      >
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0">
                          <img src={thumb} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-display text-lg font-medium text-earth-900 leading-tight">
                              {b.car?.make} {b.car?.model}
                            </h3>
                            <span className={`badge shrink-0 ${status.bg} ${status.color} border`}>
                              <StatusIcon size={10} />
                              {status.label}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 mb-3">
                            <span className="font-body text-xs text-earth-500 flex items-center gap-1">
                              <MapPin size={11} /> {b.car?.location}
                            </span>
                            <span className="font-body text-xs text-earth-500 flex items-center gap-1">
                              <Calendar size={11} />
                              {formatDate(b.start_date)} – {formatDate(b.end_date)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="font-display text-base font-semibold text-earth-900">{fmt(b.total_price)}</p>
                            <ChevronRight size={16} className="text-earth-300 group-hover:text-earth-500 transition-colors" />
                          </div>
                        </div>
                      </Link>
                    </ScrollReveal>
                  )
                })}
          </div>
        )}

        {/* CTA below list */}
        {currentList.length > 0 && (
          <div className="mt-10 text-center">
            <Link to={tab === 'stays' ? '/listings' : '/cars'} className="btn-secondary">
              Browse More {tab === 'stays' ? 'Stays' : 'Cars'}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
