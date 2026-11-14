import { Link } from 'react-router-dom'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import s from './ThreeStreamsPage.module.css'

export default function ThreeStreamsPage() {
  return (
    <main className={s.page}>
      {/* ── TOP HERO BANNER ────────────────────────────────────────── */}
      <div className={s.hero}>
        <div className={s.heroInner}>
          <span className={s.badge}>Architecture · The Tri-Stream Doctrine</span>
          <h1 className={s.title}>OUR THREE STREAMS. ONE VISION.</h1>
          <p className={s.hindiSubtitle}>The Union of Peace and Revolution · The Three Streams</p>
          <p className={s.desc}>
            Together, these initiatives represent Shakti Sabha’s integrated approach to human development: strengthening the body, refining the mind, and awakening consciousness.
          </p>

          <div className={s.heroTags}>
            <Link to="/mardini" className={`${s.heroTag} ${s.tagMardini}`}>
              01 Revolution · Mission Mardini →
            </Link>
            <Link to="/shakti-bhava" className={`${s.heroTag} ${s.tagBhava}`}>
              02 Healing · Shakti Bhava →
            </Link>
            <Link to="/shakti-varta" className={`${s.heroTag} ${s.tagVarta}`}>
              03 Discourse · Shakti Varta →
            </Link>
          </div>
        </div>
      </div>

      <div className={s.section}>
        {/* ── UNIFIED CORE METRICS ──────────────────────────────────── */}
        <div className={s.statsGrid}>
          <div className={s.statCard}>
            <div className={s.statNumber}>2,000+</div>
            <div className={s.statLabel}>Girls Trained</div>
            <div className={s.statDesc}>Armed and unarmed self-defense and practical street-safety awareness.</div>
          </div>
          <div className={s.statCard}>
            <div className={s.statNumber}>13</div>
            <div className={s.statLabel}>Minors Reintegrated</div>
            <div className={s.statDesc}>Timely safety interception, statutory handoff, and legal guardianship.</div>
          </div>
          <div className={s.statCard}>
            <div className={s.statNumber}>250+</div>
            <div className={s.statLabel}>Crises &amp; Consultations</div>
            <div className={s.statDesc}>High-risk distress cases and 50+ critical family mediations.</div>
          </div>
          <div className={s.statCard}>
            <div className={s.statNumber}>500+</div>
            <div className={s.statLabel}>Seminars &amp; Discourses</div>
            <div className={s.statDesc}>Institutional sessions and consciousness-building assemblies.</div>
          </div>
          <div className={s.statCard}>
            <div className={s.statNumber}>25,000+</div>
            <div className={s.statLabel}>Students Reached</div>
            <div className={s.statDesc}>Youth awakening workshops across Maharashtra and beyond.</div>
          </div>
        </div>

        {/* ── THE SHAKTI SABHA PHILOSOPHY ──────────────────────────── */}
        <div className={s.manifestoBox}>
          <span className={s.eyebrow}>THE SHAKTI SABHA PHILOSOPHY</span>
          <h2 className={s.heading}>
            Strength Without Hatred. Knowledge Without Blindness. Power With Responsibility.
          </h2>
          <blockquote className={s.manifestoQuote}>
            "We do not build dependent victims; we forge sovereign, intellectually fortified, and tactically capable guardians of Indian civilization."
          </blockquote>
          <p className={s.manifestoText}>
            Shakti Sabha believes that genuine empowerment must develop the whole human being. Physical strength without self-control can become aggression. Knowledge without critical inquiry can become dogma. Freedom without responsibility can become directionless. Peace without courage can become passive acceptance of injustice.
          </p>
          <p className={s.manifestoText}>
            Our work seeks to bring these dimensions together: We encourage women to recognize their strength without developing hostility towards men. We encourage young people to question ideas without becoming prisoners of cynicism. We promote cultural awareness without blind glorification and modern thinking without blind imitation.
          </p>
          <p className={s.manifestoText} style={{ fontWeight: 600, color: '#DC143C' }}>
            "We do not seek to create followers. We seek to cultivate independent minds, responsible leaders, and conscious individuals."
          </p>
        </div>

        {/* ── THE THREE PILLARS IN DETAIL ───────────────────────────── */}
        <div style={{ marginBottom: '1.75rem' }}>
          <span className={s.eyebrow}>Detailed Stream Directives</span>
          <h2 className={s.heading}>Explore The Three Wings</h2>
        </div>

        <div className={s.streamsGrid}>
          {/* Stream 01 */}
          <div className={s.streamCard}>
            <div className={s.streamCardHead}>
              <span className={s.streamNum} style={{ color: '#DC143C' }}>01</span>
              <span className={s.streamBadge} style={{ background: 'rgba(220, 20, 60, 0.1)', color: '#DC143C' }}>
                Revolution
              </span>
            </div>
            <h3 className={s.streamName}>Mardini</h3>
            <div className={s.streamDev}>Mission Mardini · Physical Sovereignty &amp; Tactical Preparedness</div>
            <p className={s.streamSummary}>
              Challenges passive approaches to self-defense by integrating physical combat training with psychological preparedness, situational awareness, discipline, and decision-making under pressure.
            </p>
            <ul className={s.streamHighlights}>
              <li className={s.streamHighlightItem}>
                <GoogleIcon name="sports_kabaddi" size={18} style={{ color: '#DC143C', flexShrink: 0 }} />
                <span>Dual-Shield Doctrine (Cognitive De-escalation &amp; Physical Defense)</span>
              </li>
              <li className={s.streamHighlightItem}>
                <GoogleIcon name="shield" size={18} style={{ color: '#DC143C', flexShrink: 0 }} />
                <span>Karate-based empty hand strikes, balance, and Lathi-Kaushal staff</span>
              </li>
              <li className={s.streamHighlightItem}>
                <GoogleIcon name="holiday_village" size={18} style={{ color: '#DC143C', flexShrink: 0 }} />
                <span>Intensive 7–10 day camps and tribal/rural grassroots outreach</span>
              </li>
            </ul>
            <Link to="/mardini" className={`${s.streamBtn} ${s.streamBtnMardini}`}>
              <span>Explore Mission Mardini</span>
              <GoogleIcon name="arrow_forward" size={16} />
            </Link>
          </div>

          {/* Stream 02 */}
          <div className={s.streamCard}>
            <div className={s.streamCardHead}>
              <span className={s.streamNum} style={{ color: '#166534' }}>02</span>
              <span className={s.streamBadge} style={{ background: 'rgba(22, 101, 52, 0.1)', color: '#166534' }}>
                Consciousness
              </span>
            </div>
            <h3 className={s.streamName}>Shakti Bhava</h3>
            <div className={s.streamDev}>Shakti Bhava · Cognitive Awakening &amp; Human Consciousness</div>
            <p className={s.streamSummary}>
              Youth-awareness and consciousness-building initiative cultivating independent thinkers who examine social narratives and make decisions through reason.
            </p>
            <ul className={s.streamHighlights}>
              <li className={s.streamHighlightItem}>
                <GoogleIcon name="psychology" size={18} style={{ color: '#166534', flexShrink: 0 }} />
                <span>Intellectual independence, critical thinking &amp; narrative awareness</span>
              </li>
              <li className={s.streamHighlightItem}>
                <GoogleIcon name="family_restroom" size={18} style={{ color: '#166534', flexShrink: 0 }} />
                <span>50+ field family mediations and statutory child protection (CWC)</span>
              </li>
              <li className={s.streamHighlightItem}>
                <GoogleIcon name="spa" size={18} style={{ color: '#166534', flexShrink: 0 }} />
                <span>Non-verbal behavioral observation, de-escalation &amp; somatic support</span>
              </li>
            </ul>
            <Link to="/shakti-bhava" className={`${s.streamBtn} ${s.streamBtnBhava}`}>
              <span>Explore Shakti Bhava</span>
              <GoogleIcon name="arrow_forward" size={16} />
            </Link>
          </div>

          {/* Stream 03 */}
          <div className={s.streamCard}>
            <div className={s.streamCardHead}>
              <span className={s.streamNum} style={{ color: '#4338CA' }}>03</span>
              <span className={s.streamBadge} style={{ background: 'rgba(67, 56, 202, 0.1)', color: '#4338CA' }}>
                Discourse
              </span>
            </div>
            <h3 className={s.streamName}>Shakti Varta</h3>
            <div className={s.streamDev}>Shakti Varta · Intellectual Sovereignty &amp; Critical Inquiry</div>
            <p className={s.streamSummary}>
              Research, mentorship, and public discourse platform equipping youth with research literacy and the confidence to question widely accepted narratives from primary sources.
            </p>
            <ul className={s.streamHighlights}>
              <li className={s.streamHighlightItem}>
                <GoogleIcon name="menu_book" size={18} style={{ color: '#4338CA', flexShrink: 0 }} />
                <span>Vedic Digital Fellowship (Vedas, Gita, Mahabharata, Satyarth Prakash)</span>
              </li>
              <li className={s.streamHighlightItem}>
                <GoogleIcon name="analytics" size={18} style={{ color: '#4338CA', flexShrink: 0 }} />
                <span>Critical media analysis, fact-checking &amp; narrative deconstruction</span>
              </li>
              <li className={s.streamHighlightItem}>
                <GoogleIcon name="podcasts" size={18} style={{ color: '#4338CA', flexShrink: 0 }} />
                <span>Open-house debates, forgotten women warriors &amp; digital podcast lectures</span>
              </li>
            </ul>
            <Link to="/shakti-varta" className={`${s.streamBtn} ${s.streamBtnVarta}`}>
              <span>Explore Shakti Varta</span>
              <GoogleIcon name="arrow_forward" size={16} />
            </Link>
          </div>
        </div>

        {/* ── STATUTORY COMPLIANCE NOTE ─────────────────────────────── */}
        <div style={{
          background: '#F9FAFB',
          border: '1px solid #E5E7EB',
          borderRadius: 14,
          padding: '1.5rem',
          marginTop: '3.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: '#111827', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <GoogleIcon name="gavel" size={20} style={{ color: '#DC143C' }} />
            Institutional Note on Confidentiality &amp; Statutory Compliance
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.65 }}>
            "Shakti Sabha operates as a civil and community support initiative. Field interventions, crisis de-escalations, and family reconciliations are conducted with strict respect for the privacy, safety, and legal confidentiality of affected individuals and their guardians. All actions involving minors and high-risk statutory matters are routed through and coordinated with relevant administrative bodies, statutory commissions, and local authorities in accordance with applicable Indian laws."
          </p>
        </div>
      </div>
    </main>
  )
}
