import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './PageLayout.module.css'
import ep from './EventsPage.module.css'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import { supabase } from '../lib/supabase'

gsap.registerPlugin(ScrollTrigger)

/* ── Types ────────────────────────────────────────────────────────── */
export interface EventItem {
  id: string
  title: string
  stream: 'mardini' | 'shakti-bhava' | 'shakti-varta' | 'general'
  format: 'on-ground' | 'digital'
  date: string          // ISO date string YYYY-MM-DD
  end_date?: string
  location?: string
  meeting_link?: string
  pricing?: string
  is_free: boolean
  capacity?: number
  registered_count: number
  status: 'upcoming' | 'completed' | 'cancelled'
  description?: string
  curriculum_pdf_url?: string
  theme_category?: string
  region?: string
  participant_count?: number
  published: boolean
  attribution?: string  // Organised by / Keynote / Guest Speaker / Trainer / Panelist / Participant / Collaborator
  created_at: string
}

/* ── Seed historical data ────────────────────────────────────────── */
const HISTORICAL_EVENTS: EventItem[] = [
  {
    id: 'h-001',
    title: 'National Women\'s Safety & Civilisational Sovereignty Symposium — CIDCO Navi Mumbai',
    stream: 'general',
    format: 'on-ground',
    date: '2023-01-01',
    location: 'CIDCO Exhibition Centre, Vashi, Navi Mumbai, Maharashtra',
    pricing: 'N/A',
    is_free: true,
    capacity: 6000,
    registered_count: 0,
    status: 'completed',
    theme_category: 'national-symposia',
    region: 'Maharashtra',
    participant_count: 5000,
    published: true,
    attribution: 'Keynote Speaker',
    description: 'Large-scale national forum addressing women\'s safety, civilisational discourse, and the philosophy of Kshatra-Dharma. Attended by 5,000+ citizens.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'h-002',
    title: 'Lata Mangeshkar Auditorium — Women\'s Empowerment Assembly',
    stream: 'shakti-bhava',
    format: 'on-ground',
    date: '2022-06-01',
    location: 'Lata Mangeshkar Auditorium, Nagpur, Maharashtra',
    pricing: 'N/A',
    is_free: true,
    capacity: 1200,
    registered_count: 0,
    status: 'completed',
    theme_category: 'national-symposia',
    region: 'Maharashtra',
    participant_count: 1000,
    published: true,
    attribution: 'Keynote Speaker',
    description: 'Consciousness-building assembly for women reaching 1,000+ attendees at the iconic Lata Mangeshkar Auditorium.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'h-003',
    title: 'Ratlam Mahila Sashaktikaran Sammelan',
    stream: 'general',
    format: 'on-ground',
    date: '2022-11-01',
    location: 'Ratlam, Madhya Pradesh',
    pricing: 'N/A',
    is_free: true,
    capacity: 2500,
    registered_count: 0,
    status: 'completed',
    theme_category: 'national-symposia',
    region: 'Madhya Pradesh',
    participant_count: 2000,
    published: true,
    attribution: 'Keynote Speaker',
    description: 'Major women\'s empowerment conference in Ratlam drawing 2,000+ participants from across central India.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'h-004',
    title: 'Mission Mardini Residential Self-Defense Camp — Betul (8 Hostels)',
    stream: 'mardini',
    format: 'on-ground',
    date: '2023-03-01',
    end_date: '2023-03-08',
    location: 'Betul, Madhya Pradesh',
    pricing: 'N/A',
    is_free: true,
    capacity: 1200,
    registered_count: 0,
    status: 'completed',
    theme_category: 'tactical-camps',
    region: 'Madhya Pradesh',
    participant_count: 1000,
    published: true,
    attribution: 'Trainer',
    description: '7-day intensive Mission Mardini camp conducted across 8 hostels in Betul. Lathi-Kaushal, Karate empty-hand defense, and somatic awareness training for 1,000+ students.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'h-005',
    title: 'Vidarbha 7-Day Mission Mardini Intensive Camp',
    stream: 'mardini',
    format: 'on-ground',
    date: '2023-08-01',
    end_date: '2023-08-07',
    location: 'Vidarbha Region, Maharashtra',
    pricing: 'N/A',
    is_free: true,
    capacity: 500,
    registered_count: 0,
    status: 'completed',
    theme_category: 'tactical-camps',
    region: 'Maharashtra',
    participant_count: 400,
    published: true,
    attribution: 'Trainer',
    description: '7-day immersive camp in Vidarbha combining tactical self-defense, bio-mechanical combat, and civilisational character-building.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'h-006',
    title: 'Pathrot College — Institutional Youth Awareness Programme',
    stream: 'shakti-bhava',
    format: 'on-ground',
    date: '2022-09-01',
    location: 'Pathrot, Maharashtra',
    pricing: 'N/A',
    is_free: true,
    capacity: 2500,
    registered_count: 0,
    status: 'completed',
    theme_category: 'academic-deployments',
    region: 'Maharashtra',
    participant_count: 2000,
    published: true,
    attribution: 'Guest Speaker',
    description: 'Institutional seminar on cognitive sovereignty, independent thinking, and women\'s safety at Pathrot College — 2,000+ students.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'h-007',
    title: 'Sahadev Rao Patil College — Shakti Bhava Seminar',
    stream: 'shakti-bhava',
    format: 'on-ground',
    date: '2023-02-01',
    location: 'Maharashtra',
    pricing: 'N/A',
    is_free: true,
    capacity: 600,
    registered_count: 0,
    status: 'completed',
    theme_category: 'academic-deployments',
    region: 'Maharashtra',
    participant_count: 500,
    published: true,
    attribution: 'Guest Speaker',
    description: 'Youth consciousness-building seminar reaching 500+ students. Focus on critical thinking, media literacy, and personal responsibility.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'h-008',
    title: 'St. Paul\'s Institution — Self-Defense & Safety Workshop',
    stream: 'mardini',
    format: 'on-ground',
    date: '2022-08-01',
    location: 'Maharashtra',
    pricing: 'N/A',
    is_free: true,
    capacity: 250,
    registered_count: 0,
    status: 'completed',
    theme_category: 'academic-deployments',
    region: 'Maharashtra',
    participant_count: 200,
    published: true,
    attribution: 'Trainer',
    description: 'Practical self-defense and safety awareness workshop at St. Paul\'s Institution — 200+ students.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'h-009',
    title: 'Streetva & Paurush Civil Assembly — Community Stabilisation',
    stream: 'general',
    format: 'on-ground',
    date: '2023-01-01',
    location: 'Multiple Locations — Maharashtra & Madhya Pradesh',
    pricing: 'N/A',
    is_free: true,
    registered_count: 0,
    status: 'completed',
    theme_category: 'community-assemblies',
    region: 'Maharashtra, Madhya Pradesh',
    participant_count: 10000,
    published: true,
    attribution: 'Organiser',
    description: 'Community stabilisation and civil assemblies addressing social fabric, community safety, and civilisational awareness — reaching 10,000+ citizens across multiple events.',
    created_at: new Date().toISOString(),
  },
]

const THEME_CATEGORIES: Record<string, { label: string; color: string }> = {
  'national-symposia':    { label: 'National Symposia & Policy Forums',        color: '#C9A96E' },
  'tactical-camps':       { label: 'Tactical & Somatic Camps / Mission Mardini', color: '#DC143C' },
  'academic-deployments': { label: 'Academic & Institutional Deployments',     color: '#3D8B5A' },
  'community-assemblies': { label: 'Community Stabilisation & Civil Assemblies', color: '#6B7FD4' },
}

const STREAM_LABELS: Record<string, { label: string; color: string }> = {
  mardini:      { label: 'Mission Mardini', color: '#DC143C' },
  'shakti-bhava': { label: 'Shakti Bhava',  color: '#3D5A45' },
  'shakti-varta': { label: 'Shakti Varta',  color: '#C9A96E' },
  general:      { label: 'General',         color: '#555' },
}

/* ── Load from localStorage ─────────────────────────────────────── */
function loadEvents(): EventItem[] {
  try {
    const raw = localStorage.getItem('shakti_events')
    if (raw) return JSON.parse(raw) as EventItem[]
  } catch { /* ignore */ }
  return []
}

function isFuture(dateStr: string) {
  return new Date(dateStr) >= new Date(new Date().toDateString())
}

/* ── Component ───────────────────────────────────────────────────── */
export default function EventsPage() {
  const [tab, setTab] = useState<'upcoming' | 'history'>('upcoming')
  const [events, setEvents] = useState<EventItem[]>([])
  const [catFilter, setCatFilter] = useState<string>('all')
  const [regionFilter, setRegionFilter] = useState<string>('all')
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'Events | Shakti Sabha — Upcoming & Historical Archive'
  }, [])

  useEffect(() => {
    async function fetchEvents() {
      let list: EventItem[] = []
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('category', 'Event')
          .eq('published', true)
          .order('created_at', { ascending: false })
        if (!error && data && data.length > 0) {
          list = data.map(d => {
            try { return JSON.parse(d.content_en) as EventItem } catch { return null }
          }).filter((e): e is EventItem => Boolean(e && e.published))
        }
      } catch (err) {
        console.warn('EventsPage fetch error:', err)
      }
      const local = loadEvents().filter(e => e.published)
      const idSet = new Set(list.map(e => e.id || e.title))
      local.forEach(e => {
        const key = e.id || e.title
        if (!idSet.has(key)) {
          list.push(e)
          idSet.add(key)
        }
      })
      if (list.length === 0) {
        list = [
          {
            id: 'up-001',
            title: 'Mission Mardini 3-Day Tactical Self-Defense Camp',
            stream: 'mardini',
            format: 'on-ground',
            date: '2026-11-20',
            location: 'Wardha, Maharashtra',
            pricing: '₹1,200',
            is_free: false,
            capacity: 150,
            registered_count: 85,
            status: 'upcoming',
            description: 'Intensive unarmed combat, lathi-kaushal biomechanics, and threat de-escalation for young women.',
            published: true,
            created_at: new Date().toISOString()
          },
          {
            id: 'up-002',
            title: 'Shakti Varta Seminar — The Legal Collage',
            stream: 'shakti-varta',
            format: 'digital',
            date: '2026-11-28',
            location: 'Digital Plenary (Zoom)',
            pricing: 'Free',
            is_free: true,
            capacity: 500,
            registered_count: 320,
            status: 'upcoming',
            description: 'High-level legal rights, statutory provisions under BNS/IPC, and procedural safeguards.',
            published: true,
            created_at: new Date().toISOString()
          },
          {
            id: 'up-003',
            title: 'Vedic Parenting & Dharmic Character Workshop',
            stream: 'shakti-bhava',
            format: 'on-ground',
            date: '2026-12-05',
            location: 'Nagpur, Maharashtra',
            pricing: '₹800',
            is_free: false,
            capacity: 200,
            registered_count: 140,
            status: 'upcoming',
            description: 'Somatic grounding, mental fortitude, and values-rooted upbringing for modern families.',
            published: true,
            created_at: new Date().toISOString()
          }
        ]
      }
      setEvents(list)
    }
    fetchEvents()
    window.addEventListener('storage', fetchEvents)
    window.addEventListener('shakti_events_updated', fetchEvents)
    return () => {
      window.removeEventListener('storage', fetchEvents)
      window.removeEventListener('shakti_events_updated', fetchEvents)
    }
  }, [])

  useEffect(() => {
    if (!heroRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.evHeroIn', {
        opacity: 0, y: 30, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.15,
      })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  /* Upcoming = admin events with future date */
  const upcomingEvents = events.filter(e => e.status === 'upcoming' && isFuture(e.date))

  /* History = admin events that are completed + seed historical */
  const completedAdminEvents = events.filter(e => e.status === 'completed')
  const allHistorical: EventItem[] = [
    ...completedAdminEvents,
    ...HISTORICAL_EVENTS.filter(h => !completedAdminEvents.find(ae => ae.id === h.id)),
  ]

  const uniqueRegions = Array.from(new Set(allHistorical.map(e => e.region).filter(Boolean))) as string[]

  const filteredHistorical = allHistorical
    .filter(e => catFilter === 'all' || e.theme_category === catFilter)
    .filter(e => regionFilter === 'all' || e.region?.includes(regionFilter))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const addToCalendar = (ev: EventItem) => {
    const start = ev.date.replace(/-/g, '')
    const end = (ev.end_date || ev.date).replace(/-/g, '')
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.title)}&dates=${start}/${end}&details=${encodeURIComponent(ev.description || '')}&location=${encodeURIComponent(ev.location || '')}`
    window.open(url, '_blank', 'noopener')
  }

  return (
    <div className={ep.page}>
      {/* Hero */}
      <section className={ep.hero} ref={heroRef}>
        <p className={`${ep.heroEyebrow} evHeroIn`}>Shakti Sabha</p>
        <h1 className={`${ep.heroTitle} evHeroIn`}>Events &amp; Deployments</h1>
        <p className={`${ep.heroSub} evHeroIn`}>
          Upcoming programmes, camps, and seminars — alongside a historical archive
          of documented interventions and community engagements.
        </p>
      </section>

      {/* Tabs */}
      <div className={ep.tabBar}>
        <button
          className={`${ep.tab} ${tab === 'upcoming' ? ep.tabActive : ''}`}
          onClick={() => setTab('upcoming')}
        >
          <GoogleIcon name="event" size={18} />
          Upcoming Deployments
        </button>
        <button
          className={`${ep.tab} ${tab === 'history' ? ep.tabActive : ''}`}
          onClick={() => setTab('history')}
        >
          <GoogleIcon name="history" size={18} />
          Historical Archive
        </button>
      </div>

      {/* ── TAB: UPCOMING ─────────────────────────────────────────── */}
      {tab === 'upcoming' && (
        <section className={ep.section}>
          <div className={ep.container}>
            {upcomingEvents.length === 0 ? (
              <div className={ep.empty}>
                <GoogleIcon name="calendar_today" size={48} style={{ color: 'rgba(201,169,110,0.3)', display: 'block', margin: '0 auto 1rem' }} />
                <p>No upcoming events are currently scheduled.</p>
                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                  Check back soon or follow Shakti Sabha on social media for announcements.
                </p>
              </div>
            ) : (
              <div className={ep.eventsGrid}>
                {upcomingEvents.map(ev => {
                  const stream = STREAM_LABELS[ev.stream] || STREAM_LABELS.general
                  const dateObj = new Date(ev.date)
                  return (
                    <div key={ev.id} className={ep.eventCard}>
                      <div className={ep.cardTop}>
                        <span className={ep.streamBadge} style={{ background: stream.color }}>
                          {stream.label}
                        </span>
                        <span className={ep.formatBadge}>
                          <GoogleIcon name={ev.format === 'digital' ? 'videocam' : 'place'} size={13} />
                          {ev.format === 'digital' ? 'Digital' : 'On-Ground'}
                        </span>
                      </div>
                      <div className={ep.cardDateRow}>
                        <span className={ep.cardDay}>
                          {dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                        <span className={ep.cardYear}>{dateObj.getFullYear()}</span>
                      </div>
                      <h3 className={ep.cardTitle}>{ev.title}</h3>
                      {ev.location && (
                        <p className={ep.cardMeta}>
                          <GoogleIcon name="place" size={14} />
                          {ev.location}
                        </p>
                      )}
                      {ev.description && <p className={ep.cardDesc}>{ev.description}</p>}
                      <div className={ep.cardFooter}>
                        <span className={ep.cardPrice}>
                          {ev.is_free ? 'Free' : (ev.pricing || 'TBA')}
                        </span>
                        {ev.capacity && (
                          <span className={ep.cardSeats}>
                            <GoogleIcon name="people" size={14} />
                            {Math.max(0, ev.capacity - ev.registered_count)} seats left
                          </span>
                        )}
                      </div>
                      <div className={ep.cardActions}>
                        <button className={ep.calBtn} onClick={() => addToCalendar(ev)}>
                          <GoogleIcon name="event_available" size={15} />
                          Add to Calendar
                        </button>
                        {ev.curriculum_pdf_url && (
                          <a href={ev.curriculum_pdf_url} target="_blank" rel="noopener noreferrer" className={ep.pdfBtn}>
                            <GoogleIcon name="download" size={15} />
                            Curriculum
                          </a>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── TAB: HISTORICAL ARCHIVE ───────────────────────────────── */}
      {tab === 'history' && (
        <section className={ep.section}>
          <div className={ep.container}>
            {/* Archive disclaimer & link to full Impact Taxonomy */}
            <div className={ep.archiveBanner} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flex: 1, minWidth: 280 }}>
                <GoogleIcon name="shield" size={20} style={{ color: '#C9A96E', flexShrink: 0, marginTop: 2 }} />
                <p style={{ margin: 0 }}>
                  <strong>Curatorial &amp; Verified Impact Archive:</strong> Organized across 4 intellectual verticals:
                  National Plenaries, Mission Mardini Tactical Camps, Academic Deployments, and Civic Guilds Assemblies.
                  All figures follow our anti-inflation verification policy.
                </p>
              </div>
              <Link to="/impact" className={ep.dossierBtn}>
                <span>Full Impact &amp; 3-Depth Dossier</span>
                <GoogleIcon name="arrow_forward" size={14} />
              </Link>
            </div>

            {/* Filters */}
            <div className={ep.filters}>
              <div className={ep.filterGroup}>
                <label className={ep.filterLabel}>Category</label>
                <select className={ep.filterSelect} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                  <option value="all">All Categories</option>
                  {Object.entries(THEME_CATEGORIES).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
              <div className={ep.filterGroup}>
                <label className={ep.filterLabel}>Region</label>
                <select className={ep.filterSelect} value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
                  <option value="all">All Regions</option>
                  {uniqueRegions.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <span className={ep.resultCount}>{filteredHistorical.length} records</span>
            </div>

            {/* Category legend */}
            <div className={ep.categoryLegend}>
              {Object.entries(THEME_CATEGORIES).map(([key, val]) => (
                <button
                  key={key}
                  className={`${ep.legendChip} ${catFilter === key ? ep.legendChipActive : ''}`}
                  style={{ borderColor: val.color, color: catFilter === key ? '#fff' : val.color,
                    background: catFilter === key ? val.color : 'transparent' }}
                  onClick={() => setCatFilter(catFilter === key ? 'all' : key)}
                >
                  {val.label}
                </button>
              ))}
            </div>

            {/* Historical events list */}
            <div className={ep.historyList}>
              {filteredHistorical.map(ev => {
                const cat = ev.theme_category ? THEME_CATEGORIES[ev.theme_category] : null
                const dateObj = new Date(ev.date)
                return (
                  <div key={ev.id} className={ep.historyCard}>
                    <div className={ep.historyLeft}>
                      <span className={ep.historyYear}>
                        {dateObj.getFullYear()}
                      </span>
                      {cat && (
                        <span className={ep.historyCat} style={{ color: cat.color, borderColor: cat.color }}>
                          {cat.label}
                        </span>
                      )}
                    </div>
                    <div className={ep.historyContent}>
                      <h3 className={ep.historyTitle}>{ev.title}</h3>
                      <div className={ep.historyMeta}>
                        {ev.location && (
                          <span>
                            <GoogleIcon name="place" size={13} />
                            {ev.location}
                          </span>
                        )}
                        {ev.region && (
                          <span>
                            <GoogleIcon name="map" size={13} />
                            {ev.region}
                          </span>
                        )}
                        {ev.attribution && (
                          <span>
                            <GoogleIcon name="badge" size={13} />
                            {ev.attribution}
                          </span>
                        )}
                        {ev.participant_count && (
                          <span>
                            <GoogleIcon name="people" size={13} />
                            ~{ev.participant_count.toLocaleString()}+ participants (approx.)
                          </span>
                        )}
                      </div>
                      {ev.description && <p className={ep.historyDesc}>{ev.description}</p>}
                    </div>
                  </div>
                )
              })}

              {filteredHistorical.length === 0 && (
                <div className={ep.empty}>
                  <p>No records match the selected filters.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
