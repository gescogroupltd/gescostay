import { Link } from 'react-router-dom'
import { Home, Car, ArrowRight } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'

const ctas = [
  {
    icon:  Home,
    tag:   'For Hosts',
    title: 'Share your space,\nshare your story.',
    desc:  'List your apartment, villa, or guesthouse on Gescostay and connect with travelers from around the world who want the real Africa.',
    href:  '/listings/create',
    label: 'Become a Host',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=85',
  },
  {
    icon:  Car,
    tag:   'For Vehicle Owners',
    title: "Your car earns\nwhile you don't drive.",
    desc:  "Turn your vehicle into a source of income. Join our network of trusted local car owners and start earning today.",
    href:  '/cars/create',
    label: 'List Your Vehicle',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=900&q=85',
  },
]

export default function CommunityCTA() {
  return (
    <section className="section-py bg-ivory-200">
      <div className="container-site">

        {/* Header */}
        <ScrollReveal className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="section-line" />
            <p className="eyebrow">Join the Community</p>
            <div className="section-line" />
          </div>
          <h2 className="section-heading-xl">
            Be part of something{' '}
            <em className="not-italic text-gradient-warm">bigger</em>
          </h2>
          <p className="font-body text-earth-500 mt-4 max-w-md mx-auto leading-[1.72]"
            style={{ fontSize: 'clamp(0.9375rem, 1.8vw, 1.0625rem)' }}>
            Whether you're hosting guests or exploring the continent, Gescostay is your platform.
          </p>
        </ScrollReveal>

        {/* CTA Cards — panneaux magazine */}
        <div className="grid md:grid-cols-2 gap-5">
          {ctas.map(({ icon: Icon, tag, title, desc, href, label, image }, i) => (
            <ScrollReveal key={href} delay={i * 120} direction={i === 0 ? 'left' : 'right'}>
              <div
                className="relative overflow-hidden group"
                style={{
                  borderRadius: '1.75rem',
                  height: 'clamp(22rem, 38vw, 26rem)',
                }}
              >
                {/* Background image */}
                <img
                  src={image}
                  alt={tag}
                  className="img-cover transition-transform duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  loading="lazy"
                  decoding="async"
                />

                {/* Overlay multicouche */}
                <div
                  className="absolute inset-0 transition-opacity duration-400"
                  style={{ background: 'linear-gradient(to top, rgba(19,11,5,0.92) 0%, rgba(19,11,5,0.48) 48%, rgba(19,11,5,0.08) 100%)' }}
                />
                {/* Luminous top gradient */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600"
                  style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(200,168,78,0.08) 0%, transparent 70%)' }}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">

                  {/* Tag */}
                  <div className="flex items-center gap-2.5 mb-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: 'rgba(188,95,56,0.22)',
                        border: '1px solid rgba(188,95,56,0.35)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <Icon size={14} className="text-terracotta-300" />
                    </div>
                    <span className="font-body text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-terracotta-300">
                      {tag}
                    </span>
                  </div>

                  <h3
                    className="font-display font-semibold text-white mb-3 whitespace-pre-line leading-[1.14]"
                    style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', letterSpacing: '-0.025em' }}
                  >
                    {title}
                  </h3>

                  <p className="font-body text-sm text-white/60 mb-7 max-w-sm leading-[1.72] transition-colors duration-300 group-hover:text-white/78">
                    {desc}
                  </p>

                  <Link
                    to={href}
                    className="inline-flex items-center gap-2.5 self-start font-body text-[0.875rem] font-semibold transition-all duration-250"
                    style={{
                      background: 'rgba(255,255,255,0.96)',
                      color: 'var(--color-earth-900)',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.875rem',
                      boxShadow: '0 2px 8px rgba(19,11,5,0.16)',
                    }}
                    onMouseEnter={e => {
                      ;(e.currentTarget as HTMLAnchorElement).style.background = '#fff'
                      ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'
                      ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(19,11,5,0.22)'
                    }}
                    onMouseLeave={e => {
                      ;(e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.96)'
                      ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'
                      ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 2px 8px rgba(19,11,5,0.16)'
                    }}
                  >
                    {label}
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
