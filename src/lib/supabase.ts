import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mbyiidayuburouqozgfq.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ieWlpZGF5dWJ1cm91cW96Z2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwODQ3ODMsImV4cCI6MjA2MzY2MDc4M30.m-A791D2aQoW7RjTRBMPtTmHTykWorVjB_Zaf8kBrXk'

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
