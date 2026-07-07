import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, User, ChevronDown, LogOut, LayoutDashboard, Heart, Car, Home, UtensilsCrossed, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import logoSrc from '../../assets/logo.svg'

const navLinks = [
  { label: 'Stays',       href: '/listings',               icon: Home },
  { label: 'Cars',        href: '/cars',                   icon: Car },
  { label: 'Restaurants', href: '/community',              icon: UtensilsCrossed },
  { label: 'Nightlife',   href: '/community?tab=nightlife', icon: Moon },
  { label: 'About',       href: '/about',                  icon: null },
]

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <>
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header
        className={`fixed left-4 right-4 md:left-6 md:right-6 lg:mx-auto max-w-[1280px] z-50 transition-all duration-500 border ${
          scrolled
            ? 'top-2 bg-[#FBF9F6]/98 shadow-[0_8px_32px_rgba(30,18,8,0.08)] backdrop-blur-[32px] border-white/50'
            : 'top-4 md:top-6 bg-[#FBF9F6]/85 shadow-[0_4px_20px_rgba(30,18,8,0.04)] backdrop-blur-[20px] border-white/80'
        }`}
        style={{
          height: '4.5rem',
          borderRadius: '2.5rem',
        }}
      >
        <div className="h-full px-5 md:px-8 flex items-center justify-between">

          {/* Left side: Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center transition-opacity duration-200 hover:opacity-80"
            >
              <img
                src={logoSrc}
                alt="Gescostay"
                className="h-[2.125rem] w-auto object-contain transition-all duration-400"
              />
            </Link>
          </div>

          {/* Center: Desktop nav */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-4">
            {navLinks.map(({ label, href }) => {
              const isActive = href === '/community' 
                ? location.pathname === '/community' && location.search !== '?tab=nightlife' 
                : href === '/community?tab=nightlife' 
                ? location.pathname === '/community' && location.search === '?tab=nightlife' 
                : location.pathname.startsWith(href.split('?')[0]);

              return (
              <Link
                key={href}
                to={href}
                className={`relative px-5 py-2 rounded-full font-body text-[0.9rem] font-semibold tracking-wide transition-all duration-300 border group ${
                  isActive
                    ? 'text-[#C85D38] bg-[#FDF5F1] border-transparent'
                    : 'text-[#4A423C] border-transparent hover:text-[#C85D38] hover:bg-[#FDF5F1] hover:border-[#C85D38]/60'
                }`}
              >
                {label}
                {/* Straight underline for active or hover state */}
                <span 
                  className={`absolute bottom-[0.35rem] left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#C85D38] rounded-full transition-all duration-300 ${
                    isActive ? 'opacity-90 scale-100' : 'opacity-0 scale-75 group-hover:opacity-90 group-hover:scale-100'
                  }`} 
                />
              </Link>
            )})}
          </nav>

          {/* Right side: Auth area & Actions */}
          <div className="flex items-center gap-3 md:gap-6">

            {/* Become a Host — desktop only */}
            <Link
              to="/listings/create"
              className="hidden lg:flex items-center gap-2 font-body text-[0.9rem] font-semibold text-[#4A423C] hover:text-[#2A2420] transition-colors"
            >
              <Home size={16} strokeWidth={2.2} className="text-[#4A423C]" />
              Become a Host
            </Link>

            {/* Auth area */}
            {user ? (
              <div className="relative ml-2" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all duration-200 border border-ivory-300 hover:bg-ivory-100"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #CF7348 0%, #BC5F38 100%)',
                      boxShadow: '0 1px 4px rgba(188,95,56,0.35)',
                    }}
                  >
                    <User size={13} className="text-white" />
                  </div>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 text-earth-500 ${userMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 top-full mt-3 w-56 overflow-hidden"
                      style={{
                        borderRadius: '1.125rem',
                        background: 'rgba(254,254,252,0.98)',
                        backdropFilter: 'blur(24px)',
                        boxShadow: '0 4px 6px rgba(30,18,8,0.04), 0 12px 40px rgba(30,18,8,0.16), 0 0 0 1px rgba(30,18,8,0.06)',
                      }}
                    >
                      <div className="px-4 py-3.5 border-b border-ivory-200">
                        <p className="font-body text-[0.6875rem] text-earth-400 uppercase tracking-wide font-semibold mb-0.5">
                          Signed in as
                        </p>
                        <p className="font-body text-sm font-semibold text-earth-900 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="p-1.5">
                        {[
                          { to: '/profile',         icon: User,            label: 'My Profile' },
                          { to: '/bookings',        icon: Heart,           label: 'My Bookings' },
                          { to: '/listings/create', icon: LayoutDashboard, label: 'My Listings' },
                        ].map(({ to, icon: Icon, label }) => (
                          <Link
                            key={to}
                            to={to}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-ivory-100 transition-colors group"
                          >
                            <Icon size={14} className="text-earth-400 group-hover:text-earth-700 transition-colors" />
                            <span className="font-body text-sm text-earth-700 group-hover:text-earth-900">{label}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="p-1.5 border-t border-ivory-200">
                        <button
                          onClick={async () => { await signOut(); navigate('/') }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors group"
                        >
                          <LogOut size={14} className="text-earth-400 group-hover:text-red-500 transition-colors" />
                          <span className="font-body text-sm text-earth-600 group-hover:text-red-600">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-4 xl:gap-6 ml-2">
                <Link
                  to="/auth"
                  className="hidden sm:block font-body text-[0.9rem] font-semibold text-[#4A423C] hover:text-[#2A2420] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="inline-flex items-center justify-center font-body text-[0.925rem] font-semibold px-6 py-[0.65rem] bg-[#C85D38] text-white hover:bg-[#B6512E] transition-all duration-200"
                  style={{
                    borderRadius: '0.8rem',
                    boxShadow: '0 2px 8px rgba(200,93,56,0.25)',
                  }}
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl transition-colors ml-1 text-earth-700 hover:bg-ivory-200"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Drawer ──────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-earth-950/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[88vw] flex flex-col"
              style={{
                background: 'rgba(250,248,244,0.98)',
                backdropFilter: 'blur(20px)',
                boxShadow: '-4px 0 40px rgba(30,18,8,0.18)',
              }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-ivory-200">
                <img src={logoSrc} alt="Gescostay" className="h-8 w-auto" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl hover:bg-ivory-200 transition-colors text-earth-600"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <div className="space-y-0.5">
                  {navLinks.map(({ label, href, icon: Icon }) => {
                    const isActive = href === '/community' 
                      ? location.pathname === '/community' && location.search !== '?tab=nightlife' 
                      : href === '/community?tab=nightlife' 
                      ? location.pathname === '/community' && location.search === '?tab=nightlife' 
                      : location.pathname.startsWith(href.split('?')[0]);

                    return (
                    <Link
                      key={href}
                      to={href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-body text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-terracotta-50 text-terracotta-700 border border-terracotta-100'
                          : 'text-earth-700 hover:bg-ivory-200'
                      }`}
                    >
                      {Icon && <Icon size={18} className="text-earth-400 shrink-0" />}
                      {label}
                    </Link>
                  )})}
                </div>

                <div className="mt-6 pt-6 border-t border-ivory-200 space-y-0.5">
                  <Link
                    to="/listings/create"
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-body text-base font-medium text-earth-700 hover:bg-ivory-200 transition-colors"
                  >
                    <Home size={18} className="text-earth-400 shrink-0" />
                    Become a Host
                  </Link>
                  <Link
                    to="/cars/create"
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-body text-base font-medium text-earth-700 hover:bg-ivory-200 transition-colors"
                  >
                    <Car size={18} className="text-earth-400 shrink-0" />
                    List Your Vehicle
                  </Link>
                </div>
              </nav>

              {/* Auth buttons */}
              <div className="px-5 py-6 border-t border-ivory-200">
                {user ? (
                  <button
                    onClick={async () => {
                      await signOut()
                      navigate('/')
                      setMobileOpen(false)
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-600 font-body text-sm font-semibold hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/auth"
                      className="w-full flex items-center justify-center py-3 rounded-xl border border-ivory-300 text-earth-700 font-body text-sm font-semibold hover:bg-ivory-200 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link to="/auth?mode=signup" className="w-full btn-primary text-center">
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
