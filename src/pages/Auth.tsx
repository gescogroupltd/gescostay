import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { usePageMeta } from '../hooks/usePageMeta'

export default function Auth() {
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState<'signin' | 'signup'>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'signin'
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  usePageMeta({
    title: mode === 'signin' ? 'Sign In' : 'Create Account',
    description: 'Sign in or create your Gescostay account to book authentic African stays and experiences.',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (mode === 'signin') {
      const { error } = await signIn(email, password)
      if (error) setError(error.message)
      else navigate('/')
    } else {
      if (!firstName.trim()) { setError('First name is required'); setLoading(false); return }
      const { error } = await signUp(email, password, firstName, lastName)
      if (error) setError(error.message)
      else setSuccess('Account created! Please check your email to verify your account.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-ivory-100 nav-offset flex">
      {/* Left: editorial image */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80"
          alt="African hospitality"
          className="img-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-earth-950/60 to-transparent" />
        <div className="absolute bottom-12 left-12 right-20">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-4">
            <path d="M16 3L4 12V29H13V20H19V29H28V12L16 3Z" fill="#FAF7F2" />
            <circle cx="23" cy="9" r="5" fill="#C4653A" />
          </svg>
          <p className="font-display text-3xl font-semibold text-ivory-50 leading-tight mb-3">
            "The spirit of African hospitality — experienced, not imagined."
          </p>
          <p className="font-body text-sm text-ivory-300">Join 50,000+ travelers who book with Gescostay</p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">


          <h1 className="font-display text-display-sm text-earth-900 mb-2">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="font-body text-earth-500 mb-8">
            {mode === 'signin'
              ? 'Sign in to your Gescostay account'
              : 'Join the African hospitality community'}
          </p>

          {/* Toggle */}
          <div className="relative flex bg-ivory-200/60 p-1 rounded-xl mb-8 border border-ivory-300">
            {['signin', 'signup'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setMode(tab as 'signin' | 'signup'); setError(''); setSuccess('') }}
                className={`relative flex-1 py-2.5 text-sm font-medium transition-colors z-10 ${
                  mode === tab ? 'text-earth-900' : 'text-earth-500 hover:text-earth-700'
                }`}
              >
                {tab === 'signin' ? 'Sign In' : 'Sign Up'}
                {mode === tab && (
                  <motion.div
                    layoutId="authTab"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm border border-ivory-200/50"
                    initial={false}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    style={{ zIndex: -1 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-ivory-200 p-8">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 font-body text-sm mb-6 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-forest-50 border border-forest-200 text-forest-700 rounded-xl px-4 py-3 font-body text-sm mb-6 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                {success}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'signup' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-1.5 block">First Name</label>
                    <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Amara" className="input-field bg-ivory-50/50 hover:bg-white focus:bg-white" required />
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-1.5 block">Last Name</label>
                    <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Diallo" className="input-field bg-ivory-50/50 hover:bg-white focus:bg-white" />
                  </div>
                </motion.div>
              )}

              <div>
                <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-1.5 block">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="input-field bg-ivory-50/50 hover:bg-white focus:bg-white" required />
              </div>

              <div>
                <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-1.5 block">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'Min. 8 characters' : '••••••••'}
                    className="input-field pr-11 bg-ivory-50/50 hover:bg-white focus:bg-white"
                    required
                    minLength={mode === 'signup' ? 8 : 1}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600 transition-colors">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-terracotta-500/20"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                  </span>
                ) : (
                  <>
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="font-body text-xs text-earth-400 text-center mt-6">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-terracotta-600 hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-terracotta-600 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
