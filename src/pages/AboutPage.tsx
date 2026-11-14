import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getFounderData, fetchFounderData, FounderProfileData, DEFAULT_FOUNDER_DATA } from '../data/founderData'
import { resolveImageUrl } from '../lib/api'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import p from './AboutPage.module.css'

gsap.registerPlugin(ScrollTrigger)

const FOUNDER_METRICS = [
  {
    icon: 'sports_martial_arts',
    title: 'Black Belt in Karate',
    desc: 'Martial arts discipline, tactical combat training, and unarmed self-defense.'
  },
  {
    icon: 'swords',
    title: '2,000+ Girls Trained',
    desc: 'Armed and unarmed self-defense awareness and practical street-safety training.'
  },
  {
    icon: 'record_voice_over',
    title: '500+ Seminars & Discourses',
    desc: 'Institutional seminars, youth awareness programmes, and consciousness-building sessions.'
  },
  {
    icon: 'school',
    title: '25,000+ Students Reached',
    desc: 'Youth awakening sessions across educational and community platforms.'
  },
  {
    icon: 'holiday_village',
    title: 'Mission Mardini Camps',
    desc: 'Organizing intensive 7–10 day self-defense and empowerment camps.'
  },
  {
    icon: 'nature_people',
    title: 'Tribal Outreach',
    desc: 'Awareness, guidance, and support initiatives for young girls in tribal and underserved communities.'
  },
  {
    icon: 'hub',
    title: 'Collaborative Initiatives',
    desc: 'Working with other organizations and community groups to expand training and awareness programmes.'
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
      'Documented Footprint: Directly facilitated the timely safety interception, statutory handoff, and supervised reintegration of 13 vulnerable minors into verified legal guardianship and safe academic environments.'
    ]
  },
  {
    icon: 'shield',
    title: '2. Counter-Grooming, Coercive Entrapment & Pre-FIR Family Mediation',
    desc: 'Handling complex community and campus scenarios involving identity deception, peer-driven entrapment, digital blackmail, and high-pressure interpersonal coercion.',
    bullets: [
      'Operational Methodology: Recognizing that families in over 80% of distress cases avoid formal litigation due to acute social vulnerability and fear of exposure, acts as a trusted community mediator.',
      'Intervenes directly in campus and residential hostel settings to break cycles of digital coercion and isolation.',
      'Conducts direct, non-adversarial dialogue with families and young women to resolve high-risk situations before irreversible harm occurs.',
      'Coordinates with local civic leadership, community elders, and law-enforcement helplines to neutralize predatory pressure.',
      'Documented Footprint: Handled over 250 reported distress and vulnerability consultations, actively conducting direct field-level safety mediations and pre-emptive family reintegrations in 50+ critical situations.'
    ]
  },
  {
    icon: 'psychology',
    title: '3. Trauma-Informed Somatic Support & Non-Verbal De-escalation',
    desc: 'Supporting young girls and women dealing with deep psychological shock, learned helplessness, domestic distress, and street-level anxiety.',
    bullets: [
      'Non-verbal behavioral observation to detect acute panic, dissociation, and the biological "freeze" response.',
      'Private, trauma-sensitive conversational de-escalation to relieve irrational guilt, internalized shame, and fear of judgment.',
      'Facilitating safe academic relocation, educational sponsorship, and vocational anchoring where prolonged domestic friction prevents an immediate peaceful resolution at home.',
      'Connecting survivors to certified clinical psychologists, healthcare professionals, and pro-bono legal advocates when specialized interventions are required.',
      'Core Principle: "A crisis or traumatic event does not define a woman’s destiny. Our objective is to restore self-worth, emotional autonomy, and physical confidence so that every girl reclaims her sovereign agency in society."'
    ]
  }
]

const CURRICULUM_TIERS = [
  {
    tier: 'Shield One · Cognitive & Mental Shield',
    title: 'Cognitive De-escalation & Situational Awareness',
    items: [
      {
        head: 'Threat Recognition',
        body: 'Participants learn to recognize potentially unsafe situations, identify concerning behavioural patterns, understand personal boundaries, and recognize warning signs associated with stalking, grooming, coercion, and unwanted physical proximity.'
      },
      {
        head: 'Situational Awareness',
        body: 'Training develops environmental awareness, risk assessment, safe-distance management, and the ability to identify exit routes and seek assistance before a situation escalates.'
      },
      {
        head: 'Managing the Freeze Response',
        body: 'Participants learn practical techniques for managing fear and stress, improving their ability to think clearly, communicate boundaries, make decisions, and respond appropriately during threatening situations.'
      },
      {
        head: 'Psychological Preparedness',
        body: 'The objective is to replace helplessness with preparedness through guided exercises, scenario-based learning, and confidence-building activities.'
      }
    ]
  },
  {
    tier: 'Shield Two · Physical Defense & Tactical Combat',
    title: 'Physical Defense & Tactical Combat Disciplines',
    items: [
      {
        head: 'Empty-Hand Defense',
        body: 'Participants learn foundational Karate-based defensive techniques, body mechanics, balance, movement, protective positioning, and practical responses to common physical threats.'
      },
      {
        head: 'Lathi-Kaushal: Traditional Staff Training',
        body: 'The programme introduces the Indian martial discipline of Lathi-Kaushal, adapting traditional staff techniques for personal protection, controlled movement, distance management, and defensive preparedness.'
      },
      {
        head: 'Traditional Weapon Awareness',
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
    sub: 'Physical Sovereignty & Tactical Preparedness',
    color: '#DC143C',
    dedicatedLink: '/mardini',
    dedicatedLabel: 'Explore Mission Mardini Page →',
    desc: 'Guided by founder Harshita Mankar’s Aaryaveera philosophy, the programme challenges passive approaches to self-defense by integrating physical training with psychological preparedness, situational awareness, discipline, and decision-making under pressure.',
    bullets: [
      'Dual-Shield Doctrine: Cognitive De-escalation & Situational Awareness + Physical Defense & Tactical Combat.',
      'Intensive 7–10 day residential warrior camps with martial discipline and scenario-based drills.',
      'Frontline tribal and rural outreach making practical combat training accessible beyond urban institutions.'
    ]
  },
  {
    icon: 'spa',
    name: 'Shakti Bhava',
    sub: 'Cognitive Awakening, Consciousness & Civilizational Awareness',
    color: '#059669',
    dedicatedLink: '/shakti-bhava',
    dedicatedLabel: 'Explore Shakti Bhava Page →',
    desc: 'Cultivates individuals who can think independently, examine social narratives, understand their cultural and intellectual roots, and make decisions through reason rather than digital influence or social pressure.',
    bullets: [
      '500+ seminars, institutional sessions, and consciousness discourses reaching 25,000+ students.',
      'Key engagement in Narrative Awareness, Critical Thinking, Civilizational Literacy, and Human Consciousness.',
      'Promotes mutual dignity, healthy boundaries, personal responsibility, and rejects hyper-consumerist polarization.'
    ]
  },
  {
    icon: 'menu_book',
    name: 'Shakti Varta',
    sub: 'Intellectual Sovereignty, Critical Inquiry & Research-Based Dialogue',
    color: '#4338CA',
    dedicatedLink: '/shakti-varta',
    dedicatedLabel: 'Explore Shakti Varta Page →',
    desc: 'A practical learning environment where youth are equipped with critical thinking, research literacy, and logical reasoning to investigate claims independently from primary sources.',
    bullets: [
      'Vedic Digital Fellowship: Engaging young women with the Vedas, Bhagavad Gita, Mahabharata, and Satyarth Prakash.',
      'Critical Media Analysis: Source verification, identifying logical fallacies, and deconstructing manipulative algorithms.',
      'Open-House Debates & Youth Ignite Forums: Rational philosophical dialogues, forgotten warrior queens, and digital public consciousness.'
    ]
  }
]

const TIMELINE = [
  { year: '2012', title: 'Shakti Sabha Founded', desc: 'Born with a vision to revive the civilizational paradigm of Kshatra-Dharma, tactical preparedness, and cognitive sovereignty.' },
  { year: '2014', title: 'First Mission Mardini Camp', desc: 'Inaugural residential camp blending Karate empty-hand combat with Lathi-Kaushal staff defense and freeze-response elimination.' },
  { year: '2016', title: '100+ Schools Reached', desc: 'Expanded across rural corridors, residential hostels, and colleges for situational awareness and boundary management.' },
  { year: '2018', title: 'Frontline Interventions Formalized', desc: 'Somatic trauma de-escalation, non-verbal behavioral observation, and statutory child-protection coordination.' },
  { year: '2022', title: 'Aaryaveera Philosophy Codified', desc: 'The founder’s personal worldview (Aaryaveera) formally codified as the ideological foundation guiding all Shakti Sabha initiatives.' },
  { year: '2024', title: '25,000+ Students Awakened', desc: 'Over 500 seminars, 2,000+ girls trained in self-defense, 13 minors safely reintegrated, and active tribal outreach operations.' },
]

const VALUES = [
  { icon: 'balance', name: 'Kshatra-Dharma', dev: 'Courage, Duty & Protection', desc: 'The responsibility to protect, the courage to confront injustice, the discipline to exercise power responsibly, and the wisdom to distinguish strength from aggression.' },
  { icon: 'psychology', name: 'Intellectual Sovereignty', dev: 'Critical Inquiry & Truth', desc: 'Do not accept an idea merely because it is popular, traditional, or influential. Examine its evidence, reasoning, context, and implications.' },
  { icon: 'shield', name: 'Physical Preparedness', dev: 'Somatic Readiness & Defense', desc: 'Before the body can respond, the mind must overcome fear. True empowerment requires the development of both mental composure and physical capability.' },
  { icon: 'spa', name: 'Human Consciousness', dev: 'Inner Composure & Dignity', desc: 'Strength without hatred. Knowledge without blindness. Power with responsibility. Developing the whole human being.' },
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
    subtitle: 'Video Discourses & Combat Archives',
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
    subtitle: 'Visual Vanguard & Movement Stories',
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
        tag: 'Founder Ideology',
        iconType: 'instagram',
        color: '#E1306C'
      },
      {
        name: 'The Aaryaveera',
        handle: '@theaaryaveera',
        url: 'https://www.instagram.com/theaaryaveera?mdxt=c25ybWV4bzkzNXZr',
        tag: 'Warrior Cadre',
        iconType: 'instagram',
        color: '#E1306C'
      },
      {
        name: 'Shakti Sabha',
        handle: '@shaktisabha',
        url: 'https://www.instagram.com/shaktisabha?exln=MWhtaWwwZDZmamI5',
        tag: 'Institutional Body',
        iconType: 'instagram',
        color: '#DC143C'
      }
    ]
  },
  {
    id: 'facebook',
    num: '03',
    title: 'Facebook',
    subtitle: 'Grassroots Community & Family Outreach',
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
    subtitle: 'Intellectual Sovereignty & Thought Leadership',
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
    subtitle: 'Visual Archives & Posture Guides',
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
    subtitle: 'Founder Sanctum & Civilizational Vision',
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
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.62-5.373-11.987-12-11.987z"/>
        </svg>
      )
    case 'website':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      )
  }
}

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)
  const [profile, setProfile] = useState<FounderProfileData>(getFounderData())
  const [activeSocialIndex, setActiveSocialIndex] = useState(0)
  const [socialThemeLight, setSocialThemeLight] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 })
  const [cursorVisible, setCursorVisible] = useState(false)
  const [cursorHover, setCursorHover] = useState(false)
  const showcaseRef = useRef<HTMLElement>(null)

  const currentCategory = SOCIAL_SHOWCASE_CATEGORIES[activeSocialIndex] || SOCIAL_SHOWCASE_CATEGORIES[0]
  const [activeBlueprintTab, setActiveBlueprintTab] = useState<'genesis' | 'interventions' | 'doctrine' | 'pillars'>('genesis')
  const [activeInterventionIdx, setActiveInterventionIdx] = useState(0)
  const [activeShieldTab, setActiveShieldTab] = useState<'shield1' | 'shield2'>('shield1')

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
    const ctx = gsap.context(() => {
      if (timelineRef.current) {
        const items = timelineRef.current.querySelectorAll(`.${p.timelineItem}`)
        gsap.fromTo(
          items,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: timelineRef.current, start: 'top 85%', once: true },
            onComplete: () => {
              gsap.set(items, { clearProps: 'opacity,transform' })
            }
          }
        )
      }

      if (valuesRef.current) {
        const cards = valuesRef.current.querySelectorAll(`.${p.valueCard}`)
        gsap.fromTo(
          cards,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: valuesRef.current, start: 'top 85%', once: true },
            onComplete: () => {
              gsap.set(cards, { clearProps: 'opacity,transform' })
            }
          }
        )
      }
    }, pageRef)

    // Ensure elements are never stuck hidden if ScrollTrigger recalculates
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 350)

    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [])

  const confidentialityText =
    profile?.interventions?.confidentialityNotice ||
    DEFAULT_FOUNDER_DATA.interventions.confidentialityNotice

  const heroImgSrc = profile.heroImage
    ? (profile.heroImage.startsWith('data:') || profile.heroImage.startsWith('blob:') || profile.heroImage.startsWith('http') || profile.heroImage.startsWith('/')
        ? profile.heroImage
        : `/${profile.heroImage}`)
    : "/harshitama'am.jpg"

  return (
    <main className={p.page} ref={pageRef}>
      {/* ── HERO BANNER ────────────────────────────── */}
      <div className={p.hero}>
        <div className={p.heroInner}>
          <span className={p.eyebrow}>Civilizational Leadership &amp; Tactical Sovereignty</span>
          <h1 className={p.heroTitle}>About Shakti Sabha</h1>
          <p className={p.heroHindi}>The Soul &amp; Strategy of the Movement · Union of Peace &amp; Revolution</p>
          <p className={p.heroDesc}>
            Reviving the civilizational paradigm of Kshatra-Dharma and cognitive sovereignty.
            From high-risk frontline rescues to residential combat camps, Shakti Sabha forges young women into intellectually fortified and tactically capable guardians.
          </p>
        </div>
      </div>

      {/* ── FOUNDER DOSSIER & STRATEGIC BLUEPRINT ──── */}
      <section className={p.founderSection} id="founder">
        <div className={p.founderInner}>
          {/* Main Founder Card */}
          <div className={p.founderCard}>
            <div className={p.founderPortraitWrap}>
              <img
                src={heroImgSrc}
                alt="Aaryaveera Harshita Mankar - Founder & Director, Shakti Sabha"
                className={p.founderImg}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80'
                }}
              />
              <div className={p.founderBadgePill}>
                <GoogleIcon name="verified_user" size={16} style={{ marginRight: '6px' }} />
                Civilizational Strategist &amp; Combat Instructor
              </div>
            </div>

            <div className={p.founderInfo}>
              <span className={p.founderEyebrow}>FOUNDER &amp; DIRECTOR · AARYAVEERA</span>
              <h2 className={p.founderName}>{profile.name}</h2>
              <div className={p.founderTitle}>{profile.title}</div>
              <div className={p.founderSpecialties}>
                {profile.subTitle}
              </div>

              {/* Hero Quote Directly Below Name and Title */}
              <div className={p.heroQuoteBox}>
                <blockquote className={p.heroQuoteText}>
                  "{profile.heroQuote}"
                </blockquote>
              </div>

              {/* Executive Metric Badges */}
              <div className={p.metricBadgesGrid}>
                {FOUNDER_METRICS.slice(0, 6).map((m, idx) => (
                  <div key={idx} className={p.metricBadgeCard}>
                    <div className={p.metricBadgeHeader}>
                      <GoogleIcon name={m.icon} size={18} className={p.metricBadgeIcon} style={{ color: '#DC143C' }} />
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

          {/* ── CREATIVE INTERACTIVE BLUEPRINT CONSOLE ──────── */}
          <div className={p.blueprintSection}>
            <div className={p.blueprintHeader}>
              <span className={p.blueprintEyebrow}>
                <GoogleIcon name="architecture" size={16} />
                STRATEGIC BLUEPRINT & METHODOLOGY
              </span>
              <h3 className={`${p.blueprintMainTitle} ${p.animatedHeading}`}>The Architecture of Sovereignty</h3>
              <p className={p.blueprintSubtitle}>
                Explore the foundational philosophy, frontline rescue operations, tactical combat curriculum, and institutional tri-stream framework.
              </p>

              {/* Interactive Tab Navigation Bar */}
              <div className={p.blueprintNavBar}>
                <button
                  type="button"
                  className={`${p.blueprintTabBtn} ${activeBlueprintTab === 'genesis' ? p.blueprintTabBtnActive : ''}`}
                  onClick={() => setActiveBlueprintTab('genesis')}
                >
                  <GoogleIcon name="eco" size={16} />
                  <span>01 · The Genesis</span>
                </button>
                <button
                  type="button"
                  className={`${p.blueprintTabBtn} ${activeBlueprintTab === 'interventions' ? p.blueprintTabBtnActive : ''}`}
                  onClick={() => setActiveBlueprintTab('interventions')}
                >
                  <GoogleIcon name="shield" size={16} />
                  <span>02 · Tactical Interventions</span>
                </button>
                <button
                  type="button"
                  className={`${p.blueprintTabBtn} ${activeBlueprintTab === 'doctrine' ? p.blueprintTabBtnActive : ''}`}
                  onClick={() => setActiveBlueprintTab('doctrine')}
                >
                  <GoogleIcon name="swords" size={16} />
                  <span>03 · Mission Mardini</span>
                </button>
                <button
                  type="button"
                  className={`${p.blueprintTabBtn} ${activeBlueprintTab === 'pillars' ? p.blueprintTabBtnActive : ''}`}
                  onClick={() => setActiveBlueprintTab('pillars')}
                >
                  <GoogleIcon name="hub" size={16} />
                  <span>04 · The Three Streams</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT CONTAINER */}
            <div className={p.blueprintContainerCard}>
              {/* TAB 1: THE GENESIS & KSHATRA-DHARMA */}
              {activeBlueprintTab === 'genesis' && (
                <div className={p.genesisGrid}>
                  <div className={p.genesisLeft}>
                    <h4 className={p.genesisTitle}>
                      <GoogleIcon name="military_tech" size={26} style={{ color: '#166534' }} />
                      Genesis: {profile.genesisLead}
                    </h4>
                    <p className={p.genesisText}>{profile.genesisP1}</p>
                    <p className={p.genesisText}>{profile.genesisP2}</p>
                    <p className={p.genesisText}>{profile.genesisP3}</p>
                  </div>

                  <div className={p.genesisRightParchment}>
                    <div className={p.parchmentHeader}>
                      <GoogleIcon name="balance" size={24} style={{ color: '#166534' }} />
                      <h5 className={p.parchmentTitle}>The Principle of Kshatra-Dharma</h5>
                    </div>
                    <p className={p.parchmentBody}>{profile.kshatraDharmaText}</p>

                    <div className={p.genesisMilestonesMini}>
                      <div className={p.miniMilestoneItem}>
                        <span className={p.miniMilestoneBadge}>2012</span>
                        <span>Shakti Sabha Founded in Pune</span>
                      </div>
                      <div className={p.miniMilestoneItem}>
                        <span className={p.miniMilestoneBadge}>2014</span>
                        <span>First Mission Mardini Residential Camp</span>
                      </div>
                      <div className={p.miniMilestoneItem}>
                        <span className={p.miniMilestoneBadge}>2022</span>
                        <span>Aaryaveera Movement Codified Pan-India</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TACTICAL SAFEGUARDING & FRONTLINE INTERVENTIONS */}
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
                          <GoogleIcon name={item.icon} size={22} style={{ color: activeInterventionIdx === idx ? '#DC143C' : '#6B7280' }} />
                          <span className={p.interventionCardPill}>
                            {idx === 0 ? '13 Minors Reintegrated' : idx === 1 ? '250+ Family Mediations' : 'Trauma Recovery'}
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
                      <GoogleIcon name="gavel" size={17} style={{ color: '#DC143C' }} />
                      Institutional Note on Confidentiality &amp; Statutory Compliance
                    </div>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#4B5563', lineHeight: 1.6 }}>
                      "{confidentialityText}"
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: MISSION MARDINI DUAL-SHIELD DOCTRINE */}
              {activeBlueprintTab === 'doctrine' && (
                <div className={p.mardiniConsole}>
                  <div className={p.doctrinePremiseBar}>
                    "Before the body can respond, the mind must overcome fear. True empowerment requires the development of both mental composure and physical capability."
                  </div>

                  {/* Shield Switcher Buttons */}
                  <div className={p.shieldSwitcher}>
                    <button
                      type="button"
                      className={`${p.shieldSwitchBtn} ${activeShieldTab === 'shield1' ? p.shieldSwitchBtnActive : ''}`}
                      onClick={() => setActiveShieldTab('shield1')}
                    >
                      <GoogleIcon name="psychology" size={16} />
                      <span>Shield One · Cognitive &amp; Situational Awareness</span>
                    </button>
                    <button
                      type="button"
                      className={`${p.shieldSwitchBtn} ${activeShieldTab === 'shield2' ? p.shieldSwitchBtnActive : ''}`}
                      onClick={() => setActiveShieldTab('shield2')}
                    >
                      <GoogleIcon name="sports_martial_arts" size={16} />
                      <span>Shield Two · Physical Defense &amp; Combat Disciplines</span>
                    </button>
                  </div>

                  {/* Shield Items Grid */}
                  <div className={p.shieldCardsGrid}>
                    {(activeShieldTab === 'shield1' ? CURRICULUM_TIERS[0] : CURRICULUM_TIERS[1]).items.map((item, iIdx) => (
                      <div key={iIdx} className={p.shieldItemCard}>
                        <h5 className={p.shieldItemHead}>
                          <GoogleIcon name="verified" size={16} style={{ color: '#DC143C' }} />
                          {item.head}
                        </h5>
                        <p className={p.shieldItemBody}>{item.body}</p>
                      </div>
                    ))}
                  </div>

                  {/* Camps & Outreach Banner */}
                  <div className={p.campsOutreachBanner}>
                    <div>
                      <h5 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.15rem', color: '#111827', margin: '0 0 0.5rem', fontWeight: 700 }}>
                        Intensive 7–10 Day Residential Mardini Camps
                      </h5>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: '#4B5563', lineHeight: 1.6 }}>
                        Full immersion in traditional Lathi-Kaushal, Karate combat, freeze-response elimination, and tactical simulations.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1 1 120px', background: '#FFFFFF', border: '1px solid #FECDD3', padding: '0.75rem', borderRadius: 8 }}>
                        <div style={{ color: '#DC143C', fontWeight: 800, fontSize: '1.1rem' }}>2,000+</div>
                        <div style={{ color: '#6B7280', fontSize: '0.72rem' }}>Graduated Cadre</div>
                      </div>
                      <div style={{ flex: '1 1 120px', background: '#FFFFFF', border: '1px solid #DCFCE7', padding: '0.75rem', borderRadius: 8 }}>
                        <div style={{ color: '#166534', fontWeight: 800, fontSize: '1.1rem' }}>Tribal &amp; Rural</div>
                        <div style={{ color: '#6B7280', fontSize: '0.72rem' }}>Corridor Outreach</div>
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

      {/* ── THE SHAKTI SABHA PHILOSOPHY ──────────────── */}
      <div className={p.quoteSection}>
        <div className={p.quoteInner} style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#DC143C', display: 'block', marginBottom: '1rem' }}>
            THE SHAKTI SABHA PHILOSOPHY
          </span>
          <h3 className={p.animatedHeading} style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: 'clamp(1.4rem, 2.6vw, 2rem)', color: '#881337', marginBottom: '1.25rem' }}>
            Strength Without Hatred. Knowledge Without Blindness. Power With Responsibility.
          </h3>
          <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '1.5rem', textAlign: 'center', maxWidth: '780px', margin: '0 auto 1.5rem' }}>
            Shakti Sabha believes that genuine empowerment must develop the whole human being. Physical strength without self-control can become aggression. Knowledge without critical inquiry can become dogma. Freedom without responsibility can become directionless. Peace without courage can become passive acceptance of injustice.
          </p>
          <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '1.5rem', textAlign: 'center', maxWidth: '780px', margin: '0 auto 1.5rem' }}>
            We encourage women to recognize their strength without developing hostility towards men. We encourage young people to question ideas without becoming prisoners of cynicism. We promote cultural awareness without blind glorification and modern thinking without blind imitation.
          </p>
          <blockquote style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.15rem', lineHeight: 1.6, color: '#DC143C', fontStyle: 'italic', margin: '0 0 1rem' }}>
            "We do not seek to create followers. We seek to cultivate independent minds, responsible leaders, and conscious individuals."
          </blockquote>
        </div>
      </div>

      {/* ── TIMELINE ────────────────────────────────── */}
      <section className={p.timelineSection} ref={timelineRef}>
        <div className={p.sectionInner}>
          <span className={p.sectionEyebrow}>Our Journey</span>
          <h2 className={`${p.sectionTitle} ${p.animatedHeading}`}>7 Years of Impact</h2>
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

      {/* ── VALUES GRID ─────────────────────────────── */}
      <section className={p.valuesSection} ref={valuesRef}>
        <div className={p.sectionInner}>
          <span className={p.sectionEyebrow}>What We Stand For</span>
          <h2 className={`${p.sectionTitle} ${p.animatedHeading}`}>Our Core Values</h2>
          <div className={p.valuesGrid}>
            {VALUES.map((v) => (
              <div key={v.name} className={p.valueCard}>
                <GoogleIcon name={v.icon} size={28} style={{ color: '#DC143C', marginBottom: '0.5rem' }} />
                <h3 className={p.valueName}>{v.name}</h3>
                <span className={p.valueDev}>{v.dev}</span>
                <p className={p.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFICIAL SOCIAL MEDIA PLATFORMS BAR & MULTI-ACCOUNT DRAWER ── */}
      <section className={p.socialSection} id="social-accounts">
        <div className={p.container}>
          {/* Section Header */}
          <div className={p.socialHeader}>
            <span className={p.socialEyebrow}>
              <GoogleIcon name="public" size={15} />
              OFFICIAL PLATFORMS · Digital Vanguard
            </span>
            <h2 className={`${p.socialTitle} ${p.animatedHeading}`}>Official Movement Portals &amp; Channels</h2>
            <p className={p.socialSubtitle}>
              Select any platform from the bar below to view and access verified accounts of Shakti Sabha and Founder Harshita Mankar.
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
          <h3 className={p.ctaTitle}>Join the Revolution</h3>
          <p className={p.ctaDesc}>Whether you request an institutional camp, seek confidential psychological support, or join our fellowship — your sovereignty starts here.</p>
          <div className={p.ctaBtns}>
            <Link to="/sahyog" className={p.ctaPrimary}>Sabha Join Karein →</Link>
            <Link to="/events" className={p.ctaOutline}>Attend Mission Mardini Camp</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
