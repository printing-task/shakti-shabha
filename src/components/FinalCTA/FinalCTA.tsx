import { Link } from 'react-router-dom'
import s from './FinalCTA.module.css'

export default function FinalCTA() {
  return (
    <section className={s.quote} id="contact">
      <blockquote className={s.blockquote}>
        “Strength is not the opposite of peace.{' '}
        <em className={s.em}>It is one of the ways we protect it.</em>”
      </blockquote>
      <div className={s.btnGroup}>
        <Link to="/sahyog" className={s.buttonPrimary}>
          Start a Conversation ↗
        </Link>
        <a href="mailto:contact@shaktisabha.com" className={s.buttonGhost}>
          Email Us
        </a>
      </div>
    </section>
  )
}
