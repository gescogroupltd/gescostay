import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp } from 'lucide-react'

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  // Set the top cordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 p-3 rounded-full bg-terracotta-600 text-white hover:bg-terracotta-500 hover:-translate-y-1 transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2"
          style={{
            boxShadow: '0 4px 14px rgba(188, 95, 56, 0.4), 0 1px 3px rgba(30, 18, 8, 0.1)',
            marginBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          <ChevronUp 
            size={24} 
            strokeWidth={2.5} 
            className="group-hover:scale-110 transition-transform duration-300" 
          />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
