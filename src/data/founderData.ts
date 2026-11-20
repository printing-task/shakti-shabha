import { supabase } from '../lib/supabase'

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
  name: 'Harshita Manker',
  title: 'FOUNDER & DIRECTOR • SHAKTI SABHA',
  subTitle: 'Field Practitioner • Youth Educator • Independent Researcher & Speaker',
  honorific_hi: 'हर्षिता मानकर',
  heroQuote: 'We believe in strength without hostility, knowledge without dogma, and freedom with responsibility.',
  bio: 'Harshita Manker is a field practitioner, youth educator, and independent researcher. She has undertaken additional training in counselling, behavioural observation and body-language awareness, and self-defence and physical preparedness training.',
  heroImage: 'Gemini_Generated_Image_kdfkbukdfkbukdfk.png',
  genesisLead: 'From Field Experience to Institutional Thought',
  genesisP1: 'Harshita Manker’s journey began through direct engagement with young people, educational initiatives, community programmes and public speaking. Over the years, these experiences brought her into close contact with the everyday challenges faced by girls, women and young people across different social and institutional settings.',
  genesisP2: 'Her work gradually developed beyond individual programmes towards a broader interest in education, human behaviour, Indian history and heritage, social resilience, women’s empowerment and responsible citizenship.',
  genesisP3: 'Shakti Sabha emerged from this continuing journey: an effort to bring together field experience, study, dialogue and practical action in a way that strengthens both individual capability and social awareness.',
  kshatraDharmaText: 'For Shakti Sabha, Kshatra-Dharma represents the responsibility to protect, the courage to confront injustice, and the discipline to use strength responsibly. It is approached not as a call for aggression, but as an ethical idea: strength guided by restraint, courage guided by wisdom, and action guided by responsibility.',
  metrics: {
    blackBelt: 'Black Belt in Karate: Martial arts discipline, self-defence and physical preparedness training.',
    girlsTrained: '2,000+ Girls Engaged Through Training & Programmes: Practical self-defence, situational awareness and confidence-building programmes for girls and women.',
    seminars: '500+ Educational Sessions: Institutional sessions, youth awareness programmes, and consciousness-building dialogues.',
    studentsReached: '25,000+ Young People Reached: Youth engagement sessions across educational and community platforms.',
    camps: 'Mission Mardini: Practical self-defence, situational awareness and confidence-building programmes for girls and women.',
    tribalOutreach: 'Community & Tribal Outreach: Educational, awareness and empowerment initiatives with young people and underserved communities.',
    collaborations: 'Collaborative Initiatives: Working with educational institutions, community organisations and public forums.'
  },
  interventions: {
    statutoryMinors: '13 Vulnerable Minors',
    crisesHandled: '250+ Reported Consultations',
    familyMediations: '50+ Critical Field Mediations',
    childProtectionText: 'Directly facilitated the timely safety interception, statutory handoff, and supervised reintegration of vulnerable minors into verified legal guardianship and safe academic environments in coordination with Child Welfare Committees (CWC) and statutory commissions.',
    counterGroomingText: 'Handled over 250 reported distress consultations, intervening in campus and hostel settings to resolve coercive interpersonal situations, conducting direct non-adversarial field mediations and pre-emptive family reconciliations in 50+ critical situations.',
    somaticSupportText: 'Counselling & psychosocial awareness: Counselling support and awareness-based conversations, with appropriate referral where specialised professional care is required. She has undertaken additional training in counselling, behavioural observation and body-language awareness.',
    confidentialityNotice: 'Shakti Sabha operates as a civil and community support initiative. Field engagements, counselling support, and awareness-based conversations are conducted with strict respect for the privacy, safety, and confidentiality of affected individuals and their guardians. Where specialised professional or statutory care is required, appropriate referral and coordination with statutory bodies are facilitated in accordance with applicable laws.'
  }
}

export function getFounderData(): FounderProfileData {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('shakti_founder_data')
      if (stored) {
        const parsed = JSON.parse(stored)
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

/**
 * Fetches live founder profile from Supabase with localStorage & default fallback
 */
export async function fetchFounderData(): Promise<FounderProfileData> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('category', 'FounderProfile')
      .limit(1)
      .maybeSingle()

    if (!error && data && data.content_en) {
      try {
        const parsed = JSON.parse(data.content_en)
        const merged: FounderProfileData = {
          ...DEFAULT_FOUNDER_DATA,
          ...parsed,
          heroImage: data.cover_image_url || parsed.heroImage || DEFAULT_FOUNDER_DATA.heroImage,
          metrics: { ...DEFAULT_FOUNDER_DATA.metrics, ...(parsed.metrics || {}) },
          interventions: { ...DEFAULT_FOUNDER_DATA.interventions, ...(parsed.interventions || {}) },
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('shakti_founder_data', JSON.stringify(merged))
        }
        return merged
      } catch (parseErr) {
        console.warn('Founder JSON parse error:', parseErr)
      }
    }
  } catch (err: any) {
    console.warn('[Founder Data] Supabase fetch fallback to local:', err?.message)
  }
  return getFounderData()
}

/**
 * Saves founder profile to Supabase database and syncs to localStorage
 */
export async function saveFounderDataAsync(data: Partial<FounderProfileData>): Promise<FounderProfileData> {
  const existing = getFounderData()
  const updated: FounderProfileData = {
    ...existing,
    ...data,
    metrics: { ...existing.metrics, ...(data.metrics || {}) },
    interventions: { ...existing.interventions, ...(data.interventions || {}) },
  }

  // 1. Immediately update localStorage for instant UI response
  saveFounderData(updated)

  // 2. Persist directly to Supabase articles table
  try {
    const { data: existingRecord } = await supabase
      .from('articles')
      .select('id')
      .eq('category', 'FounderProfile')
      .limit(1)
      .maybeSingle()

    const payload = {
      category: 'FounderProfile',
      title_en: updated.name || 'Harshita Manker',
      title_hi: updated.honorific_hi || 'हर्षिता मानकर',
      content_en: JSON.stringify(updated),
      excerpt_en: updated.heroQuote || '',
      cover_image_url: updated.heroImage || '',
      published: true,
      author_name: 'Harshita Manker',
      updated_at: new Date().toISOString()
    }

    if (existingRecord?.id) {
      await supabase.from('articles').update(payload).eq('id', existingRecord.id)
    } else {
      await supabase.from('articles').insert([payload])
    }
  } catch (err: any) {
    console.warn('[Founder Data] Supabase save error:', err?.message)
  }

  return updated
}
