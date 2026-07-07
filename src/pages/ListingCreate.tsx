import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { X, ChevronRight, Home } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const STEPS = ['Property Type', 'Basic Details', 'Photos & Price', 'Review']
const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment', desc: 'A flat or unit in a building' },
  { value: 'villa', label: 'Villa', desc: 'Private home with outdoor space' },
  { value: 'guest_house', label: 'Guest House', desc: 'Separate accommodation on property' },
  { value: 'lodge', label: 'Lodge', desc: 'Nature or safari accommodation' },
  { value: 'studio', label: 'Studio', desc: 'Open-plan single room' },
  { value: 'entire_home', label: 'Entire Home', desc: 'Full house, exclusive to guests' },
]

export default function ListingCreate() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    property_type: '',
    title: '',
    description: '',
    location: '',
    beds: 1,
    baths: 1,
    price: '',
    currency: 'USD',
    amenities: [] as string[],
    images: [] as string[],
  })

  const update = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const amenityList = ['WiFi', 'Air Conditioning', 'Pool', 'Parking', 'Kitchen', 'Washer', 'TV', 'Security Guard', 'Generator', 'Water Heater']

  const toggleAmenity = (a: string) =>
    update('amenities', form.amenities.includes(a) ? form.amenities.filter(x => x !== a) : [...form.amenities, a])

  const handleSubmit = async () => {
    if (!user) { navigate('/auth'); return }
    setSubmitting(true)
    setError('')
    const { error: err } = await supabase.from('properties').insert({
      ...form,
      price: Number(form.price),
      owner_id: user.id,
      status: 'pending',
    })
    setSubmitting(false)
    if (err) setError(err.message)
    else navigate('/listings')
  }

  if (!user) return (
    <div className="nav-offset min-h-screen bg-ivory-100 flex items-center justify-center">
      <div className="text-center">
        <h2 className="font-display text-2xl text-earth-900 mb-4">Sign in to list your property</h2>
        <Link to="/auth" className="btn-primary">Sign In</Link>
      </div>
    </div>
  )

  return (
    <div className="nav-offset min-h-screen bg-ivory-100">
      {/* Header */}
      <div className="bg-white border-b border-ivory-300">
        <div className="container-site py-5 flex items-center gap-4">
          <Home size={20} className="text-terracotta-500" />
          <h1 className="font-display text-xl font-medium text-earth-900">List Your Property</h1>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white border-b border-ivory-300">
        <div className="container-site py-4">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
                <div className={`flex items-center gap-2 ${i <= step ? 'text-terracotta-600' : 'text-earth-300'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-body transition-all ${i < step ? 'bg-terracotta-600 text-white' : i === step ? 'bg-terracotta-100 border-2 border-terracotta-500 text-terracotta-600' : 'bg-ivory-200 text-earth-400'}`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className="hidden sm:block font-body text-xs font-medium">{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`h-px flex-1 mx-2 transition-all ${i < step ? 'bg-terracotta-400' : 'bg-ivory-300'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-site py-10 max-w-2xl overflow-hidden min-h-[60vh]">
        {error && (
           <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 font-body text-sm mb-6 flex items-center gap-2">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
             {error}
           </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Step 0: Type */}
        {step === 0 && (
          <div>
            <h2 className="font-display text-display-sm text-earth-900 mb-2">What type of property?</h2>
            <p className="font-body text-earth-500 mb-8">This helps guests find exactly what they're looking for.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROPERTY_TYPES.map(({ value, label, desc }) => (
                <button key={value} onClick={() => update('property_type', value)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 ${form.property_type === value ? 'border-terracotta-500 bg-terracotta-50' : 'border-ivory-300 bg-white hover:border-ivory-500'}`}>
                  <p className="font-display text-base font-medium text-earth-900 mb-1">{label}</p>
                  <p className="font-body text-xs text-earth-500">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <div>
            <h2 className="font-display text-display-sm text-earth-900 mb-2">Tell us about your place</h2>
            <p className="font-body text-earth-500 mb-8">The more detail, the more bookings you'll get.</p>
            <div className="space-y-5">
              <div>
                <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-2 block">Property Title *</label>
                <input value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Serene beachfront villa in Saly" className="input-field bg-ivory-50/50 hover:bg-white focus:bg-white transition-colors" />
              </div>
              <div>
                <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-2 block">Description *</label>
                <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={5} placeholder="Describe your space — what makes it special, the neighborhood, nearby attractions..." className="input-field resize-none bg-ivory-50/50 hover:bg-white focus:bg-white transition-colors" />
              </div>
              <div>
                <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-2 block">Location *</label>
                <input value={form.location} onChange={e => update('location', e.target.value)} placeholder="e.g. Dakar, Senegal" className="input-field bg-ivory-50/50 hover:bg-white focus:bg-white transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-2 block">Bedrooms</label>
                  <div className="flex items-center gap-3 input-field justify-between py-2.5">
                    <button onClick={() => update('beds', Math.max(1, form.beds - 1))} className="w-8 h-8 rounded-full border border-ivory-400 flex items-center justify-center text-earth-600 hover:bg-ivory-100">−</button>
                    <span className="font-display text-xl">{form.beds}</span>
                    <button onClick={() => update('beds', form.beds + 1)} className="w-8 h-8 rounded-full border border-ivory-400 flex items-center justify-center text-earth-600 hover:bg-ivory-100">+</button>
                  </div>
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-2 block">Bathrooms</label>
                  <div className="flex items-center gap-3 input-field justify-between py-2.5">
                    <button onClick={() => update('baths', Math.max(1, form.baths - 1))} className="w-8 h-8 rounded-full border border-ivory-400 flex items-center justify-center text-earth-600 hover:bg-ivory-100">−</button>
                    <span className="font-display text-xl">{form.baths}</span>
                    <button onClick={() => update('baths', form.baths + 1)} className="w-8 h-8 rounded-full border border-ivory-400 flex items-center justify-center text-earth-600 hover:bg-ivory-100">+</button>
                  </div>
                </div>
              </div>
              <div>
                <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-3 block">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {amenityList.map(a => (
                    <button key={a} onClick={() => toggleAmenity(a)}
                      className={`px-3 py-1.5 rounded-full font-body text-sm transition-all ${form.amenities.includes(a) ? 'bg-terracotta-600 text-white' : 'bg-ivory-200 text-earth-700 hover:bg-ivory-300'}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Photos & Price */}
        {step === 2 && (
          <div>
            <h2 className="font-display text-display-sm text-earth-900 mb-2">Photos & Pricing</h2>
            <p className="font-body text-earth-500 mb-8">Great photos earn 40% more bookings.</p>
            <div className="space-y-6">
              <div>
                <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-2 block">Image URLs</label>
                <p className="font-body text-xs text-earth-400 mb-3">Add Supabase storage URLs or external image links (one per line)</p>
                <textarea
                  value={form.images.join('\n')}
                  onChange={e => update('images', e.target.value.split('\n').filter(Boolean))}
                  rows={4}
                  placeholder="https://your-storage.supabase.co/storage/v1/object/public/property-images/..."
                  className="input-field resize-none font-body text-sm bg-ivory-50/50 hover:bg-white focus:bg-white transition-colors"
                />
                {form.images.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {form.images.slice(0, 5).map((url, i) => (
                      <div key={i} className="w-20 h-16 rounded-xl overflow-hidden bg-ivory-200 relative group">
                        <img src={url} alt="" className="img-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                        <button onClick={() => update('images', form.images.filter((_, j) => j !== i))}
                          className="absolute inset-0 bg-earth-950/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <X size={14} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-2 block">Price per Night *</label>
                  <input type="number" value={form.price} onChange={e => update('price', e.target.value)} placeholder="0" className="input-field bg-ivory-50/50 hover:bg-white focus:bg-white transition-colors" min="0" />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-2 block">Currency</label>
                  <select value={form.currency} onChange={e => update('currency', e.target.value)} className="input-field cursor-pointer bg-ivory-50/50 hover:bg-white focus:bg-white transition-colors">
                    {['USD', 'EUR', 'GBP', 'GMD', 'XOF', 'GHS', 'NGN', 'KES', 'ZAR'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div>
            <h2 className="font-display text-display-sm text-earth-900 mb-2">Review your listing</h2>
            <p className="font-body text-earth-500 mb-8">Once submitted, our team will review and approve within 24 hours.</p>
            <div className="bg-white rounded-2xl border border-ivory-300 p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm font-body">
                <div><p className="text-earth-400 mb-1">Type</p><p className="text-earth-900 font-medium capitalize">{form.property_type.replace('_', ' ')}</p></div>
                <div><p className="text-earth-400 mb-1">Location</p><p className="text-earth-900 font-medium">{form.location || '—'}</p></div>
                <div><p className="text-earth-400 mb-1">Bedrooms</p><p className="text-earth-900 font-medium">{form.beds}</p></div>
                <div><p className="text-earth-400 mb-1">Bathrooms</p><p className="text-earth-900 font-medium">{form.baths}</p></div>
                <div><p className="text-earth-400 mb-1">Price / Night</p><p className="text-earth-900 font-medium">{form.price} {form.currency}</p></div>
                <div><p className="text-earth-400 mb-1">Photos</p><p className="text-earth-900 font-medium">{form.images.length} added</p></div>
              </div>
              <div className="divider" />
              <div><p className="text-earth-400 text-sm mb-1 font-body">Title</p><p className="text-earth-900 font-body">{form.title || '—'}</p></div>
              {form.amenities.length > 0 && (
                <div>
                  <p className="text-earth-400 text-sm mb-2 font-body">Amenities</p>
                  <div className="flex flex-wrap gap-1.5">{form.amenities.map(a => <span key={a} className="badge bg-ivory-200 text-earth-700">{a}</span>)}</div>
                </div>
              )}
            </div>
          </div>
        )}

        </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
            className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed">
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)}
              disabled={step === 0 && !form.property_type}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting || !form.title || !form.location || !form.price}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
              {submitting ? 'Submitting...' : 'Submit for Review'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
