import { useState, useEffect, useRef } from 'react'
import { supabase, Testimonial } from '../../lib/supabase'
import { DEFAULT_TESTIMONIALS } from './testimonialsData'
import s from './Testimonials.module.css'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS)
  const trackRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isManual, setIsManual] = useState(false)
  const [manualIndex, setManualIndex] = useState(0)
  const [selectedStory, setSelectedStory] = useState<Testimonial | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadTestimonials = async () => {
      let remoteList: Testimonial[] = []

      // 1. Fetch published from Supabase
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })

        if (!error && data && data.length > 0) {
          remoteList = data as Testimonial[]
        }
      } catch (err) {
        // Table might not exist yet, fallback smoothly
      }

      // 2. Fetch from LocalStorage (Custom admin testimonials)
      try {
        const local = localStorage.getItem('shakti_testimonials')
        if (local) {
          const localParsed: Testimonial[] = JSON.parse(local)
          const publishedLocal = localParsed.filter(t => t.published !== false)

          const existingIds = new Set(remoteList.map(t => t.id))
          const uniqueLocal = publishedLocal.filter(t => !existingIds.has(t.id))
          remoteList = [...uniqueLocal, ...remoteList]
        }
      } catch (e) {
        console.warn('LocalStorage testimonials read error:', e)
      }

      // 3. Fallback to default authentic testimonies if empty
      if (remoteList.length === 0) {
        remoteList = DEFAULT_TESTIMONIALS
      } else {
        const existingQuotes = new Set(remoteList.map(t => t.quote.trim().toLowerCase()))
        const extraDefaults = DEFAULT_TESTIMONIALS.filter(d => !existingQuotes.has(d.quote.trim().toLowerCase()))
        remoteList = [...remoteList, ...extraDefaults]
      }

      if (isMounted) {
        setTestimonials(remoteList)
      }
    }

    loadTestimonials()

    const handleStorageChange = () => {
      loadTestimonials()
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      isMounted = false
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Duplicate list to achieve infinite seamless loop
  const marqueeItems = [...testimonials, ...testimonials]

  const nudge = (direction: 'left' | 'right') => {
    setIsManual(true)
    setIsPaused(true)
    setManualIndex(prev => {
      const max = Math.max(0, marqueeItems.length - 1)
      if (direction === 'left') {
        return prev <= 0 ? 0 : prev - 1
      } else {
        return prev >= max ? 0 : prev + 1
      }
    })
  }

  const togglePlayPause = () => {
    if (isManual) {
      setIsManual(false)
      setIsPaused(false)
    } else {
      setIsPaused(p => !p)
    }
  }

  return (
    <section className={s.section} aria-label="Community Testimonials">
      <div className={s.container}>
        <div className={s.header}>
          <div className={s.headerLeft}>
            <span className={s.eyebrow}>Voices of Transformation</span>
            <h2 className={s.title}>The Spirit of Shakti</h2>
            <p className={s.subtitle}>
              Hear from the brave women, survivors, grassroots trainers, and scholars who have forged their strength through Shakti Sabha's three streams.
            </p>
          </div>

          <div className={s.headerRight}>
            <button
              className={s.navBtn}
              onClick={() => nudge('left')}
              title="Previous testimonial"
              aria-label="Previous"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              className={s.navBtn}
              onClick={() => nudge('right')}
              title="Next testimonial"
              aria-label="Next"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button
              className={s.navBtn}
              onClick={togglePlayPause}
              title={isPaused ? 'Resume auto scroll' : 'Pause auto scroll'}
              aria-label={isPaused ? 'Play' : 'Pause'}
            >
              {isPaused ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Infinite Horizontal Marquee */}
      <div
        className={s.marqueeOuter}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => !isManual && setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => !isManual && setIsPaused(false)}
      >
        <div
          ref={trackRef}
          className={s.marqueeTrack}
          style={isManual ? {
            animation: 'none',
            transform: `translateX(-${manualIndex * 428}px)`,
            transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          } : {
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        >
          {marqueeItems.map((item, idx) => {
            const isLong = item.quote.length > 220
            return (
              <article key={`${item.id}-${idx}`} className={s.card}>
                <div className={s.cardBody}>
                  <div className={s.cardTop}>
                    <div className={s.stars} aria-label={`${item.rating || 5} out of 5 stars`}>
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span className={s.quoteIcon} aria-hidden="true">“</span>
                  </div>

                  <blockquote className={s.quoteText}>
                    "{item.quote}"
                  </blockquote>

                  {isLong && (
                    <button
                      type="button"
                      className={s.readMoreBtn}
                      onClick={() => setSelectedStory(item)}
                    >
                      Read full experience →
                    </button>
                  )}
                </div>

                <div className={s.authorBlock}>
                  <div className={s.avatarWrap}>
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className={s.avatarImg}
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget
                          target.style.display = 'none'
                          if (target.parentElement) {
                            const fallback = document.createElement('span')
                            fallback.className = s.avatarInitial
                            fallback.textContent = item.name.charAt(0).toUpperCase()
                            target.parentElement.appendChild(fallback)
                          }
                        }}
                      />
                    ) : (
                      <span className={s.avatarInitial}>
                        {item.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className={s.authorInfo}>
                    <h3 className={s.authorName}>{item.name}</h3>
                    <div className={s.authorRole}>
                      <span>{item.role}</span>
                      {item.location && (
                        <span className={s.authorLocation}>{item.location}</span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {/* Full Testimonial Modal Dialog */}
      {selectedStory && (
        <div className={s.modalOverlay} onClick={() => setSelectedStory(null)}>
          <div className={s.modalContent} onClick={e => e.stopPropagation()}>
            <button className={s.modalClose} onClick={() => setSelectedStory(null)} aria-label="Close story">
              ✕
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className={s.avatarWrap} style={{ width: 60, height: 60 }}>
                {selectedStory.image_url ? (
                  <img src={selectedStory.image_url} alt={selectedStory.name} className={s.avatarImg} />
                ) : (
                  <span className={s.avatarInitial}>{selectedStory.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.25rem', color: '#111827', fontSize: '1.2rem', fontWeight: 700 }}>
                  {selectedStory.name}
                </h3>
                <div style={{ color: '#6B7280', fontSize: '0.85rem' }}>
                  {selectedStory.role} {selectedStory.location ? `• ${selectedStory.location}` : ''}
                </div>
              </div>
            </div>

            <div className={s.stars} style={{ marginBottom: '1rem' }}>
              {Array.from({ length: selectedStory.rating || 5 }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>

            <p className={s.fullQuote}>
              "{selectedStory.quote}"
            </p>

            <button
              onClick={() => setSelectedStory(null)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#bd1834',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '9999px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Close Story
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
