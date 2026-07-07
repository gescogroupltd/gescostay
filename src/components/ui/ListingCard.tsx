import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star, BedDouble, Bath, Heart } from 'lucide-react'
import type { Property } from '../../lib/supabase'

interface ListingCardProps {
  property: Property
  variant?: 'default' | 'compact' | 'horizontal'
}

export default function ListingCard({ property, variant = 'default' }: ListingCardProps) {
  const [liked,     setLiked]     = useState(false)
  const [imgError,  setImgError]  = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const mainImage = !imgError && property.images?.[0]
    ? property.images[0]
    : `https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=85`

  const price = new Intl.NumberFormat('en-US', {
    style:               'currency',
    currency:            property.currency || 'USD',
    maximumFractionDigits: 0,
  }).format(property.price)

  return (
    <Link
      to={`/listings/${property.id}`}
      className="group block bg-white transition-all duration-400 will-change-transform"
      style={{
        borderRadius: '1.375rem',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(30,18,8,0.07), 0 1px 3px rgba(30,18,8,0.04)',
        transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
        ...(variant === 'horizontal' ? { display: 'flex' } : {}),
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
      {/* ── Image ─────────────────────────────────────────────── */}
      <div
        className={`relative overflow-hidden ${
          variant === 'horizontal' ? 'w-44 shrink-0' : ''
        }`}
        style={variant !== 'horizontal' ? { aspectRatio: '4 / 3.15' } : {}}
      >
        {/* Skeleton placeholder */}
        {!imgLoaded && (
          <div className="absolute inset-0 skeleton" style={{ borderRadius: 0 }} />
        )}

        <img
          src={mainImage}
          alt={property.title}
          className="img-cover transition-transform duration-700"
          style={{
            transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
            transform: 'scale(1)',
            opacity: imgLoaded ? 1 : 0,
            transition: 'transform 700ms cubic-bezier(0.16,1,0.3,1), opacity 400ms ease',
          }}
          onError={() => setImgError(true)}
          onLoad={e => {
            setImgLoaded(true)
            ;(e.target as HTMLImageElement).style.transform = 'scale(1)'
          }}
          loading="lazy"
          decoding="async"
        />

        {/* Hover overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-400 opacity-0 group-hover:opacity-100"
          style={{ background: 'rgba(19,11,5,0.06)' }}
        />

        {/* Like button — spring */}
        <button
          onClick={e => { e.preventDefault(); setLiked(!liked) }}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={liked}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 1px 4px rgba(30,18,8,0.12)',
            transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.12)'
            ;(e.currentTarget as HTMLButtonElement).style.background = '#fff'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
            ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.92)'
          }}
        >
          <Heart
            size={13}
            className={`transition-colors duration-200 ${liked ? 'fill-red-500 text-red-500' : 'text-earth-500'}`}
          />
        </button>

        {/* Property type badge */}
        {property.property_type && (
          <div className="absolute top-3 left-3">
            <span
              className="inline-flex items-center font-body text-[0.6875rem] font-semibold tracking-wide"
              style={{
                background: 'rgba(255,255,255,0.94)',
                backdropFilter: 'blur(16px)',
                borderRadius: '9999px',
                padding: '0.25rem 0.6875rem',
                color: 'var(--color-earth-800)',
                boxShadow: '0 1px 3px rgba(30,18,8,0.10)',
              }}
            >
              {property.property_type}
            </span>
          </div>
        )}
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">

        {/* Location */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <MapPin size={11} className="text-terracotta-500 shrink-0" />
          <span className="font-body text-[0.75rem] text-earth-500 truncate">{property.location}</span>
        </div>

        {/* Title */}
        <h3
          className="font-display font-semibold text-earth-900 line-clamp-2 mb-3 transition-colors duration-200 group-hover:text-terracotta-600"
          style={{ fontSize: '0.9375rem', lineHeight: '1.35', letterSpacing: '-0.018em' }}
        >
          {property.title}
        </h3>

        {/* Specs */}
        {(property.beds || property.baths) && (
          <div className="flex items-center gap-3.5 mb-4">
            {property.beds && (
              <div className="flex items-center gap-1.5 text-[0.75rem] text-earth-400 font-body">
                <BedDouble size={12} className="text-earth-300" />
                {property.beds} {property.beds === 1 ? 'bed' : 'beds'}
              </div>
            )}
            {property.baths && (
              <div className="flex items-center gap-1.5 text-[0.75rem] text-earth-400 font-body">
                <Bath size={12} className="text-earth-300" />
                {property.baths} {property.baths === 1 ? 'bath' : 'baths'}
              </div>
            )}
          </div>
        )}

        {/* Price + Rating — bottom */}
        <div
          className="flex items-center justify-between mt-auto pt-3.5"
          style={{ borderTop: '1px solid var(--color-ivory-200)' }}
        >
          <div className="flex items-baseline gap-1">
            <span
              className="font-display font-semibold text-earth-900"
              style={{ fontSize: '1.0625rem', letterSpacing: '-0.02em' }}
            >
              {price}
            </span>
            <span className="font-body text-[0.6875rem] text-earth-400">/ night</span>
          </div>
          {property.rating && (
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full"
              style={{ background: 'var(--color-ivory-100)', border: '1px solid var(--color-ivory-200)' }}
            >
              <Star size={10} className="fill-ocre-500 text-ocre-500" />
              <span className="font-body text-[0.75rem] font-semibold text-earth-800">
                {property.rating.toFixed(1)}
              </span>
              {property.review_count && (
                <span className="font-body text-[0.6875rem] text-earth-400">
                  ({property.review_count})
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

// ─── Skeleton ──────────────────────────────────────────────────────────
export function ListingCardSkeleton() {
  return (
    <div
      className="bg-white overflow-hidden"
      style={{ borderRadius: '1.375rem', boxShadow: '0 2px 8px rgba(30,18,8,0.07)' }}
    >
      <div style={{ aspectRatio: '4 / 3.15' }} className="skeleton" />
      <div className="p-4 sm:p-5 space-y-3">
        <div className="skeleton h-2.5 w-24 rounded-full" />
        <div className="skeleton h-4 w-3/4 rounded-lg" />
        <div className="skeleton h-3.5 w-1/2 rounded-lg" />
        <div className="flex gap-3.5">
          <div className="skeleton h-2.5 w-14 rounded-full" />
          <div className="skeleton h-2.5 w-14 rounded-full" />
        </div>
        <div className="flex justify-between pt-3.5" style={{ borderTop: '1px solid var(--color-ivory-200)' }}>
          <div className="skeleton h-5 w-20 rounded-lg" />
          <div className="skeleton h-4 w-16 rounded-full" />
        </div>
      </div>
    </div>
  )
}
