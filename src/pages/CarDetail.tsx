import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, Users, Fuel, Settings, Calendar, ChevronLeft, ChevronRight, X, Shield, Share2, Heart } from 'lucide-react'
import { supabase, type Car } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function CarDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [durationType, setDurationType] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [booking, setBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    if (!id) return
    supabase.from('cars').select('*').eq('id', id).single()
      .then(({ data }) => { setCar(data); setLoading(false) })
  }, [id])

  const days = startDate && endDate
    ? Math.max(0, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000))
    : 0

  const getPrice = () => {
    if (!car) return 0
    if (durationType === 'weekly' && car.price_week) return car.price_week
    if (durationType === 'monthly' && car.price_month) return car.price_month
    return (car.price_day || 0) * (days || 1)
  }

  const handleBook = async () => {
    if (!user) { navigate('/auth'); return }
    if (!car || !startDate || !endDate) return
    setBooking(true)
    const { error } = await supabase.from('car_bookings').insert({
      car_id: car.id, user_id: user.id,
      start_date: startDate, end_date: endDate,
      total_price: getPrice(), status: 'pending', duration_type: durationType,
    })
    setBooking(false)
    if (!error) setBookingSuccess(true)
  }

  if (loading) return (
    <div className="nav-offset min-h-screen bg-ivory-100">
      <div className="container-site py-8">
        <div className="skeleton h-80 rounded-2xl mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="skeleton h-8 w-2/3 rounded-xl" />
            <div className="skeleton h-24 rounded-xl" />
          </div>
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  )

  if (!car) return (
    <div className="nav-offset min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="font-display text-2xl text-earth-700 mb-4">Vehicle not found</h2>
        <Link to="/cars" className="btn-primary">Browse Cars</Link>
      </div>
    </div>
  )

  const images = car.images?.length ? car.images : ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80']
  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: car.currency || 'USD', maximumFractionDigits: 0 }).format(n)

  return (
    <div className="nav-offset min-h-screen bg-ivory-100">
      {/* Title & Header Meta */}
      <div className="container-site pt-8 pb-4">
        <Link to="/cars" className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-earth-500 hover:text-earth-800 transition-colors mb-4">
          <ChevronLeft size={16} /> Back to vehicles
        </Link>
        <h1 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] text-earth-950 leading-[1.1] mb-4 tracking-tight">
          {car.make} {car.model} {car.year && `(${car.year})`}
        </h1>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm font-body font-medium text-earth-900 underline cursor-pointer">
              <MapPin size={15} />
              {car.location}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-sm font-body font-medium text-earth-900 hover:bg-ivory-200 px-3 py-1.5 rounded-lg transition-colors">
              <Share2 size={15} /> <span className="hidden sm:inline">Share</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-body font-medium text-earth-900 hover:bg-ivory-200 px-3 py-1.5 rounded-lg transition-colors">
              <Heart size={15} className="text-earth-900" /> <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gallery: Bento Grid Desktop / Slider Mobile */}
      <div className="container-site mb-10">
        {/* Desktop Bento Grid */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[50vh] lg:h-[60vh] rounded-[1.5rem] overflow-hidden relative group">
          <div className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden" onClick={() => { setActiveImg(0); setLightboxOpen(true); }}>
            <img src={images[0]} alt="Main" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out" />
            <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
          </div>
          <div className="col-span-1 row-span-1 relative cursor-pointer overflow-hidden" onClick={() => { setActiveImg(1 % images.length); setLightboxOpen(true); }}>
            <img src={images[1 % images.length]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out" />
            <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
          </div>
          <div className="col-span-1 row-span-1 relative cursor-pointer overflow-hidden" onClick={() => { setActiveImg(2 % images.length); setLightboxOpen(true); }}>
            <img src={images[2 % images.length]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out" />
            <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
          </div>
          <div className="col-span-1 row-span-1 relative cursor-pointer overflow-hidden" onClick={() => { setActiveImg(3 % images.length); setLightboxOpen(true); }}>
            <img src={images[3 % images.length]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out" />
            <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
          </div>
          <div className="col-span-1 row-span-1 relative cursor-pointer overflow-hidden" onClick={() => { setActiveImg(4 % images.length); setLightboxOpen(true); }}>
            <img src={images[4 % images.length]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out" />
            <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
          </div>
          <button onClick={() => setLightboxOpen(true)} className="absolute bottom-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-xl font-body text-sm font-medium border border-earth-900/10 shadow-sm hover:scale-105 transition-transform">
            Show all photos
          </button>
        </div>

        {/* Mobile Slider */}
        <div className="md:hidden relative h-[40vh] -mx-4 sm:mx-0 sm:rounded-2xl overflow-hidden">
          <img src={images[activeImg]} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" onClick={() => setLightboxOpen(true)} />
          {images.length > 1 && (
            <>
              <button onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-earth-900"><ChevronLeft size={18} /></button>
              <button onClick={() => setActiveImg(i => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-earth-900"><ChevronRight size={18} /></button>
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur text-white px-2.5 py-1 rounded-md text-xs font-medium tracking-wide">
                {activeImg + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="container-site py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Details */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl text-earth-900 mb-6">About this vehicle</h2>
            <div className="divider mb-6" />
            <div className="flex flex-wrap gap-5 mb-8">
              {car.seats && <div className="flex items-center gap-2 text-sm font-body text-earth-700"><Users size={17} className="text-earth-400" />{car.seats} seats</div>}
              {car.transmission && <div className="flex items-center gap-2 text-sm font-body text-earth-700"><Settings size={17} className="text-earth-400" />{car.transmission}</div>}
              {car.fuel_type && <div className="flex items-center gap-2 text-sm font-body text-earth-700"><Fuel size={17} className="text-earth-400" />{car.fuel_type}</div>}
            </div>
            {car.description && <p className="font-body text-sm text-earth-600 leading-relaxed mb-8">{car.description}</p>}
            {car.features && car.features.length > 0 && (
              <div>
                <h2 className="font-display text-xl text-earth-900 mb-4">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {car.features.map(f => <span key={f} className="badge bg-ivory-200 text-earth-700">{f}</span>)}
                </div>
              </div>
            )}
          </div>

          {/* Booking */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-[7rem]">
              <div className="bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(30,18,8,0.12)] border border-ivory-300 p-7">
              {bookingSuccess ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-4"><Shield size={26} className="text-forest-600" /></div>
                  <h3 className="font-display text-xl text-earth-900 mb-2">Booking Sent!</h3>
                  <p className="font-body text-sm text-earth-500 mb-6">Your car rental request is pending owner approval.</p>
                  <Link to="/bookings" className="btn-primary w-full justify-center">My Bookings</Link>
                </div>
              ) : (
                <>
                  {/* Pricing */}
                  <div className="space-y-2 mb-5">
                    <div className="flex items-baseline gap-1.5"><span className="font-display text-3xl font-semibold text-earth-900">{fmt(car.price_day)}</span><span className="font-body text-sm text-earth-400">/ day</span></div>
                    {car.price_week && <p className="font-body text-sm text-earth-500">{fmt(car.price_week)} / week</p>}
                    {car.price_month && <p className="font-body text-sm text-earth-500">{fmt(car.price_month)} / month</p>}
                  </div>

                  {/* Duration type */}
                  <div className="flex gap-2 mb-5">
                    {(['daily', 'weekly', 'monthly'] as const).filter(t => t === 'daily' || (t === 'weekly' && car.price_week) || (t === 'monthly' && car.price_month)).map(t => (
                      <button key={t} onClick={() => setDurationType(t)} className={`flex-1 py-2 rounded-xl border font-body text-xs font-medium capitalize transition-all ${durationType === t ? 'border-terracotta-500 bg-terracotta-50 text-terracotta-600' : 'border-ivory-300 text-earth-600 hover:border-ivory-400'}`}>{t}</button>
                    ))}
                  </div>

                  <div className="space-y-3 mb-5">
                    <div>
                      <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-1.5 block">Start Date</label>
                      <div className="relative"><Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" /><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="input-field pl-9 text-sm" /></div>
                    </div>
                    <div>
                      <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-1.5 block">End Date</label>
                      <div className="relative"><Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" /><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate || new Date().toISOString().split('T')[0]} className="input-field pl-9 text-sm" /></div>
                    </div>
                  </div>

                  {days > 0 && (
                    <div className="bg-ivory-100 rounded-xl p-4 mb-5">
                      <div className="flex justify-between font-body font-semibold text-earth-900">
                        <span>Total ({days} day{days > 1 ? 's' : ''})</span>
                        <span>{fmt(getPrice())}</span>
                      </div>
                    </div>
                  )}

                  <button onClick={handleBook} disabled={booking || !startDate || !endDate}
                    className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                    {booking ? 'Requesting...' : user ? 'Reserve Vehicle' : 'Sign In to Book'}
                  </button>
                  <p className="text-center font-body text-xs text-earth-400 mt-3 flex items-center justify-center gap-1">
                    <Shield size={11} className="text-forest-500" /> Secure · Verified owner
                  </p>
                </>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-earth-950/95 backdrop-blur-md flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
             <div className="text-white/80 font-body text-sm">{activeImg + 1} / {images.length}</div>
             <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
               <X size={20} />
             </button>
          </div>
          <img src={images[activeImg]} alt="" className="max-h-[85vh] max-w-[95vw] object-contain shadow-2xl" onClick={e => e.stopPropagation()} />
          {images.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + images.length) % images.length) }} className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors shadow-lg">
                <ChevronLeft size={24} />
              </button>
              <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % images.length) }} className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors shadow-lg">
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      )}

      {/* Mobile sticky action bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-ivory-300 p-4 pb-safe flex items-center justify-between z-40 shadow-[0_-4px_12px_rgba(30,18,8,0.05)]">
        <div>
          <div className="font-display text-lg font-semibold text-earth-900">{fmt(car.price_day)} <span className="font-body text-sm font-normal text-earth-500">day</span></div>
        </div>
        <button 
          onClick={() => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }}
          className="btn-primary rounded-xl px-8"
        >
          Reserve
        </button>
      </div>

      {/* Mobile Booking Form (at the bottom) */}
      <div className="lg:hidden container-site py-10 border-t border-ivory-300">
        <h3 className="font-display text-2xl text-earth-900 mb-6">Select dates</h3>
        <div className="bg-white rounded-3xl shadow-soft border border-ivory-300 p-6">
          <div className="flex gap-2 mb-5">
            {(['daily', 'weekly', 'monthly'] as const).filter(t => t === 'daily' || (t === 'weekly' && car.price_week) || (t === 'monthly' && car.price_month)).map(t => (
              <button key={t} onClick={() => setDurationType(t)} className={`flex-1 py-2 rounded-xl border font-body text-xs font-medium capitalize transition-all ${durationType === t ? 'border-terracotta-500 bg-terracotta-50 text-terracotta-600' : 'border-ivory-300 text-earth-600 hover:border-ivory-400'}`}>{t}</button>
            ))}
          </div>
          <div className="space-y-3 mb-5">
            <div>
              <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-1.5 block">Start Date</label>
              <div className="relative"><Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" /><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="input-field pl-9 text-sm" /></div>
            </div>
            <div>
              <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-1.5 block">End Date</label>
              <div className="relative"><Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" /><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate || new Date().toISOString().split('T')[0]} className="input-field pl-9 text-sm" /></div>
            </div>
          </div>
          {days > 0 && (
            <div className="bg-ivory-100 rounded-xl p-4 mb-5">
              <div className="flex justify-between font-body font-semibold text-earth-900">
                <span>Total ({days} day{days > 1 ? 's' : ''})</span>
                <span>{fmt(getPrice())}</span>
              </div>
            </div>
          )}
          <button onClick={handleBook} disabled={booking || !startDate || !endDate} className="btn-primary w-full justify-center">
            {booking ? 'Requesting...' : user ? 'Reserve Vehicle' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}
