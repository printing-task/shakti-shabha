import emailjs from '@emailjs/browser'

export interface CourseEmailData {
  applicant_name: string
  applicant_email: string
  applicant_phone: string
  course_name: string
  city?: string
  message?: string
}

export interface CounsellingEmailData {
  applicant_name: string
  applicant_email: string
  applicant_phone: string
  concern: string
  city?: string
  state?: string
  country?: string
  message?: string
}

export interface SahyogEmailData {
  rep_name: string
  rep_email: string
  rep_phone: string
  partner_type: string
  organization: string
  goals?: string
}

/**
 * Helper to retrieve environment variable with multiple fallback aliases
 */
function resolveEnv(
  category: 'courses' | 'counselling' | 'sahyog',
  key: 'SERVICE_ID' | 'TEMPLATE_ID' | 'PUBLIC_KEY'
): string {
  const env = import.meta.env
  const catUpper = category.toUpperCase()

  // 1. Category-specific e.g. VITE_EMAILJS_SERVICE_ID_COURSES or VITE_EMAILJS_COURSES_SERVICE_ID
  const specific1 = env[`VITE_EMAILJS_${key}_${catUpper}`]
  const specific2 = env[`VITE_EMAILJS_${catUpper}_${key}`]
  if (specific1 && String(specific1).trim()) return String(specific1).trim()
  if (specific2 && String(specific2).trim()) return String(specific2).trim()

  // 2. General fallback e.g. VITE_EMAILJS_SERVICE_ID
  const general = env[`VITE_EMAILJS_${key}`]
  if (general && String(general).trim()) return String(general).trim()

  // 3. Historical alias for public key
  if (key === 'PUBLIC_KEY') {
    const userId = env.VITE_EMAILJS_USER_ID || env.VITE_EMAILJS_PUBLIC_KEY
    if (userId && String(userId).trim()) return String(userId).trim()
  }

  return ''
}

/**
 * Send an email notification to Admin when someone applies for a course or submits an inquiry.
 */
export async function sendCourseNotificationEmail(data: CourseEmailData): Promise<boolean> {
  const serviceId = resolveEnv('courses', 'SERVICE_ID')
  const templateId = resolveEnv('courses', 'TEMPLATE_ID')
  const publicKey = resolveEnv('courses', 'PUBLIC_KEY')

  if (!serviceId || !templateId || !publicKey) {
    console.warn(
      `[EmailJS Diagnostics - Courses]\n` +
      `Email notification skipped because required environment variables are missing.\n` +
      `- Service ID: ${serviceId ? 'Found (' + serviceId.slice(0, 4) + '***)' : 'MISSING'}\n` +
      `- Template ID: ${templateId ? 'Found (' + templateId.slice(0, 4) + '***)' : 'MISSING'}\n` +
      `- Public Key: ${publicKey ? 'Found (' + publicKey.slice(0, 4) + '***)' : 'MISSING'}\n` +
      `Required in Render Environment: VITE_EMAILJS_SERVICE_ID_COURSES, VITE_EMAILJS_TEMPLATE_ID_COURSES, VITE_EMAILJS_PUBLIC_KEY_COURSES (or general VITE_EMAILJS_*)`
    )
    return false
  }

  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  const templateParams: Record<string, string> = {
    // Standard template aliases
    to_name: 'Shakti Sabha Admin',
    from_name: data.applicant_name,
    from_email: data.applicant_email,
    reply_to: data.applicant_email,

    // User details
    name: data.applicant_name,
    email: data.applicant_email,
    phone: data.applicant_phone,
    applicant_name: data.applicant_name,
    applicant_email: data.applicant_email,
    applicant_phone: data.applicant_phone,
    user_name: data.applicant_name,
    user_email: data.applicant_email,
    user_phone: data.applicant_phone,

    // Course information
    course_name: data.course_name,
    course: data.course_name,
    program: data.course_name,
    city: data.city || 'Online / Admissions Intake',
    location: data.city || 'Online / Admissions Intake',
    message: data.message || `Cohort application submitted for: ${data.course_name}`,
    notes: data.message || `Cohort application submitted for: ${data.course_name}`,

    // Administrative metadata
    form_type: 'Course Application / Inquiry',
    subject: `New Course Inquiry: ${data.course_name} (${data.applicant_name})`,
    submitted_at: timestamp,
    timestamp: timestamp,
  }

  console.log(`[EmailJS] Dispatching Course Application email for: "${data.applicant_name}" (${data.course_name})...`)

  try {
    const res = await emailjs.send(serviceId, templateId, templateParams, publicKey)
    console.log('[EmailJS] Course notification delivered successfully! Status:', res.status, res.text)
    return true
  } catch (sdkErr: any) {
    console.warn('[EmailJS] SDK dispatch returned error, attempting direct REST HTTP fallback...', sdkErr)
    try {
      const resp = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: templateParams,
        }),
      })

      if (resp.ok) {
        console.log('[EmailJS REST] Course notification delivered successfully via REST API!')
        return true
      } else {
        const errorBody = await resp.text()
        console.error('[EmailJS REST] Direct send failed with status:', resp.status, errorBody)
        return false
      }
    } catch (fetchErr) {
      console.error('[EmailJS] Both SDK and REST dispatch failed:', fetchErr)
      return false
    }
  }
}

/**
 * Send an email notification to Admin when someone submits a confidential counselling intake request.
 */
export async function sendCounsellingNotificationEmail(data: CounsellingEmailData): Promise<boolean> {
  const serviceId = resolveEnv('counselling', 'SERVICE_ID')
  const templateId = resolveEnv('counselling', 'TEMPLATE_ID')
  const publicKey = resolveEnv('counselling', 'PUBLIC_KEY')

  if (!serviceId || !templateId || !publicKey) {
    console.warn(
      `[EmailJS Diagnostics - Counselling]\n` +
      `Email notification skipped because required environment variables are missing.\n` +
      `- Service ID: ${serviceId ? 'Found (' + serviceId.slice(0, 4) + '***)' : 'MISSING'}\n` +
      `- Template ID: ${templateId ? 'Found (' + templateId.slice(0, 4) + '***)' : 'MISSING'}\n` +
      `- Public Key: ${publicKey ? 'Found (' + publicKey.slice(0, 4) + '***)' : 'MISSING'}\n` +
      `Required in Render Environment: VITE_EMAILJS_SERVICE_ID_COUNSELLING, VITE_EMAILJS_TEMPLATE_ID_COUNSELLING, VITE_EMAILJS_PUBLIC_KEY_COUNSELLING (or general VITE_EMAILJS_*)`
    )
    return false
  }

  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  const locationStr = [data.city, data.state, data.country].filter(Boolean).join(', ') || 'Not specified'

  const templateParams: Record<string, string> = {
    // Standard template aliases
    to_name: 'Shakti Sabha Counselling Team',
    from_name: data.applicant_name,
    from_email: data.applicant_email,
    reply_to: data.applicant_email,

    // User details
    name: data.applicant_name,
    email: data.applicant_email,
    phone: data.applicant_phone,
    applicant_name: data.applicant_name,
    applicant_email: data.applicant_email,
    applicant_phone: data.applicant_phone,
    user_name: data.applicant_name,
    user_email: data.applicant_email,
    user_phone: data.applicant_phone,

    // Case info
    concern: data.concern,
    area_of_support: data.concern,
    location: locationStr,
    city: data.city || 'Not specified',
    state: data.state || '',
    country: data.country || 'India',
    message: data.message || `Confidential request submitted for: ${data.concern}`,
    notes: data.message || `Confidential request submitted for: ${data.concern}`,

    // Administrative metadata
    form_type: 'Confidential Counselling Intake',
    subject: `Confidential Counselling Intake: ${data.concern} (${data.applicant_name})`,
    submitted_at: timestamp,
    timestamp: timestamp,
  }

  console.log(`[EmailJS] Dispatching Counselling Intake email for: "${data.applicant_name}" (${data.concern})...`)

  try {
    const res = await emailjs.send(serviceId, templateId, templateParams, publicKey)
    console.log('[EmailJS] Counselling notification delivered successfully! Status:', res.status, res.text)
    return true
  } catch (sdkErr: any) {
    console.warn('[EmailJS] SDK dispatch returned error, attempting direct REST HTTP fallback...', sdkErr)
    try {
      const resp = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: templateParams,
        }),
      })

      if (resp.ok) {
        console.log('[EmailJS REST] Counselling notification delivered successfully via REST API!')
        return true
      } else {
        const errorBody = await resp.text()
        console.error('[EmailJS REST] Direct send failed with status:', resp.status, errorBody)
        return false
      }
    } catch (fetchErr) {
      console.error('[EmailJS] Both SDK and REST dispatch failed:', fetchErr)
      return false
    }
  }
}

/**
 * Send an email notification to Admin when an institution or company submits a Sahyog partnership intent.
 */
export async function sendSahyogNotificationEmail(data: SahyogEmailData): Promise<boolean> {
  const serviceId = resolveEnv('sahyog', 'SERVICE_ID')
  const templateId = resolveEnv('sahyog', 'TEMPLATE_ID')
  const publicKey = resolveEnv('sahyog', 'PUBLIC_KEY')

  if (!serviceId || !templateId || !publicKey) {
    console.info('[EmailJS] Sahyog partnership notification skipped: Missing env credentials.')
    return false
  }

  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  const templateParams: Record<string, string> = {
    to_name: 'Shakti Sabha Partnerships Lead',
    from_name: data.rep_name,
    from_email: data.rep_email,
    reply_to: data.rep_email,

    name: data.rep_name,
    email: data.rep_email,
    phone: data.rep_phone,
    partner_type: data.partner_type,
    organization: data.organization,
    goals: data.goals || 'Strategic Collaboration',
    message: `[${data.partner_type}] Organization: ${data.organization} · Goals: ${data.goals || 'General Inquiry'}`,

    form_type: 'Sahyog Institutional Partnership',
    subject: `Sahyog Partnership Intent: ${data.organization} (${data.partner_type})`,
    submitted_at: timestamp,
    timestamp: timestamp,
  }

  try {
    await emailjs.send(serviceId, templateId, templateParams, publicKey)
    return true
  } catch (err) {
    console.warn('[EmailJS] Sahyog send error:', err)
    return false
  }
}
