import { Link } from 'react-router-dom'
import { Globe2, MapPin, Mail, ArrowUpRight, Compass, Share2 } from 'lucide-react'
import logoSrc from '../../assets/logo.svg'

const footerLinks = {
  explore: [
    { label: 'Stays & Apartments',  href: '/listings' },
    { label: 'Hotels & Lodges',     href: '/hotels' },
    { label: 'Car Rentals',         href: '/cars' },
    { label: 'Restaurants',         href: '/community' },
    { label: 'Nightlife',           href: '/community?tab=nightlife' },
  ],
  host: [
    { label: 'List Your Property',  href: '/listings/create' },
    { label: 'List Your Vehicle',   href: '/cars/create' },
    { label: 'Host Resources',      href: '/host' },
    { label: 'Earnings',            href: '/earnings' },
  ],
  company: [
    { label: 'About Gescostay',     href: '/about' },
    { label: 'Safety',              href: '/safety' },
    { label: 'Privacy Policy',      href: '/privacy' },
    { label: 'Terms of Service',    href: '/terms' },
  ],
}

const social = [
  { icon: Compass, href: '#', label: 'Explore' },
  { icon: Share2,  href: '#', label: 'Share' },
  { icon: Globe2,  href: '#', label: 'Website' },
]

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(180deg, #1E1208 0%, #130B05 100%)' }}>
      {/* Séparateur doré */}
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(200,168,78,0.40) 30%, rgba(200,168,78,0.55) 50%, rgba(200,168,78,0.40) 70%, transparent 100%)' }}
      />

      {/* Main footer */}
      <div className="container-site py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">

          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5 mb-7 transition-opacity duration-200 hover:opacity-80">
              <img src={logoSrc} alt="Gescostay" className="h-9 w-auto brightness-0 invert" />
            </Link>

            <p className="font-body text-sm leading-[1.78] mb-7 max-w-xs"
              style={{ color: 'rgba(210,198,186,0.65)' }}>
              The premier platform for discovering authentic African hospitality — curated stays, reliable car rentals, and vibrant local experiences.
            </p>

            {/* Tagline */}
            <p
              className="font-display italic mb-8"
              style={{
                fontSize: '1.125rem',
                color: 'transparent',
                backgroundImage: 'linear-gradient(130deg, #D9BE72 0%, #C8A84E 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
              }}
            >
              "Book, Stay, Belong."
            </p>

            {/* Contact */}
            <div className="space-y-3">
              <a
                href="mailto:hello@gescostay.com"
                className="flex items-center gap-2.5 transition-colors duration-200 group"
                style={{ color: 'rgba(210,198,186,0.55)' }}
                onMouseEnter={e => { ;(e.currentTarget as HTMLAnchorElement).style.color = 'rgba(250,248,244,0.90)' }}
                onMouseLeave={e => { ;(e.currentTarget as HTMLAnchorElement).style.color = 'rgba(210,198,186,0.55)' }}
              >
                <Mail size={13} className="text-terracotta-500 shrink-0" />
                <span className="font-body text-sm">hello@gescostay.com</span>
              </a>
              <div className="flex items-center gap-2.5" style={{ color: 'rgba(210,198,186,0.55)' }}>
                <MapPin size={13} className="text-terracotta-500 shrink-0" />
                <span className="font-body text-sm">Serving across Africa</span>
              </div>
            </div>
          </div>

          {/* Links columns */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-10">
            {(['explore', 'host', 'company'] as const).map(section => (
              <div key={section}>
                <h4
                  className="font-body text-[0.6875rem] font-semibold uppercase tracking-[0.14em] mb-6"
                  style={{ color: 'rgba(200,168,78,0.70)' }}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </h4>
                <ul className="space-y-3.5">
                  {footerLinks[section].map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        to={href}
                        className="font-body text-sm flex items-center gap-1 group transition-colors duration-200"
                        style={{ color: 'rgba(210,198,186,0.55)' }}
                        onMouseEnter={e => { ;(e.currentTarget as HTMLAnchorElement).style.color = 'rgba(250,248,244,0.90)' }}
                        onMouseLeave={e => { ;(e.currentTarget as HTMLAnchorElement).style.color = 'rgba(210,198,186,0.55)' }}
                      >
                        <span>{label}</span>
                        <ArrowUpRight
                          size={11}
                          className="opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-200"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Social — dans la colonne company */}
                {section === 'company' && (
                  <div className="mt-8">
                    <h4
                      className="font-body text-[0.6875rem] font-semibold uppercase tracking-[0.14em] mb-4"
                      style={{ color: 'rgba(200,168,78,0.70)' }}
                    >
                      Follow Us
                    </h4>
                    <div className="flex gap-2.5">
                      {social.map(({ icon: Icon, href, label }) => (
                        <a
                          key={label}
                          href={href}
                          aria-label={label}
                          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                          style={{
                            border: '1px solid rgba(74,48,32,0.55)',
                            color: 'rgba(210,198,186,0.50)',
                          }}
                          onMouseEnter={e => {
                            ;(e.currentTarget as HTMLAnchorElement).style.background = 'rgba(74,48,32,0.50)'
                            ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(74,48,32,0.80)'
                            ;(e.currentTarget as HTMLAnchorElement).style.color = 'rgba(250,248,244,0.85)'
                            ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'
                          }}
                          onMouseLeave={e => {
                            ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                            ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(74,48,32,0.55)'
                            ;(e.currentTarget as HTMLAnchorElement).style.color = 'rgba(210,198,186,0.50)'
                            ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'
                          }}
                        >
                          <Icon size={14} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(74,48,32,0.40)' }}>
        <div className="container-site py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs" style={{ color: 'rgba(210,198,186,0.35)' }}>
            © {new Date().getFullYear()} Gescostay. All rights reserved.
          </p>
          <div className="flex items-center gap-1 font-body text-xs" style={{ color: 'rgba(210,198,186,0.35)' }}>
            <span>Made with</span>
            <span style={{ color: '#BC5F38' }}>♥</span>
            <span>for Africa</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
