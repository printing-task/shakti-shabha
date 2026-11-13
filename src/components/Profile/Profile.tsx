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
    url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1200&auto=format&fit=crop',
    caption: 'Mission Mardini — Tactical Self-Defense Camp & Lathi-Kaushal',
    tag: 'Field Operations'
  },
  {
    url: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=1200&auto=format&fit=crop',
    caption: 'Shakti Varta — National Symposium & Civilizational Discourse',
    tag: 'Intellectual Discourse'
  },
  {
    url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?q=80&w=1200&auto=format&fit=crop',
    caption: 'Martial Preparedness — Traditional Weaponry & Combat Discipline',
    tag: 'Kshatra-Dharma'
  },
  {
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop',
    caption: 'Shakti Bhava — Emotional Resilience & Survivor Healing Circle',
    tag: 'Consciousness Space'
  },
  {
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop',
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
    const SLIDE_DURATION = 6500
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { 
          trigger: secRef.current, 
          start: 'top 90%',
          toggleActions: 'play none none none' 
        }
      })
      
      // Animate main photo revealing
      tl.to(photoRef.current, { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power4.inOut' })
        // Animate right side heading and button
        .from('[data-p="eyebrow"]', { opacity: 0, y: 10, duration: 0.4 }, '-=0.6')
        .from('[data-p="heading"]', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
        .from('[data-p="badge-row"]', { opacity: 0, y: 15, duration: 0.5 }, '-=0.3')
        .from('[data-p="btn"]',     { opacity: 0, y: 10, duration: 0.4 }, '-=0.3')
        // Animate sub images
        .from('[data-p="subimg"]',  { opacity: 0, y: 30, stagger: 0.2, duration: 0.6 }, '-=0.2')
        // Animate left bottom text
        .from('[data-p="bio"]',     { opacity: 0, y: 15, duration: 0.5 }, '-=0.4')
    }, secRef)
    return () => ctx.revert()
  }, [])

  const mainHeroImageSrc = profile.heroImage
    ? (profile.heroImage.startsWith('data:') || profile.heroImage.startsWith('blob:') || profile.heroImage.startsWith('http') || profile.heroImage.startsWith('/')
        ? profile.heroImage
        : `/${profile.heroImage}`)
    : "/Gemini_Generated_Image_kdfkbukdfkbukdfk.png"

  return (
    <section ref={secRef} className={s.section}>
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
              FOUNDER &amp; DIRECTOR · <span className={s.aaryaveeraHighlight}>AARYAVEERA</span>
            </span>
            
            <h2 data-p="heading" className={s.heading}>
              <span className={s.nameBold}>Harshita</span>{' '}
              <span className={s.nameLight}>Mankar</span>
              <span className={s.title}>
                {profile.honorific_hi}
              </span>
            </h2>

            <p style={{ fontSize: '0.86rem', color: '#DC143C', fontWeight: 600, letterSpacing: '0.04em', margin: '0.4rem 0 1rem' }}>
              {profile.subTitle}
            </p>

            {/* Hero Quote */}
            <div data-p="badge-row" style={{
              background: 'rgba(220, 20, 60, 0.04)',
              borderLeft: '3px solid #DC143C',
              padding: '0.9rem 1.1rem',
              borderRadius: '0 8px 8px 0',
              marginBottom: '1.25rem',
              fontStyle: 'italic',
              color: '#374151',
              fontSize: '0.92rem',
              lineHeight: 1.6
            }}>
              "{profile.heroQuote}"
            </div>

            {/* Quick Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '0.65rem',
              width: '100%',
              marginBottom: '1.5rem'
            }}>
              <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '0.65rem 0.85rem' }}>
                <div style={{ color: '#DC143C', fontWeight: 800, fontSize: '1.1rem' }}>Black Belt</div>
                <div style={{ color: '#6B7280', fontSize: '0.74rem' }}>Karate &amp; Combat</div>
              </div>
              <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '0.65rem 0.85rem' }}>
                <div style={{ color: '#DC143C', fontWeight: 800, fontSize: '1.1rem' }}>2,000+</div>
                <div style={{ color: '#6B7280', fontSize: '0.74rem' }}>Girls Weaponized</div>
              </div>
              <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '0.65rem 0.85rem' }}>
                <div style={{ color: '#DC143C', fontWeight: 800, fontSize: '1.1rem' }}>500+</div>
                <div style={{ color: '#6B7280', fontSize: '0.74rem' }}>Seminars Convened</div>
              </div>
              <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '0.65rem 0.85rem' }}>
                <div style={{ color: '#DC143C', fontWeight: 800, fontSize: '1.1rem' }}>25,000+</div>
                <div style={{ color: '#6B7280', fontSize: '0.74rem' }}>Students Reached</div>
              </div>
            </div>

            {/* CTA BUTTONS */}
            <div className={s.ctaGroup}>
              <Link to="/about" data-p="btn" className={s.ctaBtn}>
                Full Biography &amp; Genesis →
              </Link>
              <Link to="/three-streams" data-p="btn" className={s.ctaBtnGhost}>
                The Three Streams →
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
                <span className={s.counterBadge}>
                  {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
