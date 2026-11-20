import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import s from './SocialWorkHero.module.css'

const WORDS = [
  'CRITICAL VULNERABILITIES.',
  'INFORMED ACTION.',
  'COMMUNITY RESILIENCE.',
  'GROUND REALITIES.',
  'CIVILIZATIONAL STRENGTH.',
]

export default function SocialWorkHero() {
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(WORDS[0].length)
  const [isDeleting, setIsDeleting] = useState(false)

  // Typewriter effect rotating through empowerment areas
  useEffect(() => {
    const currentWord = WORDS[wordIdx]
    let timeout: ReturnType<typeof setTimeout>

    if (!isDeleting) {
      if (charIdx < currentWord.length) {
        timeout = setTimeout(() => {
          setCharIdx((prev) => prev + 1)
        }, 110)
      } else {
        // Pause at completed word
        timeout = setTimeout(() => {
          setIsDeleting(true)
        }, 2200)
      }
    } else {
      if (charIdx > 0) {
        timeout = setTimeout(() => {
          setCharIdx((prev) => prev - 1)
        }, 45)
      } else {
        setIsDeleting(false)
        setWordIdx((prev) => (prev + 1) % WORDS.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [charIdx, isDeleting, wordIdx])

  const displayedText = WORDS[wordIdx].substring(0, charIdx)

  return (
    <section className={s.infoSection}>
      {/* ── Left Part ── */}
      <div className={s.leftPart}>
        <div className={s.topNav}>
          <span className={s.badge}>
            FIELD OBSERVATIONS · 2019–PRESENT
          </span>
        </div>

        <h2 className={s.heroTitle}>
          <span className={s.headingPrefix}>WHAT THE FIELD</span>
          <span className={s.crimsonLine}>REVEALS</span>
        </h2>

        <div className={s.missionRotator}>
          <span className={s.rotatorLabel}>UNCOVERING:</span>
          <span className={s.rotatorWord}>
            {displayedText}
            <span className={s.cursor}>|</span>
          </span>
        </div>

        <p className={s.desc}>
          Over seven years of continuous direct engagement across rural settlements, educational institutions,
          and urban communities, field observation reveals the essential need to combine physical preparedness,
          psychosocial awareness, and critical inquiry to foster lasting social resilience.
        </p>

        <Link to="/events" className={s.bookLink}>
          <span className={s.linktext}>Explore Field Initiatives</span>
          <span className={s.arrow}>
            <span></span>
          </span>
        </Link>
      </div>

      {/* ── Right Part (Animated 3x3 Grid) ── */}
      <div className={s.rightPart}>
        {/* Animated wave lines (Crimson Red SVG) */}
        <div className={s.bgLine}>
          <img src="/svg/wave.svg" alt="Wave line" />
          <img src="/svg/wave.svg" alt="Wave line" />
        </div>

        {/* 8-Box Orbiting Grid */}
        <div className={`${s.mainGrid} ${s.dFlex}`}>
          {/* Box 1: Text */}
          <div className={s.box}>
            <span>Lathi-Kaushal</span>
          </div>

          {/* Box 2: Image (Martial Self-Defense & Lathi Training) */}
          <div className={s.box}>
            <div className={s.bgImg}>
              <img
                src={encodeURI('/socialwork/IMG-20250128-WA0025.jpg')}
                alt="Martial Self-Defense Camp"
                loading="eager"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).src = '/socialwork/social-1.jpg'
                }}
              />
            </div>
          </div>

          {/* Box 3: Text */}
          <div className={s.box}>
            <span>Healing Circles</span>
          </div>

          {/* Box 4: Text */}
          <div className={s.box}>
            <span>Legal Rights</span>
          </div>

          {/* Box 5: Image (Survivor Circle Support) */}
          <div className={s.box}>
            <div className={s.bgImg}>
              <img
                src={encodeURI('/socialwork/20260524_135910 (1).jpg')}
                alt="Survivor Healing Pod"
                loading="lazy"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).src = '/socialwork/social-2.jpg'
                }}
              />
            </div>
          </div>

          {/* Box 6: Image (Young Leadership & Character Academy) */}
          <div className={s.box}>
            <div className={s.bgImg}>
              <img
                src={encodeURI('/socialwork/IMG-20250423-WA0020 (1).jpg')}
                alt="Youth Leadership Academy"
                loading="lazy"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).src = '/socialwork/social-3.jpg'
                }}
              />
            </div>
          </div>

          {/* Box 7: Text */}
          <div className={s.box}>
            <span>Rural Outreach</span>
          </div>

          {/* Box 8: Image (Community Gathering & Village Camps) */}
          <div className={s.box}>
            <div className={s.bgImg}>
              <img
                src={encodeURI('/socialwork/IMG-20250606-WA0006 (1).jpg')}
                alt="Rural Community Action"
                loading="lazy"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).src = '/socialwork/social-4.jpg'
                }}
              />
            </div>
          </div>
        </div>

        {/* Triple horizontal circle rings (Crimson Red SVG) */}
        <div className={s.bgCircleHLine}>
          <img src="/svg/circle-ring.svg" alt="Horizontal circle ring" />
          <img src="/svg/circle-ring.svg" alt="Horizontal circle ring" />
          <img src="/svg/circle-ring.svg" alt="Horizontal circle ring" />
        </div>

        {/* Rotating dashed circle (Crimson Red SVG) */}
        <div className={s.bgDashCircle}>
          <img src="/svg/dash-circle.svg" alt="Rotating dash circle" />
        </div>
      </div>
    </section>
  )
}
