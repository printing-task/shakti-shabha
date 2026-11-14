import { Link } from 'react-router-dom'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import CategoryPhotoStrip from '../components/CategoryPhotoStrip/CategoryPhotoStrip'
import m from './MardiniPage.module.css'

export default function MardiniPage() {
  return (
    <main className={m.page}>
      {/* ── TOP HERO BANNER ────────────────────────────────────────── */}
      <div className={m.hero}>
        <div className={m.heroInner}>
          <span className={m.badge}>01 · Revolution · Physical Sovereignty</span>
          <h1 className={m.title}>Mission Mardini</h1>
          <p className={m.hindiSubtitle}>Mardini · Physical Sovereignty. Mental Resilience. Tactical Preparedness.</p>
          <p className={m.desc}>
            Mission Mardini is Shakti Sabha’s tactical self-defense and physical empowerment initiative for girls and women. Led by AARYAVEERA, the programme challenges passive approaches to self-defense by integrating physical training with psychological preparedness, situational awareness, discipline, and decision-making under pressure.
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.25rem 0.65rem', borderRadius: 999, fontSize: '0.74rem', color: '#FFFFFF' }}>
              Karate &amp; Empty-Hand Defense
            </span>
            <span style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.25rem 0.65rem', borderRadius: 999, fontSize: '0.74rem', color: '#FFFFFF' }}>
              Lathi-Kaushal Traditional Staff
            </span>
            <span style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.25rem 0.65rem', borderRadius: 999, fontSize: '0.74rem', color: '#FFFFFF' }}>
              Cognitive Threat Recognition
            </span>
            <span style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.25rem 0.65rem', borderRadius: 999, fontSize: '0.74rem', color: '#FFFFFF' }}>
              Tribal &amp; Rural Outreach
            </span>
          </div>
        </div>
      </div>

      <div className={m.section}>
        {/* ── STATS ROW ──────────────────────────────────────────────── */}
        <div className={m.statsGrid}>
          <div className={m.statCard}>
            <div className={m.statNumber}>2,000+</div>
            <div className={m.statLabel}>Girls Trained</div>
            <div className={m.statDesc}>Armed and unarmed self-defense awareness and practical street-safety training.</div>
          </div>
          <div className={m.statCard}>
            <div className={m.statNumber}>7–10 Days</div>
            <div className={m.statLabel}>Mardini Warrior Camps</div>
            <div className={m.statDesc}>Intensive physical confidence, mental resilience, and combat immersion camps.</div>
          </div>
          <div className={m.statCard}>
            <div className={m.statNumber}>Black Belt</div>
            <div className={m.statLabel}>Karate Combat Pedagogy</div>
            <div className={m.statDesc}>Led by Aaryaveera Harshita Mankar: martial discipline and bio-mechanical leverage.</div>
          </div>
          <div className={m.statCard}>
            <div className={m.statNumber}>Tribal &amp; Rural</div>
            <div className={m.statLabel}>Grassroots Outreach</div>
            <div className={m.statDesc}>Extending structured self-defense education beyond urban institutional environments.</div>
          </div>
        </div>

        {/* ── THE FOUNDATIONAL PRINCIPLE ────────────────────────────── */}
        <div className={m.doctrineBox}>
          <span className={m.eyebrow}>Foundational Principle</span>
          <h2 className={m.heading} style={{ marginBottom: '1rem' }}>
            Mental Composure Before Physical Capability
          </h2>
          <blockquote className={m.doctrineQuote}>
            "Before the body can respond, the mind must overcome fear. True empowerment requires the development of both mental composure and physical capability.”
          </blockquote>
          <p className={m.doctrineText}>
            Mission Mardini is designed for school students, teenage girls, university students, rural women, and participants from tribal and underserved communities. Rather than relying on rigid reactive maneuvers, participants learn situational boundary defense, managing the freeze response, and decisive bio-mechanical strikes to neutralize physical threats.
          </p>
        </div>

        {/* ── THE DUAL-SHIELD DOCTRINE ──────────────────────────────── */}
        <div className={m.sectionHeader}>
          <span className={m.eyebrow}>The Dual-Shield Doctrine</span>
          <h2 className={m.heading}>Cognitive &amp; Physical Defense Matrix</h2>
          <p className={m.lead}>
            A comprehensive two-shield architecture integrating cognitive threat mitigation with bio-mechanically optimized physical combat.
          </p>
        </div>

        <div className={m.tiersGrid}>
          {/* Shield One */}
          <div className={m.tierCard}>
            <span className={m.tierBadge} style={{ background: 'rgba(220,20,60,0.1)', color: '#DC143C' }}>
              Shield One · Cognitive De-escalation &amp; Situational Awareness
            </span>
            <h3 className={m.tierTitle}>Mental Radar &amp; Threat De-escalation</h3>
            <ul className={m.tierList}>
              <li className={m.tierItem}>
                <strong>Threat Recognition:</strong>
                Participants learn to recognize potentially unsafe situations, identify concerning behavioural patterns, understand personal boundaries, and recognize warning signs associated with stalking, grooming, coercion, and unwanted physical proximity.
              </li>
              <li className={m.tierItem}>
                <strong>Situational Awareness:</strong>
                Training develops environmental awareness, risk assessment, safe-distance management, and the ability to identify exit routes and seek assistance before a situation escalates.
              </li>
              <li className={m.tierItem}>
                <strong>Managing the Freeze Response:</strong>
                Participants learn practical techniques for managing fear and stress, improving their ability to think clearly, communicate boundaries, make decisions, and respond appropriately during threatening situations.
              </li>
              <li className={m.tierItem}>
                <strong>Psychological Preparedness:</strong>
                The objective is to replace helplessness with preparedness through guided exercises, scenario-based learning, and confidence-building activities.
              </li>
            </ul>
          </div>

          {/* Shield Two */}
          <div className={m.tierCard}>
            <span className={m.tierBadge} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
              Shield Two · Physical Defense &amp; Tactical Combat
            </span>
            <h3 className={m.tierTitle}>Physical Defense &amp; Martial Weapons</h3>
            <ul className={m.tierList}>
              <li className={m.tierItem}>
                <strong>Empty-Hand Defense:</strong>
                Participants learn foundational Karate-based defensive techniques, body mechanics, balance, movement, protective positioning, and practical responses to common physical threats.
              </li>
              <li className={m.tierItem}>
                <strong>Lathi-Kaushal (Traditional Staff Training):</strong>
                The programme introduces the Indian martial discipline of Lathi-Kaushal, adapting traditional staff techniques for personal protection, controlled movement, distance management, and defensive preparedness.
              </li>
              <li className={m.tierItem}>
                <strong>Traditional Weapon Awareness:</strong>
                Where appropriate and permitted, participants receive supervised instruction in traditional martial arts equipment, safety practices, handling discipline, and defensive awareness.
              </li>
              <li className={m.tierItem}>
                <strong>Close-Quarter Defense &amp; Escape Strategies:</strong>
                Participants develop foundational skills for responding to close-range physical threats, maintaining balance, creating distance, risk reduction, defensive decision-making, and swift emergency access to support.
              </li>
            </ul>
          </div>
        </div>

        {/* ── CAMPS & FIELD OUTREACH ─────────────────────────────────── */}
        <div className={m.campScheduleGrid}>
          <div className={m.scheduleCol}>
            <h4>
              <GoogleIcon name="holiday_village" size={22} style={{ color: '#DC143C' }} />
              Intensive 7–10 Day Mardini Camps
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#6B7280', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Mission Mardini organizes intensive training camps designed to develop physical confidence, mental resilience, discipline, and practical self-defense awareness.
            </p>
            <ul className={m.scheduleList}>
              <li className={m.scheduleItem}>
                <span>●</span>
                <div><strong>Karate &amp; Combat:</strong> Foundational combat training and balance drills.</div>
              </li>
              <li className={m.scheduleItem}>
                <span>●</span>
                <div><strong>Lathi-Kaushal:</strong> Traditional martial arts, staff footwork, and spatial perimeter management.</div>
              </li>
              <li className={m.scheduleItem}>
                <span>●</span>
                <div><strong>Situational Radar:</strong> Personal safety, threat boundary recognition, and escape routes.</div>
              </li>
              <li className={m.scheduleItem}>
                <span>●</span>
                <div><strong>Stress Management:</strong> Psychological preparedness and overcoming autonomic panic.</div>
              </li>
              <li className={m.scheduleItem}>
                <span>●</span>
                <div><strong>Simulations:</strong> Scenario-based learning, leadership, discipline, and guided exercises.</div>
              </li>
            </ul>
          </div>

          <div className={m.scheduleCol}>
            <h4>
              <GoogleIcon name="public" size={22} style={{ color: '#DC143C' }} />
              Institutional Collaborations &amp; Tribal Outreach
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#6B7280', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Extending training, guidance, and support beyond urban centers to ensure every girl develops sovereign self-reliance:
            </p>
            <ul className={m.scheduleList}>
              <li className={m.scheduleItem}>
                <span>✓</span>
                <div><strong>Institutional Partnerships:</strong> Collaborating with schools, colleges, residential hostels, and community organizations.</div>
              </li>
              <li className={m.scheduleItem}>
                <span>✓</span>
                <div><strong>Tribal &amp; Rural Corridors:</strong> Focused initiatives for young girls in tribal and underserved communities with limited access to safety education.</div>
              </li>
              <li className={m.scheduleItem}>
                <span>✓</span>
                <div><strong>Collaborative Initiatives:</strong> Expanding training and awareness networks across Maharashtra and beyond.</div>
              </li>
            </ul>
          </div>
        </div>

        
        {/* Category Photo Vault */}
        <CategoryPhotoStrip
          categoryKeywords={['mardini', 'lathi', 'combat', 'martial']}
          title="Mission Mardini Field & Training Visuals"
          subtitle="Randomized authentic documentation of lathi-kaushal staff drills, biomechanical combat, and residential warrior camps fetched directly from the database."
          accentColor="#DC143C"
        />

        {/* ── BOTTOM CTA ────────────────────────────────────────────── */}
        <div className={m.ctaCard}>
          <h3 className={m.ctaTitle}>Bring Mission Mardini to Your Campus or Village</h3>
          <p className={m.ctaDesc}>
            Organize an intensive 7–10 day Mardini camp or workshop at your school, college, hostel, or community setting.
          </p>
          <div className={m.ctaBtnRow}>
            <Link to="/events" className={m.btnPrimary}>
              Request Mardini Camp →
            </Link>
            <Link to="/courses" className={m.btnSecondary}>
              Explore Online Modules
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
