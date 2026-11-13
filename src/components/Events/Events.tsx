import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { supabase } from '../../lib/supabase'
import s from './Events.module.css'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_EVENTS = [
  { day:'14', month:'Nov 2026', name:'Mission Mardini 3-Day Self-Defense Camp', meta:'Wardha, Maharashtra · Limited seats · ₹1,200', badge:'Camp' },
  { day:'22', month:'Nov 2026', name:'Shakti Varta Seminar — The Legal Collage', meta:'Online · IPC & BNS Analysis · Free for members', badge:'Webinar' },
  { day:'05', month:'Dec 2026', name:'Vedic Parenting in Modern India Workshop', meta:'Nagpur · Full-day session · ₹800', badge:'Workshop' },
  { day:'18', month:'Dec 2026', name:'Sponsor a Village Camp — CSR Drive', meta:'Multiple locations · Corporate & NGO collaboration', badge:'CSR' },
  { day:'08', month:'Jan 2027', name:'Kshatra-Dharma 7-Day Leadership Retreat', meta:'Pune Outskirts · Residential · ₹4,500', badge:'Retreat' },
]

const mapEventToCard = (ev: any) => {
  const d = new Date(ev.date)
  const day = !isNaN(d.getDate()) ? String(d.getDate()).padStart(2, '0') : '15'
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = !isNaN(d.getMonth()) ? `${monthNames[d.getMonth()]} ${d.getFullYear()}` : 'Upcoming'
  const meta = [ev.location, ev.pricing ? (ev.pricing.startsWith('₹') ? ev.pricing : `₹${ev.pricing}`) : (ev.is_free ? 'Free' : '')].filter(Boolean).join(' · ')
  const badge = ev.stream === 'mardini' ? 'Camp' : (ev.format === 'digital' ? 'Webinar' : (ev.badge || 'Workshop'))

  return {
    day,
    month,
    name: ev.title,
    meta: meta || 'Multiple locations · Shakti Sabha Initiative',
    badge
  }
}

export default function Events() {
  const secRef = useRef<HTMLElement>(null)
  const [eventsList, setEventsList] = useState(DEFAULT_EVENTS)

  useEffect(() => {
    let isMounted = true

    async function loadEvents() {
      let list: any[] = []

      // 1. Fetch from Supabase articles table (category = 'Event')
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('category', 'Event')
          .eq('published', true)
          .order('created_at', { ascending: false })

        if (!error && data && data.length > 0) {
          list = data.map(d => {
            try { return JSON.parse(d.content_en) } catch { return null }
          }).filter(Boolean)
        }
      } catch (e) {
        console.warn('Events fetch error:', e)
      }

      // 2. Fetch from LocalStorage shakti_events
      try {
        const raw = localStorage.getItem('shakti_events')
        if (raw) {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) {
            const published = parsed.filter((e: any) => e.published !== false)
            const idSet = new Set(list.map((e: any) => e.id || e.title))
            published.forEach((e: any) => {
              const key = e.id || e.title
              if (!idSet.has(key)) {
                list.push(e)
                idSet.add(key)
              }
            })
          }
        }
      } catch (e) {
        console.warn('LocalStorage events error:', e)
      }

      if (isMounted) {
        if (list.length > 0) {
          setEventsList(list.map(mapEventToCard))
        } else {
          setEventsList(DEFAULT_EVENTS)
        }
        setTimeout(() => {
          ScrollTrigger.refresh()
        }, 150)
      }
    }

    loadEvents()
    window.addEventListener('storage', loadEvents)
    window.addEventListener('shakti_events_updated', loadEvents)

    return () => {
      isMounted = false
      window.removeEventListener('storage', loadEvents)
      window.removeEventListener('shakti_events_updated', loadEvents)
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-ev="item"]', {
        opacity: 0, y: 24, rotateX: 4, stagger: 0.08, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: secRef.current, start: 'top 75%' }
      })
    }, secRef)
    return () => ctx.revert()
  }, [eventsList])

  return (
    <section ref={secRef} className={s.section}>
      <div className={s.header}>
        <h2>Upcoming Events</h2>
        <Link to="/events" className="btn-magnetic btn-ghost">All Events →</Link>
      </div>
      <div className={s.list}>
        {eventsList.map(ev => (
          <div key={ev.name} data-ev="item" className={s.item}>
            <div className={s.dateBlock}>
              <div className={s.day}>{ev.day}</div>
              <div className={s.month}>{ev.month}</div>
            </div>
            <div className={s.info}>
              <div className={s.name}>{ev.name}</div>
              <div className={s.meta}>{ev.meta}</div>
            </div>
            <span className={s.badge}>{ev.badge}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
