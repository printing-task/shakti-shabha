import { Link } from 'react-router-dom'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import CategoryPhotoStrip from '../components/CategoryPhotoStrip/CategoryPhotoStrip'
import b from './ShaktiBhavaPage.module.css'

export default function ShaktiBhavaPage() {
  return (
    <main className={b.page}>
      {/* ── TOP HERO BANNER ────────────────────────────────────────── */}
      <div className={b.hero}>
        <div className={b.heroInner}>
          <span className={b.badge}>02 · Consciousness · चेतना और संज्ञान</span>
          <h1 className={b.title}>Shakti Bhava</h1>
          <p className={b.hindiSubtitle}>शक्ति भव · Cognitive Awakening. Consciousness. Civilizational Awareness.</p>
          <p className={b.desc}>
            Shakti Bhava is Shakti Sabha’s youth-awareness and consciousness-building initiative. Its central purpose is to cultivate individuals who can think independently, examine social narratives, understand their cultural and intellectual roots, and make decisions through reason rather than social pressure or digital influence.
          </p>
        </div>
      </div>

      <div className={b.section}>
        {/* ── STATS ROW ──────────────────────────────────────────────── */}
        <div className={b.statsGrid}>
          <div className={b.statCard}>
            <div className={b.statNumber}>500+</div>
            <div className={b.statLabel}>Seminars &amp; Discourses</div>
            <div className={b.statDesc}>Institutional sessions and consciousness-building assemblies convened across India.</div>
          </div>
          <div className={b.statCard}>
            <div className={b.statNumber}>25,000+</div>
            <div className={b.statLabel}>Students Reached</div>
            <div className={b.statDesc}>Youth awareness initiatives across schools, colleges, universities, and residential hostels.</div>
          </div>
          <div className={b.statCard}>
            <div className={b.statNumber}>250+</div>
            <div className={b.statLabel}>Vulnerability Consultations</div>
            <div className={b.statDesc}>Frontline crisis mediations, counter-grooming de-escalations, and family reconciliations.</div>
          </div>
          <div className={b.statCard}>
            <div className={b.statNumber}>13</div>
            <div className={b.statLabel}>Minors Reintegrated</div>
            <div className={b.statDesc}>Timely safety interception, statutory handoff, and supervised legal guardianship.</div>
          </div>
        </div>

        {/* ── PHILOSOPHY OVERVIEW ───────────────────────────────────── */}
        <div className={b.overviewBox}>
          <span className={b.eyebrow}>The Thought Doctrine</span>
          <h2 className={b.heading} style={{ marginBottom: '1rem' }}>
            Cognitive Awakening Through Reason and Context
          </h2>
          <blockquote className={b.overviewQuote}>
            "Shakti Bhava does not seek to replace one form of unquestioned belief with another. It encourages young people to examine traditional and contemporary ideas through context, evidence, reason, and thoughtful dialogue.”
          </blockquote>
          <p className={b.overviewText}>
            Through institutional seminars, keynote sessions, symposiums, and interactive discourses, Shakti Bhava engages students and young people in conversations about identity, psychology, society, relationships, culture, history, and human consciousness across schools, colleges, universities, residential hostels, and tribal outreach corridors.
          </p>
        </div>

        {/* ── CORE AREAS OF ENGAGEMENT ──────────────────────────────── */}
        <div className={b.sectionHeader}>
          <span className={b.eyebrow}>Engagement Matrix</span>
          <h2 className={b.heading}>Six Core Areas of Engagement</h2>
          <p className={b.lead}>
            Equipping youth with the cognitive tools to navigate digital pressures, social conditioning, and personal responsibility.
          </p>
        </div>

        <div className={b.modalitiesGrid}>
          {/* 1. Intellectual Independence */}
          <div className={b.modalityCard}>
            <div className={b.modalityHeader}>
              <GoogleIcon name="lightbulb" size={28} style={{ color: '#059669' }} />
              <h3 className={b.modalityTitle}>1. Intellectual Independence</h3>
            </div>
            <p className={b.modalityDesc}>
              Encouraging young people to question assumptions, examine arguments, distinguish evidence from opinion, and develop sovereign, independent perspectives.
            </p>
          </div>

          {/* 2. Narrative Awareness */}
          <div className={b.modalityCard}>
            <div className={b.modalityHeader}>
              <GoogleIcon name="visibility" size={28} style={{ color: '#059669' }} />
              <h3 className={b.modalityTitle}>2. Narrative Awareness &amp; Critical Thinking</h3>
            </div>
            <p className={b.modalityDesc}>
              Helping participants understand how social narratives, media representation, digital algorithms, and ideological messaging can influence perceptions and public opinion.
            </p>
          </div>

          {/* 3. Civilizational Literacy */}
          <div className={b.modalityCard}>
            <div className={b.modalityHeader}>
              <GoogleIcon name="menu_book" size={28} style={{ color: '#059669' }} />
              <h3 className={b.modalityTitle}>3. Civilizational Literacy</h3>
            </div>
            <p className={b.modalityDesc}>
              Introducing young people to Indian philosophical traditions, historical knowledge, classical literature, and documented contributions to science, mathematics, medicine, and other fields.
            </p>
          </div>

          {/* 4. Human Consciousness */}
          <div className={b.modalityCard}>
            <div className={b.modalityHeader}>
              <GoogleIcon name="psychology" size={28} style={{ color: '#059669' }} />
              <h3 className={b.modalityTitle}>4. Human Consciousness &amp; Self-Understanding</h3>
            </div>
            <p className={b.modalityDesc}>
              Exploring the relationship between the mind, behaviour, identity, values, emotional awareness, and personal responsibility.
            </p>
          </div>

          {/* 5. Gender Understanding */}
          <div className={b.modalityCard}>
            <div className={b.modalityHeader}>
              <GoogleIcon name="handshake" size={28} style={{ color: '#059669' }} />
              <h3 className={b.modalityTitle}>5. Gender Understanding &amp; Social Responsibility</h3>
            </div>
            <p className={b.modalityDesc}>
              Promoting mutual dignity, healthy relationships, personal boundaries, accountability, and a culture that rejects exploitation and gender-based hostility.
            </p>
          </div>

          {/* 6. Beyond Consumerism */}
          <div className={b.modalityCard}>
            <div className={b.modalityHeader}>
              <GoogleIcon name="balance" size={28} style={{ color: '#059669' }} />
              <h3 className={b.modalityTitle}>6. Beyond Consumerism &amp; Polarization</h3>
            </div>
            <p className={b.modalityDesc}>
              Encouraging critical examination of hyper-consumerism, manufactured social divisions, identity-based polarization, and the pressures of contemporary digital culture.
            </p>
          </div>
        </div>

        {/* ── STATUTORY CONFIDENTIALITY DISCLAIMER ──────────────────── */}
        <div style={{
          background: '#F9FAFB',
          border: '1px solid #E5E7EB',
          borderRadius: 14,
          padding: '1.5rem',
          marginTop: '3rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: '#111827', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <GoogleIcon name="gavel" size={20} style={{ color: '#059669' }} />
            Institutional Note on Confidentiality &amp; Statutory Compliance
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.65 }}>
            "Shakti Sabha operates as a civil and community support initiative. Field interventions, crisis de-escalations, and family reconciliations are conducted with strict respect for the privacy, safety, and legal confidentiality of affected individuals and their guardians. All actions involving minors and high-risk statutory matters are routed through and coordinated with relevant administrative bodies, statutory commissions, and local authorities in accordance with applicable Indian laws."
          </p>
        </div>

        
        {/* Category Photo Vault */}
        <CategoryPhotoStrip
          categoryKeywords={['shakti-bhava', 'consciousness', 'survivor', 'healing']}
          title="Shakti Bhava Consciousness & Interventions Visuals"
          subtitle="Randomized authentic photography from emotional grounding circles, youth awakening discourses, and crisis mediations from the database."
          accentColor="#3D5A45"
        />

        {/* ── BOTTOM CTA ────────────────────────────────────────────── */}
        <div className={b.ctaCard}>
          <h3 className={b.ctaTitle}>Organize a Shakti Bhava Seminar</h3>
          <p className={b.ctaDesc}>
            Invite Shakti Sabha to host an interactive discourse or keynote session on narrative deconstruction and human consciousness at your institution.
          </p>
          <div className={b.ctaBtnRow}>
            <Link to="/counselling" className={b.btnPrimary}>
              Request Session or Guidance →
            </Link>
            <Link to="/about" className={b.btnSecondary}>
              Read Genesis &amp; Philosophy
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
