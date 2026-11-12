import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import s from './Navigation.module.css'

interface NavLinkItem {
  label: string
  to: string
}

interface DropdownItem {
  label: string
  to: string
  icon: string
  desc: string
}

const PRIMARY_LINKS_BEFORE: NavLinkItem[] = [
  { label: 'Articles', to: '/articles' },
  { label: 'About', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Aaryaveera', to: '/aaryaveera' },
]

const WHAT_WE_DO_ITEMS: DropdownItem[] = [
  { label: 'Courses', to: '/courses', icon: 'school', desc: 'Institutional Programs & Cohorts' },
  { label: 'Events', to: '/events', icon: 'event', desc: 'Field Assemblies & Symposia' },
  { label: 'Impact', to: '/impact', icon: 'verified', desc: 'Ground Metrics & Audits' },
  { label: 'Social Work', to: '/social-work', icon: 'diversity_1', desc: 'Frontline Grassroots Action' },
  { label: 'Counselling', to: '/counselling', icon: 'psychology', desc: 'Holistic Mental Health & Healing' },
]

const PRIMARY_LINKS_AFTER: NavLinkItem[] = [
  { label: 'Collaboration', to: '/sahyog' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState(true)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const logoImgRef = useRef<HTMLImageElement>(null)
  const logoMainRef = useRef<HTMLSpanElement>(null)
  const logoDevRef = useRef<HTMLSpanElement>(null)
  const location = useLocation()

  const isWhatWeDoActive = WHAT_WE_DO_ITEMS.some(
    item => location.pathname === item.to || location.pathname.startsWith(item.to + '/')
  )

  // Scroll state
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setOpen(false)
    setDropdownOpen(false)
  }, [location.pathname])

  // Click outside to close desktop dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Desktop dropdown hover handlers with smooth delay
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false)
    }, 180)
  }

  // Logo intro animation: flip -> writing reveal -> subtext fade
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    if (logoImgRef.current) {
      tl.fromTo(
        logoImgRef.current,
        { rotateY: -90, scale: 0.8, opacity: 0 },
        { rotateY: 0, scale: 1, opacity: 1, duration: 0.8 }
      )
    }

    if (logoMainRef.current) {
      tl.fromTo(
        logoMainRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power2.inOut' },
        '-=0.2'
      )
    }

    if (logoDevRef.current) {
      tl.fromTo(
        logoDevRef.current,
        { opacity: 0, y: 4 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
        '-=0.35'
      )
    }
  }, [])

  if (location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname === '/register') {
    return null
  }

  return (
    <nav className={`${s.nav} ${scrolled ? s.navScrolled : ''}`}>
      {/* ---------- logo: flip image + writing text ---------- */}
      <Link to="/" className={s.logo} aria-label="Shakti Sabha home">
        <img
          ref={logoImgRef}
          src="/logo.jpeg"
          alt="Shakti Sabha logo"
          className={s.logoImg}
        />
        <div className={s.logoText}>
          <span ref={logoMainRef} className={s.logoMain}>Shakti Sabha</span>
          <span ref={logoDevRef} className={s.logoDev}>शक्ति सभा</span>
        </div>
      </Link>

      {/* ---------- DESKTOP NAVIGATION (Visible on screens > 900px) ---------- */}
      <div className={s.desktopLinksBox}>
        <div className={s.desktopLinks}>
          {PRIMARY_LINKS_BEFORE.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `${s.link} ${isActive ? s.linkActive : ''}`}
            >
              {l.label}
            </NavLink>
          ))}

          {/* "What We Do" Dropdown Trigger & Floating Panel */}
          <div
            ref={dropdownRef}
            className={s.dropdownWrap}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={`${s.dropdownTrigger} ${isWhatWeDoActive ? s.linkActive : ''} ${dropdownOpen ? s.dropdownTriggerOpen : ''}`}
              onClick={() => setDropdownOpen(o => !o)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <span>What We Do</span>
              <span className={`${s.chevron} ${dropdownOpen ? s.chevronOpen : ''}`}>▾</span>
            </button>

            <div className={`${s.dropdownMenu} ${dropdownOpen ? s.dropdownMenuOpen : ''}`}>
              <div className={s.dropdownHeader}>Our Programs &amp; Initiatives</div>
              {WHAT_WE_DO_ITEMS.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `${s.dropdownItem} ${isActive ? s.dropdownItemActive : ''}`}
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className={s.dropdownItemIcon}>
                    <GoogleIcon name={item.icon} size={17} />
                  </div>
                  <div className={s.dropdownItemText}>
                    <span className={s.dropdownItemTitle}>{item.label}</span>
                    <span className={s.dropdownItemDesc}>{item.desc}</span>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>

          {PRIMARY_LINKS_AFTER.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `${s.link} ${isActive ? s.linkActive : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* ---------- DESKTOP ACTIONS ---------- */}
      <div className={s.navActions}>
        <LanguageSwitcher className={s.navLangDesktop} />
      </div>

      {/* ---------- MOBILE HAMBURGER BUTTON ---------- */}
      <button
        className={`${s.hamburger} ${open ? s.hamburgerOpen : ''}`}
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span className={s.bar} /><span className={s.bar} /><span className={s.bar} />
      </button>

      {/* ---------- MOBILE DRAWER (Dedicated separate layout for <= 900px) ---------- */}
      <div className={`${s.mobileDrawer} ${open ? s.mobileDrawerOpen : ''}`}>
        <div className={s.mobileDrawerContent}>
          {PRIMARY_LINKS_BEFORE.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `${s.mobileLink} ${isActive ? s.mobileLinkActive : ''}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}

          {/* Mobile Accordion for "What We Do" */}
          <div className={s.mobileAccordion}>
            <button
              type="button"
              className={`${s.mobileAccordionHeader} ${isWhatWeDoActive ? s.mobileLinkActive : ''}`}
              onClick={() => setMobileAccordionOpen(o => !o)}
            >
              <span>What We Do</span>
              <span className={`${s.chevron} ${mobileAccordionOpen ? s.chevronOpen : ''}`}>▾</span>
            </button>

            {mobileAccordionOpen && (
              <div className={s.mobileSubList}>
                {WHAT_WE_DO_ITEMS.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `${s.mobileSubLink} ${isActive ? s.mobileSubLinkActive : ''}`}
                    onClick={() => setOpen(false)}
                  >
                    <GoogleIcon name={item.icon} size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {PRIMARY_LINKS_AFTER.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `${s.mobileLink} ${isActive ? s.mobileLinkActive : ''}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}

          <div className={s.mobileLangWrapper}>
            <span className={s.mobileLangLabel}>Language / भाषा</span>
            <LanguageSwitcher className={s.navLangMobile} />
          </div>
        </div>
      </div>
    </nav>
  )
}
