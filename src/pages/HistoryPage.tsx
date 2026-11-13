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
   Historical Milestones: 2012 to Current (2024)
   7 Years of Independent Shakti Sabha Impact (2019–Present)
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
    id: 'm2012',
    yearNumeric: 2012,
    dateDisplayEn: '2012 CE',
    dateDisplayHi: '२०१२ ईस्वी',
    epochEn: 'Genesis & Vision',
    epochHi: 'स्थापना एवं संकल्प',
    nameEn: 'Shakti Sabha Founded',
    nameHi: 'शक्ति सभा की स्थापना',
    yearsEn: '2012 · Pune, Maharashtra',
    yearsHi: '२०१२ · पुणे, महाराष्ट्र',
    quoteEn: 'Born in Pune, Maharashtra — with a vision to unite the strength of women across India.',
    quoteHi: 'पुणे, महाराष्ट्र में जन्म — भारत भर में नारी शक्ति को एकजुट करने के पावन संकल्प के साथ।',
    descEn: 'Born in Pune, Maharashtra — with a vision to unite the strength of women across India. Grounded in timeless civilizational roots and modern psychological support.',
    descHi: 'पुणे, महाराष्ट्र में जन्म — भारत भर में नारी शक्ति को एकजुट करने के पावन संकल्प के साथ। प्राचीन गौरव एवं आधुनिक मनोवैज्ञानिक संबल की नींव रखी गई।',
    stats: [
      { value: '1st', labelEn: 'Center (Pune)', labelHi: 'प्रथम केंद्र (पुणे)' },
      { value: '12', labelEn: 'Founders', labelHi: 'संस्थापक' },
      { value: '1', labelEn: 'Charter', labelHi: 'मूल संकल्प' }
    ],
    dossierEn: {
      context: 'Founded in Pune by dedicated social visionaries to create a pan-India platform for women’s psychological, physical, and historical empowerment.',
      tactics: 'Community-led grassroots circles, cultural awakening lectures, and safe neighborhood support pods.',
      legacy: 'Established the core foundational philosophy that powered a nationwide movement across 12+ years.',
      citation: 'Shakti Sabha Founding Charter (Pune, 2012); Registration Deed #SS-2012/MH.'
    },
    dossierHi: {
      context: 'पुणे में समर्पित समाजसेवियों द्वारा महिलाओं के मानसिक, शारीरिक एवं ऐतिहासिक सशक्तिकरण हेतु अखिल भारतीय मंच की स्थापना की गई।',
      tactics: 'सामुदायिक बैठकें, सांस्कृतिक जागरण व्याख्यान तथा मोहल्ला-स्तर पर सुरक्षा संवाद।',
      legacy: 'उस मूल वैचारिक दर्शन की स्थापना हुई जिसने आगे चलकर देशव्यापी शक्ति आंदोलन का रूप लिया।',
      citation: 'शक्ति सभा स्थापना विलेख (पुणे, २०१२); पंजीयन सं. SS-2012/MH।'
    },
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'm2014',
    yearNumeric: 2014,
    dateDisplayEn: '2014 CE',
    dateDisplayHi: '२०१४ ईस्वी',
    epochEn: 'Warrior Awakening',
    epochHi: 'वीरांगना आत्मरक्षा शिविर',
    nameEn: 'First Warrior Camp',
    nameHi: 'प्रथम वीरांगना आत्मरक्षा शिविर',
    yearsEn: '2014 · Rural Pune District',
    yearsHi: '२०१४ · ग्रामीण पुणे जिला',
    quoteEn: 'The inaugural self-defense camp reached 200 women across rural Pune district.',
    quoteHi: 'ग्रामीण पुणे जिले में प्रथम आत्मरक्षा शिविर का आयोजन, जिसमें २०० महिलाओं व बालिकाओं ने भाग लिया।',
    descEn: 'The inaugural self-defense camp reached 200 women across rural Pune district — laying down practical martial arts, lathi training, and psychological fearlessness.',
    descHi: 'ग्रामीण पुणे जिले में प्रथम आत्मरक्षा शिविर का आयोजन, जिसमें २०० महिलाओं व बालिकाओं ने भाग लिया — पारंपरिक लाठी कौशल एवं भयमुक्त मानसिक दृढ़ता का प्रशिक्षण।',
    stats: [
      { value: '200+', labelEn: 'Girls Trained', labelHi: 'बालिकाएं प्रशिक्षित' },
      { value: '1st', labelEn: 'Rural Camp', labelHi: 'ग्रामीण शिविर' },
      { value: '100%', labelEn: 'Lathi Prepared', labelHi: 'लट्ठ-कौशल' }
    ],
    dossierEn: {
      context: 'Launched in rural outskirts of Pune to equip young girls with physical courage for daily travel.',
      tactics: 'Traditional Bharatiya martial defense combined with rapid situational awareness drills.',
      legacy: 'Proved the scalability of self-defense training for rural school and college students.',
      citation: 'Warrior Camp Field Log 2014; Pune District Panchayat Commendation.'
    },
    dossierHi: {
      context: 'दैनिक आवागमन में छात्राओं के मन से भय समाप्त करने हेतु पुणे के ग्रामीण अंचल में शुभारंभ किया गया।',
      tactics: 'पारंपरिक भारतीय आत्मरक्षा तकनीक, त्वरित सजगता एवं मनोवैज्ञानिक आत्मविश्वास।',
      legacy: 'ग्रामीण छात्राओं हेतु आत्मरक्षा प्रशिक्षण की ऐतिहासिक सफलता सिद्ध हुई।',
      citation: 'शिविर दैनंदिनी २०१४; पुणे जिला पंचायत प्रशंसा पत्र।'
    },
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'm2016',
    yearNumeric: 2016,
    dateDisplayEn: '2016 CE',
    dateDisplayHi: '२०१६ ईस्वी',
    epochEn: 'Institutional Reach',
    epochHi: 'शैक्षणिक संस्थानों में विस्तार',
    nameEn: '100 Schools Reached',
    nameHi: '१०० विद्यालयों तक विस्तार',
    yearsEn: '2016 · State-wide Schools',
    yearsHi: '२०१६ · राज्य स्तरीय विद्यालय',
    quoteEn: 'Mardini expanded to 100 schools — bringing self-defense and character education to young girls.',
    quoteHi: 'मिशन मर्दिनी १०० विद्यालयों तक विस्तृत — युवा छात्राओं को आत्मरक्षा एवं चारित्रिक शिक्षण प्रदान किया।',
    descEn: 'Mardini expanded to 100 schools — bringing self-defense and character education to young girls. Building resilience, self-worth, and proactive safety instincts.',
    descHi: 'मिशन मर्दिनी १०० विद्यालयों तक विस्तृत — युवा छात्राओं को आत्मरक्षा एवं चारित्रिक शिक्षण प्रदान किया। आत्मसम्मान और सजगता को दैनिक जीवन का हिस्सा बनाया।',
    stats: [
      { value: '100', labelEn: 'Schools Covered', labelHi: 'विद्यालय सहभागिता' },
      { value: '35,000+', labelEn: 'Students', labelHi: 'छात्राएं' },
      { value: '5', labelEn: 'Districts', labelHi: 'जिले सम्मिलित' }
    ],
    dossierEn: {
      context: 'Institutionalized in school curriculums across primary and secondary schools.',
      tactics: 'Weekly martial arts periods, anti-bullying workshops, and physical fitness certification.',
      legacy: 'Directly empowered over 35,000 young girls across Maharashtra schools.',
      citation: 'State Education Board Partnership Report 2016; School Survey Vol. IV.'
    },
    dossierHi: {
      context: 'प्राथमिक एवं माध्यमिक विद्यालयों के पाठ्यक्रम में आत्मरक्षा सत्रों को समाहित किया गया।',
      tactics: 'साप्ताहिक शारीरिक प्रशिक्षण, चरित्र निर्माण कक्षाएं एवं फिटनेस प्रमाणन।',
      legacy: 'महाराष्ट्र के १०० विद्यालयों में ३५,००० से अधिक छात्राओं को सीधे सशक्त बनाया गया।',
      citation: 'शिक्षा बोर्ड सहभागिता प्रतिवेदन २०१६; विद्यालय सर्वेक्षण खंड ४।'
    },
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'm2018',
    yearNumeric: 2018,
    dateDisplayEn: '2018 CE',
    dateDisplayHi: '२०१८ ईस्वी',
    epochEn: 'Healing & Support',
    epochHi: 'मानसिक संबल एवं परामर्श',
    nameEn: 'Shakti Bhava Launched',
    nameHi: 'शक्ति भाव का शुभारंभ',
    yearsEn: '2018 · Pan-India Helpline',
    yearsHi: '२०१८ · अखिल भारतीय संबल प्रकोष्ठ',
    quoteEn: 'Survivor support and counseling programs formalized — breaking the silence on gender-based trauma.',
    quoteHi: 'संबल एवं परामर्श कार्यक्रमों की औपचारिक शुरुआत — हिंसा व मानसिक आघात पर मौन तोड़ा।',
    descEn: 'Survivor support and counseling programs formalized — breaking the silence on gender-based trauma. Offering unconditional empathy and confidential psychological care.',
    descHi: 'संबल एवं परामर्श कार्यक्रमों की औपचारिक शुरुआत — हिंसा व मानसिक आघात पर मौन तोड़ा। महिलाओं के लिए सुरक्षित, गोपनीय एवं निःशुल्क परामर्श मंच स्थापित।',
    stats: [
      { value: '1,200+', labelEn: 'Counseling Pods', labelHi: 'परामर्श सत्र' },
      { value: '24/7', labelEn: 'Crisis Helpline', labelHi: 'संबल प्रकोष्ठ' },
      { value: '100%', labelEn: 'Confidential', labelHi: 'पूर्ण गोपनीयता' }
    ],
    dossierEn: {
      context: 'Created to provide safe, stigma-free counseling for women confronting domestic distress, grief, and societal pressure.',
      tactics: 'Certified female clinical psychologists, toll-free discreet helpline, and peer support recovery circles.',
      legacy: 'Handled thousands of counseling sessions with 100% confidentiality and emotional healing.',
      citation: 'Shakti Bhava Clinical Protocols (2018); Annual Care Summary.'
    },
    dossierHi: {
      context: 'घरेलू हिंसा, सामाजिक दबाव एवं अवसाद से पीड़ित बहनों को बिना किसी लोकलाज के परामर्श उपलब्ध कराने हेतु प्रारंभ।',
      tactics: 'प्रमाणित महिला मनोवैज्ञानिक, पूर्णतः गोपनीय परामर्श प्रणाली तथा आत्मीय संबल समूह।',
      legacy: 'हजारों महिलाओं को मानसिक तनाव से मुक्त कर पुनः आत्मविश्वासी जीवन प्रदान किया।',
      citation: 'शक्ति भाव परामर्श नियमावली (२०१८); वार्षिक सेवा प्रतिवेदन।'
    },
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'm2022',
    yearNumeric: 2022,
    dateDisplayEn: '2022 CE',
    dateDisplayHi: '२०२२ ईस्वी',
    epochEn: 'Unified Identity',
    epochHi: 'आर्यवीरा का उद्घोष',
    nameEn: 'Aaryaveera Launched',
    nameHi: 'आर्यवीरा आंदोलन का उद्घोष',
    yearsEn: '2022 · National Identity',
    yearsHi: '२०२२ · राष्ट्रीय पहचान',
    quoteEn: 'The flagship warrior brand — Aaryaveera — born as a unified identity for the whole movement.',
    quoteHi: 'संपूर्ण शक्ति आंदोलन की पहचान के रूप में प्रमुख वीरांगना ब्रांड \u2018आर्यवीरा\u2019 का प्राकट्य।',
    descEn: 'The flagship warrior brand — Aaryaveera — born as a unified identity for the whole movement. Combining ancient warrior heritage with modern discipline.',
    descHi: 'संपूर्ण शक्ति आंदोलन की पहचान के रूप में प्रमुख वीरांगना ब्रांड \u2018आर्यवीरा\u2019 का प्राकट्य। प्राचीन शौर्य परंपरा और आधुनिक अनुशासन का अप्रतिम समन्वय।',
    stats: [
      { value: '100K+', labelEn: 'Aaryaveera Cadre', labelHi: 'आर्यवीरा वीरांगनाएं' },
      { value: '15+', labelEn: 'Regional Wings', labelHi: 'प्रांतीय प्रभाग' },
      { value: 'Dharma', labelEn: 'Worldview', labelHi: 'क्षात्र-धर्म' }
    ],
    dossierEn: {
      context: 'Unifying disparate martial and community chapters under one proud, evocative national banner.',
      tactics: 'Uniform warrior curriculum, state leadership councils, and regional martial demonstrations.',
      legacy: 'Mobilized over 100,000 active members proudly wearing the Aaryaveera identity.',
      citation: 'National Convention Proceedings 2022; Aaryaveera Manifesto.'
    },
    dossierHi: {
      context: 'देशभर में चल रहे विभिन्न शिविरों व अध्यायों को एक राष्ट्रीय प्रेरणादायी मंच से जोड़ा गया।',
      tactics: 'एकीकृत प्रशिक्षण पाठ्यक्रम, प्रांतीय नेतृत्व परिषदें एवं भव्य शौर्य प्रदर्शन।',
      legacy: '१ लाख से अधिक वीरांगनाओं ने आर्यवीरा की स्वाभिमानी पहचान को आत्मसात किया।',
      citation: 'राष्ट्रीय महाधिवेशन प्रस्ताव २०२२; आर्यवीरा घोषणा पत्र।'
    },
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'm2024',
    yearNumeric: 2024,
    dateDisplayEn: '2024 CE',
    dateDisplayHi: '२०२४ ईस्वी',
    epochEn: 'National Stage',
    epochHi: 'राष्ट्रीय पहचान एवं विस्तार',
    nameEn: '400+ Schools & National Stage',
    nameHi: '४००+ विद्यालय एवं राष्ट्रीय मंच',
    yearsEn: '2024 · Pan-India Impact',
    yearsHi: '२०२४ · अखिल भारतीय प्रभाव',
    quoteEn: 'From village camps to national recognition — Shakti Sabha stands at the heart of India\'s women\'s movement.',
    quoteHi: 'ग्रामीण शिविरों से लेकर राष्ट्रीय पहचान तक — शक्ति सभा भारत के महिला सशक्तिकरण के केंद्र में।',
    descEn: 'From village camps to national recognition — Shakti Sabha stands at the heart of India\'s women\'s movement. Operating in 400+ schools and impacting lakhs of lives nationwide.',
    descHi: 'ग्रामीण शिविरों से लेकर राष्ट्रीय पहचान तक — शक्ति सभा भारत के महिला सशक्तिकरण के केंद्र में। ४०० से अधिक विद्यालयों में सक्रिय और लाखों बहनों के जीवन में सकारात्मक परिवर्तन।',
    stats: [
      { value: '400+', labelEn: 'Schools Active', labelHi: 'सक्रिय विद्यालय' },
      { value: '50,000+', labelEn: 'Trained Girls', labelHi: 'प्रशिक्षित वीरांगनाएं' },
      { value: '28', labelEn: 'Cities in India', labelHi: 'भारतीय नगर' }
    ],
    dossierEn: {
      context: 'Expanding the model across hundreds of institutions with formal accredited training modules.',
      tactics: 'Standardized martial arts syllabus, self-defense masterclasses, and certified female trainers.',
      legacy: 'Directly reached 400+ schools with 50,000+ girls equipped with tangible defense competencies.',
      citation: 'Annual Report 2024; State Education Ministry commendation archives.'
    },
    dossierHi: {
      context: 'मान्यता प्राप्त प्रशिक्षण मॉड्यूल के साथ सैकड़ों शैक्षणिक संस्थानों तक इस अभियान का प्रसार।',
      tactics: 'मानकीकृत आत्मरक्षा पाठ्यक्रम, मास्टरक्लास एवं महिला प्रशिक्षिकाओं का प्रमाणीकरण।',
      legacy: '४०० से अधिक विद्यालयों तक सीधी पहुंच और ५०,००० से अधिक बेटियों को व्यावहारिक सुरक्षा कौशल।',
      citation: 'वार्षिक प्रतिवेदन २०२४; शिक्षा मंत्रालय सहभागिता अभिलेख।'
    },
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80'
  }
];

export default function HistoryPage() {
  const [lang, setLang] = useState<Lang>('en')
  const [activeDossier, setActiveDossier] = useState<Milestone | null>(null)
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>('m2012')
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
              {lang === 'en' ? 'Historic Journey (2012–2024)' : 'ऐतिहासिक यात्रा (२०१२–२०२४)'}
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
          {lang === 'en' ? 'Chronological Spine · 2012 to 2024' : 'ऐतिहासिक कालक्रम · २०१२ से २०२४ तक'}
        </span>
        <h1 className={h.introTitle}>
          {lang === 'en' ? 'Historical Journey of ' : 'शक्ति सभा का ऐतिहासिक '}
          <span className={h.crimsonAccent}>
            {lang === 'en' ? 'Shakti Sabha' : 'धरातलीय इतिहास'}
          </span>
        </h1>
        <p className={h.introDesc}>
          {lang === 'en'
            ? 'Tracing 7 years of unyielding courage and independent field action starting from 2019 to today’s pan-India movement. As you scroll, each milestone reveals its round photo, community accomplishments, and verified archival dossier.'
            : '२०१४ के प्रथम ग्रामीण शिविरों से लेकर आज के अखिल भारतीय शक्ति आंदोलन तक १२ वर्षों की प्रेरक यात्रा। जैसे-जैसे आप स्क्रॉल करेंगे, वर्तमान वर्ष का चित्र, उपलब्धियाँ और पुरातात्विक अभिलेख स्वतः विस्तार लेंगे।'}
        </p>
        <div className={h.scrollProgressPill}>
          <Compass size={14} color="#DC143C" />
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
