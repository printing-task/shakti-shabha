import { useEffect, useRef } from 'react'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './HistoryGirls.module.css'

gsap.registerPlugin(ScrollTrigger)

const HISTORICAL = [
  { icon:'workspace_premium', name:'Rani Lakshmibai',       meta:'Warrior Queen · 1857' },
  { icon:'swords', name:'Kittur Chennamma',       meta:'Freedom Fighter · 1824' },
  { icon:'biotech', name:'Anandibai Joshi',        meta:"India's First Woman Doctor" },
  { icon:'history_edu', name:'Vijaya Lakshmi Pandit',  meta:'Diplomat · UN President' },
]

const SUCCESS = [
  { icon:'rocket_launch', name:'Ritu, IAS 2023',         meta:'Shakti Sabha Camp Alumna' },
  { icon:'military_tech', name:'Meera, National Athlete', meta:'Lathi-Kaushal Programme' },
  { icon:'terminal', name:'Anjali, Tech Lead',       meta:'Aaryaveera Graduate' },
  { icon:'palette', name:'Kavya, Working Artist',   meta:'Mardini Camp, 2019' },
]

const TIMELINE = [
  { year:'2019', text:'First self-defense camp, Wardha. 12 girls. One mat. One instructor.', big: false },
  { year:'2021', text:'Expanded to 50 schools across Vidarbha. Media archive begins.',       big: false },
  { year:'2023', text:'Shakti Varta launches — podcast, white papers, legal collage.',        big: true  },
  { year:'2025', text:'Aaryaveera philosophy codified by founder. Shakti Sabha leadership batches inaugurated.', big: false },
  { year:'2026', text:'400+ schools. Platform launch. Digital chapter begins.',               big: true  },
]

export default function HistoryGirls() {
  const secRef  = useRef<HTMLElement>(null)
  const tlRef   = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Panels fade in
      gsap.from('[data-hg="panel"]', {
        opacity: 0, y: 28, stagger: 0.14, duration: 0.65, ease: 'power3.out',
        scrollTrigger: { trigger: secRef.current, start: 'top 72%' }
      })

      // Figure cards
      gsap.from('[data-hg="card"]', {
        opacity: 0, scale: 0.93, stagger: 0.06, duration: 0.45, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '[data-hg="panel"]', start: 'top 80%' }
      })

      // Spine line grows down
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: 'top center',
            duration: 1.6,
            ease: 'power2.inOut',
            scrollTrigger: { trigger: tlRef.current, start: 'top 75%' }
          }
        )
      }

      // Each entry slides in alternately
      const entries = tlRef.current?.querySelectorAll('[data-hg="tl-entry"]')
      entries?.forEach((el, i) => {
        const fromLeft = i % 2 === 0
        gsap.fromTo(el,
          { opacity: 0, x: fromLeft ? -40 : 40 },
          {
            opacity: 1, x: 0,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })

      // Dots pulse in
      const dots = tlRef.current?.querySelectorAll('[data-hg="tl-dot"]')
      dots?.forEach((dot, i) => {
        gsap.fromTo(dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1,
            duration: 0.4,
            ease: 'back.out(2)',
            delay: i * 0.15,
            scrollTrigger: {
              trigger: dot,
              start: 'top 88%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })

    }, secRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className={s.section}>

      {/* Header */}
      <div className={s.header}>
        <h2>History &amp; Today's Success Girls</h2>
        <p>The women who came before us made this possible. The women we walk with today are making it inevitable.</p>
      </div>

      {/* Dual panels */}
      <div className={s.dual}>
        <div data-hg="panel" className={s.panel}>
          <span className={s.panelBar} style={{ background:'linear-gradient(to right,#bd1834,#9A3520)' }} />
          <span className={s.panelLabel}>Historical Women Warriors</span>
          <div className={s.panelTitle}>They Led the Way</div>
          <div className={s.cards}>
            {HISTORICAL.map(h => (
              <div key={h.name} data-hg="card" className={s.figCard}>
                <div className={s.figIcon}><GoogleIcon name={h.icon} size={24} /></div>
                <div className={s.figName}>{h.name}</div>
                <div className={s.figMeta}>{h.meta}</div>
              </div>
            ))}
          </div>
        </div>

        <div data-hg="panel" className={s.panel}>
          <span className={s.panelBar} style={{ background:'linear-gradient(to right,#15803D,#86EFAC)' }} />
          <span className={s.panelLabel} style={{ color:'#15803D' }}>Today's Success Girls</span>
          <div className={s.panelTitle}>They Are Writing It Now</div>
          <div className={s.cards}>
            {SUCCESS.map(g => (
              <div key={g.name} data-hg="card" className={s.figCard}>
                <div className={s.figIcon}><GoogleIcon name={g.icon} size={24} /></div>
                <div className={s.figName}>{g.name}</div>
                <div className={s.figMeta}>{g.meta}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Alternating Centre-Spine Timeline ── */}
      <div className={s.tlWrap}>
        <div className={s.tlLabel}>Shakti Sabha Journey</div>

        {/* growing spine line */}
        <div className={s.tlSpine}>
          <div ref={lineRef} className={s.tlLine} />
        </div>

        <div ref={tlRef} className={s.tlEntries}>
          {TIMELINE.map((t, i) => (
            <div
              key={t.year}
              data-hg="tl-entry"
              className={`${s.tlEntry} ${i % 2 === 0 ? s.tlLeft : s.tlRight}`}
            >
              {/* dot on spine */}
              <span
                data-hg="tl-dot"
                className={`${s.tlDot} ${t.big ? s.tlDotBig : ''}`}
              />

              {/* card */}
              <div className={s.tlCard}>
                <div className={`${s.tlYear} ${t.big ? s.tlYearBig : ''}`}>
                  {t.year}
                </div>
                <p className={s.tlText}>{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop:'2rem' }}>
        <Link to="/history" className="btn-magnetic btn-gold">Full History &amp; Success Stories →</Link>
      </div>

    </section>
  )
}
