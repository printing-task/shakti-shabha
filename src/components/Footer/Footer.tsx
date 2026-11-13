import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import s from './Footer.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const year = new Date().getFullYear()
  const footerRef = useRef<HTMLElement>(null)
  const location = useLocation()

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setTimeout(() => setSubscribed(false), 4000)
      setEmail('')
    }
  }

  useEffect(() => {
    if (!footerRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-ft="col"]',
        { opacity: 0.88, y: 15 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 95%',
            toggleActions: 'play none none none'
          }
        }
      )
    }, footerRef)
    return () => ctx.revert()
  }, [location.pathname])

  if (location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname === '/register') {
    return null
  }

  return (
    <footer ref={footerRef} className={s.footer}>
      <div className={s.grid}>
        {/* Brand & Mission Column */}
        <div data-ft="col" className={s.brand}>
          <div className={s.logoName}>Shakti Sabha</div>
          <div className={s.logoHindi}>शक्ति सभा</div>
          <p className={s.tagline}>
            An institutional digital platform dedicated to physical sovereignty, tactical preparedness, and trauma-informed psychological resilience for Indian women. Ancient civilizational roots. Uncompromising modern strength.
          </p>

          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <a href="https://youtube.com/@aaryaveeraa?si=" target="_blank" rel="noopener noreferrer" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.85rem' }} title="YouTube (@aaryaveeraa)">
              <GoogleIcon name="smart_display" size={17} />
            </a>
            <a href="https://www.instagram.com/shaktisabha?exln=MWhtaWwwZDZmamI5" target="_blank" rel="noopener noreferrer" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.85rem' }} title="Instagram (@shaktisabha)">
              <GoogleIcon name="photo_camera" size={17} />
            </a>
            <a href="https://www.facebook.com/share/1CbJnBXKHQ/" target="_blank" rel="noopener noreferrer" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.85rem' }} title="Facebook (Shakti Sabha)">
              <GoogleIcon name="groups" size={17} />
            </a>
            <a href="https://x.com/TheAaryaveera?s=20" target="_blank" rel="noopener noreferrer" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.85rem' }} title="Twitter / X (@TheAaryaveera)">
              <GoogleIcon name="tag" size={17} />
            </a>
            <a href="https://pin.it/5DFgIhdKj" target="_blank" rel="noopener noreferrer" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.85rem' }} title="Pinterest (Aaryaveera / Shakti Sabha)">
              <GoogleIcon name="push_pin" size={17} />
            </a>
            <a href="https://www.aaryaveera.com" target="_blank" rel="noopener noreferrer" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.85rem' }} title="Website (aaryaveera.com)">
              <GoogleIcon name="language" size={17} />
            </a>
            <a href="mailto:contact@shaktisabha.com" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.85rem' }} title="Email">
              <GoogleIcon name="mail" size={17} />
            </a>
          </div>

          <div className={s.badge} style={{ marginTop: '1.25rem' }}>FCRA Compliant · Domestic Only</div>
        </div>

        {/* Explore Links */}
        <div data-ft="col" className={s.col}>
          <div className={s.colTitle}>The Three Wings</div>
          <ul className={s.links}>
            <li><Link to="/three-streams" className={s.link} style={{ color: '#FDE047', fontWeight: 600 }}>The Union of Peace &amp; Revolution</Link></li>
            <li><Link to="/mardini" className={s.link} style={{ color: '#FFB3BA' }}>01 · Mission Mardini (Combat)</Link></li>
            <li><Link to="/shakti-bhava" className={s.link} style={{ color: '#A7F3D0' }}>02 · Shakti Bhava (Healing)</Link></li>
            <li><Link to="/shakti-varta" className={s.link} style={{ color: '#C7D2FE' }}>03 · Shakti Varta (Discourse)</Link></li>
            <li><Link to="/articles" className={s.link}>Latest Articles</Link></li>
            <li><Link to="/history" className={s.link}>Veeranganas</Link></li>
            <li><Link to="/counselling" className={s.link}>Mental Health &amp; Counselling</Link></li>
            <li><Link to="/research" className={s.link}>Indian History &amp; Thought-Lab</Link></li>
            <li><Link to="/gallery" className={s.link}>3D Media Vault</Link></li>
          </ul>
        </div>

        {/* Platform Links */}
        <div data-ft="col" className={s.col}>
          <div className={s.colTitle}>Platform</div>
          <ul className={s.links}>
            <li><Link to="/about" className={s.link}>About Us</Link></li>
            <li><Link to="/aaryaveera" className={s.link}>Aaryaveera (Foundational Worldview)</Link></li>
            <li><Link to="/counselling" className={s.link}>Counselling Services</Link></li>
            <li><Link to="/sahyog" className={s.link}>Community Ecosystem</Link></li>
            <li><Link to="/courses" className={s.link}>Institutional Programs &amp; Cohorts</Link></li>
            <li><Link to="/events" className={s.link}>Events &amp; Camps</Link></li>
            <li><Link to="/brand" className={s.link}>Brand Identity</Link></li>
            <li><span className={s.infoLine}>Privacy Policy &amp; Terms of Service</span></li>
          </ul>
        </div>

        {/* Shakti Dispatch Newsletter */}
        <div data-ft="col" className={s.col}>
          <div className={s.colTitle}>The Shakti Dispatch</div>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.68)', lineHeight: 1.6, marginBottom: '0.85rem' }}>
            Curated weekly dispatches — frontline ground reports, unrecorded civilizational heroines, and trauma-informed psychological research directly to your inbox.
          </p>

          {subscribed ? (
            <div style={{ padding: '0.75rem', background: 'rgba(220,20,60,0.15)', border: '1px solid #DC143C', borderRadius: '8px', color: '#FFB3BA', fontSize: '0.8rem' }}>
              ✓ Subscription confirmed. Welcome to the Shakti Sabha network.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your institutional or personal email..."
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.65rem',
                  background: '#DC143C',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                Subscribe to Dispatch →
              </button>
            </form>
          )}

          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem', lineHeight: 1.4 }}>
            ✦ Complimentary publication. Unsubscribe anytime. Zero-spam commitment.
          </div>
        </div>
      </div>

      <div className={s.bottom}>
        <span className={s.copy}>© {year} Shakti Sabha. All rights reserved.</span>
        <span className={s.copy}>7 years of on-ground impact (starting from 2019) — Maharashtra &amp; beyond.</span>
        <span className={s.copy} style={{ color: '#E8C98A', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <GoogleIcon name="swords" size={16} /> MADE IN BHARAT
        </span>
      </div>
    </footer>
  )
}
