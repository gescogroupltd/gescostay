import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, MapPin, Star, Clock, Phone, Globe, Utensils, Music, Coffee, Wine, Drum } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from '../components/ui/ScrollReveal'
import { usePageMeta } from '../hooks/usePageMeta'
import { useDebounce } from '../hooks/useDebounce'

type Tab = 'restaurants' | 'nightlife'

// ─── Static sample data (will be replaced by Supabase queries once tables exist) ──
const RESTAURANTS = [
  { id: '1', name: 'La Terrasse du Sahel',   city: 'Dakar, Senegal',      cuisine: 'Senegalese', rating: 4.9, reviews: 312, price: '$$',   open: 'Open now',  image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=75', tags: ['Terrace', 'Seafood', 'Local'] },
  { id: '2', name: 'Bukka Hut',              city: 'Lagos, Nigeria',      cuisine: 'Nigerian',   rating: 4.8, reviews: 208, price: '$',    open: 'Open now',  image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=75', tags: ['Street Food', 'Lunch'] },
  { id: '3', name: 'The View at Kilimanî', city: 'Nairobi, Kenya',      cuisine: 'Pan-African', rating: 4.7, reviews: 415, price: '$$$',  open: 'Open now',  image: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=600&q=75', tags: ['Rooftop', 'Fine Dining'] },
  { id: '4', name: 'Meze by the Bosphorus', city: 'Accra, Ghana',        cuisine: 'Lebanese',   rating: 4.6, reviews: 176, price: '$$',   open: 'Closes 23h', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=75', tags: ['Cocktails', 'Sharing'] },
  { id: '5', name: 'Mama Osei Kitchen',      city: 'Kumasi, Ghana',      cuisine: 'Ghanaian',   rating: 4.8, reviews: 290, price: '$',    open: 'Open now',  image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=75', tags: ['Authentic', 'Family'] },
  { id: '6', name: 'Jardin de Marrakech',    city: 'Marrakech, Morocco', cuisine: 'Moroccan',   rating: 4.9, reviews: 540, price: '$$$',  open: 'Open now',  image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=75', tags: ['Garden', 'Traditional'] },
]

const NIGHTLIFE = [
  { id: '1', name: 'Chez Binta Jazz Club',    city: 'Dakar, Senegal',        type: 'Jazz Bar',  rating: 4.8, reviews: 198, price: '$$',  open: 'Opens 20h', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=75', tags: ['Live Music', 'Jazz', 'Cocktails'] },
  { id: '2', name: 'Club Koko',               city: 'Lagos, Nigeria',         type: 'Nightclub', rating: 4.7, reviews: 344, price: '$$$', open: 'Opens 22h', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=75', tags: ['Afrobeats', 'Dancing'] },
  { id: '3', name: 'Nyama Choma Lounge',      city: 'Nairobi, Kenya',         type: 'Lounge',    rating: 4.6, reviews: 212, price: '$$',  open: 'Open now',  image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&q=75', tags: ['BBQ', 'Drinks', 'Rooftop'] },
  { id: '4', name: 'Zanzibar Sunset Bar',     city: 'Zanzibar, Tanzania',     type: 'Beach Bar', rating: 4.9, reviews: 421, price: '$$',  open: 'Open now',  image: 'https://images.unsplash.com/photo-1559329255-ef89c5542b44?w=600&q=75', tags: ['Sunset', 'Ocean View'] },
  { id: '5', name: 'Cape Town Electric Room', city: 'Cape Town, South Africa', type: 'Club',      rating: 4.8, reviews: 567, price: '$$$', open: 'Opens 21h', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=75', tags: ['House Music', 'Rooftop'] },
  { id: '6', name: 'Marrakech Riad Bar',      city: 'Marrakech, Morocco',     type: 'Riad Bar',  rating: 4.7, reviews: 289, price: '$$',  open: 'Open now',  image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=75', tags: ['Rooftop', 'Artisanal'] },
]

const RESTAURANT_CATEGORIES = [
  { icon: Utensils, label: 'All' },
  { icon: Coffee,   label: 'Cafés' },
  { icon: Globe,    label: 'Pan-African' },
  { icon: Wine,     label: 'Fine Dining' },
]

const NIGHTLIFE_CATEGORIES = [
  { icon: Music,  label: 'All' },
  { icon: Drum,   label: 'Live Music' },
  { icon: Wine,   label: 'Bars' },
  { icon: Globe,  label: 'Beach Clubs' },
]

function PriceTag({ price }: { price: string }) {
  return (
    <span className="font-body text-xs font-semibold text-earth-500 bg-ivory-200 px-2 py-0.5 rounded-full">
      {price}
    </span>
  )
}

interface PlaceCardProps {
  item: (typeof RESTAURANTS)[0] | (typeof NIGHTLIFE)[0]
  type: Tab
}

function PlaceCard({ item, type: _type }: PlaceCardProps) {
  const subtitle = 'cuisine' in item ? item.cuisine : (item as typeof NIGHTLIFE[0]).type
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card group cursor-pointer"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="overlay-card absolute inset-0" />
        {/* Status badge */}
        <span className={`absolute top-3 left-3 badge text-[10px] font-semibold ${
          item.open.startsWith('Open') ? 'badge-forest' : 'badge-gold'
        }`}>
          <Clock size={9} />
          {item.open}
        </span>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white rounded-full px-2.5 py-1">
          <Star size={10} className="fill-white text-white" />
          <span className="font-body text-xs font-semibold">{item.rating}</span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-display text-lg font-medium text-earth-900 leading-snug">{item.name}</h3>
          <PriceTag price={item.price} />
        </div>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="font-body text-xs font-semibold text-terracotta-600 uppercase tracking-wide">{subtitle}</span>
          <span className="text-ivory-400">•</span>
          <span className="font-body text-xs text-earth-400 flex items-center gap-1">
            <MapPin size={10} /> {item.city}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map(tag => (
            <span key={tag} className="font-body text-[10px] font-medium text-earth-600 bg-ivory-200 px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <div className="divider my-4" />
        <div className="flex items-center justify-between">
          <span className="font-body text-xs text-earth-400">{item.reviews} reviews</span>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full border border-ivory-300 flex items-center justify-center text-earth-500 hover:bg-ivory-100 transition-colors">
              <Phone size={13} />
            </button>
            <button className="w-8 h-8 rounded-full border border-ivory-300 flex items-center justify-center text-earth-500 hover:bg-ivory-100 transition-colors">
              <Globe size={13} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Community() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab: Tab = searchParams.get('tab') === 'nightlife' ? 'nightlife' : 'restaurants'
  const [tab, setTab]           = useState<Tab>(initialTab)
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('All')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [cityFilter, setCityFilter]   = useState('')

  const debouncedSearch = useDebounce(search, 300)
  const debouncedCity   = useDebounce(cityFilter, 300)

  usePageMeta({
    title: tab === 'restaurants' ? 'Restaurants in Africa' : 'African Nightlife',
    description: tab === 'restaurants'
      ? 'Discover authentic African restaurants — from street food to fine dining, across the continent.'
      : 'Experience African nightlife — jazz bars, beach clubs, and Afrobeats clubs across the continent.',
  })

  // Sync tab with URL query param
  useEffect(() => {
    setSearchParams(tab === 'nightlife' ? { tab: 'nightlife' } : {}, { replace: true })
    setCategory('All')
    setSearch('')
  }, [tab])

  const source = tab === 'restaurants' ? RESTAURANTS : NIGHTLIFE

  const filtered = source.filter(item => {
    const q = debouncedSearch.toLowerCase()
    const c = debouncedCity.toLowerCase()
    const matchSearch = !q || item.name.toLowerCase().includes(q) || item.city.toLowerCase().includes(q)
    const matchCity   = !c || item.city.toLowerCase().includes(c)
    const subtitle    = 'cuisine' in item ? item.cuisine : (item as typeof NIGHTLIFE[0]).type
    const matchCat    = category === 'All' || subtitle.toLowerCase().includes(category.toLowerCase()) || item.tags.some(t => t.toLowerCase().includes(category.toLowerCase()))
    return matchSearch && matchCity && matchCat
  })

  const categories = tab === 'restaurants' ? RESTAURANT_CATEGORIES : NIGHTLIFE_CATEGORIES

  return (
    <div className="min-h-screen bg-ivory-100 nav-offset">
      {/* Header */}
      <div className="relative bg-earth-950 py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-950 to-transparent opacity-80" />
        <div className="container-site relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="eyebrow text-terracotta-400 mb-3">Discover</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-ivory-50 mb-6 tracking-tight">
              {tab === 'restaurants' ? 'Restaurants' : 'Nightlife'}
            </h1>

            {/* Tab switcher inside header */}
            <div className="flex gap-2 bg-white/10 backdrop-blur-md border border-white/15 p-1 rounded-xl w-fit">
              {(['restaurants', 'nightlife'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative px-5 py-2 rounded-lg font-body text-sm font-semibold transition-all duration-300 capitalize ${
                    tab === t
                      ? 'bg-white text-earth-900 shadow-sm'
                      : 'text-ivory-300 hover:text-white'
                  }`}
                >
                  {t === 'restaurants' ? '🍽  Restaurants' : '🎶  Nightlife'}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-site pb-12">
        {/* Category pills */}
        <div className="flex items-center gap-2 py-5 overflow-x-auto no-scrollbar border-b border-ivory-200 mb-6">
          {categories.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => setCategory(label)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-body text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                category === label
                  ? 'bg-earth-900 text-white shadow-sm'
                  : 'bg-white border border-ivory-300 text-earth-700 hover:border-ivory-400'
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}

          <div className="ml-auto shrink-0 flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search place…"
                className="input-field pl-9 text-sm py-2.5 w-44"
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border font-body text-sm font-medium transition-all ${
                filtersOpen || cityFilter
                  ? 'border-terracotta-400 bg-terracotta-50 text-terracotta-600'
                  : 'border-ivory-400 bg-white text-earth-700 hover:border-ivory-500'
              }`}
            >
              <SlidersHorizontal size={14} />
              Filter
            </button>
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-2xl border border-ivory-300 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg text-earth-900">Filter by City</h3>
                  {cityFilter && (
                    <button onClick={() => setCityFilter('')} className="flex items-center gap-1 font-body text-sm text-terracotta-600 bg-terracotta-50 px-3 py-1.5 rounded-full">
                      <X size={12} /> Clear
                    </button>
                  )}
                </div>
                <div className="relative max-w-sm">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
                  <input
                    value={cityFilter}
                    onChange={e => setCityFilter(e.target.value)}
                    placeholder="e.g. Dakar, Lagos, Nairobi..."
                    className="input-field pl-9 text-sm"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <p className="font-body text-sm text-earth-500 mb-6">
          {filtered.length} {tab === 'restaurants' ? 'restaurant' : 'venue'}{filtered.length !== 1 ? 's' : ''} found
          {(search || cityFilter || category !== 'All') && ' matching your filters'}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-ivory-200 flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-earth-300" />
            </div>
            <h3 className="font-display text-xl text-earth-700 mb-2">No venues found</h3>
            <p className="font-body text-earth-400 mb-6">Try a different search or clear your filters.</p>
            <button
              onClick={() => { setSearch(''); setCityFilter(''); setCategory('All') }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item, i) => (
              <ScrollReveal key={item.id} delay={Math.min(i * 60, 300)}>
                <PlaceCard item={item} type={tab} />
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Coming Soon notice */}
        <ScrollReveal>
          <div className="mt-16 rounded-3xl bg-earth-900 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
            <div className="relative z-10">
              <p className="eyebrow text-terracotta-400 mb-3">Coming Soon</p>
              <h2 className="font-display text-2xl md:text-3xl text-ivory-50 mb-3">
                Community Reviews & Host Recommendations
              </h2>
              <p className="font-body text-earth-400 max-w-lg mx-auto">
                Local hosts are curating their favorite spots so you can eat, drink, and celebrate like a local.
                Stay tuned.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
