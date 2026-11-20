import { useEffect, useRef, useState, useCallback } from 'react'
import {
  getStoredPhotos,
  getStoredCategories,
  getRandomCategoryPhoto,
  fetchAllPhotos,
  GALLERY_UPDATE_EVENT
} from '../../data/galleryStore'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './SocialWork.module.css'

gsap.registerPlugin(ScrollTrigger)

interface SlideData {
  title: string
  subtitle: string
  description: string
  stat: string
  image: string
}

const SLIDE_CATEGORY_KEYWORDS: string[][] = [
  ['mardini', 'lathi', 'defense', 'combat'],
  ['shakti-bhava', 'consciousness', 'survivor', 'healing'],
  ['shakti-varta', 'seminar', 'discourse', 'research'],
  ['mardini', 'sword', 'martial', 'aaryaveera'],
  ['community', 'tribal', 'outreach', 'youth']
]

const SLIDES: SlideData[] = [
  {
    title: 'Village Tactical Defense',
    subtitle: 'Nagpur & Vidarbha Rural Belt',
    description: 'Observed: Agrarian harassment endured due to fear of retaliation. Learned: Somatic Lathi training shifts village deterrence; harassment drops by 80%.',
    stat: '340+ Verified Cadets',
    image: '/socialwork/social-1.jpg',
  },
  {
    title: 'Confidential Survivor Circles',
    subtitle: 'Amravati & Wardha Districts',
    description: 'Observed: Trauma survivors exhibit autonomic freeze during formal inquiry. Learned: 72hr somatic stabilization brings 92% legal statement clarity.',
    stat: '1,200+ Healed Hours',
    image: '/socialwork/social-2.jpg',
  },
  {
    title: 'Vedic Epigraphical Colloquium',
    subtitle: 'Pune Academic Hub',
    description: 'Observed: Syllabi omit indigenous martial records. Learned: Direct contact with Modi-script manuscripts catalyses 3x higher community leadership.',
    stat: '45+ Archival Papers',
    image: '/socialwork/social-3.jpg',
  },
  {
    title: 'Martial Preparedness Camps',
    subtitle: 'Wardha, Maharashtra',
    description: 'Observed: Adolescent girls freeze in public transit threats. Learned: Kshatra Dharma philosophy replaces submission with calm situational poise.',
    stat: '600+ Trained',
    image: '/socialwork/social-4.jpg',
  },
  {
    title: 'Youth Moral Autonomy Cadres',
    subtitle: 'Yavatmal Tribal Hostels',
    description: 'Observed: Acute psychological submissiveness before authority. Learned: Character conditioning trains youth to assert rights with documented evidence.',
    stat: '15,000+ Reached',
    image: '/socialwork/social-5.jpg',
  },
]

// Calculates shortest circular offset on a ring of `total` items
function getCircularOffset(index: number, current: number, total: number) {
  let diff = index - current
  while (diff > total / 2) diff -= total
  while (diff < -total / 2) diff += total
  return diff
}

function useTilt(active: boolean) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || !active) return

    const el = ref.current
    let rect: DOMRect | null = null
    let rafId: number | null = null

    const handleMouseMove = (e: MouseEvent) => {
      if (!el) return
      rect = el.getBoundingClientRect()
      const clientX = e.clientX
      const clientY = e.clientY

      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        if (!rect || rect.width === 0 || rect.height === 0) return
        const px = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
        const py = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
        el.style.setProperty('--px', String(px))
        el.style.setProperty('--py', String(py))
      })
    }

    const handleMouseLeave = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rect = null
      el.style.setProperty('--px', '0.5')
      el.style.setProperty('--py', '0.5')
    }

    el.addEventListener('mousemove', handleMouseMove, { passive: true })
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [active])

  return ref
}

interface SlideProps {
  slide: SlideData
  offset: number
  isWrapping: boolean
  onSelect: () => void
}

function Slide({ slide, offset, isWrapping, onSelect }: SlideProps) {
  const active = offset === 0
  const isVisible = Math.abs(offset) <= 2
  // Depth-sorting: center card is 10, adjacent are 6, outer are 2
  const zIndex = active ? 10 : Math.max(1, 10 - Math.abs(offset) * 3)
  const ref = useTilt(active)
  const [currentSrc, setCurrentSrc] = useState(slide.image)

  useEffect(() => {
    setCurrentSrc(slide.image)
  }, [slide.image])

  // Fallback to local image if any remote URL fails to load
  const handleImageError = () => {
    const fallback = SLIDES.find(s => s.title === slide.title)?.image || '/socialwork/social-1.jpg'
    if (currentSrc !== fallback) {
      setCurrentSrc(fallback)
    }
  }

  return (
    <div
      ref={ref}
      className={s.slide}
      data-active={active ? 'true' : 'false'}
      style={
        {
          '--offset': offset,
          '--dir': offset === 0 ? 0 : offset > 0 ? 1 : -1,
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? 'auto' : 'none',
          zIndex,
        } as React.CSSProperties
      }
    >
      {active && (
        <div
          className={s.slideBackground}
          style={{
            backgroundImage: `url('${currentSrc}')`,
          }}
        />
      )}

      <div
        className={s.slideContent}
        style={{
          transition: isWrapping ? 'none' : undefined,
          cursor: active ? 'default' : 'pointer',
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (!active) {
            onSelect()
          }
        }}
        title={active ? undefined : `Switch to ${slide.title}`}
      >
        <img
          src={currentSrc}
          alt={slide.title}
          className={s.slideImgEl}
          loading="eager"
          decoding="async"
          onError={handleImageError}
        />
        <div className={s.slideGradient} />

        <div className={s.slideContentInner}>
          <h2 className={s.slideTitle}>{slide.title}</h2>
          <h3 className={s.slideSubtitle}>{slide.subtitle}</h3>
          <p className={s.slideDescription}>{slide.description}</p>
        </div>
      </div>
    </div>
  )
}

export default function SocialWork() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const prevIndexRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const [slides, setSlides] = useState<SlideData[]>(SLIDES)
  const secRef = useRef<HTMLElement>(null)
  const touchStartX = useRef<number | null>(null)

  const total = slides.length

  // Preload all slide images into browser cache immediately for instantaneous rendering
  useEffect(() => {
    SLIDES.forEach(item => {
      const img = new Image()
      img.src = item.image
    })
  }, [])

  // State Debouncing / Rapid Click Queueing (with 350ms lock)
  const handleNext = useCallback(() => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true
    setIsAnimating(true)

    setCurrentIndex(prev => {
      prevIndexRef.current = prev
      return (prev + 1) % total
    })

    setTimeout(() => {
      isAnimatingRef.current = false
      setIsAnimating(false)
    }, 350)
  }, [total])

  const handlePrev = useCallback(() => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true
    setIsAnimating(true)

    setCurrentIndex(prev => {
      prevIndexRef.current = prev
      return (prev - 1 + total) % total
    })

    setTimeout(() => {
      isAnimatingRef.current = false
      setIsAnimating(false)
    }, 350)
  }, [total])

  const handleGoto = useCallback((idx: number) => {
    if (isAnimatingRef.current || idx === currentIndex) return
    isAnimatingRef.current = true
    setIsAnimating(true)

    setCurrentIndex(prev => {
      prevIndexRef.current = prev
      return idx
    })

    setTimeout(() => {
      isAnimatingRef.current = false
      setIsAnimating(false)
    }, 350)
  }, [currentIndex])

  // Touch Swipe for mobile/tablets
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = e.changedTouches[0].clientX - touchStartX.current
    if (diff > 45) {
      handlePrev()
    } else if (diff < -45) {
      handleNext()
    }
    touchStartX.current = null
  }

  // Load photos from DB/galleryStore if admin uploaded valid custom photos
  useEffect(() => {
    const randomizeCategoryPhotos = () => {
      const allPhotos = getStoredPhotos()
      const categories = getStoredCategories()

      setSlides(
        SLIDES.map((slide, idx) => {
          const kw = SLIDE_CATEGORY_KEYWORDS[idx] || ['all']
          const randomPhoto = getRandomCategoryPhoto(kw, slide.image, allPhotos, categories)
          // Keep reliable local images unless the DB returns a valid non-empty URL
          const validUrl = (randomPhoto.isFromDb && randomPhoto.url && randomPhoto.url.trim().length > 5)
            ? randomPhoto.url
            : slide.image

          return {
            ...slide,
            image: validUrl
          }
        })
      )
    }

    randomizeCategoryPhotos()
    fetchAllPhotos().then(() => randomizeCategoryPhotos()).catch(() => {})

    window.addEventListener(GALLERY_UPDATE_EVENT, randomizeCategoryPhotos)
    window.addEventListener('storage', randomizeCategoryPhotos)

    return () => {
      window.removeEventListener(GALLERY_UPDATE_EVENT, randomizeCategoryPhotos)
      window.removeEventListener('storage', randomizeCategoryPhotos)
    }
  }, [])

  // Intro GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-sw="header"]', {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: secRef.current, start: 'top 75%' },
      })

      gsap.from('[data-sw="stage"]', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-sw="stage"]', start: 'top 85%' },
      })
    }, secRef)

    return () => ctx.revert()
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev])

  return (
    <section ref={secRef} className={s.section}>
      {/* Section Header */}
      <div data-sw="header" className={s.carouselHeader}>
        <span className={s.eyebrow}>From the Field · Ground Realities &amp; Verified Facts</span>
        <h2 className={s.carouselTitle}>What We Observed &amp; What We Learned</h2>
        <p className={s.carouselSub}>Frontline empirical observations across 200+ villages (2019–2026)</p>
      </div>

      {/* 3D Carousel Stage */}
      <div data-sw="stage" className={s.carouselWrap}>
        {/* Previous Arrow Button — elevated z-index, debounced, outside 3D card collision */}
        <button
          type="button"
          className={`${s.navBtn} ${s.btnPrev}`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handlePrev()
          }}
          disabled={isAnimating}
          aria-label="Previous Slide"
          title="Previous Slide"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div
          className={s.slidesContainer}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className={s.slides}>
            {slides.map((slide, i) => {
              const currentOffset = getCircularOffset(i, currentIndex, total)
              const previousOffset = getCircularOffset(i, prevIndexRef.current, total)
              const isWrapping = Math.abs(currentOffset - previousOffset) > 2

              return (
                <Slide
                  key={slide.title}
                  slide={slide}
                  offset={currentOffset}
                  isWrapping={isWrapping}
                  onSelect={() => handleGoto(i)}
                />
              )
            })}
          </div>
        </div>

        {/* Next Arrow Button — elevated z-index, debounced, outside 3D card collision */}
        <button
          type="button"
          className={`${s.navBtn} ${s.btnNext}`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleNext()
          }}
          disabled={isAnimating}
          aria-label="Next Slide"
          title="Next Slide"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Dots Navigation */}
        <div className={s.dotsRow}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`${s.dot} ${currentIndex === idx ? s.dotActive : ''}`}
              onClick={() => handleGoto(idx)}
              disabled={isAnimating}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className={s.ctaRow}>
          <Link to="/social-work" className={s.exploreLink}>
            Explore Full Social Work Archive &amp; Field Reports →
          </Link>
        </div>
      </div>
    </section>
  )
}
