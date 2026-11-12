import { useEffect, useRef, useState } from 'react'
import { supabase, Course } from '../../lib/supabase'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import s from './Courses.module.css'
import Testimonials from '../Testimonials/Testimonials'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_COURSES = [
  {
    id: 'default-1',
    badge: 'Kshatra-Dharma · Shakti Sabha',
    title: 'Warrior Spirit Certification',
    detail: 'Guided by the Aaryaveera philosophy — somatic self-defense, leadership, cultural identity, and sovereign character. 12 modules, lifetime access.',
    modules: '12 Modules',
    duration: '8 Weeks',
    level: 'All Levels',
    price: '₹1,800',
    original_price: '₹2,500',
    discount_percent: 28,
    discount_tag: 'Save ₹700',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=800&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'default-2',
    badge: 'Parenting · Vedic Wisdom',
    title: 'Vedic Parenting in Modern India',
    detail: 'Raising resilient, rooted children in a fractured world. Drawing on timeless civilizational principles, modern psychology, and lived experience.',
    modules: '8 Modules',
    duration: '6 Weeks',
    level: 'Parents',
    price: '₹1,500',
    original_price: '₹2,000',
    discount_percent: 25,
    discount_tag: 'Save ₹500',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    featured: false
  },
  {
    id: 'default-3',
    badge: 'Discourse · Shakti Varta',
    title: 'Understanding Paurush — True Masculinity',
    detail: 'An honest inquiry into noble masculinity, Dharma, protective ethics, and the role of men in building and safeguarding a just society.',
    modules: '6 Modules',
    duration: '4 Weeks',
    level: 'Open',
    price: '₹1,800',
    original_price: '₹2,600',
    discount_percent: 31,
    discount_tag: 'Save ₹800',
    image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=800&auto=format&fit=crop',
    featured: false
  },
  {
    id: 'default-4',
    badge: 'Self-Defense · Mission Mardini',
    title: 'Lathi-Kaushal for Women',
    detail: "The ancient Indian martial discipline of Lathi — practical, biomechanically superior, and rooted. Taught by certified Shakti Sabha instructors.",
    modules: '10 Modules',
    duration: '6 Weeks',
    level: 'Beginners',
    price: '₹2,000',
    original_price: '₹2,800',
    discount_percent: 29,
    discount_tag: 'Save ₹800',
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?q=80&w=800&auto=format&fit=crop',
    featured: false
  },
  {
    id: 'default-5',
    badge: 'Legal Shield · Research',
    title: 'The Legal Collage — Know Your Rights',
    detail: 'Understanding IPC, BNS, and procedural legal safeguards. Fact-based, advocate-reviewed, and indispensable for every woman in India.',
    modules: '5 Modules',
    duration: '3 Weeks',
    level: 'Open',
    price: '₹1,400',
    original_price: '₹2,000',
    discount_percent: 30,
    discount_tag: 'Save ₹600',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop',
    featured: false
  },
]

const mapCourseToCard = (c: any, index: number) => {
  const origPrice = c.original_price ? (typeof c.original_price === 'number' ? `₹${c.original_price.toLocaleString()}` : c.original_price) : (c.price ? `₹${c.price.toLocaleString()}` : '')
  const payablePrice = c.price ? (typeof c.price === 'number' ? `₹${c.price.toLocaleString()}` : c.price) : 'Free'
  const fallbackImg = DEFAULT_COURSES[index % DEFAULT_COURSES.length].image

  return {
    id: c.id,
    badge: c.instructor ? `Instructor · ${c.instructor}` : (c.level ? `${c.level.toUpperCase()} · Academy` : 'Academy'),
    title: c.title,
    detail: c.description || 'Comprehensive training curriculum with verified field instruction.',
    modules: c.syllabus && c.syllabus.length > 0 ? `${c.syllabus.length} Modules` : (c.duration || 'Self-Paced'),
    duration: c.duration || 'Flexible',
    level: c.level || 'All Levels',
    image: c.cover_image_url || fallbackImg,
    price: payablePrice,
    original_price: origPrice,
    discount_percent: c.discount_percent || 0,
    discount_tag: c.discount_tag || '',
    featured: Boolean(c.featured)
  }
}

const getInitialCourses = () => {
  try {
    const local = typeof window !== 'undefined' ? localStorage.getItem('shakti_custom_courses') : null
    if (local) {
      const parsed = JSON.parse(local)
      const published = parsed.filter((c: any) => c.published).map(mapCourseToCard)
      if (published.length > 0) return published
    }
  } catch (e) {
    // fallback
  }
  return DEFAULT_COURSES
}

export default function Courses() {
  const [coursesList, setCoursesList] = useState(getInitialCourses)
  const secRef  = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let isMounted = true

    async function loadCourses() {
      let fetched: Course[] = []
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })

        if (!error && data && data.length > 0) {
          fetched = data as Course[]
        }
      } catch (err) {
        console.warn('Courses fetch error on home page:', err)
      }

      // Check localStorage for local previews
      try {
        const local = localStorage.getItem('shakti_custom_courses')
        if (local) {
          const localList: Course[] = JSON.parse(local)
          const published = localList.filter(c => c.published)
          const existingIds = new Set(fetched.map(c => c.id))
          const existingTitles = new Set(fetched.map(c => c.title.trim().toLowerCase()))
          const unique = published.filter(c => !existingIds.has(c.id) && !existingTitles.has(c.title.trim().toLowerCase()))
          fetched = [...unique, ...fetched]
        }
      } catch (e) {
        // ignore
      }

      if (isMounted) {
        if (fetched.length > 0) {
          setCoursesList(fetched.map(mapCourseToCard))
        } else {
          setCoursesList(DEFAULT_COURSES)
        }
        setTimeout(() => {
          ScrollTrigger.refresh()
        }, 150)
      }
    }

    loadCourses()
    window.addEventListener('storage', loadCourses)
    window.addEventListener('shakti_courses_updated', loadCourses)
    return () => {
      isMounted = false
      window.removeEventListener('storage', loadCourses)
      window.removeEventListener('shakti_courses_updated', loadCourses)
    }
  }, [])

  const scrollByCards = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const cardW = (track.querySelector('[data-c="card"]') as HTMLElement | null)
      ?.offsetWidth ?? 340
    window.scrollBy({ top: dir * (cardW + 24), behavior: 'smooth' })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track   = trackRef.current
      const section = secRef.current
      if (!track || !section) return

      const totalScroll = track.scrollWidth - section.offsetWidth

      if (totalScroll > 0) {
        gsap.to(track, {
          x: -totalScroll,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${totalScroll}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setProgress(self.progress),
          },
        })
      }

      gsap.from('[data-c="card"]', {
        opacity: 0,
        y: 28,
        stagger: 0.09,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 80%' },
      })
    }, secRef)

    return () => ctx.revert()
  }, [coursesList.length])

  const canScrollLeft  = progress > 0.02
  const canScrollRight = progress < 0.98

  return (
    <>
      <section ref={secRef} className={s.section} data-courses-section>
        <div className={s.header}>
          <div className={s.headerLeft}>
            <span className={s.eyebrow}>Accredited Capacity Building</span>
            <h2 className={s.title}>Institutional Programs / Cohorts</h2>
            <p className={s.subtitle}>Tactical self-defense, psychological resilience, and civilizational character formation — delivered through accredited institutional cohorts.</p>
          </div>

          <div className={s.headerRight}>
            <div className={s.navArrows}>
              <button
                type="button"
                className={`${s.arrowBtn} ${!canScrollLeft ? s.arrowDisabled : ''}`}
                onClick={() => scrollByCards(-1)}
                aria-label="Previous courses"
                disabled={!canScrollLeft}
              >
                ←
              </button>
              <button
                type="button"
                className={`${s.arrowBtn} ${!canScrollRight ? s.arrowDisabled : ''}`}
                onClick={() => scrollByCards(1)}
                aria-label="Next courses"
                disabled={!canScrollRight}
              >
                →
              </button>
            </div>
            <Link to="/courses" className={s.allProgramsBtn}>
              <span>All Programs &amp; Cohorts</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* GSAP horizontal track */}
        <div ref={trackRef} className={s.track}>
          {coursesList.map((c: any) => (
            <div key={c.id || c.title} data-c="card" className={`${s.card} ${c.featured ? s.featured : ''}`}>
              <div className={s.cardImgWrap}>
                <img 
                  src={c.image} 
                  alt={c.title} 
                  className={s.cardImg} 
                  loading="lazy" 
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_COURSES[0].image
                  }}
                />
                <span className={s.cardLevelPill}>{c.level}</span>
              </div>

              <div className={s.cardBadge}>{c.badge}</div>
              <h3 className={s.cardTitle}>{c.title}</h3>
              <p className={s.cardDetail}>{c.detail}</p>

              {/* Meta information row */}
              <div className={s.cardMeta}>
                <div className={s.metaPill}>
                  <GoogleIcon name="schedule" size={14} />
                  <span>{c.duration}</span>
                </div>
                <div className={s.metaPill}>
                  <GoogleIcon name="menu_book" size={14} />
                  <span>{c.modules}</span>
                </div>
              </div>

              <div className={s.cardFooter}>
                <div className={s.cohortWrapper}>
                  <span className={s.cohortBadge}>Institutional Cohort</span>
                  <span className={s.cohortType}>Accredited Syllabus</span>
                </div>
                <Link to="/courses" className={s.enroll}>
                  <span>Details</span>
                  <span className={s.btnArrow}>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Testimonials />
    </>
  )
}
