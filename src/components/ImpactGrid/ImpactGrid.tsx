import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GoogleIcon from '../GoogleIcon/GoogleIcon'

gsap.registerPlugin(ScrollTrigger)

const PILLARS = [
  {
    icon: 'sports_kabaddi',
    label: 'Direct Somatic & Tactical Cadets',
    desc: '7–10 day residential self-defense, Lathi-Kaushal & biomechanics bootcamps across welfare hostels, colleges & community camps.',
    accent: '#DC143C'
  },
  {
    icon: 'school',
    label: 'Youth via Institutional Forums',
    desc: 'Direct in-person participants across schools, colleges, and university hostels in character-building & cognitive focus sessions.',
    accent: '#166534'
  },
  {
    icon: 'forum',
    label: 'Policy & Discourse Attendees',
    desc: 'Scholars and citizens across national plenaries (CIDCO Navi Mumbai, Lata Mangeshkar Auditorium, Ratlam State Dialogue).',
    accent: '#D97706'
  },
  {
    icon: 'security',
    label: 'High-Risk Crisis Mediations',
    desc: 'Frontline human trafficking interceptions, Child Welfare Committee (CWC) coordination, and family crisis reconciliations.',
    accent: '#4F46E5'
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
              Verified Institutional Footprint
            </div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)', color: '#111827', margin: 0, fontWeight: 700, lineHeight: 1.2 }}>
              High-Level Impact Summary
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
          {PILLARS.map((p, idx) => (
            <div
              key={idx}
              data-ig="card"
              className="card-hover"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 16,
                padding: '2rem 1.6rem',
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
                marginBottom: '1.25rem',
                color: p.accent
              }}>
                <GoogleIcon name={p.icon} size={24} />
              </div>

              <h3 style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#111827',
                margin: '0 0 0.75rem',
                lineHeight: 1.4,
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
