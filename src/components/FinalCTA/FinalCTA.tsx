import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import s from './FinalCTA.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-cta="box"]', {
        opacity: 0,
        y: 36,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="final-cta" className={s.section}>
      <div className={s.container}>
        <div data-cta="box" className={s.ctaBox}>
          {/* Sanskrit Epigraph */}
          <div className={s.sanskritMantra}>
            “अनुभवात् ज्ञानम्, ज्ञानात् क्रिया”
          </div>

          <span className={s.eyebrow}>
            WHERE FIELD EXPERIENCE BECOMES KNOWLEDGE, AND KNOWLEDGE INFORMS ACTION
          </span>

          <h2 className={s.heading}>
            Advance Sovereign Knowledge &amp; <span className={s.serifItalic}>Field Deterrence</span>
          </h2>

          <p className={s.paragraph}>
            Whether you are an academic researcher, legal practitioner, university faculty, or community coordinator,
            there is urgent work to be done. Join Shakti Sabha in building an unyielding institutional model of dignity,
            truth, and civilizational sovereignty.
          </p>

          <div className={s.pipelineRow}>
            <span>Ground Work</span>
            <span className={s.pipelineArrow}>→</span>
            <span>Study</span>
            <span className={s.pipelineArrow}>→</span>
            <span>Knowledge</span>
            <span className={s.pipelineArrow}>→</span>
            <span>Dialogue</span>
            <span className={s.pipelineArrow}>→</span>
            <span className={s.pipelineAction}>Action</span>
          </div>

          {/* 2 User Requested Buttons: Read Our Research | Collaborate With Us */}
          <div className={s.btnRow}>
            <Link to="/research" className={s.primaryBtn}>
              <GoogleIcon name="menu_book" size={17} />
              <span>Read Our Research</span>
              <GoogleIcon name="arrow_forward" size={14} />
            </Link>

            <Link to="/sahyog" className={s.secondaryBtn}>
              <GoogleIcon name="handshake" size={17} />
              <span>Collaborate With Us</span>
              <GoogleIcon name="arrow_forward" size={14} />
            </Link>
          </div>

          {/* Quick Institutional Inquiries Footer */}
          <div className={s.footerInfo}>
            <div className={s.infoItem}>
              <GoogleIcon name="mail" size={14} className={s.infoIcon} />
              <span>Academic Inquiries: contact@shaktisabha.org</span>
            </div>
            <div className={s.infoItem}>
              <GoogleIcon name="location_on" size={14} className={s.infoIcon} />
              <span>Headquarters: Nagpur, Maharashtra, Bharat</span>
            </div>
            <div className={s.infoItem}>
              <GoogleIcon name="lock" size={14} className={s.infoIcon} />
              <span>Confidential Crisis Line Available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
