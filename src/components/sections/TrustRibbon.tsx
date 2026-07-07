import { Shield, Clock, Lock, Star, Map, Headphones } from 'lucide-react'

const items = [
  { icon: Shield,     label: 'Verified Hosts',  desc: 'Every host ID-checked' },
  { icon: Clock,      label: 'Support 24/7',    desc: 'Always here to help' },
  { icon: Lock,       label: 'Secure Payments', desc: 'Encrypted transactions' },
  { icon: Star,       label: 'Quality Assured', desc: 'Curated experiences' },
  { icon: Map,        label: 'Local Expertise', desc: 'Insider knowledge' },
  { icon: Headphones, label: 'Concierge',       desc: 'Personal assistance' },
]

export default function TrustRibbon() {
  return (
    <section className="relative z-10 -mt-10 sm:-mt-12">
      <div className="container-site">
        <div
          className="rounded-[1.5rem] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1E1208 0%, #2F1E10 50%, #1A1008 100%)',
            boxShadow: '0 8px 40px rgba(19,11,5,0.28), 0 2px 8px rgba(19,11,5,0.14)',
            border: '1px solid rgba(74,48,32,0.40)',
          }}
        >
          {/* Subtle top highlight */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(200,168,78,0.35), transparent)' }}
          />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0">
            {items.map(({ icon: Icon, label, desc }, i) => (
              <div
                key={label}
                className="relative flex flex-col items-center text-center px-5 py-6 group cursor-default"
                style={{
                  borderRight: i < 5 ? '1px solid rgba(74,48,32,0.35)' : 'none',
                  borderBottom: i < 2 ? '1px solid rgba(74,48,32,0.35)' : (i < 4 && i >= 2) ? '1px solid rgba(74,48,32,0.35)' : 'none',
                }}
              >
                {/* Icon in premium circle */}
                <div
                  className="mb-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, rgba(188,95,56,0.18) 0%, rgba(200,168,78,0.10) 100%)',
                    border: '1px solid rgba(188,95,56,0.22)',
                    boxShadow: '0 2px 8px rgba(188,95,56,0.10)',
                  }}
                >
                  <Icon size={16} className="text-terracotta-400" />
                </div>

                <p className="font-body text-[0.8125rem] font-semibold text-ivory-100 mb-0.5 leading-tight">
                  {label}
                </p>
                <p className="font-body text-[0.6875rem] text-earth-400 leading-tight">
                  {desc}
                </p>

                {/* Hover glow spot */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-xl"
                  style={{ background: 'radial-gradient(circle at 50% 50%, rgba(188,95,56,0.07) 0%, transparent 70%)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
