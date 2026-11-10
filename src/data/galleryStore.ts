import { useState, useEffect, useCallback } from 'react'
import { supabase, GalleryPhoto, GalleryCategory } from '../lib/supabase'

/* ------------------------------------------------------------------ */
/* Types & Interfaces                                                  */
/* ------------------------------------------------------------------ */

export interface GalleryPhotoItem {
  id: string
  url: string
  caption: string
  category_id: string
  created_at: string
}

export interface GalleryCategoryItem {
  id: string
  name: string
  description?: string
  cover_url?: string
  created_at?: string
}

/* ------------------------------------------------------------------ */
/* Seed / Default Categories                                           */
/* ------------------------------------------------------------------ */

export const DEFAULT_GALLERY_CATEGORIES: GalleryCategoryItem[] = [
  {
    id: 'cat-mardini-camps',
    name: 'Mission Mardini Camps',
    description: 'Ground combat and lathi self-defense training across schools.',
    cover_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'cat-aaryaveera-leadership',
    name: 'Aaryaveera Leadership',
    description: 'Youth character building and civilizational seminars.',
    cover_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    created_at: '2026-01-02T00:00:00.000Z'
  },
  {
    id: 'cat-community-sahyog',
    name: 'Community & Sahyog',
    description: 'On-ground rural assistance and counseling outreach.',
    cover_url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80',
    created_at: '2026-01-03T00:00:00.000Z'
  }
]

const LEGACY_OLD_NAMES = new Set([
  'Mission Mardini & Lathi-Kaushal',
  'Shakti Bhava & Consciousness',
  'Shakti Varta & Seminars',
  'Tribal Outreach & Community Assemblies',
  'National Symposia & Public Events',
  'Aaryaveera & Training Frontline'
])

const STORAGE_KEY_CATEGORIES = 'shakti_gallery_categories'
const STORAGE_KEY_ALL_PHOTOS = 'shakti_gallery_photos'
export const GALLERY_UPDATE_EVENT = 'shakti_gallery_updated'

/* ------------------------------------------------------------------ */
/* Category Helpers                                                   */
/* ------------------------------------------------------------------ */

export function getStoredCategories(): GalleryCategoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.warn('Error reading stored gallery categories:', err)
  }
  // Initialize storage with defaults if empty
  try {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(DEFAULT_GALLERY_CATEGORIES))
  } catch { /* ignore */ }
  return DEFAULT_GALLERY_CATEGORIES
}

export async function fetchCategories(): Promise<GalleryCategoryItem[]> {
  const localCats = getStoredCategories()
  try {
    const { data, error } = await supabase
      .from('gallery_categories')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      // Merge remote categories with local ones (preserving custom local additions)
      const remoteMap = new Map<string, GalleryCategoryItem>(data.map(c => [c.id, c]))
      localCats.forEach(c => {
        if (!remoteMap.has(c.id)) {
          remoteMap.set(c.id, c)
        }
      })
      const merged = Array.from(remoteMap.values())
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(merged))
      return merged
    }
  } catch (err) {
    console.warn('Supabase fetchCategories fallback to local:', err)
  }
  return localCats
}

export async function saveCategory(category: Omit<GalleryCategoryItem, 'id' | 'created_at'> & { id?: string }): Promise<GalleryCategoryItem> {
  const newCat: GalleryCategoryItem = {
    id: category.id || `cat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: category.name.trim(),
    description: category.description?.trim() || '',
    cover_url: category.cover_url || '',
    created_at: new Date().toISOString()
  }

  // 1. Try Supabase
  try {
    await supabase.from('gallery_categories').insert([{
      id: newCat.id,
      name: newCat.name,
      description: newCat.description,
      cover_url: newCat.cover_url
    }])
  } catch (err) {
    console.warn('Supabase saveCategory error (using local storage fallback):', err)
  }

  // 2. Save to local storage
  const current = getStoredCategories()
  const updated = [newCat, ...current.filter(c => c.id !== newCat.id)]
  localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(updated))
  window.dispatchEvent(new Event(GALLERY_UPDATE_EVENT))
  window.dispatchEvent(new Event('storage'))

  return newCat
}

export async function deleteCategory(categoryId: string): Promise<void> {
  // 1. Supabase
  try {
    await supabase.from('gallery_photos').delete().eq('category_id', categoryId)
    await supabase.from('gallery_categories').delete().eq('id', categoryId)
  } catch (err) {
    console.warn('Supabase deleteCategory fallback:', err)
  }

  // 2. Local storage
  const cats = getStoredCategories().filter(c => c.id !== categoryId)
  localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(cats))
  localStorage.removeItem(`shakti_gallery_photos_${categoryId}`)

  const allPhotos = getStoredPhotos().filter(p => p.category_id !== categoryId)
  localStorage.setItem(STORAGE_KEY_ALL_PHOTOS, JSON.stringify(allPhotos))

  window.dispatchEvent(new Event(GALLERY_UPDATE_EVENT))
  window.dispatchEvent(new Event('storage'))
}

/* ------------------------------------------------------------------ */
/* Photos Helpers                                                     */
/* ------------------------------------------------------------------ */


export async function renameGalleryCategory(categoryId: string, newName: string): Promise<void> {
  const trimmed = newName.trim()
  if (!trimmed) return

  // 1. Supabase database
  try {
    const { error } = await supabase
      .from('gallery_categories')
      .update({ name: trimmed })
      .eq('id', categoryId)
    if (error) console.error('Supabase renameGalleryCategory error:', error)
  } catch (err) {
    console.warn('Supabase renameGalleryCategory failed:', err)
  }

  // 2. Local storage
  try {
    const cats = getStoredCategories().map(c => c.id === categoryId ? { ...c, name: trimmed } : c)
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(cats))
  } catch { /* ignore */ }

  window.dispatchEvent(new Event(GALLERY_UPDATE_EVENT))
  window.dispatchEvent(new Event('storage'))
}

export async function mergeGalleryCategories(
  sourceCategoryIds: string[],
  targetCategoryId: string,
  newTargetName?: string
): Promise<void> {
  if (!sourceCategoryIds || sourceCategoryIds.length === 0 || !targetCategoryId) return
  const finalName = newTargetName?.trim()

  // 1. Supabase database: Migrate all photos from source categories into the target category
  try {
    const { error: photoErr } = await supabase
      .from('gallery_photos')
      .update({ category_id: targetCategoryId })
      .in('category_id', sourceCategoryIds)
    if (photoErr) console.error('Supabase merge photos error:', photoErr)
  } catch (err) {
    console.warn('Supabase merge photos failed:', err)
  }

  // 2. Supabase database: Rename target category if custom name provided
  if (finalName) {
    try {
      const { error: catRenameErr } = await supabase
        .from('gallery_categories')
        .update({ name: finalName })
        .eq('id', targetCategoryId)
      if (catRenameErr) console.error('Supabase cat rename error:', catRenameErr)
    } catch (err) {
      console.warn('Supabase cat rename failed:', err)
    }
  }

  // 3. Supabase database: Delete source categories (now safe since photos have been migrated)
  try {
    const { error: catDelErr } = await supabase
      .from('gallery_categories')
      .delete()
      .in('id', sourceCategoryIds)
    if (catDelErr) console.error('Supabase cat delete error:', catDelErr)
  } catch (err) {
    console.warn('Supabase cat delete failed:', err)
  }

  // 4. LocalStorage: Update all photos in shakti_gallery_photos
  try {
    const all = getStoredPhotos()
    const updatedPhotos = all.map(p => {
      if (sourceCategoryIds.includes(p.category_id)) {
        return { ...p, category_id: targetCategoryId }
      }
      return p
    })
    localStorage.setItem(STORAGE_KEY_ALL_PHOTOS, JSON.stringify(updatedPhotos))

    // 5. LocalStorage: Update target category cache and remove source category caches
    const targetPhotos = updatedPhotos.filter(p => p.category_id === targetCategoryId)
    localStorage.setItem(`shakti_gallery_photos_${targetCategoryId}`, JSON.stringify(targetPhotos))
    localStorage.setItem(`shakti_cat_photos_${targetCategoryId}`, JSON.stringify(targetPhotos))

    sourceCategoryIds.forEach(sId => {
      localStorage.removeItem(`shakti_gallery_photos_${sId}`)
      localStorage.removeItem(`shakti_cat_photos_${sId}`)
    })

    // 6. LocalStorage: Update categories
    const localCats = getStoredCategories()
    const updatedCats = localCats
      .filter(c => !sourceCategoryIds.includes(c.id))
      .map(c => (c.id === targetCategoryId && finalName) ? { ...c, name: finalName } : c)
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(updatedCats))
  } catch (err) {
    console.warn('LocalStorage merge sync error:', err)
  }

  // 7. Dispatch events
  window.dispatchEvent(new Event(GALLERY_UPDATE_EVENT))
  window.dispatchEvent(new Event('storage'))
}

export function getStoredPhotos(): GalleryPhotoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ALL_PHOTOS)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (err) {
    console.warn('Error reading stored photos:', err)
  }

  // Fallback: check individual category keys
  const categories = getStoredCategories()
  const collected: GalleryPhotoItem[] = []
  categories.forEach(cat => {
    try {
      const catRaw = localStorage.getItem(`shakti_gallery_photos_${cat.id}`)
      if (catRaw) {
        const catPhotos = JSON.parse(catRaw)
        if (Array.isArray(catPhotos)) collected.push(...catPhotos)
      }
    } catch { /* ignore */ }
  })

  if (collected.length > 0) {
    try {
      localStorage.setItem(STORAGE_KEY_ALL_PHOTOS, JSON.stringify(collected))
    } catch { /* ignore */ }
  }

  return collected
}

export async function fetchPhotosForCategory(categoryId: string): Promise<GalleryPhotoItem[]> {
  let list: GalleryPhotoItem[] = []

  // Check Supabase first
  try {
    const { data, error } = await supabase
      .from('gallery_photos')
      .select('*')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      list = data.map(p => ({
        id: p.id,
        url: p.url,
        caption: p.caption || '',
        category_id: p.category_id,
        created_at: p.created_at
      }))
    }
  } catch (err) {
    console.warn('Supabase fetchPhotos error, checking local:', err)
  }

  // Check localStorage for this category
  try {
    const catLocal = localStorage.getItem(`shakti_gallery_photos_${categoryId}`)
    if (catLocal) {
      const parsed: GalleryPhotoItem[] = JSON.parse(catLocal)
      if (Array.isArray(parsed)) {
        const map = new Map<string, GalleryPhotoItem>(list.map(p => [p.id, p]))
        parsed.forEach(p => {
          if (!map.has(p.id)) map.set(p.id, p)
        })
        list = Array.from(map.values())
      }
    }
  } catch { /* ignore */ }

  return list
}

let cachedPhotos: GalleryPhotoItem[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60000;

export async function fetchAllPhotos(forceRefresh = false): Promise<GalleryPhotoItem[]> {
  const now = Date.now();
  if (!forceRefresh && cachedPhotos && (now - lastFetchTime < CACHE_TTL_MS)) {
    return cachedPhotos;
  }
  const localPhotos = getStoredPhotos()
  try {
    const { data, error } = await supabase
      .from('gallery_photos')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      const remotePhotos: GalleryPhotoItem[] = data.map(p => ({
        id: p.id,
        url: p.url,
        caption: p.caption || '',
        category_id: p.category_id,
        created_at: p.created_at
      }))

      const map = new Map<string, GalleryPhotoItem>(remotePhotos.map(p => [p.id, p]))
      localPhotos.forEach(p => {
        if (!map.has(p.id)) map.set(p.id, p)
      })
      const merged = Array.from(map.values());
      cachedPhotos = merged;
      lastFetchTime = now;
      localStorage.setItem(STORAGE_KEY_ALL_PHOTOS, JSON.stringify(merged))
      return merged
    }
  } catch (err) {
    console.warn('Supabase fetchAllPhotos error, returning local:', err)
  }
  return localPhotos
}

cachedPhotos = null;
export function saveUploadedPhotos(newPhotos: GalleryPhotoItem[], categoryId: string) {
  if (!newPhotos || newPhotos.length === 0) return

  // 1. Update category-specific key
  try {
    const catKey = `shakti_gallery_photos_${categoryId}`
    const existingCat = JSON.parse(localStorage.getItem(catKey) || '[]')
    localStorage.setItem(catKey, JSON.stringify([...newPhotos, ...existingCat]))
  } catch (err) {
    console.warn('Error saving category photos locally:', err)
  }

  // 2. Update master all-photos key
  try {
    const all = getStoredPhotos()
    const idMap = new Map<string, GalleryPhotoItem>(all.map(p => [p.id, p]))
    newPhotos.forEach(p => idMap.set(p.id, p))
    const merged = Array.from(idMap.values())
    localStorage.setItem(STORAGE_KEY_ALL_PHOTOS, JSON.stringify(merged))
  } catch (err) {
    console.warn('Error saving master photos locally:', err)
  }

  window.dispatchEvent(new Event(GALLERY_UPDATE_EVENT))
  window.dispatchEvent(new Event('storage'))
}

export async function deleteStoredPhoto(photoId: string, categoryId?: string): Promise<void> {
  // 1. Supabase
  try {
    await supabase.from('gallery_photos').delete().eq('id', photoId)
  } catch (err) {
    console.warn('Supabase deletePhoto error:', err)
  }

  // 2. Local storage
  const all = getStoredPhotos().filter(p => p.id !== photoId)
  localStorage.setItem(STORAGE_KEY_ALL_PHOTOS, JSON.stringify(all))

  if (categoryId) {
    try {
      const catKey = `shakti_gallery_photos_${categoryId}`
      const catPhotos = JSON.parse(localStorage.getItem(catKey) || '[]').filter((p: any) => p.id !== photoId)
      localStorage.setItem(catKey, JSON.stringify(catPhotos))
    } catch { /* ignore */ }
  }

  window.dispatchEvent(new Event(GALLERY_UPDATE_EVENT))
  window.dispatchEvent(new Event('storage'))
}

/* ------------------------------------------------------------------ */
/* Random Photo Selectors according to Categories                      */
/* ------------------------------------------------------------------ */

/**
 * Matches categories based on fuzzy keyword matching against category id and name.
 */
export function findMatchingCategoryIds(keywords: string | string[], categories: GalleryCategoryItem[]): string[] {
  const queryList = (Array.isArray(keywords) ? keywords : [keywords]).map(k => k.toLowerCase().trim())
  const matched = new Set<string>()

  categories.forEach(cat => {
    const catName = cat.name.toLowerCase()
    const catId = cat.id.toLowerCase()
    const isMatch = queryList.some(q => catName.includes(q) || catId.includes(q) || q.includes(catId))
    if (isMatch) {
      matched.add(cat.id)
    }
  })

  return Array.from(matched)
}

/**
 * Get all photos belonging to any category matching the given keywords.
 */
export function getCategoryPhotos(keywords: string | string[], allPhotos?: GalleryPhotoItem[], categories?: GalleryCategoryItem[]): GalleryPhotoItem[] {
  const cats = categories || getStoredCategories()
  const photos = allPhotos || getStoredPhotos()
  const matchedCatIds = findMatchingCategoryIds(keywords, cats)

  if (matchedCatIds.length === 0) {
    // If no specific category matched, try matching captions or return all photos if query is 'all'
    const queryList = (Array.isArray(keywords) ? keywords : [keywords]).map(k => k.toLowerCase().trim())
    if (queryList.includes('all')) return photos
    return photos.filter(p => queryList.some(q => p.caption.toLowerCase().includes(q)))
  }

  return photos.filter(p => matchedCatIds.includes(p.category_id))
}

/**
 * Get a random photo from the matching category, with a graceful fallback URL.
 */
export function getRandomCategoryPhoto(
  keywords: string | string[],
  fallbackUrl: string,
  allPhotos?: GalleryPhotoItem[],
  categories?: GalleryCategoryItem[]
): { url: string; caption: string; isFromDb: boolean } {
  const matching = getCategoryPhotos(keywords, allPhotos, categories)
  if (matching.length > 0) {
    const randomIndex = Math.floor(Math.random() * matching.length)
    const selected = matching[randomIndex]
    return {
      url: selected.url,
      caption: selected.caption || '',
      isFromDb: true
    }
  }
  return {
    url: fallbackUrl,
    caption: '',
    isFromDb: false
  }
}

/**
 * Get multiple randomized photos from matching category.
 */
export function getRandomCategoryPhotos(
  keywords: string | string[],
  count: number,
  fallbackUrls: string[] = [],
  allPhotos?: GalleryPhotoItem[],
  categories?: GalleryCategoryItem[]
): { url: string; caption: string; isFromDb: boolean }[] {
  const matching = [...getCategoryPhotos(keywords, allPhotos, categories)]
  const result: { url: string; caption: string; isFromDb: boolean }[] = []

  // Shuffle available matching photos
  for (let i = matching.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [matching[i], matching[j]] = [matching[j], matching[i]]
  }

  // Use matching photos first
  for (let i = 0; i < Math.min(count, matching.length); i++) {
    result.push({
      url: matching[i].url,
      caption: matching[i].caption || '',
      isFromDb: true
    })
  }

  // Fill remaining slots with fallbacks if needed
  let fallbackIdx = 0
  while (result.length < count && fallbackUrls.length > 0) {
    result.push({
      url: fallbackUrls[fallbackIdx % fallbackUrls.length],
      caption: '',
      isFromDb: false
    })
    fallbackIdx++
  }

  return result
}

/* ------------------------------------------------------------------ */
/* React Hook: useCategoryPhoto                                       */
/* ------------------------------------------------------------------ */

export function useCategoryPhoto(keywords: string | string[], fallbackUrl: string) {
  const kwKey = Array.isArray(keywords) ? keywords.join(',') : keywords;
  const [photo, setPhoto] = useState<{ url: string; caption: string; isFromDb: boolean }>(() =>
    getRandomCategoryPhoto(keywords, fallbackUrl)
  );

  useEffect(() => {
    let isCurrent = true;
    fetchAllPhotos().then(photos => {
      if (!isCurrent) return;
      const cats = getStoredCategories();
      setPhoto(getRandomCategoryPhoto(keywords, fallbackUrl, photos, cats));
    }).catch(() => {
      if (isCurrent) setPhoto(getRandomCategoryPhoto(keywords, fallbackUrl));
    });

    const handleUpdate = () => {
      fetchAllPhotos(true).then(photos => {
        if (!isCurrent) return;
        const cats = getStoredCategories();
        setPhoto(getRandomCategoryPhoto(keywords, fallbackUrl, photos, cats));
      });
    };

    window.addEventListener(GALLERY_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      isCurrent = false;
      window.removeEventListener(GALLERY_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [kwKey, fallbackUrl]);

  return photo;
}

/* ------------------------------------------------------------------ */
/* React Hook: useCategoryPhotos                                      */
/* ------------------------------------------------------------------ */

export function useCategoryPhotos(keywords: string | string[], count: number, fallbackUrls: string[] = []) {
  const kwKey = Array.isArray(keywords) ? keywords.join(',') : keywords;
  const fbKey = Array.isArray(fallbackUrls) ? fallbackUrls.join(',') : '';
  const [photos, setPhotos] = useState<{ url: string; caption: string; isFromDb: boolean }[]>(() =>
    getRandomCategoryPhotos(keywords, count, fallbackUrls)
  );

  useEffect(() => {
    let isCurrent = true;
    fetchAllPhotos().then(allPhotos => {
      if (!isCurrent) return;
      const cats = getStoredCategories();
      setPhotos(getRandomCategoryPhotos(keywords, count, fallbackUrls, allPhotos, cats));
    }).catch(() => {
      if (isCurrent) setPhotos(getRandomCategoryPhotos(keywords, count, fallbackUrls));
    });

    const handleUpdate = () => {
      fetchAllPhotos(true).then(allPhotos => {
        if (!isCurrent) return;
        const cats = getStoredCategories();
        setPhotos(getRandomCategoryPhotos(keywords, count, fallbackUrls, allPhotos, cats));
      });
    };

    window.addEventListener(GALLERY_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      isCurrent = false;
      window.removeEventListener(GALLERY_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [kwKey, count, fbKey]);

  return photos;
}