import { createClient } from '@supabase/supabase-js'

// ─── Environment variables (Vite convention: VITE_* prefix) ──────────────────
// Values are defined in .env.local (ignored by Git).
// See .env.example for the list of required variables.
const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL      as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Guard: fail fast with a clear message if variables are missing
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    '[Gescostay] Missing Supabase environment variables.\n' +
    'Create a .env.local file at the project root and set:\n' +
    '  VITE_SUPABASE_URL=...\n' +
    '  VITE_SUPABASE_ANON_KEY=...\n' +
    'See .env.example for details.'
  )
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// ─── Types ─────────────────────────────────────────────────────

export interface Property {
  id: string
  title: string
  description?: string
  location: string
  price: number
  currency?: string
  beds?: number
  baths?: number
  images?: string[]
  owner_id: string
  status: 'pending' | 'approved' | 'rejected'
  property_type?: string
  amenities?: string[]
  created_at: string
  rating?: number
  review_count?: number
  lat?: number
  lng?: number
}

export interface Hotel {
  id: string
  title: string
  description?: string
  location: string
  images?: string[]
  owner_id: string
  status: 'pending' | 'approved' | 'rejected'
  amenities?: string[]
  check_in_time?: string
  check_out_time?: string
  created_at: string
  rating?: number
}

export interface Car {
  id: string
  title: string
  description?: string
  make: string
  model: string
  year?: number
  location: string
  price_day: number
  price_week?: number
  price_month?: number
  currency?: string
  images?: string[]
  owner_id: string
  status: 'pending' | 'approved' | 'rejected'
  seats?: number
  transmission?: string
  fuel_type?: string
  features?: string[]
  created_at: string
}

export interface Profile {
  id: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  role?: string
  created_at?: string
}

export interface Booking {
  id: string
  property_id: string
  user_id: string
  check_in: string
  check_out: string
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled'
  payment_status?: string
  created_at: string
}
