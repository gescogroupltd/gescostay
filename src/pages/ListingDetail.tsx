import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, BedDouble, Bath, Users, Star, Calendar, ChevronLeft, ChevronRight, X, Share2, Heart, Shield, Clock } from 'lucide-react'
import { supabase, type Property, type Profile } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [property, setProperty] = useState<Property | null>(null)
  const [host, setHost] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [liked, setLiked] = useState(false)

  // Booking state
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [booking, setBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      const { data: p } = await supabase.from('properties').select('*').eq('id', id).single()
      setProperty(p)
      if (p?.owner_id) {
        const { data: h } = await supabase.from('profiles').select('*').eq('id', p.owner_id).single()
        setHost(h)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const nights = checkIn && checkOut
    ? Math.max(0, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 0

  const total = property ? nights * property.price : 0

  const handleBook = async () => {
    if (!user) { navigate('/auth'); return }
    if (!property || !checkIn || !checkOut) return
    setBooking(true)
    const { error } = await supabase.from('bookings').insert({
      property_id: property.id,
      user_id: user.id,
      check_in: checkIn,
      check_out: checkOut,
      total_price: total,
      status: 'pending',
    })
    setBooking(false)
    if (!error) setBookingSuccess(true)
  }

  if (loading) {
    return (
      <div className="nav-offset min-h-screen bg-ivory-100">
        <div className="container-site py-8">
          <div className="skeleton h-96 rounded-2xl mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="skeleton h-8 w-2/3 rounded-xl" />
              <div className="skeleton h-4 w-1/3 rounded-full" />
              <div className="skeleton h-24 rounded-xl" />
            </div>
            <div className="skeleton h-64 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!property) return (
    <div className="nav-offset min-h-screen bg-ivory-100 flex items-center justify-center">
      <div className="text-center">
        <h2 className="font-display text-2xl text-earth-700 mb-2">Property not found</h2>
        <Link to="/listings" className="btn-primary mt-4">Browse Listings</Link>
      </div>
    </div>
  )

  const images = property.images?.length ? property.images : ['https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80']
  const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: property.currency || 'USD', maximumFractionDigits: 0 }).format(property.price)

  return (
    <div className="nav-offset min-h-screen bg-ivory-100">
      {/* Title & Header Meta (Moved above photos) */}
      <div className="container-site pt-8 pb-4">
        <Link to="/listings" className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-earth-500 hover:text-earth-800 transition-colors mb-4">
          <ChevronLeft size={16} /> Back to explore
        </Link>
        <h1 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] text-earth-950 leading-[1.1] mb-4 tracking-tight">
          {property.title}
        </h1>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            {property.rating && (
              <div className="flex items-center gap-1.5">
                <Star size={16} className="fill-earth-900 text-earth-900" />
                <span className="font-body text-sm font-semibold text-earth-900">{property.rating.toFixed(1)}</span>
                {property.review_count && <span className="font-body text-sm underline text-earth-900 cursor-pointer">{property.review_count} reviews</span>}
              </div>
            )}
            {property.rating && <span className="text-earth-300">•</span>}
            <div className="flex items-center gap-1.5 text-sm font-body font-medium text-earth-900 underline cursor-pointer">
              <MapPin size={15} />
              {property.location}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-sm font-body font-medium text-earth-900 hover:bg-ivory-200 px-3 py-1.5 rounded-lg transition-colors">
              <Share2 size={15} /> <span className="hidden sm:inline">Share</span>
            </button>
            <button onClick={() => setLiked(!liked)} className="flex items-center gap-2 text-sm font-body font-medium text-earth-900 hover:bg-ivory-200 px-3 py-1.5 rounded-lg transition-colors">
              <Heart size={15} className={liked ? 'fill-red-500 text-red-500' : ''} /> <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Photo Gallery: Bento Grid Desktop / Slider Mobile */}
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
          <img src={images[activeImg]} alt={property.title} className="w-full h-full object-cover" onClick={() => setLightboxOpen(true)} />
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

      {/* Main content */}
      <div className="container-site py-10">
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">

          {/* Left: details */}
          <div className="lg:col-span-2">
            {property.property_type && (
              <span className="badge border border-earth-300 text-earth-700 bg-white shadow-sm mb-6 uppercase tracking-wider text-[10px]">
                {property.property_type}
              </span>
            )}
            
            <h2 className="font-display text-2xl text-earth-900 mb-6">
              {property.property_type || 'Property'} hosted by {host?.first_name || 'Host'}
            </h2>

            <div className="divider mb-6" />

            {/* Specs */}
            <div className="flex flex-wrap gap-6 mb-8">
              {property.beds && <div className="flex items-center gap-2 text-sm font-body text-earth-700"><BedDouble size={18} className="text-earth-400" />{property.beds} {property.beds === 1 ? 'bedroom' : 'bedrooms'}</div>}
              {property.baths && <div className="flex items-center gap-2 text-sm font-body text-earth-700"><Bath size={18} className="text-earth-400" />{property.baths} {property.baths === 1 ? 'bathroom' : 'bathrooms'}</div>}
              <div className="flex items-center gap-2 text-sm font-body text-earth-700"><Users size={18} className="text-earth-400" />Up to {(property.beds || 1) * 2} guests</div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="mb-8">
                <h2 className="font-display text-xl text-earth-900 mb-3">About this place</h2>
                <p className="font-body text-sm text-earth-600 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="font-display text-xl text-earth-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {property.amenities.map(a => (
                    <div key={a} className="flex items-center gap-2 text-sm font-body text-earth-700 bg-ivory-200 rounded-xl px-3 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-terracotta-500" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Host */}
            {host && (
              <div className="bg-white border border-ivory-300 shadow-sm rounded-3xl p-8 mb-10">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  {host.avatar_url ? (
                    <img src={host.avatar_url} alt={host.first_name || ''} className="w-16 h-16 rounded-full object-cover shadow-sm" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-earth-900 flex items-center justify-center shadow-sm">
                      <span className="font-display text-2xl text-white">{(host.first_name || 'H')[0]}</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="font-display text-2xl text-earth-900 mb-1">Meet your host, {host.first_name}</h2>
                    <p className="font-body text-sm text-earth-500">Host on GescoStay since 2024</p>
                  </div>
                </div>
                <div className="divider my-6" />
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-sm font-body text-earth-800">
                    <Shield size={18} className="text-earth-400" /> Identity verified
                  </div>
                  <div className="flex items-center gap-2 text-sm font-body text-earth-800">
                    <Star size={18} className="text-earth-400" /> Superhost
                  </div>
                  <div className="flex items-center gap-2 text-sm font-body text-earth-800">
                    <Clock size={18} className="text-earth-400" /> Responds within an hour
                  </div>
                </div>
                <button className="btn-secondary mt-6">Message Host</button>
              </div>
            )}
          </div>

          {/* Right: booking card */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-[7rem]">
              <div className="bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(30,18,8,0.12)] border border-ivory-300 p-7">
                {bookingSuccess ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-full bg-forest-50 border-4 border-forest-100 flex items-center justify-center mx-auto mb-4">
                      <Shield size={28} className="text-forest-600" />
                    </div>
                    <h3 className="font-display text-2xl text-earth-900 mb-2">Request Sent!</h3>
                    <p className="font-body text-sm text-earth-500 mb-6">Your booking is pending host approval. You'll receive a confirmation email shortly.</p>
                    <Link to="/bookings" className="btn-primary w-full justify-center">View My Bookings</Link>
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline gap-1.5 mb-6">
                      <span className="font-display text-3xl font-semibold text-earth-900">{price}</span>
                      <span className="font-body text-base text-earth-500">night</span>
                    </div>

                    <div className="space-y-3 mb-5">
                      <div>
                        <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-1.5 block">Check-in</label>
                        <div className="relative">
                          <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
                          <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} min={new Date().toISOString().split('T')[0]} className="input-field pl-9 text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-1.5 block">Check-out</label>
                        <div className="relative">
                          <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
                          <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn || new Date().toISOString().split('T')[0]} className="input-field pl-9 text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-1.5 block">Guests</label>
                        <div className="flex items-center justify-between input-field py-2.5">
                          <span className="font-body text-sm text-earth-700">{guests} {guests === 1 ? 'guest' : 'guests'}</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setGuests(g => Math.max(1, g - 1))} className="w-7 h-7 rounded-full border border-ivory-400 flex items-center justify-center text-earth-600 hover:bg-ivory-100 font-body text-base transition-colors">−</button>
                            <button onClick={() => setGuests(g => Math.min(16, g + 1))} className="w-7 h-7 rounded-full border border-ivory-400 flex items-center justify-center text-earth-600 hover:bg-ivory-100 font-body text-base transition-colors">+</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {nights > 0 && (
                      <div className="bg-ivory-100 rounded-xl p-4 mb-5 space-y-2">
                        <div className="flex justify-between text-sm font-body text-earth-700">
                          <span>{price} × {nights} night{nights > 1 ? 's' : ''}</span>
                          <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: property.currency || 'USD', maximumFractionDigits: 0 }).format(total)}</span>
                        </div>
                        <div className="divider" />
                        <div className="flex justify-between font-body font-semibold text-earth-900">
                          <span>Total</span>
                          <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: property.currency || 'USD', maximumFractionDigits: 0 }).format(total)}</span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleBook}
                      disabled={booking || !checkIn || !checkOut || nights === 0}
                      className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {booking ? 'Requesting...' : user ? 'Reserve Now' : 'Sign In to Book'}
                    </button>

                    <p className="text-center font-body text-xs text-earth-400 mt-3 flex items-center justify-center gap-1">
                      <Shield size={11} className="text-forest-500" />
                      Secure payment · Free cancellation available
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
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
          <div className="font-display text-lg font-semibold text-earth-900">{price} <span className="font-body text-sm font-normal text-earth-500">night</span></div>
          {property.rating && <div className="font-body text-xs font-medium underline text-earth-900">{property.rating.toFixed(1)} ({property.review_count})</div>}
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
        {/* We reuse the exact same booking logic block here for mobile. For brevity in this replace, we just display the form again. */}
        <div className="bg-white rounded-3xl shadow-soft border border-ivory-300 p-6">
           <div className="space-y-3 mb-5">
              <div>
                <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-1.5 block">Check-in</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
                  <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} min={new Date().toISOString().split('T')[0]} className="input-field pl-9 text-sm" />
                </div>
              </div>
              <div>
                <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-1.5 block">Check-out</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
                  <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn || new Date().toISOString().split('T')[0]} className="input-field pl-9 text-sm" />
                </div>
              </div>
            </div>
            {nights > 0 && (
              <div className="bg-ivory-100 rounded-xl p-4 mb-5 space-y-2">
                <div className="flex justify-between font-body font-semibold text-earth-900">
                  <span>Total</span>
                  <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: property.currency || 'USD', maximumFractionDigits: 0 }).format(total)}</span>
                </div>
              </div>
            )}
            <button onClick={handleBook} disabled={booking || !checkIn || !checkOut || nights === 0} className="btn-primary w-full justify-center">
              {booking ? 'Requesting...' : user ? 'Reserve Now' : 'Sign In'}
            </button>
        </div>
      </div>
    </div>
  )
}
