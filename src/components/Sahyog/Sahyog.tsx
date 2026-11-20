import { Link } from 'react-router-dom'
import s from './Sahyog.module.css'

export default function Sahyog() {
  return (
    <section className={s.section} id="history">
      <div className={s.field}>
        <div className={s.fieldPhoto}>
          <img
            src="/sahog.jpg"
            alt="Shakti Sabha community collaboration"
            loading="lazy"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).src = '/socialwork/social-1.jpg'
            }}
          />
        </div>
        <div className={s.fieldCopy}>
          <div className={s.sectionLabel}>Our Story</div>
          <h2 className={s.sectionTitle}>
            Rooted in purpose.<br />
            Built through action.
          </h2>
          <p>
            Shakti Sabha&apos;s work brings together practical preparedness, emotional resilience and intellectual engagement. Its programmes create opportunities for women and young people to learn, participate and contribute within their communities.
          </p>
          <p>
            Explore the organisation&apos;s programmes, activities, articles and history through the main platform.
          </p>

          <div className={s.stats}>
            <div className={s.stat}>
              <strong>03</strong>
              <span>Core streams</span>
            </div>
            <div className={s.stat}>
              <strong>01</strong>
              <span>Shared purpose</span>
            </div>
            <div className={s.stat}>
              <strong>∞</strong>
              <span>Room to grow</span>
            </div>
          </div>

          <div className={s.actionRow}>
            <Link to="/about" className={s.storyLink}>
              Read Our Full Story →
            </Link>
            <Link to="/sahyog" className={s.collabLink}>
              Institutional Collaboration →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
