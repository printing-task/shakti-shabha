import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getFounderData, fetchFounderData, FounderProfileData } from '../../data/founderData'
import { resolveImageUrl } from '../../lib/api'
import { useCategoryPhotos } from '../../data/galleryStore'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import s from './Profile.module.css'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_FIELD_SLIDES = [
  {
    // Tactical Self-Defense Camp & Lathi-Kaushal
    url: '/sahog.jpg',
    caption: 'Mission Mardini — Tactical Self-Defense Camp & Lathi-Kaushal',
    tag: 'Field Operations'
  },
  {
    // National Symposium & Civilizational Discourse
    url: '/shaktivarta.jpg',
    caption: 'Shakti Varta — National Symposium & Civilizational Discourse',
    tag: 'Intellectual Discourse'
  },
  {
    // Traditional Weaponry & Combat Discipline
    url: '/IMG_20260908_201306.jpg',
    caption: 'Martial Preparedness — Traditional Weaponry & Combat Discipline',
    tag: 'Kshatra-Dharma'
  },
  {
    // Survivor Healing Circle
    url: '/shaktibhava.jpg',
    caption: 'Shakti Bhava — Emotional Resilience & Survivor Healing Circle',
    tag: 'Consciousness Space'
  },
  {
    // Grassroots Leadership Drives
    url: '/socialworkk.jpg',
    caption: 'Tribal & Rural Outreach — Grassroots Leadership Drives',
    tag: 'Community Mission'
  }
]
export default function Profile() {
  const secRef   = useRef<HTMLElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const [profile, setProfile] = useState<FounderProfileData>(getFounderData())

  const fallbackUrls = DEFAULT_FIELD_SLIDES.map(s => s.url)
  const galleryPhotos = useCategoryPhotos(
    ['mardini', 'camp', 'combat', 'seminar', 'shakti-varta', 'shakti-bhava', 'founder'],
    5,
    fallbackUrls
  )

  const slides = galleryPhotos && galleryPhotos.length > 0
    ? galleryPhotos.map((p, idx) => ({
        url: p.url,
        caption: p.caption || DEFAULT_FIELD_SLIDES[idx % DEFAULT_FIELD_SLIDES.length].caption,
        tag: DEFAULT_FIELD_SLIDES[idx % DEFAULT_FIELD_SLIDES.length].tag
      }))
    : DEFAULT_FIELD_SLIDES

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Calmer slide progression (6.5s)
  useEffect(() => {
    if (isPaused || slides.length <= 1) return
    const SLIDE_DURATION = 2000
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [isPaused, slides.length])

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)
  const goToSlide = (idx: number) => setCurrentSlide(idx)

  useEffect(() => {
    fetchFounderData().then(d => { if (d) setProfile(d); }).catch(() => {});
    const handleUpdate = () => {
      setProfile(getFounderData())
    }
    window.addEventListener('founder_data_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('founder_data_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  // Immediate visibility on load with zero scroll blocking
  useEffect(() => {
    // Ensures all founder elements are immediately accessible and visible
  }, [])

  const mainHeroImageSrc = profile.heroImage
    ? (profile.heroImage.startsWith('data:') || profile.heroImage.startsWith('blob:') || profile.heroImage.startsWith('http') || profile.heroImage.startsWith('/')
        ? profile.heroImage
        : `/${profile.heroImage}`)
    : "/Gemini_Generated_Image_kdfkbukdfkbukdfk.png"

  return (
    <section ref={secRef} id="profile" className={s.section}>
      <div className={s.inner}>
        
        {/* ========================================
            LEFT COLUMN
            ======================================== */}
        <div className={s.left}>
          {/* Main Hero Image — customized & responsive */}
          <div ref={photoRef} className={s.photoFrame}>
            <img 
              src={mainHeroImageSrc} 
              alt={profile.name} 
              className={s.heroImg}
              onError={(e) => {
                e.currentTarget.src = "/Gemini_Generated_Image_kdfkbukdfkbukdfk.png"
              }}
            />
          </div>

          {/* Bottom Left: Bio Paragraph with Highlighted Aaryaveera */}
          <div className={s.leftBottom}>
            <p data-p="bio" className={s.bio}>
              <span className={s.aaryaveeraHighlight}>Aaryaveera</span> is a civilizational strategist, tactical combat instructor, and non-verbal behaviour profiler dedicated to cultivating independent thinking, psychological resilience, and tactical preparedness among women and youth across India.
            </p>
          </div>
        </div>

        {/* ========================================
            RIGHT COLUMN
            ======================================== */}
        <div className={s.right}>
          {/* Top Right: Heading & Button */}
          <div className={s.rightTop}>
            <span data-p="eyebrow" className={s.eyebrow}>
              FOUNDER &amp; FIELD RESEARCHER · <span className={s.aaryaveeraHighlight}>HARSHITA MANKAR</span>
            </span>
            
            <h2 data-p="heading" className={s.heading}>
              <span className={s.nameBold}>Harshita</span>{' '}
              <span className={s.nameLight}>Mankar</span>
              <span className={s.title}>
                संस्थापक व क्षेत्रीय रणनीतिकार
              </span>
            </h2>

            <p style={{ fontSize: '0.86rem', color: '#bd1834', fontWeight: 600, letterSpacing: '0.04em', margin: '0.4rem 0 0.85rem' }}>
              Founder &amp; Civilizational Field Strategist
            </p>

            {/* Professional Concise Intro */}
            <p style={{ fontSize: '0.92rem', lineHeight: '1.6', color: '#4B5563', marginBottom: '1rem' }}>
              Harshita Mankar has directed frontline fieldwork across 200+ villages, establishing Shakti Sabha as an applied research think-tank and tactical training institution. Her work bridges primary archival historiography, somatic martial deterrence, and rural crisis arbitration.
            </p>

            {/* Note clarifying that the institution stands primary */}
            <div style={{
              background: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderLeft: '3px solid #3730A3',
              padding: '0.75rem 1rem',
              borderRadius: '0 6px 6px 0',
              marginBottom: '1.25rem',
              fontSize: '0.82rem',
              color: '#4B5563',
              lineHeight: '1.5'
            }}>
              <strong style={{ color: '#1F2937' }}>Institutional Principle: </strong>
              The institution, its empirical research, and the sovereign safety of women remain primary over any individual. The complete philosophical worldview and youth leadership code is documented in the dedicated Aaryaveera section.
            </div>

            {/* CTA BUTTONS */}
            <div className={s.ctaGroup}>
              <Link to="/aaryaveera" data-p="btn" className={s.ctaBtn}>
                Explore Aaryaveera Ideology →
              </Link>
              <Link to="/about" data-p="btn" className={s.ctaBtnGhost}>
                Professional Biography →
              </Link>
            </div>
          </div>

          {/* Bottom Right: Single Frame Changing Images Slideshow */}
          <div className={s.rightBottom}>
            <div 
              data-p="subimg" 
              className={s.slideshowFrame}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Slides */}
              {slides.map((slide, idx) => (
                <div 
                  key={idx} 
                  className={`${s.slideItem} ${idx === currentSlide ? s.activeSlide : ''}`}
                >
                  <img 
                    src={slide.url} 
                    alt={slide.caption} 
                    className={s.slideImg}
                    loading={idx === 0 ? 'eager' : 'lazy'} 
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_FIELD_SLIDES[idx % DEFAULT_FIELD_SLIDES.length].url
                    }}
                  />
                  <div className={s.slideOverlay}>
                    <div className={s.slideMeta}>
                      <span className={s.slideTag}>{slide.tag}</span>
                      <p className={s.slideCaption}>{slide.caption}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Smooth Progress Bar */}
              <div className={s.progressBarTrack}>
                <div 
                  key={currentSlide} 
                  className={`${s.progressBarFill} ${isPaused ? s.paused : ''}`}
                />
              </div>

              {/* Slideshow Top Controls */}
              <div className={s.slideshowControls}>
                <button 
                  type="button" 
                  onClick={prevSlide} 
                  className={s.navBtn} 
                  aria-label="Previous slide"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <div className={s.dotsContainer}>
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      className={`${s.dot} ${idx === currentSlide ? s.activeDot : ''}`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <button 
                  type="button" 
                  onClick={nextSlide} 
                  className={s.navBtn} 
                  aria-label="Next slide"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
             
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
