import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './About.module.css'

const PILLARS = [
  { 
    num: '01', 
    tag: 'Revolution', 
    tagColor: '#DC143C', 
    tagBg: 'rgba(220, 20, 60, 0.08)',
    accent: '#DC143C', 
    name: 'Mardini', 
    dev: 'मर्दिनी', 
    text: 'Self-defense. Lathi-Kaushal. Sword training. Village camps across Maharashtra and beyond. The revolution that begins in the body and spreads to the spirit.', 
    link: '/mardini', 
    linkLabel: 'Explore Mission Mardini' 
  },
  { 
    num: '02', 
    tag: 'Healing',    
    tagColor: '#166534', 
    tagBg: 'rgba(22, 101, 52, 0.08)',
    accent: '#166534', 
    name: 'Shakti Bhava', 
    dev: 'शक्ति भव', 
    text: 'Counseling. Anonymized case studies. Breaking silence on trafficking, PTSD, puberty, and depression. The space where survivors become warriors.', 
    link: '/shakti-bhava', 
    linkLabel: 'Explore Shakti Bhava' 
  },
  { 
    num: '03', 
    tag: 'Discourse',  
    tagColor: '#4338CA', 
    tagBg: 'rgba(67, 56, 202, 0.08)',
    accent: '#4338CA', 
    name: 'Shakti Varta', 
    dev: 'शक्ति वार्ता', 
    text: 'White papers. Research. Podcasts. Seminars. The intellectual engine that backs the revolution with verified knowledge and historical truth.', 
    link: '/shakti-varta', 
    linkLabel: 'Explore Shakti Varta' 
  },
]

export default function About() {
  const navigate = useNavigate()
  const secRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-ab="header"]', {
        opacity: 0, 
        y: 24, 
        duration: 0.7, 
        ease: 'power3.out',
        clearProps: 'transform,opacity', scrollTrigger: { trigger: secRef.current, start: 'top 80%', toggleActions: 'play none none none' }
      })
      gsap.from('[data-ab="pillar"]', {
        opacity: 0, 
        y: 32, 
        stagger: 0.14, 
        duration: 0.7, 
        ease: 'power3.out',
        clearProps: 'transform,opacity', scrollTrigger: { trigger: secRef.current, start: 'top 80%', toggleActions: 'play none none none' }
      })
    }, secRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className={s.section}>
      <div className={s.inner}>
        <div data-ab="header" className={s.header}>
          <div className={s.headerTopRow}>
            <span className={s.eyebrow}>Our Three Streams</span>
            <Link to="/three-streams" className={s.dedicatedPillLink}>
              <span>Explore Dedicated Page</span>
              <GoogleIcon name="arrow_forward" size={13} />
            </Link>
          </div>
          <h2>
            <Link to="/three-streams" className={s.headerTitleLink} title="Explore The Union of Peace & Revolution">
            The Union of Peace &amp; Revolution
            </Link>
          </h2>
          <p>
          Everything Shakti Sabha builds lives within one of three streams — each distinct in method, unified in purpose: dignity, safety, and awakening for every woman who stands with us.{' '}
            <Link to="/three-streams" className={s.inlineLearnMore}>
            View Tri-Stream Doctrine →
            </Link>
          </p>
        </div>
        <div data-ab="pillars" className={s.pillars}>
          {PILLARS.map(p => (
            <Link
              key={p.num}
              to={p.link}
              data-ab="pillar"
              className={s.pillar}
              style={{ '--pl-accent': p.accent, '--pl-tag-bg': p.tagBg } as React.CSSProperties}
            >
              <span className={s.accent} style={{ background: p.accent }} />
              <div className={s.pillarHead}>
                <span 
                  className={s.pillarTag} 
                  style={{ 
                    color: p.tagColor,
                    background: p.tagBg,
                    border: `1px solid ${p.tagColor}33`
                  }}
                >
                  {p.tag}
                </span>
              </div>
              <div className={s.pillarName}>{p.name}</div>
              <div className={s.pillarDev}>{p.dev}</div>
              <p className={s.pillarText}>{p.text}</p>
              <span className={s.pillarLink}>
                {p.linkLabel} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
