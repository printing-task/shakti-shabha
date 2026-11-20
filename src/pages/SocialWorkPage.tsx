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
/* 1. Selected Field Indicators                                       */
/* ------------------------------------------------------------------ */

const FIELD_INDICATORS = [
  { count: '2,000+', num: 2000, suffix: '+', label: 'Participants trained' },
  { count: '25,000+', num: 25000, suffix: '+', label: 'Youth engagement' },
  { count: '13', num: 13, suffix: '', label: 'Documented rescue interventions' },
  { count: '250+', num: 250, suffix: '+', label: 'Cases / situations engaged' },
]

/* ------------------------------------------------------------------ */
/* 2. Three Areas of Practice                                         */
/* ------------------------------------------------------------------ */

const PRACTICE_AREAS = [
  {
    id: 'mardini',
    icon: 'security',
    number: '01',
    name: 'SHAKTI MARDINI',
    sub: 'Safeguarding • Preparedness • Field Training',
    desc: 'Practical self-defence, situational awareness, and confidence-building programmes designed for girls and women across schools, colleges, and rural communities.',
    accent: '#DC143C',
    bg: 'rgba(220, 20, 60, 0.05)',
    border: 'rgba(220, 20, 60, 0.22)',
    link: '/mardini',
  },
  {
    id: 'bhava',
    icon: 'favorite',
    number: '02',
    name: 'SHAKTI BHAVA',
    sub: 'Human Behaviour • Vulnerability • Resilience',
    desc: 'Counselling support and awareness-based conversations, focusing on psychological resilience and behavioural observation, with appropriate referral where specialised professional care is required.',
    accent: '#166534',
    bg: 'rgba(22, 101, 52, 0.05)',
    border: 'rgba(22, 101, 52, 0.22)',
    link: '/counselling',
  },
  {
    id: 'varta',
    icon: 'menu_book',
    number: '03',
    name: 'SHAKTI VARTA',
    sub: 'Policy • Governance • History • Public Discourse',
    desc: 'Independent research, civilizational inquiry, educational symposiums, and evidence-informed public dialogue connecting field experience to institutional thought.',
    accent: '#3730A3',
    bg: 'rgba(55, 48, 163, 0.05)',
    border: 'rgba(55, 48, 163, 0.22)',
    link: '/research',
  },
]

/* ------------------------------------------------------------------ */
/* 3. Field Presence                                                  */
/* ------------------------------------------------------------------ */

const FIELD_REGIONS = [
  {
    state: 'Maharashtra',
    icon: 'location_on',
    locations: 'Akola • Hivarkhed • Belkhed • Mumbai • Nagpur • Pathrot • Udgir • Malegaon',
  },
  {
    state: 'Madhya Pradesh',
    icon: 'pin_drop',
    locations: 'Chhindwada • Bhopal • Damua • Betul • Shahpur • Bhaura • Multai • Masod • Padhar • Amla',
  },
  {
    state: 'Gujarat',
    icon: 'explore',
    locations: 'Ahmedabad • Vadodara',
  },
  {
    state: 'Institutional Hubs & Cities',
    icon: 'hub',
    locations: 'Delhi • Mumbai • Bengaluru • Mysuru • Ajmer • Coimbatore',
  },
]

/* ------------------------------------------------------------------ */
/* 4. Field & Media                                                   */
/* ------------------------------------------------------------------ */

const MEDIA = [
  { id: 'm1', image: '/socialwork/IMG-20250128-WA0029.jpg', tag: 'MARDINI TRAINING', caption: 'Lathi-Kaushal and physical preparedness workshop in Vidarbha' },
  { id: 'm2', image: '/socialwork/20251116_085108.jpg', tag: 'PREPAREDNESS', caption: 'Situational awareness and defensive tactical drills' },
  { id: 'm3', image: '/socialwork/IMG-20250128-WA0025.jpg', tag: 'COLLEGE WORKSHOP', caption: 'Empty-hand confidence-building workshop for young college women' },
  { id: 'm4', image: '/socialwork/IMG-20250628-WA0012.jpg', tag: 'YOUTH DIALOGUE', caption: 'Institutional dialogue and youth awareness session' },
  { id: 'm5', image: '/socialwork/IMG-20261028-WA0002 (1).jpg', tag: 'AWARENESS CIRCLE', caption: 'Psychosocial awareness and community conversation circle' },
  { id: 'm6', image: '/socialwork/IMG_20260906_144953_075.jpg', tag: 'RESIDENTIAL CAMP', caption: 'Multi-day youth preparedness and character cohort' },
]

/* ------------------------------------------------------------------ */
/* 5. Field Reports                                                   */
/* ------------------------------------------------------------------ */

const FIELD_REPORTS = [
  { title: 'Vidarbha Fieldwork & Community Engagement Report', pages: 28, year: '2024', size: '2.4 MB' },
  { title: 'Maharashtra Institutional Sessions & Youth Awareness Overview', pages: 45, year: '2023', size: '3.8 MB' },
  { title: 'Community Awareness & Psychosocial Support Case Observations', pages: 32, year: '2022', size: '1.9 MB' },
]

/* ------------------------------------------------------------------ */
/* 6. Articles & Insights                                             */
/* ------------------------------------------------------------------ */

const ARTICLES_INSIGHTS = [
  {
    title: 'Field Realities of Youth Vulnerability in Tier-2 and Rural Districts',
    date: 'OCT 2024',
    author: 'Harshita Manker',
    topic: 'SAFEGUARDING & YOUTH',
    excerpt: 'An analysis of structural gaps in institutional awareness, digital vulnerability among adolescents, and actionable protocols for family and community resilience.',
    link: '/case-studies',
  },
  {
    title: 'From Passive Vulnerability to Active Preparedness',
    date: 'MAY 2024',
    author: 'Shakti Sabha Field Team',
    topic: 'FIELD ACTION',
    excerpt: 'Observations from over 500 college self-defence cohorts: how physical grounding directly elevates cognitive clarity and moral assertiveness in young women.',
    link: '/case-studies',
  },
  {
    title: 'Psychosocial Awareness in Underserved Communities: Observations & Protocols',
    date: 'JAN 2024',
    author: 'Harshita Manker',
    topic: 'BEHAVIOUR & WELL-BEING',
    excerpt: 'A practitioner perspective on establishing non-judgmental listening circles and early identification protocols for distress in semi-urban areas.',
    link: '/case-studies',
  },
  {
    title: 'Kshatra-Dharma as an Ethical Paradigm for Modern Citizenship',
    date: 'NOV 2023',
    author: 'Research Stream',
    topic: 'CIVILIZATIONAL THOUGHT',
    excerpt: 'Re-evaluating classical Indian responsibility codes: strength guided by restraint, courage guided by wisdom, and power guided by duty.',
    link: '/research',
  },
]

/* ------------------------------------------------------------------ */
/* 7. Policy & Institutional Dialogue                                 */
/* ------------------------------------------------------------------ */

const DIALOGUE_CHANNELS = [
  {
    icon: 'school',
    title: 'Universities & Colleges',
    desc: 'Collaborative curriculum modules, guest lectures, student forums, and youth workshops focusing on awareness and ethical leadership.',
  },
  {
    icon: 'local_library',
    title: 'Schools & Educational Bodies',
    desc: 'Campus safety sessions, anti-bullying dialogues, and physical confidence programmes integrated into co-curricular calendars.',
  },
  {
    icon: 'diversity_3',
    title: 'Civil Society & Community Networks',
    desc: 'Grassroots coordination with local community leaders, social workers, and rural collectives to reach underserved youth.',
  },
  {
    icon: 'account_balance',
    title: 'Public Forums & Policy Consultations',
    desc: 'Translating field observations and verified ground metrics into constructive inputs for public seminars and policy discussions.',
  },
]

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function SocialWorkPage() {
  const statRefs = useRef<(HTMLDivElement | null)[]>([])
  const pillarsRef = useRef<HTMLDivElement>(null)
  const presenceRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const reportsRef = useRef<HTMLDivElement>(null)
  const articlesRef = useRef<HTMLDivElement>(null)
  const dialogueRef = useRef<HTMLDivElement>(null)
  const founderRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Animated stat counters */
      statRefs.current.forEach((el, i) => {
        if (!el) return
        const numEl = el.querySelector('[data-count]') as HTMLElement | null
        if (!numEl) return
        const target = FIELD_INDICATORS[i].num
        const suffix = FIELD_INDICATORS[i].suffix
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

      /* Pillar cards */
      if (pillarsRef.current) {
        gsap.from(pillarsRef.current.querySelectorAll('[data-pillar]'), {
          scrollTrigger: { trigger: pillarsRef.current, start: 'top 80%' },
          opacity: 0,
          y: 28,
          stagger: 0.15,
          duration: 0.7,
          ease: 'power2.out',
        })
      }

      /* Field Presence cards */
      if (presenceRef.current) {
        gsap.from(presenceRef.current.querySelectorAll('[data-presence]'), {
          scrollTrigger: { trigger: presenceRef.current, start: 'top 85%' },
          opacity: 0,
          y: 20,
          stagger: 0.08,
          duration: 0.5,
          ease: 'power2.out',
          clearProps: 'all',
        })
      }

      /* Media grid */
      if (mediaRef.current) {
        gsap.from(mediaRef.current.querySelectorAll('[data-media]'), {
          scrollTrigger: { trigger: mediaRef.current, start: 'top 85%' },
          opacity: 0,
          scale: 0.95,
          stagger: 0.08,
          duration: 0.5,
          ease: 'power2.out',
          clearProps: 'all',
        })
      }

      /* Reports */
      if (reportsRef.current) {
        gsap.from(reportsRef.current.querySelectorAll('[data-report]'), {
          scrollTrigger: { trigger: reportsRef.current, start: 'top 85%' },
          opacity: 0,
          y: 18,
          stagger: 0.1,
          duration: 0.5,
          ease: 'power2.out',
          clearProps: 'all',
        })
      }

      /* Articles & Insights */
      if (articlesRef.current) {
        gsap.from(articlesRef.current.querySelectorAll('[data-article]'), {
          scrollTrigger: { trigger: articlesRef.current, start: 'top 85%' },
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.55,
          ease: 'power2.out',
          clearProps: 'all',
        })
      }

      /* Dialogue cards */
      if (dialogueRef.current) {
        gsap.from(dialogueRef.current.querySelectorAll('[data-dialogue]'), {
          scrollTrigger: { trigger: dialogueRef.current, start: 'top 85%' },
          opacity: 0,
          y: 18,
          stagger: 0.08,
          duration: 0.5,
          ease: 'power2.out',
          clearProps: 'all',
        })
      }

      /* Founder Card */
      if (founderRef.current) {
        const cardEl = founderRef.current.querySelector(`.${sw.founderCardCompact}`) || founderRef.current
        gsap.from(cardEl, {
          scrollTrigger: { trigger: founderRef.current, start: 'top 88%' },
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'all',
        })
      }

      /* CTA banner */
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          scrollTrigger: { trigger: ctaRef.current, start: 'top 88%' },
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'all',
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
          <span className={sw.badge}>FIELD &amp; INSTITUTIONAL PRACTICE</span>
          <h1 className={sw.title}>FIELD &amp; INSTITUTIONAL PRACTICE</h1>
          <p className={sw.desc}>
            Ground engagement informing evidence, inquiry and institutional dialogue. Bridging direct field experience with rigorous study, policy perspective, and long-term social transformation.
          </p>
        </div>
      </div>

      {/* ── 2. Three Areas of Practice ──────────────────────────── */}
      <section className={sw.pillarsSection}>
        <div className={sw.sectionInner}>
          <h2 className={sw.sectionTitle}>THREE AREAS OF PRACTICE</h2>
          <p className={sw.sectionSubtitle}>
            Where ground realities inform structured methodology, ethical inquiry, and long-term empowerment.
          </p>
          <div className={sw.pillarsGrid} ref={pillarsRef}>
            {PRACTICE_AREAS.map((p) => (
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
                <h3 className={sw.pillarTitle} style={{ color: p.accent }}>
                  {p.number} — {p.name}
                </h3>
                <div className={sw.pillarSubtitle}>{p.sub}</div>
                <p className={sw.pillarDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Field Presence ───────────────────────────────────── */}
      <section className={sw.reachSection}>
        <div className={sw.sectionInner} ref={presenceRef}>
          <h2 className={sw.sectionTitle}>FIELD PRESENCE</h2>
          <p className={sw.sectionSubtitle}>
            Direct on-the-ground presence across regional clusters, educational institutions, and community networks.
          </p>
          <div className={sw.presenceGrid}>
            {FIELD_REGIONS.map((r) => (
              <div key={r.state} className={sw.presenceCard} data-presence>
                <div className={sw.presenceHeader}>
                  <div className={sw.presenceIcon}>
                    <GoogleIcon name={r.icon} size={22} />
                  </div>
                  <h3 className={sw.presenceState}>{r.state}</h3>
                </div>
                <p className={sw.presenceLocations}>{r.locations}</p>
              </div>
            ))}
          </div>
          <div className={sw.presenceTagline}>
            <GoogleIcon name="verified" size={20} />
            <span>7+ years of field engagement | 2019–Present</span>
          </div>
        </div>
      </section>

      {/* ── 4. Selected Field Indicators ────────────────────────── */}
      <section className={sw.indicatorsSection}>
        <div className={sw.sectionInner}>
          <h2 className={sw.sectionTitle}>SELECTED FIELD INDICATORS</h2>
          <p className={sw.sectionSubtitle}>
            Verified quantitative outcomes from multi-year field engagement across rural, urban, and institutional settings.
          </p>
          <div className={sw.indicatorsGrid}>
            {FIELD_INDICATORS.map((st, i) => (
              <div
                key={i}
                className={sw.indicatorBox}
                ref={(el) => { statRefs.current[i] = el }}
              >
                <div className={sw.indicatorNumber} data-count>{st.count}</div>
                <div className={sw.indicatorLabel}>{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. What The Field Reveals ───────────────────────────── */}
      <SocialWorkHero />

      {/* ── 6. Field & Media ────────────────────────────────────── */}
      <section className={sw.mediaSection}>
        <div className={sw.sectionInner}>
          <h2 className={sw.sectionTitle}>FIELD &amp; MEDIA</h2>
          <p className={sw.sectionSubtitle}>
            Photographic documentation and visual records from multi-year field engagements, workshops, and community interactions.
          </p>
          <div className={sw.mediaGrid} ref={mediaRef}>
            {MEDIA.map((m) => (
              <div key={m.id} className={sw.mediaCard} data-media>
                <div className={sw.mediaImgWrap}>
                  <img
                    src={encodeURI(m.image)}
                    alt={m.caption}
                    className={sw.mediaImg}
                    loading="lazy"
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).src = '/socialwork/social-1.jpg'
                    }}
                  />
                  <span className={sw.mediaTag}>{m.tag}</span>
                </div>
                <p className={sw.mediaCaption}>{m.caption}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link
              to="/gallery"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.8rem 2.25rem',
                background: '#DC143C',
                color: '#FFFFFF',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: '0.85rem',
                textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(220, 20, 60, 0.3)',
              }}
            >
              Open Full Media Gallery &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. Field Reports ────────────────────────────────────── */}
      <section className={sw.reportsSection}>
        <div className={sw.sectionInner}>
          <h2 className={sw.sectionTitle}>FIELD REPORTS</h2>
          <p className={sw.sectionSubtitle}>
            Rigorous field observations, operational summaries, and institutional documentation accessible for partners and researchers.
          </p>
          <div className={sw.reportsGrid} ref={reportsRef}>
            {FIELD_REPORTS.map((r) => (
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

      {/* ── 8. Articles & Insights ──────────────────────────────── */}
      <section className={sw.articlesSection}>
        <div className={sw.sectionInner} ref={articlesRef}>
          <h2 className={sw.sectionTitle}>ARTICLES &amp; INSIGHTS</h2>
          <p className={sw.sectionSubtitle}>
            Field analysis, practical insights, and thought papers translating on-the-ground experience into knowledge.
          </p>
          <div className={sw.articlesGrid}>
            {ARTICLES_INSIGHTS.map((art) => (
              <div key={art.title} className={sw.articleCard} data-article>
                <div>
                  <div className={sw.articleMeta}>
                    <span className={sw.articleTopicTag}>{art.topic}</span>
                    <span>{art.date}</span>
                    <span>•</span>
                    <span>{art.author}</span>
                  </div>
                  <h3 className={sw.articleTitle}>{art.title}</h3>
                  <p className={sw.articleExcerpt}>{art.excerpt}</p>
                </div>
                <div>
                  <Link to={art.link} className={sw.articleLink}>
                    <span>Read Article</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Policy & Institutional Dialogue ──────────────────── */}
      <section className={sw.dialogueSection}>
        <div className={sw.sectionInner} ref={dialogueRef}>
          <h2 className={sw.sectionTitle}>POLICY &amp; INSTITUTIONAL DIALOGUE</h2>
          <p className={sw.sectionSubtitle}>
            Collaborating with universities, civil society, researchers, and public institutions to transform field data into constructive impact.
          </p>
          <div className={sw.dialogueGrid}>
            {DIALOGUE_CHANNELS.map((d) => (
              <div key={d.title} className={sw.dialogueCard} data-dialogue>
                <div className={sw.dialogueIcon}>
                  <GoogleIcon name={d.icon} size={24} />
                </div>
                <h3 className={sw.dialogueTitle}>{d.title}</h3>
                <p className={sw.dialogueDesc}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. Founder & Director (Compact) ────────────────────── */}
      <section className={sw.founderSection} ref={founderRef}>
        <div className={sw.sectionInner}>
          <div className={sw.founderCardCompact}>
            <div className={sw.founderAvatarWrap}>
              <img
                src="/aaryaveera/main.jpg"
                alt="Harshita Manker"
                className={sw.founderImgCompact}
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).src = '/socialwork/social-1.jpg'
                }}
              />
            </div>
            <div className={sw.founderInfoCompact}>
              <div className={sw.founderLabelCompact}>FOUNDER &amp; DIRECTOR</div>
              <h3 className={sw.founderNameCompact}>Harshita Manker</h3>
              <div className={sw.founderRoleCompact}>Founder, Shakti Sabha</div>
              <p className={sw.founderBioCompact}>
                Field Practitioner • Youth Educator • Independent Researcher &amp; Speaker.
                Directly leading Shakti Sabha&apos;s grassroots fieldwork, educational curricula, and civilizational dialogues across India.
              </p>
              <div className={sw.founderLinksCompact}>
                <Link to="/about#founder" className={sw.founderLinkPrimary}>
                  <span>Read Profile in About</span>
                  <span>&rarr;</span>
                </Link>
                <Link to="/aaryaveera" className={sw.founderLinkSecondary}>
                  <span>Explore Aaryaveera Worldview</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 11. Support Our Mission (CTA) ───────────────────────── */}
      <section className={sw.ctaSection} ref={ctaRef}>
        <div className={sw.ctaInner}>
          <h2 className={sw.ctaTitle}>Collaborate With Shakti Sabha</h2>
          <p className={sw.ctaDesc}>
            Partner with us across educational programmes, research initiatives, community workshops, or institutional forums.
          </p>
          <div className={sw.ctaBtns}>
            <Link to="/sahyog" className={sw.ctaDonateBtn}>Partner With Us</Link>
            <Link to="/events" className={sw.ctaVolunteerBtn}>Explore Events</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
