import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import s from './SocialWorkHero.module.css'

const WORDS = [
  'SURVIVORS.',
  'WARRIORS.',
  'DAUGHTERS.',
  'RURAL GIRLS.',
  'COMMUNITIES.',
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
            NGO Archive · 7 Years on the Ground (Starting from 2019)
          </span>
        </div>

        <h1 className={s.heroTitle}>
          <span className={s.headingPrefix}>WE WORK</span>
          <span className={s.crimsonLine}>FOR WOMEN</span>
        </h1>

        <div className={s.missionRotator}>
          <span className={s.rotatorLabel}>EMPOWERING:</span>
          <span className={s.rotatorWord}>
            {displayedText}
            <span className={s.cursor}>|</span>
          </span>
        </div>

        <p className={s.desc}>
          Twelve years of fearless grassroots empowerment — organizing martial self-defense
          camps, survivor healing pods, legal literacy circles, and rural leadership across 200+ villages.
        </p>

        <Link to="/events" className={s.bookLink}>
          <span className={s.linktext}>Join Our Mission</span>
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
                src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=900&auto=format&fit=crop&q=80"
                alt="Martial Self-Defense Camp"
                loading="eager"
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
                src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=900&auto=format&fit=crop&q=80"
                alt="Survivor Healing Pod"
                loading="lazy"
              />
            </div>
          </div>

          {/* Box 6: Image (Young Leadership & Character Academy) */}
          <div className={s.box}>
            <div className={s.bgImg}>
              <img
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80"
                alt="Youth Leadership Academy"
                loading="lazy"
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
                src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=900&auto=format&fit=crop&q=80"
                alt="Rural Community Action"
                loading="lazy"
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
