import ScrollReveal from '../ui/ScrollReveal'

const steps = [
  {
    num:   '01',
    title: 'Search',
    desc:  'Enter your destination, travel dates, and how many guests. Filter by property type, budget, or amenities.',
    color: 'from-terracotta',
  },
  {
    num:   '02',
    title: 'Book',
    desc:  'Choose your perfect stay or vehicle. Pay securely with multiple payment options including mobile money.',
    color: 'from-ocre',
  },
  {
    num:   '03',
    title: 'Arrive',
    desc:  'Get detailed check-in instructions from your verified host. Our support team is available 24/7 if you need anything.',
    color: 'from-forest',
  },
  {
    num:   '04',
    title: 'Belong',
    desc:  'Live like a local. Your host shares insider tips, restaurants, and experiences only the community knows about.',
    color: 'from-earth',
  },
]

const gradients = [
  ['rgba(188,95,56,0.14)', 'rgba(188,95,56,0.04)', '#BC5F38'],
  ['rgba(200,168,78,0.14)', 'rgba(200,168,78,0.04)', '#C8A84E'],
  ['rgba(69,135,112,0.14)', 'rgba(69,135,112,0.04)', '#458770'],
  ['rgba(74,48,32,0.12)', 'rgba(74,48,32,0.03)', '#4A3020'],
]

export default function HowItWorks() {
  return (
    <section className="section-py" style={{ background: 'linear-gradient(180deg, #F0E8DF 0%, #FAF8F4 100%)' }}>
      <div className="container-site">

        {/* Header */}
        <ScrollReveal className="text-center mb-16 md:mb-22">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="section-line" />
            <p className="eyebrow">Simple Process</p>
            <div className="section-line" />
          </div>
          <h2 className="section-heading-xl max-w-lg mx-auto">
            How it{' '}
            <em className="not-italic text-gradient-warm">works</em>
          </h2>
        </ScrollReveal>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line desktop */}
          <div
            className="hidden lg:block absolute top-9 left-[10%] right-[10%] h-px origin-left"
            style={{
              background: 'linear-gradient(90deg, rgba(188,95,56,0.18), rgba(200,168,78,0.25), rgba(69,135,112,0.18), rgba(74,48,32,0.12))',
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map(({ num, title, desc }, i) => (
              <ScrollReveal key={num} delay={i * 110}>
                <div
                  className="relative flex flex-col items-start lg:items-center lg:text-center group rounded-2xl p-6 transition-all duration-350 hover:-translate-y-2"
                  style={{
                    background: 'rgba(255,255,255,0.65)',
                    border: '1px solid rgba(227,218,208,0.70)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 2px 8px rgba(30,18,8,0.05)',
                    transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
                  }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 36px rgba(30,18,8,0.12), 0 4px 12px rgba(30,18,8,0.07)'
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(188,95,56,0.20)'
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(30,18,8,0.05)'
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(227,218,208,0.70)'
                  }}
                >
                  {/* Number badge premium */}
                  <div className="relative z-10 mb-6">
                    <div
                      className="w-[4.5rem] h-[4.5rem] rounded-[1.125rem] flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                      style={{
                        background: `linear-gradient(135deg, ${gradients[i][0]} 0%, ${gradients[i][1]} 100%)`,
                        border: `1.5px solid ${gradients[i][2]}22`,
                        boxShadow: `0 4px 16px ${gradients[i][2]}20, 0 1px 4px rgba(30,18,8,0.08)`,
                      }}
                    >
                      <span
                        className="font-display text-[1.5rem] font-semibold"
                        style={{ color: gradients[i][2] }}
                      >
                        {num}
                      </span>
                    </div>
                    {/* Dot connector */}
                    {i < 3 && (
                      <div
                        className="hidden lg:block absolute -right-[calc(50%+1.125rem)] top-[2.125rem] w-3 h-3 rounded-full"
                        style={{ background: gradients[i][2], opacity: 0.5 }}
                      />
                    )}
                  </div>

                  <h3 className="font-display text-[1.3125rem] font-semibold text-earth-900 mb-2.5 leading-tight">
                    {title}
                  </h3>
                  <p className="font-body text-[0.875rem] text-earth-500 leading-[1.72]">
                    {desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
