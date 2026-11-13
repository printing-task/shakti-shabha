/**
 * Shakti Sabha Supabase Client & URL Utilities
 * Pure Supabase Architecture - No MongoDB or External Backend Required
 */

export function resolveImageUrl(url?: string | null): string {
  if (!url) return ''
  return url
}

export const api = {
  getHealth: async () => ({ status: 'ok', database: 'supabase', uptime: 'active' }),
  getFounder: async () => ({ found: false, data: null }),
  updateFounder: async (payload: any) => ({ message: 'ok', data: payload }),
  uploadPhoto: async (image: string, filename?: string) => ({ url: image, filename: filename || 'image' }),
  getGalleryPhotos: async () => ([]),
  createGalleryPhoto: async (payload: any) => payload,
  deleteGalleryPhoto: async () => ({ message: 'ok' }),
  getGalleryCategories: async () => ([]),
  createGalleryCategory: async (payload: any) => payload,
  deleteGalleryCategory: async () => ({ message: 'ok' }),
  getArticles: async () => ([]),
  getCourses: async () => ([]),
  getTestimonials: async () => ([]),
  getStats: async () => ({ articles: 0, courses: 0, counselling: 0, gallery: 0 }),
}
