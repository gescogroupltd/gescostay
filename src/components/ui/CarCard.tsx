import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Users, Fuel, Settings, Heart } from 'lucide-react'
import type { Car } from '../../lib/supabase'

interface CarCardProps { car: Car }

export default function CarCard({ car }: CarCardProps) {
  const [liked,     setLiked]     = useState(false)
  const [imgError,  setImgError]  = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const mainImage = !imgError && car.images?.[0]
    ? car.images[0]
    : `https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=85`

  const priceDay = new Intl.NumberFormat('en-US', {
    style:               'currency',
    currency:            car.currency || 'USD',
    maximumFractionDigits: 0,
  }).format(car.price_day)

  return (
    <Link
      to={`/cars/${car.id}`}
      className="group block bg-white transition-all duration-400 will-change-transform"
      style={{
        borderRadius: '1.375rem',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(30,18,8,0.07), 0 1px 3px rgba(30,18,8,0.04)',
        transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 14px 44px rgba(30,18,8,0.16), 0 4px 14px rgba(30,18,8,0.09)'
        ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-6px)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 2px 8px rgba(30,18,8,0.07), 0 1px 3px rgba(30,18,8,0.04)'
        ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
        {!imgLoaded && <div className="absolute inset-0 skeleton" style={{ borderRadius: 0 }} />}
        <img
          src={mainImage}
          alt={`${car.make} ${car.model}`}
          className="img-cover"
          style={{
            opacity: imgLoaded ? 1 : 0,
            transition: 'transform 700ms cubic-bezier(0.16,1,0.3,1), opacity 400ms ease',
          }}
          onError={() => setImgError(true)}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
          decoding="async"
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{ background: 'rgba(19,11,5,0.06)' }}
        />

        {/* Like */}
        <button
          onClick={e => { e.preventDefault(); setLiked(!liked) }}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 1px 4px rgba(30,18,8,0.12)',
            transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)',
          }}
          onMouseEnter={e => { ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.12)' }}
          onMouseLeave={e => { ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
        >
          <Heart size={13} className={`transition-colors duration-200 ${liked ? 'fill-red-500 text-red-500' : 'text-earth-500'}`} />
        </button>

        {/* Year badge */}
        {car.year && (
          <div className="absolute bottom-3 left-3">
            <span
              className="inline-flex items-center font-body text-[0.6875rem] font-semibold"
              style={{
                background: 'rgba(30,18,8,0.84)',
                backdropFilter: 'blur(12px)',
                borderRadius: '9999px',
                padding: '0.25rem 0.6875rem',
                color: 'rgba(250,248,244,0.92)',
              }}
            >
              {car.year}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col p-4 sm:p-5">
        <div className="flex items-center gap-1.5 mb-2.5">
          <MapPin size={11} className="text-terracotta-500 shrink-0" />
          <span className="font-body text-[0.75rem] text-earth-500 truncate">{car.location}</span>
        </div>

        <h3
          className="font-display font-semibold text-earth-900 mb-3 transition-colors duration-200 group-hover:text-terracotta-600"
          style={{ fontSize: '0.9375rem', lineHeight: '1.35', letterSpacing: '-0.018em' }}
        >
          {car.make} {car.model}
        </h3>

        <div className="flex items-center gap-3.5 mb-4 flex-wrap">
          {car.seats && (
            <div className="flex items-center gap-1.5 text-[0.75rem] text-earth-400 font-body">
              <Users size={11} className="text-earth-300" />
              {car.seats} seats
            </div>
          )}
          {car.transmission && (
            <div className="flex items-center gap-1.5 text-[0.75rem] text-earth-400 font-body">
              <Settings size={11} className="text-earth-300" />
              {car.transmission}
            </div>
          )}
          {car.fuel_type && (
            <div className="flex items-center gap-1.5 text-[0.75rem] text-earth-400 font-body">
              <Fuel size={11} className="text-earth-300" />
              {car.fuel_type}
            </div>
          )}
        </div>

        <div
          className="flex items-center justify-between mt-auto pt-3.5"
          style={{ borderTop: '1px solid var(--color-ivory-200)' }}
        >
          <div className="flex items-baseline gap-1">
            <span
              className="font-display font-semibold text-earth-900"
              style={{ fontSize: '1.0625rem', letterSpacing: '-0.02em' }}
            >
              {priceDay}
            </span>
            <span className="font-body text-[0.6875rem] text-earth-400">/ day</span>
          </div>
          {car.price_week && (
            <span className="font-body text-[0.6875rem] text-earth-400">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: car.currency || 'USD',
                maximumFractionDigits: 0,
              }).format(car.price_week)}/wk
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export function CarCardSkeleton() {
  return (
    <div
      className="bg-white overflow-hidden"
      style={{ borderRadius: '1.375rem', boxShadow: '0 2px 8px rgba(30,18,8,0.07)' }}
    >
      <div style={{ aspectRatio: '16 / 10' }} className="skeleton" />
      <div className="p-4 sm:p-5 space-y-3">
        <div className="skeleton h-2.5 w-24 rounded-full" />
        <div className="skeleton h-4 w-3/4 rounded-lg" />
        <div className="flex gap-3.5">
          <div className="skeleton h-2.5 w-12 rounded-full" />
          <div className="skeleton h-2.5 w-14 rounded-full" />
          <div className="skeleton h-2.5 w-10 rounded-full" />
        </div>
        <div className="flex justify-between pt-3.5" style={{ borderTop: '1px solid var(--color-ivory-200)' }}>
          <div className="skeleton h-5 w-20 rounded-lg" />
          <div className="skeleton h-3 w-14 rounded-full" />
        </div>
      </div>
    </div>
  )
}
