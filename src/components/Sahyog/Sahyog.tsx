import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './Sahyog.module.css'

gsap.registerPlugin(ScrollTrigger)

const COLS_DATA = [
  [
    'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=300&auto=format&fit=crop',
  ],
  [
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=300&h=300&auto=format&fit=crop',
  ],
  [
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=300&auto=format&fit=crop',
  ],
  [
    'https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=300&auto=format&fit=crop',
  ],
  [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&auto=format&fit=crop',
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
          <div data-sy="text" className={s.eyebrow}>Partnerships &amp; Support</div>

          <div data-sy="text" className={s.titleBlock}>
            <h2 className={s.title}>Our Sahyog</h2>
            <span className={s.hindi}>सहयोग — Institutional Alliance & Collective Action</span>
          </div>

          <p data-sy="text" className={s.desc}>
            Shakti Sabha stands with organizations, institutions, and individuals
            who believe in the same truth — that every woman deserves safety,
            dignity, and opportunity. Our Sahyog program builds bridges across
            sectors for collective action.
          </p>

          <div data-sy="text" className={s.pillars}>
            {[
              { tag: 'Corporates', title: 'CSR & Sponsorship', icon: 'domain' },
              { tag: 'NGOs',       title: 'Partner Network',   icon: 'eco' },
              { tag: 'Students',   title: 'Internships',       icon: 'school' },
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
            Become a Partner →
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
