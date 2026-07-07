import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ChevronRight, Car } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const STEPS = ['Vehicle Info', 'Details & Features', 'Photos & Price', 'Review']

export default function CarCreate() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    make: '', model: '', year: new Date().getFullYear(),
    location: '', description: '',
    seats: 5, transmission: 'Automatic', fuel_type: 'Petrol',
    price_day: '', price_week: '', price_month: '', currency: 'USD',
    features: [] as string[], images: [] as string[],
  })

  const update = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))
  const featureList = ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'USB Charging', 'Rear Camera', 'Sunroof', 'Child Seat', '4WD']
  const toggleFeature = (f: string) => update('features', form.features.includes(f) ? form.features.filter(x => x !== f) : [...form.features, f])

  const handleSubmit = async () => {
    if (!user) { navigate('/auth'); return }
    setSubmitting(true)
    const { error: err } = await supabase.from('cars').insert({
      ...form,
      price_day: Number(form.price_day),
      price_week: form.price_week ? Number(form.price_week) : null,
      price_month: form.price_month ? Number(form.price_month) : null,
      owner_id: user.id, status: 'pending',
    })
    setSubmitting(false)
    if (err) setError(err.message)
    else navigate('/cars')
  }

  if (!user) return (
    <div className="nav-offset min-h-screen flex items-center justify-center bg-ivory-100">
      <div className="text-center">
        <h2 className="font-display text-2xl text-earth-900 mb-4">Sign in to list your vehicle</h2>
        <Link to="/auth" className="btn-primary">Sign In</Link>
      </div>
    </div>
  )

  return (
    <div className="nav-offset min-h-screen bg-ivory-100">
      <div className="bg-white border-b border-ivory-300">
        <div className="container-site py-5 flex items-center gap-4">
          <Car size={20} className="text-terracotta-500" />
          <h1 className="font-display text-xl font-medium text-earth-900">List Your Vehicle</h1>
        </div>
      </div>

      {/* Progress */}
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
        {step === 0 && (
          <div>
            <h2 className="font-display text-display-sm text-earth-900 mb-2">Vehicle details</h2>
            <p className="font-body text-earth-500 mb-8">Start with the basics about your car.</p>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-2 block">Make *</label>
                  <input value={form.make} onChange={e => update('make', e.target.value)} placeholder="e.g. Toyota" className="input-field bg-ivory-50/50 hover:bg-white focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-2 block">Model *</label>
                  <input value={form.model} onChange={e => update('model', e.target.value)} placeholder="e.g. Land Cruiser" className="input-field bg-ivory-50/50 hover:bg-white focus:bg-white transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-2 block">Year</label>
                  <input type="number" value={form.year} onChange={e => update('year', Number(e.target.value))} min="1990" max={new Date().getFullYear() + 1} className="input-field bg-ivory-50/50 hover:bg-white focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-2 block">Number of Seats</label>
                  <div className="flex items-center gap-3 input-field justify-between py-2.5">
                    <button onClick={() => update('seats', Math.max(2, form.seats - 1))} className="w-8 h-8 rounded-full border border-ivory-400 flex items-center justify-center text-earth-600 hover:bg-ivory-100">−</button>
                    <span className="font-display text-xl">{form.seats}</span>
                    <button onClick={() => update('seats', Math.min(15, form.seats + 1))} className="w-8 h-8 rounded-full border border-ivory-400 flex items-center justify-center text-earth-600 hover:bg-ivory-100">+</button>
                  </div>
                </div>
              </div>
              <div>
                <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-2 block">Location *</label>
                <input value={form.location} onChange={e => update('location', e.target.value)} placeholder="e.g. Accra, Ghana" className="input-field bg-ivory-50/50 hover:bg-white focus:bg-white transition-colors" />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-display text-display-sm text-earth-900 mb-2">Details & Features</h2>
            <p className="font-body text-earth-500 mb-8">Help guests understand what makes your vehicle special.</p>
            <div className="space-y-5">
              <div>
                <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-2 block">Description</label>
                <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={4} placeholder="Describe your vehicle — condition, ideal use cases, any restrictions..." className="input-field resize-none bg-ivory-50/50 hover:bg-white focus:bg-white transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-2 block">Transmission</label>
                  <div className="flex gap-2">
                    {['Automatic', 'Manual'].map(t => (
                      <button key={t} onClick={() => update('transmission', t)} className={`flex-1 py-3 rounded-xl border font-body text-sm transition-all ${form.transmission === t ? 'border-terracotta-500 bg-terracotta-50 text-terracotta-600' : 'border-ivory-300 bg-white text-earth-700 hover:border-ivory-500'}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-2 block">Fuel Type</label>
                  <div className="flex flex-wrap gap-2">
                    {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map(f => (
                      <button key={f} onClick={() => update('fuel_type', f)} className={`px-3 py-1.5 rounded-full font-body text-xs font-medium transition-all ${form.fuel_type === f ? 'bg-terracotta-600 text-white' : 'bg-ivory-200 text-earth-700 hover:bg-ivory-300'}`}>{f}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-3 block">Features</label>
                <div className="flex flex-wrap gap-2">
                  {featureList.map(f => (
                    <button key={f} onClick={() => toggleFeature(f)} className={`px-3 py-1.5 rounded-full font-body text-sm transition-all ${form.features.includes(f) ? 'bg-terracotta-600 text-white' : 'bg-ivory-200 text-earth-700 hover:bg-ivory-300'}`}>{f}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-display text-display-sm text-earth-900 mb-2">Photos & Pricing</h2>
            <p className="font-body text-earth-500 mb-8">Set competitive prices and add clear photos.</p>
            <div className="space-y-5">
              <div>
                <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-2 block">Image URLs</label>
                <textarea value={form.images.join('\n')} onChange={e => update('images', e.target.value.split('\n').filter(Boolean))} rows={3} placeholder="Paste image URLs one per line" className="input-field resize-none text-sm bg-ivory-50/50 hover:bg-white focus:bg-white transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-2 block">Price / Day *</label>
                  <input type="number" value={form.price_day} onChange={e => update('price_day', e.target.value)} placeholder="0" className="input-field bg-ivory-50/50 hover:bg-white focus:bg-white transition-colors" min="0" />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-2 block">Currency</label>
                  <select value={form.currency} onChange={e => update('currency', e.target.value)} className="input-field cursor-pointer bg-ivory-50/50 hover:bg-white focus:bg-white transition-colors">
                    {['USD', 'EUR', 'GBP', 'GMD', 'XOF', 'GHS', 'NGN', 'KES', 'ZAR'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-2 block">Price / Week (optional)</label>
                  <input type="number" value={form.price_week} onChange={e => update('price_week', e.target.value)} placeholder="0" className="input-field bg-ivory-50/50 hover:bg-white focus:bg-white transition-colors" min="0" />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wide mb-2 block">Price / Month (optional)</label>
                  <input type="number" value={form.price_month} onChange={e => update('price_month', e.target.value)} placeholder="0" className="input-field bg-ivory-50/50 hover:bg-white focus:bg-white transition-colors" min="0" />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-display text-display-sm text-earth-900 mb-2">Review your listing</h2>
            <p className="font-body text-earth-500 mb-8">Submitted vehicles are reviewed and approved within 24 hours.</p>
            <div className="bg-white rounded-2xl border border-ivory-300 p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm font-body">
                <div><p className="text-earth-400 mb-1">Vehicle</p><p className="text-earth-900 font-medium">{form.make} {form.model} ({form.year})</p></div>
                <div><p className="text-earth-400 mb-1">Location</p><p className="text-earth-900 font-medium">{form.location || '—'}</p></div>
                <div><p className="text-earth-400 mb-1">Seats</p><p className="text-earth-900 font-medium">{form.seats}</p></div>
                <div><p className="text-earth-400 mb-1">Transmission</p><p className="text-earth-900 font-medium">{form.transmission}</p></div>
                <div><p className="text-earth-400 mb-1">Price / Day</p><p className="text-earth-900 font-medium">{form.price_day} {form.currency}</p></div>
                <div><p className="text-earth-400 mb-1">Photos</p><p className="text-earth-900 font-medium">{form.images.length} added</p></div>
              </div>
            </div>
          </div>
        )}

        </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-10">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0} className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed">Back</button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={step === 0 && (!form.make || !form.model || !form.location)} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">Continue <ChevronRight size={16} /></button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting || !form.make || !form.model || !form.price_day} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
              {submitting ? 'Submitting...' : 'Submit for Review'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
