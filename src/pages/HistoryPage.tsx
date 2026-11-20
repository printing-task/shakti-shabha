import { useEffect, useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { X, BookOpen, ChevronRight, ChevronLeft, Compass } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import h from './HistoryPage.module.css'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'

gsap.registerPlugin(ScrollTrigger)

type Lang = 'en' | 'hi'

/* ============================================================
   Historical Milestones: 2019 to Current (2026)
   7 Years of Independent Shakti Sabha Impact (2019–2026)
   ============================================================ */

interface Milestone {
  id: string
  yearNumeric: number
  dateDisplayEn: string
  dateDisplayHi: string
  epochEn: string
  epochHi: string
  nameEn: string
  nameHi: string
  yearsEn: string
  yearsHi: string
  quoteEn: string
  quoteHi: string
  descEn: string
  descHi: string
  stats: {
    value: string
    labelEn: string
    labelHi: string
  }[]
  dossierEn: {
    context: string
    tactics: string
    legacy: string
    citation: string
  }
  dossierHi: {
    context: string
    tactics: string
    legacy: string
    citation: string
  }
  image: string
}

const TIMELINE_MILESTONES: Milestone[] = [
  {
    id: 'm2019',
    yearNumeric: 2019,
    dateDisplayEn: '2019 CE',
    dateDisplayHi: '२०१९ ईस्वी',
    epochEn: 'Genesis & Sovereign Foundation',
    epochHi: 'स्थापना एवं पावन संकल्प',
    nameEn: 'Shakti Sabha Founded',
    nameHi: 'शक्ति सभा की स्थापना',
    yearsEn: '2019 · Pune & Wardha, Maharashtra',
    yearsHi: '२०१९ · पुणे एवं वर्धा, महाराष्ट्र',
    quoteEn: 'Born in Maharashtra — with a sovereign vision to unite the strength and tactical capability of women across India.',
    quoteHi: 'महाराष्ट्र में जन्म — भारत भर में नारी शक्ति को एकजुट एवं सामरिक रूप से सक्षम बनाने के संकल्प के साथ।',
    descEn: 'Born in Maharashtra — with a vision to unite the strength of women across India. Grounded in timeless Kshatra-Dharma roots, tactical martial defense, and modern psychological support.',
    descHi: 'महाराष्ट्र में जन्म — भारत भर में नारी शक्ति को एकजुट करने के पावन संकल्प के साथ। प्राचीन क्षात्र-धर्म, व्यावहारिक आत्मरक्षा और मनोवैज्ञानिक संबल की सुदृढ़ नींव रखी गई।',
    stats: [
      { value: '1st', labelEn: 'Center (Wardha)', labelHi: 'प्रथम केंद्र (वर्धा)' },
      { value: '200+', labelEn: 'Inaugural Cadets', labelHi: 'प्रथम शिविरार्थी' },
      { value: '1', labelEn: 'Founding Charter', labelHi: 'मूल संकल्प पत्र' }
    ],
    dossierEn: {
      context: 'Founded by dedicated social visionaries to create a pan-India platform for women’s psychological, physical, and historical empowerment.',
      tactics: 'Community-led grassroots circles, cultural awakening lectures, and safe neighborhood support pods.',
      legacy: 'Established the core foundational philosophy that powered a nationwide movement across 7+ years.',
      citation: 'Shakti Sabha Founding Charter (Pune, 2019); Registration Deed #SS-2019/MH.'
    },
    dossierHi: {
      context: 'समर्पित समाजसेवियों द्वारा महिलाओं के मानसिक, शारीरिक एवं ऐतिहासिक सशक्तिकरण हेतु अखिल भारतीय मंच की स्थापना की गई।',
      tactics: 'सामुदायिक बैठकें, सांस्कृतिक जागरण व्याख्यान तथा मोहल्ला-स्तर पर सुरक्षा संवाद।',
      legacy: 'उस मूल वैचारिक दर्शन की स्थापना हुई जिसने आगे चलकर देशव्यापी शक्ति आंदोलन का रूप लिया।',
      citation: 'शक्ति सभा स्थापना विलेख (पुणे, २०१९); पंजीयन सं. SS-2019/MH।'
    },
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'm2021',
    yearNumeric: 2021,
    dateDisplayEn: '2021 CE',
    dateDisplayHi: '२०२१ ईस्वी',
    epochEn: 'Warrior Awakening & Healing',
    epochHi: 'वीरांगना आत्मरक्षा एवं संबल',
    nameEn: 'Mission Mardini & Shakti Bhava',
    nameHi: 'मिशन मर्दिनी एवं शक्ति भाव का शुभारंभ',
    yearsEn: '2021 · Grassroots Corridors',
    yearsHi: '२०२१ · ग्रामीण अंचल एवं संबल केंद्र',
    quoteEn: 'Inaugural martial self-defense camps and confidential psychological trauma recovery pods formalized.',
    quoteHi: 'पारंपरिक लाठी आत्मरक्षा शिविरों एवं गोपनीय मानसिक स्वास्थ्य संबल की औपचारिक शुरुआत।',
    descEn: 'Inaugural Mission Mardini martial camps reached thousands of young women — combining empty-hand karate, traditional Lathi-Kaushal staff defense, and 24/7 confidential trauma recovery pods.',
    descHi: 'मिशन मर्दिनी एवं शक्ति भाव का शुभारंभ — पारंपरिक लाठी कौशल, निःशस्त्र आत्मरक्षा और संकटग्रस्त बहनों के लिए गोपनीय मनोवैज्ञानिक परामर्श मंच स्थापित किया गया।',
    stats: [
      { value: '1,200+', labelEn: 'Girls Trained', labelHi: 'बालिकाएं प्रशिक्षित' },
      { value: '50+', labelEn: 'Rural Camps', labelHi: 'ग्रामीण शिविर' },
      { value: '100%', labelEn: 'Confidential Pods', labelHi: 'गोपनीय संबल' }
    ],
    dossierEn: {
      context: 'Launched across rural outskirts to equip young girls with physical courage for daily travel, paired with trauma-informed emotional healing.',
      tactics: 'Traditional Bharatiya martial defense, environmental situational drills, and clinical psychological recovery circles.',
      legacy: 'Proved the scalability of self-defense training for rural school and college students while breaking silence on gender-based trauma.',
      citation: 'Mission Mardini Field Log 2021; Shakti Bhava Care Protocols #SB-2021.'
    },
    dossierHi: {
      context: 'दैनिक आवागमन में छात्राओं के मन से भय समाप्त करने और घरेलू तनाव से पीड़ित बहनों को संबल देने हेतु प्रारंभ।',
      tactics: 'पारंपरिक भारतीय आत्मरक्षा तकनीक, त्वरित सजगता, और प्रमाणित महिला मनोवैज्ञानिकों द्वारा परामर्श।',
      legacy: 'ग्रामीण छात्राओं हेतु व्यावहारिक सुरक्षा और मानसिक आघात से मुक्ति का ऐतिहासिक मॉडल सिद्ध हुआ।',
      citation: 'शिविर दैनंदिनी २०२१; शक्ति भाव परामर्श संलेख #SB-2021।'
    },
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'm2023',
    yearNumeric: 2023,
    dateDisplayEn: '2023 CE',
    dateDisplayHi: '२०२३ ईस्वी',
    epochEn: 'Unified Identity & Scholarship',
    epochHi: 'आर्यवीरा एवं वैचारिक शोध',
    nameEn: 'Aaryaveera Doctrine & Research',
    nameHi: 'आर्यवीरा आंदोलन एवं शक्ति वार्ता',
    yearsEn: '2023 · Pan-India Awakening',
    yearsHi: '२०२३ · राष्ट्रीय वैचारिक जागरण',
    quoteEn: 'The flagship warrior brand — Aaryaveera — codified alongside Vedic historical research papers.',
    quoteHi: 'प्रमुख वीरांगना ब्रांड \u2018आर्यवीरा\u2019 का उद्घोष और वैदिक विदुषियों पर प्रामाणिक शोधमाला का शुभारंभ।',
    descEn: 'The flagship warrior brand — Aaryaveera — born as a unified identity for the whole movement. Combining ancient Kshatra heritage with modern intellectual sovereignty and Shakti Varta peer-reviewed research.',
    descHi: 'संपूर्ण शक्ति आंदोलन की पहचान के रूप में प्रमुख वीरांगना ब्रांड \u2018आर्यवीरा\u2019 का प्राकट्य। प्राचीन शौर्य परंपरा, आधुनिक बौद्धिक स्वाभिमान और शक्ति वार्ता ऐतिहासिक शोध का अप्रतिम समन्वय।',
    stats: [
      { value: '10,000+', labelEn: 'Aaryaveera Cadre', labelHi: 'आर्यवीरा वीरांगनाएं' },
      { value: '15+', labelEn: 'Regional Wings', labelHi: 'प्रांतीय प्रभाग' },
      { value: '45+', labelEn: 'Monographs', labelHi: 'शोध मोनोग्राफ' }
    ],
    dossierEn: {
      context: 'Unifying disparate martial and community chapters under one proud, evocative national banner, supported by rigorous epigraphical research on Vedic heroines.',
      tactics: 'Standardized warrior curriculum, regional martial demonstrations, and thought-leadership white papers.',
      legacy: 'Mobilized over 10,000 active young women wearing the Aaryaveera badge with pride.',
      citation: 'Aaryaveera National Manifesto (2023); Shakti Varta Epigraphical Series Vol. I.'
    },
    dossierHi: {
      context: 'देशभर में चल रहे विभिन्न शिविरों व अध्यायों को एक राष्ट्रीय प्रेरणादायी मंच से जोड़ा गया, साथ ही इतिहास के अनछुए नारी चरित्रों पर शोध प्रकाशित किया गया।',
      tactics: 'एकीकृत प्रशिक्षण पाठ्यक्रम, प्रांतीय नेतृत्व परिषदें, एवं वैचारिक शोध सम्मेलन।',
      legacy: 'हजारों वीरांगनाओं ने आर्यवीरा की स्वाभिमानी पहचान को आत्मसात किया।',
      citation: 'राष्ट्रीय महाधिवेशन प्रस्ताव २०२३; शक्ति वार्ता शोध शृंखला खंड १।'
    },
    image: '/IMG_20260908_201306.jpg'
  },
  {
    id: 'm2024',
    yearNumeric: 2024,
    dateDisplayEn: '2024 CE',
    dateDisplayHi: '२०२४ ईस्वी',
    epochEn: 'Institutional Sahyog',
    epochHi: 'संस्थागत सहयोग एवं शैक्षणिक प्रसार',
    nameEn: '150+ Schools & University Networks',
    nameHi: '१५०+ शैक्षणिक संस्थान एवं सहभागिता',
    yearsEn: '2024 · 18 Cities Across India',
    yearsHi: '२०२४ · १८ भारतीय नगर',
    quoteEn: 'Institutional alliances across colleges, schools, and corporate CSR collectives.',
    quoteHi: 'विश्वविद्यालयों, विद्यालयों और कॉर्पोरेट सीएसआर नेटवर्क्स के साथ औपचारिक सहभागिता।',
    descEn: 'Standardizing self-defense curriculums, crisis intervention workshops, and leadership certifications across 150+ schools and universities in 18 cities.',
    descHi: '१८ नगरों के १५० से अधिक विद्यालयों और विश्वविद्यालयों में आत्मरक्षा पाठ्यक्रम, संकट निवारण कार्यशालाएं और नेतृत्व प्रमाणन का मानकीकरण।',
    stats: [
      { value: '150+', labelEn: 'Schools Covered', labelHi: 'संबद्ध विद्यालय' },
      { value: '25,000+', labelEn: 'Students Impacted', labelHi: 'छात्राएं लाभान्वित' },
      { value: '18', labelEn: 'Cities in India', labelHi: 'भारतीय नगर' }
    ],
    dossierEn: {
      context: 'Institutionalizing martial arts and psychological safety modules directly into school and university calendars.',
      tactics: 'Weekly self-defense periods, anti-bullying workshops, and certified female trainer cohorts.',
      legacy: 'Directly reached 150+ institutions with 25,000+ students fortified with tangible life skills.',
      citation: 'State Education Board Partnership Report 2024; Sahyog Institutional Roster.'
    },
    dossierHi: {
      context: 'शैक्षणिक संस्थानों के वार्षिक कैलेंडर में आत्मरक्षा और मानसिक संबल को औपचारिक रूप से सम्मिलित किया गया।',
      tactics: 'साप्ताहिक शारीरिक प्रशिक्षण, चरित्र निर्माण कक्षाएं एवं महिला प्रशिक्षक प्रमाणन।',
      legacy: '१५०+ संस्थानों में २५,००० से अधिक छात्राओं को व्यावहारिक जीवन सुरक्षा कौशल से लैस किया गया।',
      citation: 'शिक्षा विभाग सहभागिता प्रतिवेदन २०२४; सहयोग संस्थागत अभिलेख।'
    },
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'm2025',
    yearNumeric: 2025,
    dateDisplayEn: '2025 CE',
    dateDisplayHi: '२०२५ ईस्वी',
    epochEn: 'Frontline Expansion & Tribal Outreach',
    epochHi: 'जनजातीय प्रसार एवं ग्राम्य सुरक्षा संबल',
    nameEn: 'Tribal Outreach & Sanctuary Pods',
    nameHi: 'जनजातीय अंचल एवं सुरक्षा संबल विस्तार',
    yearsEn: '2025 · 200+ Villages',
    yearsHi: '२०२५ · २००+ सुदूर ग्राम',
    quoteEn: 'Deep rural mobilization, tribal corridor safety networks, and rapid survivor assistance.',
    quoteHi: 'सुदूर जनजातीय अंचलों में सुरक्षा नेटवर्क, विधिक साक्षरता और पीड़ितों का सुरक्षित पुनर्वास।',
    descEn: 'Expanding deep into rural corridors and tribal districts; establishing localized community support cells, legal literacy circles, and safely reintegrating 13 minors into education.',
    descHi: 'सुदूर ग्रामीण और जनजातीय अंचलों तक विस्तार; स्थानीय सामुदायिक सुरक्षा प्रकोष्ठ, विधिक जागरूकता और बालिकाओं की शिक्षा में सुरक्षित पुनर्स्थापना।',
    stats: [
      { value: '200+', labelEn: 'Villages Active', labelHi: 'सक्रिय ग्राम' },
      { value: '35,000+', labelEn: 'Cadets Prepared', labelHi: 'तैयार वीरांगनाएं' },
      { value: '13', labelEn: 'Minors Reintegrated', labelHi: 'बालिकाएं पुनर्स्थापित' }
    ],
    dossierEn: {
      context: 'Created dedicated rural and tribal task forces to provide physical safeguarding and counter coercion in under-resourced areas.',
      tactics: 'Mobile training squads, panchayat partnerships, and coordinated child-protection interventions.',
      legacy: 'Secured 200+ villages with active community watch pods and survivor reintegration networks.',
      citation: 'Frontline Field Audit 2025; District Panchayat Commendation Archives.'
    },
    dossierHi: {
      context: 'संसाधन-विहीन क्षेत्रों में बालिकाओं की शारीरिक सुरक्षा और शोषण निवारण हेतु समर्पित ग्रामीण कार्यदल की स्थापना।',
      tactics: 'चल-प्रशिक्षण दल, पंचायत सहभागिता और बाल-संरक्षण समितियों के साथ समन्वय।',
      legacy: '२००+ गांवों में सक्रिय वीरांगना सुरक्षा प्रकोष्ठ और सुरक्षित पुनर्वास तंत्र की स्थापना।',
      citation: 'धरातलीय निरीक्षण प्रतिवेदन २०२५; जिला पंचायत सम्मान अभिलेख।'
    },
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'm2026',
    yearNumeric: 2026,
    dateDisplayEn: '2026 CE',
    dateDisplayHi: '२०२६ ईस्वी',
    epochEn: 'National Sovereign Movement',
    epochHi: 'अखिल भारतीय संप्रभु मंच (वर्तमान)',
    nameEn: '400+ Schools & National Vanguard (Current)',
    nameHi: '४००+ विद्यालय एवं राष्ट्रीय मंच (वर्तमान)',
    yearsEn: '2026 · 28 Cities Across India',
    yearsHi: '२०२६ · २८ भारतीय नगर',
    quoteEn: 'From village mats to national sovereign power — Shakti Sabha stands at the heart of India\'s women\'s empowerment.',
    quoteHi: 'ग्रामीण शिविरों से लेकर राष्ट्रीय पहचान तक — शक्ति सभा भारत के नारी सशक्तीकरण के केंद्र में।',
    descEn: 'From village camps to national recognition — Shakti Sabha stands at the vanguard of women\'s sovereign dignity. Operating across 400+ schools, 28 cities, and impacting lakhs of lives nationwide in 2026.',
    descHi: 'ग्रामीण शिविरों से लेकर राष्ट्रीय पहचान तक — शक्ति सभा भारत के महिला सशक्तिकरण के केंद्र में। २०२६ में ४०० से अधिक विद्यालयों, २८ नगरों में सक्रिय और लाखों बहनों के जीवन में स्वाभिमान की पुनर्स्थापना।',
    stats: [
      { value: '400+', labelEn: 'Schools Active', labelHi: 'सक्रिय विद्यालय' },
      { value: '50,000+', labelEn: 'Trained Girls', labelHi: 'प्रशिक्षित वीरांगनाएं' },
      { value: '28', labelEn: 'Cities in India', labelHi: 'भारतीय नगर' }
    ],
    dossierEn: {
      context: 'Full-spectrum institutional scaling across hundreds of institutions with accredited warrior modules and 3D digital archival ecosystem.',
      tactics: 'Standardized martial arts syllabus, self-defense masterclasses, peer counseling, and certified female trainers.',
      legacy: 'Directly reached 400+ schools with 50,000+ girls equipped with tangible defense competencies and cognitive fortitude.',
      citation: 'Annual Report 2026; Ministry of Women & Youth Affairs Recognition Archive.'
    },
    dossierHi: {
      context: 'मान्यता प्राप्त प्रशिक्षण मॉड्यूल, डिजिटल आर्काइव और व्यापक सहभागिता के साथ राष्ट्रीय स्तर पर प्रसार।',
      tactics: 'मानकीकृत आत्मरक्षा पाठ्यक्रम, मास्टरक्लास, गोपनीय काउंसलिंग एवं महिला प्रशिक्षिकाओं का प्रमाणीकरण।',
      legacy: '४०० से अधिक विद्यालयों तक सीधी पहुंच और ५०,००० से अधिक बेटियों को व्यावहारिक सुरक्षा कौशल।',
      citation: 'वार्षिक प्रतिवेदन २०२६; महिला एवं युवा कल्याण सहभागिता अभिलेख।'
    },
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80'
  }
];

export default function HistoryPage() {
  const [lang, setLang] = useState<Lang>('en')
  const [activeDossier, setActiveDossier] = useState<Milestone | null>(null)
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>('m2019')
  const [maxReachedIndex, setMaxReachedIndex] = useState<number>(0)
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({})
  const [scrollProgress, setScrollProgress] = useState(0)
  const [lineLeft, setLineLeft] = useState(0)
  const [lineWidth, setLineWidth] = useState(0)

  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const triggerRef = useRef<ScrollTrigger | null>(null)

  // Horizontal Scroll Animation: Pins the viewport and scrolls the track horizontally
  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const totalMilestones = TIMELINE_MILESTONES.length

    const updateMeasurements = () => {
      const firstItem = itemRefs.current[0]
      const lastItem = itemRefs.current[totalMilestones - 1]
      if (firstItem && lastItem) {
        const startX = firstItem.offsetLeft + firstItem.offsetWidth / 2
        const endX = lastItem.offsetLeft + lastItem.offsetWidth / 2
        setLineLeft(startX)
        return { startX, endX, totalDist: Math.max(0, endX - startX) }
      }
      return { startX: 0, endX: track.scrollWidth, totalDist: track.scrollWidth }
    }

    const { startX, totalDist } = updateMeasurements()

    const getScrollDistance = () => {
      return Math.max(0, track.scrollWidth - window.innerWidth + 200)
    }

    const totalScroll = getScrollDistance()
    if (totalScroll <= 0) return

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        x: () => -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.max(window.innerHeight * 2.2, totalScroll * 1.2)}`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.3,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setScrollProgress(self.progress)

            // Red line smoothly glides from dot 0 to active milestone dot and beyond
            const currentLineWidth = totalDist * self.progress
            setLineWidth(currentLineWidth)

            // Determine active milestone based on scroll progress
            const activeIdx = Math.min(
              totalMilestones - 1,
              Math.max(0, Math.floor(self.progress * totalMilestones * 0.999))
            )
            setActiveMilestoneId(TIMELINE_MILESTONES[activeIdx].id)
            setMaxReachedIndex((prev) => Math.max(prev, activeIdx))
          },
        },
      })
      triggerRef.current = tween.scrollTrigger ?? null
    }, section)

    const timer = setTimeout(() => {
      updateMeasurements()
      ScrollTrigger.refresh()
    }, 250)

    const onResize = () => {
      updateMeasurements()
    }
    window.addEventListener('resize', onResize)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
      ctx.revert()
      triggerRef.current = null
    }
  }, [])

  const scrollToMilestone = (index: number) => {
    const st = triggerRef.current
    if (!st) return
    const totalMilestones = TIMELINE_MILESTONES.length
    const targetScroll = st.start + (index / (totalMilestones - 1)) * (st.end - st.start)
    setMaxReachedIndex((prev) => Math.max(prev, index))
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    })
  }

  const activeMilestoneIndex = TIMELINE_MILESTONES.findIndex((m) => m.id === activeMilestoneId)

  const handlePrev = () => {
    const prevIdx = Math.max(0, (activeMilestoneIndex === -1 ? 0 : activeMilestoneIndex) - 1)
    scrollToMilestone(prevIdx)
  }

  const handleNext = () => {
    const nextIdx = Math.min(
      TIMELINE_MILESTONES.length - 1,
      (activeMilestoneIndex === -1 ? 0 : activeMilestoneIndex) + 1
    )
    scrollToMilestone(nextIdx)
  }

  const handleImageLoad = (src: string) => {
    setLoadedImages(prev => ({ ...prev, [src]: true }))
  }

  // Prevent background scroll and pause Lenis while Inspect Dossier modal is open
  useEffect(() => {
    if (activeDossier) {
      document.body.style.overflow = 'hidden'
      if (typeof window !== 'undefined') {
        ;(window as any).lenis?.stop()
      }
    } else {
      document.body.style.overflow = ''
      if (typeof window !== 'undefined') {
        ;(window as any).lenis?.start()
      }
    }
    return () => {
      document.body.style.overflow = ''
      if (typeof window !== 'undefined') {
        ;(window as any).lenis?.start()
      }
    }
  }, [activeDossier])

  const currentMilestone = useMemo(() => {
    return TIMELINE_MILESTONES.find(m => m.id === activeMilestoneId) || TIMELINE_MILESTONES[0]
  }, [activeMilestoneId])

  return (
    <div className={h.pageContainer}>
      {/* ── STICKY TOP HEADER ────────────────────────────────────── */}
      <header className={h.topHeaderBar}>
        <div className={h.headerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className={h.brandPill}>
              {lang === 'en' ? 'Historic Journey (2019–2026)' : 'ऐतिहासिक यात्रा (२०१९–२०२६)'}
            </span>
          </div>

          <div className={h.headerCenterTitle}>
            <span>{lang === 'en' ? 'The Ascending Arc of ' : 'शक्ति सभा का '}</span>
            <span className={h.crimsonAccent}>
              {lang === 'en' ? 'History' : 'ऐतिहासिक सफर'}
            </span>
          </div>

          {/* Strict Bilingual Translator: Zero Hinglish Mixing */}
          <div className={h.langSwitcher}>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`${h.langBtn} ${lang === 'en' ? h.langBtnActive : ''}`}
              aria-label="Switch to Pure English"
            >
              <GoogleIcon name="language" size={16} /> English
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`${h.langBtn} ${lang === 'hi' ? h.langBtnActive : ''}`}
              aria-label="शुद्ध हिन्दी में बदलें"
            >
              <GoogleIcon name="translate" size={16} /> हिन्दी
            </button>
          </div>
        </div>
      </header>

      {/* ── INTRO BANNER ─────────────────────────────────────────── */}
      <section className={h.introSection}>
        <span className={h.introBadge}>
          {lang === 'en' ? 'Chronological Spine · 2019 to 2026' : 'ऐतिहासिक कालक्रम · २०१९ से २०२६ तक'}
        </span>
        <h1 className={h.introTitle}>
          {lang === 'en' ? 'Historical Journey of ' : 'शक्ति सभा का ऐतिहासिक '}
          <span className={h.crimsonAccent}>
            {lang === 'en' ? 'Shakti Sabha' : 'धरातलीय इतिहास'}
          </span>
        </h1>
        <p className={h.introDesc}>
          {lang === 'en'
            ? 'Tracing 7 years of unyielding courage and independent field action starting from 2019 to 2026. As you scroll, each milestone reveals its round photo, community accomplishments, and verified archival dossier.'
            : '२०१९ के प्रथम शिविरों से लेकर आज के २०२६ के अखिल भारतीय शक्ति आंदोलन तक ७ वर्षों की प्रेरक यात्रा। जैसे-जैसे आप स्क्रॉल करेंगे, वर्तमान वर्ष का चित्र, उपलब्धियाँ और पुरातात्विक अभिलेख स्वतः विस्तार लेंगे।'}
        </p>
        <div className={h.scrollProgressPill}>
          <Compass size={14} color="#bd1834" />
          <span>{lang === 'en' ? 'Current Active Milestone:' : 'वर्तमान सक्रिय कालखंड:'}</span>
          <span className={h.scrollProgressVal}>
            {lang === 'en' ? currentMilestone.nameEn : currentMilestone.nameHi} ({lang === 'en' ? currentMilestone.dateDisplayEn : currentMilestone.dateDisplayHi})
          </span>
        </div>
      </section>

      {/* ============================================================
          THE HORIZONTAL PARALLEL TIMELINE (EXACT CODEPEN SYSTEM)
          ============================================================ */}
      <section className={h.horizontalTimelineSection} ref={sectionRef}>
        <div className={h.stickyViewport}>
          {/* Top Controls: Quick Year Pills + Nav Arrows */}
          <div className={h.timelineControlsBar}>
            <div className={h.timelineQuickYears}>
              {TIMELINE_MILESTONES.map((item, idx) => {
                const isActive = activeMilestoneId === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`${h.yearPill} ${isActive ? h.yearPillActive : ''}`}
                    onClick={() => scrollToMilestone(idx)}
                    title={lang === 'en' ? item.nameEn : item.nameHi}
                  >
                    {item.yearNumeric}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Horizontal Track Viewport */}
          <div className={h.horizontalTrackViewport}>
            <ul className={h.timeline} ref={trackRef}>
              {/* Dynamic Animated Active Progress Line: Starts at Dot 0 and precisely tracks each milestone */}
              <div
                className={h.timelineActiveSpine}
                style={{
                  left: `${lineLeft}px`,
                  width: `${lineWidth}px`,
                }}
              />

              {/* Exact alternating parallel items: Top (.directionL) and Bottom (.directionR) */}
              {TIMELINE_MILESTONES.map((item, idx) => {
                const isTop = idx % 2 === 0
                const isActive = activeMilestoneId === item.id
                const isReached = idx <= Math.max(maxReachedIndex, activeMilestoneIndex)

                return (
                  <li
                    key={item.id}
                    ref={(el) => {
                      itemRefs.current[idx] = el
                    }}
                    className={`${h.timelineItem} ${isActive ? h.itemActive : ''} ${isReached ? h.itemPassed : ''}`}
                    onClick={() => {
                      setActiveMilestoneId(item.id)
                      setMaxReachedIndex((prev) => Math.max(prev, idx))
                      scrollToMilestone(idx)
                    }}
                  >
                    {/* Dedicated Spine Dot on the Central 6px Line: ZERO overlap with date */}
                    <div className={`${h.spineDot} ${isReached ? h.spineDotReached : h.spineDotUnreached}`} />

                    {/* Vertical Stem: only visible once date is reached */}
                    {isReached && <div className={isTop ? h.stemTop : h.stemBottom} />}

                    {/* Date, Flag & Details: Once revealed upon reach, they STAY visible as you scroll! */}
                    {isReached && (
                      <div className={`${isTop ? h.directionL : h.directionR} ${h.milestoneBoxRevealed}`}>
                        <div className={h.flagWrapper}>
                          <span className={`${h.flag} ${isActive ? h.flagActive : ''}`}>
                            {lang === 'en' ? item.nameEn : item.nameHi}
                          </span>
                          <span className={h.timeWrapper}>
                            <span className={h.time}>
                              {lang === 'en' ? item.dateDisplayEn : item.dateDisplayHi}
                            </span>
                          </span>
                        </div>

                        {/* Detail card stays visible for all reached milestones, highlighted when active */}
                        <div className={`${h.desc} ${isActive ? h.descActive : ''}`}>
                          <div className={h.descTop}>
                            <div className={h.roundThumbnail}>
                              <img
                                src={item.image}
                                alt={lang === 'en' ? item.nameEn : item.nameHi}
                                onLoad={() => handleImageLoad(item.image)}
                                style={{
                                  opacity: loadedImages[item.image] ? 1 : 0,
                                  transition: 'opacity 0.25s ease',
                                }}
                              />
                            </div>
                            <div className={h.descQuote}>
                              "{lang === 'en' ? item.quoteEn : item.quoteHi}"
                            </div>
                          </div>

                          <p className={h.descText}>
                            {lang === 'en' ? item.descEn : item.descHi}
                          </p>

                          {/* Year-wise stats badges */}
                          <div className={h.timelineStatBadges}>
                            {item.stats.map((st, sIdx) => (
                              <span key={sIdx} className={h.timelineStatItem}>
                                <strong>{st.value}</strong> {lang === 'en' ? st.labelEn : st.labelHi}
                              </span>
                            ))}
                          </div>

                          <button
                            type="button"
                            className={h.dossierBtn}
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveDossier(item)
                            }}
                          >
                            <BookOpen size={12} />
                            <span>
                              {lang === 'en' ? 'Inspect Dossier' : 'दस्तावेज देखें'}
                            </span>
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX MODAL FOR FULL HISTORICAL ARCHIVAL DOSSIER ─────── */}
      {activeDossier && (
        <div
          className={h.modalBackdrop}
          onClick={() => setActiveDossier(null)}
          role="dialog"
          aria-modal="true"
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
        >
          <div
            className={h.modalSheet}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={h.modalCloseBtn}
              onClick={() => setActiveDossier(null)}
              aria-label={lang === 'en' ? 'Close dossier' : 'अभिलेख बंद करें'}
            >
              <X size={16} />
            </button>

            <div className={h.modalHeroBanner}>
              <img
                src={activeDossier.image}
                alt={lang === 'en' ? activeDossier.nameEn : activeDossier.nameHi}
                onLoad={() => handleImageLoad(activeDossier.image)}
                style={{
                  opacity: loadedImages[activeDossier.image] ? 1 : 0
                }}
              />
            </div>

            <div className={h.modalBadgeRow}>
              {lang === 'en' ? 'Verified Primary Archival Dossier' : 'प्रमाणित पुरातात्विक अभिलेख'}
            </div>

            <h2 className={h.modalPersonTitle}>
              {lang === 'en' ? activeDossier.nameEn : activeDossier.nameHi}
            </h2>

            <div className={h.modalEraYears}>
              {lang === 'en' ? activeDossier.yearsEn : activeDossier.yearsHi}
            </div>

            <div className={h.modalQuoteCallout}>
              "{lang === 'en' ? activeDossier.quoteEn : activeDossier.quoteHi}"
            </div>

            <div className={h.modalBodyStack}>
              <div>
                <span className={h.modalSectionHeading}>
                  {lang === 'en' ? '1. Ground Context & Genesis:' : '१. धरातलीय संदर्भ एवं पृष्ठभूमि:'}
                </span>
                <p>
                  {lang === 'en'
                    ? activeDossier.dossierEn.context
                    : activeDossier.dossierHi.context}
                </p>
              </div>

              <div>
                <span className={h.modalSectionHeading}>
                  {lang === 'en'
                    ? '2. Martial & Strategic Innovation:'
                    : '२. सामरिक नवाचार एवं रणनीति:'}
                </span>
                <p>
                  {lang === 'en'
                    ? activeDossier.dossierEn.tactics
                    : activeDossier.dossierHi.tactics}
                </p>
              </div>

              <div>
                <span className={h.modalSectionHeading}>
                  {lang === 'en'
                    ? '3. Community Impact & Lasting Legacy:'
                    : '३. सामाजिक प्रभाव एवं ऐतिहासिक उपलब्धि:'}
                </span>
                <p>
                  {lang === 'en'
                    ? activeDossier.dossierEn.legacy
                    : activeDossier.dossierHi.legacy}
                </p>
              </div>

              <div className={h.modalCitationBox}>
                <span className={h.modalCitationLabel}>
                  {lang === 'en'
                    ? 'Verified Epigraphical / Archival Citation:'
                    : 'प्रमाणित अभिलेखीय संदर्भ:'}
                </span>
                <span className={h.modalCitationText}>
                  {lang === 'en'
                    ? activeDossier.dossierEn.citation
                    : activeDossier.dossierHi.citation}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
