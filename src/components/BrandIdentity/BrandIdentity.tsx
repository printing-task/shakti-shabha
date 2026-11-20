import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './BrandIdentity.module.css'

export default function BrandIdentity() {
  const secRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-br]', {
        opacity: 0, y: 20, stagger: 0.07, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: secRef.current, start: 'top 75%' }
      })
    }, secRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className={s.section}>
      <div className={s.header}>
        <h2>Brand Identity</h2>
        <p>The visual language of Shakti Sabha — crimson fire, forest peace, and Aaryaveera gold. Full guidelines, logo files, and brand assets on the Brand page.</p>
      </div>
      <div className={s.grid}>
        <div data-br className={s.panel}>
          <p className={s.panelTitle}>Typography</p>
          <div className={s.typeRow}>
            <div className={s.typeSample} style={{ fontFamily: 'var(--serif, "Playfair Display", Georgia, serif)', fontSize: '2.2rem', fontWeight: 600 }}>Playfair Display</div>
            <div className={s.typeMeta}>Serif · Editorial Headings · Quotes · Kicker</div>
          </div>
          <div className={s.typeRow}>
            <div className={s.typeSample} style={{ fontFamily: 'var(--display, "Cinzel", Georgia, serif)', fontSize: '2.2rem', fontWeight: 700 }}>Cinzel</div>
            <div className={s.typeMeta}>Display · Brand Identity · Emblems · Roman Numerals</div>
          </div>
          <div className={s.typeRow}>
            <div className={s.typeSample} style={{ fontFamily: 'var(--sans, "DM Sans", Arial, sans-serif)', fontSize: '1.5rem', fontWeight: 500 }}>DM Sans</div>
            <div className={s.typeMeta}>Body · UI · Navigation · Buttons · Clean &amp; Legible</div>
          </div>
          <div className={s.typeRow}>
            <div className={s.typeSample} style={{ fontFamily: 'Noto Sans Devanagari, sans-serif', fontSize: '1.5rem' }}>देवनागरी</div>
            <div className={s.typeMeta}>Devanagari · Hindi text · Noto Sans Devanagari</div>
          </div>
          <div className={s.typeRow}>
            <div className={s.typeSample} style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Scale: 7rem · 3rem · 2rem · 1.35rem · 1rem · 0.875rem · 0.8rem · 0.65rem</div>
            <div className={s.typeMeta}>Base unit: 4px · Border radius: 2px (sharp, intentional)</div>
          </div>
        </div>
      </div>
      <div className={s.cta}>
        <Link to="/brand" className="btn-magnetic btn-gold">Full Brand Guidelines →</Link>
      </div>
    </section>
  )
}
