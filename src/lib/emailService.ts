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

/**
 * Send an email notification to Admin when someone applies for a course or submits a course inquiry.
 * Checks for dedicated courses env variables, falling back to global emailjs env variables.
 */
export async function sendCourseNotificationEmail(data: CourseEmailData): Promise<boolean> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID_COURSES || import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_COURSES || import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY_COURSES || import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  if (!serviceId || !templateId || !publicKey) {
    console.info(
      '[EmailJS] Courses email notification skipped: Missing env variables (VITE_EMAILJS_SERVICE_ID_COURSES, VITE_EMAILJS_TEMPLATE_ID_COURSES, VITE_EMAILJS_PUBLIC_KEY_COURSES).'
    )
    return false
  }

  try {
    const templateParams = {
      form_type: 'Course Application / Inquiry',
      applicant_name: data.applicant_name,
      applicant_email: data.applicant_email,
      applicant_phone: data.applicant_phone,
      course_name: data.course_name,
      city: data.city || 'Online / Admissions Intake',
      message: data.message || `Cohort application submitted for: ${data.course_name}`,
      submitted_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    }

    const res = await emailjs.send(serviceId, templateId, templateParams, publicKey)
    console.log('[EmailJS] Course notification sent successfully:', res.status, res.text)
    return true
  } catch (err) {
    console.warn('[EmailJS] Failed to send course notification:', err)
    return false
  }
}

/**
 * Send an email notification to Admin when someone submits a confidential counselling intake request.
 * Checks for dedicated counselling env variables, falling back to global emailjs env variables.
 */
export async function sendCounsellingNotificationEmail(data: CounsellingEmailData): Promise<boolean> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID_COUNSELLING || import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_COUNSELLING || import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY_COUNSELLING || import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  if (!serviceId || !templateId || !publicKey) {
    console.info(
      '[EmailJS] Counselling email notification skipped: Missing env variables (VITE_EMAILJS_SERVICE_ID_COUNSELLING, VITE_EMAILJS_TEMPLATE_ID_COUNSELLING, VITE_EMAILJS_PUBLIC_KEY_COUNSELLING).'
    )
    return false
  }

  try {
    const locationStr = [data.city, data.state, data.country].filter(Boolean).join(', ') || 'Not specified'
    const templateParams = {
      form_type: 'Counselling & Mental Health Intake',
      applicant_name: data.applicant_name,
      applicant_email: data.applicant_email,
      applicant_phone: data.applicant_phone,
      concern: data.concern,
      location: locationStr,
      city: data.city || 'Not specified',
      message: data.message || 'Confidential request submitted',
      submitted_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    }

    const res = await emailjs.send(serviceId, templateId, templateParams, publicKey)
    console.log('[EmailJS] Counselling notification sent successfully:', res.status, res.text)
    return true
  } catch (err) {
    console.warn('[EmailJS] Failed to send counselling notification:', err)
    return false
  }
}
