/**
 * Shakti Sabha Backend API Client
 * Connects React frontend to Express + MongoDB Atlas backend
 */

import { Article, Course, CounsellingRequest, GalleryPhoto, GalleryCategory, Testimonial } from './supabase'

// When deployed on Render as full-stack, default to same-origin in production, localhost:5000 in dev
const API_BASE_URL = (
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:5000' : '')
).replace(/\/$/, '')

/**
 * Universal fetch wrapper with timeout and error handling
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = API_BASE_URL ? `${API_BASE_URL}${cleanEndpoint}` : cleanEndpoint
  const token = localStorage.getItem('shakti_admin_token')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 12000)

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      throw new Error(errBody.error || `API error ${res.status}: ${res.statusText}`)
    }

    return await res.json()
  } catch (err: any) {
    clearTimeout(timeoutId)
    console.warn(`[Shakti API] Request to ${endpoint} failed:`, err.message)
    throw err
  }
}

export const api = {
  // ── Health Check (Render keep-alive & diagnostics) ──
  getHealth: () => request<{ status: string; database: string; uptime: string }>('/health'),

  // ── Auth ──
  login: (email: string, password: string) =>
    request<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (email: string, password: string, fullName: string) =>
    request<{ token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    }),
  getMe: () => request<{ user: any }>('/api/auth/me'),

  // ── Articles ──
  getArticles: (params?: { published?: boolean; category?: string }) => {
    const qs = new URLSearchParams()
    if (params?.published !== undefined) qs.set('published', String(params.published))
    if (params?.category) qs.set('category', params.category)
    return request<Article[]>(`/api/articles?${qs.toString()}`)
  },
  getArticle: (id: string) => request<Article>(`/api/articles/${id}`),
  createArticle: (payload: Partial<Article>) =>
    request<Article>('/api/articles', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateArticle: (id: string, payload: Partial<Article>) =>
    request<Article>(`/api/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteArticle: (id: string) =>
    request<{ message: string }>(`/api/articles/${id}`, {
      method: 'DELETE',
    }),

  // ── Courses ──
  getCourses: (params?: { published?: boolean; level?: string }) => {
    const qs = new URLSearchParams()
    if (params?.published !== undefined) qs.set('published', String(params.published))
    if (params?.level) qs.set('level', params.level)
    return request<Course[]>(`/api/courses?${qs.toString()}`)
  },
  getCourse: (id: string) => request<Course>(`/api/courses/${id}`),
  createCourse: (payload: Partial<Course>) =>
    request<Course>('/api/courses', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateCourse: (id: string, payload: Partial<Course>) =>
    request<Course>(`/api/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteCourse: (id: string) =>
    request<{ message: string }>(`/api/courses/${id}`, {
      method: 'DELETE',
    }),

  // ── Counselling Requests ──
  submitCounselling: (payload: {
    name: string
    email?: string
    phone: string
    city?: string
    concern: string
    message?: string
  }) =>
    request<{ message: string; data: CounsellingRequest }>('/api/counselling', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getCounsellingRequests: (status?: string) => {
    const qs = status ? `?status=${status}` : ''
    return request<CounsellingRequest[]>(`/api/counselling${qs}`)
  },
  updateCounsellingStatus: (id: string, status: CounsellingRequest['status']) =>
    request<CounsellingRequest>(`/api/counselling/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteCounsellingRequest: (id: string) =>
    request<{ message: string }>(`/api/counselling/${id}`, {
      method: 'DELETE',
    }),

  // ── Gallery Photos & Categories ──
  getGalleryPhotos: (categoryId?: string) => {
    const qs = categoryId ? `?category_id=${categoryId}` : ''
    return request<GalleryPhoto[]>(`/api/gallery/photos${qs}`)
  },
  createGalleryPhoto: (payload: { id?: string; url: string; caption?: string; category_id?: string }) =>
    request<GalleryPhoto>('/api/gallery/photos', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  deleteGalleryPhoto: (id: string, url?: string) => {
    const cleanId = encodeURIComponent(id || 'by-url')
    const qs = url ? `?url=${encodeURIComponent(url)}` : ''
    return request<{ message: string; deletedCount?: number }>(`/api/gallery/photos/${cleanId}${qs}`, {
      method: 'DELETE',
    })
  },
  getGalleryCategories: () => request<GalleryCategory[]>('/api/gallery/categories'),
  createGalleryCategory: (payload: { id?: string; name: string; description?: string; cover_url?: string }) =>
    request<GalleryCategory>('/api/gallery/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  deleteGalleryCategory: (id: string) =>
    request<{ message: string }>(`/api/gallery/categories/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  // ── Testimonials ──
  getTestimonials: (publishedOnly: boolean = false) =>
    request<Testimonial[]>(`/api/testimonials${publishedOnly ? '?published=true' : ''}`),
  createTestimonial: (payload: Partial<Testimonial>) =>
    request<Testimonial>('/api/testimonials', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateTestimonial: (id: string, payload: Partial<Testimonial>) =>
    request<Testimonial>(`/api/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteTestimonial: (id: string) =>
    request<{ message: string }>(`/api/testimonials/${id}`, {
      method: 'DELETE',
    }),

  // ── Stats (Admin Dashboard summary) ──
  getStats: () =>
    request<{ articles: number; courses: number; counselling: number; gallery: number }>('/api/stats'),
}
