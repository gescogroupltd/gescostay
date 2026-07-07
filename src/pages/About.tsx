import ScrollReveal from '../components/ui/ScrollReveal'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, Globe, Heart } from 'lucide-react'

const stats = [
  { value: '10K+', label: 'Properties listed' },
  { value: '25+', label: 'African countries' },
  { value: '50K+', label: 'Happy travelers' },
  { value: '4.9', label: 'Average rating' },
]

const audiences = [
  {
    icon: Globe,
    title: 'International Travelers',
    desc: 'Exploring Africa for the first time or returning for more, find stays that go beyond the hotel — each curated by someone who knows the city, the neighborhood, and the best jollof in town.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=75',
    cta: 'Explore Stays',
    href: '/listings',
  },
  {
    icon: Heart,
    title: 'Diaspora Coming Home',
    desc: 'Reconnecting with home is personal. We built Gescostay to make sure the homecoming feels exactly right — familiar warmth, trusted hosts, and spaces that feel like family.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=75',
    cta: 'Find Your Stay',
    href: '/listings',
  },
  {
    icon: Users,
    title: 'Local Hosts',
    desc: 'Share your home, your city, your culture. Gescostay gives African entrepreneurs a world-class platform to earn, grow, and showcase what makes their corner of the continent extraordinary.',
    image: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600&q=75',
    cta: 'Become a Host',
    href: '/listings/create',
  },
]

export default function About() {
  return (
    <div className="min-h-screen bg-ivory-100 nav-offset">
      {/* Hero */}
      <section className="relative bg-earth-900 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1920&q=60" alt="" className="img-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-earth-900/80 to-earth-900" />
        <div className="relative container-site text-center">
          <ScrollReveal>
            <span className="eyebrow text-terracotta-400 mb-4 block">Our Story</span>
            <h1 className="font-display font-semibold text-ivory-50 mb-6 max-w-3xl mx-auto"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: '1.08', letterSpacing: '-0.025em' }}>
              Built for Africa,{' '}
              <em className="font-display font-medium not-italic text-ocre-400">by Africans</em>
            </h1>
            <p className="font-body text-lg text-ivory-300/80 max-w-xl mx-auto">
              Gescostay was born from a simple belief: that the best way to experience Africa is through the people who live it every day.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-terracotta-600 py-12">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(({ value, label }, i) => (
              <ScrollReveal key={label} delay={i * 80}>
                <p className="font-display text-4xl font-semibold text-white mb-1">{value}</p>
                <p className="font-body text-sm text-terracotta-200">{label}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-py">
        <div className="container-site">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <p className="eyebrow mb-4">Our Mission</p>
              <h2 className="section-heading-xl mb-6">
                Redefining African{' '}
                <em className="font-display font-medium not-italic text-terracotta-600">hospitality</em>
              </h2>
              <p className="font-body text-base text-earth-500 leading-relaxed mb-6">
                For too long, booking a stay in Africa meant navigating platforms designed for other continents — 
                missing context, missing culture, missing the magic that makes Africa unlike anywhere else on earth.
              </p>
              <p className="font-body text-base text-earth-500 leading-relaxed">
                Gescostay changes that. We are a platform built from the ground up for the African travel experience — 
                celebrating local entrepreneurs, supporting the diaspora, and giving international travelers 
                the authentic access they've been looking for.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Three audiences */}
      <section className="section-py bg-ivory-200">
        <div className="container-site">
          <ScrollReveal className="text-center mb-16">
            <p className="eyebrow mb-3">Who We Serve</p>
            <h2 className="section-heading-xl">
              A platform for{' '}
              <em className="font-display font-medium not-italic text-terracotta-600">everyone</em>
            </h2>
          </ScrollReveal>

          <div className="space-y-24">
            {audiences.map(({ icon: Icon, title, desc, image, cta, href }, i) => (
              <ScrollReveal key={title} direction={i % 2 === 0 ? 'left' : 'right'}>
                <div className={`grid md:grid-cols-2 gap-10 md:gap-20 items-center ${i % 2 !== 0 ? 'md:[direction:rtl]' : ''}`}>
                  <div className={i % 2 !== 0 ? 'md:[direction:ltr]' : ''}>
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-soft flex items-center justify-center mb-6">
                      <Icon size={26} className="text-terracotta-600" />
                    </div>
                    <h3 className="font-display text-3xl md:text-4xl font-semibold text-earth-900 mb-5 leading-tight">{title}</h3>
                    <p className="font-body text-lg text-earth-600 leading-relaxed mb-8">{desc}</p>
                    <Link to={href} className="btn-primary inline-flex">
                      {cta} <ArrowRight size={16} />
                    </Link>
                  </div>
                  <div className={`rounded-[2.5rem] overflow-hidden aspect-[4/3] shadow-soft-lg ${i % 2 !== 0 ? 'md:[direction:ltr]' : ''}`}>
                    <img src={image} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-out" />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-py bg-earth-900">
        <div className="container-site text-center">
          <ScrollReveal>
            <p className="eyebrow text-terracotta-400 mb-4">Our Values</p>
            <h2 className="font-display text-display-sm text-ivory-50 mb-14">
              What we stand for
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { title: 'Authenticity', desc: 'We champion real, unfiltered African experiences over manufactured exoticism.' },
              { title: 'Community', desc: 'Every booking supports a local host, their family, and their neighborhood.' },
              { title: 'Trust', desc: 'Verified hosts, secure payments, and 24/7 support — safety is non-negotiable.' },
            ].map(({ title, desc }, i) => (
              <ScrollReveal key={title} delay={i * 100}>
                <div className="p-6 rounded-2xl border border-earth-700 text-center">
                  <div className="w-12 h-1 rounded-full bg-terracotta-500 mx-auto mb-5" />
                  <h3 className="font-display text-xl font-semibold text-ivory-50 mb-3">{title}</h3>
                  <p className="font-body text-sm text-earth-400 leading-relaxed">{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-py-sm bg-terracotta-600 text-center">
        <div className="container-site">
          <ScrollReveal>
            <h2 className="font-display text-display-sm text-white mb-4">Ready to explore?</h2>
            <p className="font-body text-terracotta-100 mb-8 max-w-md mx-auto">
              Join thousands of travelers discovering Africa through its people.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/listings" className="px-7 py-3.5 rounded-xl bg-white text-terracotta-700 font-body font-semibold text-sm hover:bg-ivory-100 transition-colors shadow-soft">
                Browse Stays
              </Link>
              <Link to="/listings/create" className="px-7 py-3.5 rounded-xl border border-white/40 text-white font-body font-semibold text-sm hover:bg-white/10 transition-colors">
                Become a Host
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
