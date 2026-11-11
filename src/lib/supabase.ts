import { createClient } from '@supabase/supabase-js'

const env = import.meta.env as Record<string, string | undefined>
const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL || 'https://urpbfpdwtsxfvputrmet.supabase.co'
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_HgqyZkTR1kDWAOysEnMQug_OrIMCKWi'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Article = {
  id: string
  title_en: string
  title_hi: string
  content_en: string
  content_hi: string
  excerpt_en: string
  excerpt_hi: string
  cover_image_url: string
  category: string
  tags: string[]
  published: boolean
  author_name: string
  created_at: string
  updated_at: string
}

export type GalleryPhoto = {
  id: string
  url: string
  caption: string
  category_id: string
  created_at: string
}

export type GalleryCategory = {
  id: string
  name: string
  description: string
  cover_url: string
  created_at: string
}

export type Course = {
  id: string
  title: string
  description: string
  price: number
  original_price?: number
  discount_percent?: number
  discount_tag?: string
  duration: string
  level: 'beginner' | 'intermediate' | 'advanced'
  cover_image_url: string
  syllabus: { week: string; topic: string }[]
  instructor: string
  published: boolean
  created_at: string
  updated_at: string
}

export type CounsellingRequest = {
  id: string
  name: string
  email: string
  phone: string
  city: string
  concern: string
  message: string
  status: 'pending' | 'reviewed' | 'contacted' | 'resolved'
  created_at: string
}

export type AdminProfile = {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'editor'
  avatar_url: string
  created_at: string
}

export type Testimonial = {
  id: string
  name: string
  role: string
  quote: string
  image_url: string
  rating?: number
  location?: string
  published: boolean
  created_at: string
  updated_at?: string
}
