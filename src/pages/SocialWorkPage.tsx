import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import s from './PageLayout.module.css'
import sw from './SocialWorkPage.module.css'
import SocialWorkHero from '../components/SocialWorkHero/SocialWorkHero'

gsap.registerPlugin(ScrollTrigger)

/* ------------------------------------------------------------------ */
/* Data                                                                  */
/* ------------------------------------------------------------------ */

const STATS: { count: string; num: number; suffix: string; label: string }[] = [
  { count: '2,000+', num: 2000, suffix: '+', label: 'Girls Weaponized (CQC & Tactical Defense)' },
  { count: '25,000+', num: 25000, suffix: '+', label: 'Youth Awakened across 500+ Seminars' },
  { count: '13', num: 13, suffix: '', label: 'Minors Rescued from Trafficking Networks' },
  { count: '250+', num: 250, suffix: '+', label: 'Crisis & Exploitation Cases Handled' },
]

const REGIONS = [
  { icon: 'holiday_village', name: 'Nagpur Division', stat: '45 camps' },
  { icon: 'grass', name: 'Amravati Division', stat: '38 camps' },
  { icon: 'account_balance', name: 'Aurangabad Division', stat: '29 camps' },
  { icon: 'location_city', name: 'Pune Region', stat: '22 camps' },
  { icon: 'water', name: 'Mumbai Region', stat: '18 camps' },
  { icon: 'nature_people', name: 'Vidarbha & Tribal Areas', stat: '54 camps' },
]

const PILLARS = [
  {
    id: 'mardini',
    icon: 'swords',
    title: 'Mission MARDINI',
    subtitle: 'Physical Sovereignty & Tactical Defense',
    desc: 'Battle-tested combat framework blending traditional Indian martial arts (Lathi-Kaushal, Sword) with modern Close-Quarter Combat (CQC). Trained 2,000+ girls with 7-10 day residential camps.',
    accent: '#DC143C',
    bg: 'rgba(220,20,60,0.06)',
    border: 'rgba(220,20,60,0.25)',
  },
  {
    id: 'bhava',
    icon: 'spa',
    title: 'Shakti Bhava',
    subtitle: 'Healing Circles & Crisis Interventions',
    desc: 'Non-verbal behavioral profiling, somatic PTSD stabilization, and safe shelter reintegration. 13 minors tactically rescued from trafficking; 250+ grooming cases neutralized.',
    accent: '#3D5A45',
    bg: 'rgba(61,90,69,0.06)',
    border: 'rgba(61,90,69,0.25)',
  },
  {
    id: 'varta',
    icon: 'menu_book',
    title: 'Shakti Varta',
    subtitle: 'Intellectual Discourse & Research',
    desc: 'Convened 500+ keynotes, symposiums, and institutional seminars reaching 25,000+ students. Shakti Varta Fellowship connecting youth to foundational Vedic texts and forgotten heroines.',
    accent: '#C9A96E',
    bg: 'rgba(201,169,110,0.06)',
    border: 'rgba(201,169,110,0.3)',
  },
]

const MEDIA = [
  { seed: 'camp1', tag: 'LATHI-KAUSHAL', caption: 'Tactical Lathi-Kaushal perimeter defense camp, Nagpur' },
  { seed: 'camp2', tag: 'SWORD COMBAT', caption: 'Traditional sword parries and dual-strike drills, Wardha' },
  { seed: 'camp3', tag: 'SELF-DEFENSE', caption: 'High-impact empty-hand CQC workshop for college girls, Amravati' },
  { seed: 'camp4', tag: 'SEMINAR', caption: 'Shakti Varta consciousness discourse reaching 800+ youth, Pune' },
  { seed: 'camp5', tag: 'SURVIVOR CIRCLE', caption: 'Shakti Bhava confidential trauma release circle, Yavatmal' },
  { seed: 'camp6', tag: 'CAMP', caption: '7-Day Mission Mardini residential warrior convocation 2024' },
]

const REPORTS = [
  { title: 'Vidarbha Camp Report 2024', pages: 28, year: '2024', size: '2.4 MB' },
  { title: 'Maharashtra Schools Programme 2023', pages: 45, year: '2023', size: '3.8 MB' },
  { title: 'Survivor Support Circle Annual Report 2022', pages: 32, year: '2022', size: '1.9 MB' },
]

/* ------------------------------------------------------------------ */
/* Component                                                             */
/* ------------------------------------------------------------------ */

export default function SocialWorkPage() {
  const statRefs = useRef<(HTMLDivElement | null)[]>([])
  const regionRef = useRef<HTMLDivElement>(null)
  const pillarsRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const reportsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Animated stat counters */
      statRefs.current.forEach((el, i) => {
        if (!el) return
        const numEl = el.querySelector('[data-count]') as HTMLElement | null
        if (!numEl) return
        const target = STATS[i].num
        const suffix = STATS[i].suffix
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            const obj = { val: 0 }
            gsap.to(obj, {
              val: target,
              duration: 1.8,
              ease: 'power2.out',
              onUpdate: () => {
                numEl.textContent = Math.round(obj.val).toLocaleString() + suffix
              },
            })
          },
        })
      })

      /* Region cards stagger */
      if (regionRef.current) {
        gsap.from(regionRef.current.querySelectorAll('[data-region]'), {
          scrollTrigger: { trigger: regionRef.current, start: 'top 80%' },
          opacity: 0,
          y: 30,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
        })
      }

      /* Pillar cards */
      if (pillarsRef.current) {
        gsap.from(pillarsRef.current.querySelectorAll('[data-pillar]'), {
          scrollTrigger: { trigger: pillarsRef.current, start: 'top 80%' },
          opacity: 0,
          x: -30,
          stagger: 0.15,
          duration: 0.7,
          ease: 'power2.out',
        })
      }

      /* Media grid */
      if (mediaRef.current) {
        gsap.from(mediaRef.current.querySelectorAll('[data-media]'), {
          scrollTrigger: { trigger: mediaRef.current, start: 'top 80%' },
          opacity: 0,
          scale: 0.92,
          stagger: 0.1,
          duration: 0.6,
          ease: 'back.out(1.2)',
        })
      }

      /* Reports */
      if (reportsRef.current) {
        gsap.from(reportsRef.current.querySelectorAll('[data-report]'), {
          scrollTrigger: { trigger: reportsRef.current, start: 'top 82%' },
          opacity: 0,
          y: 24,
          stagger: 0.12,
          duration: 0.55,
          ease: 'power2.out',
        })
      }

      /* CTA banner */
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' },
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power3.out',
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <main className={s.page}>
      {/* ── 1. Top Standard Hero Banner ─────────────────────────── */}
      <div className={sw.hero}>
        <div className={sw.heroInner}>
          <span className={sw.badge}>SRS Section 8 · Grassroots Impact</span>
          <h1 className={sw.title}>Social Work & Ground Action</h1>
          <p className={sw.hindiSubtitle}>कार्यक्रम और सामाजिक कार्य · Together On Ground</p>
          <p className={sw.desc}>
            From high-risk frontline rescues and anti-trafficking extractions to rural self-defense camps, tribal outreach, and psychological rehabilitation across Maharashtra.
          </p>
        </div>
      </div>

      {/* ── 2. Three Programme Pillars ──────────────────────────── */}
      <section className={sw.pillarsSection}>
        <div className={sw.sectionInner}>
          <h2 className={sw.sectionTitle}>Three Programme Pillars</h2>
          <p className={sw.sectionSubtitle}>
            A triad of action — tactical combat, psychological rehabilitation, and civilizational deconstruction.
          </p>
          <div className={sw.pillarsGrid} ref={pillarsRef}>
            {PILLARS.map((p) => (
              <div
                key={p.id}
                className={sw.pillarCard}
                data-pillar
                style={{
                  background: p.bg,
                  borderColor: p.border,
                  '--pillar-accent': p.accent,
                } as React.CSSProperties}
              >
                <div className={sw.pillarIcon}>
                  <GoogleIcon name={p.icon} size={32} style={{ color: p.accent }} />
                </div>
                <div className={sw.pillarAccentBar} style={{ background: p.accent }} />
                <h3 className={sw.pillarTitle} style={{ color: p.accent }}>{p.title}</h3>
                <div className={sw.pillarSubtitle}>{p.subtitle}</div>
                <p className={sw.pillarDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Our Geographic Reach ─────────────────────────────── */}
      <section className={sw.reachSection}>
        <div className={sw.sectionInner}>
          <h2 className={sw.sectionTitle}>Our Geographic Reach</h2>
          <p className={sw.sectionSubtitle}>
            From the rural heartlands of Vidarbha and tribal settlements to universities across Maharashtra —&nbsp;
            <strong>7 years of independent frontline strategic leadership (starting from 2019) and mission execution</strong>
          </p>
          <div className={sw.regionGrid} ref={regionRef}>
            {REGIONS.map((r) => (
              <div key={r.name} className={sw.regionCard} data-region>
                <div className={sw.regionIcon}>
                  <GoogleIcon name={r.icon} size={34} style={{ color: '#DC143C' }} />
                </div>
                <div className={sw.regionName}>{r.name}</div>
                <div className={sw.regionStat}>{r.stat}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Animated Stats / Metrics Grid ────────────────────── */}
      <div className={s.statsGrid}>
        {STATS.map((st, i) => (
          <div
            key={i}
            className={s.statBox}
            ref={el => { statRefs.current[i] = el }}
          >
            <div className={s.statCount} data-count>{st.count}</div>
            <div className={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* ── 5. Current Hero Showcase: "WE WORK FOR WOMEN." ────── */}
      <SocialWorkHero />

      {/* ── 6. Media Vault ──────────────────────────────────────── */}
      <section className={sw.mediaSection}>
        <div className={sw.sectionInner}>
          <h2 className={sw.sectionTitle}>Media Vault</h2>
          <p className={sw.sectionSubtitle}>
            Filterable documentation from 7 years of high-impact frontline camps (2019–Present) — transforming vulnerability into sovereignty.
          </p>
          <div className={sw.mediaGrid} ref={mediaRef}>
            {MEDIA.map((m) => (
              <div key={m.seed} className={sw.mediaCard} data-media>
                <div className={sw.mediaImgWrap}>
                  <img
                    src={`https://picsum.photos/seed/${m.seed}/400/280`}
                    alt={m.caption}
                    className={sw.mediaImg}
                    loading="lazy"
                  />
                  <span className={sw.mediaTag}>{m.tag}</span>
                </div>
                <p className={sw.mediaCaption}>{m.caption}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/gallery" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2.25rem', background: '#DC143C', color: '#FFFFFF', borderRadius: '9999px', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none', boxShadow: '0 4px 15px rgba(220, 20, 60, 0.3)' }}>
              Open Full 3D Interactive Media Vault &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. Field Reports ────────────────────────────────────── */}
      <section className={sw.reportsSection}>
        <div className={sw.sectionInner}>
          <h2 className={sw.sectionTitle}>Field Reports</h2>
          <p className={sw.sectionSubtitle}>
            Rigorously documented. Freely accessible. Operational accountability to the communities and young women we serve.
          </p>
          <div className={sw.reportsGrid} ref={reportsRef}>
            {REPORTS.map((r) => (
              <div key={r.title} className={sw.reportCard} data-report>
                <div className={sw.reportIconWrap}>
                  <GoogleIcon name="description" size={26} style={{ color: '#DC143C' }} />
                </div>
                <div className={sw.reportBody}>
                  <div className={sw.reportMeta}>
                    <span className={sw.reportYear}>{r.year}</span>
                    <span className={sw.reportPages}>{r.pages} pages</span>
                    <span className={sw.reportSize}>{r.size}</span>
                  </div>
                  <h3 className={sw.reportTitle}>{r.title}</h3>
                </div>
                <button className={sw.reportBtn} aria-label={`Download ${r.title}`}>
                  ↓ Download PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Support Our Mission (CTA) ────────────────────────── */}
      <section className={sw.ctaSection} ref={ctaRef}>
        <div className={sw.ctaInner}>
          <h2 className={sw.ctaTitle}>Support Our Mission</h2>
          <p className={sw.ctaDesc}>
            Directly fund residential camps, operational crisis rescues, and intellectual white papers. Stand alongside our sentinels.
          </p>
          <div className={sw.ctaBtns}>
            <Link to="/sahyog" className={sw.ctaDonateBtn}>Support Mission</Link>
            <Link to="/events" className={sw.ctaVolunteerBtn}>Join Camp</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
