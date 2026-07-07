import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'

const categories = [
  {
    label: 'Ghana',
    desc:  '120+ stays',
    href:  '/listings?location=Ghana',
    image: 'https://images.unsplash.com/photo-1616489431804-0c58e57e9373?w=600&q=85', // Arch/Monument
    accent: 'rgba(30,18,8,0.72)',
  },
  {
    label: 'Senegal',
    desc:  '80+ stays',
    href:  '/listings?location=Senegal',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=85', // Beach/Dakar
    accent: 'rgba(124,49,24,0.68)',
  },
  {
    label: 'Gambia',
    desc:  '60+ stays',
    href:  '/listings?location=Gambia',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=85', // Coast/Palm
    accent: 'rgba(20,52,42,0.68)',
  },
  {
    label: 'Kenya',
    desc:  '150+ stays',
    href:  '/listings?location=Kenya',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=85', // Savannah
    accent: 'rgba(19,11,5,0.78)',
  },
  {
    label: 'Morocco',
    desc:  '200+ stays',
    href:  '/listings?location=Morocco',
    image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=85', // Marrakech style
    accent: 'rgba(143,109,24,0.68)',
  },
]

export default function DiscoverSection() {
  return (
    <section className="section-py bg-ivory-100 border-t border-ivory-200">
      <div className="container-site">
        
        {/* Header : Title + View all Link */}
        <ScrollReveal className="flex items-center justify-between mb-8 md:mb-12">
          <h2 className="font-display font-medium text-earth-900" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', letterSpacing: '-0.02em' }}>
            Explore Stays by Destination
          </h2>
          <Link 
            to="/listings" 
            className="hidden sm:flex items-center gap-1.5 font-body text-sm font-semibold text-terracotta-600 hover:text-terracotta-500 transition-colors"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </ScrollReveal>

        {/* 5 columns grid */}
        <ScrollReveal direction="up" delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
            {categories.map(({ label, desc, href, image, accent }, i) => (
              <Link
                key={href}
                to={href}
                className="group relative overflow-hidden block"
                style={{
                  borderRadius: '1.25rem',
                  aspectRatio: '3 / 4',
                  transitionDelay: `${i * 50}ms`,
                  boxShadow: '0 4px 12px rgba(30,18,8,0.06)',
                }}
              >
                {/* Image */}
                <img
                  src={image}
                  alt={label}
                  className="img-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
                  loading="lazy"
                  decoding="async"
                />

                {/* Overlay multicouche */}
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(to top, rgba(19,11,5,0.85) 0%, rgba(19,11,5,0.3) 45%, rgba(19,11,5,0.05) 100%)` }}
                />

                {/* Colored bottom glow on hover */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(to top, ${accent} 0%, transparent 100%)`, mixBlendMode: 'overlay' }}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <p className="font-display text-[1.25rem] font-semibold text-white leading-tight mb-1">
                    {label}
                  </p>
                  <p className="font-body text-[0.8125rem] text-white/70 transition-all duration-300 group-hover:text-white/90">
                    {desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Mobile View all link */}
          <div className="mt-8 flex justify-center sm:hidden">
            <Link 
              to="/listings" 
              className="flex items-center gap-1.5 font-body text-sm font-semibold text-terracotta-600 hover:text-terracotta-500 transition-colors"
            >
              View all
              <ArrowRight size={14} />
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </section>
  )
}
