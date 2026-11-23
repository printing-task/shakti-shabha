import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { supabase } from '../lib/supabase'
import { sendCounsellingNotificationEmail } from '../lib/emailService'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import s from './PageLayout.module.css'
import cp from './CounsellingPage.module.css'

gsap.registerPlugin(ScrollTrigger)

interface ServiceWheelItem {
  icon: string
  title: string
  desc: string
  actionText: string
  actionLink: string
  tags: string[]
  image: string
}

const WHEEL_SERVICES: ServiceWheelItem[] = [
  {
    icon: 'psychology',
    title: 'Psychological Empowerment',
    desc: 'Mental wellbeing aur emotional resilience ke liye certified clinical psychologists dwara expert guidance. Apne swa-roop ko samjhein aur aatmasamman ko punah sthapit karein.',
    actionText: 'Book Session →',
    actionLink: '#book-session',
    tags: ['Mental Health', 'Empowerment', 'Shakti Bhava'],
    image: '/socialwork/IMG-20250609-WA0019 (3).jpg',
  },
  {
    icon: 'chat',
    title: 'Confidential 1-on-1 Counselling',
    desc: 'Professional licensed counsellors ke saath surakshit aur gopniya baatcheet. Ek aisi jagah jahan bina kisi judgment ke aap apni peeda aur sangharsh sajha kar sakti hain.',
    actionText: 'Book Session →',
    actionLink: '#book-session',
    tags: ['Safe Space', '100% Confidential', 'Tele-Counseling'],
    image: '/socialwork/IMG-20250628-WA0025.jpg',
  },
  {
    icon: 'school',
    title: 'Trauma & PTSD Workshops',
    desc: 'Somatic PTSD stabilization, boundary setting, aur cognitive de-escalation par expert-led interactive offline camps aur online workshops.',
    actionText: 'Explore Events →',
    actionLink: '/events',
    tags: ['Workshops', 'PTSD Recovery', 'Interactive'],
    image: '/socialwork/IMG-20250423-WA0020 (1).jpg',
  },
  {
    icon: 'groups',
    title: 'Sisterhood Healing Circles',
    desc: 'Bhartiya mahilaon ka ek sangathit samuh jahan sahanubhuti, sahyog aur paraspar prerana ke madhyam se bhavnatmak ghawon ka upchar kiya jata hai.',
    actionText: 'Join Community →',
    actionLink: '/sahyog',
    tags: ['Sisterhood', 'Solidarity', 'Sahyog'],
    image: '/socialwork/IMG-20250606-WA0006 (1).jpg',
  },
  {
    icon: 'menu_book',
    title: 'Cognitive Wellness Modules',
    desc: 'Atmavishwas, stress management, aur emotional intelligence par self-paced digital curriculum aur practical worksheets.',
    actionText: 'Explore Courses →',
    actionLink: '/courses',
    tags: ['LMS', 'Self-Paced', 'Wellness'],
    image: '/socialwork/IMG-20250628-WA0012.jpg',
  },
  {
    icon: 'spa',
    title: 'Somatic Recovery & Mindfulness',
    desc: 'Shareerik aur mansik santulan hetu prana-ayam, snayu shantata, aur dhyan vidhiyan jo sthirata aur urja pradan karti hain.',
    actionText: 'Start Recovery →',
    actionLink: '#book-session',
    tags: ['Holistic', 'Mindfulness', 'Somatic'],
    image: '/socialwork/20260524_135910 (1).jpg',
  },
  {
    icon: 'swords',
    title: 'Crisis Rescue & Intervention Support',
    desc: 'High-risk sthitiyon, parivarik dabav, aur shoshan ke mamlon mein aapatkaleen sahayata, legal paramarsh, aur punarvas margdarshan.',
    actionText: 'Emergency Help →',
    actionLink: '#book-session',
    tags: ['Crisis Rescue', 'Frontline', 'Legal Armor'],
    image: '/socialwork/IMG-20250128-WA0025.jpg',
  },
  {
    icon: 'podcasts',
    title: 'Inner Strength & Aaryaveera Dialogues',
    desc: 'Veerangana itihas, mansik mazbooti, aur aadhunik chunautiyon par dharavahik podcast sessions — suniye aur aatmabal badhaiye.',
    actionText: 'Listen Now →',
    actionLink: '/aaryaveera',
    tags: ['Shakti Varta', 'Audio Series', 'Resilience'],
    image: '/socialwork/IMG_20260906_144953_075.jpg',
  },
  {
    icon: 'star',
    title: 'Survivor Transformation Archives',
    desc: 'Sangharsh se Vijay tak ki pramanit kahaniyan jahan mahilaon ne mansik shoshan ko harakar aatmanirbharta haasil ki.',
    actionText: 'Read Stories →',
    actionLink: '/about',
    tags: ['Real Stories', 'Transformation', 'About'],
    image: '/socialwork/VID20250618181015(1).jpg',
  },
]

export default function CounsellingPage() {
  const [formDone, setFormDone] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    concern: 'Anxiety, Stress & Overthinking',
    email: '',
    phone: '',
    country: 'India',
    state: '',
    city: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [activeDot, setActiveDot] = useState(0)
  const checkIsMobileOrPortrait = () => {
    if (typeof window === 'undefined') return false
    return window.innerWidth <= 768 || (window.innerWidth <= 1024 && window.innerHeight > window.innerWidth)
  }

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? checkIsMobileOrPortrait() : false
  )

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(checkIsMobileOrPortrait())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const sectionRef = useRef<HTMLElement>(null)
  const wheelWrapperRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const triggerRef = useRef<ScrollTrigger | null>(null)

  /* ── 3D Card Wheel (Accordéon Asymétrique) Animation Logic ── */
  useEffect(() => {
    const section = sectionRef.current
    const wrapper = wheelWrapperRef.current
    const totalCards = WHEEL_SERVICES.length
    if (!section || !wrapper || totalCards === 0) return

    const SPREAD_X = isMobile ? 0.04 : 0.14
    const SPREAD_Y = isMobile ? 0.03 : 0.22
    const ROTATE = isMobile ? 1.5 : 3.5
    const SKEW = isMobile ? -0.5 : -1.5
    const SCALE_MIN = 0.82

    function updateCards(progress: number) {
      const current = progress * (totalCards - 1)
      const activeIdx = Math.min(totalCards - 1, Math.max(0, Math.round(current)))
      setActiveDot(activeIdx)

      cardsRef.current.forEach((card, index) => {
        if (!card) return
        const offset = index - current
        const absOffset = Math.abs(offset)
        const spreadX = -offset * Math.min(window.innerWidth, 400) * SPREAD_X
        const spreadY = offset * (isMobile ? 120 : Math.min(window.innerHeight, 700)) * SPREAD_Y
        const rotateZ = offset * ROTATE
        const skewY = offset * SKEW
        const scale = Math.max(SCALE_MIN, 1 - absOffset * 0.08)

        if (absOffset > 1.8) {
          card.style.opacity = '0'
          card.style.pointerEvents = 'none'
          return
        }

        const opacity = absOffset > 1.4 ? 0 : Math.max(0, 1 - absOffset * 0.45)
        card.style.pointerEvents = absOffset < 0.4 ? 'auto' : 'none'
        card.style.transform = `
          translate3d(calc(-50% + ${spreadX}px), calc(-50% + ${spreadY}px), 0)
          rotate(${rotateZ}deg)
          skewY(${skewY}deg)
          scale(${scale})
        `
        card.style.opacity = `${opacity}`
        card.style.zIndex = `${Math.round(100 - absOffset * 20)}`
      })
    }

    // Set initial card states
    updateCards(0)

    // Pinning distance: smooth, capped cycle so mobile desktop view doesn't balloon
    const effectiveHeight = Math.min(window.innerHeight, 750)
    const pinDistance = isMobile
      ? (totalCards - 1) * 150
      : effectiveHeight * (totalCards - 1) * 0.55

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${pinDistance}`,
        pin: wrapper,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          updateCards(self.progress)
        },
      })
      triggerRef.current = st
    }, section)

    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 200)

    return () => {
      clearTimeout(timer)
      ctx.revert()
      triggerRef.current = null
    }
  }, [isMobile])

  const scrollToCard = (index: number) => {
    const st = triggerRef.current
    if (!st) return
    const targetScroll = st.start + (index / (WHEEL_SERVICES.length - 1)) * (st.end - st.start)
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    })
  }

  const nextCard = () => {
    if (activeDot < WHEEL_SERVICES.length - 1) {
      scrollToCard(activeDot + 1)
    }
  }

  const prevCard = () => {
    if (activeDot > 0) {
      scrollToCard(activeDot - 1)
    }
  }

  return (
    <main className={cp.page}>
      {/* ── Top Hero Banner ── */}
      <div className={cp.hero}>
        <div className={cp.heroInner}>
          <span className={cp.badge}>Mental Health & Confidential Intake</span>
          <h1 className={cp.title}>Counseling & Holistic Healing</h1>
          <p className={cp.hindiSubtitle}>Confidential Psychological Sanctuary &amp; Somatic Healing · A Safe, Sacred Space</p>
          <p className={cp.desc}>
            Indian women ke liye confidential counseling, trauma-informed clinical support, aur judgment-free community spaces.
            Explore our specialized therapeutic services below.
          </p>
        </div>
      </div>

      {/* ── 3D Card Wheel (Accordéon Asymétrique) — Clean White Background ── */}
      <section
        ref={sectionRef}
        className={cp.scrollContainer}
      >
        <div ref={wheelWrapperRef} className={cp.wheelWrapper}>
          <div className={cp.wheelGlow} />

          {/* Vertical Dots Indicator */}
          <div className={cp.indicator}>
            {WHEEL_SERVICES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`${cp.dot} ${idx === activeDot ? cp.dotActive : ''}`}
                onClick={() => scrollToCard(idx)}
                aria-label={`Jump to service ${idx + 1}`}
                title={WHEEL_SERVICES[idx].title}
              />
            ))}
          </div>

          {/* 3D Asymmetric Accordion Cards */}
          {WHEEL_SERVICES.map((item, idx) => (
            <div
              key={idx}
              ref={(el) => { cardsRef.current[idx] = el }}
              className={cp.cardWheel}
              data-index={idx}
            >
              <div className={cp.cardInner}>
                {/* Left Side: Phone Mockup with Cover Image */}
                <div className={cp.cardImage}>
                  <div className={cp.phoneMockup}>
                    <div className={cp.phoneScreen}>
                      <img src={encodeURI(item.image)} alt={item.title} loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/socialwork/social-1.jpg" }} />
                    </div>
                  </div>
                </div>

                {/* Right Side: Card Content */}
                <div className={cp.cardContent}>
                  <div className={cp.tags}>
                    <span className={`${cp.tag} ${cp.tagHighlight}`}>
                      <GoogleIcon name={item.icon} size={14} style={{ color: '#bd1834' }} />
                      {item.tags[0]}
                    </span>
                    {item.tags.slice(1).map((t, ti) => (
                      <span key={ti} className={cp.tag}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <h2>{item.title}</h2>
                  <p>{item.desc}</p>

                  <div className={cp.wheelActions}>
                    {item.actionLink.startsWith('#') ? (
                      <a href={item.actionLink} className={cp.cardActionBtn}>
                        <span>{item.actionText}</span>
                        <GoogleIcon name="arrow_forward" size={16} />
                      </a>
                    ) : (
                      <Link to={item.actionLink} className={cp.cardActionBtn}>
                        <span>{item.actionText}</span>
                        <GoogleIcon name="arrow_forward" size={16} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Mobile Bottom Navigation Controls */}
          {isMobile && (
            <div className={cp.mobileWheelNav}>
              <button
                type="button"
                onClick={prevCard}
                disabled={activeDot === 0}
                className={cp.mobileNavBtn}
                aria-label="Previous Service"
              >
                <GoogleIcon name="arrow_back" size={15} />
                <span>Prev</span>
              </button>
              <span className={cp.mobileNavCounter}>
                {activeDot + 1} / {WHEEL_SERVICES.length}
              </span>
              <button
                type="button"
                onClick={nextCard}
                disabled={activeDot === WHEEL_SERVICES.length - 1}
                className={cp.mobileNavBtn}
                aria-label="Next Service"
              >
                <span>Next</span>
                <GoogleIcon name="arrow_forward" size={15} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Confidential Intake Booking Box ── */}
      <div className={`${s.section} ${cp.bookingSection}`} style={{ background: '#FFFFFF' }}>
        <div id="book-session" className={cp.bookingBox}>
          <div className={cp.bookingGrid}>
            <div>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#bd1834', fontWeight: 700, textTransform: 'uppercase' }}>
                Safe & Confidential
              </span>
              <h2 style={{ fontFamily: "var(--serif, 'Playfair Display', Georgia, serif)", fontSize: '1.8rem', color: '#111827', margin: '0.5rem 0 1rem' }}>
                Book a Confidential Counselling Session
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Whether you are navigating anxiety, relationship challenges, career decisions, or processing trauma — our certified female clinical psychologists are here to listen with unconditional empathy.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', color: '#374151' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <GoogleIcon name="lock" size={18} style={{ color: '#059669', marginRight: '8px' }} />
                  <div><strong>100% Confidential:</strong> We adhere to strict HIPAA & APA privacy codes.</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <GoogleIcon name="chat" size={18} style={{ color: '#059669', marginRight: '8px' }} />
                  <div><strong>Free First Assessment:</strong> 30-minute intake session at zero cost.</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <GoogleIcon name="spa" size={18} style={{ color: '#059669', marginRight: '8px' }} />
                  <div><strong>Online or In-Person:</strong> Tele-counseling available pan-India.</div>
                </div>
              </div>
            </div>

            <div>
              {formDone ? (
                <div style={{ padding: '2.5rem', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', textAlign: 'center' }}>
                  <GoogleIcon name="verified" size={44} style={{ color: '#059669', marginBottom: '0.5rem' }} />
                  <h3 style={{ fontFamily: "var(--serif, 'Playfair Display', Georgia, serif)", color: '#065F46', marginBottom: '0.5rem' }}>Intake Request Received</h3>
                  <p style={{ fontSize: '0.88rem', color: '#047857' }}>
                    A counselor coordinator will reach out to you discreetly via your preferred contact mode within 24 hours.
                  </p>
                  <button onClick={() => { setFormDone(false); setFormData({ name: '', concern: 'Anxiety, Stress & Overthinking', email: '', phone: '', country: 'India', state: '', city: '', message: '' }) }} style={{ marginTop: '1.25rem', padding: '0.45rem 1.25rem', background: '#059669', color: '#FFFFFF', border: 'none', borderRadius: '9999px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    Submit Another
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async e => {
                    e.preventDefault()
                    if (!formData.name.trim()) {
                      alert('Validation Alert: Please enter your Name or Preferred Alias.')
                      return
                    }
                    if (!formData.email.trim() || !formData.email.includes('@')) {
                      alert('Validation Alert: Please enter a valid Email Address.')
                      return
                    }
                    const cleanPhone = formData.phone.replace(/[^0-9]/g, '')
                    if (cleanPhone.length < 10) {
                      alert('Validation Error: Please enter a valid 10-digit mobile number (e.g. 9876543210). Letters and special characters are not allowed.')
                      return
                    }
                    if (!formData.city.trim()) {
                      alert('Validation Alert: Please enter your Location (City, District & State).')
                      return
                    }
                    setSubmitting(true)
                    try {
                      const originTag = `[Origin: ${formData.city.trim() || 'N/A'}, ${formData.state.trim() || 'N/A'}, ${formData.country || 'India'}]`
                      const finalMsg = `${originTag} ${formData.message ? `Notes: ${formData.message}` : ''}`.trim()
                      
                      const reqPayload = {
                        name: formData.name,
                        concern: formData.concern,
                        email: formData.email,
                        phone: formData.phone,
                        city: formData.city,
                        state: formData.state,
                        country: formData.country,
                        message: finalMsg,
                        status: 'pending'
                      }

                      await supabase.from('counselling_requests').insert([reqPayload])

                      try {
                        await sendCounsellingNotificationEmail({
                          applicant_name: reqPayload.name,
                          applicant_email: reqPayload.email,
                          applicant_phone: reqPayload.phone,
                          concern: reqPayload.concern,
                          city: reqPayload.city,
                          state: reqPayload.state,
                          country: reqPayload.country,
                          message: reqPayload.message
                        })
                      } catch (emailErr) {
                        console.warn('[EmailJS] Counselling notification error:', emailErr)
                      }

                      try {
                        const localKey = 'shakti_counselling_requests'
                        const existing = JSON.parse(localStorage.getItem(localKey) || '[]')
                        localStorage.setItem(localKey, JSON.stringify([{ id: 'local_' + Date.now(), ...reqPayload, created_at: new Date().toISOString() }, ...existing]))
                      } catch (e) {
                        // ignore local backup error
                      }
                    } catch (err) {
                      console.warn('Counselling submission error:', err)
                    } finally {
                      setSubmitting(false)
                      setFormDone(true)
                    }
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Name or Preferred Alias *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Meera (Alias ok)"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Area of Support</label>
                    <select
                      value={formData.concern}
                      onChange={e => setFormData(prev => ({ ...prev, concern: e.target.value }))}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', background: '#FFFFFF' }}
                    >
                      <option>Anxiety, Stress & Overthinking</option>
                      <option>Depression & Loss of Motivation</option>
                      <option>Trauma, Domestic Coercion & Recovery</option>
                      <option>Self-Worth, Boundaries & Career Guidance</option>
                      <option>Other / Just Need Someone to Talk To</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Email Address *</label>
                      <input
                        required
                        type="email"
                        placeholder="you@email.com"
                        value={formData.email}
                        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Phone / WhatsApp (10 Digits) *</label>
                      <input
                        required
                        type="tel"
                        placeholder="10-digit mobile number"
                        pattern="^[0-9+\s-]{10,15}$"
                        title="Please enter a valid 10-digit mobile number"
                        value={formData.phone}
                        onChange={e => {
                          const val = e.target.value.replace(/[^0-9+\s-]/g, '')
                          setFormData(prev => ({ ...prev, phone: val }))
                        }}
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  {/* Location Inputs (Country, State, City) */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Location (City, District & State) *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Pune, Maharashtra (or your current town/district)"
                      value={formData.city}
                      onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', marginBottom: '0.75rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Country</label>
                      <select
                        value={formData.country}
                        onChange={e => setFormData(prev => ({ ...prev, country: e.target.value }))}
                        style={{ width: '100%', padding: '0.75rem 0.65rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.86rem', background: '#FFFFFF' }}
                      >
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="UAE">UAE</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>State / Region</label>
                      <input
                        type="text"
                        placeholder="e.g. Maharashtra"
                        value={formData.state}
                        onChange={e => setFormData(prev => ({ ...prev, state: e.target.value }))}
                        style={{ width: '100%', padding: '0.75rem 0.85rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.86rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Brief Message / Notes (Optional)</label>
                    <textarea
                      placeholder="Any specific timings or questions..."
                      rows={2}
                      value={formData.message}
                      onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{ padding: '0.85rem', background: '#bd1834', color: '#FFFFFF', border: 'none', borderRadius: '9999px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', transition: 'background 0.2s', opacity: submitting ? 0.7 : 1 }}
                  >
                    {submitting ? 'Submitting...' : 'Request Safe Callback →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
