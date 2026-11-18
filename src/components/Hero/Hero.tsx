import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import s from './Hero.module.css'

gsap.registerPlugin(ScrollTrigger)

interface HeroSlide {
  num: string
  category: string
  tabShort: string
  watermark: string
  eyebrow: string
  headlineHTML: string
  title: string
  desc: string
  cta: string
  ctaLink: string
  secCta: string
  secLink: string
  tag: string
  subTag: string
  bgImage: string
  theme: {
    bg: string
    text: string
    muted: string
    accent: string
    border: string
    watermark: string
    orbitLine: string
    btnText?: string
    tagBg?: string
    tagBorder?: string
    tabsBg?: string
    tabsActiveBg?: string
    tabsActiveText?: string
    bgRgb?: string
  }
  slots: string[]
}

const HERO_SLIDES: HeroSlide[] = [
  {
    num: '01',
    category: 'MISSION MARDINI',
    tabShort: 'Mardini',
    watermark: 'MARDINI',
    eyebrow: '01 · Tactical Combat & Fear-Eradication',
    headlineHTML: 'Revive physical<br />& tactical <span class="' + s.serifItalic + '">sovereignty.</span>',
    title: 'Fear-Eradication & Close-Quarter Combat',
    desc: 'Unarmed combat, Lathi-Kaushal, improvised environmental weapon defense, and explosive situational awareness for women.',
    cta: 'Explore Mission Mardini',
    ctaLink: '/mardini',
    secCta: 'Cohort Camps →',
    secLink: '/courses',
    tag: 'Mission Mardini',
    subTag: '↳ Tactical Defense & Ground Preparedness',
    bgImage: '/missionmirdani.jpg',
    theme: {
      bg: '#f7f4ee',
      bgRgb: '247, 244, 238',
      text: '#1a1918',
      muted: '#75726b',
      accent: '#dc143c',
      border: 'rgba(30, 30, 28, 0.12)',
      watermark: 'rgba(220, 20, 60, 0.05)',
      orbitLine: 'rgba(220, 20, 60, 0.14)',
      btnText: '#ffffff',
      tagBg: 'rgba(220, 20, 60, 0.08)',
      tagBorder: 'rgba(220, 20, 60, 0.28)',
      tabsBg: 'rgba(255, 255, 255, 0.55)',
      tabsActiveBg: 'rgba(255, 255, 255, 0.95)',
      tabsActiveText: '#dc143c'
    },
    slots: ['center', 'top-right', 'bottom-right', 'top-left', 'bottom-left']
  },
  {
    num: '02',
    category: 'SHAKTI BHAVA',
    tabShort: 'Bhava',
    watermark: 'BHAVA',
    eyebrow: '02 · Trauma Recovery & Psychological Fortitude',
    headlineHTML: 'Restore inner peace<br />& somatic <span class="' + s.serifItalic + '">fortitude.</span>',
    title: 'Confidential Healing & Sanctuary Pods',
    desc: 'Trauma-informed therapeutic circles, crisis intervention, and domestic coercion recovery in safe, sacred spaces.',
    cta: 'Confidential Intake',
    ctaLink: '/counselling',
    secCta: 'Healing Circles →',
    secLink: '/shakti-bhava',
    tag: 'Shakti Bhava',
    subTag: '↳ Somatic Sanctuary & Mental Health Care',
    bgImage: '/shaktibhava.jpg',
    theme: {
      bg: '#eaf4ee',
      bgRgb: '234, 244, 238',
      text: '#112419',
      muted: '#4f6c5a',
      accent: '#166534',
      border: 'rgba(22, 101, 52, 0.14)',
      watermark: 'rgba(22, 101, 52, 0.055)',
      orbitLine: 'rgba(22, 101, 52, 0.15)',
      btnText: '#ffffff',
      tagBg: 'rgba(22, 101, 52, 0.08)',
      tagBorder: 'rgba(22, 101, 52, 0.28)',
      tabsBg: 'rgba(255, 255, 255, 0.55)',
      tabsActiveBg: 'rgba(255, 255, 255, 0.95)',
      tabsActiveText: '#166534'
    },
    slots: ['bottom-left', 'center', 'top-right', 'bottom-right', 'top-left']
  },
  {
    num: '03',
    category: 'SHAKTI VARTA',
    tabShort: 'Varta',
    watermark: 'VARTA',
    eyebrow: '03 · Civilizational Inquiry & Scholarship',
    headlineHTML: 'Uncompromising truth<br />& cognitive <span class="' + s.serifItalic + '">liberty.</span>',
    title: 'Vedic Research & Epigraphical Dialogue',
    desc: 'Historical research on Vedic heroines, peer-reviewed monographs, and uncompromising inquiry into Dharma and civilizational sovereignty.',
    cta: 'Read Research Papers',
    ctaLink: '/research',
    secCta: 'Case Studies →',
    secLink: '/case-studies',
    tag: 'Shakti Varta',
    subTag: '↳ Intellectual & Epigraphical Research',
    bgImage: '/shaktivarta.jpg',
    theme: {
      bg: '#eaf0fa',
      bgRgb: '234, 240, 250',
      text: '#141c38',
      muted: '#525d82',
      accent: '#3730a3',
      border: 'rgba(55, 48, 163, 0.14)',
      watermark: 'rgba(55, 48, 163, 0.05)',
      orbitLine: 'rgba(55, 48, 163, 0.14)',
      btnText: '#ffffff',
      tagBg: 'rgba(55, 48, 163, 0.08)',
      tagBorder: 'rgba(55, 48, 163, 0.28)',
      tabsBg: 'rgba(255, 255, 255, 0.55)',
      tabsActiveBg: 'rgba(255, 255, 255, 0.95)',
      tabsActiveText: '#3730a3'
    },
    slots: ['top-left', 'bottom-left', 'center', 'top-right', 'bottom-right']
  },
  {
    num: '04',
    category: 'AARYAVEERA',
    tabShort: 'Aaryaveera',
    watermark: 'AARYAVEERA',
    eyebrow: '04 · Founder Worldview & Youth Leadership',
    headlineHTML: 'From strength alone<br />arises lasting <span class="' + s.serifItalic + '">peace.</span>',
    title: 'Moral Autonomy, Character & Courage',
    desc: 'The philosophical identity of Harshita Mankar. Forging young women into intellectually fortified and tactically capable guardians.',
    cta: 'Explore Aaryaveera',
    ctaLink: '/aaryaveera',
    secCta: 'Founder Profile →',
    secLink: '/about#founder',
    tag: 'Aaryaveera',
    subTag: '↳ Ideological Identity & Leadership Code',
    bgImage: '/socialwork/social-1.jpg',
    theme: {
      bg: '#141311',
      bgRgb: '20, 19, 17',
      text: '#faf7f0',
      muted: '#c4baa9',
      accent: '#f59e0b',
      border: 'rgba(245, 158, 11, 0.3)',
      watermark: 'rgba(245, 158, 11, 0.07)',
      orbitLine: 'rgba(245, 158, 11, 0.22)',
      btnText: '#120f0a',
      tagBg: 'rgba(245, 158, 11, 0.18)',
      tagBorder: 'rgba(245, 158, 11, 0.45)',
      tabsBg: 'rgba(26, 24, 20, 0.88)',
      tabsActiveBg: 'rgba(245, 158, 11, 0.24)',
      tabsActiveText: '#fbbf24'
    },
    slots: ['bottom-right', 'top-left', 'bottom-left', 'center', 'top-right']
  },
  {
    num: '05',
    category: 'INSTITUTIONAL SAHYOG',
    tabShort: 'Sahyog',
    watermark: 'SAHYOG',
    eyebrow: '05 · Institutional Alliances & Grassroots Action',
    headlineHTML: 'Collective force.<br />United for <span class="' + s.serifItalic + '">dignity.</span>',
    title: 'University, CSR & NGO Networks',
    desc: 'Partnering with universities, corporate CSR collectives, schools, and grassroots allies across 28 cities for systemic women empowerment.',
    cta: 'Partner With Us',
    ctaLink: '/sahyog',
    secCta: 'Field Impact →',
    secLink: '/social-work',
    tag: 'Sahyog',
    subTag: '↳ Grassroots Alliances & CSR Impact',
    bgImage: '/sahog.jpg',
    theme: {
      bg: '#fbf3ea',
      bgRgb: '251, 243, 234',
      text: '#2b1b12',
      muted: '#7a5b4a',
      accent: '#c2410c',
      border: 'rgba(194, 65, 12, 0.14)',
      watermark: 'rgba(194, 65, 12, 0.05)',
      orbitLine: 'rgba(194, 65, 12, 0.15)',
      btnText: '#ffffff',
      tagBg: 'rgba(194, 65, 12, 0.08)',
      tagBorder: 'rgba(194, 65, 12, 0.28)',
      tabsBg: 'rgba(255, 255, 255, 0.55)',
      tabsActiveBg: 'rgba(255, 255, 255, 0.95)',
      tabsActiveText: '#c2410c'
    },
    slots: ['top-right', 'bottom-right', 'top-left', 'bottom-left', 'center']
  }
]

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSwitching, setIsSwitching] = useState(false)
  const wrapperRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const currentIndexRef = useRef(0)
  const mobileBarRef = useRef<HTMLDivElement>(null)

  const activeSlide = HERO_SLIDES[currentIndex]

  // Pin Hero section ONLY on desktop (> 900px); let mobile scroll naturally
  useEffect(() => {
    const wrapper = wrapperRef.current
    const hero = heroRef.current
    const totalSlides = HERO_SLIDES.length
    if (!wrapper || !hero || totalSlides === 0) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 901px)', () => {
      const pinDistance = window.innerHeight * (totalSlides - 1) * 1.1

      const st = ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: () => `+=${pinDistance}`,
        pin: hero,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const current = self.progress * (totalSlides - 0.2)
          const targetIndex = Math.min(
            totalSlides - 1,
            Math.max(0, Math.floor(current))
          )

          if (targetIndex !== currentIndexRef.current) {
            currentIndexRef.current = targetIndex
            setIsSwitching(true)
            setTimeout(() => {
              setCurrentIndex(targetIndex)
              setIsSwitching(false)
            }, 100)
          }
        }
      })
      triggerRef.current = st

      return () => {
        triggerRef.current = null
      }
    })

    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 250)

    return () => {
      clearTimeout(timer)
      mm.revert()
      triggerRef.current = null
    }
  }, [])

  const goToSlide = useCallback((index: number) => {
    const nextIdx = Math.max(0, Math.min(HERO_SLIDES.length - 1, index))
    const st = triggerRef.current
    if (st && st.end > st.start && window.innerWidth > 900) {
      const totalSlides = HERO_SLIDES.length
      const targetProgress = (nextIdx + 0.45) / totalSlides
      const targetScroll = st.start + targetProgress * (st.end - st.start)
      if ((window as any).lenis) {
        ;(window as any).lenis.scrollTo(targetScroll, { duration: 0.8 })
      } else {
        window.scrollTo({ top: targetScroll, behavior: 'smooth' })
      }
    } else {
      currentIndexRef.current = nextIdx
      setIsSwitching(true)
      setTimeout(() => {
        setCurrentIndex(nextIdx)
        setIsSwitching(false)
      }, 100)
    }

    // Scroll ONLY the horizontal pill container (never the outer window/viewport)
    if (window.innerWidth <= 900 && mobileBarRef.current) {
      const container = mobileBarRef.current
      const btn = container.children[nextIdx] as HTMLElement | undefined
      if (btn) {
        const targetLeft =
          btn.offsetLeft - container.clientWidth / 2 + btn.clientWidth / 2
        container.scrollTo({
          left: Math.max(0, targetLeft),
          behavior: 'smooth'
        })
      }
    }
  }, [])

  // Apply CSS Variables on theme change
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const theme = activeSlide.theme
    el.style.setProperty('--hero-bg', theme.bg)
    el.style.setProperty('--hero-text', theme.text)
    el.style.setProperty('--hero-muted', theme.muted)
    el.style.setProperty('--hero-accent', theme.accent)
    el.style.setProperty('--hero-border', theme.border)
    el.style.setProperty('--watermark-color', theme.watermark)
    el.style.setProperty('--orbit-line', theme.orbitLine)
    el.style.setProperty('--hero-bg-rgb', theme.bgRgb || '247, 244, 238')
    el.style.setProperty('--hero-btn-text', theme.btnText || '#ffffff')
    el.style.setProperty('--hero-tag-bg', theme.tagBg || 'rgba(220, 20, 60, 0.08)')
    el.style.setProperty('--hero-tag-border', theme.tagBorder || 'rgba(220, 20, 60, 0.28)')
    el.style.setProperty('--hero-tabs-bg', theme.tabsBg || 'rgba(255, 255, 255, 0.55)')
    el.style.setProperty('--hero-tabs-active-bg', theme.tabsActiveBg || 'rgba(255, 255, 255, 0.95)')
    el.style.setProperty('--hero-tabs-active-text', theme.tabsActiveText || theme.accent)
  }, [activeSlide])

  // Mobile horizontal swipe handlers on orbital collage stage
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const diffX = e.changedTouches[0].clientX - touchStartX.current
    const diffY = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        goToSlide((currentIndex + 1) % HERO_SLIDES.length)
      } else {
        goToSlide((currentIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
      }
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  return (
    <section ref={wrapperRef} className={s.heroPinWrapper}>
      <div
        ref={heroRef}
        className={s.heroStudio}
        id="heroStudio"
      >
        {/* Category Thematic Background Image with Smooth Crossfade */}
        <div className={s.heroBgMedia} aria-hidden="true">
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.num}
              className={`${s.heroBgLayer} ${idx === currentIndex ? s.heroBgLayerActive : ''}`}
              style={{ backgroundImage: `url(${slide.bgImage})` }}
            />
          ))}
          <div className={s.heroBgOverlay} />
        </div>

        <div className={s.heroInner}>
          {/* Giant Dynamic Watermark */}
          <div
            className={s.watermark}
            style={{ opacity: isSwitching ? 0 : 1, transform: isSwitching ? 'translateY(16px)' : 'translateY(0)' }}
          >
            {activeSlide.watermark}
          </div>

          {/* Top Studio Metadata */}
          <div className={s.studioMeta}>
            <div className={s.studioMetaLeft}>
              <span className={s.redDot} />
              <span className={s.studioMetaDesktop}>SHAKTI SABHA · CIVILIZATIONAL &amp; TACTICAL SOVEREIGNTY</span>
              <span className={s.studioMetaMobile}>SHAKTI SABHA</span>
            </div>
            <div className={s.studioMetaRight}>
              <span className={s.liveTag}>5 PILLARS ACTIVE</span>
              <span>EST. 2012 ↗</span>
            </div>
          </div>

          {/* Split Content Grid */}
          <div className={s.heroGrid}>
            {/* Left Column Copy */}
            <div className={`${s.heroLeft} ${isSwitching ? s.heroLeftSwitching : ''}`}>
              {/* Top Headline Block */}
              <div className={s.heroHeadBlock}>
                <p className={s.eyebrowSmall}>
                  <GoogleIcon name="military_tech" size={16} />
                  {activeSlide.eyebrow}
                </p>

                <p className={s.heroIntroQuote}>
                  One sangam. A world of fearlessness and dignity.
                </p>

                <h1
                  className={s.mainHeadline}
                  dangerouslySetInnerHTML={{ __html: activeSlide.headlineHTML }}
                />

                <p className={s.heroSubcopy}>
                  In your hands. On the ground.<br />
                  Across 200+ villages. Awakening the Kshatra spirit.
                </p>
              </div>

              {/* Slide Details Block */}
              <div className={s.heroSlideBlock}>
                <div className={s.slideCounter}>
                  <div><span className={s.numActive}>{activeSlide.num}</span> / 05</div>
                  <span className={s.dividerLine} />
                  <span>{activeSlide.category}</span>
                </div>

                <h2 className={s.slideTitle}>{activeSlide.title}</h2>
                <p className={s.slideDesc}>{activeSlide.desc}</p>

                <div className={s.ctaRow}>
                  <Link to={activeSlide.ctaLink} className={s.btnPrimary}>
                    <span>{activeSlide.cta}</span>
                    <span>↗</span>
                  </Link>
                  <Link to={activeSlide.secLink} className={s.btnSecondary}>
                    {activeSlide.secCta}
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Orbital Stage (Swipeable on mobile) */}
            <div
              className={s.collageStage}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className={s.estLabel}>
                KSHATRA-DHARMA / SOVEREIGN AWAKENING
              </div>

              {/* Orbital SVG Tracks */}
              <svg className={s.orbitSvg} viewBox="0 0 820 465" fill="none">
                <circle cx="410" cy="240" r="185" stroke="var(--orbit-line)" strokeWidth="1" />
                <circle className={s.orbitRingDashed} cx="410" cy="240" r="235" stroke="var(--orbit-line)" strokeWidth="1.2" strokeDasharray="6 8" />
                <path d="M 190 130 Q 410 35 620 130" stroke="var(--orbit-line)" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M 180 340 Q 410 420 630 330" stroke="var(--orbit-line)" strokeWidth="1" strokeDasharray="4 4" />
              </svg>

              {/* CARD 0: MISSION MARDINI */}
              <div
                className={s.orbitItem}
                data-slot={activeSlide.slots[0]}
                onClick={() => goToSlide(0)}
              >
                <div className={s.orbitFloat}>
                  <div className={s.cardMardini}>
                    <div className={s.cardEyebrow}>
                      <GoogleIcon name="swords" size={13} style={{ color: '#dc143c' }} />
                      01 · TACTICAL SOVEREIGNTY
                    </div>
                    <div className={s.cardTitleBig}>
                      Mardini<span>.</span>
                    </div>
                    <div className={s.cardDescShort}>
                      2,000+ CADETS · LATHI &amp; CLOSE-QUARTER COMBAT
                    </div>
                    <div className={s.cardFooter}>
                      <div className={s.colorSwatches}>
                        <span className={s.swatch} style={{ background: '#dc143c' }} />
                        <span className={s.swatch} style={{ background: '#1c1c1a' }} />
                        <span className={s.swatch} style={{ background: '#e8c98a' }} />
                        <span className={s.swatch} style={{ background: '#166534' }} />
                      </div>
                      <span className={s.cardNum}>01 Combat ↗</span>
                    </div>
                  </div>
                  <div className={s.miniOrbitCaption}>01 Mardini ↗</div>
                </div>
              </div>

              {/* CARD 1: SHAKTI BHAVA */}
              <div
                className={s.orbitItem}
                data-slot={activeSlide.slots[1]}
                onClick={() => goToSlide(1)}
              >
                <div className={s.orbitFloat}>
                  <div className={s.cardBhava}>
                    <div className={s.cardEyebrow}>
                      <GoogleIcon name="spa" size={13} style={{ color: '#166534' }} />
                      02 · SOMATIC SANCTUARY
                    </div>
                    <div className={s.cardTitleBig} style={{ color: '#166534' }}>
                      Bhava<span>.</span>
                    </div>
                    <div className={s.cardDescShort}>
                      CONFIDENTIAL CRISIS INTAKE &amp; TRAUMA HEALING
                    </div>
                    <div className={s.cardFooter}>
                      <div className={s.colorSwatches}>
                        <span className={s.swatch} style={{ background: '#166534' }} />
                        <span className={s.swatch} style={{ background: '#4ade80' }} />
                        <span className={s.swatch} style={{ background: '#bbf7d0' }} />
                      </div>
                      <span className={s.cardNum}>02 Healing ↗</span>
                    </div>
                  </div>
                  <div className={s.miniOrbitCaption}>02 Bhava ↗</div>
                </div>
              </div>

              {/* CARD 2: SHAKTI VARTA */}
              <div
                className={s.orbitItem}
                data-slot={activeSlide.slots[2]}
                onClick={() => goToSlide(2)}
              >
                <div className={s.orbitFloat}>
                  <div className={s.cardVarta}>
                    <div className={s.cardEyebrow}>
                      <GoogleIcon name="menu_book" size={13} style={{ color: '#3730a3' }} />
                      03 · INTELLECTUAL LIBERTY
                    </div>
                    <div className={s.cardTitleVarta}>
                      Shakti Varta<span>.</span>
                    </div>
                    <div className={s.cardDescShort}>
                      45+ MONOGRAPHS · VEDIC HEROINES &amp; DHARMA
                    </div>
                    <div className={s.cardFooter}>
                      <div className={s.colorSwatches}>
                        <span className={s.swatch} style={{ background: '#3730a3' }} />
                        <span className={s.swatch} style={{ background: '#818cf8' }} />
                        <span className={s.swatch} style={{ background: '#c7d2fe' }} />
                      </div>
                      <span className={s.cardNum}>03 Discourse ↗</span>
                    </div>
                  </div>
                  <div className={s.miniOrbitCaption}>03 Shakti Varta ↗</div>
                </div>
              </div>

              {/* CARD 3: AARYAVEERA */}
              <div
                className={s.orbitItem}
                data-slot={activeSlide.slots[3]}
                onClick={() => goToSlide(3)}
              >
                <div className={s.orbitFloat}>
                  <div className={s.cardAaryaveera}>
                    <div className={s.cardEyebrow} style={{ color: '#fbbf24' }}>
                      <GoogleIcon name="local_fire_department" size={13} style={{ color: '#fbbf24' }} />
                      04 · FOUNDER WORLDVIEW
                    </div>
                    <div className={s.cardTitleAaryaveera}>
                      Aaryaveera<span>.</span>
                    </div>
                    <div className={s.cardDescShort} style={{ color: '#e2d9cc' }}>
                      MORAL AUTONOMY · HARSHITA MANKAR DOCTRINE
                    </div>
                    <div className={s.cardFooter} style={{ borderColor: 'rgba(251, 191, 36, 0.3)' }}>
                      <div className={s.colorSwatches}>
                        <span className={s.swatch} style={{ background: '#fbbf24' }} />
                        <span className={s.swatch} style={{ background: '#f59e0b' }} />
                        <span className={s.swatch} style={{ background: '#dc143c' }} />
                      </div>
                      <span className={s.cardNum} style={{ color: '#fbbf24', fontWeight: 800 }}>04 Leadership ↗</span>
                    </div>
                  </div>
                  <div className={s.miniOrbitCaption}>04 Aaryaveera ↗</div>
                </div>
              </div>

              {/* CARD 4: SAHYOG */}
              <div
                className={s.orbitItem}
                data-slot={activeSlide.slots[4]}
                onClick={() => goToSlide(4)}
              >
                <div className={s.orbitFloat}>
                  <div className={s.cardSahyog}>
                    <div className={s.cardEyebrow}>
                      <GoogleIcon name="handshake" size={13} style={{ color: '#c2410c' }} />
                      05 · INSTITUTIONAL ALLIANCE
                    </div>
                    <div className={s.cardTitleBig} style={{ color: '#c2410c' }}>
                      Sahyog<span>.</span>
                    </div>
                    <div className={s.cardDescShort}>
                      45+ CSR ALLIES · 400+ SCHOOLS &amp; UNIVERSITIES
                    </div>
                    <div className={s.cardFooter}>
                      <div className={s.colorSwatches}>
                        <span className={s.swatch} style={{ background: '#c2410c' }} />
                        <span className={s.swatch} style={{ background: '#fb923c' }} />
                        <span className={s.swatch} style={{ background: '#fed7aa' }} />
                      </div>
                      <span className={s.cardNum}>05 Alliance ↗</span>
                    </div>
                  </div>
                  <div className={s.miniOrbitCaption}>05 Sahyog ↗</div>
                </div>
              </div>

              {/* Active Center Label Below Spotlight Item */}
              <div className={s.centerSpotlightMeta}>
                <div className={s.spotlightTag}>
                  ❖ <span>{activeSlide.tag}</span> ↗
                </div>
                <div className={s.spotlightSub}>{activeSlide.subTag}</div>
              </div>

              <div className={s.brandEverywhereLabel}>
                ONE SANGAM. FIVE PILLARS.
              </div>
            </div>

            {/* Mobile Interactive 5-Pillars Quick Switcher */}
            <div ref={mobileBarRef} className={s.mobilePillarsBar}>
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.num}
                  type="button"
                  className={`${s.mobilePillarBtn} ${idx === currentIndex ? s.mobilePillarBtnActive : ''}`}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Pillar ${slide.num}: ${slide.category}`}
                >
                  <span className={s.mobilePillarNum}>{slide.num}</span>
                  <span className={s.mobilePillarTitle}>{slide.tabShort}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
