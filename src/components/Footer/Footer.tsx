import { Link, useLocation } from 'react-router-dom'
import s from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()
  const location = useLocation()

  if (
    location.pathname.startsWith('/admin') ||
    location.pathname === '/login' ||
    location.pathname === '/register'
  ) {
    return null
  }

  return (
    <footer className={s.footer}>
      <div>
        <div className={s.footerBrand}>SHAKTI SABHA</div>
        <div className={s.footerNote}>Union of Peace &amp; Revolution</div>
      </div>

      <div className={s.footerLinks}>
        <Link to="/">Home</Link>
        <Link to="/three-streams">Our Streams</Link>
        <Link to="/courses">Our Work</Link>
        <Link to="/about">Our Story</Link>
        <Link to="/social-work">Field Practice</Link>
        <Link to="/articles">Articles</Link>
        <Link to="/sahyog">Connect</Link>
        <a
          href="https://github.com/printing-task/shakti-shabha"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>

      <div className={s.footerCopy}>
        © {year} Shakti Sabha · All rights reserved
      </div>
    </footer>
  )
}
