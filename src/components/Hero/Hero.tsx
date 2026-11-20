import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import s from './Hero.module.css'

interface HeroSlide {
  num: string
  label: string
  eyebrow: string
  titleHTML: string
  kicker: string
  tagline: string
  copyHTML: string
  primaryCta: string
  primaryLink: string
  secondaryCta: string
  secondaryLink: string
  bgImage: string
}

const HERO_SLIDES: HeroSlide[] = [
  {
    num: '01',
    label: 'SHAKTI SABHA',
    eyebrow: 'Union of Peace & Revolution',
    titleHTML: 'SHAKTI<br><span>SABHA</span>',
    kicker: 'Union of Peace & Revolution',
    tagline: 'Strength. Awareness. Knowledge. Action.',
    copyHTML:
      'Shakti Sabha is a grassroots initiative working across women’s safety, youth engagement, social awareness, Indian history and heritage, and knowledge-driven public dialogue.<br><br>Rooted in ground experience and guided by continuous study, Shakti Sabha brings together practical training, lived experience, research, reflection and dialogue to build greater awareness, confidence and social responsibility.',
    primaryCta: 'Explore Our Work ↗',
    primaryLink: '#work',
    secondaryCta: 'Our Story',
    secondaryLink: '/about',
    bgImage: '/missionmirdani.jpg',
  },
  {
    num: '02',
    label: 'MISSION MARDINI',
    eyebrow: 'Physical & Tactical Preparedness',
    titleHTML: 'MISSION<br><span>MARDINI</span>',
    kicker: 'Physical Sovereignty & Ground Preparedness',
    tagline: 'Fear-Eradication. Lathi-Kaushal. Close-Quarter Combat.',
    copyHTML:
      'Practical self-defence, situational awareness and disciplined training that help girls and young women build physical preparedness, spatial perception and unyielding confidence.<br><br>Over 2,000 girls engaged across schools, colleges, and rural training camps.',
    primaryCta: 'Explore Mardini ↗',
    primaryLink: '/mardini',
    secondaryCta: 'Cohort Camps',
    secondaryLink: '/courses',
    bgImage: '/missionmirdani.jpg',
  },
  {
    num: '03',
    label: 'SHAKTI BHAVA',
    eyebrow: 'Consciousness & Emotional Resilience',
    titleHTML: 'SHAKTI<br><span>BHAVA</span>',
    kicker: 'Psychosocial Awareness & Supportive Dialogue',
    tagline: 'Dignity. Restoration. Inner Balance. Healing.',
    copyHTML:
      'Spaces for reflection, supportive conversations, psychosocial awareness and pathways to appropriate professional care — fostering emotional fortitude and human dignity.<br><br>Confidential intake and survivor rehabilitation networks across Vidarbha and Maharashtra.',
    primaryCta: 'Explore Bhava ↗',
    primaryLink: '/counselling',
    secondaryCta: 'Healing Pods',
    secondaryLink: '/counselling',
    bgImage: '/shaktibhava.jpg',
  },
  {
    num: '04',
    label: 'SHAKTI VARTA',
    eyebrow: 'Research, Dialogue & Critical Inquiry',
    titleHTML: 'SHAKTI<br><span>VARTA</span>',
    kicker: 'Vedic Scholarship & Epigraphical Dialogue',
    tagline: 'Truth. Critical Inquiry. Rigour. Perspective.',
    copyHTML:
      'Research-led dialogue, source-based learning and critical thinking. Reviving forgotten civilizational heroines, historical monographs, and ethical inquiry for an informed public.<br><br>Over 45 research monographs and 500+ institutional dialogues conducted nationwide.',
    primaryCta: 'Read Research ↗',
    primaryLink: '/research',
    secondaryCta: 'Case Studies',
    secondaryLink: '/case-study',
    bgImage: '/shaktivarta.jpg',
  },
  {
    num: '05',
    label: 'INSTITUTIONAL SAHYOG',
    eyebrow: 'Grassroots Alliances & Field Action',
    titleHTML: 'INSTITUTIONAL<br><span>SAHYOG</span>',
    kicker: 'University, CSR & Community Networks',
    tagline: 'Solidarity. Reach. Collective Impact. Unity.',
    copyHTML:
      'Partnering with universities, schools, rural communities, and civil society across India to bridge field observation with institutional practice and systemic empowerment.<br><br>Active partnerships across 28 cities and 400+ educational institutions.',
    primaryCta: 'Partner With Us ↗',
    primaryLink: '/sahyog',
    secondaryCta: 'Field Impact',
    secondaryLink: '/social-work',
    bgImage: '/sahog.jpg',
  },
]

export default function Hero() {
  const [currentIdx, setCurrentIdx] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
  }, [])

  // Optional auto-rotation every 9 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 9000)
    return () => clearInterval(timer)
  }, [nextSlide])

  const slide = HERO_SLIDES[currentIdx]

  return (
    <div className={s.heroPinWrapper}>
      {/* ── Main Hero Section ── */}
      <section className={s.hero}>
        <div
          className={s.heroImage}
          style={{ backgroundImage: `url(${slide.bgImage})` }}
          aria-hidden="true"
        />
        <div className={s.heroImageOverlay} aria-hidden="true" />

        <div className={s.heroContent}>
          <div className={s.eyebrow}>{slide.eyebrow}</div>
          <h1
            className={s.heroTitle}
            dangerouslySetInnerHTML={{ __html: slide.titleHTML }}
          />
          <p className={s.heroKicker}>{slide.kicker}</p>
          <p className={s.heroTagline}>{slide.tagline}</p>
          <p
            className={s.heroCopy}
            dangerouslySetInnerHTML={{ __html: slide.copyHTML }}
          />

          <div className={s.actions}>
            {slide.primaryLink.startsWith('#') ? (
              <a href={slide.primaryLink} className={`${s.button} ${s.buttonPrimary}`}>
                {slide.primaryCta}
              </a>
            ) : (
              <Link to={slide.primaryLink} className={`${s.button} ${s.buttonPrimary}`}>
                {slide.primaryCta}
              </Link>
            )}

            {slide.secondaryLink.startsWith('#') ? (
              <a href={slide.secondaryLink} className={`${s.button} ${s.buttonGhost}`}>
                {slide.secondaryCta}
              </a>
            ) : (
              <Link to={slide.secondaryLink} className={`${s.button} ${s.buttonGhost}`}>
                {slide.secondaryCta}
              </Link>
            )}
          </div>
        </div>

        {/* ── Slide Index Indicator & Controls ── */}
        <div className={s.heroIndex}>
          <div>
            <b>{slide.num}</b> / {slide.label}
          </div>
          <div className={s.slideNavBtns}>
            <button
              type="button"
              className={s.slideNavBtn}
              onClick={prevSlide}
              aria-label="Previous Slide"
            >
              ‹
            </button>
            <button
              type="button"
              className={s.slideNavBtn}
              onClick={nextSlide}
              aria-label="Next Slide"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* ── Section Intro (4-Column Trio from HTML Prototype) ── */}
      <section className={s.intro} id="work">
        <div className={s.introPanel}>
          <div>
            <div className={s.symbol}>शक्ति</div>
            <h2>Who We Are</h2>
            <p>
              Shakti Sabha brings together initiatives for women&apos;s safety, resilience, learning and community participation.
            </p>
          </div>
          <Link to="/about" className={s.textLink}>
            Discover our purpose <span>→</span>
          </Link>
        </div>

        {/* Feature 01: Physical Preparedness */}
        <article className={s.feature}>
          <div className={s.featureNo}>01.</div>
          <h3>Physical Preparedness</h3>
          <div className={s.small}>Mission Mardini</div>
          <div className={s.featureImage}>
            <img
              src="/missionmirdani.jpg"
              alt="Mission Mardini training"
              loading="lazy"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src = '/socialwork/social-1.jpg'
              }}
            />
          </div>
          <p>
            Practical self-defence, situational awareness and disciplined training that help participants build confidence.
          </p>
          <Link to="/mardini" className={s.featureLink}>
            Explore programme <span>→</span>
          </Link>
        </article>

        {/* Feature 02: Emotional Resilience */}
        <article className={s.feature}>
          <div className={s.featureNo}>02.</div>
          <h3>Emotional Resilience</h3>
          <div className={s.small}>Shakti Bhava</div>
          <div className={s.featureImage}>
            <img
              src="/shaktibhava.jpg"
              alt="Shakti Bhava support initiative"
              loading="lazy"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src = '/socialwork/social-2.jpg'
              }}
            />
          </div>
          <p>
            Spaces for reflection, supportive conversations, awareness and pathways to appropriate help.
          </p>
          <Link to="/counselling" className={s.featureLink}>
            Explore programme <span>→</span>
          </Link>
        </article>

        {/* Feature 03: Ideas & Inquiry */}
        <article className={s.feature}>
          <div className={s.featureNo}>03.</div>
          <h3>Ideas &amp; Inquiry</h3>
          <div className={s.small}>Shakti Varta</div>
          <div className={s.featureImage}>
            <img
              src="/shaktivarta.jpg"
              alt="Shakti Varta discourse initiative"
              loading="lazy"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src = '/socialwork/social-3.jpg'
              }}
            />
          </div>
          <p>
            Research-led dialogue, source-based learning and critical thinking for an informed public.
          </p>
          <Link to="/research" className={s.featureLink}>
            Explore programme <span>→</span>
          </Link>
        </article>
      </section>
    </div>
  )
}
