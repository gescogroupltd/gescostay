import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, MapPin, ChevronDown } from 'lucide-react'
import { supabase, type Property } from '../lib/supabase'
import ListingCard, { ListingCardSkeleton } from '../components/ui/ListingCard'
import ScrollReveal from '../components/ui/ScrollReveal'

const PROPERTY_TYPES = ['Apartment', 'Villa', 'Guest House', 'Lodge', 'Studio', 'Hotel Room', 'Entire Home']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
]

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Filter state
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [sort, setSort] = useState('newest')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [beds, setBeds] = useState('')
  const [types, setTypes] = useState<string[]>([])

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('properties')
      .select('*')
      .eq('status', 'approved')

    if (location) query = query.ilike('location', `%${location}%`)
    if (minPrice) query = query.gte('price', Number(minPrice))
    if (maxPrice) query = query.lte('price', Number(maxPrice))
    if (beds) query = query.gte('beds', Number(beds))
    if (types.length > 0) query = query.in('property_type', types)

    if (sort === 'price_asc') query = query.order('price', { ascending: true })
    else if (sort === 'price_desc') query = query.order('price', { ascending: false })
    else if (sort === 'rating') query = query.order('rating', { ascending: false })
    else query = query.order('created_at', { ascending: false })

    const { data } = await query.limit(48)
    setProperties(data || [])
    setLoading(false)
  }, [location, sort, minPrice, maxPrice, beds, types])

  useEffect(() => { fetchProperties() }, [fetchProperties])

  const toggleType = (t: string) =>
    setTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  const clearFilters = () => {
    setLocation(''); setMinPrice(''); setMaxPrice(''); setBeds(''); setTypes([])
    setSearchParams({})
  }

  const hasFilters = location || minPrice || maxPrice || beds || types.length > 0

  return (
    <div className="min-h-screen bg-ivory-100 nav-offset">
      {/* Page header */}
      <div className="relative bg-earth-950 py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-950 to-transparent opacity-80" />
        <div className="container-site relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="eyebrow text-terracotta-400 mb-3">Explore Africa</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-ivory-50 mb-3 tracking-tight">
              Extraordinary Stays
            </h1>
            <p className="font-body text-earth-300 text-lg max-w-xl">
              {loading ? 'Finding the best stays for you...' : `Discover ${properties.length} handpicked properties designed for comfort and luxury.`}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-site pb-12">
        {/* Sticky Search + Sort bar */}
        <div className="sticky top-[5.5rem] md:top-[6rem] z-30 bg-ivory-100/90 backdrop-blur-[24px] py-4 -mx-4 px-4 sm:mx-0 sm:px-0 mb-8 border-b border-ivory-200/50 shadow-[0_12px_24px_-12px_rgba(30,18,8,0.05)] transition-all grid grid-cols-2 sm:flex sm:flex-row gap-3">
          <div className="col-span-2 sm:col-span-1 relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400" />
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Search by city or country..."
              className="input-field pl-10"
            />
          </div>

          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-body text-sm font-medium transition-all duration-200 ${
              hasFilters
                ? 'border-terracotta-400 bg-terracotta-50 text-terracotta-600'
                : 'border-ivory-400 bg-white text-earth-700 hover:border-ivory-500'
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasFilters && <span className="w-5 h-5 rounded-full bg-terracotta-600 text-white text-xs flex items-center justify-center">{[location, minPrice, maxPrice, beds].filter(Boolean).length + types.length}</span>}
          </button>

          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="input-field pr-10 appearance-none cursor-pointer w-full sm:min-w-[180px]"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 pointer-events-none" />
          </div>
        </div>

        {/* Filter panel */}
        {filtersOpen && (
          <div className="bg-white rounded-2xl border border-ivory-300 p-6 mb-8 shadow-soft-md animate-scale-in origin-top">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-medium text-earth-900">Filter Stays</h3>
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1.5 font-body text-sm font-medium text-terracotta-600 hover:text-terracotta-700 transition-colors bg-terracotta-50 px-3 py-1.5 rounded-full">
                  <X size={14} /> Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Location */}
              <div>
                <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wider mb-2.5 block">Location</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400" />
                  <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City or country" className="input-field pl-10 text-sm" />
                </div>
              </div>

              {/* Price range */}
              <div>
                <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wider mb-2.5 block">Price / Night</label>
                <div className="flex items-center gap-2">
                  <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Min $" className="input-field text-sm w-full" />
                  <span className="text-earth-400 font-medium">-</span>
                  <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Max $" className="input-field text-sm w-full" />
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wider mb-2.5 block">Min. Bedrooms</label>
                <div className="relative">
                  <select value={beds} onChange={e => setBeds(e.target.value)} className="input-field appearance-none cursor-pointer text-sm">
                    <option value="">Any number of beds</option>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+ bed{n > 1 ? 's' : ''}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-earth-400 pointer-events-none" />
                </div>
              </div>

              {/* Property type */}
              <div>
                <label className="font-body text-xs font-semibold text-earth-600 uppercase tracking-wider mb-2.5 block">Property Type</label>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map(t => (
                    <button
                      key={t}
                      onClick={() => toggleType(t)}
                      className={`px-3 py-1.5 rounded-full font-body text-xs font-medium transition-all duration-200 ${
                        types.includes(t)
                          ? 'bg-terracotta-600 text-white shadow-md shadow-terracotta-600/20'
                          : 'bg-ivory-200/70 text-earth-700 hover:bg-ivory-300'
                      }`}
                    >
                      {t}
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
            {Array.from({ length: 8 }).map((_, i) => <ListingCardSkeleton key={i} />)}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {properties.map((p, i) => (
              <ScrollReveal key={p.id} delay={Math.min(i * 50, 300)}>
                <ListingCard property={p} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-ivory-200 flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-earth-300" />
            </div>
            <h3 className="font-display text-xl text-earth-700 mb-2">No stays found</h3>
            <p className="font-body text-earth-400 mb-6">Try adjusting your filters or search in a different location.</p>
            <button onClick={clearFilters} className="btn-secondary">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  )
}
