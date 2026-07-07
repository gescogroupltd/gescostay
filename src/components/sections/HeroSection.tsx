import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Calendar, Users, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=2560&q=90',
  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=2560&q=90',
  'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=2560&q=90',
  'https://images.unsplash.com/photo-1574068468751-b2474f6f87eb?w=2560&q=90',
]

const SUGGESTED = [
  'Dakar, Senegal',
  'Accra, Ghana',
  'Nairobi, Kenya',
  'Lagos, Nigeria',
  'Zanzibar, Tanzania',
  'Marrakech, Morocco',
  'Cape Town, South Africa',
]

export default function HeroSection() {
  const [currentImg,       setCurrentImg]       = useState(0)
  const [destination,      setDestination]      = useState('')
  const [showSuggestions,  setShowSuggestions]  = useState(false)
  const [checkIn,          setCheckIn]          = useState('')
  const [checkOut,         setCheckOut]         = useState('')
  const [guests,           setGuests]           = useState(1)
  const [guestOpen,        setGuestOpen]        = useState(false)
  const navigate   = useNavigate()
  const searchRef  = useRef<HTMLDivElement>(null)

  // Cycle hero images with crossfade
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg(i => (i + 1) % HERO_IMAGES.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
        setGuestOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (destination) params.set('location', destination)
    if (checkIn)     params.set('checkin', checkIn)
    if (checkOut)    params.set('checkout', checkOut)
    if (guests > 1)  params.set('guests', String(guests))
    navigate(`/listings?${params.toString()}`)
  }

  const filtered = destination
    ? SUGGESTED.filter(s => s.toLowerCase().includes(destination.toLowerCase()))
    : SUGGESTED

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* ── Background images — crossfade cinématographique ─────── */}
      <div className="absolute inset-0 z-0">
        {HERO_IMAGES.map((src, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              opacity: i === currentImg ? 1 : 0,
              transition: 'opacity 2200ms ease-in-out',
              zIndex: i === currentImg ? 1 : 0,
            }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover object-center animate-ken-burns"
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding={i === 0 ? 'sync' : 'async'}
              fetchPriority={i === 0 ? 'high' : 'auto' as any}
            />
          </div>
        ))}

        {/* Overlay multicouche — profondeur cinématographique */}
        {/* 1. Gradient directionnel principal */}
        <div
          className="absolute inset-0 z-10"
          style={{ background: 'linear-gradient(166deg, rgba(19,11,5,0.04) 0%, rgba(19,11,5,0.40) 50%, rgba(19,11,5,0.88) 100%)' }}
        />
        {/* 2. Vignette radiale inférieure — profondeur de champ */}
        <div
          className="absolute inset-0 z-10"
          style={{ background: 'radial-gradient(ellipse 110% 65% at 50% 102%, rgba(19,11,5,0.58) 0%, transparent 72%)' }}
        />
        {/* 3. Vignette douce du haut */}
        <div
          className="absolute inset-0 z-10"
          style={{ background: 'linear-gradient(to bottom, rgba(19,11,5,0.35) 0%, transparent 28%)' }}
        />
        {/* 4. Transition smooth vers le body */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10"
          style={{ height: '30vh', background: 'linear-gradient(to top, #FAF8F4 0%, transparent 100%)' }}
        />
      </div>

      {/* ── Indicateurs de slide — pill animé ───────────────────── */}
      <div className="absolute z-20 flex gap-2" style={{ bottom: 'calc(28vh + 2.5rem)', left: '50%', transform: 'translateX(-50%)' }}>
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentImg(i)}
            aria-label={`Slide ${i + 1}`}
            className="rounded-full transition-all duration-600"
            style={{
              width:   i === currentImg ? '2rem' : '0.4375rem',
              height:  '0.4375rem',
              background: i === currentImg ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.3)',
              boxShadow: i === currentImg ? '0 0 8px rgba(255,255,255,0.35)' : 'none',
            }}
          />
        ))}
      </div>

      {/* ── Hero content ─────────────────────────────────────────── */}
      <div className="relative z-20 container-site flex flex-col items-center text-center pt-32 pb-[30vh] md:pt-44 md:pb-[28vh]">

        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <span
            className="inline-flex items-center gap-2 font-body text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-white/80"
            style={{
              background: 'rgba(255,255,255,0.10)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.16)',
              borderRadius: '9999px',
              padding: '0.4375rem 1.125rem',
            }}
          >
            {/* Pulse dot */}
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inline-flex h-full w-full rounded-full bg-terracotta-300 opacity-75"
                style={{ animation: 'pulse-ring 2s ease-out infinite' }}
              />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-terracotta-300" />
            </span>
            The Spirit of African Hospitality
          </span>
        </motion.div>

        {/* Heading principal */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-white mb-6 max-w-5xl hero-heading"
        >
          Discover Africa,{' '}
          <em
            className="not-italic"
            style={{
              color: 'transparent',
              backgroundImage: 'linear-gradient(130deg, #E09268 0%, #D9BE72 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            one stay
          </em>
          {' '}at a time
        </motion.h1>

        {/* Sous-titre */}
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="font-body text-white/65 mb-12 max-w-sm md:max-w-md leading-[1.72]"
          style={{ fontSize: 'clamp(1rem, 2.2vw, 1.125rem)' }}
        >
          Curated stays, car rentals, and local experiences — chosen by people who call Africa home.
        </motion.p>

        {/* ── Search Bar premium ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          ref={searchRef}
          className="w-full max-w-[1000px] px-3 sm:px-0"
        >
          <div
            style={{
              background: 'rgba(253,251,248,0.93)',
              backdropFilter: 'blur(32px) saturate(200%) brightness(1.04)',
              WebkitBackdropFilter: 'blur(32px) saturate(200%) brightness(1.04)',
              borderRadius: '1.5rem',
              border: '1px solid rgba(227,218,208,0.65)',
              boxShadow: '0 2px 8px rgba(30,18,8,0.06), 0 20px 60px rgba(30,18,8,0.24), 0 0 0 1px rgba(30,18,8,0.03)',
              overflow: 'visible',
              padding: '0.5rem',
            }}
          >
            <div className="flex flex-col lg:flex-row items-center">

              {/* Destination */}
              <div className="relative flex-1 w-full lg:w-auto border-b lg:border-b-0 lg:border-r border-ivory-300/70 group">
                <div className="flex items-center gap-3.5 px-6 py-3 md:py-4 transition-colors rounded-xl group-hover:bg-ivory-100">
                  <div
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(188,95,56,0.10)' }}
                  >
                    <MapPin size={15} className="text-terracotta-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block font-body text-[0.6875rem] font-semibold text-earth-500 uppercase tracking-[0.10em] mb-0.5">
                      Where to?
                    </label>
                    <input
                      type="text"
                      value={destination}
                      onChange={e => { setDestination(e.target.value); setShowSuggestions(true) }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="City or country"
                      className="w-full bg-transparent font-body text-[0.9375rem] font-medium text-earth-900 placeholder:text-earth-400 placeholder:font-normal outline-none"
                    />
                  </div>
                </div>
                {/* Suggestions dropdown */}
                <AnimatePresence>
                  {showSuggestions && filtered.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full left-0 right-0 mt-3 z-50 overflow-hidden"
                      style={{
                        borderRadius: '1.25rem',
                        background: 'rgba(254,254,252,0.98)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 4px 6px rgba(30,18,8,0.04), 0 16px 40px rgba(30,18,8,0.14), 0 0 0 1px rgba(30,18,8,0.06)',
                      }}
                    >
                      {filtered.slice(0, 6).map(s => (
                        <button
                          key={s}
                          onClick={() => { setDestination(s); setShowSuggestions(false) }}
                          className="w-full flex items-center gap-3 px-5 py-3.5 font-body text-sm text-earth-700 hover:bg-ivory-100 transition-colors text-left group/btn"
                        >
                          <MapPin size={13} className="text-terracotta-400 shrink-0" />
                          <span className="group-hover/btn:text-earth-900 transition-colors">{s}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Check-in */}
              <div className="flex-1 w-full lg:w-auto border-b lg:border-b-0 lg:border-r border-ivory-300/70 group">
                <div className="flex items-center gap-3.5 px-6 py-3 md:py-4 transition-colors rounded-xl group-hover:bg-ivory-100">
                  <div
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(188,95,56,0.10)' }}
                  >
                    <Calendar size={15} className="text-terracotta-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block font-body text-[0.6875rem] font-semibold text-earth-500 uppercase tracking-[0.10em] mb-0.5">
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={e => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-transparent font-body text-[0.9375rem] font-medium text-earth-900 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Check-out */}
              <div className="flex-1 w-full lg:w-auto border-b lg:border-b-0 lg:border-r border-ivory-300/70 group">
                <div className="flex items-center gap-3.5 px-6 py-3 md:py-4 transition-colors rounded-xl group-hover:bg-ivory-100">
                  <div
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(188,95,56,0.10)' }}
                  >
                    <Calendar size={15} className="text-terracotta-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block font-body text-[0.6875rem] font-semibold text-earth-500 uppercase tracking-[0.10em] mb-0.5">
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={e => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full bg-transparent font-body text-[0.9375rem] font-medium text-earth-900 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Guests & Search Button */}
              <div className="relative flex-1 w-full lg:w-auto flex items-center justify-between pl-2 pr-2 py-2 group">
                <button
                  onClick={() => setGuestOpen(!guestOpen)}
                  className="flex-1 flex items-center justify-between gap-3.5 px-4 py-2 transition-colors rounded-xl group-hover:bg-ivory-100 text-left h-full"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(188,95,56,0.10)' }}
                    >
                      <Users size={15} className="text-terracotta-600" />
                    </div>
                    <div>
                      <p className="font-body text-[0.6875rem] font-semibold text-earth-500 uppercase tracking-[0.10em] mb-0.5">Guests</p>
                      <p className="font-body text-[0.9375rem] font-medium text-earth-900">
                        {guests} {guests === 1 ? 'guest' : 'guests'}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    size={15}
                    className={`text-earth-400 transition-transform duration-200 ${guestOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {guestOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-4 md:right-32 top-full mt-3 z-50 p-6"
                      style={{
                        borderRadius: '1.25rem',
                        minWidth: '220px',
                        background: 'rgba(254,254,252,0.98)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 4px 6px rgba(30,18,8,0.04), 0 16px 40px rgba(30,18,8,0.14), 0 0 0 1px rgba(30,18,8,0.06)',
                      }}
                    >
                      <p className="font-body text-xs font-semibold text-earth-400 uppercase tracking-wide mb-5">
                        Number of guests
                      </p>
                      <div className="flex items-center justify-between gap-5">
                        <button
                          type="button"
                          onClick={() => setGuests(g => Math.max(1, g - 1))}
                          className="w-11 h-11 rounded-full border border-ivory-300 flex items-center justify-center text-earth-700 hover:bg-ivory-100 hover:border-ivory-400 font-body text-xl leading-none transition-all duration-150"
                        >
                          −
                        </button>
                        <span className="font-display text-2xl font-semibold text-earth-900 w-8 text-center">
                          {guests}
                        </span>
                        <button
                          type="button"
                          onClick={() => setGuests(g => Math.min(20, g + 1))}
                          className="w-11 h-11 rounded-full border border-ivory-300 flex items-center justify-center text-earth-700 hover:bg-ivory-100 hover:border-ivory-400 font-body text-xl leading-none transition-all duration-150"
                        >
                          +
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Search Button inside the same container on desktop */}
                <div className="pl-3 hidden lg:block">
                  <button
                    onClick={handleSearch}
                    className="btn-primary gap-2 text-[0.9375rem] h-14"
                    style={{ padding: '0 1.5rem', borderRadius: '1rem' }}
                  >
                    <Search size={16} />
                    Search
                  </button>
                </div>
              </div>
              
              {/* Mobile Search Button */}
              <div className="w-full lg:hidden pt-3 px-2 pb-2">
                <button
                  onClick={handleSearch}
                  className="btn-primary w-full gap-2 text-[0.9375rem] h-12"
                  style={{ borderRadius: '0.875rem' }}
                >
                  <Search size={16} />
                  Search Stays
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
