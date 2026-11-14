import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, Course } from '../lib/supabase'
import { sendCourseNotificationEmail } from '../lib/emailService'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import s from './PageLayout.module.css'
import cp from './CoursesPage.module.css'

interface CourseItem {
  id: string
  title: string
  category: string
  level: string
  duration: string
  modules: string
  price: string
  original_price?: string
  discount_percent?: number
  discount_tag?: string
  desc: string
  image: string
  syllabus?: { week: string; topic: string }[]
}

const COURSES_DATA: CourseItem[] = [
  {
    id: 'c-1',
    title: 'Self-Defense Foundations & Situational Readiness',
    category: 'Mardini · Self Defense',
    level: 'Beginner',
    duration: '4 Weeks',
    modules: '8 Video Modules + Quizzes',
    price: '₹1,800',
    original_price: '₹2,500',
    discount_percent: 28,
    discount_tag: 'Save ₹700 · Flagship Offer',
    desc: 'Core biomechanics of human vulnerabilities, escaping holds, improvised weapon defense, and rapid emergency voice command protocols. Learn active perimeter management, recognizing pre-violence indicators, and executing explosive counter-strikes.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    syllabus: [
      { week: 'Week 1', topic: 'Cognitive Radar & Threat Identification: Color-code awareness and micro-expression red flags.' },
      { week: 'Week 2', topic: 'Bio-mechanical Escapes: Wrist grabs, bear hugs, chokeholds, and pinned-to-wall extractions.' },
      { week: 'Week 3', topic: 'Empty-Hand High-Impact Strikes: Palm-heel, hammer-fist, elbows, and knee drives.' },
      { week: 'Week 4', topic: 'Improvised Environmental Weapons: Everyday carry items, rapid exit pathways, and post-incident stabilization.' },
    ]
  },
  {
    id: 'c-2',
    title: 'Character Building & Mental Fortitude for Young Women',
    category: 'Aaryaveera Leadership',
    level: 'Intermediate',
    duration: '6 Weeks',
    modules: '12 Deep Dives + Journal',
    price: '₹2,200',
    original_price: '₹3,000',
    discount_percent: 27,
    discount_tag: 'Save ₹800 · Limited Time',
    desc: 'Unapologetic boundary setting, overcoming public anxiety, vocal projection, resilience training, and cultivating unshakeable self-worth grounded in Vedic models of feminine courage.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    syllabus: [
      { week: 'Week 1', topic: 'De-conditioning People-Pleasing & Autonomic Freeze Responses.' },
      { week: 'Week 2', topic: 'Voice Projection & Command Presence in High-Pressure Environments.' },
      { week: 'Week 3', topic: 'Psychological Resilience: Reframing Adversity through Kshatra-Dharma.' },
      { week: 'Week 4', topic: 'Boundary Architecture: Emotional, Physical, and Professional.' },
      { week: 'Week 5', topic: 'Overcoming Social Anxiety & Public Speaking Mastery.' },
      { week: 'Week 6', topic: 'The Sovereign Warrior Mindset: Long-term Integrity & Community Leadership.' },
    ]
  },
  {
    id: 'c-3',
    title: 'Vedic Parenting & Dharmic Nurturance for Tomorrow',
    category: 'Cultural Education',
    level: 'All Levels',
    duration: '3 Weeks',
    modules: '6 Modules + Community',
    price: '₹1,500',
    original_price: '₹2,000',
    discount_percent: 25,
    discount_tag: 'Save ₹500',
    desc: 'How classical Indian wisdom, sanskaras, and emotional anchoring build confident children resilient against toxic digital addiction and predatory influences.',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&auto=format&fit=crop&q=80',
    syllabus: [
      { week: 'Week 1', topic: 'Foundations of Dharmic Parenting: Sanskaras in the Digital Age.' },
      { week: 'Week 2', topic: 'Emotional Regulation & Building Lifelong Trust with Teenagers.' },
      { week: 'Week 3', topic: 'Countering Algorithm Addiction & Instilling Cultural Pride.' },
    ]
  },
  {
    id: 'c-4',
    title: 'Strategic Leadership for the Modern Bharatiya Warrior',
    category: 'Executive & Youth',
    level: 'Advanced',
    duration: '8 Weeks',
    modules: '16 Modules + Live Mentorship',
    price: '₹3,000',
    original_price: '₹4,500',
    discount_percent: 33,
    discount_tag: 'Save ₹1,500 · Special Grant',
    desc: 'Community organizing, legal literacy under Bharatiya Nyaya Sanhita, crisis mediation, and grassroots campaign management for impactful institutional change.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    syllabus: [
      { week: 'Week 1', topic: 'Civilizational Strategy & Historical Case Studies of Rani Chennamma and Ahilyabai.' },
      { week: 'Week 2', topic: 'Institutional Dynamics & Public Speaking Frameworks.' },
      { week: 'Week 3', topic: 'Legal Shield: Statutory Protections under BNS, IPC, and POSH Act.' },
      { week: 'Week 4', topic: 'Crisis Communication & Media De-escalation.' },
      { week: 'Week 5', topic: 'Grassroots Mobilization & Volunteer Management.' },
      { week: 'Week 6', topic: 'Strategic Negotiation in Hostile Environments.' },
      { week: 'Week 7', topic: 'Resource Allocation & Domestic Philanthropic Compliance.' },
      { week: 'Week 8', topic: 'Final Capstone Project: Leading an On-Ground Community Intervention.' },
    ]
  },
  {
    id: 'c-5',
    title: 'Dharma, Paurush & Civilizational Discourse',
    category: 'Philosophy & History',
    level: 'Intermediate',
    duration: '5 Weeks',
    modules: '10 Lectures + Source Texts',
    price: '₹1,800',
    original_price: '₹2,600',
    discount_percent: 31,
    discount_tag: 'Save ₹800',
    desc: 'Master the art of rigorous intellectual debate, analyzing Western feminist narratives vs civilizational Bharatiya thought with verified sources.',
    image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=600&auto=format&fit=crop&q=80',
    syllabus: [
      { week: 'Week 1', topic: 'Epistemic Frameworks of Indian Philosophy: Pramanas and Nyaya.' },
      { week: 'Week 2', topic: 'De-colonizing Indian Historiography: Correcting the Distortion.' },
      { week: 'Week 3', topic: 'Understanding Paurush: True Masculinity as Dharma-Rakshak.' },
      { week: 'Week 4', topic: 'Critical Analysis of Modern Feminist vs Dharmic Models.' },
      { week: 'Week 5', topic: 'Conducting Intellectual Symposia & Public Debates.' },
    ]
  },
  {
    id: 'c-6',
    title: 'Traditional Lathi-Kaushal & Staff Combat Video Guide',
    category: 'Martial Heritage',
    level: 'Beginner to Intermediate',
    duration: '6 Weeks',
    modules: '10 High-Def Form Drills',
    price: '₹2,000',
    original_price: '₹2,800',
    discount_percent: 29,
    discount_tag: 'Save ₹800',
    desc: 'Step-by-step master angles, footwork, dual-strike blocks, and rhythmic flow drills from experienced Maharashtra lathi masters.',
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&auto=format&fit=crop&q=80',
    syllabus: [
      { week: 'Week 1', topic: 'Stance, Footwork (Chaal), and Grip Dynamics.' },
      { week: 'Week 2', topic: 'The 12 Fundamental Target Strikes of Mardani Khel.' },
      { week: 'Week 3', topic: 'Parries, Circular Blocks, and Momentum Trapping.' },
      { week: 'Week 4', topic: 'Two-Handed Continuous Spinning (Gheraa) Defense.' },
      { week: 'Week 5', topic: 'Weapon Disarms & Empty-Hand Counter vs Lathi.' },
      { week: 'Week 6', topic: 'Live Partner Sparring & Form Mastery Certification.' },
    ]
  },
]

const MERCH_DATA = [
  { icon: 'checkroom', title: 'Aaryaveera Flame Tee', price: '₹799', tag: '100% Organic Cotton' },
  { icon: 'menu_book', title: 'The Legal Collage Handbook', price: '₹450', tag: 'Paperback · 220 Pages' },
  { icon: 'sports_martial_arts', title: 'Traditional Bamboo Lathi Staff', price: '₹650', tag: 'Seasoned Wood · 5.5 ft' },
  { icon: 'shopping_bag', title: 'Shakti Sabha Warrior Tote', price: '₹399', tag: 'Durable Canvas' },
]

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [detailCourse, setDetailCourse] = useState<CourseItem | null>(null)
  const [dbCourses, setDbCourses] = useState<CourseItem[]>([])

  // Admissions & Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    course: 'General Admissions & Guidance',
    message: ''
  })
  const [submittingContact, setSubmittingContact] = useState(false)
  const [contactSuccess, setContactSuccess] = useState(false)

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanPhone = contactForm.phone.replace(/[^0-9]/g, '')
    if (cleanPhone.length < 10) {
      alert('Validation Alert: Please enter a valid 10-digit mobile number.')
      return
    }
    setSubmittingContact(true)

    const payload = {
      name: contactForm.name.trim(),
      email: contactForm.email.trim(),
      phone: contactForm.phone.trim(),
      city: contactForm.city.trim() || 'Online / Unspecified',
      concern: `[Course Inquiry] ${contactForm.course}`,
      message: contactForm.message.trim() || `Inquiry for program: ${contactForm.course}`,
      status: 'pending',
      created_at: new Date().toISOString()
    }

    try {
      await supabase.from('counselling_requests').insert([payload])
    } catch (err) {
      console.warn('Supabase course inquiry insert error:', err)
    }

    try {
      await sendCourseNotificationEmail({
        applicant_name: payload.name,
        applicant_email: payload.email,
        applicant_phone: payload.phone,
        course_name: contactForm.course || 'General Admissions & Guidance',
        city: payload.city,
        message: payload.message
      })
    } catch (emailErr) {
      console.warn('[EmailJS] Course inquiry notification error:', emailErr)
    }

    try {
      const local = localStorage.getItem('shakti_counselling_requests')
      const list = local ? JSON.parse(local) : []
      const newRecord = { ...payload, id: `req_${Date.now()}` }
      localStorage.setItem('shakti_counselling_requests', JSON.stringify([newRecord, ...list]))
    } catch (err) {
      console.warn('LocalStorage course inquiry error:', err)
    }

    window.dispatchEvent(new Event('counselling_requests_updated'))
    window.dispatchEvent(new Event('storage'))

    setSubmittingContact(false)
    setContactSuccess(true)
    setContactForm({
      name: '',
      email: '',
      phone: '',
      city: '',
      course: 'General Admissions & Guidance',
      message: ''
    })
  }

  useEffect(() => {
    async function loadCourses() {
      let fetched: Course[] = []
      try {
        const { data } = await supabase
          .from('courses')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })

        if (data) fetched = data as Course[]
      } catch (err) {
        console.warn('Courses fetch error:', err)
      }

      // Merge with custom courses from LocalStorage (Deduplicated)
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
        console.warn('LocalStorage course load error:', e)
      }

      if (fetched.length > 0) {
                const mapped: CourseItem[] = fetched.map(c => {
          const origPrice = c.original_price ? (typeof c.original_price === 'number' ? `₹${c.original_price.toLocaleString()}` : c.original_price) : (c.price ? `₹${c.price.toLocaleString()}` : undefined)
          const payablePrice = c.price ? (typeof c.price === 'number' ? `₹${c.price.toLocaleString()}` : c.price) : 'Free'
          return {
            id: c.id,
            title: c.title,
            category: c.instructor ? `Instructor · ${c.instructor}` : 'Shakti Academy',
            level: c.level ? c.level.charAt(0).toUpperCase() + c.level.slice(1) : 'All Levels',
            duration: c.duration || 'Flexible',
            modules: c.syllabus && c.syllabus.length > 0 ? `${c.syllabus.length} Modules` : 'Structured Curriculum',
            price: payablePrice,
            original_price: origPrice,
            discount_percent: c.discount_percent || 0,
            discount_tag: c.discount_tag || '',
            desc: c.description || '',
            image: c.cover_image_url || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
            syllabus: c.syllabus,
          }
        })
        setDbCourses(mapped)
      }
    }
    loadCourses()
    window.addEventListener('storage', loadCourses)
    window.addEventListener('shakti_courses_updated', loadCourses)
    return () => {
      window.removeEventListener('storage', loadCourses)
      window.removeEventListener('shakti_courses_updated', loadCourses)
    }
  }, [])

  // Deduplicate all courses strictly by title so duplicates are never rendered
  const titleSet = new Set<string>()
  const allCourses: CourseItem[] = []
  const sourceCourses = dbCourses.length > 0 ? dbCourses : COURSES_DATA
  for (const c of sourceCourses) {
    const key = c.title.trim().toLowerCase()
    if (!titleSet.has(key)) {
      titleSet.add(key)
      allCourses.push(c)
    }
  }

  return (
    <main className={s.page}>
      {/* Hero Banner */}
      <div className={cp.hero}>
        <div className={cp.heroInner}>
          <span className={cp.badge}>SRS Section 11 · Institutional Academy</span>
          <h1 className={cp.title}>Institutional Programs &amp; Cohorts</h1>
          <p className={cp.hindiSubtitle}>Institutional Programs &amp; Group Training · Tactical Defense &amp; Leadership</p>
          <p className={cp.desc}>
            Structured, high-definition training masterclasses and intensive cohort curricula.
            Earn Shakti Sabha's Kshatra-Dharma Certification, rooted in the Aaryaveera philosophy, delivered for academic institutions, corporate collectives, and grassroots volunteers.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={s.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase' }}>
              Structured Curriculum
            </span>
            <h2 className={s.sectionTitle} style={{ marginBottom: 0, marginTop: '0.35rem' }}>Available Institutional Programs &amp; Cohorts</h2>
          </div>
          <div style={{ fontSize: '0.88rem', color: '#6B7280' }}>
            Showing {allCourses.length} Accredited Programs
          </div>
        </div>

        {/* Courses Grid */}
        <div className={cp.coursesGrid}>
          {allCourses.map(course => (
            <div key={course.id} className={cp.courseCard}>
              <div className={cp.imgWrap} onClick={() => setDetailCourse(course)} style={{ cursor: 'pointer' }}>
                <img src={course.image} alt={course.title} className={cp.courseImg} loading="lazy" />
                <span className={cp.badgeLevel}>{course.level}</span>
              </div>

              <div className={cp.courseBody}>
                <div className={cp.category}>{course.category}</div>
                <h3
                  className={cp.courseTitle}
                  onClick={() => setDetailCourse(course)}
                  style={{ cursor: 'pointer' }}
                  title="Click to view full course details & syllabus"
                >
                  {course.title}
                </h3>
                <p className={cp.descText}>{course.desc}</p>
                <button
                  type="button"
                  onClick={() => setDetailCourse(course)}
                  className={cp.moreDetailsBtn}
                  style={{ alignSelf: 'flex-start', textAlign: 'left', marginLeft: 0, marginTop: '2px', marginBottom: '4px' }}
                  title="View full syllabus and details"
                >
                  More Details & Syllabus →
                </button>

                <div className={cp.metaGrid}>
                  <div className={cp.metaItem}>
                    <GoogleIcon name="schedule" size={16} style={{ color: '#DC143C' }} />
                    <span>{course.duration}</span>
                  </div>
                  <div className={cp.metaItem}>
                    <GoogleIcon name="play_circle" size={16} style={{ color: '#DC143C' }} />
                    <span>{course.modules}</span>
                  </div>
                </div>

                <div className={cp.cardFooter}>
                  <div className={cp.cohortCol}>
                    <span className={cp.cohortTag}>Institutional Cohort</span>
                    <span className={cp.cohortSub}>Accredited Syllabus</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCourse(course.title)}
                    className={cp.enrollBtn}
                  >
                    <span>Apply for Cohort</span><span className={cp.btnArrow}>→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FULL INFORMATION & SYLLABUS SCROLLABLE MODAL */}
        {detailCourse && (
          <div
            className={cp.modalOverlay}
            data-lenis-prevent="true"
            onClick={() => setDetailCourse(null)}
          >
            <div
              className={cp.modalContent}
              data-lenis-prevent="true"
              onClick={e => e.stopPropagation()}
            >
              <button
                className={cp.modalCloseBtn}
                onClick={() => setDetailCourse(null)}
                title="Close modal"
              >
                <GoogleIcon name="close" size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                <span className={cp.category}>{detailCourse.category}</span>
                <span style={{ color: '#D1D5DB' }}>·</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', background: 'rgba(22,101,52,0.1)', padding: '0.2rem 0.65rem', borderRadius: 9999 }}>
                  {detailCourse.level}
                </span>
              </div>

              <h2 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', color: '#111827', lineHeight: 1.25, marginBottom: '1rem' }}>
                {detailCourse.title}
              </h2>

              {detailCourse.image && (
                <div style={{ width: '100%', height: 200, borderRadius: 12, overflow: 'hidden', marginBottom: '1.25rem' }}>
                  <img src={detailCourse.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', padding: '0.85rem 1.1rem', background: '#F9FAFB', borderRadius: 10, border: '1px solid #E5E7EB', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Duration</div>
                  <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>{detailCourse.duration}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Curriculum</div>
                  <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>{detailCourse.modules}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Format</div>
                  <div style={{ fontWeight: 700, color: '#DC143C', fontSize: '0.95rem' }}>Institutional Cohort</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Certificate</div>
                  <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>Verified Hash PDF</div>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginBottom: '0.4rem' }}>Course Overview</h4>
                <p style={{ fontSize: '0.92rem', color: '#4B5563', lineHeight: 1.75 }}>
                  {detailCourse.desc}
                </p>
              </div>

              {detailCourse.syllabus && detailCourse.syllabus.length > 0 && (
                <div className={cp.syllabusBox}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                    <GoogleIcon name="menu_book" size={20} style={{ color: '#DC143C' }} />
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                      Complete Weekly Syllabus ({detailCourse.syllabus.length} Modules)
                    </h4>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {detailCourse.syllabus.map((item, idx) => (
                      <div key={idx} className={cp.syllabusRow}>
                        <span className={cp.syllabusWeek}>{item.week}</span>
                        <span style={{ color: '#374151', lineHeight: 1.55 }}>{item.topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #E5E7EB' }}>
                <button
                  type="button"
                  onClick={() => setDetailCourse(null)}
                  style={{ padding: '0.7rem 1.4rem', borderRadius: 9999, border: '1px solid #D1D5DB', background: '#FFFFFF', color: '#374151', fontWeight: 600, cursor: 'pointer' }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const title = detailCourse.title
                    setDetailCourse(null)
                    setSelectedCourse(title)
                  }}
                  className={cp.enrollBtn}
                  style={{ padding: '0.7rem 1.75rem', fontSize: '0.9rem' }}
                >
                  Apply for this Cohort →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enrollment Intake Modal */}
        {selectedCourse && (
          <div
            className={cp.modalOverlay}
            data-lenis-prevent="true"
            onClick={() => setSelectedCourse(null)}
          >
            <div
              className={cp.modalContent}
              data-lenis-prevent="true"
              onClick={e => e.stopPropagation()}
            >
              <button
                className={cp.modalCloseBtn}
                onClick={() => setSelectedCourse(null)}
                title="Close"
              >
                <GoogleIcon name="close" size={18} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <GoogleIcon name="school" size={48} style={{ color: '#DC143C', marginBottom: '0.5rem' }} />
                <h3 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.4rem', color: '#111827' }}>Cohort Intake Application</h3>
                <p style={{ fontSize: '0.88rem', color: '#4B5563', marginTop: '0.25rem' }}>{selectedCourse}</p>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault()
                const formEl = e.currentTarget as HTMLFormElement
                const nameInput = formEl.elements.namedItem('fullName') as HTMLInputElement
                const emailInput = formEl.elements.namedItem('email') as HTMLInputElement
                const phoneInput = formEl.elements.namedItem('phone') as HTMLInputElement
                const cleanPhone = phoneInput?.value.replace(/[^0-9]/g, '') || ''
                if (cleanPhone.length < 10) {
                  alert('Validation Alert: Please enter a valid 10-digit mobile number.')
                  return
                }

                const payload = {
                  name: nameInput?.value.trim() || 'Cohort Applicant',
                  email: emailInput?.value.trim() || '',
                  phone: phoneInput?.value.trim() || '',
                  city: 'Online / Admissions Intake',
                  concern: `[Cohort Application] ${selectedCourse}`,
                  message: `Direct cohort application submitted for: ${selectedCourse}`,
                  status: 'pending',
                  created_at: new Date().toISOString()
                }

                try {
                  await supabase.from('counselling_requests').insert([payload])
                } catch (err) {
                  console.warn('Supabase cohort application error:', err)
                }

                try {
                  await sendCourseNotificationEmail({
                    applicant_name: payload.name,
                    applicant_email: payload.email,
                    applicant_phone: payload.phone,
                    course_name: selectedCourse || 'Cohort Program',
                    city: payload.city,
                    message: payload.message
                  })
                } catch (emailErr) {
                  console.warn('[EmailJS] Cohort modal notification error:', emailErr)
                }

                try {
                  const local = localStorage.getItem('shakti_counselling_requests')
                  const list = local ? JSON.parse(local) : []
                  const newRecord = { ...payload, id: `req_${Date.now()}` }
                  localStorage.setItem('shakti_counselling_requests', JSON.stringify([newRecord, ...list]))
                } catch (err) {
                  console.warn('LocalStorage cohort error:', err)
                }

                window.dispatchEvent(new Event('counselling_requests_updated'))
                window.dispatchEvent(new Event('storage'))

                alert('Application Submitted: Your cohort registration request has been received. Our admissions counsel will contact you shortly.')
                setSelectedCourse(null)
              }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>Full Name *</label>
                  <input name="fullName" required minLength={2} type="text" placeholder="Your name as it should appear on certificate" style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.88rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>Email Address (LMS Login) *</label>
                  <input name="email" required type="email" placeholder="you@email.com" style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.88rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>WhatsApp / Mobile</label>
                  <input
                    name="phone"
                    required
                    type="tel"
                    pattern="^[0-9+\\s-]{10,15}$"
                    placeholder="10-digit mobile number"
                    title="Please enter a valid 10-digit mobile number"
                    onKeyDown={e => {
                      if (!/[0-9+\s-]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key) && !e.ctrlKey) {
                        e.preventDefault()
                      }
                    }}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.88rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setSelectedCourse(null)} style={{ flex: 1, padding: '0.7rem', background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ flex: 2, padding: '0.7rem', background: '#DC143C', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Submit Application →</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Technical Architecture Specs (SRS Section 11 Compliance) */}
        <div className={cp.techSpecsBox}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase' }}>
              LMS Platform Architecture
            </span>
            <h2 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.6rem', color: '#111827', margin: '0.4rem 0 0' }}>
              Built for Security, Speed &amp; Retention
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#6B7280', marginTop: '0.5rem' }}>
              Our bespoke streaming infrastructure prevents content leaks and screen-scraping while delivering crisp video even on 2G/3G rural networks.
            </p>
          </div>

          <div className={cp.specsGrid}>
            <div className={cp.specCard}>
              <div className={cp.specIcon}>
                <GoogleIcon name="shield" size={32} style={{ color: '#DC143C' }} />
              </div>
              <h4 className={cp.specTitle}>DRM CloudFront</h4>
              <p className={cp.specText}>Time-limited signed URLs and dynamic watermarking prevent unauthorized video downloading and recording.</p>
            </div>
            <div className={cp.specCard}>
              <div className={cp.specIcon}>
                <GoogleIcon name="trending_up" size={32} style={{ color: '#DC143C' }} />
              </div>
              <h4 className={cp.specTitle}>Progress Tracking</h4>
              <p className={cp.specText}>Automatic module completion tracking, formative comprehension quizzes, and structured note-taking.</p>
            </div>
            <div className={cp.specCard}>
              <div className={cp.specIcon}>
                <GoogleIcon name="stay_current_portrait" size={32} style={{ color: '#DC143C' }} />
              </div>
              <h4 className={cp.specTitle}>Responsive Player</h4>
              <p className={cp.specText}>0.5x to 2x speed adjustment, multi-language subtitle tracks (Hindi &amp; English), and mobile offline caching.</p>
            </div>
            <div className={cp.specCard}>
              <div className={cp.specIcon}>
                <GoogleIcon name="verified" size={32} style={{ color: '#DC143C' }} />
              </div>
              <h4 className={cp.specTitle}>Digital Credential</h4>
              <p className={cp.specText}>Cryptographically tamper-proof PDF certificates with public verification hashes for academic credit.</p>
            </div>
          </div>
        </div>

        {/* E-Commerce Store Teaser */}
        <div className={cp.storeSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase' }}>
                SRS Section 11 · Value Store
              </span>
              <h2 className={s.sectionTitle} style={{ marginBottom: 0, marginTop: '0.35rem' }}>Aaryaveera Merchandise &amp; Books</h2>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#6B7280' }}>
              *100% of merchandise proceeds directly fund free rural village camps.
            </div>
          </div>

          <div className={cp.storeGrid}>
            {MERCH_DATA.map((item, idx) => (
              <div key={idx} className={cp.storeCard}>
                <div className={cp.storeImg}>
                  <GoogleIcon name={item.icon} size={36} style={{ color: '#DC143C' }} />
                </div>
                <div className={cp.storeInfo}>
                  <div style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>{item.tag}</div>
                  <h4 className={cp.storeTitle}>{item.title}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                    <span className={cp.storePrice}>{item.price}</span>
                    <button style={{ padding: '0.45rem 1.15rem', background: '#DC143C', color: '#FFFFFF', border: 'none', borderRadius: 9999, minHeight: '34px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Order Kit →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── COURSE INQUIRIES & ADMISSIONS CONTACT US SECTION ── */}
        <section className={cp.contactSection} id="admissions-contact">
          <div className={cp.contactGrid}>
            {/* Left Info Column */}
            <div className={cp.contactInfoCol}>
              <span className={cp.contactEyebrow}>Academic Admissions &amp; Counsel</span>
              <h2 className={cp.contactHeading}>Have Questions About Our Programs?</h2>
              <p className={cp.contactSubtext}>
                Whether you need advice choosing the right physical combat or mental fortitude curriculum, want to inquire about custom offline workshops for schools/institutions, or have questions about cohort prerequisites, our admissions team is here to support you.
              </p>

              <div className={cp.contactHighlights}>
                <div className={cp.contactHighlightItem}>
                  <div className={cp.highlightIcon}>
                    <GoogleIcon name="call" size={20} style={{ color: '#DC143C' }} />
                  </div>
                  <div>
                    <div className={cp.highlightTitle}>Helpline &amp; WhatsApp</div>
                    <div className={cp.highlightDesc}>+91 98201 44321 · Mon–Sat, 9 AM – 7 PM IST</div>
                  </div>
                </div>

                <div className={cp.contactHighlightItem}>
                  <div className={cp.highlightIcon}>
                    <GoogleIcon name="mail" size={20} style={{ color: '#DC143C' }} />
                  </div>
                  <div>
                    <div className={cp.highlightTitle}>Admissions Email</div>
                    <div className={cp.highlightDesc}>admissions@shaktisabha.org</div>
                  </div>
                </div>

                <div className={cp.contactHighlightItem}>
                  <div className={cp.highlightIcon}>
                    <GoogleIcon name="verified_user" size={20} style={{ color: '#DC143C' }} />
                  </div>
                  <div>
                    <div className={cp.highlightTitle}>Confidential &amp; Verified</div>
                    <div className={cp.highlightDesc}>Direct guidance from certified Shakti Sabha mentors</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className={cp.contactFormCard}>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 className={cp.formCardTitle}>Course Inquiry Form</h3>
                <p className={cp.formCardSub}>Fill out your details to receive full syllabus &amp; enrollment counsel.</p>
              </div>

              {contactSuccess ? (
                <div className={cp.successBox}>
                  <GoogleIcon name="check_circle" size={40} style={{ color: '#10B981', marginBottom: '0.5rem' }} />
                  <h4 style={{ margin: '0 0 0.35rem', color: '#111827', fontSize: '1.1rem' }}>Inquiry Submitted Successfully!</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#4B5563', lineHeight: 1.5 }}>
                    Thank you. Your course inquiry has been safely logged in our admissions portal. Our mentors will reach out to you within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setContactSuccess(false)}
                    style={{
                      marginTop: '1rem',
                      padding: '0.5rem 1.25rem',
                      background: '#DC143C',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className={cp.inquiryForm}>
                  <div className={cp.formRow}>
                    <div className={cp.formGroup}>
                      <label className={cp.formLabel}>Full Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="Enter your name"
                        value={contactForm.name}
                        onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                        className={cp.formInput}
                      />
                    </div>
                    <div className={cp.formGroup}>
                      <label className={cp.formLabel}>WhatsApp / Mobile *</label>
                      <input
                        required
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={contactForm.phone}
                        onChange={e => setContactForm(f => ({ ...f, phone: e.target.value }))}
                        className={cp.formInput}
                      />
                    </div>
                  </div>

                  <div className={cp.formRow}>
                    <div className={cp.formGroup}>
                      <label className={cp.formLabel}>Email Address *</label>
                      <input
                        required
                        type="email"
                        placeholder="you@example.com"
                        value={contactForm.email}
                        onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
                        className={cp.formInput}
                      />
                    </div>
                    <div className={cp.formGroup}>
                      <label className={cp.formLabel}>City / Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Pune, Mumbai, Delhi"
                        value={contactForm.city}
                        onChange={e => setContactForm(f => ({ ...f, city: e.target.value }))}
                        className={cp.formInput}
                      />
                    </div>
                  </div>

                  <div className={cp.formGroup}>
                    <label className={cp.formLabel}>Program of Interest *</label>
                    <select
                      value={contactForm.course}
                      onChange={e => setContactForm(f => ({ ...f, course: e.target.value }))}
                      className={cp.formSelect}
                    >
                      <option value="General Admissions & Guidance">General Admissions &amp; Program Guidance</option>
                      {allCourses.map(c => (
                        <option key={c.id} value={c.title}>{c.title}</option>
                      ))}
                      <option value="Custom Institutional / School Workshop">Custom School / Corporate Workshop</option>
                    </select>
                  </div>

                  <div className={cp.formGroup}>
                    <label className={cp.formLabel}>Message or Questions (Optional)</label>
                    <textarea
                      rows={3}
                      placeholder="Ask about batch timings, fee concessions, prerequisites, or personal accommodations..."
                      value={contactForm.message}
                      onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                      className={cp.formTextarea}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingContact}
                    className={cp.formSubmitBtn}
                  >
                    {submittingContact ? 'Submitting...' : 'Send Course Inquiry →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
