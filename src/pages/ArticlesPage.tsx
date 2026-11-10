import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { supabase, Article } from '../lib/supabase'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import s from './PageLayout.module.css'
import ap from './ArticlesPage.module.css'

export interface ArticleItem {
  id: string
  tag: string
  rating: string
  title: string
  hindiTitle?: string
  excerpt: string
  highlight: string
  author: string
  readTime: string
  image: string
  fullBody: {
    context: string
    keyFindings: string[]
    conclusion: string
  }
}

const ARTICLES_LIST: ArticleItem[] = [
  {
    id: 'art-1',
    tag: 'Clinical Psychology',
    rating: '9.6',
    title: 'महिलाओं में Depression के 10 छुपे हुए लक्षण',
    hindiTitle: 'जब दर्द बाहर नहीं दिखता पर अंदर से तोड़ता है',
    excerpt: 'भारतीय परिवारों में महिलाओं का अवसाद अक्सर अत्यधिक काम, चिड़चिड़ापन और मौन थकावट के पीछे छिप जाता है। जानिए कैसे इस अदृश्य संघर्ष को पहचानें और पुनर्प्राप्ति की ओर बढ़ें।',
    highlight: 'हाई-फंक्शनिंग अवसाद',
    author: 'Dr. Shruti Kulkarni (PTSD Specialist)',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    fullBody: {
      context: 'भारतीय समाज में महिलाएं अक्सर परिवार की प्राथमिक देखभालकर्ता होती हैं। ऐसे में उनका स्वयं का मानसिक स्वास्थ्य द्वितीयक बन जाता है। इस क्लिनिकल अध्ययन में 500 से अधिक महिलाओं के अनुभवों का दस्तावेजीकरण किया गया है।',
      keyFindings: [
        'उदासी की जगह लगातार चिड़चिड़ापन और अत्यधिक काम में खुद को डुबोए रखना।',
        'शारीरिक रूप से अस्पष्टीकृत दर्द — विशेषकर माइग्रेन, पीठ दर्द और पाचन संबंधी समस्याएं।',
        'स्वयं के लिए समय निकालने या आराम करने पर अत्यधिक अपराधबोध (Caregiver Guilt)।',
        'अपनों के बीच रहते हुए भी एक गहरी भावनात्मक शून्यता का अनुभव होना।',
        'दैनिक पारिवारिक दायित्वों को मशीन की तरह निभाना परंतु जीवन में आनंद का समाप्त हो जाना।'
      ],
      conclusion: 'शक्ति सभा का "शक्ति भाव" प्रकल्प महिलाओं को एक गोपनीय, सहानुभूतिपूर्ण और बिना किसी पूर्वाग्रह के सुरक्षित वातावरण प्रदान करता है जहाँ वे अपनी पीड़ा साझा कर सकती हैं।'
    }
  },
  {
    id: 'art-2',
    tag: 'Upanishadic Wisdom',
    rating: '9.5',
    title: 'गार्गी वाचक्नवी — शास्त्रार्थ में याज्ञवल्क्य को चुनौती',
    hindiTitle: 'वैदिक काल की प्रखर ब्रह्मवादिनी',
    excerpt: 'बृहदारण्यक उपनिषद के राजा जनक के दरबार में गार्गी ने अपनी दार्शनिक प्रखरता से समकालीन विद्वत समाज को झकझोर कर रख दिया। एक ऐतिहासिक दृष्टि जो नारी स्वाभिमान को पुनः परिभाषित करती है।',
    highlight: 'दार्शनिक स्वाभिमान',
    author: 'Shakti Sabha Research Cell',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80',
    fullBody: {
      context: 'राजा जनक के बहु-दक्षिणा यज्ञ में भारत भर के शीर्ष ऋषियों को आमंत्रित किया गया था। याज्ञवल्क्य के समक्ष जब बड़े-बड़े विद्वान मौन हो गए, तब गार्गी ने खड़े होकर ब्रह्मविद्या पर कठिनतम प्रश्न पूछे।',
      keyFindings: [
        'गार्गी ने ब्रह्मांड के ताने-बाने पर प्रश्न उठाते हुए पूछा: "हे याज्ञवल्क्य! यह संपूर्ण दृश्य जगत किसमें ओत-प्रोत है?"',
        'प्राचीन भारत में कन्याओं का उपनयन संस्कार, वेदाध्ययन और दार्शनिक सभाओं में नेतृत्व सामान्य अधिकार था।',
        'रूढ़िवादी व्याख्याओं द्वारा गार्गी जैसी विदुषियों के योगदान को मुख्यधारा के विमर्श से ओझल करने का प्रयास किया गया।'
      ],
      conclusion: 'गार्गी का आख्यान केवल अतीत की स्मृति नहीं है, बल्कि आज की प्रत्येक भारतीय बेटी के लिए बौद्धिक निर्भीकता का प्रेरणा-पुंज है।'
    }
  },
  {
    id: 'art-3',
    tag: 'Warrior Queens',
    rating: '9.8',
    title: 'रानी अब्बक्का चौटा — पहली Anti-Colonial Naval Commander',
    hindiTitle: 'उल्लाल की अपराजेय वीरांगना',
    excerpt: 'पुर्तगाली जहाजी बेड़ों को उल्लाल (कर्नाटक) के तटीय समुद्र में लगातार चार बार धूल चटाने वाली वीरांगना रानी की रणनीति और असाधारण नौसैनिक कौशल का प्रामाणिक इतिहास।',
    highlight: 'समुद्री रक्षा रणनीति',
    author: 'Shakti Sabha Historical Archives',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&auto=format&fit=crop&q=80',
    fullBody: {
      context: '१६वीं शताब्दी में जब पुर्तगाली साम्राज्य हिंद महासागर पर एकछत्र राज स्थापित करना चाहता था, तब कर्नाटक के एक छोटे से राज्य उल्लाल की रानी अब्बक्का ने उनके विशाल जहाजों को अग्निबाणों से भस्म कर दिया।',
      keyFindings: [
        'रानी अब्बक्का ने सभी जातियों, मछुआरों और स्थानीय लड़ाकों को एकजुट कर एक सशक्त तटीय रक्षा वाहिनी बनाई।',
        'पुर्तगाली गवर्नर डॉन अल्वारो दा सिल्वेरा को युद्ध में बुरी तरह खदेड़ दिया गया।',
        'उनकी युद्धनीति आधुनिक गुरिल्ला नौसैनिक युद्धकला का अप्रतिम प्राचीन उदाहरण है।'
      ],
      conclusion: 'रानी अब्बक्का का जीवन दर्शाता है कि मातृभूमि की रक्षा और स्वाभिमान के लिए शस्त्र उठाना नारी का सनातन धर्म रहा है।'
    }
  },
  {
    id: 'art-4',
    tag: 'Caregiver Wellness',
    rating: '9.2',
    title: 'Indian Women & Anxiety — अनकही थकान का मनोवैज्ञानिक हल',
    hindiTitle: 'पारिवारिक अपेक्षाओं के बीच मानसिक संतुलन',
    excerpt: 'घर, करियर और सामाजिक अपेक्षाओं के बीच पिसती सांसों का यथार्थ। जानिए कैसे सोमाटिक थेरेपी, श्वास तकनीक और स्पष्ट सीमाएं निर्धारित करके अपनी ऊर्जा को संरक्षित किया जाए।',
    highlight: 'सोमाटिक हीलिंग',
    author: 'Dr. Aditi Sharma (Neuro-Psychologist)',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    fullBody: {
      context: 'आधुनिक भारतीय कामकाजी महिलाओं पर "सुपर-वुमन" बनने का सामाजिक दबाव उनके तंत्रिका तंत्र को निरंतर तनाव मोड (Fight or Flight) में रखता है।',
      keyFindings: [
        'पुरानी थकान और मांसपेशियों का तनाव असल में अनसुलझे तनाव और दमित भावनाओं का शारीरिक प्रकटीकरण है।',
        'सहानुभूतिपूर्ण न कहना सीखना (Compassionate Boundary Setting) मानसिक स्वास्थ्य की पहली सीढ़ी है।',
        'दैनिक १५ मिनट का प्राणायाम और प्रामाणिक योगनिद्रा कोर्टिसोल स्तर को ३५% तक घटाती है।'
      ],
      conclusion: 'अपनी देखभाल करना कोई स्वार्थ नहीं, बल्कि परिवार और समाज को सशक्त रखने की मूल आवश्यकता है।'
    }
  },
  {
    id: 'art-5',
    tag: 'Civilizational Truths',
    rating: '9.4',
    title: 'वैदिक काल में नारी का स्थान — पाठ्यपुस्तकों ने क्या छिपाया?',
    hindiTitle: 'शिलालेखों और मूल ग्रंथों के प्रमाण',
    excerpt: 'शिलालेखीय साक्ष्य और वैदिक ऋचाएं जो सिद्ध करती हैं कि प्राचीन भारत में नारी पराधीन नहीं बल्कि सह-धर्मिणी, संपत्तिकर्ता, शस्त्रधारिणी और समाज की प्रेरक शक्ति थी।',
    highlight: 'ऐतिहासिक पुनर्स्थापना',
    author: 'Shakti Varta Research Group',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&auto=format&fit=crop&q=80',
    fullBody: {
      context: 'औपनिवेशिक काल में भारतीय समाज को पिछड़ा साबित करने हेतु महिलाओं की स्थिति का भ्रामक चित्रण प्रस्तुत किया गया, जो आज भी कई इतिहास पुस्तकों में दोहराया जाता है।',
      keyFindings: [
        'ऋग्वेद के लगभग ३० से अधिक सूक्तों की रचना लोपामुद्रा, घोषा, अपाला जैसी विदुषी ऋषिकाओं द्वारा की गई।',
        'विवाह के समय वर नहीं, बल्कि वधू को गृहस्वामिनी (साम्राज्ञी) के रूप में प्रतिष्ठित किया जाता था।',
        'मध्यकालीन आक्रमणों के काल में सुरक्षा की दृष्टि से उत्पन्न कुरीतियों को सनातन संस्कृति का अंग मान लेना सबसे बड़ा ऐतिहासिक प्रमाद है।'
      ],
      conclusion: 'सत्य को जानना ही आत्मसम्मान की पुनर्प्राप्ति का प्रथम सोपान है।'
    }
  },
  {
    id: 'art-6',
    tag: 'Mardini Combat',
    rating: '9.7',
    title: 'लट्ठ और तलवार — जब आत्मरक्षा जीवन-साधना बनी',
    hindiTitle: 'भय-मुक्ति और शारीरिक स्वाभिमान',
    excerpt: 'पारंपरिक लाठी और तलवारबाजी केवल शारीरिक व्यायाम नहीं है, बल्कि मस्तिष्क में भय के केंद्र को शांत करने और त्वरित निर्णय-क्षमता विकसित करने का प्राचीन विज्ञान है।',
    highlight: 'मार्शल आत्मविश्वास',
    author: 'Mission Mardini Tactical Wing',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    fullBody: {
      context: 'शक्ति सभा द्वारा संचालित "मिशन मर्दिनी" के अंतर्गत अब तक ४०० से अधिक विद्यालयों में लाखों बालिकाओं को पारंपरिक लट्ठ कला का प्रशिक्षण दिया गया है।',
      keyFindings: [
        'लट्ठ चालन से शरीर की परिधीय दृष्टि (Peripheral Vision) और संतुलन में असाधारण सुधार होता है।',
        'शारीरिक रूप से सक्षम बालिकाएं सार्वजनिक स्थानों पर बिना भय और संकोच के विचरण करती हैं।',
        'मार्शल आर्ट्स का अभ्यास कोर्टिसोल घटाकर आत्म-विश्वास के डोपामाइन पाथवे को सक्रिय करता है।'
      ],
      conclusion: 'प्रत्येक भारतीय कन्या के हाथ में कलम के साथ-साथ आत्मरक्षा की सामर्थ्य होना राष्ट्र की सुरक्षा की पहली शर्त है।'
    }
  },
  {
    id: 'art-7',
    tag: 'Survivor Pods',
    rating: '9.3',
    title: 'घरेलू हिंसा से पुनर्वास तक — गरिमा और संबल का मार्ग',
    hindiTitle: 'पीड़िता से समाज-निर्मात्री बनने की यात्रा',
    excerpt: 'आर्थिक आत्मनिर्भरता, विधिक सहायता और मनोवैज्ञानिक संबल का एकीकृत मॉडल जो संकटग्रस्त बहनों को केवल राहत नहीं देता, बल्कि उन्हें स्वावलंबी नेतृत्वकर्ता बनाता है।',
    highlight: 'पुनर्वास इकोसिस्टम',
    author: 'Shakti Bhava Legal Pod',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80',
    fullBody: {
      context: 'घरेलू उत्पीड़न से बाहर निकलने वाली महिलाओं के सामने सबसे बड़ी चुनौती सामाजिक अलगाव और आर्थिक निर्भरता होती है। शक्ति सभा का सपोर्ट मॉडल इसी शून्यता को भरता है।',
      keyFindings: [
        'तात्कालिक सुरक्षित आश्रय, मेडिकल सहायता और विधिक प्राथमिकी (FIR) में सक्रिय सहयोग।',
        'दीर्घकालिक आजीविका के लिए कौशल विकास — जैसे स्वयं सहायता समूह और माइक्रो-बिजनेस मेंटॉरशिप।',
        'नियमित काउंसिलिंग से ट्रॉमा को शक्ति और समाज-सेवा के संकल्प में बदलना।'
      ],
      conclusion: 'जब एक बहन संभलती है, तो वह अपने पीछे आने वाली सैकड़ों बहनों का संबल बनती है।'
    }
  },
  {
    id: 'art-8',
    tag: 'Legal Armor',
    rating: '9.6',
    title: 'कानूनी अधिकार जो हर भारतीय महिला को मालूम होने चाहिए',
    hindiTitle: 'संवैधानिक सुरक्षा और व्यावहारिक कवच',
    excerpt: 'Zero FIR, घरेलू हिंसा संरक्षण अधिनियम, कार्यस्थल पर सुरक्षा (POSH), और पैतृक संपत्ति में समान अधिकार — कानूनी सुरक्षा की सरल और व्यावहारिक मार्गदर्शिका।',
    highlight: 'विधिक साक्षरता',
    author: 'Adv. Meenakshi Lekhi & Legal Associates',
    readTime: '11 min read',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    fullBody: {
      context: 'कानून की अज्ञानता के कारण कई महिलाएं अपने अधिकारों से वंचित रह जाती हैं। यह लेख भारतीय न्याय संहिता (BNS) और विशेष महिला सुरक्षा कानूनों का सार प्रस्तुत करता है।',
      keyFindings: [
        'Zero FIR: किसी भी थाने में अपराध की सूचना दर्ज कराई जा सकती है, भले ही अधिकार क्षेत्र कोई भी हो।',
        'महिला की गिरफ्तारी: सूर्यास्त के बाद और सूर्योदय से पहले महिला पुलिस अधिकारी की उपस्थिति के बिना गिरफ्तारी नहीं हो सकती।',
        'घरेलू हिंसा अधिनियम २००५: साझा गृहस्थी में रहने का अधिकार और अंतरिम भरण-पोषण की गारंटी।',
        'समान उत्तराधिकार: बेटियों का पैतृक संपत्ति में पुत्रों के बराबर जन्मसिद्ध अधिकार।'
      ],
      conclusion: 'कानून का ज्ञान भय को समाप्त करता है और स्वाभिमान से जीने का मार्ग प्रशस्त करता है।'
    }
  },
  {
    id: 'art-9',
    tag: 'Youth Leadership',
    rating: '9.5',
    title: 'आर्यवीरा दर्शन एवं नेतृत्व — बेटियों में शौर्य और संस्कार का रोपण',
    hindiTitle: 'चरित्र निर्माण से राष्ट्र निर्माण की ओर',
    excerpt: 'फाउंडर हर्षिता मानकर के आर्यवीरा दर्शन से प्रेरित शक्ति सभा के नेतृत्व और प्रशिक्षण अभियानों का सामाजिक प्रभाव प्रतिवेदन।',
    highlight: 'फाउंडर दर्शन',
    author: 'Shakti Sabha Research Collective',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    fullBody: {
      context: 'आर्यवीरा कोई संस्था या कार्यक्रम नहीं, बल्कि फाउंडर हर्षिता मानकर का व्यक्तिगत जीवन-दर्शन और वैचारिक पहचान है, जिसके सिद्धांतों पर शक्ति सभा का युवा नेतृत्व आंदोलन संचालित होता है।',
      keyFindings: [
        '१ लाख से अधिक प्रशिक्षित वीरांगनाएं आज विभिन्न क्षेत्रों में नेतृत्व कर रही हैं।',
        'ग्रामीण और नगरीय क्षेत्रों की बेटियों के मध्य सांस्कृतिक सेतु का निर्माण।',
        'शक्ति सभा के शिविरों में आत्मरक्षा, प्राथमिक चिकित्सा और आपदा प्रबंधन का समग्र व्यावहारिक प्रशिक्षण।'
      ],
      conclusion: 'सशक्त बेटी ही सशक्त परिवार और अजेय राष्ट्र की आधारशिला है।'
    }
  }
]

export default function ArticlesPage() {
  const [dbArticles, setDbArticles] = useState<ArticleItem[]>([])
  const [activeModalArticle, setActiveModalArticle] = useState<ArticleItem | null>(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({})

  const toggleCardExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedCardIds(prev => ({ ...prev, [id]: !prev[id] }))
  }

    useEffect(() => {
    if (activeModalArticle) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [activeModalArticle])

  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])


  useEffect(() => {
    async function loadArticles() {
      try {
        const { data } = await supabase
          .from('articles')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })

        if (data && data.length > 0) {
          const mapped: ArticleItem[] = (data as Article[]).map(a => ({
            id: a.id,
            tag: a.category || 'Article',
            rating: '9.8',
            title: a.title_en || a.title_hi || 'Untitled Article',
            hindiTitle: a.title_hi || undefined,
            excerpt: a.excerpt_en || a.excerpt_hi || (a.content_en?.slice(0, 160) ?? ''),
            highlight: a.tags?.[0] || 'Featured',
            author: a.author_name || 'Shakti Sabha Editorial',
            readTime: '6 min read',
            image: a.cover_image_url || 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80',
            fullBody: {
              context: a.content_en || a.content_hi || '',
              keyFindings: a.content_hi ? [a.content_hi] : [a.content_en || ''],
              conclusion: 'Published by Shakti Sabha Editorial Council.'
            }
          }))
          setDbArticles(mapped)
        }
      } catch (err) {
        console.warn('Articles fetch error:', err)
      }
    }
    loadArticles()
  }, [])

  const allArticles = dbArticles.length > 0 ? dbArticles : ARTICLES_LIST

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setTimeout(() => setSubscribed(false), 4000)
      setEmail('')
    }
  }

  return (
    <main className={s.page}>
      {/* ── TOP HERO BANNER ────────────────────────────────────────── */}
      <div className={ap.hero}>
        <div className={ap.heroInner}>
          <span className={ap.badge}>Content Ka Dil · Investigative Journalism</span>
          <h1 className={ap.title}>Articles & Deep Investigations</h1>
          <p className={ap.hindiSubtitle}>गहन शोध, वीरांगना इतिहास एवं मानसिक स्वास्थ्य</p>
          <p className={ap.desc}>
            Indian women ke liye — clinical psychology, ancient civilizational identity, legal armor, aur ek aisi community jo tumhari taraf hai.
            Explore our core investigations, research white papers, and articles below.
          </p>
        </div>
      </div>

      {/* ── FULL ARTICLE READING MODAL ─────────────────────────────── */}
      {activeModalArticle && (
        <div
          className={ap.modalOverlay}
          data-lenis-prevent="true"
          onClick={() => setActiveModalArticle(null)}
        >
          <div
            className={ap.modalContent}
            data-lenis-prevent="true"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveModalArticle(null)}
              className={ap.modalCloseBtn}
              aria-label="Close modal"
            >
              <X size={18} color="#374151" />
            </button>

            <div
              style={{
                fontSize: '0.75rem',
                color: '#DC143C',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '0.5rem',
              }}
            >
              Shakti Sabha Verified Investigation · {activeModalArticle.tag}
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display, "Cinzel", serif)',
                fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                color: '#111827',
                marginBottom: '0.5rem',
                lineHeight: 1.25,
              }}
            >
              {activeModalArticle.title}
            </h2>

            {activeModalArticle.hindiTitle && (
              <div
                style={{
                  fontFamily: 'var(--font-devanagari, "Noto Sans Devanagari", sans-serif)',
                  fontSize: '1.1rem',
                  color: '#DC143C',
                  marginBottom: '1rem',
                  fontWeight: 600,
                }}
              >
                {activeModalArticle.hindiTitle}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'center',
                fontSize: '0.82rem',
                color: '#6B7280',
                paddingBottom: '1.25rem',
                marginBottom: '1.5rem',
                borderBottom: '1px solid #E5E7EB',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><GoogleIcon name="edit" size={14} /> {activeModalArticle.author}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><GoogleIcon name="schedule" size={14} /> {activeModalArticle.readTime}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><GoogleIcon name="star" size={14} filled style={{ color: '#F59E0B' }} /> Score: {activeModalArticle.rating}/10</span>
            </div>

            <div
              style={{
                fontSize: '0.96rem',
                color: '#374151',
                lineHeight: 1.8,
              }}
            >
              <p style={{ marginBottom: '1.25rem', fontWeight: 500, fontSize: '1.02rem', color: '#1F2937' }}>
                {activeModalArticle.fullBody.context}
              </p>

              <div
                style={{
                  background: '#F9FAFB',
                  borderLeft: '4px solid #DC143C',
                  padding: '1.25rem 1.5rem',
                  borderRadius: '0 12px 12px 0',
                  margin: '1.5rem 0',
                }}
              >
                <div style={{ fontWeight: 700, color: '#111827', marginBottom: '0.75rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  प्रमुख निष्कर्ष एवं अवलोकन (Key Insights):
                </div>
                <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                  {activeModalArticle.fullBody.keyFindings.map((point, i) => (
                    <li key={i} style={{ marginBottom: '0.65rem' }}>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <p style={{ marginTop: '1.25rem', color: '#4B5563', fontStyle: 'italic' }}>
                {activeModalArticle.fullBody.conclusion}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── LOWER SECTION: COMPLETE ARCHIVE GRID ──────────────────── */}
      <div className={s.section}>
        <div style={{ marginTop: '2rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.72rem',
                  letterSpacing: '0.15em',
                  color: '#DC143C',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                Full Repository
              </span>
              <h2 className={s.sectionTitle} style={{ marginBottom: 0, marginTop: '0.35rem' }}>
                All Articles & White Papers
              </h2>
            </div>
            <Link to="/research" style={{ fontSize: '0.85rem', color: '#DC143C', fontWeight: 600 }}>
              View Thought-Lab White Papers →
            </Link>
          </div>

          <div className={ap.articlesGrid}>
            {allArticles.map((article) => (
              <div
                key={article.id}
                className={ap.articleCard}
                onClick={() => {
                  setActiveModalArticle(article)
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className={ap.cardImg}>
                  <img src={article.image} alt={article.title} loading="lazy" />
                  <span className={ap.cardTagBadge}>{article.tag}</span>
                </div>
                <div className={ap.cardBody}>
                  <div className={ap.cardMetaTop}>
                    <span className={ap.cardTag}>● {article.tag}</span>
                    <span className={ap.cardReadTime}>
                      <GoogleIcon name="schedule" size={13} /> {article.readTime}
                    </span>
                  </div>
                  <h3 className={ap.cardTitle} title={article.title}>{article.title}</h3>
                  {article.hindiTitle && (
                    <h4 className={ap.cardHindiTitle}>{article.hindiTitle}</h4>
                  )}
                  <p className={ap.cardExcerpt}>
                    {article.excerpt}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveModalArticle(article)
                    }}
                    className={ap.readMoreBtn}
                    title="Read complete article and key findings"
                  >
                    Read More →
                  </button>
                </div>
                <div className={ap.cardFooter}>
                  <span className={ap.authorText}>
                    <GoogleIcon name="person" size={14} style={{ color: '#9CA3AF' }} />
                    {article.author.split('(')[0]}
                  </span>
                  <span className={ap.ratingBadge}>
                    <GoogleIcon name="star" size={13} filled style={{ color: '#F59E0B' }} />
                    {article.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── THE SHAKTI DISPATCH NEWSLETTER BOX ────────────────────── */}
        <div className={ap.dispatchBox}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <span
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#E8C98A',
                fontWeight: 700,
              }}
            >
              Weekly Insights
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display, "Cinzel", serif)',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                color: '#FFFFFF',
                margin: '0.5rem 0 1rem',
              }}
            >
              The Shakti Dispatch
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                marginBottom: '2rem',
              }}
            >
              हर सप्ताह — एक नया शोध, एक विस्मृत वीरांगना की गाथा, और मनोवैज्ञानिक संबल। सीधा आपके इनबॉक्स में।
            </p>

            {subscribed ? (
              <div
                style={{
                  padding: '1.25rem',
                  background: 'rgba(220, 20, 60, 0.2)',
                  border: '1px solid #DC143C',
                  borderRadius: '12px',
                  color: '#FFB3BA',
                }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}><GoogleIcon name="mail" size={32} /></div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>सभा में स्वागत है!</div>
                <div style={{ fontSize: '0.85rem' }}>You are now subscribed to The Shakti Dispatch.</div>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="अपना ईमेल दर्ज करें..."
                  style={{
                    flex: '1 1 300px',
                    maxWidth: '400px',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '9999px',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.85rem 2.25rem',
                    borderRadius: '9999px',
                    background: '#DC143C',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                  }}
                >
                  Join Sabha →
                </button>
              </form>
            )}

            <div
              style={{
                fontSize: '0.78rem',
                color: 'rgba(255, 255, 255, 0.5)',
                marginTop: '1.25rem',
              }}
            >
              ✦ निःशुल्क है। किसी भी समय सदस्यता समाप्त कर सकते हैं। कोई स्पैम नहीं।
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
