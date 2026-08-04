import { Link } from 'react-router-dom'
import { Shield, Lock, Star, Phone, CheckCircle, AlertTriangle, Users, Globe } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import ScrollReveal from '../components/ui/ScrollReveal'

const pillars = [
  {
    icon: Shield,
    title: 'Verified Hosts',
    desc: 'Every host on Gescostay goes through our verification process — confirming their identity, property ownership, and community standing before they can list.',
    color: 'text-forest-600',
    bg: 'bg-forest-50 border-forest-100',
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    desc: 'All transactions are encrypted and processed through PCI-DSS compliant payment partners. Your financial information is never stored on our servers.',
    color: 'text-terracotta-600',
    bg: 'bg-terracotta-50 border-terracotta-100',
  },
  {
    icon: Star,
    title: 'Review System',
    desc: 'Our two-way review system keeps everyone accountable. Only guests who have completed a stay can leave reviews — ensuring every rating is genuine.',
    color: 'text-ocre-600',
    bg: 'bg-ocre-100 border-ocre-200',
  },
  {
    icon: Phone,
    title: '24/7 Support',
    desc: 'Our local support team across Africa is available around the clock to assist with any safety concerns, booking issues, or emergency situations.',
    color: 'text-earth-700',
    bg: 'bg-ivory-200 border-ivory-300',
  },
]

const tips = [
  'Always communicate through the Gescostay platform — never move to external channels',
  'Verify your host\'s identity badge before check-in',
  'Read reviews from previous guests before booking',
  'Save the host\'s contact information offline before you travel',
  'Report any discrepancies between the listing and actual property',
  'Never pay for a booking outside of the Gescostay platform',
]

export default function Safety() {
  usePageMeta({
    title: 'Safety & Trust',
    description: 'Learn how Gescostay keeps guests and hosts safe — verified hosts, secure payments, 24/7 support.',
  })

  return (
    <div className="nav-offset min-h-screen bg-ivory-100">
      {/* Header */}
      <div className="relative bg-earth-950 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        <div className="absolute inset-0 bg-gradient-to-b from-earth-900/60 to-earth-950" />
        <div className="container-site relative z-10">
          <p className="eyebrow text-terracotta-400 mb-3">Trust & Safety</p>
          <h1 className="font-display text-4xl md:text-5xl text-ivory-50 mb-3 tracking-tight">Your Safety Matters</h1>
          <p className="font-body text-earth-300 text-base max-w-xl">
            Gescostay is built on trust. Here's everything we do to protect hosts and guests across Africa.
          </p>
        </div>
      </div>

      {/* Safety pillars */}
      <section className="section-py">
        <div className="container-site">
          <ScrollReveal className="text-center mb-14">
            <p className="eyebrow mb-3">Our Commitment</p>
            <h2 className="section-heading-xl">Safety at every step</h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <ScrollReveal key={title} delay={i * 70}>
                <div className="bg-white rounded-3xl border border-ivory-300 shadow-card p-7 h-full flex flex-col">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${bg}`}>
                    <Icon size={22} className={color} />
                  </div>
                  <h3 className="font-display text-xl text-earth-900 mb-3">{title}</h3>
                  <p className="font-body text-sm text-earth-500 leading-relaxed flex-1">{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Guest safety tips */}
      <section className="section-py bg-ivory-200">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <ScrollReveal>
              <p className="eyebrow mb-3">For Guests</p>
              <h2 className="section-heading mb-6">Stay smart, stay safe</h2>
              <div className="space-y-3">
                {tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-forest-600 shrink-0 mt-0.5" />
                    <p className="font-body text-sm text-earth-700">{tip}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="rounded-3xl overflow-hidden aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=75"
                  alt="Gescostay guests"
                  className="w-full h-full object-cover"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Emergency contacts */}
      <section className="section-py">
        <div className="container-site">
          <ScrollReveal className="text-center mb-10">
            <p className="eyebrow mb-3">Emergency Support</p>
            <h2 className="section-heading">We're here when you need us</h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[
              { icon: Phone,  title: '24/7 Hotline',  desc: 'Call or WhatsApp our support line anytime', detail: '+1 800 GESCOSTAY' },
              { icon: Globe,  title: 'Live Chat',      desc: 'Chat with a support agent via the app',     detail: 'In-app chat' },
              { icon: Users,  title: 'Local Teams',    desc: 'On-the-ground support in 25+ countries',    detail: 'Across Africa' },
            ].map(({ icon: Icon, title, desc, detail }, i) => (
              <ScrollReveal key={title} delay={i * 80}>
                <div className="bg-white rounded-3xl border border-ivory-300 shadow-card p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-terracotta-50 border border-terracotta-100 flex items-center justify-center mx-auto mb-4">
                    <Icon size={20} className="text-terracotta-600" />
                  </div>
                  <h3 className="font-display text-lg text-earth-900 mb-1">{title}</h3>
                  <p className="font-body text-xs text-earth-500 mb-3">{desc}</p>
                  <p className="font-body text-sm font-semibold text-earth-800">{detail}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Report issue CTA */}
      <section className="section-py-sm bg-earth-900">
        <div className="container-site text-center">
          <ScrollReveal>
            <AlertTriangle size={28} className="text-terracotta-400 mx-auto mb-4" />
            <h2 className="font-display text-2xl md:text-3xl text-ivory-50 mb-3">Something doesn't feel right?</h2>
            <p className="font-body text-earth-400 mb-7 max-w-md mx-auto">
              Report a safety concern and our team will respond within 2 hours.
            </p>
            <a
              href="mailto:safety@gescostay.com"
              className="btn-primary"
            >
              <Shield size={15} />
              Report an Issue
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer links */}
      <div className="container-site py-8 flex flex-wrap gap-4">
        <Link to="/privacy" className="btn-ghost text-sm">Privacy Policy</Link>
        <Link to="/terms"   className="btn-ghost text-sm">Terms of Service</Link>
        <Link to="/about"   className="btn-ghost text-sm">About Us</Link>
      </div>
    </div>
  )
}
