import { Link } from 'react-router-dom'
import s from './About.module.css'

interface StreamItem {
  roman: string
  name: string
  subtitle: string
  desc: string
  link: string
  linkLabel: string
}

const STREAMS: StreamItem[] = [
  {
    roman: 'Ⅰ',
    name: 'Mission Mardini',
    subtitle: 'Physical & Tactical Preparedness',
    desc: 'Self-defence foundations, Lathi-Kaushal, practical awareness and training designed to build confidence and readiness.',
    link: '/mardini',
    linkLabel: 'Discover Mardini →',
  },
  {
    roman: 'Ⅱ',
    name: 'Shakti Bhava',
    subtitle: 'Consciousness & Emotional Resilience',
    desc: 'Supportive spaces, counselling pathways, awareness and trauma-informed conversations that respect individual dignity.',
    link: '/counselling',
    linkLabel: 'Discover Bhava →',
  },
  {
    roman: 'Ⅲ',
    name: 'Shakti Varta',
    subtitle: 'Research, Dialogue & Critical Inquiry',
    desc: 'Research, seminars, reading and dialogue that encourage independent thought and careful examination of sources.',
    link: '/research',
    linkLabel: 'Discover Varta →',
  },
]

export default function About() {
  return (
    <section className={s.section} id="streams">
      <div className={s.sectionHead}>
        <div>
          <div className={s.sectionLabel}>The Union of Peace &amp; Revolution</div>
          <h2 className={s.sectionTitle}>Three streams. One shared purpose.</h2>
        </div>
        <p className={s.sectionIntro}>
          Each stream has a distinct role. Together, they connect personal safety, emotional strength and the freedom to think, learn and participate.
        </p>
      </div>

      <div className={s.streams}>
        {STREAMS.map((st) => (
          <article key={st.roman} className={s.stream}>
            <div className={s.streamIcon}>{st.roman}</div>
            <div className={s.streamBody}>
              <h3 className={s.streamTitle}>{st.name}</h3>
              <div className={s.subtitle}>{st.subtitle}</div>
              <p className={s.streamText}>{st.desc}</p>
              <Link to={st.link} className={s.streamLink}>
                {st.linkLabel}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
