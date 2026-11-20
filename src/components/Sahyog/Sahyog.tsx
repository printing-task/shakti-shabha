import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './Sahyog.module.css'

gsap.registerPlugin(ScrollTrigger)

const COLS_DATA = [
  [
    '/collab/collab-1.jpg',
    '/collab/collab-2.jpg',
    '/collab/collab-3.jpg',
    '/collab/collab-4.jpg',
    '/collab/collab-5.jpg',
    '/collab/collab-6.jpg',
    '/collab/collab-7.jpg',
    '/collab/collab-8.jpg',
  ],
  [
    '/collab/collab-9.jpg',
    '/collab/collab-10.jpg',
    '/collab/collab-11.jpg',
    '/collab/collab-12.jpg',
    '/collab/collab-1.jpg',
    '/collab/collab-2.jpg',
    '/collab/collab-3.jpg',
    '/collab/collab-4.jpg',
  ],
  [
    '/collab/collab-5.jpg',
    '/collab/collab-6.jpg',
    '/collab/collab-7.jpg',
    '/collab/collab-8.jpg',
    '/collab/collab-9.jpg',
    '/collab/collab-10.jpg',
    '/collab/collab-11.jpg',
    '/collab/collab-12.jpg',
  ],
  [
    '/collab/collab-3.jpg',
    '/collab/collab-7.jpg',
    '/collab/collab-1.jpg',
    '/collab/collab-11.jpg',
    '/collab/collab-5.jpg',
    '/collab/collab-9.jpg',
    '/collab/collab-2.jpg',
    '/collab/collab-8.jpg',
  ],
  [
    '/collab/collab-4.jpg',
    '/collab/collab-8.jpg',
    '/collab/collab-12.jpg',
    '/collab/collab-2.jpg',
    '/collab/collab-6.jpg',
    '/collab/collab-10.jpg',
    '/collab/collab-3.jpg',
    '/collab/collab-7.jpg',
  ],
]

export default function Sahyog() {
  const secRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-sy="text"]', {
        opacity: 0,
        y: 22,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: secRef.current, start: 'top 75%' }
      })
    }, secRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className={s.section}>

      {/* TOP HALF: Content centered & responsive */}
      <div className={s.top}>
        <div className={s.textCol}>
          <div data-sy="text" className={s.eyebrow}>Dialogue &amp; Collaboration · Multi-Sectoral Engagement</div>

          <div data-sy="text" className={s.titleBlock}>
            <h2 className={s.title}>Dialogue &amp; Collaboration</h2>
            <span className={s.hindi}>संवाद एवं संस्थागत सहकार्य</span>
          </div>

          <p data-sy="text" className={s.desc}>
            Rigorous knowledge demands multi-sectoral engagement and open civic discourse. Shakti Sabha actively collaborates across universities, independent scholars, civil society, statutory public institutions, and civic assemblies to translate field observations into systemic action.
          </p>

          <div data-sy="text" className={s.pillars}>
            {[
              { tag: 'Universities',   title: 'Joint Field Studies & Archival Research', icon: 'school' },
              { tag: 'Researchers',    title: 'Independent Fellows & Monograph Panels',  icon: 'psychology' },
              { tag: 'Civil Society',  title: 'Grassroots Crisis Networks & Shelters',   icon: 'diversity_1' },
              { tag: 'Institutions',   title: 'Statutory Panels & Women Welfare Boards', icon: 'account_balance' },
              { tag: 'Public Forums',  title: 'Open Symposia, Plenaries & Townhalls',    icon: 'forum' },
            ].map(p => (
              <div key={p.title} className={s.pillItem}>
                <span className={s.pillIcon}><GoogleIcon name={p.icon} size={22} /></span>
                <div className={s.pillInfo}>
                  <div className={s.pillTag}>{p.tag}</div>
                  <div className={s.pillTitle}>{p.title}</div>
                </div>
              </div>
            ))}
          </div>

          <Link data-sy="text" to="/sahyog" className={s.ctaBtn}>
            Propose Institutional Partnership →
          </Link>
        </div>
      </div>

      {/* BOTTOM HALF: 3D Infinite Scroll Columns */}
      <div className={s.bottom}>
        <div className={s.colWrapper}>
          <div className={s.columns}>
            {COLS_DATA.map((col, ci) => (
              <div
                key={ci}
                className={`${s.col} ${ci % 2 === 0 ? s.colUp : s.colDown}`}
              >
                {[...col, ...col].map((img, ii) => (
                  <div
                    key={ii}
                    className={s.colImg}
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}
