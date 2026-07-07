import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import BackToTop from '../ui/BackToTop'

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    const html = document.documentElement
    html.style.setProperty('scroll-behavior', 'auto', 'important')
    
    window.scrollTo(0, 0)
    
    const timeoutId = setTimeout(() => {
      html.style.removeProperty('scroll-behavior')
    }, 10)
    
    return () => clearTimeout(timeoutId)
  }, [pathname])

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden relative">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
