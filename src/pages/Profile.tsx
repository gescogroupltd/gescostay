import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Camera, Save, LogOut, Shield, Star, Home, Car, ChevronRight, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { usePageMeta } from '../hooks/usePageMeta'
import ScrollReveal from '../components/ui/ScrollReveal'

export default function ProfilePage() {
  const { user, signOut, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)

  const [stats, setStats] = useState({ bookings: 0, listings: 0, carBookings: 0 })

  usePageMeta({
    title: 'My Profile',
    description: 'Manage your Gescostay profile, bookings and listings.',
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) navigate('/auth')
  }, [user, authLoading, navigate])

  // Load profile data
  useEffect(() => {
    if (!user) return
    const load = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setFirstName(data.first_name || '')
        setLastName(data.last_name || '')
        setAvatarUrl(data.avatar_url || '')
      }

      // Load stats in parallel
      const [{ count: bookCount }, { count: listCount }, { count: carCount }] = await Promise.all([
        supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('properties').select('id', { count: 'exact', head: true }).eq('owner_id', user.id),
        supabase.from('car_bookings').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      ])
      setStats({ bookings: bookCount || 0, listings: listCount || 0, carBookings: carCount || 0 })
      setLoadingProfile(false)
    }
    load()
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    await supabase.from('profiles').upsert({
      id: user.id,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      avatar_url: avatarUrl.trim() || null,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (authLoading || loadingProfile) {
    return (
      <div className="nav-offset min-h-screen bg-ivory-100">
        <div className="container-site py-12 max-w-3xl mx-auto">
          <div className="skeleton h-48 rounded-3xl mb-8" />
          <div className="space-y-4">
            <div className="skeleton h-14 rounded-2xl" />
            <div className="skeleton h-14 rounded-2xl" />
            <div className="skeleton h-14 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || (user?.email?.[0] || 'G').toUpperCase()

  return (
    <div className="nav-offset min-h-screen bg-ivory-100">
      {/* Header banner */}
      <div className="relative bg-earth-950 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        <div className="absolute inset-0 bg-gradient-to-b from-earth-900/60 to-earth-950" />
        <div className="container-site relative z-10 flex items-end gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={firstName}
                className="w-24 h-24 rounded-full object-cover border-4 border-earth-800 shadow-lg"
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full border-4 border-earth-700 flex items-center justify-center text-white text-3xl font-display font-semibold shadow-lg"
                style={{ background: 'linear-gradient(135deg, #CF7348 0%, #BC5F38 100%)' }}
              >
                {initials}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-terracotta-500 border-2 border-earth-950 flex items-center justify-center">
              <Camera size={12} className="text-white" />
            </div>
          </div>

          <div className="pb-1">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-3xl font-semibold text-ivory-50 leading-tight"
            >
              {firstName || 'Your'} {lastName || 'Profile'}
            </motion.h1>
            <p className="font-body text-sm text-earth-400 flex items-center gap-1.5 mt-1">
              <Mail size={13} />
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="container-site py-10 max-w-3xl mx-auto">
        <div className="grid gap-6">

          {/* Stats row */}
          <ScrollReveal>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Bookings', value: stats.bookings, icon: Home, href: '/bookings' },
                { label: 'Listings', value: stats.listings, icon: Star, href: '/listings/create' },
                { label: 'Car Rentals', value: stats.carBookings, icon: Car, href: '/bookings' },
              ].map(({ label, value, icon: Icon, href }) => (
                <Link
                  key={label}
                  to={href}
                  className="bg-white rounded-2xl border border-ivory-300 p-5 flex flex-col items-center text-center hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-terracotta-50 border border-terracotta-100 flex items-center justify-center mb-3">
                    <Icon size={18} className="text-terracotta-600" />
                  </div>
                  <p className="font-display text-2xl font-semibold text-earth-900">{value}</p>
                  <p className="font-body text-xs text-earth-400 mt-0.5">{label}</p>
                </Link>
              ))}
            </div>
          </ScrollReveal>

          {/* Edit profile form */}
          <ScrollReveal delay={80}>
            <div className="bg-white rounded-3xl border border-ivory-300 shadow-card p-7">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl text-earth-900">Personal Information</h2>
                {saved && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="badge badge-forest text-xs"
                  >
                    ✓ Saved
                  </motion.span>
                )}
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-1.5 block">First Name</label>
                    <input
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="Amara"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-1.5 block">Last Name</label>
                    <input
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Diallo"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-1.5 block">Email</label>
                  <input
                    value={user?.email || ''}
                    disabled
                    className="input-field opacity-60 cursor-not-allowed"
                  />
                  <p className="font-body text-xs text-earth-400 mt-1.5">Contact support to change your email address.</p>
                </div>

                <div>
                  <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-1.5 block">Avatar URL</label>
                  <input
                    value={avatarUrl}
                    onChange={e => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="input-field"
                  />
                  <p className="font-body text-xs text-earth-400 mt-1.5">Paste a link to your profile photo.</p>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary w-full sm:w-auto justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <>
                      <Save size={15} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Quick links */}
          <ScrollReveal delay={120}>
            <div className="bg-white rounded-3xl border border-ivory-300 shadow-card p-7">
              <h2 className="font-display text-xl text-earth-900 mb-4">Account</h2>
              <div className="space-y-1">
                {[
                  { icon: Home,    label: 'My Bookings',     href: '/bookings' },
                  { icon: Star,    label: 'My Listings',     href: '/listings/create' },
                  { icon: Car,     label: 'My Car Rentals',  href: '/bookings' },
                  { icon: Shield,  label: 'Safety & Trust',  href: '/safety' },
                ].map(({ icon: Icon, label, href }) => (
                  <Link
                    key={label}
                    to={href}
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-ivory-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className="text-earth-400 group-hover:text-earth-700 transition-colors" />
                      <span className="font-body text-sm text-earth-700 group-hover:text-earth-900">{label}</span>
                    </div>
                    <ChevronRight size={14} className="text-earth-300 group-hover:text-earth-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Danger zone */}
          <ScrollReveal delay={160}>
            <div className="rounded-3xl border border-red-100 p-7">
              <h2 className="font-display text-xl text-earth-900 mb-2">Sign Out</h2>
              <p className="font-body text-sm text-earth-500 mb-5">You will be signed out of your Gescostay account on this device.</p>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-red-200 text-red-600 font-body text-sm font-semibold hover:bg-red-50 transition-colors"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </div>
  )
}
