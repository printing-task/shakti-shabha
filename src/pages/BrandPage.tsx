import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './PageLayout.module.css'
import p from './BrandPage.module.css'

gsap.registerPlugin(ScrollTrigger)

const PALETTE = [
  { hex: '#DC143C', alt: '#D9381E', name: 'Crimson Red', role: 'Revolution', textColor: '#FFFFFF' },
  { hex: '#C9A96E', name: 'Matte Brass Gold', role: 'Aaryaveera', textColor: '#1A1209' },
  { hex: '#3D5A45', name: 'Sage Green', role: 'Peace / Healing', textColor: '#FFFFFF' },
  { hex: '#1E293B', name: 'Dark Neutral', role: 'Depth', textColor: '#FFFFFF' },
  { hex: '#FFFFFF', name: 'Pure White', role: 'Clarity', textColor: '#1E293B', bordered: true },
]

const LOGO_DELIVERABLES = [
  { item: 'Full Logo', spec: 'Flame + lotus + wordmark — primary composition' },
  { item: 'Icon Only', spec: 'Standalone warrior emblem for small sizes and favicon' },
  { item: 'Horizontal Layout', spec: 'Emblem + wordmark in horizontal arrangement for headers' },
  { item: 'Vertical Layout', spec: 'Stacked composition for posters and social media' },
  { item: 'Monochrome', spec: 'Single-color version for engraving, embossing, and print' },
  { item: 'Reversed / White', spec: 'White knockout version for use on dark backgrounds' },
]

const FILE_FORMATS = ['SVG (scalable, web)', 'PNG (transparent background)', 'PDF (print-ready)', 'AI (Adobe Illustrator source)']

const INTERACTIONS = [
  {
    title: 'Cards',
    rule: 'translateY(-4px) + box-shadow',
    desc: 'All content cards lift 4px on hover with an expanding shadow — creating depth without disrupting the layout.',
    demo: 'card',
  },
  {
    title: 'Buttons',
    rule: 'scale(1.02) + color shift',
    desc: 'Buttons subtly scale up and shift to a lighter color on hover, providing tactile feedback without distraction.',
    demo: 'btn',
  },
  {
    title: 'Images',
    rule: 'scale(1.05) + overlay reveal',
    desc: 'Hero images zoom in gently while a translucent overlay appears, keeping focus on the content.',
    demo: 'img',
  },
  {
    title: 'Aaryaveera Badge',
    rule: 'Golden glow pulse',
    desc: 'The Aaryaveera warrior badge pulses with a golden glow on hover — a signature interaction tied to the brand.',
    demo: 'badge',
  },
]

const SPACING = [4, 8, 12, 16, 24, 32, 48, 64]
const RADII = [
  { label: '8px', desc: 'Inputs, tags' },
  { label: '16px', desc: 'Cards' },
  { label: '24px', desc: 'Sections' },
  { label: 'pill', desc: 'Buttons, badges' },
]

export default function BrandPage() {
  const paletteRef = useRef<HTMLDivElement>(null)
  const typographyRef = useRef<HTMLDivElement>(null)
  const tokensRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const interactRef = useRef<HTMLDivElement>(null)
  const aaryaveeraRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      // Color swatches
      gsap.from(`.${p.swatch}`, {
        opacity: 0, y: 40, scale: 0.95, duration: 0.6, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: paletteRef.current, start: 'top 80%' },
      })

      // Typography blocks
      gsap.from(`.${p.typeBlock}`, {
        opacity: 0, x: -30, duration: 0.7, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: typographyRef.current, start: 'top 80%' },
      })

      // Tokens
      gsap.from(`.${p.tokenCard}`, {
        opacity: 0, y: 25, duration: 0.5, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: tokensRef.current, start: 'top 80%' },
      })

      // Logo rows
      gsap.from(`.${p.logoRow}`, {
        opacity: 0, x: -20, duration: 0.5, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: logoRef.current, start: 'top 80%' },
      })

      // Interaction cards
      gsap.from(`.${p.interactCard}`, {
        opacity: 0, y: 30, duration: 0.6, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: interactRef.current, start: 'top 78%' },
      })

      // Aaryaveera sub-brand
      gsap.from(aaryaveeraRef.current, {
        opacity: 0, y: 20, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: aaryaveeraRef.current, start: 'top 82%' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <main className={p.page}>
      {/* ── HERO ──────────────────────────────────── */}
      <div className={p.hero}>
        <div className={p.heroInner}>
          <span className={p.eyebrow}>Visual Identity System</span>
          <h1 className={p.heroTitle}>Brand Identity</h1>
          <p className={p.heroHindi}>ब्रांड पहचान</p>
          <p className={p.heroDesc}>
            The visual language of Shakti Sabha — where revolution meets peace. Every colour, typeface, and pixel carries the weight of 7 years of on-ground impact (starting from 2019).
          </p>
        </div>
      </div>

      {/* ── COLOUR PALETTE ────────────────────────── */}
      <section className={p.section}>
        <div className={p.sectionInner}>
          <span className={p.sectionEyebrow}>Colour System</span>
          <h2 className={p.sectionTitle}>The Palette</h2>
          <p className={p.sectionDesc}>Each colour is chosen with intent — carrying the emotional language of the movement.</p>
          <div className={p.paletteGrid} ref={paletteRef}>
            {PALETTE.map((c) => (
              <div
                key={c.hex}
                className={p.swatch}
                style={{ background: c.hex, border: c.bordered ? '1px solid #E0E0E0' : 'none' }}
              >
                <div className={p.swatchTop} />
                <div className={p.swatchBody} style={{ color: c.textColor }}>
                  <span className={p.swatchHex}>{c.hex}</span>
                  {c.alt && <span className={p.swatchAlt}>{c.alt}</span>}
                  <span className={p.swatchName}>{c.name}</span>
                  <span className={p.swatchRole}>{c.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TYPOGRAPHY ────────────────────────────── */}
      <section className={p.sectionAlt} ref={typographyRef}>
        <div className={p.sectionInner}>
          <span className={p.sectionEyebrow}>Type System</span>
          <h2 className={p.sectionTitle}>Typography</h2>
          <p className={p.sectionDesc}>Three typefaces — each chosen for a distinct voice within the brand.</p>
          <div className={p.typeGrid}>
            <div className={p.typeBlock}>
              <div className={p.typeLabel}>Display — Cinzel</div>
              <div className={p.typeUsage}>Headings, titles, hero text, Aaryaveera branding</div>
              <div className={p.typeSample} style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#111111', letterSpacing: '0.08em' }}>
                SHAKTI SABHA
              </div>
              <div className={p.typeMeta}>
                <span>Weights: 400, 700, 900</span>
                <span>Use case: All primary headings</span>
              </div>
            </div>

            <div className={p.typeBlock}>
              <div className={p.typeLabel}>Body — Outfit</div>
              <div className={p.typeUsage}>Body copy, descriptions, UI labels, navigation</div>
              <div className={p.typeSample} style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)', fontWeight: 400, color: '#444444', lineHeight: 1.8 }}>
                Shakti Sabha is a movement rooted in 7 years of on-ground transformation (starting from 2019). Every word we publish is backed by real stories, real training, and real change — from the villages of Maharashtra to the national stage.
              </div>
              <div className={p.typeMeta}>
                <span>Weights: 300, 400, 500, 600, 700</span>
                <span>Use case: All body and UI text</span>
              </div>
            </div>

            <div className={p.typeBlock}>
              <div className={p.typeLabel}>Devanagari — Noto Sans Devanagari</div>
              <div className={p.typeUsage}>Hindi text, Sanskrit terms, cultural touchpoints</div>
              <div className={p.typeSample} style={{ fontFamily: 'Noto Sans Devanagari, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#DC143C' }}>
                शक्ति सभा
              </div>
              <div className={p.typeMeta}>
                <span>Weights: 400, 700</span>
                <span>Use case: Devanagari labels &amp; hero text</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DESIGN TOKENS ─────────────────────────── */}
      <section className={p.section} ref={tokensRef}>
        <div className={p.sectionInner}>
          <span className={p.sectionEyebrow}>Design Tokens</span>
          <h2 className={p.sectionTitle}>Spacing, Radius & Buttons</h2>
          <div className={p.tokensRow}>
            {/* Radius */}
            <div className={p.tokenCard}>
              <h4 className={p.tokenCardTitle}>Border Radius</h4>
              <div className={p.radiiRow}>
                {RADII.map((r) => (
                  <div key={r.label} className={p.radiusItem}>
                    <div
                      className={p.radiusBox}
                      style={{ borderRadius: r.label === 'pill' ? '9999px' : r.label }}
                    />
                    <span className={p.radiusLabel}>{r.label}</span>
                    <span className={p.radiusDesc}>{r.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spacing */}
            <div className={p.tokenCard}>
              <h4 className={p.tokenCardTitle}>Spacing Scale</h4>
              <div className={p.spacingRow}>
                {SPACING.map((sp) => (
                  <div key={sp} className={p.spacingItem}>
                    <div className={p.spacingBar} style={{ width: `${Math.min(sp * 2.5, 200)}px` }} />
                    <span className={p.spacingLabel}>{sp}px</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Button styles */}
            <div className={p.tokenCard}>
              <h4 className={p.tokenCardTitle}>Button Styles</h4>
              <div className={p.btnShowcase}>
                <button className={p.btnSolid}>Primary — Crimson</button>
                <button className={p.btnOutline}>Secondary — Outline</button>
                <button className={p.btnGhost}>Ghost — Text</button>
                <button className={p.btnGold}>Aaryaveera Gold</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGO REQUIREMENTS ─────────────────────── */}
      <section className={p.sectionAlt} ref={logoRef}>
        <div className={p.sectionInner}>
          <span className={p.sectionEyebrow}>Identity System</span>
          <h2 className={p.sectionTitle}>Logo Requirements</h2>
          <div className={p.logoLayout}>
            <div className={p.logoLeft}>
              <h4 className={p.logoSubHead}>Deliverables</h4>
              {LOGO_DELIVERABLES.map((l, i) => (
                <div key={i} className={p.logoRow}>
                  <span className={p.logoCheck}>✓</span>
                  <div>
                    <span className={p.logoItem}>{l.item}</span>
                    <span className={p.logoSpec}>{l.spec}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={p.logoRight}>
              <h4 className={p.logoSubHead}>File Formats</h4>
              <div className={p.formatsGrid}>
                {FILE_FORMATS.map((f, i) => (
                  <div key={i} className={p.formatBadge}>{f}</div>
                ))}
              </div>
              <div className={p.logoPlaceholder}>
                <div className={p.logoPlaceholderInner}>
                  <div className={p.placeholderFlame}><GoogleIcon name="local_fire_department" size={48} /></div>
                  <div className={p.placeholderText}>
                    <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: '1.2rem', color: '#DC143C', letterSpacing: '0.1em' }}>SHAKTI SABHA</span>
                    <span style={{ fontFamily: 'Noto Sans Devanagari, sans-serif', fontSize: '0.75rem', color: '#777777' }}>शक्ति सभा</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AARYAVEERA SUB-BRAND ──────────────────── */}
      <section className={p.aaryaveeraSection} ref={aaryaveeraRef}>
        <div className={p.sectionInner}>
          <div className={p.aaryaveeraCard}>
            <div className={p.aaryaveeraLeft}>
              <span className={p.aaryaveeraEyebrow}>फाउंडर दर्शन · Founder's Philosophical Identity</span>
              <h3 className={p.aaryaveeraTitle}>Aaryaveera</h3>
              <p className={p.aaryaveeraHindi}>आर्यवीरा · The Founder's Philosophy</p>
              <p className={p.aaryaveeraDesc}>
                <strong>शक्ति सभा — संस्थागत ढांचा · आर्यवीरा — मूल दर्शन।</strong>
                {' '}Aaryaveera is not an operational event or program, but the personal ideological identity and worldview of founder Harshita Mankar. The Warrior Emblem (flame + lotus composite) is its philosophical emblem, using a dedicated matte brass gold palette and Cinzel display typography.
              </p>
              <div className={p.aaryaveeraColors}>
                <div className={p.aColorChip} style={{ background: '#C9A96E' }}>
                  <span>#C9A96E</span><span>Primary Gold</span>
                </div>
                <div className={p.aColorChip} style={{ background: '#E8C98A', color: '#1A1209' }}>
                  <span>#E8C98A</span><span>Light Gold</span>
                </div>
                <div className={p.aColorChip} style={{ background: '#0A0A0B' }}>
                  <span>#0A0A0B</span><span>Dark Base</span>
                </div>
              </div>
            </div>
            <div className={p.aaryaveeraRight}>
              <div className={p.warriorEmblemFrame}>
                <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '120px', height: 'auto' }}>
                  <path d="M50 130C50 130 15 100 15 70C15 45 30 25 50 10C50 10 47 40 62 50C62 50 53 35 65 22C65 22 85 42 85 70C85 100 50 130 50 130Z" fill="url(#wg1)" />
                  <path d="M50 130C50 130 28 105 28 82C28 64 38 52 50 38C50 38 48 56 55 64C55 64 50 54 58 44C58 44 72 60 72 82C72 105 50 130 50 130Z" fill="url(#wg2)" opacity="0.85"/>
                  <circle cx="50" cy="100" r="8" fill="url(#wg3)" opacity="0.6"/>
                  <text x="50" y="120" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="8" fontWeight="900" fill="#C9A96E" letterSpacing="3">AARYAVEERA</text>
                  <defs>
                    <linearGradient id="wg1" x1="50" y1="10" x2="50" y2="130" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFD700"/>
                      <stop offset="0.5" stopColor="#C9A96E"/>
                      <stop offset="1" stopColor="#7A5C2A"/>
                    </linearGradient>
                    <linearGradient id="wg2" x1="50" y1="38" x2="50" y2="130" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFF3B0"/>
                      <stop offset="1" stopColor="#E8C98A"/>
                    </linearGradient>
                    <radialGradient id="wg3" cx="50%" cy="50%" r="50%">
                      <stop stopColor="#C9A96E"/>
                      <stop offset="1" stopColor="#3D5A45" stopOpacity="0"/>
                    </radialGradient>
                  </defs>
                </svg>
                <p className={p.emblemCaption}>Warrior Emblem — Flame &amp; Lotus</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ANIMATION GUIDELINES ──────────────────── */}
      <section className={p.section} ref={interactRef}>
        <div className={p.sectionInner}>
          <span className={p.sectionEyebrow}>Interaction Design</span>
          <h2 className={p.sectionTitle}>Animation &amp; Interaction Guidelines</h2>
          <p className={p.sectionDesc}>All motion is purposeful, subtle, and fast. Easing: cubic-bezier(0.25, 0.1, 0.25, 1). Duration: 200–350ms.</p>
          <div className={p.interactGrid}>
            {INTERACTIONS.map((item) => (
              <div key={item.title} className={p.interactCard}>
                <div className={p.interactDemo}>
                  {item.demo === 'card' && (
                    <div className={p.demoCard}>
                      <span className={p.demoCardLabel}>Hover me</span>
                    </div>
                  )}
                  {item.demo === 'btn' && (
                    <button className={p.demoBtn}>Hover me</button>
                  )}
                  {item.demo === 'img' && (
                    <div className={p.demoImg}>
                      <div className={p.demoImgOverlay} />
                      <span className={p.demoImgLabel}>Image</span>
                    </div>
                  )}
                  {item.demo === 'badge' && (
                    <div className={p.demoBadge} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><GoogleIcon name="swords" size={16} /> AARYAVEERA</div>
                  )}
                </div>
                <div className={p.interactContent}>
                  <h4 className={p.interactTitle}>{item.title}</h4>
                  <code className={p.interactRule}>{item.rule}</code>
                  <p className={p.interactDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ────────────────────────────── */}
      <div className={p.footerCta}>
        <div className={p.footerCtaInner}>
          <h3 className={p.footerCtaTitle}>Download Brand Kit</h3>
          <p className={p.footerCtaDesc}>Complete Shakti Sabha and Aaryaveera brand assets — logos, colour palette, type specimens, and social templates.</p>
          <div className={p.footerCtaBtns}>
            <Link to="/" className={s.goldBtn}>Request Brand Assets</Link>
            <Link to="/aaryaveera" className={s.goldOutlineBtn}>View Aaryaveera Page</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
