export interface FounderProfileData {
  name: string
  title: string
  subTitle: string
  honorific_hi: string
  heroQuote: string
  bio: string
  heroImage: string
  genesisLead: string
  genesisP1: string
  genesisP2: string
  genesisP3: string
  kshatraDharmaText: string
  metrics: {
    blackBelt: string
    girlsTrained: string
    seminars: string
    studentsReached: string
    camps: string
    tribalOutreach: string
    collaborations: string
  }
  interventions: {
    statutoryMinors: string
    crisesHandled: string
    familyMediations: string
    childProtectionText: string
    counterGroomingText: string
    somaticSupportText: string
    confidentialityNotice: string
  }
}

export const DEFAULT_FOUNDER_DATA: FounderProfileData = {
  name: 'Harshita Mankar',
  title: 'Founder & Director, Shakti Sabha',
  subTitle: 'Civilizational Strategist | Tactical Combat Instructor | Non-Verbal Behaviour Profiler',
  honorific_hi: 'श्रीमती हर्षिता मानकर',
  heroQuote: 'We do not build dependent victims; we forge sovereign, intellectually fortified, and tactically capable guardians of Indian civilization.',
  bio: 'Aaryaveera is a civilizational strategist, tactical combat instructor, and non-verbal behaviour profiler dedicated to cultivating independent thinking, psychological resilience, and tactical preparedness among women and youth across India.',
  heroImage: 'Gemini_Generated_Image_kdfkbukdfkbukdfk.png',
  genesisLead: 'From Grassroots Activism to Strategic Sovereignty',
  genesisP1: 'Aaryaveera’s journey began at an early age through grassroots activism, youth engagement, and work across diverse institutional and cultural ecosystems. Her experiences in schools, colleges, community settings, and social initiatives exposed her to the complex challenges confronting young people, particularly women and adolescent girls.',
  genesisP2: 'She recognized that empowerment must go beyond temporary assistance, motivational slogans, or physical training. It must cultivate independent thinking, psychological resilience, personal responsibility, and the ability to make informed decisions. She also observed that women are often represented primarily through the lens of vulnerability, while their intellectual capabilities, leadership potential, courage, and inherent agency receive insufficient attention.',
  genesisP3: 'Through years of field engagement, Harshita evolved from collaborative grassroots activism towards independent institutional leadership, establishing Shakti Sabha as a platform dedicated to physical preparedness, intellectual independence, civilizational awareness, and human consciousness.',
  kshatraDharmaText: 'Her vision draws inspiration from the Indian civilizational principle of Kshatra-Dharma: the responsibility to protect, the courage to confront injustice, the discipline to exercise power responsibly, and the wisdom to distinguish strength from aggression. Her work brings together traditional knowledge systems, contemporary psychological perspectives, tactical self-defense education, and critical inquiry to help develop a generation that is physically capable, intellectually independent, and socially responsible.',
  metrics: {
    blackBelt: 'Black Belt in Karate: Martial arts discipline, tactical combat training, and unarmed self-defense.',
    girlsTrained: '2,000+ Girls Trained: Armed and unarmed self-defense awareness and practical street-safety training.',
    seminars: '500+ Seminars & Discourses: Institutional seminars, youth awareness programmes, and consciousness-building sessions.',
    studentsReached: '25,000+ Students Reached: Youth awakening sessions across educational and community platforms.',
    camps: 'Mission Mardini Camps: Organizing intensive 7–10 day self-defense and empowerment camps.',
    tribalOutreach: 'Tribal Outreach: Awareness, guidance, and support initiatives for young girls in tribal and underserved communities.',
    collaborations: 'Collaborative Initiatives: Working with other organizations and community groups to expand training and awareness programmes.'
  },
  interventions: {
    statutoryMinors: '13 Vulnerable Minors',
    crisesHandled: '250+ Reported Distress Cases',
    familyMediations: '50+ Critical Field Mediations',
    childProtectionText: 'Directly facilitated the timely safety interception, statutory handoff, and supervised reintegration of 13 vulnerable minors into verified legal guardianship and safe academic environments at transit hubs in strict coordination with Child Welfare Committees (CWC) and statutory commissions.',
    counterGroomingText: 'Handled over 250 reported distress consultations, intervening in campus and hostel settings to dismantle digital blackmail, peer coercion, and groom traps, conducting direct non-adversarial field mediations and pre-emptive family reconciliations in 50+ critical situations.',
    somaticSupportText: 'Practical non-verbal behavioral observation to detect acute freeze/panic response, trauma-sensitive conversational de-escalation, academic relocation, and direct linkage with certified clinical psychologists and pro-bono legal advocates.',
    confidentialityNotice: 'Shakti Sabha operates as a civil and community support initiative. Field interventions, crisis de-escalations, and family reconciliations are conducted with strict respect for the privacy, safety, and legal confidentiality of affected individuals and their guardians. All actions involving minors and high-risk statutory matters are routed through and coordinated with relevant administrative bodies, statutory commissions, and local authorities in accordance with applicable Indian laws.'
  }
}

export function getFounderData(): FounderProfileData {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('shakti_founder_data')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.bio && (parsed.bio.startsWith('Aaryaveera Harshita Mankar') || parsed.bio.startsWith('Harshita Mankar is') || parsed.bio.startsWith('cHarshita Mankar'))) {
          parsed.bio = DEFAULT_FOUNDER_DATA.bio
          localStorage.setItem('shakti_founder_data', JSON.stringify(parsed))
        }
        return { ...DEFAULT_FOUNDER_DATA, ...parsed }
      }
    }
  } catch (e) {
    console.warn('Error reading founder data from localStorage:', e)
  }
  return DEFAULT_FOUNDER_DATA
}

export function saveFounderData(data: Partial<FounderProfileData>): void {
  try {
    if (typeof window !== 'undefined') {
      const existing = getFounderData()
      const updated = { ...existing, ...data }
      localStorage.setItem('shakti_founder_data', JSON.stringify(updated))
      window.dispatchEvent(new Event('founder_data_updated'))
    }
  } catch (e) {
    console.warn('Error saving founder data to localStorage:', e)
  }
}
