import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import ScrollReveal from '../components/ui/ScrollReveal'

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using Gescostay's services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.`,
  },
  {
    title: '2. Use of Our Services',
    content: `You must be at least 18 years old to use Gescostay. You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the security of your account.`,
  },
  {
    title: '3. Bookings & Payments',
    content: `When you book a stay or vehicle through Gescostay, you enter into a direct agreement with the host. Gescostay acts as an intermediary platform. All payments are processed securely through our payment partners.

Cancellation policies are set by individual hosts. Please review the specific cancellation policy before booking.`,
  },
  {
    title: '4. Host Responsibilities',
    content: `Hosts are responsible for accurately describing their properties and vehicles, maintaining them in the condition described, and complying with all applicable local laws, regulations, and tax requirements.`,
  },
  {
    title: '5. Guest Responsibilities',
    content: `Guests agree to:
• Treat the host's property with care and respect
• Adhere to the house rules communicated by the host
• Only bring the number of guests agreed upon at booking
• Vacate the property by the agreed check-out time`,
  },
  {
    title: '6. Prohibited Activities',
    content: `You agree not to:
• Use our services for illegal purposes
• Post false, misleading, or fraudulent content
• Circumvent our platform to make off-platform transactions
• Harass, threaten, or harm other users`,
  },
  {
    title: '7. Intellectual Property',
    content: `All content on Gescostay — including text, graphics, logos, and software — is the property of Gescostay or its content suppliers and is protected by intellectual property laws.`,
  },
  {
    title: '8. Limitation of Liability',
    content: `Gescostay is not liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our maximum liability shall not exceed the amount you paid for the booking in question.`,
  },
  {
    title: '9. Dispute Resolution',
    content: `Any disputes arising from these Terms shall first be attempted to be resolved through good-faith negotiation. If unresolved, disputes shall be submitted to binding arbitration in accordance with applicable law.`,
  },
  {
    title: '10. Changes to Terms',
    content: `We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or in-app notification. Continued use of our services after changes constitutes acceptance.`,
  },
]

export default function Terms() {
  usePageMeta({
    title: 'Terms of Service',
    description: 'Read the Gescostay Terms of Service — your agreement for using our platform.',
  })

  return (
    <div className="nav-offset min-h-screen bg-ivory-100">
      {/* Header */}
      <div className="relative bg-earth-950 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        <div className="absolute inset-0 bg-gradient-to-b from-earth-900/60 to-earth-950" />
        <div className="container-site relative z-10">
          <p className="eyebrow text-terracotta-400 mb-3">Legal</p>
          <h1 className="font-display text-4xl md:text-5xl text-ivory-50 mb-3 tracking-tight">Terms of Service</h1>
          <p className="font-body text-earth-400 text-sm">Last updated: August 1, 2026</p>
        </div>
      </div>

      <div className="container-site py-12 max-w-3xl mx-auto">
        {/* Intro */}
        <ScrollReveal>
          <div className="bg-ocre-100 border border-ocre-200 rounded-2xl p-6 mb-10">
            <p className="font-body text-sm text-earth-700 leading-relaxed">
              These Terms of Service ("Terms") govern your use of Gescostay's website, mobile application, and related services ("Services"). Please read them carefully before using our platform.
            </p>
          </div>
        </ScrollReveal>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 40}>
              <div>
                <h2 className="font-display text-xl text-earth-900 mb-3">{s.title}</h2>
                <div className="divider mb-4" />
                <p className="font-body text-sm text-earth-600 leading-relaxed whitespace-pre-line">{s.content}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Footer links */}
        <div className="mt-14 pt-8 border-t border-ivory-300 flex flex-wrap gap-4">
          <Link to="/privacy" className="btn-secondary text-sm px-5 py-2.5">Privacy Policy</Link>
          <Link to="/safety" className="btn-secondary text-sm px-5 py-2.5">Safety & Trust</Link>
          <Link to="/about" className="btn-ghost text-sm">About Gescostay</Link>
        </div>
      </div>
    </div>
  )
}
