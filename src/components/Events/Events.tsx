import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { supabase } from '../../lib/supabase'
import s from './Events.module.css'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_EVENTS: { day: string; month: string; name: string; meta: string; badge: string }[] = []

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
        {eventsList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E5E7EB', color: '#6B7280' }}>
            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>Upcoming Cohorts &amp; Field Deployments</p>
            <p style={{ fontSize: '0.85rem', color: '#6B7280', maxWidth: '520px', margin: '0 auto 1.25rem' }}>
              Institutional training camps, seminars, and assemblies are scheduled through direct partnerships and field drives. Follow Shakti Sabha or reach out via Collaboration.
            </p>
            <Link to="/sahyog" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#DC143C', textDecoration: 'none' }}>
              Invite / Partner With Us →
            </Link>
          </div>
        ) : (
          eventsList.map(ev => (
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
          ))
        )}
      </div>
    </section>
  )
}
