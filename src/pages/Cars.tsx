import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { supabase, type Car } from '../lib/supabase'
import CarCard, { CarCardSkeleton } from '../components/ui/CarCard'
import ScrollReveal from '../components/ui/ScrollReveal'
import { useDebounce } from '../hooks/useDebounce'
import { usePageMeta } from '../hooks/usePageMeta'

const TRANSMISSIONS = ['Automatic', 'Manual']
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid']

export default function Cars() {
  const [searchParams] = useSearchParams()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [sort, setSort] = useState('newest')
  const [maxPrice, setMaxPrice] = useState('')
  const [seats, setSeats] = useState('')
  const [transmission, setTransmission] = useState('')
  const [fuelType, setFuelType] = useState('')

  // SEO
  usePageMeta({
    title: 'Premium Car Rentals',
    description: 'Find high-quality vehicles for rent across Africa. Automatic, manual, electric and more.',
  })

  // Debounced location to avoid excessive Supabase queries
  const debouncedLocation = useDebounce(location, 350)

  const fetchCars = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('cars').select('*').eq('status', 'approved')
    if (debouncedLocation) query = query.ilike('location', `%${debouncedLocation}%`)
    if (maxPrice) query = query.lte('price_day', Number(maxPrice))
    if (seats) query = query.gte('seats', Number(seats))
    if (transmission) query = query.eq('transmission', transmission)
    if (fuelType) query = query.eq('fuel_type', fuelType)
    if (sort === 'price_asc') query = query.order('price_day', { ascending: true })
    else if (sort === 'price_desc') query = query.order('price_day', { ascending: false })
    else query = query.order('created_at', { ascending: false })
    const { data } = await query.limit(48)
    setCars(data || [])
    setLoading(false)
  }, [debouncedLocation, sort, maxPrice, seats, transmission, fuelType])

  useEffect(() => { fetchCars() }, [fetchCars])

  const hasFilters = location || maxPrice || seats || transmission || fuelType

  const clearFilters = () => {
    setLocation(''); setMaxPrice(''); setSeats(''); setTransmission(''); setFuelType('')
  }

  return (
    <div className="min-h-screen bg-ivory-100 nav-offset">
      <div className="relative bg-earth-950 py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-950 to-transparent opacity-80" />
        <div className="container-site relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="eyebrow text-terracotta-400 mb-3">On the Road</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-ivory-50 mb-3 tracking-tight">
              Premium Car Rentals
            </h1>
            <p className="font-body text-earth-300 text-lg max-w-xl">
              {loading ? 'Finding the best vehicles for you...' : `Discover ${cars.length} high-quality vehicles for your next adventure.`}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-site pb-12">
        {/* Sticky Controls */}
        <div className="relative md:sticky md:top-[6rem] z-30 bg-ivory-100/90 md:backdrop-blur-[24px] py-4 -mx-4 px-4 sm:mx-0 sm:px-0 mb-8 border-b border-ivory-200/50 shadow-[0_12px_24px_-12px_rgba(30,18,8,0.05)] transition-all grid grid-cols-2 sm:flex sm:flex-row gap-3">
          <div className="col-span-2 sm:col-span-1 relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400" />
            <input type="text" value={location} onChange={e => setLocation(e.target.value)}
              placeholder="Search by city or country..." className="input-field pl-10" />
          </div>
          <button onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-body text-sm font-medium transition-all ${hasFilters ? 'border-terracotta-400 bg-terracotta-50 text-terracotta-600' : 'border-ivory-400 bg-white text-earth-700 hover:border-ivory-500'}`}>
            <SlidersHorizontal size={16} /> Filters
          </button>
          <div className="relative">
            <select value={sort} onChange={e => setSort(e.target.value)} className="input-field pr-10 appearance-none cursor-pointer w-full sm:min-w-[160px]">
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>
            <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 pointer-events-none" />
          </div>
        </div>

        {/* Filter panel */}
        {filtersOpen && (
          <div className="bg-white rounded-2xl border border-ivory-300 p-6 mb-8 shadow-soft-md animate-scale-in origin-top">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-medium text-earth-900">Filter Vehicles</h3>
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1.5 font-body text-sm font-medium text-terracotta-600 hover:text-terracotta-700 transition-colors bg-terracotta-50 px-3 py-1.5 rounded-full">
                  <X size={14} /> Clear all
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wider mb-2.5 block">Max Price / Day</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400 font-medium">$</span>
                  <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Any price" className="input-field pl-8 text-sm" />
                </div>
              </div>
              <div>
                <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wider mb-2.5 block">Min. Seats</label>
                <div className="relative">
                  <select value={seats} onChange={e => setSeats(e.target.value)} className="input-field appearance-none cursor-pointer text-sm">
                    <option value="">Any number of seats</option>
                    {[2, 4, 5, 7, 8].map(n => <option key={n} value={n}>{n}+ seats</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-earth-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wider mb-2.5 block">Transmission</label>
                <div className="flex gap-2">
                  {TRANSMISSIONS.map(t => (
                    <button key={t} onClick={() => setTransmission(transmission === t ? '' : t)}
                      className={`flex-1 py-2 rounded-xl font-body text-sm font-medium transition-all duration-200 border ${
                        transmission === t 
                          ? 'border-terracotta-500 bg-terracotta-50 text-terracotta-700 shadow-sm shadow-terracotta-600/10' 
                          : 'border-ivory-300 text-earth-700 hover:border-ivory-400 bg-white'
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wider mb-2.5 block">Fuel Type</label>
                <div className="flex flex-wrap gap-2">
                  {FUEL_TYPES.map(f => (
                    <button key={f} onClick={() => setFuelType(fuelType === f ? '' : f)}
                      className={`px-3 py-1.5 rounded-full font-body text-xs font-medium transition-all duration-200 ${
                        fuelType === f 
                          ? 'bg-terracotta-600 text-white shadow-md shadow-terracotta-600/20' 
                          : 'bg-ivory-200/70 text-earth-700 hover:bg-ivory-300'
                      }`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <CarCardSkeleton key={i} />)}
          </div>
        ) : cars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {cars.map((car, i) => (
              <ScrollReveal key={car.id} delay={Math.min(i * 50, 300)}>
                <CarCard car={car} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-ivory-200 flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-earth-300" />
            </div>
            <h3 className="font-display text-xl text-earth-700 mb-2">No vehicles found</h3>
            <p className="font-body text-earth-400 mb-6">Try different filters or a different location.</p>
            <button onClick={clearFilters} className="btn-secondary">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  )
}
