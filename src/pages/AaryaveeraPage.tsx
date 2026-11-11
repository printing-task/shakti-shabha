import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import p from './AaryaveeraPage.module.css'

gsap.registerPlugin(ScrollTrigger)

/* ── Static data ─────────────────────────────────────────────────── */
const PRINCIPLES = [
  {
    num: '01',
    title: 'Intellectual Sovereignty',
    body:
      'The right and responsibility to examine ideas independently. No authority — religious, political, cultural, or social — should replace an individual\'s own reasoning and judgement.',
  },
  {
    num: '02',
    title: 'Strength with Responsibility',
    body:
      'Strength is not merely physical capability. It encompasses moral clarity, emotional regulation, and the willingness to bear responsibility for one\'s actions and their consequences.',
  },
  {
    num: '03',
    title: 'Inner Mastery',
    body:
      'Before exercising authority or influence over others, an individual must develop mastery over their own mind, emotions, impulses, and reactions.',
  },
  {
    num: '04',
    title: 'Civilisational Consciousness',
    body:
      'An awareness of one\'s cultural inheritance, history, and civilisational roots — understood critically, not blindly. Knowledge of the past to inform present decisions.',
  },
  {
    num: '05',
    title: 'Fearless Individuality',
    body:
      'The courage to hold and express one\'s convictions even under social pressure, ridicule, or opposition — provided those convictions have been arrived at through honest thought.',
  },
  {
    num: '06',
    title: 'Ethical Courage',
    body:
      'The willingness to act according to conscience, even when such action is difficult, unpopular, or personally costly. Courage that is grounded in ethics, not ego.',
  },
  {
    num: '07',
    title: 'Human Dignity & Mutual Respect',
    body:
      'Recognition of the fundamental worth of every human being. Strength that never degrades others. Power that is exercised with awareness of its effect on human dignity.',
  },
]

const WORLDVIEW_PAIRS = [
  ['Strength', 'without hatred or aggression'],
  ['Courage', 'without recklessness or ego'],
  ['Knowledge', 'without blind submission or false certainty'],
  ['Freedom', 'accompanied by responsibility'],
  ['Tradition', 'understood and examined, not blindly inherited'],
  ['Faith', 'that can withstand honest questioning'],
  ['Power', 'that serves human dignity, not merely personal interest'],
]

const SELF_QUESTIONS = [
  'Am I thinking for myself, or am I following because it feels safer to belong?',
  'Do I hold this belief because I have examined it, or because I was raised with it?',
  'Am I responding from genuine conviction, or from fear of judgement?',
  'Does my sense of strength come from growth and discipline, or from the diminishment of others?',
  'Am I willing to acknowledge when I am wrong, when I have acted poorly, or when I need to change?',
  'What kind of person am I becoming through the choices I make each day?',
]

/* ── Component ───────────────────────────────────────────────────── */
export default function AaryaveeraPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const principlesRef = useRef<HTMLDivElement>(null)

  /* page title */
  useEffect(() => {
    document.title = 'Aaryaveera | The Philosophy & Ideology of Harshita Mankar'
  }, [])

  /* hero fade-in */
  useEffect(() => {
    if (!heroRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.avHeroIn', {
        opacity: 0, y: 40, duration: 1.2, stagger: 0.18,
        ease: 'power3.out', delay: 0.2,
      })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  /* principles stagger */
  useEffect(() => {
    if (!principlesRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.avPCard', {
        opacity: 0, y: 30, duration: 0.8, stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: principlesRef.current,
          start: 'top 80%',
        },
      })
    }, principlesRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className={p.page}>

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className={p.hero} ref={heroRef}>
        {/* flame-lotus emblem (pure CSS / SVG inline) */}
        <div className={p.heroEmblem} aria-hidden="true">
          <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={p.emblemSvg}>
            {/* Flame */}
            <path d="M60 10 C55 30 38 38 40 60 C42 80 55 88 60 100 C65 88 78 80 80 60 C82 38 65 30 60 10Z"
              fill="#C2410C" opacity="0.85"/>
            <path d="M60 25 C57 40 48 46 49 60 C50 74 57 80 60 90 C63 80 70 74 71 60 C72 46 63 40 60 25Z"
              fill="#C9A96E" opacity="0.7"/>
            {/* Lotus petals */}
            <ellipse cx="60" cy="115" rx="8" ry="14" fill="#14532D" opacity="0.8" transform="rotate(-30 60 115) translate(-10,0)"/>
            <ellipse cx="60" cy="115" rx="8" ry="14" fill="#14532D" opacity="0.9"/>
            <ellipse cx="60" cy="115" rx="8" ry="14" fill="#14532D" opacity="0.8" transform="rotate(30 60 115) translate(10,0)"/>
            <ellipse cx="60" cy="115" rx="6" ry="12" fill="#1a6535" opacity="0.6" transform="rotate(-55 60 115) translate(-16,2)"/>
            <ellipse cx="60" cy="115" rx="6" ry="12" fill="#1a6535" opacity="0.6" transform="rotate(55 60 115) translate(16,2)"/>
          </svg>
        </div>

        <div className={p.heroContent}>
          <p className={`${p.heroEyebrow} avHeroIn`}>The Philosophy &amp; Ideology of Harshita Mankar</p>
          <h1 className={`${p.heroTitle} avHeroIn`}>AARYAVEERA</h1>
          <p className={`${p.heroTagline} avHeroIn`}>
            The Identity. The Philosophy. The Consciousness.
          </p>
          <div className={`${p.heroDivider} avHeroIn`} aria-hidden="true" />

          {/* Explicit Institutional Distinction Callout */}
          <div className="avHeroIn" style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.85rem',
            background: 'rgba(194, 65, 12, 0.06)',
            border: '1px solid rgba(194, 65, 12, 0.25)',
            borderRadius: '9999px',
            padding: '0.5rem 1.4rem',
            margin: '0.85rem 0 1.5rem',
            fontSize: '0.88rem',
            color: '#92400E',
            flexWrap: 'wrap',
            textAlign: 'center'
          }}>
            <span style={{ fontWeight: 700 }}>शक्ति सभा — संस्थागत ढांचा</span>
            <span style={{ color: '#C2410C' }}>•</span>
            <span style={{ fontWeight: 700 }}>आर्यवीरा — मूल दर्शन</span>
          </div>

          <p className={`${p.heroBody} avHeroIn`}>
            <strong>Aaryaveera is the Founder</strong> — not an event, camp, or operational program.
            It represents the personal ideological identity and life philosophy of Harshita Mankar:
            a way of thinking and living shaped by courage, wisdom, discipline,
            self-mastery, intellectual independence, and a deep sense of responsibility.
          </p>
          <p className={`${p.heroBody} avHeroIn`}>
            It is a philosophy that believes in strength without arrogance, courage without hatred,
            knowledge without blind submission, and freedom accompanied by responsibility.
          </p>
          <p className={`${p.heroMotto} avHeroIn`}>
            "The Fire to Stand. The Wisdom to Rise."
          </p>
        </div>
      </section>

      {/* ── 2. WHAT IS AARYAVEERA ───────────────────────────────── */}
      <section className={p.duality}>
        <div className={p.container}>
          <p className={p.sectionEyebrow}>More Than a Name</p>
          <h2 className={p.sectionTitle}>A Way of Being</h2>
          <p className={p.sectionIntro}>
            Aaryaveera is the philosophical expression of Harshita Mankar's worldview.
            It reflects her understanding of human strength, dignity, knowledge, courage,
            and individual responsibility. The identity brings together two symbolic ideas.
          </p>

          <div className={p.dualityGrid}>
            <div className={p.dualityCard}>
              <span className={p.dualityLetter}>AARYA</span>
              <p className={p.dualityMeaning}>
                Nobility of thought, wisdom, discernment, dignity, ethical conduct,
                and the pursuit of truth.
              </p>
            </div>
            <div className={p.dualityPlus} aria-hidden="true">+</div>
            <div className={p.dualityCard}>
              <span className={p.dualityLetter}>VEERA</span>
              <p className={p.dualityMeaning}>
                Courage, determination, fearlessness, resilience, and the willingness
                to stand for what is right.
              </p>
            </div>
          </div>

          <p className={p.dualityClose}>
            Together, Aaryaveera represents an individual who does not surrender their judgement
            to fear, social pressure, blind traditions, or popular opinion.
            It is the pursuit of a life in which thought is independent, action is responsible,
            strength is disciplined, and character remains grounded in ethical principles.
          </p>
        </div>
      </section>

      {/* ── 3. PERSONAL PHILOSOPHY ──────────────────────────────── */}
      <section className={p.philosophy}>
        <div className={p.container}>
          <p className={p.sectionEyebrow}>Harshita Mankar</p>
          <h2 className={p.sectionTitle}>A Mind That Questions. A Spirit That Acts.</h2>
          <div className={p.philosophyGrid}>
            <div className={p.philosophyCol}>
              <p>
                Harshita Mankar's philosophy emerges from a foundational conviction: the cultivation of independent thought, psychological resilience, and sovereign self-mastery.
              </p>
              <p>
                A person should not accept an idea merely because it is popular, traditional,
                modern, religious, political, or presented by someone in authority.
                Every idea deserves thoughtful examination. Every belief must be understood in
                its context. Every action must be evaluated through reason, ethics, and
                its consequences.
              </p>
            </div>
            <div className={p.philosophyCol}>
              <p>
                For Harshita, strength is not measured only through physical capability.
                It is also reflected in the ability to remain composed under pressure,
                recognise manipulation, question injustice, control one's reactions,
                and make difficult decisions with clarity.
              </p>
              <p>
                Her philosophy brings together physical discipline, intellectual independence,
                emotional awareness, cultural understanding, and ethical responsibility.
                It does not encourage hatred, isolation, superiority, or the rejection of
                compassion. It asks, instead, for courage — the courage to think clearly,
                act honestly, and take responsibility for one's own life.
              </p>
            </div>
          </div>

          {/* Concluding Central Conviction Shown in Last */}
          <div className={p.philosophyQuoteBox}>
            <blockquote className={p.pullQuote}>
              "Human beings must learn to become conscious participants in their own lives rather than passive followers of external influence."
            </blockquote>
            <p className={p.pullAttrib}>— Harshita Mankar</p>
          </div>
        </div>
      </section>

      {/* ── 4. PAURUSH & KSHATRA-DHARMA ─────────────────────────── */}
      <section className={p.paurush}>
        <div className={p.container}>
          <p className={p.sectionEyebrow}>Civilisational Concept</p>
          <h2 className={p.sectionTitle}>Paurush &amp; Kshatra-Dharma</h2>
          <p className={p.sectionIntro}>
            Aaryaveera draws upon the ancient Indian understanding of <em>Paurush</em> —
            a quality of character that encompasses courage, discipline, moral strength,
            and the capacity to act under pressure with clarity and restraint.
            It is paired with <em>Kshatra-Dharma</em>: the responsibility to protect,
            the courage to confront injustice, the discipline to exercise power responsibly,
            and the wisdom to distinguish strength from aggression.
          </p>
          <div className={p.paurushGrid}>
            {[
              { icon: '⚔', label: 'Courage', desc: 'The willingness to face difficulty, danger, and moral challenge without retreat.' },
              { icon: '⚖', label: 'Discipline', desc: 'Consistent practice, self-regulation, and alignment between values and daily conduct.' },
              { icon: '🛡', label: 'Restraint', desc: 'The ability to hold power without misusing it. Strength that knows its boundaries.' },
              { icon: '🤝', label: 'Responsibility', desc: 'Accepting accountability for one\'s actions and their impact on others.' },
              { icon: '🔥', label: 'Protection', desc: 'The duty to protect those who are vulnerable — not as control, but as guardianship.' },
              { icon: '🧘', label: 'Self-Mastery', desc: 'Governance of one\'s own mind and emotions before seeking to guide others.' },
              { icon: '📿', label: 'Integrity', desc: 'Alignment between stated values and actual conduct — in public and in private.' },
            ].map(item => (
              <div key={item.label} className={p.paurushCard}>
                <span className={p.paurushIcon}>{item.icon}</span>
                <strong className={p.paurushLabel}>{item.label}</strong>
                <p className={p.paurushDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. FLAME & LOTUS SYMBOLISM ──────────────────────────── */}
      <section className={p.symbolism}>
        <div className={p.container}>
          <p className={p.sectionEyebrow}>Visual Philosophy</p>
          <h2 className={p.sectionTitle}>The Flame &amp; The Lotus</h2>
          <p className={p.sectionIntro}>
            The Aaryaveera emblem combines two ancient symbols: the flame and the lotus.
            Together they represent the union of courageous action and disciplined wisdom.
          </p>
          <div className={p.symbolGrid}>
            <div className={p.symbolCard}>
              <div className={p.symbolIcon} style={{ color: '#C2410C' }}>🔥</div>
              <h3 className={p.symbolName}>The Flame</h3>
              <ul className={p.symbolList}>
                <li>Courage and action</li>
                <li>The refusal to remain passive in the face of injustice</li>
                <li>Internal transformation through discipline</li>
                <li>The burning away of false beliefs and conditioned fear</li>
                <li>Protective fire — not destructive, but purifying</li>
              </ul>
            </div>
            <div className={p.symbolCard}>
              <div className={p.symbolIcon} style={{ color: '#14532D' }}>🪷</div>
              <h3 className={p.symbolName}>The Lotus</h3>
              <ul className={p.symbolList}>
                <li>Wisdom rising through difficulty</li>
                <li>The ability to remain rooted in values amid chaos</li>
                <li>Beauty and grace cultivated through honest struggle</li>
                <li>Spiritual and intellectual clarity</li>
                <li>Non-attachment — strength without clinging to outcomes</li>
              </ul>
            </div>
          </div>
          <p className={p.symbolUnion}>
            The union of these two symbols reflects the Aaryaveera philosophy itself:
            the fire to stand for what is right, and the wisdom to understand what is truly right.
          </p>
        </div>
      </section>

      {/* ── 6. 7 CORE PRINCIPLES ────────────────────────────────── */}
      <section className={p.principles} ref={principlesRef}>
        <div className={p.container}>
          <p className={p.sectionEyebrow}>The Foundation</p>
          <h2 className={p.sectionTitle}>Seven Core Principles</h2>
          <div className={p.principlesGrid}>
            {PRINCIPLES.map(pr => (
              <div key={pr.num} className={`${p.principleCard} avPCard`}>
                <span className={p.principleNum}>{pr.num}</span>
                <h3 className={p.principleTitle}>{pr.title}</h3>
                <p className={p.principleBody}>{pr.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. THE WORLDVIEW ────────────────────────────────────── */}
      <section className={p.worldview}>
        <div className={p.container}>
          <p className={p.sectionEyebrow}>A Philosophical Orientation</p>
          <h2 className={p.sectionTitle}>The Aaryaveera Worldview</h2>
          <div className={p.worldviewGrid}>
            {WORLDVIEW_PAIRS.map(([word, rest]) => (
              <div key={word} className={p.worldviewRow}>
                <span className={p.worldviewWord}>{word}</span>
                <span className={p.worldviewRest}>{rest}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. AARYAVEERA & SHAKTI SABHA DISTINCTION ────────────── */}
      <section className={p.distinction}>
        <div className={p.container}>
          <p className={p.sectionEyebrow}>Understanding the Relationship</p>
          <h2 className={p.sectionTitle}>Aaryaveera and Shakti Sabha</h2>
          <div className={p.distinctionGrid}>
            <div className={p.distinctionBlock}>
              <h3 className={p.distinctionLabel}>आर्यवीरा (Aaryaveera) — फाउंडर दर्शन</h3>
              <p>
                Aaryaveera is the <strong>personal philosophical identity</strong> of
                founder Harshita Mankar. It is not an organisation, a programme, an event, a camp,
                or a stream of work. It is her worldview — the foundational lens through which she
                thinks, makes decisions, and approaches civilizational responsibility.
              </p>
              <p>
                It is not a separate operational stream alongside Mission Mardini, Shakti Bhava,
                and Shakti Varta. It is the underlying philosophy that inspires all of them.
              </p>
            </div>
            <div className={p.distinctionArrow} aria-hidden="true">→</div>
            <div className={p.distinctionBlock}>
              <h3 className={p.distinctionLabel}>शक्ति सभा (Shakti Sabha) — संस्थागत ढांचा</h3>
              <p>
                Shakti Sabha is the <strong>institutional body (संस्थागत ढांचा)</strong> through which
                Harshita Mankar translates her philosophy into structured, public-facing
                programmes and community initiatives.
              </p>
              <p>
                The three streams — Mission Mardini, Shakti Bhava, and Shakti Varta —
                are the operational expressions of the Aaryaveera philosophy made
                accessible to on-ground communities.
              </p>
            </div>
          </div>
          <p className={p.distinctionNote}>
            Aaryaveera does not ask anyone to follow a personality blindly.
            It encourages people to develop the ability to think, question, understand,
            and take responsibility for their own choices.
          </p>
        </div>
      </section>

      {/* ── 9. A PHILOSOPHY THAT ENCOURAGES QUESTIONS ───────────── */}
      <section className={p.questions}>
        <div className={p.container}>
          <p className={p.sectionEyebrow}>Self-Examination</p>
          <h2 className={p.sectionTitle}>A Philosophy That Encourages Questions</h2>
          <p className={p.sectionIntro}>
            Aaryaveera does not present itself as a final answer. It is a philosophy that
            invites the individual into an honest process of self-examination. These are
            among the questions it encourages every person to consider:
          </p>
          <div className={p.questionsGrid}>
            {SELF_QUESTIONS.map((q, i) => (
              <div key={i} className={p.questionCard}>
                <span className={p.questionMark}>&ldquo;</span>
                <p className={p.questionText}>{q}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. VISION & CLOSING ─────────────────────────────────── */}
      <section className={p.closing}>
        <div className={p.container}>
          <div className={p.closingEmblem} aria-hidden="true">🔥🪷</div>
          <h2 className={p.closingTitle}>The Fire to Stand.<br />The Wisdom to Rise.</h2>
          <p className={p.closingBody}>
            Aaryaveera is Harshita Mankar's vision of what a human being can become when
            they choose to pursue strength with responsibility, courage with conscience,
            and knowledge with honesty.
          </p>
          <p className={p.closingBody}>
            It is not a destination. It is a direction — one that must be chosen again
            each day, through every decision, in every act of integrity and every moment
            of honest self-examination.
          </p>
          <div className={p.closingLinks}>
            <Link to="/about" className={p.closingLink}>About Harshita Mankar</Link>
            <Link to="/three-streams" className={p.closingLinkSec}>Explore Shakti Sabha's Work</Link>
          </div>
        </div>
      </section>

    </div>
  )
}
