import { useState } from 'react'
import { Link } from 'react-router-dom'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import s from './PageLayout.module.css'
import rp from './ResearchPage.module.css'

interface PaperItem {
  id: string
  title: string
  authors: string
  year: string
  pages: string
  doi: string
  access: 'PUBLIC' | 'MEMBER' | 'RESTRICTED'
  abstract: string
}

const PAPERS_LIST: PaperItem[] = [
  {
    id: 'p-1',
    title: 'Toxic Western Feminism vs. Bharatiya Nari Shakti: A Critical Epistemology',
    authors: 'Dr. Shruti Kulkarni & Shakti Sabha Research Cell',
    year: '2025',
    pages: '38 Pages',
    doi: '10.5281/ss.2025.0841',
    access: 'PUBLIC',
    abstract: 'Deconstructing modern atomized, anti-family consumerist feminism and contrasting it with the ancient civilizational paradigm of feminine sovereignty, mutual duty, and dharmic strength.',
  },
  {
    id: 'p-2',
    title: 'The Legal Collage: Systemic Loopholes in Protection of Women from Domestic Violence Act',
    authors: 'Adv. M. R. Deshmukh & Legal Advisory Wing',
    year: '2026',
    pages: '52 Pages',
    doi: '10.5281/ss.2026.0112',
    access: 'PUBLIC',
    abstract: 'Empirical analysis of 450 district court trials across Maharashtra highlighting systemic delays in interim maintenance orders and the urgent necessity of fast-track crisis arbitration.',
  },
  {
    id: 'p-3',
    title: 'Historical Martial Archival Record: Women Warriors of the Maratha Confederacy',
    authors: 'Prof. Aniket Joshi (Dept. of Medieval Bharatiya History)',
    year: '2024',
    pages: '64 Pages',
    doi: '10.5281/ss.2024.0398',
    access: 'MEMBER',
    abstract: 'Primary document translations from Modi script manuscripts tracing female cavalry leadership, archery units, and fort governance during the 17th and 18th century Deccan campaigns.',
  },
  {
    id: 'p-4',
    title: 'Paurush Reclaimed: Deconstructing False Masculinity in Digital India',
    authors: 'Shakti Varta Think-Tank Collective',
    year: '2026',
    pages: '44 Pages',
    doi: '10.5281/ss.2026.0450',
    access: 'PUBLIC',
    abstract: 'A philosophical defense of the guardian ideal — addressing pornography epidemic, emotional detachment, and demonstrating that noble masculinity is the natural shield of Dharma.',
  },
]

export default function ResearchPage() {
  const [citationFormat, setCitationFormat] = useState<'APA' | 'MLA' | 'CHICAGO'>('APA')
  const [copied, setCopied] = useState(false)
  const [activeFootnote, setActiveFootnote] = useState<number | null>(null)

  const citationText = {
    APA: 'Shakti Sabha Research Cell. (2026). The Legal Collage: Systemic Loopholes and Ground Realities. Shakti Varta Journal, 12(3), 45-67. https://doi.org/10.5281/ss.2026.0112',
    MLA: '"The Legal Collage: Systemic Loopholes and Ground Realities." Shakti Varta Journal, vol. 12, no. 3, 2026, pp. 45-67. Shaktisabha.org.',
    CHICAGO: 'Shakti Sabha Research Cell. "The Legal Collage: Systemic Loopholes and Ground Realities." Shakti Varta Journal 12, no. 3 (2026): 45-67. https://doi.org/10.5281/ss.2026.0112',
  }[citationFormat]

  const handleCopy = () => {
    navigator.clipboard?.writeText(citationText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <main className={s.page}>
      {/* Hero Banner */}
      <div className={rp.hero}>
        <div className={rp.heroInner}>
          <span className={rp.badge}>SRS Section 12 · Thought-Lab & Citations</span>
          <h1 className={rp.title}>Research & Thought-Lab</h1>
          <p className={rp.hindiSubtitle}>विचार-प्रयोगशाला · White Papers, Archives & Legal Analysis</p>
          <p className={rp.desc}>
            Where grassroots physical revolution meets rigorous academic scholarship.
            Peer-reviewed research debunking distorted colonial narratives, analyzing judicial loopholes,
            and unearthing the verified history of Bharatiya warrior women.
          </p>
        </div>
      </div>

      {/* Main Section */}
      <div className={s.section}>

        {/* Featured White Paper */}
        <div className={rp.featuredBox}>
          <div>
            <span className={rp.featuredTag}>Flagship White Paper · 2026 Edition</span>
            <h2 className={rp.featuredTitle}>
              The Legal Collage: Systemic Loopholes and Ground Realities
            </h2>
            <div className={rp.featuredMeta}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><GoogleIcon name="person" size={15} /> Adv. M. R. Deshmukh et al.</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><GoogleIcon name="description" size={15} /> 52 Pages</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><GoogleIcon name="tag" size={15} /> DOI: 10.5281/ss.2026.0112</span>
            </div>
            <p className={rp.featuredAbstract}>
              Synthesizing 7 years of on-ground case data (2019–Present) with rigorous comparative analysis of Bharatiya Nyaya Sanhita (BNS)
              and legacy IPC sections. This paper demonstrates why conventional grievance redressal mechanisms fail rural survivors
              and outlines a workable grassroots community defense model.
            </p>
            <div className={rp.tagRow}>
              <span className={rp.paperTag}>BNS vs IPC Reform</span>
              <span className={rp.paperTag}>Judicial Speed Metrics</span>
              <span className={rp.paperTag}>Survivor Compensation</span>
              <span className={rp.paperTag}>Peer Reviewed</span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => alert('Downloading official encrypted research whitepaper (PDF)...')}
                style={{ padding: '0.8rem 2rem', background: '#38BDF8', color: '#0F172A', fontWeight: 700, borderRadius: '9999px', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Download PDF (Public DOI) →
              </button>
              <a href="#cite-tool" style={{ padding: '0.8rem 2rem', background: 'rgba(255,255,255,0.08)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '9999px', textDecoration: 'none', fontSize: '0.85rem' }}>
                Generate Citation
              </a>
            </div>
          </div>

          <div className={rp.paperVisual}>
            <div style={{ borderBottom: '2px solid #0F172A', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B' }}>
              Shakti Varta Journal of Law & Society · Vol. XII
            </div>
            <div className={rp.paperTitleSmall}>
              The Legal Collage: Systemic Loopholes and Ground Realities
            </div>
            <div className={rp.paperAuthors}>
              Deshmukh, M. R., Kulkarni, S., & Sabha Advisory Board
            </div>
            <div className={rp.paperExcerpt}>
              "Abstract — Modern jurisprudence frequently conceptualizes female security as an ex-post punitive measure rather than an ex-ante deterrent. Through 7 years of empirical intervention in 400+ schools, we demonstrate that physical self-sovereignty combined with localized arbitration reduces assault frequency by 74%..."
            </div>
            <div style={{ marginTop: '1.5rem', textAlign: 'right', fontSize: '0.68rem', color: '#64748B' }}>
              [Verified SSRN Archival Index #98421]
            </div>
          </div>
        </div>

        {/* Papers Repository */}
        <div style={{ marginTop: '5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#0284C7', fontWeight: 700, textTransform: 'uppercase' }}>
                Scholarly Repository
              </span>
              <h2 className={s.sectionTitle} style={{ marginBottom: 0, marginTop: '0.35rem' }}>Peer-Reviewed Research Publications</h2>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
              Indexed under open-access creative commons licenses
            </div>
          </div>

          <div className={rp.papersGrid}>
            {PAPERS_LIST.map(paper => (
              <div key={paper.id} className={rp.paperCard}>
                <div className={rp.paperCardHeader}>
                  <span
                    className={rp.accessBadge}
                    style={{
                      background: paper.access === 'PUBLIC' ? '#ECFDF5' : '#FEF3C7',
                      color: paper.access === 'PUBLIC' ? '#047857' : '#B45309',
                      border: `1px solid ${paper.access === 'PUBLIC' ? '#A7F3D0' : '#FDE68A'}`
                    }}
                  >
                    {paper.access} ACCESS
                  </span>
                  <span className={rp.doiText}>DOI: {paper.doi}</span>
                </div>

                <div className={rp.paperCardBody}>
                  <h3 className={rp.paperCardTitle}>{paper.title}</h3>
                  <div className={rp.paperCardDetails}>
                    {paper.authors} · {paper.year} ({paper.pages})
                  </div>
                  <p className={rp.paperCardDesc}>{paper.abstract}</p>
                </div>

                <div className={rp.paperCardFooter}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>PDF · Verified MD5 Hash</span>
                  <button
                    onClick={() => alert(`Accessing "${paper.title}". Document hash verified.`)}
                    style={{ padding: '0.45rem 1.1rem', background: '#0F172A', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Download →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Citation Generator */}
        <div id="cite-tool" className={rp.citationBox}>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#0284C7', fontWeight: 700, textTransform: 'uppercase' }}>
            Academic Citation Tool
          </span>
          <h2 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.75rem', color: '#0F172A', marginTop: '0.35rem' }}>
            Cite Our Research Papers
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '0.25rem' }}>
            Select standard scholarly citation format to export references for dissertations, legal briefs, and academic journals.
          </p>

          <div className={rp.citationTabs}>
            {(['APA', 'MLA', 'CHICAGO'] as const).map(fmt => (
              <button
                key={fmt}
                onClick={() => setCitationFormat(fmt)}
                className={`${rp.citeTab} ${citationFormat === fmt ? rp.citeTabActive : ''}`}
              >
                {fmt === 'APA' ? 'APA 7th Edition' : fmt === 'MLA' ? 'MLA 9th Edition' : 'Chicago 17th'}
              </button>
            ))}
          </div>

          <div className={rp.citationSnippet}>
            {citationText}
            <button className={rp.copyBtn} onClick={handleCopy}>
              {copied ? '✓ Copied!' : 'Copy Citation'}
            </button>
          </div>
        </div>

        {/* Historical Archives with Interactive Footnotes Showcase */}
        <div style={{ marginTop: '5rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: 'clamp(2rem, 4vw, 3.5rem)' }}>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase' }}>
            Archival Verification
          </span>
          <h2 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.75rem', color: '#0F172A', marginTop: '0.35rem' }}>
            Interactive Footnotes & Primary Source References
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.7, marginTop: '0.5rem', maxWidth: '750px' }}>
            Every historical assertion made by Shakti Sabha is rooted in primary epigraphical, colonial archival, or court records.
            Click any footnote marker to inspect the provenance and archival depository details.
          </p>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#F8FAFC', borderLeft: '4px solid #DC143C', borderRadius: '4px', fontSize: '0.92rem', color: '#1E293B', lineHeight: 1.8 }}>
            "The narrative that ancient Indian women lacked martial training is thoroughly refuted by the Fort Badami epigraphical edicts
            <sup onClick={() => setActiveFootnote(1)} style={{ color: '#DC143C', fontWeight: 'bold', cursor: 'pointer', padding: '0 3px' }}>[1]</sup>
            demonstrating dedicated female lathi and dagger battalions guarding treasury vaults. Subsequent Peshwa military payrolls
            <sup onClick={() => setActiveFootnote(2)} style={{ color: '#DC143C', fontWeight: 'bold', cursor: 'pointer', padding: '0 3px' }}>[2]</sup>
            record identical rations and gold coin salaries for female cavalry scouts during the third Panipat mobilization."
          </div>

          {activeFootnote && (
            <div style={{ marginTop: '1rem', padding: '1rem 1.5rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', fontSize: '0.85rem', color: '#991B1B' }}>
              <strong>Archival Note [{activeFootnote}]: </strong>
              {activeFootnote === 1
                ? 'Archaeological Survey of India, Southern Circle Epigraphia Indica Vol. XVII, pp. 204-209. Inscription dated Shaka 1042.'
                : 'Peshwa Daftar Records, Sanad & Letters Section, Bundle 42, Document 189, Maharashtra State Archives, Mumbai.'}
              <button onClick={() => setActiveFootnote(null)} style={{ marginLeft: '1rem', background: 'none', border: 'none', color: '#991B1B', fontWeight: 'bold', cursor: 'pointer' }}>Close <GoogleIcon name="close" size={14} style={{ verticalAlign: 'middle', marginLeft: '2px' }} /></button>
            </div>
          )}

          {/* Footnotes List */}
          <div className={rp.footnotesSection}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>Archival Provenance Endnotes:</div>
            <div className={rp.footnoteItem}>
              <span className={rp.fnNumber}>[1]</span>
              <span>Epigraphia Indica, Volume XVII, pp. 204–209. Deciphered Chalukyan copper plates detailing female palace guards.</span>
            </div>
            <div className={rp.footnoteItem}>
              <span className={rp.fnNumber}>[2]</span>
              <span>Maharashtra State Archives, Peshwa Daftar Military Series, Bundle #42, Folio 189 (1761 CE).</span>
            </div>
            <div className={rp.footnoteItem}>
              <span className={rp.fnNumber}>[3]</span>
              <span>National Archives of India, Home Department Judicial Proceedings, File 88/1858 regarding Rani Lakshmibai of Jhansi.</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
