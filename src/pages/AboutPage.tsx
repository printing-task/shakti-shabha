import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getFounderData, fetchFounderData, FounderProfileData, DEFAULT_FOUNDER_DATA } from '../data/founderData'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import p from './AboutPage.module.css'

gsap.registerPlugin(ScrollTrigger)

const FOUNDER_METRICS = [
  {
    icon: 'sports_martial_arts',
    title: 'Black Belt in Karate',
    desc: 'Martial arts discipline, self-defence and physical preparedness training.'
  },
  {
    icon: 'swords',
    title: '2,000+ Girls Engaged Through Training & Programmes',
    desc: 'Practical self-defence, situational awareness and confidence-building programmes for girls and women.'
  },
  {
    icon: 'record_voice_over',
    title: '500+ Educational Sessions',
    desc: 'Institutional sessions, youth awareness programmes, and consciousness-building dialogues.'
  },
  {
    icon: 'school',
    title: '25,000+ Young People Reached',
    desc: 'Youth engagement sessions across educational and community platforms.'
  },
  {
    icon: 'holiday_village',
    title: 'Mission Mardini',
    desc: 'Practical self-defence, situational awareness and confidence-building programmes for girls and women.'
  },
  {
    icon: 'nature_people',
    title: 'Community & Tribal Outreach',
    desc: 'Educational, awareness and empowerment initiatives with young people and underserved communities.'
  },
  {
    icon: 'hub',
    title: 'Collaborative Initiatives',
    desc: 'Working with educational institutions, community organisations and public forums.'
  }
]

const TACTICAL_INTERVENTIONS = [
  {
    icon: 'child_care',
    title: '1. Vulnerability Interception & Child Protection Coordination',
    desc: 'Interventions in this sphere address acute vulnerability, runaway minors at transit hubs, and distress situations where young girls face immediate risk of exploitation or informal cross-district trade.',
    bullets: [
      'Operational Methodology: Works directly at the grassroots and transit points (railway nodes, community perimeters) to intercept minors before predatory entrapment occurs.',
      'Strict adherence to statutory child-protection frameworks facilitating immediate communication with statutory authorities, Child Welfare Committees (CWC), National/State Commission for Women, and authorized shelter networks.',
      'Documented Footprint: Directly facilitated the timely safety interception, statutory handoff, and supervised reintegration of vulnerable minors into verified legal guardianship and safe academic environments.'
    ]
  },
  {
    icon: 'shield',
    title: '2. Interpersonal Coercion, Digital Pressure & Pre-FIR Family Mediation',
    desc: 'Handling complex community and campus scenarios involving identity deception, peer-driven entrapment, digital harassment, and high-pressure interpersonal coercion.',
    bullets: [
      'Operational Methodology: Recognizing that families in distress cases often avoid formal litigation due to acute social vulnerability and fear of exposure, acts as a trusted community mediator.',
      'Intervenes directly in campus and residential hostel settings to break cycles of digital coercion and isolation.',
      'Conducts direct, non-adversarial dialogue with families and young women to resolve high-risk situations before irreversible harm occurs.',
      'Coordinates with local civic leadership, community elders, and statutory helplines to resolve conflict peacefully.',
      'Documented Footprint: Handled over 250 reported distress consultations, actively conducting direct field-level safety mediations and pre-emptive family reintegrations in 50+ critical situations.'
    ]
  },
  {
    icon: 'psychology',
    title: '3. Counselling & Psychosocial Awareness',
    desc: 'Supporting young girls and women dealing with stress, interpersonal distress, learned helplessness, and street-level anxiety.',
    bullets: [
      'Counselling support and awareness-based conversations, with appropriate referral where specialised professional care is required.',
      'Training in body-language observation: She has undertaken additional training in counselling, behavioural observation and body-language awareness.',
      'Private, sensitive conversational support to relieve irrational guilt, internalized shame, and fear of judgment.',
      'Facilitating safe academic support, educational guidance, and vocational anchoring where prolonged domestic friction prevents an immediate peaceful resolution at home.',
      'Core Principle: “We believe in strength without hostility, knowledge without dogma, and freedom with responsibility.”'
    ]
  }
]

const CURRICULUM_TIERS = [
  {
    tier: 'Pillar One · Cognitive & Situational Awareness',
    title: 'Situational Awareness & Personal Safety',
    items: [
      {
        head: 'Threat Recognition & Boundary Setting',
        body: 'Participants learn to recognize potentially unsafe situations, identify concerning behavioural patterns, understand personal boundaries, and recognize warning signs associated with stalking, coercion, and unwanted physical proximity.'
      },
      {
        head: 'Environmental & Situational Awareness',
        body: 'Training develops environmental awareness, risk assessment, safe-distance management, and the ability to identify exit routes and seek assistance before a situation escalates.'
      },
      {
        head: 'Managing Stress & Freeze Response',
        body: 'Participants learn practical techniques for managing fear and stress, improving their ability to think clearly, communicate boundaries, make decisions, and respond appropriately during difficult situations.'
      },
      {
        head: 'Psychological Preparedness',
        body: 'The objective is to replace helplessness with preparedness through guided exercises, scenario-based learning, and confidence-building activities.'
      }
    ]
  },
  {
    tier: 'Pillar Two · Self-Defence & Physical Preparedness',
    title: 'Self-Defence & Physical Preparedness Training',
    items: [
      {
        head: 'Empty-Hand Defensive Biomechanics',
        body: 'Participants learn foundational Karate-based defensive techniques, body mechanics, balance, movement, protective positioning, and practical responses to physical threats.'
      },
      {
        head: 'Lathi-Kaushal: Traditional Staff Training',
        body: 'The programme introduces the Indian martial discipline of Lathi-Kaushal, adapting traditional staff techniques for personal protection, controlled movement, distance management, and defensive preparedness.'
      },
      {
        head: 'Traditional Martial Discipline',
        body: 'Where appropriate and permitted, participants receive supervised instruction in traditional martial arts equipment, safety practices, handling discipline, and defensive awareness.'
      },
      {
        head: 'Close-Quarter Defense & Escape',
        body: 'Participants develop foundational skills for responding to close-range physical threats, maintaining balance, creating distance, emergency communication, and swift access to support.'
      }
    ]
  }
]

const PILLARS_IN_ACTION = [
  {
    icon: 'swords',
    name: 'Mission Mardini',
    sub: 'Self-Defence & Physical Preparedness',
    color: '#bd1834',
    dedicatedLink: '/mardini',
    dedicatedLabel: 'Explore Mission Mardini Page →',
    desc: 'Practical self-defence, situational awareness and confidence-building programmes for girls and women, integrating physical preparedness with responsible action.',
    bullets: [
      'Dual focus: Situational Awareness & Personal Safety + Self-Defence & Physical Preparedness.',
      'Structured residential training camps with martial discipline and scenario-based learning.',
      'Community and tribal outreach making practical self-defence training accessible across diverse environments.'
    ]
  },
  {
    icon: 'spa',
    name: 'Shakti Bhava',
    sub: 'Counselling & Psychosocial Awareness',
    color: '#059669',
    dedicatedLink: '/shakti-bhava',
    dedicatedLabel: 'Explore Shakti Bhava Page →',
    desc: 'Counselling support, psychological awareness, and emotional resilience circles helping individuals develop clarity of thought and emotional composure.',
    bullets: [
      '500+ educational sessions and awareness dialogues reaching 25,000+ young people.',
      'Key focus in critical inquiry, psychological awareness, cultural literacy, and responsible citizenship.',
      'Promotes mutual dignity, healthy personal boundaries, personal responsibility, and thoughtful dialogue.'
    ]
  },
  {
    icon: 'menu_book',
    name: 'Shakti Varta',
    sub: 'Research, Critical Inquiry & Public Dialogue',
    color: '#4338CA',
    dedicatedLink: '/shakti-varta',
    dedicatedLabel: 'Explore Shakti Varta Page →',
    desc: 'A practical learning environment where youth and scholars are equipped with critical thinking, research literacy, and primary source study.',
    bullets: [
      'Cultural & Epigraphical Study: Engaging with Indian thought, civilizational heritage, and historical source materials.',
      'Critical Media & Information Literacy: Source verification, logical reasoning, and independent thinking.',
      'Open-House Debates & Youth Forums: Responsible philosophical dialogues, historical role models, and constructive public discussions.'
    ]
  }
]

const TIMELINE = [
  {
    year: '2021',
    title: 'Early Programmes & Field Engagement',
    desc: 'Shakti Sabha’s programmes and field engagement began taking shape through educational initiatives, women’s empowerment activities, youth engagement and community programmes.'
  },
  {
    year: '2022',
    title: 'Programmes & Community Engagement',
    desc: 'The work continued through school and college programmes, awareness sessions, training activities and direct engagement with young people and communities.'
  },
  {
    year: '2023',
    title: 'Expanding the Work',
    desc: 'The growing body of field experience, public engagement and independent study began shaping the broader philosophy and direction of Shakti Sabha.'
  },
  {
    year: '2024',
    title: 'Wider Educational & Community Reach',
    desc: 'Programmes expanded across educational and community settings, with a continued focus on women’s empowerment, youth development, awareness and practical preparedness.'
  },
  {
    year: '2025',
    title: 'Consolidating Experience & Knowledge',
    desc: 'Years of field experience were increasingly connected with study, writing, public dialogue and the development of structured programmes.'
  },
  {
    year: '2026',
    title: 'Formal Institutional Registration',
    desc: 'Shakti Sabha was formally registered as an institution, providing an institutional structure for the work and programmes developed over the preceding years.'
  }
]

const CORE_VALUES = [
  {
    num: '01',
    icon: 'balance',
    name: 'Courage & Responsibility',
    dev: 'Restraint, Responsibility & Dignity',
    desc: 'Courage is meaningful when it is guided by restraint, responsibility and respect for human dignity.'
  },
  {
    num: '02',
    icon: 'psychology',
    name: 'Knowledge & Critical Inquiry',
    dev: 'Evidence, Questioning & Independence',
    desc: 'We value evidence, questioning and independent thought. Tradition may inform inquiry, but it does not replace it.'
  },
  {
    num: '03',
    icon: 'shield',
    name: 'Strength & Preparedness',
    dev: 'Confidence, Awareness & Action',
    desc: 'Physical and mental preparedness can strengthen confidence, awareness and the ability to respond responsibly in difficult situations.'
  },
  {
    num: '04',
    icon: 'spa',
    name: 'Dignity & Human Consciousness',
    dev: 'Agency, Dignity & Potential',
    desc: 'Empowerment begins with recognising the dignity, agency and potential of every individual.'
  },
  {
    num: '05',
    icon: 'handshake',
    name: 'Peace & Responsible Action',
    dev: 'Dialogue, Protection & Mutual Respect',
    desc: 'We believe that strength should protect rather than intimidate, and that meaningful social change must remain grounded in responsibility, dialogue and human dignity.'
  }
]

export interface SocialAccountItem {
  name: string
  handle: string
  url: string
  tag: string
  iconType: 'youtube' | 'instagram' | 'facebook' | 'twitter' | 'pinterest' | 'website'
  color: string
}

export interface SocialCategoryShowcase {
  id: string
  num: string
  title: string
  subtitle: string
  gradient: string
  images: [string, string, string, string]
  accounts: SocialAccountItem[]
}

export const SOCIAL_SHOWCASE_CATEGORIES: SocialCategoryShowcase[] = [
  {
    id: 'youtube',
    num: '01',
    title: 'YouTube',
    subtitle: 'Video Discourses & Educational Sessions',
    gradient: 'linear-gradient(45deg, #FF0000, #FF5E62)',
    images: [
      '/20260517_120756.jpg',
      '/IMG_20260908_201306.jpg',
      '/missionmirdani.jpg',
      '/sahog.jpg'
    ],
    accounts: [
      {
        name: 'Aaryaveera',
        handle: '@aaryaveeraa',
        url: 'https://youtube.com/@aaryaveeraa?si=',
        tag: 'Official Video Channel',
        iconType: 'youtube',
        color: '#FF0000'
      }
    ]
  },
  {
    id: 'instagram',
    num: '02',
    title: 'Instagram',
    subtitle: 'Visual Updates & Community Work',
    gradient: 'linear-gradient(45deg, #f09433, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    images: [
      '/20260517_120756.jpg',
      '/IMG_20260908_201306.jpg',
      '/missionmirdani.jpg',
      '/socialworkk.jpg'
    ],
    accounts: [
      {
        name: 'Aaryaveera',
        handle: '@aaryaveera',
        url: 'https://www.instagram.com/aaryaveera?exln=dTB1MXQ3eWF5NGl6',
        tag: 'Founder Channel',
        iconType: 'instagram',
        color: '#E1306C'
      },
      {
        name: 'The Aaryaveera',
        handle: '@theaaryaveera',
        url: 'https://www.instagram.com/theaaryaveera?mdxt=c25ybWV4bzkzNXZr',
        tag: 'Youth Cadre',
        iconType: 'instagram',
        color: '#E1306C'
      },
      {
        name: 'Shakti Sabha',
        handle: '@shaktisabha',
        url: 'https://www.instagram.com/shaktisabha?exln=MWhtaWwwZDZmamI5',
        tag: 'Institutional Body',
        iconType: 'instagram',
        color: '#bd1834'
      }
    ]
  },
  {
    id: 'facebook',
    num: '03',
    title: 'Facebook',
    subtitle: 'Community Programmes & Family Outreach',
    gradient: 'linear-gradient(45deg, #1877F2, #00C6FF)',
    images: [
      '/shaktivarta.jpg',
      '/shaktibhava.jpg',
      '/20260517_120756.jpg',
      '/sahog.jpg'
    ],
    accounts: [
      {
        name: 'Shakti Sabha',
        handle: 'Shakti Sabha Official',
        url: 'https://www.facebook.com/share/1CbJnBXKHQ/',
        tag: 'Official Community',
        iconType: 'facebook',
        color: '#1877F2'
      },
      {
        name: 'Aaryaveera',
        handle: 'Aaryaveera Movement',
        url: 'https://www.facebook.com/share/14qXzYydVzv/',
        tag: 'Movement Page',
        iconType: 'facebook',
        color: '#1877F2'
      }
    ]
  },
  {
    id: 'twitter',
    num: '04',
    title: 'Twitter · X',
    subtitle: 'Research Briefs & Public Dialogue',
    gradient: 'linear-gradient(45deg, #E2E8F0, #94A3B8)',
    images: [
      '/IMG_20260908_201306.jpg',
      '/missionmirdani.jpg',
      '/20260517_120756.jpg',
      '/socialworkk.jpg'
    ],
    accounts: [
      {
        name: 'The Aaryaveera',
        handle: '@TheAaryaveera',
        url: 'https://x.com/TheAaryaveera?s=20',
        tag: 'Direct Dispatches',
        iconType: 'twitter',
        color: '#111827'
      }
    ]
  },
  {
    id: 'pinterest',
    num: '05',
    title: 'Pinterest',
    subtitle: 'Visual Guides & Documentation',
    gradient: 'linear-gradient(45deg, #BD081C, #FF4B2B)',
    images: [
      '/missionmirdani.jpg',
      '/shaktibhava.jpg',
      '/shaktivarta.jpg',
      '/20260517_120756.jpg'
    ],
    accounts: [
      {
        name: 'Aaryaveera & Shakti Sabha',
        handle: 'pin.it/5DFgIhdKj',
        url: 'https://pin.it/5DFgIhdKj',
        tag: 'Visual Archives',
        iconType: 'pinterest',
        color: '#BD081C'
      }
    ]
  },
  {
    id: 'website',
    num: '06',
    title: 'Official Web',
    subtitle: 'Founder Portal & Institutional Vision',
    gradient: 'linear-gradient(45deg, #D4AF37, #FF8C00)',
    images: [
      '/20260517_120756.jpg',
      '/IMG_20260908_201306.jpg',
      '/missionmirdani.jpg',
      '/shaktivarta.jpg'
    ],
    accounts: [
      {
        name: 'Aaryaveera Portal',
        handle: 'www.aaryaveera.com',
        url: 'https://www.aaryaveera.com',
        tag: 'Founder Worldview',
        iconType: 'website',
        color: '#D4AF37'
      }
    ]
  }
]

function renderSocialIcon(type: string, size = 18) {
  switch (type) {
    case 'youtube':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    case 'instagram':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    case 'facebook':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    case 'twitter':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    case 'pinterest':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.224-.177.271-.409.164-1.523-.709-2.476-2.935-2.476-4.723 0-3.845 2.793-7.377 8.06-7.377 4.232 0 7.521 3.017 7.521 7.047 0 4.205-2.651 7.589-6.331 7.589-1.236 0-2.399-.643-2.796-1.403l-.761 2.898c-.276 1.054-1.026 2.376-1.528 3.183C9.576 23.824 10.767 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
        </svg>
      )
    default:
      return <GoogleIcon name="language" size={size} />
  }
}

export default function AboutPage() {
  const [activeBlueprintTab, setActiveBlueprintTab] = useState<'genesis' | 'interventions' | 'doctrine' | 'pillars'>('genesis')
  const [activeShieldTab, setActiveShieldTab] = useState<'shield1' | 'shield2'>('shield1')
  const [activeInterventionIdx, setActiveInterventionIdx] = useState<number>(0)
  const [activeSocialIndex, setActiveSocialIndex] = useState<number>(0)
  const [profile, setProfile] = useState<FounderProfileData>(getFounderData())

  const pageRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<HTMLElement>(null)
  const valuesRef = useRef<HTMLElement>(null)

  useEffect(() => {
    fetchFounderData().then(d => { if (d) setProfile(d); }).catch(() => {});
    const handleUpdate = () => setProfile(getFounderData())
    window.addEventListener('founder_data_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('founder_data_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  useEffect(() => {
    // Immediate visibility on load with zero scroll lag
  }, [])

  const confidentialityText =
    profile?.interventions?.confidentialityNotice ||
    DEFAULT_FOUNDER_DATA.interventions.confidentialityNotice

  const heroImgSrc = profile.heroImage
    ? (profile.heroImage.startsWith('data:') || profile.heroImage.startsWith('blob:') || profile.heroImage.startsWith('http') || profile.heroImage.startsWith('/')
        ? profile.heroImage
        : `/${profile.heroImage}`)
    : "/harshitama'am.jpg"

  const currentCategory = SOCIAL_SHOWCASE_CATEGORIES[activeSocialIndex]

  return (
    <main className={p.page} ref={pageRef}>
      {/* ── 01. ABOUT SHAKTI SABHA / HERO BANNER ────── */}
      <div className={p.hero}>
        <div className={p.heroInner}>
          <span className={p.eyebrow}>CIVILIZATIONAL THOUGHT • FIELD EXPERIENCE • SOCIAL TRANSFORMATION</span>
          <h1 className={p.heroTitle}>About Shakti Sabha</h1>
          <p className={p.heroHindi}>Civilizational Thought • Field Experience • Social Transformation</p>
          <p className={p.heroDesc}>
            Shakti Sabha is an independent social and knowledge initiative working at the intersection of women’s empowerment, youth engagement, field experience, Indian thought, and practical education.
            <br /><br />
            Its work brings together physical preparedness, psychological awareness, critical inquiry, cultural understanding, and responsible citizenship - with the aim of developing individuals who are stronger in action, clearer in thought, and grounded in responsibility.
          </p>
        </div>
      </div>

      {/* ── 03. FOUNDER & DIRECTOR / FOUNDER DOSSIER ──── */}
      <section className={p.founderSection} id="founder">
        <div className={p.founderInner}>
          {/* Main Founder Card */}
          <div className={p.founderCard}>
            <div className={p.founderPortraitWrap}>
              <img
                src={heroImgSrc}
                alt="Harshita Manker - Founder & Director, Shakti Sabha"
                className={p.founderImg}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80'
                }}
              />
              <div className={p.founderBadgePill}>
                <GoogleIcon name="verified_user" size={16} style={{ marginRight: '6px' }} />
                Founder &amp; Director · Field Practitioner &amp; Youth Educator
              </div>
            </div>

            <div className={p.founderInfo}>
              <span className={p.founderEyebrow}>FOUNDER &amp; DIRECTOR • SHAKTI SABHA</span>
              <h2 className={p.founderName}>Harshita Manker</h2>
              <div className={p.founderTitle}>
                Field Practitioner • Youth Educator • Independent Researcher &amp; Speaker
              </div>
              <div className={p.founderSpecialties}>
                She has undertaken additional training in counselling, behavioural observation and body-language awareness, and self-defence and physical preparedness training.
              </div>

              {/* Founder Quote */}
              <div className={p.heroQuoteBox}>
                <blockquote className={p.heroQuoteText}>
                  “We believe in strength without hostility, knowledge without dogma, and freedom with responsibility.”
                </blockquote>
              </div>

              {/* Metric Badges */}
              <div className={p.metricBadgesGrid}>
                {FOUNDER_METRICS.slice(0, 6).map((m, idx) => (
                  <div key={idx} className={p.metricBadgeCard}>
                    <div className={p.metricBadgeHeader}>
                      <GoogleIcon name={m.icon} size={18} className={p.metricBadgeIcon} style={{ color: '#bd1834' }} />
                      <span className={p.metricBadgeTitle}>{m.title}</span>
                    </div>
                    <p className={p.metricBadgeDesc}>{m.desc}</p>
                  </div>
                ))}
              </div>

              {/* Founder Verified Social Quick Handles */}
              <div className={p.founderSocialRow}>
                <a href="https://youtube.com/@aaryaveeraa?si=" target="_blank" rel="noopener noreferrer" className={p.founderSocialPill} title="Aaryaveera YouTube">
                  <GoogleIcon name="smart_display" size={16} style={{ color: '#FF0000' }} />
                  <span>YouTube @aaryaveeraa</span>
                </a>
                <a href="https://www.instagram.com/aaryaveera?exln=dTB1MXQ3eWF5NGl6" target="_blank" rel="noopener noreferrer" className={p.founderSocialPill} title="Aaryaveera Instagram">
                  <GoogleIcon name="photo_camera" size={16} style={{ color: '#E1306C' }} />
                  <span>Instagram @aaryaveera</span>
                </a>
                <a href="https://x.com/TheAaryaveera?s=20" target="_blank" rel="noopener noreferrer" className={p.founderSocialPill} title="The Aaryaveera on X">
                  <GoogleIcon name="tag" size={16} style={{ color: '#111827' }} />
                  <span>X @TheAaryaveera</span>
                </a>
                <a href="https://www.aaryaveera.com" target="_blank" rel="noopener noreferrer" className={p.founderSocialPill} title="Aaryaveera Official Portal">
                  <GoogleIcon name="language" size={16} style={{ color: '#B45309' }} />
                  <span>aaryaveera.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* ── 05. THE INTELLECTUAL FRAMEWORK OF SHAKTI SABHA ── */}
          <div className={p.blueprintSection}>
            <div className={p.blueprintHeader}>
              <span className={p.blueprintEyebrow}>
                <GoogleIcon name="architecture" size={16} />
                THE INTELLECTUAL FRAMEWORK OF SHAKTI SABHA
              </span>
              <h3 className={`${p.blueprintMainTitle} ${p.animatedHeading}`}>The Intellectual Framework of Shakti Sabha</h3>
              <p className={p.blueprintSubtitle}>
                Explore the ideas, experiences and principles that shape Shakti Sabha’s work across education, empowerment, field engagement and public dialogue.
              </p>

              {/* Interactive Tab Navigation Bar */}
              <div className={p.blueprintNavBar}>
                <button
                  type="button"
                  className={`${p.blueprintTabBtn} ${activeBlueprintTab === 'genesis' ? p.blueprintTabBtnActive : ''}`}
                  onClick={() => setActiveBlueprintTab('genesis')}
                  title="01 · Genesis & Field Thought"
                  aria-label="01 · Genesis & Field Thought"
                >
                  <GoogleIcon name="eco" size={18} />
                  <span className={p.blueprintTabLabel}>01 · Genesis &amp; Field Thought</span>
                </button>
                <button
                  type="button"
                  className={`${p.blueprintTabBtn} ${activeBlueprintTab === 'interventions' ? p.blueprintTabBtnActive : ''}`}
                  onClick={() => setActiveBlueprintTab('interventions')}
                  title="02 · Counselling & Awareness"
                  aria-label="02 · Counselling & Awareness"
                >
                  <GoogleIcon name="psychology" size={18} />
                  <span className={p.blueprintTabLabel}>02 · Counselling &amp; Awareness</span>
                </button>
                <button
                  type="button"
                  className={`${p.blueprintTabBtn} ${activeBlueprintTab === 'doctrine' ? p.blueprintTabBtnActive : ''}`}
                  onClick={() => setActiveBlueprintTab('doctrine')}
                  title="03 · Mission Mardini"
                  aria-label="03 · Mission Mardini"
                >
                  <GoogleIcon name="swords" size={18} />
                  <span className={p.blueprintTabLabel}>03 · Mission Mardini</span>
                </button>
                <button
                  type="button"
                  className={`${p.blueprintTabBtn} ${activeBlueprintTab === 'pillars' ? p.blueprintTabBtnActive : ''}`}
                  onClick={() => setActiveBlueprintTab('pillars')}
                  title="04 · The Three Streams"
                  aria-label="04 · The Three Streams"
                >
                  <GoogleIcon name="hub" size={18} />
                  <span className={p.blueprintTabLabel}>04 · The Three Streams</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT CONTAINER */}
            <div className={p.blueprintContainerCard}>
              {/* TAB 1: 06. GENESIS: FROM FIELD EXPERIENCE TO INSTITUTIONAL THOUGHT */}
              {activeBlueprintTab === 'genesis' && (
                <div className={p.genesisGrid}>
                  <div className={p.genesisLeft}>
                    <h4 className={p.genesisTitle}>
                      <GoogleIcon name="military_tech" size={26} style={{ color: '#166534' }} />
                      Genesis: From Field Experience to Institutional Thought
                    </h4>
                    <p className={p.genesisText}>
                      Harshita Manker’s journey began through direct engagement with young people, educational initiatives, community programmes and public speaking. Over the years, these experiences brought her into close contact with the everyday challenges faced by girls, women and young people across different social and institutional settings.
                    </p>
                    <p className={p.genesisText}>
                      Her work gradually developed beyond individual programmes towards a broader interest in education, human behaviour, Indian history and heritage, social resilience, women’s empowerment and responsible citizenship.
                    </p>
                    <p className={p.genesisText}>
                      Shakti Sabha emerged from this continuing journey: an effort to bring together field experience, study, dialogue and practical action in a way that strengthens both individual capability and social awareness.
                    </p>
                  </div>

                  {/* 07. THE IDEA OF KSHATRA-DHARMA */}
                  <div className={p.genesisRightParchment}>
                    <div className={p.parchmentHeader}>
                      <GoogleIcon name="balance" size={24} style={{ color: '#166534' }} />
                      <h5 className={p.parchmentTitle}>The Idea of Kshatra-Dharma</h5>
                    </div>
                    <p className={p.parchmentBody}>
                      For Shakti Sabha, Kshatra-Dharma represents the responsibility to protect, the courage to confront injustice, and the discipline to use strength responsibly.
                      <br /><br />
                      It is approached not as a call for aggression, but as an ethical idea: strength guided by restraint, courage guided by wisdom, and action guided by responsibility.
                    </p>

                    <div className={p.genesisMilestonesMini}>
                      <div className={p.miniMilestoneItem}>
                        <span className={p.miniMilestoneBadge}>2021</span>
                        <span>Early Programmes &amp; Field Engagement</span>
                      </div>
                      <div className={p.miniMilestoneItem}>
                        <span className={p.miniMilestoneBadge}>2024</span>
                        <span>Wider Educational &amp; Community Reach</span>
                      </div>
                      <div className={p.miniMilestoneItem}>
                        <span className={p.miniMilestoneBadge}>2026</span>
                        <span>Formal Institutional Registration</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: 16. COUNSELLING & PSYCHOSOCIAL AWARENESS */}
              {activeBlueprintTab === 'interventions' && (
                <div className={p.interventionsHub}>
                  {/* 3 Interactive Selector Cards */}
                  <div className={p.interventionsNavList}>
                    {TACTICAL_INTERVENTIONS.map((item, idx) => (
                      <div
                        key={idx}
                        className={`${p.interventionNavCard} ${activeInterventionIdx === idx ? p.interventionNavCardActive : ''}`}
                        onClick={() => setActiveInterventionIdx(idx)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <GoogleIcon name={item.icon} size={22} style={{ color: activeInterventionIdx === idx ? '#bd1834' : '#6B7280' }} />
                          <span className={p.interventionCardPill}>
                            {idx === 0 ? 'Child Protection' : idx === 1 ? 'Family Mediation' : 'Psychosocial Support'}
                          </span>
                        </div>
                        <h5 className={p.interventionCardTitle}>{item.title}</h5>
                      </div>
                    ))}
                  </div>

                  {/* Active Detailed Display */}
                  <div className={p.interventionDetailDisplay}>
                    <div className={p.interventionDetailHeader}>
                      <div className={p.interventionIconWrap}>
                        <GoogleIcon name={TACTICAL_INTERVENTIONS[activeInterventionIdx].icon} size={26} />
                      </div>
                      <div>
                        <h4 className={p.interventionDetailTitle}>
                          {TACTICAL_INTERVENTIONS[activeInterventionIdx].title}
                        </h4>
                      </div>
                    </div>

                    <p className={p.interventionDetailDesc}>
                      {TACTICAL_INTERVENTIONS[activeInterventionIdx].desc}
                    </p>

                    <ul className={p.interventionBulletsList}>
                      {TACTICAL_INTERVENTIONS[activeInterventionIdx].bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className={p.interventionBulletItem}>
                          <span className={p.bulletDot}>●</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Statutory & Confidentiality Seal */}
                  <div className={p.confidentialityBanner}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', color: '#111827', fontWeight: 700, fontSize: '0.84rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      <GoogleIcon name="gavel" size={17} style={{ color: '#bd1834' }} />
                      Institutional Note on Confidentiality &amp; Statutory Compliance
                    </div>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#4B5563', lineHeight: 1.6 }}>
                      "{confidentialityText}"
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: MISSION MARDINI */}
              {activeBlueprintTab === 'doctrine' && (
                <div className={p.mardiniConsole}>
                  <div className={p.doctrinePremiseBar}>
                    “We believe that strength without hostility, knowledge without dogma, and freedom with responsibility creates enduring security.”
                  </div>

                  {/* Shield Switcher Buttons */}
                  <div className={p.shieldSwitcher}>
                    <button
                      type="button"
                      className={`${p.shieldSwitchBtn} ${activeShieldTab === 'shield1' ? p.shieldSwitchBtnActive : ''}`}
                      onClick={() => setActiveShieldTab('shield1')}
                    >
                      <GoogleIcon name="psychology" size={16} />
                      <span>Pillar One · Situational Awareness &amp; Personal Safety</span>
                    </button>
                    <button
                      type="button"
                      className={`${p.shieldSwitchBtn} ${activeShieldTab === 'shield2' ? p.shieldSwitchBtnActive : ''}`}
                      onClick={() => setActiveShieldTab('shield2')}
                    >
                      <GoogleIcon name="sports_martial_arts" size={16} />
                      <span>Pillar Two · Self-Defence &amp; Physical Preparedness</span>
                    </button>
                  </div>

                  {/* Shield Items Grid */}
                  <div className={p.shieldCardsGrid}>
                    {(activeShieldTab === 'shield1' ? CURRICULUM_TIERS[0] : CURRICULUM_TIERS[1]).items.map((item, iIdx) => (
                      <div key={iIdx} className={p.shieldItemCard}>
                        <h5 className={p.shieldItemHead}>
                          <GoogleIcon name="verified" size={16} style={{ color: '#bd1834' }} />
                          {item.head}
                        </h5>
                        <p className={p.shieldItemBody}>{item.body}</p>
                      </div>
                    ))}
                  </div>

                  {/* Camps & Outreach Banner */}
                  <div className={p.campsOutreachBanner}>
                    <div>
                      <h5 style={{ fontFamily: "var(--serif, 'Playfair Display', Georgia, serif)", fontSize: '1.15rem', color: '#111827', margin: '0 0 0.5rem', fontWeight: 600 }}>
                        Structured Self-Defence &amp; Awareness Camps
                      </h5>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: '#4B5563', lineHeight: 1.6 }}>
                        Practical self-defence, situational awareness and confidence-building programmes for girls and women.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1 1 120px', background: '#FFFFFF', border: '1px solid #FECDD3', padding: '0.75rem', borderRadius: 8 }}>
                        <div style={{ color: '#bd1834', fontWeight: 800, fontSize: '1.1rem' }}>2,000+</div>
                        <div style={{ color: '#6B7280', fontSize: '0.72rem' }}>Girls Engaged</div>
                      </div>
                      <div style={{ flex: '1 1 120px', background: '#FFFFFF', border: '1px solid #DCFCE7', padding: '0.75rem', borderRadius: 8 }}>
                        <div style={{ color: '#166534', fontWeight: 800, fontSize: '1.1rem' }}>Community</div>
                        <div style={{ color: '#6B7280', fontSize: '0.72rem' }}>&amp; Tribal Outreach</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: THE THREE STREAMS ARCHITECTURE */}
              {activeBlueprintTab === 'pillars' && (
                <div className={p.triStreamGrid}>
                  {PILLARS_IN_ACTION.map((pillar, idx) => (
                    <div
                      key={idx}
                      className={p.streamCardCreative}
                      style={{ '--stream-color': pillar.color } as React.CSSProperties}
                    >
                      <div className={p.streamCardHeader}>
                        <GoogleIcon name={pillar.icon} size={26} style={{ color: pillar.color }} />
                        <h4 className={p.streamCardName}>{pillar.name}</h4>
                      </div>
                      <div className={p.streamCardSub}>{pillar.sub}</div>
                      <p className={p.streamCardDesc}>{pillar.desc}</p>

                      <ul className={p.streamBullets}>
                        {pillar.bullets.map((b, bIdx) => (
                          <li key={bIdx} className={p.streamBulletItem}>
                            <span style={{ color: pillar.color }}>●</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      <Link to={pillar.dedicatedLink} className={p.streamCardLink}>
                        <span>{pillar.dedicatedLabel}</span>
                        <GoogleIcon name="arrow_forward" size={14} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 08. THE SHAKTI SABHA PHILOSOPHY ──────────── */}
      <div className={p.quoteSection}>
        <div className={p.quoteInner} style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#bd1834', display: 'block', marginBottom: '1rem' }}>
            THE SHAKTI SABHA PHILOSOPHY
          </span>

          {/* Heading in three lines */}
          <h3 className={p.animatedHeading} style={{
            fontFamily: "var(--serif, 'Playfair Display', Georgia, serif)",
            fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)',
            color: '#881337',
            marginBottom: '1.5rem',
            lineHeight: 1.35
          }}>
            STRENGTH WITHOUT HATRED.<br />
            KNOWLEDGE WITHOUT BLINDNESS.<br />
            POWER WITH RESPONSIBILITY.
          </h3>

          {/* Philosophy Body */}
          <p style={{ color: '#374151', fontSize: '0.98rem', lineHeight: 1.8, marginBottom: '1.25rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto 1.25rem' }}>
            Shakti Sabha believes that meaningful empowerment must develop the whole person. Physical confidence without self-control can become recklessness. Knowledge without critical inquiry can become dogma. Freedom without responsibility can lose direction.
          </p>

          <p style={{ color: '#374151', fontSize: '0.98rem', lineHeight: 1.8, marginBottom: '1.25rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto 1.25rem' }}>
            Our work therefore seeks to bring together physical preparedness, psychological awareness, critical thinking, cultural understanding and responsible action.
          </p>

          <p style={{ color: '#374151', fontSize: '0.98rem', lineHeight: 1.8, marginBottom: '1.75rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto 1.75rem' }}>
            We encourage women and young people to recognise their capabilities without cultivating hostility, to question ideas without losing intellectual discipline, and to engage with tradition without abandoning inquiry.
          </p>

          <blockquote style={{ fontFamily: "var(--serif, 'Playfair Display', Georgia, serif)", fontSize: '1.15rem', lineHeight: 1.6, color: '#bd1834', fontStyle: 'italic', margin: '0 0 1rem' }}>
            “We believe in strength without hostility, knowledge without dogma, and freedom with responsibility.”
          </blockquote>
        </div>
      </div>

      {/* ── 09. OUR CORE VALUES ─────────────────────── */}
      <section className={p.valuesSection} ref={valuesRef}>
        <div className={p.sectionInner}>
          <span className={p.sectionEyebrow}>PRINCIPLES &amp; COMMITMENTS</span>
          <h2 className={`${p.sectionTitle} ${p.animatedHeading}`}>Our Core Values</h2>
          <div className={p.valuesGrid}>
            {CORE_VALUES.map((v) => (
              <div key={v.name} className={p.valueCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '0.5rem' }}>
                  <GoogleIcon name={v.icon} size={28} style={{ color: '#bd1834' }} />
                  <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '0.85rem', color: '#9CA3AF' }}>VALUE {v.num}</span>
                </div>
                <h3 className={p.valueName}>{v.name}</h3>
                <span className={p.valueDev}>{v.dev}</span>
                <p className={p.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. OUR JOURNEY (SEVEN YEARS OF FIELD EXPERIENCE) ── */}
      <section className={p.timelineSection} ref={timelineRef}>
        <div className={p.sectionInner}>
          <span className={p.sectionEyebrow}>SEVEN YEARS OF FIELD EXPERIENCE</span>
          <h2 className={`${p.sectionTitle} ${p.animatedHeading}`}>Our Journey</h2>
          <div className={p.timeline}>
            {TIMELINE.map((t, i) => (
              <div key={i} className={p.timelineItem}>
                <div className={p.timelineLeft}>
                  <span className={p.timelineYear}>{t.year}</span>
                </div>
                <div className={p.timelineConnector}>
                  <div className={p.timelineDot} />
                  {i < TIMELINE.length - 1 && <div className={p.timelineLine} />}
                </div>
                <div className={p.timelineRight}>
                  <h4 className={p.timelineTitle}>{t.title}</h4>
                  <p className={p.timelineDesc}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. WHAT WE ARE BUILDING ─────────────────── */}
      <div style={{
        background: '#FAF8F5',
        borderTop: '1px solid #E5E7EB',
        borderBottom: '1px solid #E5E7EB',
        padding: '4rem 1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#bd1834', display: 'block', marginBottom: '0.75rem' }}>
            FORWARD HORIZON
          </span>
          <h3 style={{ fontFamily: "var(--serif, 'Playfair Display', Georgia, serif)", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#111827', marginBottom: '1rem', fontWeight: 600 }}>
            What We Are Building
          </h3>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#4B5563', margin: 0 }}>
            A growing platform for field learning, public dialogue, youth development, women’s empowerment, cultural inquiry and evidence-informed social action.
          </p>
        </div>
      </div>

      {/* ── 09. OFFICIAL PLATFORMS ─────────────────────── */}
      <section className={p.socialSection} id="social-accounts">
        <div className={p.container}>
          {/* Section Header */}
          <div className={p.socialHeader}>
            <span className={p.socialEyebrow}>
              <GoogleIcon name="verified" size={15} />
              VERIFIED DIGITAL CHANNELS
            </span>
            <h2 className={`${p.socialTitle} ${p.animatedHeading}`}>Official Platforms</h2>
            <p className={p.socialSubtitle}>
              Verified digital channels of Shakti Sabha and its founder.
            </p>
          </div>

          {/* Clean Platform Navigation Bar */}
          <div className={p.platformBarWrapper}>
            <div className={p.platformBar}>
              {SOCIAL_SHOWCASE_CATEGORIES.map((cat, idx) => {
                const isActive = activeSocialIndex === idx
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`${p.platformTab} ${isActive ? p.platformTabActive : ''}`}
                    onClick={() => setActiveSocialIndex(idx)}
                  >
                    <span className={p.platformTabIcon}>
                      {renderSocialIcon(cat.accounts[0]?.iconType || 'website', 18)}
                    </span>
                    <span className={p.platformTabTitle}>{cat.title}</span>
                    <span className={p.platformTabCount}>
                      {cat.accounts.length}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Multi-Account Cards Drawer for the Active Platform */}
          <div className={p.accountsDrawerWrapper}>
            <div className={p.drawerHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span className={p.activePlatformIcon}>
                  {renderSocialIcon(currentCategory.accounts[0]?.iconType || 'website', 22)}
                </span>
                <div>
                  <h3 className={p.activePlatformName}>{currentCategory.title} Accounts</h3>
                  <p className={p.activePlatformSub}>{currentCategory.subtitle} • {currentCategory.accounts.length} verified handle(s)</p>
                </div>
              </div>
            </div>

            <div className={p.accountsCardsGrid}>
              {currentCategory.accounts.map((acc, aIdx) => (
                <div key={aIdx} className={p.accountCard} style={{ '--brand-accent': acc.color } as React.CSSProperties}>
                  <div className={p.accountCardTop}>
                    <div className={p.accountIconBox}>
                      {renderSocialIcon(acc.iconType, 24)}
                    </div>
                    <span className={p.accountTagBadge}>{acc.tag}</span>
                  </div>

                  <div className={p.accountDetails}>
                    <h4 className={p.accountTitle}>
                      {acc.name}
                      <GoogleIcon name="verified" size={17} style={{ color: '#10B981', marginLeft: 5 }} />
                    </h4>
                    <span className={p.accountHandle} style={{ color: acc.color }}>{acc.handle}</span>
                  </div>

                  <a
                    href={acc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={p.accountActionLink}
                  >
                    <span>Connect on {currentCategory.title}</span>
                    <GoogleIcon name="arrow_outward" size={15} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <div className={p.ctaSection}>
        <div className={p.ctaInner}>
          <h3 className={p.ctaTitle}>Engage With Shakti Sabha</h3>
          <p className={p.ctaDesc}>
            Join our collaborative field programmes, educational dialogues, or institutional research partnerships.
          </p>
          <div className={p.ctaBtns}>
            <Link to="/sahyog" className={p.ctaPrimary}>Collaborate With Us →</Link>
            <Link to="/research" className={p.ctaOutline}>Explore Research</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
