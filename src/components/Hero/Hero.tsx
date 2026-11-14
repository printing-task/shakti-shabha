import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import s from './Hero.module.css'

gsap.registerPlugin(ScrollTrigger)

/* ============================================================
   Hero Component
   ============================================================ */

export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const secRef = useRef<HTMLElement>(null)
  const downRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  

  /* GSAP Entrance Animation */
  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      gsap.set(content, { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        '[data-hero="badge"]',
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
      .fromTo(
        '[data-hero="title"]',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.3'
      )
      .fromTo(
        '[data-hero="motto"]',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      )
      .fromTo(
        '[data-hero="desc"]',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.65 },
        '-=0.3'
      )
      .fromTo(
        '[data-hero="cta"]',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.3'
      )
      .fromTo(
        '[data-hero="metrics"]',
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.2'
      )
      .fromTo(
        '[data-hero="pillars"]',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.3'
      )
    }, secRef)

    return () => ctx.revert()
  }, [])

  

  /* @traf shrink & scale-down parallax scroll */
  useEffect(() => {
    const wrap = wrapperRef.current
    const hero = secRef.current
    const down = downRef.current
    if (!wrap || !hero) return

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.3,
      onUpdate: (self) => {
        const p = self.progress
        const scale = 1 - p * 0.12
        const yPercent = p * 8
        const radius = p * 24
        const shadowAlpha = p * 0.35
        hero.style.transform = `translate3d(0, ${yPercent}%, 0) scale(${scale})`
        hero.style.borderRadius = `${radius}px`
        hero.style.boxShadow = `0 25px 70px rgba(0, 0, 0, ${shadowAlpha})`

        if (down) {
          down.style.opacity = `${Math.max(0, 1 - p * 3.5)}`
        }
      },
    })

    return () => {
      st.kill()
    }
  }, [])

  const handleExplore = () => {
    const wrap = wrapperRef.current
    const nextEl = wrap?.nextElementSibling ?? secRef.current?.nextElementSibling
    if (nextEl) {
      nextEl.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
    }
  }

  return (
    <div ref={wrapperRef} className={s.heroWrapper}>
      <section
        ref={secRef}
        className={s.heroSection}
        
      >
        

        <div ref={contentRef} className={s.heroContent}>
          {/* Institutional Badge */}
          <div data-hero="badge" className={s.badge}>
            <GoogleIcon name="swords" size={15} style={{ color: '#DC143C' }} />
            <span>THE UNION OF PEACE &amp; REVOLUTION</span>
          </div>

          {/* Main Title */}
          <h1 data-hero="title" className={s.title}>
            SHAKTI <span className={s.crimson}>SABHA</span>
          </h1>

          {/* Motto Row */}
          <div data-hero="motto" className={s.mottoRow}>
            <span className={s.mottoSanskrit}>Peace Through Strength</span>
            <span className={s.mottoSep}>·</span>
            <span className={s.mottoSub}>Sovereignty, Strength &amp; Psychological Resilience</span>
          </div>

          {/* Description */}
          <p data-hero="desc" className={s.description}>
            A sovereign institutional movement for Indian women — uniting tactical close-quarter combat, trauma-informed clinical psychological care, and uncompromising civilizational scholarship.
          </p>

          {/* Action CTAs */}
          <div data-hero="cta" className={s.ctaGroup}>
            <button
              type="button"
              onClick={handleExplore}
              className={s.ctaPrimary}
            >
              Explore The Three Streams ↓
            </button>
            <Link to="/sahyog" className={s.ctaSecondary}>
              Institutional Alliances →
            </Link>
          </div>

          {/* Institutional Metric Strip */}
          <div data-hero="metrics" className={s.metricStrip}>
            <div className={s.metricItem}>
              <span className={s.metricValue}>7+ Yrs</span>
              <span className={s.metricLabel}>On-Ground Dedication</span>
            </div>
            <div className={s.metricDivider} />
            <div className={s.metricItem}>
              <span className={s.metricValue}>2,000+</span>
              <span className={s.metricLabel}>Cadets Weaponized</span>
            </div>
            <div className={s.metricDivider} />
            <div className={s.metricItem}>
              <span className={s.metricValue}>25,000+</span>
              <span className={s.metricLabel}>Youth Reached</span>
            </div>
            <div className={s.metricDivider} />
            <div className={s.metricItem}>
              <span className={s.metricValue}>100%</span>
              <span className={s.metricLabel}>Confidential Care</span>
            </div>
          </div>

          {/* The Three Pillars Preview */}
          <div data-hero="pillars" className={s.pillarsRow}>
            <Link to="/mardini" className={s.pillarPill} title="Mission Mardini Tactical Combat">
              <span className={s.pillarDot} style={{ background: '#DC143C' }} />
              <span className={s.pillarName}>01 · Combat</span>
              <span className={s.pillarTag}>Mission Mardini</span>
            </Link>
            <Link to="/shakti-bhava" className={s.pillarPill} title="Shakti Bhava Clinical Healing">
              <span className={s.pillarDot} style={{ background: '#166534' }} />
              <span className={s.pillarName}>02 · Healing</span>
              <span className={s.pillarTag}>Shakti Bhava</span>
            </Link>
            <Link to="/shakti-varta" className={s.pillarPill} title="Shakti Varta Civilizational Discourse">
              <span className={s.pillarDot} style={{ background: '#4338CA' }} />
              <span className={s.pillarName}>03 · Discourse</span>
              <span className={s.pillarTag}>Shakti Varta</span>
            </Link>
          </div>
        </div>

        {/* Scroll Down Chevron */}
        <div
          ref={downRef}
          className={s.down}
          onClick={handleExplore}
          role="button"
          tabIndex={0}
          aria-label="Scroll down"
        >
          <svg
            viewBox="0 0 24 24"
            width="26"
            height="26"
            stroke="currentColor"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="7 13 12 18 17 13" />
            <polyline points="7 6 12 11 17 6" />
          </svg>
        </div>
      </section>
    </div>
  )
}
