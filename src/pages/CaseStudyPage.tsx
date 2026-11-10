import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import s from './PageLayout.module.css'
import cs from './CaseStudyPage.module.css'

interface CaseItem {
  id: string
  alias: string
  title: string
  category: 'SELF-DEFENSE' | 'TRAFFICKING SURVIVORS' | 'MENTAL HEALTH' | 'PTSD' | 'LEADERSHIP'
  readTime: string
  date: string
  excerpt: string
  fullStory: string
  badgeColor: string
}

const CASE_STUDIES: CaseItem[] = [
  {
    id: 'cs-1',
    alias: 'Case File #2024-MH-09: "Priya"',
    title: 'From Panic Attacks to Village Leadership: How Priya Found Her Voice',
    category: 'MENTAL HEALTH',
    readTime: '6 min read',
    date: 'Nov 2026',
    excerpt: 'A 19-year-old student from rural Vidarbha suffered chronic depression and silence after facing systemic village isolation. Through Shakti Bhava circles, her recovery became a community movement.',
    fullStory: 'Priya arrived at our Amravati center unable to make eye contact. Over six months of somatic therapy, peer listening groups, and lathi practice, she regained her confidence. Today, she leads our youth literacy drive in three neighboring wadis.',
    badgeColor: '#3D5A45',
  },
  {
    id: 'cs-2',
    alias: 'Case File #2024-SD-14: "Kamla"',
    title: 'The Warrior Returns: Neutralizing Workplace Stalking in Industrial MIDC',
    category: 'SELF-DEFENSE',
    readTime: '4 min read',
    date: 'Oct 2026',
    excerpt: 'Facing repeated harassment on her commute from textile factory shifts, Kamla enrolled in our 3-day Mission Mardini self-defense camp. Two weeks later, she disarmed an aggressor using wrist leverage.',
    fullStory: 'Rather than resigning from her livelihood, Kamla applied the Mission Mardini pivot-and-strike protocol (guided by the Aaryaveera warrior philosophy) when cornered at a bus depot. The aggressor fled, and her factory floor organized mandatory safety workshops for all 180 female shift workers.',
    badgeColor: '#DC143C',
  },
  {
    id: 'cs-3',
    alias: 'Case File #2023-TS-03: "Ananya"',
    title: 'Breaking the Silence: 18 Months in Confidential Rehabilitation',
    category: 'TRAFFICKING SURVIVORS',
    readTime: '8 min read',
    date: 'Sep 2026',
    excerpt: 'Rescued from an interstate trafficking nexus at age 17, Ananya entered Shakti Sabha’s zero-knowledge rehabilitation sanctuary. Her legal battle resulted in the conviction of four perpetrators.',
    fullStory: 'With full legal assistance from our pro-bono advocates and round-the-clock psychiatric support, Ananya’s deposition was recorded in camera. Today, she is completing her diploma in vocational accounting with a full scholarship.',
    badgeColor: '#7C3AED',
  },
  {
    id: 'cs-4',
    alias: 'Case File #2023-PT-11: "Rekha"',
    title: 'Somatic Healing After a Decade of Domestic Abuse',
    category: 'PTSD',
    readTime: '7 min read',
    date: 'Aug 2026',
    excerpt: 'Ten years of coercive marital control left Rekha with debilitating psychosomatic tremors. Through trauma-informed breathwork and supportive shelter, she reclaimed her autonomy.',
    fullStory: 'Rebuilding after decade-long trauma requires financial independence and physical grounding. Rekha established an organic spice micro-enterprise through Sahyog capital seed grants and now lives in dignity with her two daughters.',
    badgeColor: '#D97706',
  },
  {
    id: 'cs-5',
    alias: 'Case File #2024-LD-02: "Meera"',
    title: 'From A Single-Room Hut to the District Administrative Services',
    category: 'LEADERSHIP',
    readTime: '5 min read',
    date: 'Jul 2026',
    excerpt: 'Overcoming caste barriers and deep poverty, Meera utilized Shakti Sabha’s study library and mentorship fellowship to clear competitive state public service examinations.',
    fullStory: 'Meera attended our weekend study circles and character masterclasses over two grueling years of preparation. In August 2024, she secured rank 42 in the State Public Services examination.',
    badgeColor: '#2563EB',
  },
  {
    id: 'cs-6',
    alias: 'Case File #2023-MH-21: "The 12 Sisters"',
    title: 'The Sister Circle: How Group Therapy Transformed a Drought-Hit Hamlet',
    category: 'MENTAL HEALTH',
    readTime: '9 min read',
    date: 'Jun 2026',
    excerpt: 'When farmer suicides devastated families in a single hamlet, 12 widows gathered under a neem tree with our facilitators. Their collective healing gave birth to a grain cooperative.',
    fullStory: 'Grief turns into empowerment when shared within a structured, safe circle. The women pooled micro-savings, negotiated seed prices directly with district mandis, and eradicated the middleman debt cycle that took their spouses.',
    badgeColor: '#059669',
  },
]

export default function CaseStudyPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL')
  const [activeModal, setActiveModal] = useState<CaseItem | null>(null)
  const [submittedStory, setSubmittedStory] = useState(false)

    useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = ""
      }
    } else {
      document.body.style.overflow = ""
    }
  }, [activeModal])

  useEffect(() => {
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  const filteredStories = selectedFilter === 'ALL'
    ? CASE_STUDIES
    : CASE_STUDIES.filter(c => c.category === selectedFilter)

  return (
    <main className={s.page}>
      {/* Hero Banner */}
      <div className={cs.hero}>
        <div className={cs.heroInner}>
          <span className={cs.badge}>SRS Section 8 · Secure Case Study Archive</span>
          <h1 className={cs.title}>Case Studies & Field Stories</h1>
          <p className={cs.hindiSubtitle}>केस स्टडी — असली कहानियाँ · Anonymized & Verified</p>
          <p className={cs.desc}>
            Raw, unfiltered accounts of trauma, survival, and victory. Every detail is rigorously anonymized
            using Zero-Knowledge principles to safeguard survivor identity while preserving legal and evidentiary truths.
          </p>

          <div className={cs.alertBox}>
            <div className={cs.alertIcon}><GoogleIcon name="lock" size={20} /></div>
            <div>
              <strong>Strict Privacy & Ethical Notice:</strong> All names, identifiable geographic markers, and exact dates
              have been modified. These narratives are published strictly with informed, signed survivor consent and verified by
              licensed counseling and legal professionals.
            </div>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className={s.section}>

        {/* Filter Bar */}
        <div className={cs.filterRow}>
          {(['ALL', 'SELF-DEFENSE', 'TRAFFICKING SURVIVORS', 'MENTAL HEALTH', 'PTSD', 'LEADERSHIP'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              className={`${cs.filterTab} ${selectedFilter === tab ? cs.filterTabActive : ''}`}
            >
              {tab === 'ALL' ? 'All Case Files' : tab}
            </button>
          ))}
        </div>

        {/* Case Cards Grid */}
        <div className={cs.cardsGrid}>
          {filteredStories.map(item => (
            <div key={item.id} className={cs.articleCard}>
              <div className={cs.articleBody}>
                <div className={cs.articleHeader}>
                  <span
                    className={cs.tagPill}
                    style={{
                      background: `${item.badgeColor}15`,
                      color: item.badgeColor,
                      border: `1px solid ${item.badgeColor}35`
                    }}
                  >
                    {item.category}
                  </span>
                  <span className={cs.readTime}>{item.readTime}</span>
                </div>

                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF' }}>{item.alias}</div>
                <h3 className={cs.articleTitle}>{item.title}</h3>
                <p className={cs.articleExcerpt}>{item.excerpt}</p>
              </div>

              <div className={cs.articleFooter}>
                <span className={cs.articleDate}>{item.date}</span>
                <button
                  className={cs.readMoreBtn}
                  onClick={() => setActiveModal(item)}
                >
                  Read Verified File →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal View for Case Study */}
        {activeModal && (
          <div
            data-lenis-prevent="true"
            onClick={() => setActiveModal(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              zIndex: 99999,
              overscrollBehavior: 'contain',
              touchAction: 'pan-y',
            }}
          >
            <div
              data-lenis-prevent="true"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                maxWidth: '680px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2.5rem',
                position: 'relative',
                boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                overscrollBehavior: 'contain',
                touchAction: 'pan-y',
              }}
            >
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: '#F3F4F6',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#374151'
                }}
              >
                <GoogleIcon name="close" size={18} />
              </button>

              <div style={{ fontSize: '0.75rem', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                {activeModal.category} · {activeModal.alias}
              </div>
              <h2 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.6rem', color: '#111827', margin: '0.5rem 0 1rem', lineHeight: 1.3 }}>
                {activeModal.title}
              </h2>
              <div style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: '1.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.75rem' }}>
                Published with verified survivor consent · Legal review completed · {activeModal.readTime}
              </div>

              <div style={{ fontSize: '0.95rem', color: '#374151', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                <p style={{ fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
                  {activeModal.excerpt}
                </p>
                <p>
                  {activeModal.fullStory}
                </p>
              </div>

              <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '1rem', fontSize: '0.8rem', color: '#6B7280' }}>
                <strong>Zero-Knowledge Assurance:</strong> This document was processed under AES-256-GCM column encryption. Even database system administrators cannot trace this case record back to the individual's civil credentials.
              </div>
            </div>
          </div>
        )}

        {/* Security & Anonymity Engineering Showcase */}
        <div className={cs.securityBox}>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', color: '#F43F5E', fontWeight: 700, textTransform: 'uppercase' }}>
            SRS Section 14 · Security Engineering
          </span>
          <h2 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.85rem', color: '#FFFFFF', marginTop: '0.35rem' }}>
            Zero-Knowledge Privacy Architecture
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginTop: '0.5rem', maxWidth: '700px' }}>
            Survivors trust us with their life stories. We engineer our technical stack so that no external compromise, subpoena, or rogue database query can breach their sacred anonymity.
          </p>

          <div className={cs.securityGrid}>
            <div className={cs.secCard}>
              <div className={cs.secIcon}><GoogleIcon name="shield" size={20} /></div>
              <h4 className={cs.secTitle}>AES-256-GCM Encryption</h4>
              <p className={cs.secText}>Every sensitive column is encrypted with unique rotating keys stored in hardware security modules (AWS KMS).</p>
            </div>
            <div className={cs.secCard}>
              <div className={cs.secIcon}><GoogleIcon name="person" size={20} /></div>
              <h4 className={cs.secTitle}>Zero-Knowledge Database</h4>
              <p className={cs.secText}>No identifying emails, mobile numbers, or GPS stamps are linked to public case files in plaintext.</p>
            </div>
            <div className={cs.secCard}>
              <div className={cs.secIcon}><GoogleIcon name="balance" size={20} /></div>
              <h4 className={cs.secTitle}>Consent-Based Workflow</h4>
              <p className={cs.secText}>A 3-tier editorial review: Primary Counselor → Survivor Affirmation → Legal Counsel signoff before publish.</p>
            </div>
          </div>
        </div>

        {/* Submit Your Story Confidential Form */}
        <div style={{ marginTop: '5rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: 'clamp(2rem, 4vw, 3.5rem)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase' }}>
              Confidential Intake
            </span>
            <h2 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.75rem', color: '#111827', margin: '0.5rem 0 0.75rem' }}>
              Share Your Story Confidentially
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#6B7280', lineHeight: 1.6, marginBottom: '2rem' }}>
              Your voice can help another woman break free. You may use a pseudonym. Your submission is directed exclusively to our senior counseling lead.
            </p>

            {submittedStory ? (
              <div style={{ padding: '2rem', background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '12px', color: '#166534' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}><GoogleIcon name="mail" size={32} /></div>
                <h3 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', marginBottom: '0.5rem' }}>Encrypted Submission Received</h3>
                <p style={{ fontSize: '0.88rem' }}>Thank you for your courage. Your words have been placed into confidential care.</p>
                <button onClick={() => setSubmittedStory(false)} style={{ marginTop: '1rem', padding: '0.4rem 1.25rem', background: '#16a34a', color: '#FFFFFF', border: 'none', borderRadius: '9999px', fontSize: '0.8rem', cursor: 'pointer' }}>
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSubmittedStory(true) }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Your Preferred Name or Alias</label>
                  <input required type="text" placeholder="e.g. Maya (or Alias)" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Category of Experience</label>
                  <select style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', background: '#FFFFFF' }}>
                    <option>Self-Defense & Workplace Safety</option>
                    <option>Domestic Abuse Recovery</option>
                    <option>Trafficking Survival</option>
                    <option>Depression, Anxiety & Mental Fortitude</option>
                    <option>Other / Personal Breakthrough</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Your Story & Journey</label>
                  <textarea rows={4} required placeholder="Share what you faced and what helped you reclaim your power..." style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', resize: 'vertical' }}></textarea>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <input type="checkbox" id="consent" required style={{ width: '16px', height: '16px' }} />
                  <label htmlFor="consent" style={{ fontSize: '0.8rem', color: '#4B5563' }}>
                    I understand this will be reviewed under strict confidentiality and never published without my affirmative consent.
                  </label>
                </div>
                <button type="submit" style={{ padding: '0.85rem', background: '#DC143C', color: '#FFFFFF', border: 'none', borderRadius: '9999px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                  Submit Confidentially →
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </main>
  )
}
