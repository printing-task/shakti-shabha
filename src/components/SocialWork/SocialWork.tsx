import { useEffect, useRef, useState } from 'react'
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
    title: 'Village Defense Camp',
    subtitle: 'Nagpur, Maharashtra',
    description: '340+ women trained in Lathi-Kaushal and tactical neighborhood defense.',
    stat: '340+ Trained',
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'Survivor Circle',
    subtitle: 'Amravati, Maharashtra',
    description: 'Breaking silence on domestic trauma with confidential psychological pods.',
    stat: '1,200+ Healed',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'Shakti Varta Seminar',
    subtitle: 'Pune, Maharashtra',
    description: 'Academic research, white papers, and epigraphical discourse on Vedic heroines.',
    stat: '45+ Papers',
    image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'Sword Training Camp',
    subtitle: 'Wardha, Maharashtra',
    description: 'Revival of ancient Bharatiya martial arts and mental fear-eradication.',
    stat: '600+ Warriors',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'Youth Leadership',
    subtitle: 'Yavatmal, Maharashtra',
    description: 'Shakti Sabha character and leadership academy for girls 14–20, guided by the Aaryaveera worldview.',
    stat: '15,000+ Cadets',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop&q=80',
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

    const handleMouseMove = (e: MouseEvent) => {
      if (!el) return
      if (!rect) {
        rect = el.getBoundingClientRect()
      }
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      el.style.setProperty('--px', String(px))
      el.style.setProperty('--py', String(py))
    }

    const handleMouseLeave = () => {
      rect = null
      el.style.setProperty('--px', '0.5')
      el.style.setProperty('--py', '0.5')
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
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
  const ref = useTilt(active)

  return (
    <div
      ref={ref}
      className={s.slide}
      data-active={active ? 'true' : 'false'}
      style={
        {
          '--offset': offset,
          '--dir': offset === 0 ? 0 : offset > 0 ? 1 : -1,
          opacity: Math.abs(offset) > 2 ? 0 : undefined,
          pointerEvents: Math.abs(offset) > 2 ? 'none' : undefined,
        } as React.CSSProperties
      }
      onClick={!active ? onSelect : undefined}
    >
      <div
        className={s.slideBackground}
        style={{
          backgroundImage: `url('${slide.image}')`,
        }}
      />

      <div
        className={s.slideContent}
        style={{
          transition: isWrapping ? 'none' : undefined,
        }}
      >
        <div
          className={s.slideImage}
          style={{
            backgroundImage: `url('${slide.image}')`,
          }}
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
  const prevIndexRef = useRef(0)
  const [slides, setSlides] = useState<SlideData[]>(SLIDES)
  const secRef = useRef<HTMLElement>(null)

  const total = slides.length

  const handleNext = () => {
    prevIndexRef.current = currentIndex
    setCurrentIndex(prev => (prev + 1) % total)
  }

  const handlePrev = () => {
    prevIndexRef.current = currentIndex
    setCurrentIndex(prev => (prev - 1 + total) % total)
  }

  const handleGoto = (idx: number) => {
    prevIndexRef.current = currentIndex
    setCurrentIndex(idx)
  }

  // Load photos from DB/galleryStore
  useEffect(() => {
    const randomizeCategoryPhotos = () => {
      const allPhotos = getStoredPhotos()
      const categories = getStoredCategories()

      setSlides(
        SLIDES.map((slide, idx) => {
          const kw = SLIDE_CATEGORY_KEYWORDS[idx] || ['all']
          const randomPhoto = getRandomCategoryPhoto(kw, slide.image, allPhotos, categories)
          return {
            ...slide,
            image: randomPhoto.url
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
  }, [currentIndex])

  return (
    <section ref={secRef} className={s.section}>
      {/* Section Header */}
      <div data-sw="header" className={s.carouselHeader}>
        <span className={s.eyebrow}>12 Years · 3 Streams · 1 Mission</span>
        <h2 className={s.carouselTitle}>Where Shakti Sabha Has Stood</h2>
        <p className={s.carouselSub}>जहाँ हम खड़े हैं — 12 Years of Grassroots Field Impact Across Maharashtra</p>
      </div>

      {/* 3D Carousel Stage */}
      <div data-sw="stage" className={s.carouselWrap}>
        <div className={s.slidesContainer}>
          <div className={s.slides}>
            <button
              type="button"
              className={`${s.navBtn} ${s.btnPrev}`}
              onClick={handlePrev}
              aria-label="Previous Slide"
              title="Previous Slide"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {slides.map((slide, i) => {
              const currentOffset = getCircularOffset(i, currentIndex, total)
              const previousOffset = getCircularOffset(i, prevIndexRef.current, total)
              // If a slide is wrapping from -2 to +2 or vice-versa behind the scenes, disable transition
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

            <button
              type="button"
              className={`${s.navBtn} ${s.btnNext}`}
              onClick={handleNext}
              aria-label="Next Slide"
              title="Next Slide"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Dots Navigation */}
        <div className={s.dotsRow}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`${s.dot} ${currentIndex === idx ? s.dotActive : ''}`}
              onClick={() => handleGoto(idx)}
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
