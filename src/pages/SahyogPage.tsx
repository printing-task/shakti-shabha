import { useState } from 'react'
import { Link } from 'react-router-dom'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import s from './PageLayout.module.css'
import sh from './SahyogPage.module.css'

export default function SahyogPage() {
  const [partnerType, setPartnerType] = useState<'CORPORATE' | 'NGO' | 'STUDENT'>('CORPORATE')
  const [formSubmitted, setFormSubmitted] = useState(false)

  return (
    <main className={s.page}>
      {/* Hero Banner */}
      <div className={sh.hero}>
        <div className={sh.heroInner}>
          <span className={sh.badge}>SRS Section 10 · Collaboration Ecosystem</span>
          <h1 className={sh.title}>Collaboration</h1>
          <p className={sh.hindiSubtitle}>सहयोग — Together We Rise</p>
          <p className={sh.desc}>
            Shakti Sabha stands with forward-thinking enterprises, grassroots NGOs, and committed student changemakers
            who believe in one foundational truth — that every woman deserves physical safety, mental dignity, and social opportunity.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className={s.statsGrid}>
        <div className={s.statBox}>
          <div className={s.statCount} style={{ color: '#3D5A45' }}>45+</div>
          <div className={s.statLabel}>CSR & Corporate Allies</div>
        </div>
        <div className={s.statBox}>
          <div className={s.statCount} style={{ color: '#3D5A45' }}>30+</div>
          <div className={s.statLabel}>NGO Network Alliances</div>
        </div>
        <div className={s.statBox}>
          <div className={s.statCount} style={{ color: '#3D5A45' }}>500+</div>
          <div className={s.statLabel}>Active Student Volunteers</div>
        </div>
        <div className={s.statBox}>
          <div className={s.statCount} style={{ color: '#3D5A45' }}>12 Yrs</div>
          <div className={s.statLabel}>Audited On-Ground Impact</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={s.section}>

        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
          <h2 className={s.sectionTitle} style={{ marginTop: '0.35rem', display: 'inline-block' }}>
            Who We Partner With
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#6B7280', lineHeight: 1.7, marginTop: '0.5rem' }}>
            We design structured frameworks for corporations fulfilling CSR mandates, grassroots non-profits seeking specialized self-defense modules, and university students building community credits.
          </p>
        </div>

        {/* 3 Columns */}
        <div className={sh.columnsGrid}>
          
          {/* Corporate Column */}
          <div className={sh.pillarCol}>
            <div className={sh.colTopStrip} style={{ background: '#DC143C' }} />
            <div className={sh.colHeader}>
              <div className={sh.colIcon}>
                <GoogleIcon name="domain" size={32} style={{ color: '#DC143C' }} />
              </div>
              <div className={sh.colTarget}>For Enterprises & Agencies</div>
              <h3 className={sh.colTitle}>Corporates & CSR</h3>
            </div>
            <div className={sh.colBody}>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#DC143C' }} />
                <div><strong>Fund Village Camps:</strong> Directly sponsor 3-day, 5-day, or 7-day Mission Mardini self-defense camps (guided by Aaryaveera philosophy) for rural schools.</div>
              </div>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#DC143C' }} />
                <div><strong>Employee Volunteering:</strong> On-ground or digital pro-bono contribution tracks for corporate staff teams.</div>
              </div>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#DC143C' }} />
                <div><strong>CSR Compliance Reports:</strong> Rigorous third-party audited impact metrics, participant surveys, and video summaries.</div>
              </div>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#DC143C' }} />
                <div><strong>Corporate Women's Safety:</strong> Tailored executive situational awareness workshops for internal employees.</div>
              </div>
            </div>
            <div className={sh.colFooter}>
              <a href="#partner-form" onClick={() => setPartnerType('CORPORATE')} className={sh.actionBtn} style={{ background: '#DC143C', color: '#FFFFFF' }}>
                Start Corporate Partnership →
              </a>
            </div>
          </div>

          {/* NGO Column */}
          <div className={sh.pillarCol}>
            <div className={sh.colTopStrip} style={{ background: '#3D5A45' }} />
            <div className={sh.colHeader}>
              <div className={sh.colIcon}>
                <GoogleIcon name="eco" size={32} style={{ color: '#3D5A45' }} />
              </div>
              <div className={sh.colTarget}>For Grassroots Organizations</div>
              <h3 className={sh.colTitle}>NGO Network</h3>
            </div>
            <div className={sh.colBody}>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#3D5A45' }} />
                <div><strong>Directory Listing:</strong> Verified inclusion in Shakti Sabha's regional intervention network.</div>
              </div>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#3D5A45' }} />
                <div><strong>Shared Resource Pool:</strong> Access training toolkits, legal documentation, and counselor databases.</div>
              </div>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#3D5A45' }} />
                <div><strong>Joint Event Delivery:</strong> Co-host district symposiums, medical camps, and self-reliance workshops.</div>
              </div>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#3D5A45' }} />
                <div><strong>Grant Consortiums:</strong> Collaborative funding applications for expansive multi-district social projects.</div>
              </div>
            </div>
            <div className={sh.colFooter}>
              <a href="#partner-form" onClick={() => setPartnerType('NGO')} className={sh.actionBtn} style={{ background: '#3D5A45', color: '#FFFFFF' }}>
                Join NGO Network →
              </a>
            </div>
          </div>

          {/* Student Column */}
          <div className={sh.pillarCol}>
            <div className={sh.colTopStrip} style={{ background: '#C9A96E' }} />
            <div className={sh.colHeader}>
              <div className={sh.colIcon}>
                <GoogleIcon name="school" size={32} style={{ color: '#C9A96E' }} />
              </div>
              <div className={sh.colTarget}>For College Youth & Scholars</div>
              <h3 className={sh.colTitle}>Students & Interns</h3>
            </div>
            <div className={sh.colBody}>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#C9A96E' }} />
                <div><strong>Curated Internships:</strong> 6-week or 3-month research, digital media, field documentation, or legal tracks.</div>
              </div>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#C9A96E' }} />
                <div><strong>Official Credits:</strong> Formal letter of recommendation and university-recognized social service hours.</div>
              </div>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#C9A96E' }} />
                <div><strong>Dharmic Mentorship:</strong> Direct guidance from senior social workers, advocates, and martial artists.</div>
              </div>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#C9A96E' }} />
                <div><strong>Youth Action Chapters:</strong> Organize campus self-defense clubs backed by Shakti Sabha toolkits.</div>
              </div>
            </div>
            <div className={sh.colFooter}>
              <a href="#partner-form" onClick={() => setPartnerType('STUDENT')} className={sh.actionBtn} style={{ background: '#C9A96E', color: '#111827' }}>
                Apply as Student Intern →
              </a>
            </div>
          </div>

        </div>

        {/* Dynamic Interactive Partnership Onboarding Form */}
        <div id="partner-form" className={sh.formSection}>
          <div className={sh.formGrid}>
            <div>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#3D5A45', fontWeight: 700, textTransform: 'uppercase' }}>
                Connect Directly
              </span>
              <h2 className={sh.formInfoTitle}>
                Join Hands with Shakti Sabha
              </h2>
              <p className={sh.formInfoText}>
                Whether you wish to sponsor 10 village camps, collaborate on legal research, or spend your semester in the field — we welcome dedicated allies.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid #E5E7EB', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                  <GoogleIcon name="mail" size={20} style={{ color: '#3D5A45' }} />
                  <strong>partnerships@shaktisabha.org</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                  <GoogleIcon name="location_on" size={20} style={{ color: '#3D5A45' }} />
                  Vidarbha & Pune Operations Central
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                  <GoogleIcon name="balance" size={20} style={{ color: '#3D5A45' }} />
                  Audited NGO Registration · 80G Compliant Pipeline
                </div>
              </div>
            </div>

            <div>
              {formSubmitted ? (
                <div style={{ padding: '2.5rem', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', textAlign: 'center' }}>
                  <GoogleIcon name="check_circle" size={44} style={{ color: '#059669', marginBottom: '0.5rem' }} />
                  <h3 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', color: '#065F46', marginBottom: '0.5rem' }}>Proposal Received!</h3>
                  <p style={{ fontSize: '0.9rem', color: '#047857' }}>
                    Thank you for stepping forward. Our partnership director will get in touch with you shortly.
                  </p>
                  <button onClick={() => setFormSubmitted(false)} style={{ marginTop: '1.5rem', padding: '0.5rem 1.5rem', background: '#059669', color: '#FFFFFF', border: 'none', borderRadius: '9999px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setFormSubmitted(true) }} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>I am reaching out as a:</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {(['CORPORATE', 'NGO', 'STUDENT'] as const).map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setPartnerType(type)}
                          style={{
                            flex: 1,
                            padding: '0.6rem 0.5rem',
                            borderRadius: '8px',
                            border: `1px solid ${partnerType === type ? '#3D5A45' : '#D1D5DB'}`,
                            background: partnerType === type ? '#3D5A45' : '#F9FAFB',
                            color: partnerType === type ? '#FFFFFF' : '#4B5563',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          {type === 'CORPORATE' ? 'Corporate' : type === 'NGO' ? 'NGO' : 'Student'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Full Name or Organization Rep</label>
                    <input required type="text" placeholder="e.g. Radhika Deshmukh" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Work Email</label>
                      <input required type="email" placeholder="you@company.org" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Phone Number</label>
                      <input
                        required
                        type="tel"
                        pattern="^[0-9+\\s-]{10,15}$"
                        placeholder="10-digit mobile number"
                        title="Please enter a valid 10-digit mobile number"
                        onKeyDown={e => {
                          if (!/[0-9+\\s-]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key) && !e.ctrlKey) {
                            e.preventDefault()
                          }
                        }}
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Organization / College Name</label>
                    <input required type="text" placeholder="e.g. Tata Trusts or Pune University" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Collaboration Goals</label>
                    <textarea rows={3} placeholder="Briefly describe what you wish to achieve together..." style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', resize: 'vertical' }} />
                  </div>

                  <button type="submit" style={{ padding: '0.85rem', background: '#3D5A45', color: '#FFFFFF', border: 'none', borderRadius: '9999px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', transition: 'background 0.2s' }}>
                    Submit Collaboration Intent →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
