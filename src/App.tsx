import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/layout/Layout'

import Home from './pages/Home'

// Lazy-loaded pages
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
const Listings = lazy(() => import('./pages/Listings'))
const ListingDetail = lazy(() => import('./pages/ListingDetail'))
const Cars = lazy(() => import('./pages/Cars'))
const About = lazy(() => import('./pages/About'))
const Auth = lazy(() => import('./pages/Auth'))
const CarDetail = lazy(() => import('./pages/CarDetail'))
const ListingCreate = lazy(() => import('./pages/ListingCreate'))
const CarCreate = lazy(() => import('./pages/CarCreate'))

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
})

function PageLoader() {
  return (
    <div className="min-h-screen bg-ivory-100 flex items-center justify-center nav-offset">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-ivory-300 border-t-terracotta-500 animate-spin" />
        <p className="font-body text-sm text-earth-400">Loading...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter basename="/gescostay">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/listings/:id" element={<ListingDetail />} />
                <Route path="/listings/create" element={<ListingCreate />} />
                <Route path="/cars" element={<Cars />} />
                <Route path="/cars/:id" element={<CarDetail />} />
                <Route path="/cars/create" element={<CarCreate />} />
                <Route path="/about" element={<About />} />
                <Route path="/auth" element={<Auth />} />
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#2C2218',
                color: '#FAF7F2',
                borderRadius: '12px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 8px 24px -4px rgba(44,34,24,0.25)',
              },
              success: {
                iconTheme: { primary: '#3A7359', secondary: '#FAF7F2' },
              },
              error: {
                iconTheme: { primary: '#C4653A', secondary: '#FAF7F2' },
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen bg-ivory-100 nav-offset flex items-center justify-center">
      <div className="text-center px-6">
        <p className="font-display text-8xl font-semibold text-ivory-300 mb-4">404</p>
        <h1 className="font-display text-2xl text-earth-900 mb-3">Page not found</h1>
        <p className="font-body text-earth-500 mb-8">This page doesn't exist or has been moved.</p>
        <a href="/" className="btn-primary">Go Home</a>
      </div>
    </div>
  )
}
