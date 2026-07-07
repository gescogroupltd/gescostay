import { useEffect, useRef, type ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  delay?:     number
  direction?: 'up' | 'left' | 'right' | 'none'
  distance?:  number
  className?: string
}

export default function ScrollReveal({
  children,
  delay     = 0,
  direction = 'up',
  distance  = 32,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect user's reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      el.style.opacity = '1'
      el.style.transform = 'none'
      return
    }

    // Initial hidden state
    el.style.opacity   = '0'
    el.style.transition = `opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`

    if (direction === 'up')    el.style.transform = `translateY(${distance}px)`
    if (direction === 'left')  el.style.transform = `translateX(-${distance}px)`
    if (direction === 'right') el.style.transform = `translateX(${distance}px)`
    if (direction === 'none')  el.style.transform = 'none'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity   = '1'
          el.style.transform = 'translate(0, 0)'
          observer.unobserve(el)
        }
      },
      { threshold: 0.10, rootMargin: '0px 0px -32px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay, direction, distance])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

