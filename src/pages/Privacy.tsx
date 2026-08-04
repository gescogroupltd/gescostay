import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import ScrollReveal from '../components/ui/ScrollReveal'

const sections = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us, such as when you create an account, make a booking, or contact support. This includes your name, email address, payment information, and any other information you choose to provide.

We also collect information automatically when you use our services, including log data, device information, and cookies. We may also collect location data with your permission.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information we collect to:
• Provide, maintain, and improve our services
• Process transactions and send related information, including booking confirmations
• Send promotional communications (with your consent)
• Monitor and analyze trends and usage to improve your experience
• Detect and prevent fraudulent transactions and other illegal activities
• Comply with legal obligations`,
  },
  {
    title: '3. Sharing of Information',
    content: `We may share your information with:
• Hosts: When you make a booking, we share relevant booking details with the host
• Service providers: We work with third-party vendors who provide services on our behalf
• Law enforcement: When required by law or to protect our rights

We do not sell your personal information to third parties.`,
  },
  {
    title: '4. Data Retention',
    content: `We retain your information for as long as your account is active or as needed to provide you services. You may request deletion of your account at any time by contacting us at privacy@gescostay.com.`,
  },
  {
    title: '5. Security',
    content: `We take reasonable measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no internet or email transmission is ever fully secure or error-free.`,
  },
  {
    title: '6. Cookies',
    content: `We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.`,
  },
  {
    title: '7. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.`,
  },
  {
    title: '8. Contact Us',
    content: `If you have any questions about this Privacy Policy, please contact us at privacy@gescostay.com or write to us at: Gescostay, Inc., Serving across Africa.`,
  },
]

export default function Privacy() {
  usePageMeta({
    title: 'Privacy Policy',
    description: "Gescostay's privacy policy — how we collect, use, and protect your personal information.",
  })

  return (
    <div className="nav-offset min-h-screen bg-ivory-100">
      {/* Header */}
      <div className="relative bg-earth-950 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        <div className="absolute inset-0 bg-gradient-to-b from-earth-900/60 to-earth-950" />
        <div className="container-site relative z-10">
          <p className="eyebrow text-terracotta-400 mb-3">Legal</p>
          <h1 className="font-display text-4xl md:text-5xl text-ivory-50 mb-3 tracking-tight">Privacy Policy</h1>
          <p className="font-body text-earth-400 text-sm">Last updated: August 1, 2026</p>
        </div>
      </div>

      <div className="container-site py-12 max-w-3xl mx-auto">
        {/* Intro */}
        <ScrollReveal>
          <div className="bg-terracotta-50 border border-terracotta-200 rounded-2xl p-6 mb-10">
            <p className="font-body text-sm text-earth-700 leading-relaxed">
              At Gescostay, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully.
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
          <Link to="/terms" className="btn-secondary text-sm px-5 py-2.5">Terms of Service</Link>
          <Link to="/safety" className="btn-secondary text-sm px-5 py-2.5">Safety & Trust</Link>
          <Link to="/about" className="btn-ghost text-sm">About Gescostay</Link>
        </div>
      </div>
    </div>
  )
}
