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
    // Non-blocking entrance: timeline is immediately visible on scroll
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
