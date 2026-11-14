import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { X, Copy, Check } from 'lucide-react'
import { supabase, Article } from '../lib/supabase'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import { CASE_STUDIES, CaseItem } from './CaseStudyPage'
import { PAPERS_LIST, PaperItem } from './ResearchPage'
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
    title: '10 Hidden Signs of High-Functioning Depression in Indian Women',
    hindiTitle: undefined,
    excerpt: 'In Indian households, depression among women often hides behind relentless caregiving, irritability, and silent exhaustion. Learn how to recognize and address this unseen crisis.',
    highlight: 'Clinical Wellness',
    author: 'Dr. Shruti Kulkarni (PTSD Specialist)',
    readTime: '8 min read',
    image: '/IMG_20260908_201306.jpg',
    fullBody: {
      context: 'In Indian society, women frequently function as primary emotional and practical caregivers. In this multi-year clinical documentation across 500+ women, high-functioning depression manifests uniquely.',
      keyFindings: [
        'Persistent irritability and throwing oneself into compulsive overwork rather than overt sadness.',
        'Somatic and medically unexplained physical distress — recurring migraines, chronic backaches, and stress-induced digestive disorders.',
        'Severe "Caregiver Guilt" when attempting to rest, set boundaries, or seek personal recovery.',
        'A profound sense of internal emotional isolation and numbness while surrounded by family.',
        'Executing domestic and professional duties with mechanical perfection while internal joy diminishes.'
      ],
      conclusion: 'Shakti Sabha’s "Shakti Bhava" initiative provides women an anonymous, trauma-informed sanctuary for healing and psychological sovereignty.'
    }
  },
  {
    id: 'art-2',
    tag: 'Upanishadic Wisdom',
    rating: '9.5',
    title: 'Gargi Vachaknavi — Challenging Yajnavalkya in Philosophical Debate',
    hindiTitle: undefined,
    excerpt: 'In King Janaka’s royal court, Gargi shattered patriarchal complacency with piercing philosophical rigor. A historical reclamation of ancient Indian women’s intellectual sovereignty.',
    highlight: 'Civilizational Heritage',
    author: 'Shakti Sabha Research Cell',
    readTime: '7 min read',
    image: '/20260517_120756.jpg',
    fullBody: {
      context: 'At King Janaka’s grand philosophical symposium, the foremost scholars of ancient India assembled. When seasoned sages hesitated, Gargi stood fearless to challenge Sage Yajnavalkya on the ultimate nature of reality.',
      keyFindings: [
        'Gargi probed the ontological structure of the universe: "In what, then, is all this world woven back and forth?"',
        'Ancient Vedic traditions recognized female initiation (Upanayana), rigorous Vedic scholarship, and intellectual leadership as standard birthrights.',
        'Later colonial and retrograde interpretations distorted the prominent intellectual stature of Vedic women scholars.'
      ],
      conclusion: 'Gargi’s narrative is a living blueprint of uncompromising intellectual sovereignty and courage for modern Indian women.'
    }
  },
  {
    id: 'art-3',
    tag: 'Warrior Queens',
    rating: '9.8',
    title: 'Rani Abbakka Chowta — The First Anti-Colonial Naval Commander',
    hindiTitle: undefined,
    excerpt: 'How the fearless warrior queen defeated the Portuguese armada four times off the coast of Ullal, Karnataka. A masterclass in naval guerilla warfare and sovereignty.',
    highlight: 'Naval Warfare',
    author: 'Shakti Sabha Historical Archives',
    readTime: '10 min read',
    image: '/missionmirdani.jpg',
    fullBody: {
      context: 'During the 16th century, as the Portuguese maritime empire sought absolute hegemony across the Indian Ocean, Rani Abbakka of Ullal in coastal Karnataka defended her waters with fierce naval brilliance.',
      keyFindings: [
        'Rani Abbakka mobilized an egalitarian fighting force of coastal fishermen, Mogaveera seafarers, and local warriors.',
        'Portuguese armada vessels were trapped and set ablaze using synchronized nighttime fire-arrow strikes.',
        'Her tactical formations remain a celebrated early masterclass in maritime guerrilla defense against European colonial armadas.'
      ],
      conclusion: 'Rani Abbakka stands as a testament that taking up arms to defend community, nation, and dignity is the eternal heritage of Indian women.'
    }
  },
  {
    id: 'art-4',
    tag: 'Caregiver Wellness',
    rating: '9.2',
    title: 'Indian Women & Anxiety — Psychological Solutions for Silent Burnout',
    hindiTitle: undefined,
    excerpt: 'Navigating domestic obligations, career expectations, and chronic stress. Practical somatic therapy, breathwork, and boundary-setting techniques.',
    highlight: 'Somatic Healing',
    author: 'Maitreyi Joshi (Counselor)',
    readTime: '6 min read',
    image: '/shaktibhava.jpg',
    fullBody: {
      context: 'Modern Indian women routinely carry the dual cognitive load of familial expectations and career excellence, sustaining elevated systemic cortisol levels.',
      keyFindings: [
        'Living in continuous subconscious fight-or-flight mode due to unstated domestic expectations.',
        'Emotional suppression to avert conflict, which manifests over time as panic episodes and physical burnout.',
        'Practicing daily somatic boundary-setting and regulated breathwork significantly reduces chronic anxiety.'
      ],
      conclusion: 'True wellness is not merely the absence of distress, but the active presence of inner sovereignty and joy.'
    }
  },
  {
    id: 'art-5',
    tag: 'Legal Shield',
    rating: '9.7',
    title: 'Domestic Abuse & Digital Harassment: Your Legal Armor',
    hindiTitle: undefined,
    excerpt: 'A comprehensive, actionable guide to rights under the DV Act, IT Act Section 66E, and POSH guidelines. How to secure immediate protection and legal aid.',
    highlight: 'Legal Shield',
    author: 'Adv. M. R. Deshmukh',
    readTime: '9 min read',
    image: '/socialworkk.jpg',
    fullBody: {
      context: 'Lack of practical statutory awareness frequently leaves women vulnerable. Indian law equips every citizen with robust emergency injunctions, protection orders, and interim relief.',
      keyFindings: [
        'Section 12 DV Act: Immediate rights of shared household residence, maintenance orders, and emergency protective injunctions.',
        'IT Act Section 66E / Cyber Stalking: Prompt 24-hour statutory reporting via national cybercrime infrastructure.',
        'Constitutional guarantee of free legal aid representation via state and district legal services authorities.'
      ],
      conclusion: 'Shakti Sabha’s legal advisory wing connects affected women with pro-bono consultation and courtroom advocacy.'
    }
  },
  {
    id: 'art-6',
    tag: 'Self Defense Philosophy',
    rating: '9.9',
    title: 'Shastra & Shaastra: The Martial Philosophy of Women',
    hindiTitle: undefined,
    excerpt: 'Non-violence is not an excuse for helplessness. Armed situational defense is moral, ethical, and dharmic. Core principles behind Mission Mardini.',
    highlight: 'Kshatra-Dharma',
    author: 'Harshita Mankar (Director)',
    readTime: '11 min read',
    image: '/IMG_20260908_201306.jpg',
    fullBody: {
      context: 'Civilizationally, Indian womanhood is not defined by passive vulnerability. When dignity and life face unprovoked assault, righteous self-defense is moral, ethical, and dharmic duty.',
      keyFindings: [
        'Situational awareness and verbal assertiveness constitute 80% of personal security.',
        'Targeting biomechanical vulnerabilities (eyes, throat, knees, joint leverage) neutralizes size disparity.',
        'Channeling primal fear into focused somatic composure and rapid defensive execution.'
      ],
      conclusion: 'Mission Mardini ensures every young woman becomes the active guardian of her own dignity.'
    }
  }
]

type SubCategoryTab = 'all' | 'articles' | 'case-studies' | 'research'

export default function ArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = (searchParams.get('tab') || searchParams.get('category') || 'all').toLowerCase()
  
  const [activeTab, setActiveTab] = useState<SubCategoryTab>(
    ['all', 'articles', 'case-studies', 'research'].includes(initialTab) 
      ? (initialTab as SubCategoryTab) 
      : 'all'
  )

  const [dbArticles, setDbArticles] = useState<ArticleItem[]>([])
  const [activeModalArticle, setActiveModalArticle] = useState<ArticleItem | null>(null)
  const [activeModalCase, setActiveModalCase] = useState<CaseItem | null>(null)
  const [activeModalPaper, setActiveModalPaper] = useState<PaperItem | null>(null)
  const [caseFilter, setCaseFilter] = useState<string>('ALL')
  const [citationFormat, setCitationFormat] = useState<'APA' | 'MLA' | 'CHICAGO'>('APA')
  const [copiedCitation, setCopiedCitation] = useState(false)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  // Sync tab with URL search parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab') || searchParams.get('category')
    if (tabParam) {
      const lower = tabParam.toLowerCase()
      if (['all', 'articles', 'case-studies', 'research'].includes(lower)) {
        setActiveTab(lower as SubCategoryTab)
      } else if (lower.includes('case')) {
        setActiveTab('case-studies')
      } else if (lower.includes('research')) {
        setActiveTab('research')
      } else if (lower.includes('article')) {
        setActiveTab('articles')
      }
    }
  }, [searchParams])

  const handleTabChange = (tab: SubCategoryTab) => {
    setActiveTab(tab)
    setSearchParams(tab === 'all' ? {} : { tab })
  }

  // Prevent scroll when modal is active
  useEffect(() => {
    if (activeModalArticle || activeModalCase || activeModalPaper) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [activeModalArticle, activeModalCase, activeModalPaper])

  useEffect(() => {
    async function loadArticles() {
      try {
        const { data } = await supabase
          .from('articles')
          .select('*')
          .eq('published', true)
          .neq('category', 'FounderProfile')
          .neq('category', 'Event')
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
            image: a.cover_image_url || '/articles.jpg',
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
    window.addEventListener('storage', loadArticles)
    window.addEventListener('shakti_articles_updated', loadArticles)
    return () => {
      window.removeEventListener('storage', loadArticles)
      window.removeEventListener('shakti_articles_updated', loadArticles)
    }
  }, [])

  const allArticles = dbArticles.length > 0 ? dbArticles : ARTICLES_LIST

  const filteredCaseStudies = caseFilter === 'ALL'
    ? CASE_STUDIES
    : CASE_STUDIES.filter(c => c.category === caseFilter)

  const handleCopyCitation = (paper: PaperItem) => {
    const text = {
      APA: `${paper.authors} (${paper.year}). ${paper.title}. Shakti Varta Research Journal. https://doi.org/${paper.doi}`,
      MLA: `${paper.authors}. "${paper.title}." Shakti Varta Research Journal, ${paper.year}, pp. ${paper.pages}. Shaktisabha.org.`,
      CHICAGO: `${paper.authors}. "${paper.title}." Shakti Varta Research Journal (${paper.year}): ${paper.pages}. https://doi.org/${paper.doi}`
    }[citationFormat]

    navigator.clipboard?.writeText(text)
    setCopiedCitation(true)
    setTimeout(() => setCopiedCitation(false), 2500)
  }

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
          <span className={ap.badge}>Content Ka Dil · Editorial &amp; Publications Hub</span>
          <h1 className={ap.title}>Articles, Case Studies &amp; Research</h1>
          <p className={ap.hindiSubtitle}>Investigative Research, Ground Case Studies &amp; Civilizational Leadership</p>
          <p className={ap.desc}>
            An uncompromising intellectual and frontline repository for Bharatiya women: investigative long-form journalism,
            real-world survivor case studies, and peer-reviewed academic white papers on civilizational sovereignty.
          </p>
        </div>
      </div>

      {/* ── SUB-CATEGORY TABS & REPOSITORY ─────────────────────────── */}
      <div className={s.section}>
        <div style={{ marginTop: '2rem' }}>
          
          {/* Sub-Category Filter Navigation */}
          <div className={ap.subCategoryNav}>
            <button
              type="button"
              className={`${ap.subCategoryTab} ${activeTab === 'all' ? ap.subCategoryTabActive : ''}`}
              onClick={() => handleTabChange('all')}
            >
              <GoogleIcon name="auto_stories" size={16} />
              <span>All Publications</span>
              <span className={ap.tabCountBadge}>{allArticles.length + CASE_STUDIES.length + PAPERS_LIST.length}</span>
            </button>

            <button
              type="button"
              className={`${ap.subCategoryTab} ${activeTab === 'articles' ? ap.subCategoryTabActive : ''}`}
              onClick={() => handleTabChange('articles')}
            >
              <GoogleIcon name="article" size={16} />
              <span>Articles</span>
              <span className={ap.tabCountBadge}>{allArticles.length}</span>
            </button>

            <button
              type="button"
              className={`${ap.subCategoryTab} ${activeTab === 'case-studies' ? ap.subCategoryTabActive : ''}`}
              onClick={() => handleTabChange('case-studies')}
            >
              <GoogleIcon name="folder_open" size={16} />
              <span>Case Studies</span>
              <span className={ap.tabCountBadge}>{CASE_STUDIES.length}</span>
            </button>

            <button
              type="button"
              className={`${ap.subCategoryTab} ${activeTab === 'research' ? ap.subCategoryTabActive : ''}`}
              onClick={() => handleTabChange('research')}
            >
              <GoogleIcon name="menu_book" size={16} />
              <span>Research Papers</span>
              <span className={ap.tabCountBadge}>{PAPERS_LIST.length}</span>
            </button>
          </div>

          {/* ══════════════════ TAB: ARTICLES / ALL ══════════════════ */}
          {(activeTab === 'all' || activeTab === 'articles') && (
            <div style={{ marginBottom: '3.5rem' }}>
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
                    Sub-Category: Investigative Journalism
                  </span>
                  <h2 className={ap.articlesSectionTitle}>
                    {activeTab === 'all' ? 'All Articles & Investigations' : 'Investigative Articles & Field Essays'}
                  </h2>
                </div>
                {activeTab === 'all' && (
                  <button
                    type="button"
                    onClick={() => handleTabChange('articles')}
                    style={{ fontSize: '0.85rem', color: '#DC143C', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    View Only Articles ({allArticles.length}) →
                  </button>
                )}
              </div>

              <div className={ap.articlesGrid}>
                {allArticles.map((article) => (
                  <div
                    key={article.id}
                    className={ap.articleCard}
                    onClick={() => setActiveModalArticle(article)}
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
          )}

          {/* ══════════════════ TAB: CASE STUDIES ══════════════════ */}
          {(activeTab === 'all' || activeTab === 'case-studies') && (
            <div style={{ marginBottom: '3.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '1.25rem',
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
                    Sub-Category: Ground Intervention Dossiers
                  </span>
                  <h2 className={ap.articlesSectionTitle}>
                    {activeTab === 'all' ? 'Featured Case Studies' : 'Real-World Survivor Case Studies'}
                  </h2>
                </div>
                <Link to="/case-study" style={{ fontSize: '0.85rem', color: '#DC143C', fontWeight: 600 }}>
                  Open Dedicated Case Studies Hub →
                </Link>
              </div>

              {/* Case Category Filter Chips (Shown when Tab is Case Studies) */}
              {activeTab === 'case-studies' && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  {['ALL', 'MENTAL HEALTH', 'SELF-DEFENSE', 'TRAFFICKING SURVIVORS', 'PTSD', 'LEADERSHIP'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setCaseFilter(tag)}
                      style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: '1px solid #E5E7EB',
                        background: caseFilter === tag ? '#111827' : '#FFFFFF',
                        color: caseFilter === tag ? '#FFFFFF' : '#4B5563',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              <div className={ap.caseGrid}>
                {(activeTab === 'all' ? CASE_STUDIES.slice(0, 3) : filteredCaseStudies).map(item => (
                  <div key={item.id} className={ap.caseCard}>
                    <div className={ap.caseTop}>
                      <span className={ap.caseBadge} style={{ background: item.badgeColor }}>
                        {item.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{item.readTime}</span>
                    </div>
                    <div className={ap.caseAlias}>{item.alias}</div>
                    <h3 className={ap.caseTitle}>{item.title}</h3>
                    <p className={ap.caseExcerpt}>{item.excerpt}</p>
                    <button
                      type="button"
                      className={ap.caseActionBtn}
                      onClick={() => setActiveModalCase(item)}
                    >
                      Read Incident Dossier →
                    </button>
                  </div>
                ))}
              </div>

              {/* Dedicated Case Study Portal Callout */}
              <div className={ap.hubBanner}>
                <div className={ap.hubBannerLeft}>
                  <div className={ap.hubBannerTitle}>SRS Section 8 Confidential Case Archive</div>
                  <p className={ap.hubBannerDesc}>
                    Every survivor narrative is securely documented under Zero-Knowledge principles to protect identity while preserving legal precedent.
                  </p>
                </div>
                <Link to="/case-study" className={ap.hubBannerBtn}>
                  Visit Case Studies Portal <GoogleIcon name="arrow_forward" size={16} />
                </Link>
              </div>
            </div>
          )}

          {/* ══════════════════ TAB: RESEARCH PAPERS ══════════════════ */}
          {(activeTab === 'all' || activeTab === 'research') && (
            <div style={{ marginBottom: '3.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '1.25rem',
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
                    Sub-Category: Academic Epistemology &amp; Policy
                  </span>
                  <h2 className={ap.articlesSectionTitle}>
                    {activeTab === 'all' ? 'Academic White Papers &amp; Research' : 'Peer-Reviewed Research Papers'}
                  </h2>
                </div>
                <Link to="/research" style={{ fontSize: '0.85rem', color: '#DC143C', fontWeight: 600 }}>
                  Open Dedicated Research Lab →
                </Link>
              </div>

              <div className={ap.papersGrid}>
                {(activeTab === 'all' ? PAPERS_LIST.slice(0, 3) : PAPERS_LIST).map(paper => (
                  <div key={paper.id} className={ap.paperCard}>
                    <div className={ap.paperMetaTop}>
                      <span className={ap.paperAccessTag}>{paper.access} ACCESS</span>
                      <span>{paper.year} · {paper.pages}</span>
                    </div>
                    <h3 className={ap.paperTitle}>{paper.title}</h3>
                    <div className={ap.paperAuthors}>{paper.authors}</div>
                    <p className={ap.paperAbstract}>{paper.abstract}</p>
                    <div className={ap.paperFooter}>
                      <span className={ap.paperDoi}>DOI: {paper.doi}</span>
                      <button
                        type="button"
                        className={ap.caseActionBtn}
                        onClick={() => setActiveModalPaper(paper)}
                      >
                        Read Abstract &amp; Citations →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dedicated Research Hub Callout */}
              <div className={ap.hubBanner}>
                <div className={ap.hubBannerLeft}>
                  <div className={ap.hubBannerTitle}>Shakti Varta Research Cell &amp; Think-Tank</div>
                  <p className={ap.hubBannerDesc}>
                    Deconstructing ideological subversion and providing empirical legal blueprints for women's autonomy, mental wellness, and Vedic sovereignty.
                  </p>
                </div>
                <Link to="/research" className={ap.hubBannerBtn}>
                  Visit Research Lab <GoogleIcon name="arrow_forward" size={16} />
                </Link>
              </div>
            </div>
          )}

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
              Weekly Publications Dispatch
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display, "Cinzel", serif)',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                color: '#FFFFFF',
                margin: '0.5rem 0 1rem',
              }}
            >
              Shakti Varta In Your Inbox
            </h2>
            <p
              style={{
                fontSize: '0.95rem',
                color: '#E5E7EB',
                lineHeight: 1.6,
                marginBottom: '1.5rem',
              }}
            >
              Receive new investigative articles, confidential case breakdowns, and academic white papers before public release.
            </p>

            {subscribed ? (
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid #22C55E',
                  color: '#FFFFFF',
                  padding: '1rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                }}
              >
                ✓ धन्यवाद! You are now subscribed to the Shakti Sabha Weekly Dispatch.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className={ap.newsletterForm}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={ap.newsletterInput}
                />
                <button type="submit" className={ap.newsletterBtn}>
                  Subscribe Now
                </button>
              </form>
            )}
          </div>
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
              Shakti Sabha Verified Publication · {activeModalArticle.tag}
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
                flexWrap: 'wrap',
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
                  Key Analytical Insights:
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

      {/* ── CASE STUDY MODAL ───────────────────────────────────────── */}
      {activeModalCase && (
        <div
          className={ap.modalOverlay}
          data-lenis-prevent="true"
          onClick={() => setActiveModalCase(null)}
        >
          <div
            className={ap.modalContent}
            data-lenis-prevent="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveModalCase(null)}
              className={ap.modalCloseBtn}
            >
              <X size={18} color="#374151" />
            </button>

            <span
              className={ap.caseBadge}
              style={{ background: activeModalCase.badgeColor, display: 'inline-block', marginBottom: '0.75rem' }}
            >
              {activeModalCase.category}
            </span>

            <div style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600 }}>{activeModalCase.alias}</div>
            <h2 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.4rem', color: '#111827', margin: '0.5rem 0 1rem' }}>
              {activeModalCase.title}
            </h2>

            <div style={{ background: '#F9FAFB', borderLeft: '4px solid #DC143C', padding: '1rem 1.25rem', borderRadius: '0 8px 8px 0', marginBottom: '1.25rem', fontSize: '0.88rem', color: '#4B5563' }}>
              {activeModalCase.excerpt}
            </div>

            <div style={{ fontSize: '0.95rem', color: '#1F2937', lineHeight: 1.8 }}>
              {activeModalCase.fullStory}
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>SRS Verified Case Narrative</span>
              <Link to="/case-study" style={{ fontSize: '0.82rem', color: '#DC143C', fontWeight: 600 }}>
                View All Case Studies →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── RESEARCH PAPER MODAL ───────────────────────────────────── */}
      {activeModalPaper && (
        <div
          className={ap.modalOverlay}
          data-lenis-prevent="true"
          onClick={() => setActiveModalPaper(null)}
        >
          <div
            className={ap.modalContent}
            data-lenis-prevent="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveModalPaper(null)}
              className={ap.modalCloseBtn}
            >
              <X size={18} color="#374151" />
            </button>

            <span className={ap.paperAccessTag} style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
              {activeModalPaper.access} ACCESS · {activeModalPaper.year}
            </span>

            <h2 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.35rem', color: '#111827', margin: '0.25rem 0 0.5rem' }}>
              {activeModalPaper.title}
            </h2>

            <div style={{ fontSize: '0.85rem', color: '#6B7280', fontStyle: 'italic', marginBottom: '1.25rem' }}>
              {activeModalPaper.authors} · {activeModalPaper.pages}
            </div>

            <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#111827', marginBottom: '0.5rem' }}>
                Abstract
              </div>
              <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.7, margin: 0 }}>
                {activeModalPaper.abstract}
              </p>
            </div>

            {/* Citation Generator */}
            <div style={{ background: '#F3F4F6', borderRadius: '10px', padding: '1rem', border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#374151' }}>
                  Cite This White Paper
                </span>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {(['APA', 'MLA', 'CHICAGO'] as const).map(fmt => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setCitationFormat(fmt)}
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        border: 'none',
                        background: citationFormat === fmt ? '#DC143C' : '#E5E7EB',
                        color: citationFormat === fmt ? '#FFFFFF' : '#4B5563',
                        cursor: 'pointer',
                      }}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', background: '#FFFFFF', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #D1D5DB' }}>
                <span style={{ fontSize: '0.75rem', color: '#4B5563', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  DOI: {activeModalPaper.doi}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCitation(activeModalPaper)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: '#111827',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {copiedCitation ? <Check size={13} color="#22C55E" /> : <Copy size={13} />}
                  {copiedCitation ? 'Copied!' : 'Copy Citation'}
                </button>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <Link to="/research" style={{ fontSize: '0.82rem', color: '#DC143C', fontWeight: 600 }}>
                Explore Research Think-Tank Hub →
              </Link>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}
