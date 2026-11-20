import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GoogleIcon from '../GoogleIcon/GoogleIcon'

gsap.registerPlugin(ScrollTrigger)

const PILLARS = [
  {
    icon: 'calendar_month',
    stat: '7+ Years',
    label: 'Years of Fieldwork (2019–2026)',
    desc: 'Uninterrupted grassroots operations, research documentation, and field mobilization since inception in 2019.',
    accent: '#DC143C'
  },
  {
    icon: 'military_tech',
    stat: '120+',
    label: 'Structured Field Programmes',
    desc: '7–10 day tactical bootcamps, trauma recovery pods, university colloquia, and youth character cohorts.',
    accent: '#166534'
  },
  {
    icon: 'pin_drop',
    stat: '200+ Villages',
    label: 'Field Locations & 14 Districts',
    desc: 'Deep penetration across rural talukas, tribal hostels, and semi-urban transit corridors in Maharashtra and Central India.',
    accent: '#D97706'
  },
  {
    icon: 'menu_book',
    stat: '45+',
    label: 'Research Publications & Briefs',
    desc: 'Peer-reviewed working papers, legal critique monographs, Modi-script historical translations, and case files.',
    accent: '#3730A3'
  },
  {
    icon: 'handshake',
    stat: '28+',
    label: 'Institutional Partnerships',
    desc: 'Formal university alliances, statutory Child Welfare Committee (CWC) coordination, and civil society networks.',
    accent: '#0284C7'
  }
]

export default function ImpactGrid() {
  const secRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      gsap.from('[data-ig="header"]', {
        opacity: 0,
        y: 24,
        duration: 0.65,
        ease: 'power3.out',
        clearProps: 'transform,opacity', scrollTrigger: { trigger: secRef.current, start: 'top 85%', toggleActions: 'play none none none' }
      })

      // Cards stagger entrance
      gsap.from('[data-ig="card"]', {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.65,
        ease: 'power3.out',
        clearProps: 'transform,opacity', scrollTrigger: { trigger: secRef.current, start: 'top 85%', toggleActions: 'play none none none' }
      })
    }, secRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={secRef}
      style={{ background: '#FFFFFF', padding: '4rem 1.5rem', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div
          data-ig="header"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.25rem' }}
        >
          <div>
            <div style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: '#DC143C',
              fontWeight: 700,
              fontFamily: "'Cinzel', serif",
              marginBottom: '0.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.75rem',
              background: 'rgba(220, 20, 60, 0.06)',
              border: '1px solid rgba(220, 20, 60, 0.2)',
              borderRadius: 9999
            }}>
              <GoogleIcon name="verified" size={14} style={{ color: '#DC143C' }} />
              Institutional Credibility · Audited Record
            </div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)', color: '#111827', margin: 0, fontWeight: 700, lineHeight: 1.2 }}>
              Verified Numbers &amp; Field Record
            </h2>
          </div>
          <Link
            to="/impact"
            style={{
              color: '#DC143C',
              textDecoration: 'none',
              fontFamily: "var(--btn-font, 'Poppins', sans-serif)",
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: 600,
              padding: '0.6rem 1.4rem',
              minHeight: 40,
              borderRadius: 9999,
              background: '#FFFFFF',
              border: '1px solid rgba(220, 20, 60, 0.4)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.2s ease'
            }}
          >
            <span>View 3-Depth Archive &amp; Taxonomy</span>
            <GoogleIcon name="arrow_forward" size={15} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', alignItems: 'stretch' }}>
          {PILLARS.map((p, idx) => (
            <div
              key={idx}
              data-ig="card"
              className="card-hover"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 16,
                padding: '1.75rem 1.4rem',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                cursor: 'default'
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: p.accent }} />

              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `${p.accent}12`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                color: p.accent
              }}>
                <GoogleIcon name={p.icon} size={24} />
              </div>

              <div style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '1.85rem',
                fontWeight: 700,
                color: p.accent,
                lineHeight: 1.1,
                marginBottom: '0.35rem'
              }}>
                {p.stat}
              </div>

              <h3 style={{
                fontSize: '0.98rem',
                fontWeight: 700,
                color: '#111827',
                margin: '0 0 0.5rem',
                lineHeight: 1.35,
                fontFamily: "'Cinzel', serif"
              }}>
                {p.label}
              </h3>

              <p style={{
                margin: 0,
                fontSize: '0.86rem',
                color: '#4B5563',
                lineHeight: 1.65,
                flex: 1
              }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
