import { Link } from 'react-router-dom'
import s from './Courses.module.css'

interface ServiceItem {
  icon: string
  title: string
  desc: string
  link?: string
}

const SERVICES: ServiceItem[] = [
  {
    icon: '✳',
    title: 'Self-Defence Training',
    desc: 'Foundational defensive skills, awareness practices and supervised physical training.',
    link: '/mardini',
  },
  {
    icon: '◇',
    title: 'Support & Counselling',
    desc: 'Supportive conversations and referrals to qualified professionals where needed.',
    link: '/counselling',
  },
  {
    icon: '⌘',
    title: 'Research & Publications',
    desc: 'Articles, research material and source-based public learning.',
    link: '/research',
  },
  {
    icon: '◎',
    title: 'Seminars & Forums',
    desc: 'Institutional sessions, discussions and knowledge-sharing gatherings.',
    link: '/events',
  },
  {
    icon: '♧',
    title: 'Community Outreach',
    desc: 'Grassroots participation and engagement with local communities.',
    link: '/social-work',
  },
  {
    icon: '▤',
    title: 'Learning Programmes',
    desc: 'Courses and guided learning for personal development and awareness.',
    link: '/courses',
  },
  {
    icon: '✦',
    title: 'Youth Leadership',
    desc: 'Activities that encourage responsibility, confidence and informed participation.',
    link: '/aaryaveera',
  },
  {
    icon: '↗',
    title: 'Institutional Collaboration',
    desc: 'Working with schools, colleges, organisations and community partners.',
    link: '/sahyog',
  },
]

export default function Courses() {
  return (
    <section className={s.servicesBand} id="impact">
      <div className={s.sectionHead}>
        <div>
          <div className={s.sectionLabel}>What We Do</div>
          <h2 className={s.sectionTitle}>Work that moves beyond words.</h2>
        </div>
        <p className={s.sectionIntro}>
          From training spaces to community engagement and research, the work is designed to connect knowledge with practical participation.
        </p>
      </div>

      <div className={s.serviceGrid}>
        {SERVICES.map((srv, idx) => (
          <article key={idx} className={s.service}>
            <div className={s.serviceIcon}>{srv.icon}</div>
            <div className={s.serviceBody}>
              <h3 className={s.serviceTitle}>{srv.title}</h3>
              <p className={s.serviceDesc}>{srv.desc}</p>
              {srv.link && (
                <Link to={srv.link} className={s.serviceLink}>
                  Learn more →
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
