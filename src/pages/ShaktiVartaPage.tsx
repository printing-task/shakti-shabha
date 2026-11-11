import { Link } from 'react-router-dom'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import CategoryPhotoStrip from '../components/CategoryPhotoStrip/CategoryPhotoStrip'
import v from './ShaktiVartaPage.module.css'

export default function ShaktiVartaPage() {
  return (
    <main className={v.page}>
      {/* ── TOP HERO BANNER ────────────────────────────────────────── */}
      <div className={v.hero}>
        <div className={v.heroInner}>
          <span className={v.badge}>03 · Discourse · बौद्धिक विमर्श</span>
          <h1 className={v.title}>Shakti Varta</h1>
          <p className={v.hindiSubtitle}>शक्ति वार्ता · Intellectual Sovereignty. Critical Inquiry. Research-Based Dialogue.</p>
          <p className={v.desc}>
            Shakti Varta is Shakti Sabha’s intellectual research, mentorship, and public discourse initiative. It is not simply a digital library or a platform for publishing theoretical material. It is a practical learning environment where young women and youth are encouraged to develop critical thinking, research literacy, logical reasoning, and the confidence to question widely accepted narratives.
          </p>
        </div>
      </div>

      <div className={v.section}>
        {/* ── STATS ROW ──────────────────────────────────────────────── */}
        <div className={v.statsGrid}>
          <div className={v.statCard}>
            <div className={v.statNumber}>4 Pillars</div>
            <div className={v.statLabel}>Operational Infrastructure</div>
            <div className={v.statDesc}>Vedic Fellowship, Media Analysis, Youth Forums &amp; Digital Research.</div>
          </div>
          <div className={v.statCard}>
            <div className={v.statNumber}>Primary Sources</div>
            <div className={v.statLabel}>Direct Textual Inquiry</div>
            <div className={v.statDesc}>Direct engagement with the Vedas, Bhagavad Gita, and classical Sanskrit epistemology.</div>
          </div>
          <div className={v.statCard}>
            <div className={v.statNumber}>Uncensored</div>
            <div className={v.statLabel}>Forgotten Women Warriors</div>
            <div className={v.statDesc}>Rigorous epigraphical research uncovering Indian warrior women erased from colonial histories.</div>
          </div>
          <div className={v.statCard}>
            <div className={v.statNumber}>Global Reach</div>
            <div className={v.statLabel}>Digital Research Series</div>
            <div className={v.statDesc}>Short-form explainers, long-form lectures, podcasts, and media deconstruction forums.</div>
          </div>
        </div>

        {/* ── THE GUIDING PHILOSOPHY ─────────────────────────────────── */}
        <div className={v.overviewBox}>
          <span className={v.eyebrow}>The Thought Doctrine</span>
          <h2 className={v.heading} style={{ marginBottom: '1rem' }}>
            Neither Blind Orthodoxy Nor Blind Rejection
          </h2>
          <blockquote className={v.overviewQuote}>
            "Do not accept an idea merely because it is popular, traditional, modern, or influential. Examine its evidence, reasoning, context, and implications.”
          </blockquote>
          <p className={v.overviewText}>
            In an age of short-form content, algorithm-driven opinions, digital propaganda, and rapidly circulating misinformation, Shakti Varta equips young people with the intellectual tools required to investigate claims independently. We promote direct engagement with primary sources, historical records, philosophical texts, and contemporary scientific research.
          </p>
        </div>

        {/* ── THE FOUR OPERATIONAL PILLARS ──────────────────────────── */}
        <div className={v.sectionHeader}>
          <span className={v.eyebrow}>Operational Framework</span>
          <h2 className={v.heading}>The Four Operational Pillars of Shakti Varta</h2>
          <p className={v.lead}>
            Connecting timeless Indian knowledge systems with modern scientific forensics, digital literacy, and youth debates.
          </p>
        </div>

        <div className={v.wingsGrid}>
          {/* Pillar 1: Vedic Digital Fellowship */}
          <div className={v.wingCard}>
            <div className={v.wingHeader}>
              <GoogleIcon name="menu_book" size={28} style={{ color: '#4338CA' }} />
              <h3 className={v.wingTitle}>1. Vedic Digital Fellowship</h3>
            </div>
            <p className={v.wingDesc}>
              A guided intellectual fellowship connecting young women with foundational Indian philosophical and literary traditions:
            </p>
            <ul className={v.wingBullets}>
              <li className={v.wingBullet}>
                <span>●</span>
                <div><strong>Foundational Texts:</strong> Engaging with The Vedas, The Bhagavad Gita, The Mahabharata, Satyarth Prakash, and Nyaya Darshana.</div>
              </li>
              <li className={v.wingBullet}>
                <span>●</span>
                <div><strong>Critical Inquiry:</strong> The emphasis is not on passive memorization; participants examine original ideas, compare interpretations, and explore relevance to contemporary challenges.</div>
              </li>
              <li className={v.wingBullet}>
                <span>●</span>
                <div><strong>Intellectual Discipline:</strong> Cultivating research curiosity and the ability to engage with classical thought independently.</div>
              </li>
            </ul>
          </div>

          {/* Pillar 2: Critical Media Analysis */}
          <div className={v.wingCard}>
            <div className={v.wingHeader}>
              <GoogleIcon name="analytics" size={28} style={{ color: '#4338CA' }} />
              <h3 className={v.wingTitle}>2. Critical Media Analysis &amp; Narrative Deconstruction</h3>
            </div>
            <p className={v.wingDesc}>
              Practical tools for examining information and identifying misleading narratives in contemporary digital culture:
            </p>
            <ul className={v.wingBullets}>
              <li className={v.wingBullet}>
                <span>●</span>
                <div><strong>Forensic Verification:</strong> Fact-checking, source verification, and identifying logical fallacies.</div>
              </li>
              <li className={v.wingBullet}>
                <span>●</span>
                <div><strong>Algorithm Literacy:</strong> Understanding misinformation, manipulated content, outrage-driven communication, and algorithmic bias.</div>
              </li>
              <li className={v.wingBullet}>
                <span>●</span>
                <div><strong>Analytical Discernment:</strong> Distinguishing facts, interpretations, opinions, and propaganda beyond viral headlines.</div>
              </li>
            </ul>
          </div>

          {/* Pillar 3: Open-House Debates & Youth Ignite Forums */}
          <div className={v.wingCard}>
            <div className={v.wingHeader}>
              <GoogleIcon name="forum" size={28} style={{ color: '#4338CA' }} />
              <h3 className={v.wingTitle}>3. Open-House Debates &amp; Youth Ignite Forums</h3>
            </div>
            <p className={v.wingDesc}>
              Interactive online and offline discussions where participants can question, challenge, debate, and examine ideas respectfully:
            </p>
            <ul className={v.wingBullets}>
              <li className={v.wingBullet}>
                <span>●</span>
                <div><strong>Rational Dialogues:</strong> Exploring philosophical ideas, social customs, ethics, and superstition through reasoned textual inquiry.</div>
              </li>
              <li className={v.wingBullet}>
                <span>●</span>
                <div><strong>Knowledge Systems:</strong> Interdisciplinary dialogues between classical Indian knowledge and modern physics, psychology, and cognitive science.</div>
              </li>
              <li className={v.wingBullet}>
                <span>●</span>
                <div><strong>Forgotten Warriors:</strong> Exploring the lives, scholarship, and martial achievements of Indian women across historical periods.</div>
              </li>
            </ul>
          </div>

          {/* Pillar 4: Digital Research & Public Consciousness */}
          <div className={v.wingCard}>
            <div className={v.wingHeader}>
              <GoogleIcon name="podcasts" size={28} style={{ color: '#4338CA' }} />
              <h3 className={v.wingTitle}>4. Digital Research &amp; Public Consciousness</h3>
            </div>
            <p className={v.wingDesc}>
              Translating research, historical inquiry, and critical analysis into accessible digital educational formats:
            </p>
            <ul className={v.wingBullets}>
              <li className={v.wingBullet}>
                <span>●</span>
                <div><strong>Multi-Format Media:</strong> Short-form educational video series, long-form investigative discussions, and cultural explainers.</div>
              </li>
              <li className={v.wingBullet}>
                <span>●</span>
                <div><strong>Podcasts &amp; Lectures:</strong> Digital lectures, interviews, and media-literacy modules across YouTube, Spotify, and digital networks.</div>
              </li>
              <li className={v.wingBullet}>
                <span>●</span>
                <div><strong>Global Accessibility:</strong> Making serious intellectual inquiry accessible to young audiences across India and internationally.</div>
              </li>
            </ul>
          </div>
        </div>

        
        {/* Category Photo Vault */}
        <CategoryPhotoStrip
          categoryKeywords={['shakti-varta', 'seminar', 'discourse', 'research']}
          title="Shakti Varta Intellectual Discourses & Seminars"
          subtitle="Randomized archival photography from public symposiums, academic ignite forums, and research circles loaded dynamically from the database."
          accentColor="#C9A96E"
        />

        {/* ── BOTTOM CTA ────────────────────────────────────────────── */}
        <div className={v.ctaCard}>
          <h3 className={v.ctaTitle}>Participate in Shakti Varta Fellowships &amp; Debates</h3>
          <p className={v.ctaDesc}>
            Join our guided research circles, read foundational texts with scholars, or submit an essay to our public knowledge desk.
          </p>
          <div className={v.ctaBtnRow}>
            <Link to="/research" className={v.btnPrimary}>
              Explore Research &amp; White Papers →
            </Link>
            <Link to="/about" className={v.btnSecondary}>
              Read About Shakti Sabha
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
