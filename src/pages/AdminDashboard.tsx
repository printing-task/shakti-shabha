import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, Article, GalleryCategory, GalleryPhoto, Course, CounsellingRequest, Testimonial } from '../lib/supabase'
import { DEFAULT_TESTIMONIALS } from '../components/Testimonials/testimonialsData'
import { getFounderData, saveFounderData, FounderProfileData, DEFAULT_FOUNDER_DATA } from '../data/founderData'
import { useAuth } from '../lib/AuthContext'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import s from './AdminDashboard.module.css'
import { compressImage } from '../lib/imageCompressor'
import { api } from '../lib/api'
import {
  fetchCategories,
  fetchAllPhotos,
  saveCategory,
  deleteCategory as deleteGalleryCategory,
  mergeGalleryCategories,
  renameGalleryCategory,
  fetchPhotosForCategory,
  saveUploadedPhotos,
  deleteStoredPhoto,
  getStoredCategories,
  getStoredPhotos,
  GalleryCategoryItem,
  GalleryPhotoItem
} from '../data/galleryStore'


interface LoaderProps {
  title?: string
  status?: string
  percent?: number
  filename?: string
}

function ShaktiLoader({ title, status, percent, filename }: LoaderProps) {
  return (
    <div className={s.loader} data-lenis-prevent="true">
      <div className={s.loaderContent}>
        <div className={s.loaderInner}>
          <div className={s.loaderLineWrap}>
            <div className={s.loaderLine} />
          </div>
          <div className={s.loaderLineWrap}>
            <div className={s.loaderLine} />
          </div>
          <div className={s.loaderLineWrap}>
            <div className={s.loaderLine} />
          </div>
          <div className={s.loaderLineWrap}>
            <div className={s.loaderLine} />
          </div>
          <div className={s.loaderLineWrap}>
            <div className={s.loaderLine} />
          </div>
        </div>

        {title && <h3 className={s.loaderTitle}>{title}</h3>}
        {status && <div className={s.loaderStatus}>{status}</div>}

        {typeof percent === 'number' && (
          <div className={s.loaderProgressBar}>
            <div className={s.loaderProgressFill} style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
          </div>
        )}

        {filename && (
          <div className={s.loaderFilename}>
            <GoogleIcon name="photo_camera" size={14} style={{ color: '#DC143C' }} />
            <span>{filename}</span>
          </div>
        )}
      </div>
    </div>
  )
}

type Section = 'overview' | 'founder' | 'articles' | 'gallery' | 'courses' | 'testimonials' | 'counselling' | 'events' | 'dispatch'

export default function AdminDashboard() {
  const { user, adminProfile, signOut, isAdmin, isLoading } = useAuth()
  const navigate = useNavigate()
  const [section, setSection] = useState<Section>('overview')

  useEffect(() => {
    if (!isLoading && !user) navigate('/login')
  }, [isLoading, user, navigate])

  if (isLoading) return (
    <ShaktiLoader
      title="Initializing Shakti Sabha CMS"
      status="Verifying administrative access & credentials..."
    />
  )
  if (!user) return null

  const navItems: { key: Section; icon: string; label: string }[] = [
    { key: 'overview',    icon: 'analytics', label: 'Overview' },
    { key: 'founder',     icon: 'person', label: 'Founder & Info' },
    { key: 'articles',   icon: 'article', label: 'Articles' },
    { key: 'gallery',    icon: 'photo_library', label: 'Gallery' },
    { key: 'courses',    icon: 'school', label: 'Courses' },
    { key: 'testimonials', icon: 'format_quote', label: 'Testimonials' },
    { key: 'counselling',icon: 'forum', label: 'Counselling' },
    { key: 'events',       icon: 'event', label: 'Events & Calendar' },
    { key: 'dispatch',     icon: 'mark_email_read', label: 'The Shakti Dispatch' },
  ]

  const sectionTitles: Record<Section, string> = {
    overview: 'Dashboard Overview',
    founder: 'Founder Dossier & Core Philosophy CMS',
    articles: 'Article Management',
    gallery: 'Gallery Management',
    courses: 'Course Management',
    testimonials: 'Testimonial Management',
    counselling: 'Counselling Requests',
    events: 'Events & Calendar Management',
    dispatch: 'The Shakti Dispatch — Weekly Insights & Newsletter CMS',
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className={s.shell}>
      {/* ── Sidebar ── */}
      <aside className={s.sidebar}>
        <Link to="/" className={s.sidebarLogo}>
          <div className={s.logoIcon}>
            <GoogleIcon name="shield" size={24} style={{ color: '#DC143C' }} />
          </div>
          <div>
            <span className={s.logoText}>Shakti Sabha</span>
            <span className={s.logoSub}>Admin CMS</span>
          </div>
        </Link>

        <div className={s.navSection}>
          <div className={s.navLabel}>Content</div>
          {navItems.map(item => (
            <button
              key={item.key}
              className={`${s.navItem} ${section === item.key ? s.navItemActive : ''}`}
              onClick={() => setSection(item.key)}
            >
              <span className={s.navIcon}>
                <GoogleIcon name={item.icon} size={18} />
              </span>
              {item.label}
            </button>
          ))}
        </div>

        <div className={s.navSection}>
          <div className={s.navLabel}>Website</div>
          <a className={s.navItem} href="/" target="_blank" rel="noopener noreferrer">
            <span className={s.navIcon}>
              <GoogleIcon name="language" size={18} />
            </span>
            View Website
          </a>
        </div>

        <div className={s.sidebarBottom}>
          <div className={s.userCard}>
            <div className={s.userAvatar}>
              {(adminProfile?.full_name || user.email || 'A')[0].toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <span className={s.userName}>{adminProfile?.full_name || user.email}</span>
              <span className={s.userRole}>{adminProfile?.role || 'editor'}</span>
            </div>
          </div>
          <button className={s.logoutBtn} onClick={handleLogout}>
            <GoogleIcon name="logout" size={16} style={{ marginRight: 6 }} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className={s.main}>
        <div className={s.topBar}>
          <span className={s.topBarTitle}>{sectionTitles[section]}</span>
          <span className={s.topBarBadge}>{adminProfile?.role || 'Editor'}</span>
        </div>

        <div className={s.content}>
          {section === 'overview'    && <OverviewSection />}
          {section === 'founder'     && <FounderSection />}
          {section === 'articles'   && <ArticlesSection />}
          {section === 'gallery'    && <GallerySection />}
          {section === 'courses'    && <CoursesSection />}
          {section === 'testimonials' && <TestimonialsSection />}
          {section === 'counselling'&& <CounsellingSection />}
          {section === 'events'    && <EventsSection />}
          {section === 'dispatch'  && <DispatchSection />}
        </div>
      </main>
    </div>
  )
}

/* ============================================================
   OVERVIEW SECTION
   ============================================================ */
function OverviewSection() {
  const [counts, setCounts] = useState({ articles: 0, photos: 0, courses: 0, counselling: 0 })

  useEffect(() => {
    const load = async () => {
      const [a, p, c, r] = await Promise.all([
        supabase.from('articles').select('id', { count: 'exact', head: true }),
        supabase.from('gallery_photos').select('id', { count: 'exact', head: true }),
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('counselling_requests').select('id', { count: 'exact', head: true }),
      ])
      setCounts({
        articles: a.count ?? 0,
        photos: p.count ?? 0,
        courses: c.count ?? 0,
        counselling: r.count ?? 0,
      })
    }
    load()
  }, [])

  return (
    <>
      <div className={s.statsGrid}>
        <div className={s.statCard}>
          <div className={s.statValue}>{counts.articles}</div>
          <div className={s.statLabel}>Total Articles</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statValue}>{counts.photos}</div>
          <div className={s.statLabel}>Gallery Photos</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statValue}>{counts.courses}</div>
          <div className={s.statLabel}>Courses Published</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statValue}>{counts.counselling}</div>
          <div className={s.statLabel}>Counselling Requests</div>
        </div>
      </div>

      <div className={s.sectionHeader}>
        <span className={s.sectionTitle}>Quick Start Guide</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {[
          { icon: 'article', title: 'Write an Article', desc: 'Create bilingual content in Hindi & English with photos.', section: 'articles' },
          { icon: 'photo_library', title: 'Upload Photos', desc: 'Add gallery images organized by category.', section: 'gallery' },
          { icon: 'school', title: 'Create a Course', desc: 'Publish courses with pricing, syllabus & cover images.', section: 'courses' },
          { icon: 'forum', title: 'View Counselling Requests', desc: 'Review and respond to user counselling submissions.', section: 'counselling' },
        ].map(item => (
          <div key={item.title} style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.25rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <GoogleIcon name={item.icon} size={28} style={{ color: '#DC143C' }} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#F3F4F6', marginBottom: '0.35rem' }}>{item.title}</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ============================================================
   CANVAS 16:9 / 1:1 IMAGE CROP & DIMENSION HELPERS
   ============================================================ */
const cropImageTo16_9 = (imgSrc: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const targetW = 1200
      const targetH = 675
      const targetRatio = targetW / targetH
      const srcRatio = img.naturalWidth / img.naturalHeight

      let cropX = 0
      let cropY = 0
      let cropW = img.naturalWidth
      let cropH = img.naturalHeight

      if (srcRatio > targetRatio) {
        cropW = img.naturalHeight * targetRatio
        cropX = (img.naturalWidth - cropW) / 2
      } else {
        cropH = img.naturalWidth / targetRatio
        cropY = (img.naturalHeight - cropH) / 2
      }

      const canvas = document.createElement('canvas')
      canvas.width = targetW
      canvas.height = targetH
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(imgSrc)
        return
      }
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, targetW, targetH)
      resolve(canvas.toDataURL('image/jpeg', 0.88))
    }
    img.onerror = () => reject(new Error('Failed to load image for cropping'))
    img.src = imgSrc
  })
}

const cropImageTo1_1 = (imgSrc: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const targetSize = 500
      let cropSize = Math.min(img.naturalWidth, img.naturalHeight)
      let cropX = (img.naturalWidth - cropSize) / 2
      let cropY = (img.naturalHeight - cropSize) / 2

      const canvas = document.createElement('canvas')
      canvas.width = targetSize
      canvas.height = targetSize
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(imgSrc)
        return
      }
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, cropX, cropY, cropSize, cropSize, 0, 0, targetSize, targetSize)
      resolve(canvas.toDataURL('image/jpeg', 0.88))
    }
    img.onerror = () => reject(new Error('Failed to load image for cropping'))
    img.src = imgSrc
  })
}

const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    if (!url) {
      resolve({ width: 0, height: 0 })
      return
    }
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => resolve({ width: 0, height: 0 })
    img.src = url
  })
}

/* ============================================================
   INTERACTIVE MANUAL IMAGE CROPPER MODAL (16:9, 4:3, 1:1, 4:5)
   ============================================================ */
interface ManualCropperProps {
  imageSrc: string
  onClose: () => void
  onSaveCrop: (croppedDataUrl: string) => void
  defaultRatio?: number
  title?: string
}

function ManualImageCropperModal({ imageSrc, onClose, onSaveCrop, defaultRatio = 16 / 9, title = 'Manual Crop & Position Image' }: ManualCropperProps) {
  const [ratio, setRatio] = useState<number>(defaultRatio)
  const [zoom, setZoom] = useState<number>(1)
  const [offsetX, setOffsetX] = useState<number>(0)
  const [offsetY, setOffsetY] = useState<number>(0)
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setImgObj(img)
    img.onerror = () => {
      const fallbackImg = new Image()
      fallbackImg.onload = () => setImgObj(fallbackImg)
      fallbackImg.src = imageSrc
    }
    img.src = imageSrc
  }, [imageSrc])

  useEffect(() => {
    if (!imgObj || !canvasRef.current) return
    const canvas = canvasRef.current
    const previewW = 520
    const previewH = Math.round(previewW / ratio)
    canvas.width = previewW
    canvas.height = previewH

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, previewW, previewH)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    const srcRatio = imgObj.naturalWidth / imgObj.naturalHeight
    let baseW = imgObj.naturalWidth
    let baseH = imgObj.naturalHeight
    if (srcRatio > ratio) {
      baseW = imgObj.naturalHeight * ratio
    } else {
      baseH = imgObj.naturalWidth / ratio
    }

    const cropW = baseW / zoom
    const cropH = baseH / zoom
    const maxShiftX = (imgObj.naturalWidth - cropW) / 2
    const maxShiftY = (imgObj.naturalHeight - cropH) / 2

    const cropX = Math.max(0, Math.min(imgObj.naturalWidth - cropW, ((imgObj.naturalWidth - cropW) / 2) + (offsetX * maxShiftX)))
    const cropY = Math.max(0, Math.min(imgObj.naturalHeight - cropH, ((imgObj.naturalHeight - cropH) / 2) + (offsetY * maxShiftY)))

    ctx.drawImage(imgObj, cropX, cropY, cropW, cropH, 0, 0, previewW, previewH)

    // Rule of thirds guides
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(previewW / 3, 0)
    ctx.lineTo(previewW / 3, previewH)
    ctx.moveTo((previewW * 2) / 3, 0)
    ctx.lineTo((previewW * 2) / 3, previewH)
    ctx.moveTo(0, previewH / 3)
    ctx.lineTo(previewW, previewH / 3)
    ctx.moveTo(0, (previewH * 2) / 3)
    ctx.lineTo(previewW, (previewH * 2) / 3)
    ctx.stroke()
  }, [imgObj, zoom, offsetX, offsetY, ratio])

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current) return
    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y
    setDragStart({ x: e.clientX, y: e.clientY })

    const factor = 0.005 / Math.max(0.5, zoom)
    setOffsetX(prev => Math.max(-1, Math.min(1, prev - dx * factor)))
    setOffsetY(prev => Math.max(-1, Math.min(1, prev - dy * factor)))
  }

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(false)
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* ignore */ }
  }

  const handleApply = () => {
    if (!imgObj) return
    const targetW = ratio === 1 ? 800 : ratio === 4 / 3 ? 1000 : ratio === 4 / 5 ? 800 : 1200
    const targetH = Math.round(targetW / ratio)

    const offscreen = document.createElement('canvas')
    offscreen.width = targetW
    offscreen.height = targetH
    const ctx = offscreen.getContext('2d')
    if (!ctx) return

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    const srcRatio = imgObj.naturalWidth / imgObj.naturalHeight
    let baseW = imgObj.naturalWidth
    let baseH = imgObj.naturalHeight
    if (srcRatio > ratio) {
      baseW = imgObj.naturalHeight * ratio
    } else {
      baseH = imgObj.naturalWidth / ratio
    }

    const cropW = baseW / zoom
    const cropH = baseH / zoom
    const maxShiftX = (imgObj.naturalWidth - cropW) / 2
    const maxShiftY = (imgObj.naturalHeight - cropH) / 2

    const cropX = Math.max(0, Math.min(imgObj.naturalWidth - cropW, ((imgObj.naturalWidth - cropW) / 2) + (offsetX * maxShiftX)))
    const cropY = Math.max(0, Math.min(imgObj.naturalHeight - cropH, ((imgObj.naturalHeight - cropH) / 2) + (offsetY * maxShiftY)))

    ctx.drawImage(imgObj, cropX, cropY, cropW, cropH, 0, 0, targetW, targetH)
    const result = offscreen.toDataURL('image/jpeg', 0.92)
    onSaveCrop(result)
    onClose()
  }

  const targetDimLabel = ratio === 1 ? '800 × 800 px (1:1)' : ratio === 4 / 3 ? '1000 × 750 px (4:3)' : ratio === 4 / 5 ? '800 × 1000 px (4:5)' : '1200 × 675 px (16:9)'

  return (
    <div className={s.overlay} data-lenis-prevent="true" style={{ zIndex: 100000 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modal} data-lenis-prevent="true" style={{ maxWidth: 620, width: '95%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 className={s.modalTitle} style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GoogleIcon name="crop" size={20} style={{ color: '#D97706' }} /> {title}
            </h2>
            <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: '2px' }}>
              Drag the image to adjust framing, or use zoom and alignment presets
            </div>
          </div>
          <button className={s.modalClose} onClick={onClose}><GoogleIcon name="close" size={18} /></button>
        </div>

        {/* Aspect Ratio Selector */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: '#888' }}>Aspect Ratio:</span>
          {[
            { label: '16:9 Landscape', value: 16 / 9 },
            { label: '4:3 Standard', value: 4 / 3 },
            { label: '1:1 Square', value: 1 },
            { label: '4:5 Portrait', value: 4 / 5 }
          ].map(opt => (
            <button
              key={opt.label}
              type="button"
              onClick={() => {
                setRatio(opt.value)
                setOffsetX(0)
                setOffsetY(0)
              }}
              style={{
                padding: '0.25rem 0.65rem',
                fontSize: '0.75rem',
                borderRadius: 6,
                border: '1px solid',
                borderColor: Math.abs(ratio - opt.value) < 0.01 ? '#D97706' : 'rgba(255,255,255,0.15)',
                background: Math.abs(ratio - opt.value) < 0.01 ? 'rgba(217, 119, 6, 0.2)' : 'rgba(255,255,255,0.04)',
                color: Math.abs(ratio - opt.value) < 0.01 ? '#FBBF24' : '#ccc',
                cursor: 'pointer'
              }}
            >
              {opt.label}
            </button>
          ))}
          <span style={{ fontSize: '0.72rem', color: '#10B981', marginLeft: 'auto' }}>
            Output: {targetDimLabel}
          </span>
        </div>

        {/* Interactive Canvas Preview */}
        <div style={{ position: 'relative', background: '#0B0F19', borderRadius: 10, padding: 8, display: 'flex', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
          <canvas
            ref={canvasRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            style={{
              width: '100%',
              maxWidth: 520,
              borderRadius: 6,
              background: '#000',
              cursor: isDragging ? 'grabbing' : 'grab',
              display: 'block',
              touchAction: 'none'
            }}
          />
          <div style={{ position: 'absolute', bottom: 12, right: 16, background: 'rgba(0,0,0,0.65)', padding: '0.2rem 0.5rem', borderRadius: 4, fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', pointerEvents: 'none' }}>
            ✋ Drag to pan
          </div>
        </div>

        {/* Controls: Zoom & Position */}
        <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Zoom Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#888', minWidth: 60, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <GoogleIcon name="zoom_in" size={16} /> Zoom:
            </span>
            <button
              type="button"
              className={s.btnSecondary}
              style={{ padding: '0.15rem 0.5rem', fontSize: '0.75rem' }}
              onClick={() => setZoom(z => Math.max(1, Number((z - 0.1).toFixed(2))))}
            >
              -
            </button>
            <input
              type="range"
              min="1"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              style={{ flex: 1, accentColor: '#D97706', cursor: 'pointer' }}
            />
            <button
              type="button"
              className={s.btnSecondary}
              style={{ padding: '0.15rem 0.5rem', fontSize: '0.75rem' }}
              onClick={() => setZoom(z => Math.min(2.5, Number((z + 0.1).toFixed(2))))}
            >
              +
            </button>
            <span style={{ fontSize: '0.75rem', color: '#FBBF24', minWidth: 42, textAlign: 'right' }}>
              {zoom.toFixed(2)}x
            </span>
          </div>

          {/* Quick Position Presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: '#888' }}>Quick Align:</span>
            {[
              { label: '⬆ Top', ox: 0, oy: -1 },
              { label: '⏺ Center', ox: 0, oy: 0 },
              { label: '⬇ Bottom', ox: 0, oy: 1 },
              { label: '⬅ Left', ox: -1, oy: 0 },
              { label: '➡ Right', ox: 1, oy: 0 },
            ].map(p => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setOffsetX(p.ox)
                  setOffsetY(p.oy)
                }}
                style={{
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.72rem',
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#EEE',
                  cursor: 'pointer'
                }}
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setZoom(1)
                setOffsetX(0)
                setOffsetY(0)
              }}
              style={{
                padding: '0.2rem 0.55rem',
                fontSize: '0.72rem',
                borderRadius: 4,
                background: 'rgba(220, 20, 60, 0.15)',
                border: '1px solid rgba(220, 20, 60, 0.3)',
                color: '#FF8095',
                cursor: 'pointer',
                marginLeft: 'auto'
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Modal Actions */}
        <div className={s.modalActions} style={{ marginTop: '1.25rem' }}>
          <button type="button" className={s.btnSecondary} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={s.btnPrimary}
            style={{ background: '#D97706', borderColor: '#B45309', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            onClick={handleApply}
          >
            <GoogleIcon name="check" size={16} /> Apply & Save Crop
          </button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   ARTICLES SECTION
   ============================================================ */
function ArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Article | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [previewLang, setPreviewLang] = useState<'en' | 'hi'>('en')
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const defaultForm = {
    title_en: '', title_hi: '', content_en: '', content_hi: '',
    excerpt_en: '', excerpt_hi: '', cover_image_url: '', category: 'general',
    tags: '', author_name: '', published: false
  }
  const [form, setForm] = useState(defaultForm)
  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
    setArticles(data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm(defaultForm); setShowModal(true) }
  const openEdit = (a: Article) => {
    setEditing(a)
    setForm({
      title_en: a.title_en, title_hi: a.title_hi,
      content_en: a.content_en, content_hi: a.content_hi,
      excerpt_en: a.excerpt_en, excerpt_hi: a.excerpt_hi,
      cover_image_url: a.cover_image_url, category: a.category,
      tags: (a.tags || []).join(', '), author_name: a.author_name, published: a.published,
    })
    setShowModal(true)
  }

  const uploadImage = async (file: File) => {
    setUploading(true)
    try {
      const comp = await compressImage(file, { maxWidth: 1200, maxHeight: 800, quality: 0.8 })
      setForm(f => ({ ...f, cover_image_url: comp.dataUrl }))

      const ext = comp.file.name.split('.').pop()
      const path = `articles/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('media').upload(path, comp.file, { upsert: true })
      if (!error) {
        const { data } = supabase.storage.from('media').getPublicUrl(path)
        if (data?.publicUrl) {
          setForm(f => ({ ...f, cover_image_url: data.publicUrl }))
        }
      }
    } catch (err: any) {
      console.warn('Article image compression/upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const save = async () => {
    // ── Dual-Language Validation: Both English and Hindi are mandatory ──
    const missing: string[] = []
    if (!form.title_en?.trim()) missing.push('English Title')
    if (!form.content_en?.trim()) missing.push('English Content')
    if (!form.title_hi?.trim()) missing.push('Hindi Title (शीर्षक)')
    if (!form.content_hi?.trim()) missing.push('Hindi Content (सामग्री)')

    if (missing.length > 0) {
      const errorMsg = `Validation Alert: The website requires bilingual content. Missing: ${missing.join(', ')}. Please fill both English and Hindi tabs.`
      setAlert({
        type: 'error',
        msg: errorMsg
      })
      window.alert(errorMsg)
      return
    }

    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
    }
    let error
    if (editing) {
      ;({ error } = await supabase.from('articles').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing.id))
    } else {
      ;({ error } = await supabase.from('articles').insert([payload]))
    }
    if (error) { setAlert({ type: 'error', msg: error.message }) }
    else { setAlert({ type: 'success', msg: editing ? 'Article updated and published!' : 'Article created and published!' }); setShowModal(false); load() }
  }

  const del = async (id: string) => {
    if (!confirm('Delete this article?')) return
    await supabase.from('articles').delete().eq('id', id)
    load()
  }

  const togglePublish = async (a: Article) => {
    await supabase.from('articles').update({ published: !a.published }).eq('id', a.id)
    load()
  }

  return (
    <>
      {uploading && (
        <ShaktiLoader
          title="Uploading Article Image"
          status="Optimizing and uploading media to storage..."
        />
      )}
      {alert && <div className={`${s.alert} ${alert.type === 'error' ? s.alertError : s.alertSuccess}`}>{alert.msg}</div>}
      <div className={s.sectionHeader}>
        <span className={s.sectionTitle}>All Articles ({articles.length})</span>
        <button className={s.btnPrimary} onClick={openNew}>+ New Article</button>
      </div>

      <div className={s.tableWrap}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
        ) : articles.length === 0 ? (
          <div className={s.empty}>
            <div className={s.emptyIcon}>
              <GoogleIcon name="article" size={44} style={{ color: 'rgba(255,255,255,0.2)' }} />
            </div>
            <div className={s.emptyText}>No articles yet</div>
            <div className={s.emptyHint}>Click "New Article" to get started</div>
          </div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr><th>Title (EN)</th><th>Title (HI)</th><th>Category</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {articles.map(a => (
                <tr key={a.id}>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title_en || '—'}</td>
                  <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title_hi || '—'}</td>
                  <td><span className={`${s.badge} ${s.badgeGray}`}>{a.category}</span></td>
                  <td>
                    <span className={`${s.badge} ${a.published ? s.badgeGreen : s.badgeGray}`}>
                      {a.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                    {new Date(a.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button className={s.btnEdit} onClick={() => openEdit(a)}>Edit</button>
                      <button className={s.btnSecondary} style={{ fontSize: '0.75rem', padding: '0.35rem 0.7rem' }} onClick={() => togglePublish(a)}>
                        {a.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button className={s.btnDanger} onClick={() => del(a.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Article Modal */}
      {showModal && (
        <div className={s.overlay} data-lenis-prevent="true" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className={s.modal} data-lenis-prevent="true">
            <h2 className={s.modalTitle}>{editing ? 'Edit Article' : 'New Article'}</h2>
            <button className={s.modalClose} onClick={() => setShowModal(false)}><GoogleIcon name="close" size={18} /></button>

            {alert && (
              <div className={`${s.alert} ${alert.type === 'error' ? s.alertError : s.alertSuccess}`} style={{ marginBottom: '1rem' }}>
                {alert.msg}
              </div>
            )}

            <div className={s.tabs}>
              <LangTab />
            </div>

            <ArticleForm form={form} setForm={setForm} fileRef={fileRef} uploadImage={uploadImage} uploading={uploading} />

            <div className={s.modalActions}>
              <button type="button" className={s.btnSecondary} onClick={() => setShowPreview(true)}>
                <GoogleIcon name="visibility" size={16} /> Preview Article
              </button>
              <div style={{ flex: 1 }} />
              <button className={s.btnSecondary} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={s.btnPrimary} onClick={save}><GoogleIcon name="save" size={16} /> Save Article</button>
            </div>
          </div>
        </div>
      )}

      {/* ── LIVE ARTICLE WEBSITE PREVIEW MODAL ── */}
      {showPreview && (
        <div
          className={s.overlay}
          data-lenis-prevent="true"
          onClick={() => setShowPreview(false)}
          style={{ zIndex: 100000 }}
        >
          <div
            className={s.modal}
            data-lenis-prevent="true"
            style={{ maxWidth: 740, background: '#FFFFFF', color: '#1F2937', padding: '2rem 2.5rem' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: 20,
                    border: '1px solid',
                    borderColor: previewLang === 'en' ? '#DC143C' : '#D1D5DB',
                    background: previewLang === 'en' ? '#DC143C' : '#F3F4F6',
                    color: previewLang === 'en' ? '#FFFFFF' : '#374151',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  onClick={() => setPreviewLang('en')}
                >
                  English Preview
                </button>
                <button
                  type="button"
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: 20,
                    border: '1px solid',
                    borderColor: previewLang === 'hi' ? '#DC143C' : '#D1D5DB',
                    background: previewLang === 'hi' ? '#DC143C' : '#F3F4F6',
                    color: previewLang === 'hi' ? '#FFFFFF' : '#374151',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  onClick={() => setPreviewLang('hi')}
                >
                  हिंदी Preview
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowPreview(false)}
                style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: '0.72rem', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>
              ● {form.category.toUpperCase()} · {previewLang === 'hi' ? 'शक्ति सभा विशेष लेख' : 'Shakti Sabha Verified Article'}
            </div>

            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.75rem', color: '#111827', margin: '0 0 0.5rem', lineHeight: 1.3 }}>
              {previewLang === 'hi' ? (form.title_hi || 'हिंदी शीर्षक यहाँ दिखेगा') : (form.title_en || 'English Title will appear here')}
            </h1>

            {previewLang === 'en' && form.title_hi && (
              <div style={{ color: '#DC143C', fontSize: '1rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                {form.title_hi}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#6B7280', marginBottom: '1.25rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.85rem' }}>
              <span>✍ {form.author_name || 'Shakti Sabha Editorial'}</span>
              <span>📅 {new Date().toLocaleDateString('en-IN')}</span>
              <span>✦ Status: {form.published ? 'Published' : 'Draft'}</span>
            </div>

            {form.cover_image_url && (
              <img
                src={form.cover_image_url}
                alt="Cover Preview"
                style={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: 12, marginBottom: '1.5rem' }}
              />
            )}

            {(previewLang === 'hi' ? form.excerpt_hi : form.excerpt_en) && (
              <div style={{ background: '#FFF5F5', borderLeft: '4px solid #DC143C', padding: '1rem 1.25rem', borderRadius: '0 8px 8px 0', fontSize: '0.92rem', color: '#374151', lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic' }}>
                {previewLang === 'hi' ? form.excerpt_hi : form.excerpt_en}
              </div>
            )}

            <div style={{ fontSize: '0.94rem', color: '#374151', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>
              {previewLang === 'hi' ? (form.content_hi || 'हिंदी सामग्री यहाँ प्रदर्शित होगी...') : (form.content_en || 'Full English article text will be rendered here...')}
            </div>

            {form.tags && (
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {form.tags.split(',').map((t: string, ti: number) => (
                  <span key={ti} style={{ background: '#F3F4F6', color: '#4B5563', padding: '0.2rem 0.6rem', borderRadius: 6, fontSize: '0.75rem' }}>
                    #{t.trim()}
                  </span>
                ))}
              </div>
            )}

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className={s.btnPrimary}
                onClick={() => setShowPreview(false)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function LangTab() {
  return null // tabs handled inside ArticleForm
}

function ArticleForm({ form, setForm, fileRef, uploadImage, uploading }: {
  form: any; setForm: any;
  fileRef: any;
  uploadImage: (f: File) => void;
  uploading: boolean;
}) {
  const [articleCropModal, setArticleCropModal] = useState(false)
  const [lang, setLang] = useState<'en' | 'hi'>('en')

  return (
    <>
      <div className={s.tabs}>
        <button className={`${s.tab} ${lang === 'en' ? s.tabActive : ''}`} onClick={() => setLang('en')}><GoogleIcon name="language" size={16} /> English</button>
        <button className={`${s.tab} ${lang === 'hi' ? s.tabActive : ''}`} onClick={() => setLang('hi')}><GoogleIcon name="translate" size={16} /> Hindi</button>
      </div>

      <div className={s.formGrid}>
        {lang === 'en' ? (
          <>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Title (English)</label>
              <input className={s.input} value={form.title_en} onChange={e => setForm((f: any) => ({ ...f, title_en: e.target.value }))} placeholder="Article title in English" />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Excerpt / Summary (English)</label>
              <textarea className={s.textarea} style={{ minHeight: 80 }} value={form.excerpt_en} onChange={e => setForm((f: any) => ({ ...f, excerpt_en: e.target.value }))} placeholder="Short description for article cards" />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Full Content (English)</label>
              <textarea className={s.textarea} value={form.content_en} onChange={e => setForm((f: any) => ({ ...f, content_en: e.target.value }))} placeholder="Full article content in English..." />
            </div>
          </>
        ) : (
          <>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>शीर्षक (Hindi Title)</label>
              <input className={s.input} value={form.title_hi} onChange={e => setForm((f: any) => ({ ...f, title_hi: e.target.value }))} placeholder="हिंदी में शीर्षक" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }} />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>संक्षेप (Hindi Excerpt)</label>
              <textarea className={s.textarea} style={{ minHeight: 80, fontFamily: 'Noto Sans Devanagari, sans-serif' }} value={form.excerpt_hi} onChange={e => setForm((f: any) => ({ ...f, excerpt_hi: e.target.value }))} placeholder="संक्षिप्त विवरण..." />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>पूर्ण सामग्री (Hindi Content)</label>
              <textarea className={s.textarea} value={form.content_hi} onChange={e => setForm((f: any) => ({ ...f, content_hi: e.target.value }))} placeholder="हिंदी में पूर्ण लेख..." style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }} />
            </div>
          </>
        )}

        <div className={s.field}>
          <label className={s.label}>Category</label>
          <select className={s.select} value={form.category} onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))}>
            <option value="general">General</option>
            <option value="self-defense">Self Defense</option>
            <option value="empowerment">Empowerment</option>
            <option value="legal">Legal Rights</option>
            <option value="health">Health & Wellness</option>
            <option value="success-stories">Success Stories</option>
            <option value="research">Research</option>
          </select>
        </div>

        <div className={s.field}>
          <label className={s.label}>Author Name</label>
          <input className={s.input} value={form.author_name} onChange={e => setForm((f: any) => ({ ...f, author_name: e.target.value }))} placeholder="Author's name" />
        </div>

        <div className={`${s.field} ${s.formFull}`}>
          <label className={s.label}>Tags (comma separated)</label>
          <input className={s.input} value={form.tags} onChange={e => setForm((f: any) => ({ ...f, tags: e.target.value }))} placeholder="women, empowerment, self-defense" />
        </div>

        <div className={`${s.field} ${s.formFull}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.4rem' }}>
            <label className={s.label} style={{ margin: 0 }}>Cover Image</label>
            <span style={{ fontSize: '0.75rem', color: '#C9A96E', background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.3)', padding: '0.15rem 0.55rem', borderRadius: 6, fontWeight: 600 }}>
              Aspect Ratio: 16:9 Landscape (1200 × 675 px) • Max 2MB
            </span>
          </div>

          {form.cover_image_url ? (
            <div style={{
              position: 'relative',
              borderRadius: 12,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(0,0,0,0.5)',
              marginBottom: '0.85rem',
              maxWidth: 580
            }}>
              <div style={{ position: 'relative', width: '100%', height: 210, background: '#111' }}>
                <img
                  src={form.cover_image_url}
                  alt="Article Cover Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>

              {/* Action Toolbar */}
              <div style={{
                display: 'flex',
                gap: '0.6rem',
                padding: '0.75rem 1rem',
                background: 'rgba(20, 24, 33, 0.95)',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  type="button"
                  className={s.btnPrimary}
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#D97706', borderColor: '#B45309' }}
                  onClick={() => setArticleCropModal(true)}
                  title="Open interactive manual crop to adjust frame & zoom"
                >
                  <GoogleIcon name="crop" size={15} /> ✂️ Manual Crop
                </button>

                <button
                  type="button"
                  className={s.btnSecondary}
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  onClick={async () => {
                    try {
                      const cropped = await cropImageTo16_9(form.cover_image_url)
                      setForm((f: any) => ({ ...f, cover_image_url: cropped }))
                    } catch (e) {
                      console.error('Article image crop failed', e)
                    }
                  }}
                  title="Auto crop center to 16:9"
                >
                  <GoogleIcon name="auto_fix_high" size={15} /> ⚡ Auto-Crop 16:9
                </button>

                <button
                  type="button"
                  className={s.btnSecondary}
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  onClick={() => fileRef.current?.click()}
                  title="Upload a new cover image"
                >
                  <GoogleIcon name="cached" size={15} /> Replace Cover
                </button>

                <button
                  type="button"
                  className={s.btnDanger}
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px', marginLeft: 'auto' }}
                  onClick={() => {
                    if (confirm('Delete current article cover image?')) {
                      setForm((f: any) => ({ ...f, cover_image_url: '' }))
                    }
                  }}
                  title="Delete cover image"
                >
                  <GoogleIcon name="delete" size={15} /> Delete Cover
                </button>
              </div>

              {articleCropModal && (
                <ManualImageCropperModal
                  imageSrc={form.cover_image_url}
                  title="Manual Crop Article Cover"
                  defaultRatio={16 / 9}
                  onClose={() => setArticleCropModal(false)}
                  onSaveCrop={(cropped) => setForm((f: any) => ({ ...f, cover_image_url: cropped }))}
                />
              )}
            </div>
          ) : (
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>
              No cover image selected. Upload an image file or paste an image URL below.
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])}
          />
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button type="button" className={s.btnSecondary} onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? 'Uploading...' : <><GoogleIcon name="upload_file" size={16} style={{ marginRight: 6 }} /> Choose Cover Image</>}
            </button>
            <input
              className={s.input}
              style={{ flex: 1, minWidth: 220 }}
              value={form.cover_image_url || ''}
              onChange={e => setForm((f: any) => ({ ...f, cover_image_url: e.target.value }))}
              placeholder="Or enter image URL directly"
            />
          </div>
        </div>

        <div className={s.field}>
          <label className={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.published} onChange={e => setForm((f: any) => ({ ...f, published: e.target.checked }))} />
            Publish immediately
          </label>
        </div>
      </div>
    </>
  )
}

/* ============================================================
   GALLERY SECTION
   ============================================================ */
function GallerySection() {
  const [categories, setCategories] = useState<GalleryCategoryItem[]>([])
  const [photos, setPhotos] = useState<GalleryPhotoItem[]>([])
  const [allPhotosCount, setAllPhotosCount] = useState<Record<string, number>>({})
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [showCatModal, setShowCatModal] = useState(false)
  const [catForm, setCatForm] = useState({ name: '', description: '' })
  const [uploading, setUploading] = useState(false)
  const [directUrl, setDirectUrl] = useState('')
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const [catPreviews, setCatPreviews] = useState<Record<string, string[]>>({})
  const [folderSearch, setFolderSearch] = useState('')
  const [photoSearch, setPhotoSearch] = useState('')

  // ── Multi-Folder Select, Rename & Merge State ──
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([])
  const [renameModal, setRenameModal] = useState<{ id: string; name: string } | null>(null)
  const [mergeModal, setMergeModal] = useState<boolean>(false)
  const [mergeTargetId, setMergeTargetId] = useState<string>('')
  const [mergeNewName, setMergeNewName] = useState<string>('')

  // ── Staged Photo Upload Confirmation State ──
  const [stagedFiles, setStagedFiles] = useState<File[]>([])
  const [stagedPreviews, setStagedPreviews] = useState<{ name: string; size: string; url: string }[]>([])
  const [showUploadConfirm, setShowUploadConfirm] = useState(false)

  // ── Multi-Photo Select & Bulk Delete State ──
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([])

  const loadCats = async () => {
    try {
      const cats = await fetchCategories()
      setCategories(cats)

      const all = await fetchAllPhotos(true)
      const counts: Record<string, number> = {}
      const previews: Record<string, string[]> = {}

      all.forEach(p => {
        counts[p.category_id] = (counts[p.category_id] || 0) + 1
        if (!previews[p.category_id]) previews[p.category_id] = []
        if (previews[p.category_id].length < 3) previews[p.category_id].push(p.url)
      })

      setAllPhotosCount(counts)
      setCatPreviews(previews)
    } catch (e) {
      console.warn('loadCats error:', e)
    }
  }

  const loadPhotos = async (catId: string) => {
    try {
      const list = await fetchPhotosForCategory(catId)
      setPhotos(list)
      setSelectedPhotoIds([])
    } catch (e) {
      console.warn('loadPhotos error:', e)
    }
  }

  useEffect(() => { loadCats() }, [])
  useEffect(() => {
    if (selectedCat) {
      loadPhotos(selectedCat)
    } else {
      setPhotos([])
      setSelectedPhotoIds([])
    }
  }, [selectedCat])

  const createCategory = async () => {
    if (!catForm.name.trim()) return
    try {
      const created = await saveCategory(catForm)
      setAlert({ type: 'success', msg: `Folder "${created.name}" created successfully! Click upload below to stage photos.` })
      setShowCatModal(false)
      setCatForm({ name: '', description: '' })
      setSelectedCat(created.id)
      await loadCats()
    } catch (err: any) {
      setAlert({ type: 'error', msg: err?.message || 'Failed to create folder' })
    }
  }

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete folder "${name}" and all its photos?`)) return
    try {
      await deleteGalleryCategory(id)
      setAlert({ type: 'success', msg: `Folder "${name}" deleted.` })
      const remaining = categories.filter(c => c.id !== id)
      setCategories(remaining)
      if (selectedCat === id) setSelectedCat(null)
      setSelectedFolderIds(prev => prev.filter(fId => fId !== id))
      await loadCats()
    } catch (err: any) {
      setAlert({ type: 'error', msg: err?.message || 'Failed to delete folder' })
    }
  }

  // ── Multi-Folder Bulk Delete ──
  const handleBulkDeleteFolders = async () => {
    if (selectedFolderIds.length === 0) return
    const count = selectedFolderIds.length
    if (!confirm(`Are you sure you want to permanently delete ${count} selected folder(s) and all their photos?`)) return

    try {
      for (const id of selectedFolderIds) {
        await deleteGalleryCategory(id)
      }
      setAlert({ type: 'success', msg: `Successfully deleted ${count} folder(s).` })
      setSelectedFolderIds([])
      if (selectedCat && selectedFolderIds.includes(selectedCat)) {
        setSelectedCat(null)
      }
      await loadCats()
    } catch (err: any) {
      setAlert({ type: 'error', msg: err?.message || 'Failed to delete selected folders' })
    }
  }

  // ── Folder Rename ──
  const handleRenameFolder = async () => {
    if (!renameModal || !renameModal.name.trim()) return
    const newName = renameModal.name.trim()
    try {
      await renameGalleryCategory(renameModal.id, newName)
      setAlert({ type: 'success', msg: `Folder renamed to "${newName}".` })
      setRenameModal(null)
      await loadCats()
    } catch (err: any) {
      setAlert({ type: 'error', msg: 'Failed to rename folder' })
    }
  }

  // ── Merge Multiple Folders ──
  const handleMergeFolders = async () => {
    if (!mergeTargetId || selectedFolderIds.length < 2) return
    const targetCat = categories.find(c => c.id === mergeTargetId)
    if (!targetCat) return

    const sourceIds = selectedFolderIds.filter(id => id !== mergeTargetId)
    const finalName = (mergeNewName.trim() || targetCat.name).trim()
    if (!confirm(`Merge ${sourceIds.length} folder(s) into "${finalName}"? All photos will be migrated into this folder in the database and source folders will be permanently deleted.`)) return

    try {
      await mergeGalleryCategories(sourceIds, mergeTargetId, finalName)

      setAlert({ type: 'success', msg: `Successfully merged and renamed folder "${finalName}" in database!` })
      setSelectedFolderIds([])
      setMergeModal(false)
      setSelectedCat(mergeTargetId)
      await loadCats()
      await loadPhotos(mergeTargetId)
    } catch (err: any) {
      setAlert({ type: 'error', msg: 'Failed to merge folders: ' + (err?.message || err) })
    }
  }

  // ── File Selection Staging (Confirmation Before Database Upload) ──
  const handleStageFiles = (files: FileList) => {
    if (!selectedCat) {
      setAlert({ type: 'error', msg: 'Please select a folder first' })
      return
    }
    const fileList = Array.from(files)
    if (fileList.length === 0) return

    setStagedFiles(fileList)
    const previews = fileList.map(f => ({
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
      url: URL.createObjectURL(f)
    }))
    setStagedPreviews(previews)
    setShowUploadConfirm(true)
  }

  const cancelStagedUpload = () => {
    stagedPreviews.forEach(p => URL.revokeObjectURL(p.url))
    setStagedFiles([])
    setStagedPreviews([])
    setShowUploadConfirm(false)
  }

  const [uploadProgress, setUploadProgress] = useState<{
    active: boolean
    current: number
    total: number
    percent: number
    currentFile: string
  }>({ active: false, current: 0, total: 0, percent: 0, currentFile: '' })

  // ── Confirmed Upload to Database & Storage ──
  const confirmAndUploadStagedPhotos = async () => {
    if (!selectedCat || stagedFiles.length === 0) return
    const fileList = stagedFiles
    setShowUploadConfirm(false)

    setUploading(true)
    setUploadProgress({
      active: true,
      current: 0,
      total: fileList.length,
      percent: 0,
      currentFile: fileList[0].name
    })

    let uploadedCount = 0
    const newItems: GalleryPhotoItem[] = []
    const BATCH_SIZE = 3

    for (let i = 0; i < fileList.length; i += BATCH_SIZE) {
      const batch = fileList.slice(i, i + BATCH_SIZE)

      await Promise.all(
        batch.map(async (file, batchIdx) => {
          const index = i + batchIdx
          let photoUrl = ''
          let uploadFile = file

          try {
            const comp = await compressImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.8 })
            uploadFile = comp.file
            photoUrl = comp.dataUrl
          } catch (compErr) {
            console.warn('Compression fallback:', compErr)
          }

          try {
            const ext = uploadFile.name.split('.').pop()
            const path = `gallery/${selectedCat}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
            const { error: upErr } = await supabase.storage.from('media').upload(path, uploadFile, { upsert: true })
            if (!upErr) {
              const { data } = supabase.storage.from('media').getPublicUrl(path)
              if (data?.publicUrl) {
                photoUrl = data.publicUrl
              }
            }
          } catch (err) {
            console.warn('Supabase storage upload error:', err)
          }

          if (photoUrl) {
            let realId = `photo_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 6)}`
            try {
              const { data: insertedData } = await supabase.from('gallery_photos').insert([{
                url: photoUrl,
                caption: file.name.replace(/\.[^/.]+$/, ''),
                category_id: selectedCat
              }]).select()
              if (insertedData?.[0]?.id) realId = insertedData[0].id
            } catch (dbErr) {
              console.warn('DB insert error:', dbErr)
            }

            try {
              await api.createGalleryPhoto({
                id: realId,
                url: photoUrl,
                caption: file.name.replace(/\.[^/.]+$/, ''),
                category_id: selectedCat,
              })
            } catch (apiErr) {
              console.warn('API createGalleryPhoto fallback:', apiErr)
            }

            const item: GalleryPhotoItem = {
              id: realId,
              url: photoUrl,
              caption: file.name.replace(/\.[^/.]+$/, ''),
              category_id: selectedCat,
              created_at: new Date().toISOString()
            }
            newItems.push(item)
            uploadedCount++
          }

          const currentDone = Math.min(uploadedCount, fileList.length)
          setUploadProgress({
            active: true,
            current: currentDone,
            total: fileList.length,
            percent: Math.round((currentDone / fileList.length) * 100),
            currentFile: file.name
          })
        })
      )
    }

    if (newItems.length > 0) {
      saveUploadedPhotos(newItems, selectedCat)
    }

    stagedPreviews.forEach(p => URL.revokeObjectURL(p.url))
    setStagedFiles([])
    setStagedPreviews([])
    setUploadProgress({ active: false, current: fileList.length, total: fileList.length, percent: 100, currentFile: '' })
    setUploading(false)
    setAlert({ type: 'success', msg: `Confirmed and saved ${uploadedCount} photo(s) into database successfully!` })
    await loadPhotos(selectedCat)
    await loadCats()
  }

  const handleAddDirectUrl = async () => {
    if (!directUrl.trim() || !selectedCat) return
    const caption = `Uploaded Photo - ${new Date().toLocaleDateString()}`
    let realId = `photo_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`

    try {
      const { data: insertedData } = await supabase.from('gallery_photos').insert([{
        url: directUrl.trim(),
        caption,
        category_id: selectedCat
      }]).select()
      if (insertedData?.[0]?.id) realId = insertedData[0].id
    } catch (e) { /* ignore */ }

    try {
      await api.createGalleryPhoto({
        id: realId,
        url: directUrl.trim(),
        caption,
        category_id: selectedCat,
      })
    } catch (apiErr) { /* ignore */ }

    const item: GalleryPhotoItem = {
      id: realId,
      url: directUrl.trim(),
      caption,
      category_id: selectedCat,
      created_at: new Date().toISOString()
    }

    saveUploadedPhotos([item], selectedCat)
    setDirectUrl('')
    setAlert({ type: 'success', msg: 'Photo URL added to database folder successfully!' })
    await loadPhotos(selectedCat)
    await loadCats()
  }

  const handleDeletePhoto = async (id: string, url?: string) => {
    if (!confirm('Permanently delete this photo from the database?')) return
    // Optimistic UI update: immediately remove from current view
    setPhotos(prev => prev.filter(p => p.id !== id && (!url || p.url !== url)))
    try {
      await deleteStoredPhoto(id, selectedCat || undefined, url)
      setAlert({ type: 'success', msg: 'Photo permanently deleted from database.' })
    } catch (err: any) {
      setAlert({ type: 'error', msg: 'Failed to delete photo: ' + (err?.message || err) })
    }
    if (selectedCat) await loadPhotos(selectedCat)
    await loadCats()
  }

  // ── Multi-Photo Bulk Delete ──
  const handleBulkDeletePhotos = async () => {
    if (selectedPhotoIds.length === 0 || !selectedCat) return
    const count = selectedPhotoIds.length
    if (!confirm(`Are you sure you want to permanently delete ${count} selected photo(s) from the database?`)) return

    const photosToDelete = photos.filter(p => selectedPhotoIds.includes(p.id))
    // Optimistic UI update: immediately remove from view
    setPhotos(prev => prev.filter(p => !selectedPhotoIds.includes(p.id)))
    setSelectedPhotoIds([])

    try {
      for (const p of photosToDelete) {
        await deleteStoredPhoto(p.id, selectedCat, p.url)
      }
      setAlert({ type: 'success', msg: `Successfully deleted ${count} photo(s) from database.` })
    } catch (err: any) {
      setAlert({ type: 'error', msg: 'Failed to delete selected photos' })
    }
    await loadPhotos(selectedCat)
    await loadCats()
  }

  const currentCatObj = categories.find(c => c.id === selectedCat)
  const totalPhotosAll = Object.values(allPhotosCount).reduce((a, b) => a + b, 0)
  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(folderSearch.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(folderSearch.toLowerCase()))
  )

  return (
    <>
      {uploadProgress.active && (
        <ShaktiLoader
          title="Uploading Folder Photos"
          status={`Uploaded ${uploadProgress.current} of ${uploadProgress.total} photos (${uploadProgress.percent}%)`}
          percent={uploadProgress.percent}
          filename={uploadProgress.currentFile}
        />
      )}
      {alert && <div className={`${s.alert} ${alert.type === 'error' ? s.alertError : s.alertSuccess}`}>{alert.msg}</div>}

      <div style={{ background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <GoogleIcon name="auto_awesome" size={24} style={{ color: '#C9A96E', flexShrink: 0 }} />
        <div style={{ fontSize: '0.86rem', color: '#b8a882', lineHeight: 1.5 }}>
          <strong>Dynamic Website Image Engine:</strong> Photos saved into these folders dynamically power all site sections (Mission Mardini, Shakti Bhava, Shakti Varta, Profile &amp; Dome Gallery), replacing stock photos with your authentic field documentation!
        </div>
      </div>

      {/* ── BREADCRUMB BAR ── */}
      <div className={s.folderBreadcrumb}>
        <button
          type="button"
          onClick={() => { setSelectedCat(null); setSelectedFolderIds([]) }}
          className={s.breadcrumbLink}
          title="Go to root gallery directory"
        >
          <GoogleIcon name="folder_open" size={18} />
          <span>Gallery Root</span>
        </button>

        {selectedCat && currentCatObj && (
          <>
            <span className={s.breadcrumbSeparator}>›</span>
            <span className={s.breadcrumbCurrent}>
              <GoogleIcon name="folder" size={18} style={{ color: '#DC143C' }} />
              <span>{currentCatObj.name}</span>
              <span className={s.folderCountBadge}>
                {allPhotosCount[currentCatObj.id] || 0} photos
              </span>
            </span>

            {/* Quick folder switch selector */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>Jump to:</span>
              <select
                className={s.select}
                style={{ padding: '0.35rem 2rem 0.35rem 0.75rem', fontSize: '0.8rem', width: 'auto', minWidth: 160 }}
                value={selectedCat}
                onChange={e => setSelectedCat(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    📁 {c.name} ({allPhotosCount[c.id] || 0})
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      {/* ============================================================
          VIEW 1: FOLDERS DIRECTORY VIEW (When no folder is opened)
          ============================================================ */}
      {!selectedCat && (
        <>
          <div className={s.sectionHeader}>
            <div>
              <span className={s.sectionTitle}>
                Photo Folders ({categories.length})
              </span>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: '#888' }}>
                Organized gallery collections • Total {totalPhotosAll} authentic photos uploaded
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                className={s.input}
                style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem', width: 200 }}
                placeholder="Search folders..."
                value={folderSearch}
                onChange={e => setFolderSearch(e.target.value)}
              />
              <button className={s.btnPrimary} onClick={() => setShowCatModal(true)}>
                <GoogleIcon name="create_new_folder" size={18} /> New Folder
              </button>
            </div>
          </div>

          {/* ── MULTI-FOLDER ACTION TOOLBAR ── */}
          {selectedFolderIds.length > 0 && (
            <div style={{ background: '#1A1A22', border: '1px solid #DC143C', borderRadius: 12, padding: '0.85rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontWeight: 700, color: '#F9FAFB', fontSize: '0.9rem' }}>
                  ✓ {selectedFolderIds.length} folder(s) selected
                </span>
                <button
                  type="button"
                  className={s.btnSecondary}
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                  onClick={() => setSelectedFolderIds([])}
                >
                  Deselect All
                </button>
                <button
                  type="button"
                  className={s.btnSecondary}
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                  onClick={() => setSelectedFolderIds(filteredCategories.map(c => c.id))}
                >
                  Select All
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                {selectedFolderIds.length === 1 && (
                  <button
                    type="button"
                    className={s.btnSecondary}
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    onClick={() => {
                      const target = categories.find(c => c.id === selectedFolderIds[0])
                      if (target) setRenameModal({ id: target.id, name: target.name })
                    }}
                  >
                    <GoogleIcon name="edit" size={16} /> Rename Folder
                  </button>
                )}

                {selectedFolderIds.length >= 2 && (
                  <button
                    type="button"
                    className={s.btnSecondary}
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    onClick={() => {
                      const initTid = selectedFolderIds[0]
                      setMergeTargetId(initTid)
                      const initCat = categories.find(c => c.id === initTid)
                      setMergeNewName(initCat ? initCat.name : '')
                      setMergeModal(true)
                    }}
                  >
                    <GoogleIcon name="merge" size={16} /> Merge Folders ({selectedFolderIds.length})
                  </button>
                )}

                <button
                  type="button"
                  className={s.btnDanger}
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  onClick={handleBulkDeleteFolders}
                >
                  <GoogleIcon name="delete" size={16} /> Delete Selected Folders ({selectedFolderIds.length})
                </button>
              </div>
            </div>
          )}

          {/* Grid of Folder Cards */}
          <div className={s.foldersGrid}>
            {filteredCategories.map(cat => {
              const count = allPhotosCount[cat.id] || 0
              const previews = catPreviews[cat.id] || []
              const isSelected = selectedFolderIds.includes(cat.id)

              return (
                <div
                  key={cat.id}
                  className={s.folderCard}
                  style={{
                    position: 'relative',
                    borderColor: isSelected ? '#DC143C' : undefined,
                    boxShadow: isSelected ? '0 0 0 2px #DC143C' : undefined
                  }}
                  onClick={() => setSelectedCat(cat.id)}
                >
                  {/* Folder Checkbox */}
                  <div
                    style={{ position: 'absolute', top: 12, right: 12, zIndex: 5 }}
                    onClick={e => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={e => {
                        if (e.target.checked) setSelectedFolderIds(prev => [...prev, cat.id])
                        else setSelectedFolderIds(prev => prev.filter(fId => fId !== cat.id))
                      }}
                      style={{ width: 18, height: 18, accentColor: '#DC143C', cursor: 'pointer' }}
                      title="Select folder for bulk actions"
                    />
                  </div>

                  <div className={s.folderCardHeader}>
                    <div className={s.folderIconBadge}>
                      <GoogleIcon name="folder" size={28} />
                    </div>
                    <span className={s.folderCountBadge} style={{ marginRight: 24 }}>
                      {count} {count === 1 ? 'photo' : 'photos'}
                    </span>
                  </div>

                  <h3 className={s.folderTitle}>{cat.name}</h3>
                  <p className={s.folderDesc}>
                    {cat.description || 'Collection of verified field photographs and training documentation.'}
                  </p>

                  {/* 3-Thumbnail Preview Collage */}
                  <div className={s.folderPreviewCollage}>
                    {previews.length > 0 ? (
                      previews.map((imgUrl, pIdx) => (
                        <img
                          key={pIdx}
                          src={imgUrl}
                          alt="preview"
                          className={s.folderThumbMini}
                          loading="lazy"
                        />
                      ))
                    ) : (
                      <div className={s.folderEmptyPreview}>
                        <GoogleIcon name="photo_camera" size={16} />
                        <span>No photos yet</span>
                      </div>
                    )}
                  </div>

                  <div className={s.folderFooter}>
                    <span className={s.folderOpenBtn}>
                      Open Folder <GoogleIcon name="arrow_forward" size={14} />
                    </span>
                    <button
                      type="button"
                      className={s.folderDeleteBtn}
                      title={`Delete ${cat.name}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteCategory(cat.id, cat.name)
                      }}
                    >
                      <GoogleIcon name="delete" size={16} />
                    </button>
                  </div>
                </div>
              )
            })}

            {/* "+ Create New Folder" Action Card */}
            <div
              className={s.newFolderCard}
              onClick={() => setShowCatModal(true)}
            >
              <div className={s.newFolderIcon}>
                <GoogleIcon name="add" size={28} />
              </div>
              <div className={s.newFolderTitle}>Create New Folder</div>
              <div className={s.newFolderHint}>
                Add a new photo category for upcoming camps, seminars, or field drives
              </div>
            </div>
          </div>
        </>
      )}

      {/* ============================================================
          VIEW 2: INSIDE FOLDER VIEW (Uploads & Photo Grid)
          ============================================================ */}
      {selectedCat && currentCatObj && (
        <div style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.5rem', marginBottom: '2rem' }}>
          {/* Folder Action Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedCat(null)}
                  className={s.btnSecondary}
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                >
                  <GoogleIcon name="arrow_back" size={16} /> Back to Folders
                </button>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#F9FAFB', fontFamily: "'Cinzel', serif", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GoogleIcon name="folder_open" size={24} style={{ color: '#DC143C' }} />
                  {currentCatObj.name}
                </h3>
              </div>
              {currentCatObj.description && (
                <p style={{ margin: '0.4rem 0 0', fontSize: '0.84rem', color: '#9CA3AF' }}>{currentCatObj.description}</p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button className={s.btnPrimary} onClick={() => fileRef.current?.click()} disabled={uploading}>
                <GoogleIcon name="add_a_photo" size={18} /> Choose Photos to Upload
              </button>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={e => e.target.files && handleStageFiles(e.target.files)}
          />

          {/* Drag & Drop / Click Zone */}
          <div
            className={s.uploadZone}
            style={{ marginBottom: '1.5rem', cursor: 'pointer' }}
            onClick={() => fileRef.current?.click()}
          >
            <div className={s.uploadIcon}><GoogleIcon name="cloud_upload" size={32} style={{ color: '#DC143C' }} /></div>
            <div className={s.uploadText}>{uploading ? 'Processing & Compressing...' : `Click to Select Photos for "${currentCatObj.name}"`}</div>
            <div className={s.uploadHint}>Select multiple files • Requires confirmation before saving to database</div>
            <div style={{ marginTop: '0.5rem', display: 'inline-block', fontSize: '0.75rem', color: '#C9A96E', background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.3)', padding: '0.2rem 0.65rem', borderRadius: 6, fontWeight: 600 }}>
              Guidance: 16:9 / 4:3 Landscape or 3:4 Portrait • Max 5MB per photo
            </div>
          </div>

          {/* Quick Direct URL Form */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              className={s.input}
              placeholder="Or paste external image URL directly into this folder..."
              value={directUrl}
              onChange={e => setDirectUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddDirectUrl()}
            />
            <button className={s.btnSecondary} onClick={handleAddDirectUrl} disabled={!directUrl.trim()}>
              <GoogleIcon name="link" size={16} /> Add URL
            </button>
          </div>

          {/* ── PHOTO SELECTION TOOLBAR ── */}
          <div className={s.sectionHeader}>
            <div>
              <span className={s.sectionTitle}>
                Photos in this Folder ({photos.length})
              </span>
              {photos.length > 0 && (
                <span style={{ fontSize: '0.8rem', color: '#888', marginLeft: '0.75rem' }}>
                  {selectedPhotoIds.length > 0 ? `(${selectedPhotoIds.length} selected)` : 'Select photos below for bulk operations'}
                </span>
              )}
            </div>

            {photos.length > 0 && (
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={s.btnSecondary}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                  onClick={() => {
                    if (selectedPhotoIds.length === photos.length) setSelectedPhotoIds([])
                    else setSelectedPhotoIds(photos.map(p => p.id))
                  }}
                >
                  {selectedPhotoIds.length === photos.length ? 'Deselect All' : 'Select All'}
                </button>

                {selectedPhotoIds.length > 0 && (
                  <button
                    type="button"
                    className={s.btnDanger}
                    style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    onClick={handleBulkDeletePhotos}
                  >
                    <GoogleIcon name="delete" size={16} /> Delete Selected ({selectedPhotoIds.length})
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Photos Grid */}
          <div className={s.photoGrid}>
            {photos.map(p => {
              const isPhotoSelected = selectedPhotoIds.includes(p.id)
              return (
                <div
                  key={p.id}
                  className={s.photoCard}
                  style={{
                    position: 'relative',
                    borderColor: isPhotoSelected ? '#DC143C' : undefined,
                    boxShadow: isPhotoSelected ? '0 0 0 2px #DC143C' : undefined
                  }}
                >
                  {/* Photo Checkbox */}
                  <div
                    style={{ position: 'absolute', top: 8, left: 8, zIndex: 10, background: 'rgba(0,0,0,0.6)', borderRadius: 4, padding: 3 }}
                    onClick={e => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isPhotoSelected}
                      onChange={e => {
                        if (e.target.checked) setSelectedPhotoIds(prev => [...prev, p.id])
                        else setSelectedPhotoIds(prev => prev.filter(pId => pId !== p.id))
                      }}
                      style={{ width: 17, height: 17, accentColor: '#DC143C', cursor: 'pointer', display: 'block' }}
                      title="Select photo"
                    />
                  </div>

                  <img src={p.url} alt={p.caption || 'Gallery photo'} loading="lazy" />
                  {p.caption && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '0.45rem 0.6rem',
                      fontSize: '0.74rem',
                      color: '#EEE',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      zIndex: 3,
                      pointerEvents: 'none'
                    }}>
                      {p.caption}
                    </div>
                  )}
                  <div className={s.photoOverlay}>
                    <button
                      className={s.btnDanger}
                      style={{ borderRadius: '50%', width: 38, height: 38, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.6)' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoto(p.id, p.url);
                      }}
                      title="Remove Photo"
                    >
                      <GoogleIcon name="delete" size={18} />
                    </button>
                  </div>
                </div>
              )
            })}

            {photos.length === 0 && (
              <div style={{ gridColumn: '1/-1' }} className={s.empty}>
                <div className={s.emptyIcon}>
                  <GoogleIcon name="photo_camera" size={44} style={{ color: 'rgba(255,255,255,0.2)' }} />
                </div>
                <div className={s.emptyText}>No photos inside "{currentCatObj.name}" yet</div>
                <div className={s.emptyHint}>Click upload above to stage and save photos into this folder</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STAGED PHOTO UPLOAD CONFIRMATION MODAL ── */}
      {showUploadConfirm && (
        <div className={s.overlay} data-lenis-prevent="true" onClick={cancelStagedUpload}>
          <div className={s.modal} data-lenis-prevent="true" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <h2 className={s.modalTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GoogleIcon name="verified" size={24} style={{ color: '#10B981' }} />
              Confirm Photo Upload ({stagedFiles.length} Photos Staged)
            </h2>
            <button className={s.modalClose} onClick={cancelStagedUpload}><GoogleIcon name="close" size={18} /></button>

            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', margin: '0 0 1.25rem' }}>
              You selected <strong>{stagedFiles.length}</strong> photo(s) for folder <strong>"{currentCatObj?.name}"</strong>. Please confirm before saving to database:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem', maxHeight: 260, overflowY: 'auto', background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.25rem' }}>
              {stagedPreviews.map((p, pIdx) => (
                <div key={pIdx} style={{ textAlign: 'center' }}>
                  <img src={p.url} alt="staged" style={{ width: '100%', height: 75, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)' }} />
                  <div style={{ fontSize: '0.68rem', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 3 }}>{p.name}</div>
                  <div style={{ fontSize: '0.65rem', color: '#6B7280' }}>{p.size}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(220,20,60,0.08)', border: '1px solid rgba(220,20,60,0.25)', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#FFB3BA', marginBottom: '1.5rem' }}>
              ✦ Photos will be automatically compressed to WebP and committed to the database upon confirmation.
            </div>

            <div className={s.modalActions}>
              <button className={s.btnSecondary} onClick={cancelStagedUpload}>
                Discard / Cancel
              </button>
              <button className={s.btnPrimary} onClick={confirmAndUploadStagedPhotos} disabled={uploading}>
                <GoogleIcon name="save" size={16} /> Confirm &amp; Save to Database
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FOLDER RENAME MODAL ── */}
      {renameModal && (
        <div className={s.overlay} data-lenis-prevent="true" onClick={() => setRenameModal(null)}>
          <div className={s.modal} data-lenis-prevent="true" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <h2 className={s.modalTitle}>Rename Folder</h2>
            <button className={s.modalClose} onClick={() => setRenameModal(null)}><GoogleIcon name="close" size={18} /></button>
            <div className={s.field} style={{ margin: '1rem 0 1.5rem' }}>
              <label className={s.label}>New Folder Name *</label>
              <input
                className={s.input}
                value={renameModal.name}
                onChange={e => setRenameModal(prev => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="Folder Name"
                autoFocus
              />
            </div>
            <div className={s.modalActions}>
              <button className={s.btnSecondary} onClick={() => setRenameModal(null)}>Cancel</button>
              <button className={s.btnPrimary} onClick={handleRenameFolder} disabled={!renameModal.name.trim()}>Save Name</button>
            </div>
          </div>
        </div>
      )}

      {/* ── FOLDER MERGE MODAL ── */}
      {mergeModal && (
        <div className={s.overlay} data-lenis-prevent="true" onClick={() => setMergeModal(false)}>
          <div className={s.modal} data-lenis-prevent="true" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <h2 className={s.modalTitle}>Merge Selected Folders</h2>
            <button className={s.modalClose} onClick={() => setMergeModal(false)}><GoogleIcon name="close" size={18} /></button>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.86rem', margin: '0.5rem 0 1.25rem' }}>
              Choose which folder should be the destination. All photos from the other {selectedFolderIds.length - 1} selected folder(s) will be merged into it, and source folders will be removed.
            </p>

            <div className={s.field} style={{ marginBottom: '1.25rem' }}>
              <label className={s.label}>Destination Folder *</label>
              <select
                className={s.select}
                value={mergeTargetId}
                onChange={e => {
                  const newId = e.target.value
                  setMergeTargetId(newId)
                  const chosen = categories.find(c => c.id === newId)
                  if (chosen) setMergeNewName(chosen.name)
                }}
              >
                {selectedFolderIds.map(id => {
                  const cat = categories.find(c => c.id === id)
                  return (
                    <option key={id} value={id}>
                      📁 {cat?.name || id} ({allPhotosCount[id] || 0} photos)
                    </option>
                  )
                })}
              </select>
            </div>

            <div className={s.field} style={{ marginBottom: '1.5rem' }}>
              <label className={s.label}>New Merged Folder Name *</label>
              <input
                type="text"
                className={s.input}
                value={mergeNewName}
                onChange={e => setMergeNewName(e.target.value)}
                placeholder="Enter name for the combined folder"
              />
              <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.35rem', display: 'block' }}>
                Specify the custom name for this combined folder.
              </span>
            </div>

            <div className={s.modalActions}>
              <button className={s.btnSecondary} onClick={() => setMergeModal(false)}>Cancel</button>
              <button className={s.btnPrimary} onClick={handleMergeFolders}>
                <GoogleIcon name="merge" size={16} /> Execute Merge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Creation Modal */}
      {showCatModal && (
        <div className={s.overlay} data-lenis-prevent="true" onClick={e => e.target === e.currentTarget && setShowCatModal(false)}>
          <div className={s.modal} data-lenis-prevent="true" style={{ maxWidth: 480 }}>
            <h2 className={s.modalTitle}>New Photo Category</h2>
            <button className={s.modalClose} onClick={() => setShowCatModal(false)}><GoogleIcon name="close" size={18} /></button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className={s.field}>
                <label className={s.label}>Category Name *</label>
                <input className={s.input} value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Lathi-Kaushal Camps 2024" />
              </div>
              <div className={s.field}>
                <label className={s.label}>Description (optional)</label>
                <textarea className={s.textarea} style={{ minHeight: 80 }} value={catForm.description} onChange={e => setCatForm(f => ({ ...f, description: e.target.value }))} placeholder="Where and when will this category photos appear?" />
              </div>
            </div>
            <div className={s.modalActions}>
              <button className={s.btnSecondary} onClick={() => setShowCatModal(false)}>Cancel</button>
              <button className={s.btnPrimary} onClick={createCategory} disabled={!catForm.name.trim()}>Create Category</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


// (Helpers moved to top)

/* ============================================================
   COURSES SECTION
   ============================================================ */

const DEFAULT_COURSES: Course[] = [
  {
    id: 'course_warrior_spirit',
    title: 'Warrior Spirit Certification',
    description: 'Guided by the Aaryaveera philosophy — self-defense, leadership, cultural identity, and character. 12 modules, lifetime access.',
    price: 1800,
    original_price: 2500,
    discount_percent: 28,
    discount_tag: '28% OFF · Flagship Offer',
    duration: '8 Weeks',
    level: 'all' as any,
    instructor: 'Harshita Mankar & Shakti Faculty',
    cover_image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    published: true,
    syllabus: [
      { week: 'Week 1', topic: 'Cognitive Radar & Threat Identification: Color-code awareness.' },
      { week: 'Week 2', topic: 'Bio-mechanical Escapes & Sovereign Boundary Architecture.' },
      { week: 'Week 3', topic: 'Empty-Hand High-Impact Strikes: Palm-heel, hammer-fist, elbows.' },
      { week: 'Week 4', topic: 'Improvised Environmental Weapons & Post-Incident Protocol.' },
    ],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'course_vedic_parenting',
    title: 'Vedic Parenting in Modern India',
    description: 'Raising resilient, rooted children in a fractured world. Drawing on Vedic wisdom, modern psychology, and lived experience.',
    price: 1500,
    original_price: 2000,
    discount_percent: 25,
    discount_tag: 'Save ₹500',
    duration: '6 Weeks',
    level: 'all' as any,
    instructor: 'Shakti Sabha Family Counselors',
    cover_image_url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&auto=format&fit=crop&q=80',
    published: true,
    syllabus: [
      { week: 'Week 1', topic: 'Foundations of Dharmic Parenting: Sanskaras in the Digital Age.' },
      { week: 'Week 2', topic: 'Emotional Regulation & Building Lifelong Trust with Teenagers.' },
      { week: 'Week 3', topic: 'Countering Algorithm Addiction & Instilling Cultural Pride.' },
    ],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'course_paurush',
    title: 'Understanding Paurush — True Masculinity',
    description: 'An honest inquiry into masculinity, Dharma, and the role of men in protecting and building a just society.',
    price: 1800,
    original_price: 2600,
    discount_percent: 31,
    discount_tag: 'Save ₹800',
    duration: '4 Weeks',
    level: 'intermediate' as any,
    instructor: 'Shakti Varta Research Forum',
    cover_image_url: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=600&auto=format&fit=crop&q=80',
    published: true,
    syllabus: [
      { week: 'Week 1', topic: 'Epistemic Frameworks of Indian Philosophy: Pramanas and Nyaya.' },
      { week: 'Week 2', topic: 'Understanding Paurush: True Masculinity as Dharma-Rakshak.' },
    ],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'course_lathi',
    title: 'Lathi-Kaushal for Women',
    description: "The ancient Indian art of Lathi — practical, powerful, rooted. Taught by Shakti Sabha's field instructors.",
    price: 2000,
    original_price: 2800,
    discount_percent: 29,
    discount_tag: 'Save ₹800',
    duration: '6 Weeks',
    level: 'beginner' as any,
    instructor: 'Maharashtra Lathi Masters',
    cover_image_url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&auto=format&fit=crop&q=80',
    published: true,
    syllabus: [
      { week: 'Week 1', topic: 'Stance, Footwork (Chaal), and Grip Dynamics.' },
      { week: 'Week 2', topic: 'The 12 Fundamental Target Strikes of Mardani Khel.' },
    ],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'course_legal',
    title: 'The Legal Collage — Know Your Rights',
    description: 'Understanding IPC, BNS, and systemic loopholes. Fact-based, lawyer-reviewed, essential for every woman in India.',
    price: 1400,
    original_price: 2000,
    discount_percent: 30,
    discount_tag: 'Save ₹600',
    duration: '3 Weeks',
    level: 'all' as any,
    instructor: 'Adv. High Court Advocates Desk',
    cover_image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    published: true,
    syllabus: [
      { week: 'Week 1', topic: 'Legal Shield: Statutory Protections under BNS, IPC, and POSH Act.' },
      { week: 'Week 2', topic: 'Crisis Mediation, FIR Filing, and High-Risk Protection.' },
    ],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
]

function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const defaultForm = {
    title: '', description: '', price: 0, original_price: 0, discount_percent: 0, discount_tag: '', duration: '', level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    cover_image_url: '', instructor: '', published: false,
    syllabus: [{ week: 'Week 1', topic: '' }]
  }
  const [form, setForm] = useState(defaultForm)
  const [imageDim, setImageDim] = useState<{ width: number; height: number } | null>(null)
  const [cropping, setCropping] = useState(false)
  const [showCropModal, setShowCropModal] = useState(false)

  useEffect(() => {
    if (form.cover_image_url) {
      getImageDimensions(form.cover_image_url).then(setImageDim)
    } else {
      setImageDim(null)
    }
  }, [form.cover_image_url])

  const load = async () => {
    setLoading(true)
    let fetchedCourses: Course[] = []
    try {
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false })
      if (!error && data) fetchedCourses = data
    } catch (err) {
      console.warn('Supabase fetch courses error:', err)
    }

    try {
      const local = localStorage.getItem('shakti_custom_courses')
      if (local) {
        const localList: Course[] = JSON.parse(local)
        // O(N) map-based deduplication across remote and local records
        const courseMap = new Map<string, Course>()
        for (const c of fetchedCourses) {
          courseMap.set(c.id, c)
          courseMap.set(`title:${c.title.trim().toLowerCase()}`, c)
        }

        const uniqueLocal: Course[] = []
        for (const c of localList) {
          const titleKey = `title:${c.title.trim().toLowerCase()}`
          if (!courseMap.has(c.id) && !courseMap.has(titleKey)) {
            courseMap.set(c.id, c)
            courseMap.set(titleKey, c)
            uniqueLocal.push(c)
          }
        }
        fetchedCourses = [...uniqueLocal, ...fetchedCourses]
      }
    } catch (e) {
      console.warn('LocalStorage read error:', e)
    }

    const courseMap = new Map<string, Course>()
    for (const c of fetchedCourses) {
      courseMap.set(c.id, c)
      courseMap.set(`title:${c.title.trim().toLowerCase()}`, c)
    }

    const unseededDefaults: Course[] = []
    for (const d of DEFAULT_COURSES) {
      const titleKey = `title:${d.title.trim().toLowerCase()}`
      if (!courseMap.has(d.id) && !courseMap.has(titleKey)) {
        unseededDefaults.push(d)
      }
    }
    const finalCourses = [...fetchedCourses, ...unseededDefaults]
    setCourses(finalCourses)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm(defaultForm); setShowModal(true) }
  const openEdit = (c: Course) => {
    setEditing(c)
    setForm({
      title: c.title, description: c.description, price: c.price,
      original_price: c.original_price || c.price || 0,
      discount_percent: c.discount_percent || 0,
      discount_tag: c.discount_tag || '',
      duration: c.duration, level: c.level, cover_image_url: c.cover_image_url,
      instructor: c.instructor, published: c.published,
      syllabus: c.syllabus?.length ? c.syllabus : [{ week: 'Week 1', topic: '' }]
    })
    setShowModal(true)
  }

  const uploadCover = async (file: File) => {
    setUploading(true)
    try {
      // 1. Compress image down to max 900x900 (quality 0.8) for instant preview & low memory storage (< 70KB)
      const comp = await compressImage(file, { maxWidth: 900, maxHeight: 900, quality: 0.8 })
      setForm(f => ({ ...f, cover_image_url: comp.dataUrl }))

      // 2. Upload compressed file to Supabase storage in background if configured
      const ext = comp.file.name.split('.').pop()
      const path = `courses/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('media').upload(path, comp.file, { upsert: true })
      if (!error) {
        const { data } = supabase.storage.from('media').getPublicUrl(path)
        if (data?.publicUrl) {
          setForm(f => ({ ...f, cover_image_url: data.publicUrl }))
        }
      }
    } catch (e) {
      console.warn('Supabase storage upload error, maintaining compressed local preview:', e)
    } finally {
      setUploading(false)
    }
  }

  const save = async () => {
    if (!form.title.trim()) {
      const msg = 'Validation Alert: Please enter a course title.'
      setAlert({ type: 'error', msg })
      window.alert(msg)
      return
    }

    const origPrice = Number(form.original_price) || Number(form.price) || 0
    if (isNaN(origPrice) || origPrice <= 0) {
      const msg = 'Validation Alert: Please enter a valid positive base price (e.g. 2500). Non-numeric text is not allowed.'
      setAlert({ type: 'error', msg })
      window.alert(msg)
      return
    }
    const discPct = Number(form.discount_percent) || 0
    const finalPrice = Number(form.price) || (discPct > 0 ? Math.round(origPrice * (1 - discPct / 100)) : origPrice)

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: finalPrice,
      original_price: origPrice > 0 ? origPrice : finalPrice,
      discount_percent: discPct,
      discount_tag: form.discount_tag?.trim() || '',
      duration: form.duration.trim() || '4 Weeks',
      level: form.level,
      instructor: form.instructor.trim() || 'Shakti Sabha Faculty',
      cover_image_url: form.cover_image_url || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      published: Boolean(form.published),
      syllabus: form.syllabus.filter(s => s.topic.trim()),
    }

    let saved = false
    let savedId = editing ? editing.id : ''

    // 1. Try Supabase
    try {
      if (editing) {
        const { error } = await supabase.from('courses').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing.id)
        if (!error) saved = true
      } else {
        const { data, error } = await supabase.from('courses').insert([payload]).select().single()
        if (!error && data) {
          saved = true
          savedId = data.id
        }
      }
    } catch (err) {
      console.warn('Supabase save error:', err)
    }

    // 2. Deduplicated LocalStorage Sync (prevents creating duplicate courses)
    try {
      const local = localStorage.getItem('shakti_custom_courses')
      let list: Course[] = local ? JSON.parse(local) : []

      const courseId = savedId || (editing ? editing.id : `course_${Date.now()}`)
      const courseObj: Course = {
        id: courseId,
        ...payload,
        created_at: editing?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Check if course already exists by ID or by title
      const targetTitle = payload.title.toLowerCase()
      const existingIdx = list.findIndex(c => c.id === courseId || c.title.trim().toLowerCase() === targetTitle)

      if (existingIdx >= 0) {
        list[existingIdx] = courseObj
      } else {
        list = [courseObj, ...list]
      }

      localStorage.setItem('shakti_custom_courses', JSON.stringify(list))
      window.dispatchEvent(new Event('shakti_courses_updated'))
      saved = true
    } catch (localErr) {
      console.warn('LocalStorage save error:', localErr)
    }

    if (saved) {
      setAlert({ type: 'success', msg: editing ? 'Course updated successfully!' : 'Course created successfully!' })
      setShowModal(false)
      load()
    } else {
      setAlert({ type: 'error', msg: 'Could not save course. Please check inputs and try again.' })
    }
  }

  const del = async (id: string) => {
    if (!confirm('Delete this course?')) return
    const target = courses.find(c => c.id === id)
    try {
      await supabase.from('courses').delete().eq('id', id)
    } catch (e) {
      console.warn(e)
    }
    try {
      const local = localStorage.getItem('shakti_custom_courses')
      if (local) {
        const list: Course[] = JSON.parse(local)
        const updated = list.filter(c => c.id !== id && (!target || c.title.trim().toLowerCase() !== target.title.trim().toLowerCase()))
        localStorage.setItem('shakti_custom_courses', JSON.stringify(updated))
      }
    } catch (e) {
      console.warn(e)
    }
    window.dispatchEvent(new Event('shakti_courses_updated'))
    load()
  }

  return (
    <>
      {uploading && (
        <ShaktiLoader
          title="Uploading Course Cover"
          status="Processing cover image..."
        />
      )}
      {alert && <div className={`${s.alert} ${alert.type === 'error' ? s.alertError : s.alertSuccess}`}>{alert.msg}</div>}
      <div className={s.sectionHeader}>
        <span className={s.sectionTitle}>All Courses ({courses.length})</span>
        <button className={s.btnPrimary} onClick={openNew}>+ New Course</button>
      </div>

      <div className={s.tableWrap}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
        ) : courses.length === 0 ? (
          <div className={s.empty}>
            <div className={s.emptyIcon}>
              <GoogleIcon name="school" size={44} style={{ color: 'rgba(255,255,255,0.2)' }} />
            </div>
            <div className={s.emptyText}>No courses yet</div>
          </div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr><th>Course</th><th>Price & Discount</th><th>Level</th><th>Duration</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {c.cover_image_url ? (
                        <img src={c.cover_image_url} alt="" style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: 48, height: 32, background: 'rgba(255,255,255,0.06)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <GoogleIcon name="school" size={16} style={{ color: '#888' }} />
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600 }}>{c.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#888' }}>{c.instructor}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>₹{c.price.toLocaleString()}</div>
                    {c.discount_percent && c.discount_percent > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.72rem', color: '#888', textDecoration: 'line-through' }}>
                          ₹{(c.original_price || c.price).toLocaleString()}
                        </span>
                        <span style={{ fontSize: '0.65rem', background: '#065F46', color: '#34D399', padding: '0.1rem 0.4rem', borderRadius: 4, fontWeight: 700 }}>
                          {c.discount_percent}% OFF
                        </span>
                        {c.discount_tag && (
                          <span style={{ fontSize: '0.65rem', color: '#F59E0B' }}>• {c.discount_tag}</span>
                        )}
                      </div>
                    ) : null}
                  </td>
                  <td><span className={`${s.badge} ${s.badgeGray}`}>{c.level}</span></td>
                  <td style={{ fontSize: '0.82rem' }}>{c.duration}</td>
                  <td><span className={`${s.badge} ${c.published ? s.badgeGreen : s.badgeGray}`}>{c.published ? 'Published' : 'Draft'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className={s.btnEdit} onClick={() => openEdit(c)}>Edit</button>
                      <button className={s.btnDanger} onClick={() => del(c.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className={s.overlay} data-lenis-prevent="true" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className={s.modal} data-lenis-prevent="true">
            <h2 className={s.modalTitle}>{editing ? 'Edit Course' : 'New Course'}</h2>
            <button className={s.modalClose} onClick={() => setShowModal(false)}><GoogleIcon name="close" size={18} /></button>

            {alert && (
              <div className={`${s.alert} ${alert.type === 'error' ? s.alertError : s.alertSuccess}`} style={{ marginBottom: '1rem' }}>
                {alert.msg}
              </div>
            )}

            <div className={s.formGrid}>
              <div className={`${s.field} ${s.formFull}`}>
                <label className={s.label}>Course Title</label>
                <input className={s.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Aaryaveera Warrior Certification" />
              </div>
              <div className={`${s.field} ${s.formFull}`}>
                <label className={s.label}>Description</label>
                <textarea className={s.textarea} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What will students learn?" />
              </div>
              <div className={`${s.field} ${s.formFull}`} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontWeight: 600, color: '#C9A96E', fontSize: '0.88rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GoogleIcon name="local_offer" size={17} /> Pricing & Special Event Discount Management
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.85rem' }}>
                  <div>
                    <label className={s.label}>Base / Original Price (₹)</label>
                    <input
                      className={s.input}
                      type="number"
                      min="0"
                      onKeyDown={e => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault() }}
                      value={form.original_price || ''}
                      onChange={e => {
                        const orig = Number(e.target.value) || 0
                        const pct = form.discount_percent || 0
                        const payable = pct > 0 && orig > 0 ? Math.round(orig * (1 - pct / 100)) : orig
                        setForm(f => ({ ...f, original_price: orig, price: payable }))
                      }}
                      placeholder="e.g. 2500"
                    />
                  </div>
                  <div>
                    <label className={s.label}>Event Discount (%)</label>
                    <input
                      className={s.input}
                      type="number"
                      min="0"
                      max="100"
                      value={form.discount_percent || ''}
                      onChange={e => {
                        const pct = Math.min(100, Math.max(0, Number(e.target.value) || 0))
                        const orig = form.original_price || form.price || 0
                        const payable = pct > 0 && orig > 0 ? Math.round(orig * (1 - pct / 100)) : orig
                        setForm(f => ({
                          ...f,
                          discount_percent: pct,
                          price: payable,
                          discount_tag: pct > 0 ? `${pct}% Special Event Discount` : ''
                        }))
                      }}
                      placeholder="e.g. 20"
                    />
                  </div>
                  <div>
                    <label className={s.label}>Special Event / Offer Tag</label>
                    <input
                      className={s.input}
                      value={form.discount_tag || ''}
                      onChange={e => setForm(f => ({ ...f, discount_tag: e.target.value }))}
                      placeholder="e.g. 20% Navratri Special"
                    />
                  </div>
                  <div>
                    <label className={s.label}>Final Payable Price (₹)</label>
                    <input
                      className={s.input}
                      type="number"
                      min="0"
                      value={form.price || ''}
                      onChange={e => {
                        const finalVal = Number(e.target.value) || 0
                        let orig = form.original_price || 0
                        if (orig <= 0 || finalVal > orig) {
                          orig = finalVal
                        }
                        const pct = orig > 0 && finalVal < orig
                          ? Math.round(((orig - finalVal) / orig) * 100)
                          : 0
                        setForm(f => ({
                          ...f,
                          price: finalVal,
                          original_price: orig,
                          discount_percent: pct,
                          discount_tag: pct > 0 ? `${pct}% Special Discount` : ''
                        }))
                      }}
                      placeholder="Calculated price"
                      style={{ fontWeight: 700, color: '#10B981' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>Quick Discount Presets:</span>
                  {[0, 10, 15, 20, 25, 28, 30, 50].map(pct => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => {
                        const base = form.original_price || form.price || 0
                        const payable = pct > 0 ? Math.round(base * (1 - pct / 100)) : base
                        setForm(f => ({
                          ...f,
                          discount_percent: pct,
                          price: payable,
                          discount_tag: pct > 0 ? `${pct}% Special Event Discount` : ''
                        }))
                      }}
                      style={{
                        padding: '0.2rem 0.55rem',
                        fontSize: '0.72rem',
                        borderRadius: 4,
                        border: '1px solid',
                        borderColor: form.discount_percent === pct ? '#C9A96E' : 'rgba(255,255,255,0.15)',
                        background: form.discount_percent === pct ? 'rgba(201,169,110,0.2)' : 'rgba(255,255,255,0.04)',
                        color: form.discount_percent === pct ? '#E8C98A' : '#bbb',
                        cursor: 'pointer'
                      }}
                    >
                      {pct === 0 ? 'No Discount' : `${pct}% OFF`}
                    </button>
                  ))}
                </div>
                {form.discount_percent > 0 && (
                  <div style={{ marginTop: '0.6rem', fontSize: '0.8rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <GoogleIcon name="savings" size={16} />
                    <span>Applied {form.discount_percent}% off: Students pay ₹{form.price.toLocaleString()} (saves ₹{((form.original_price || form.price) - form.price).toLocaleString()})</span>
                  </div>
                )}
              </div>
              <div className={s.field}>
                <label className={s.label}>Duration</label>
                <input className={s.input} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="6 Weeks, 12 Hours" />
              </div>
              <div className={s.field}>
                <label className={s.label}>Level</label>
                <select className={s.select} value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value as any }))}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className={s.field}>
                <label className={s.label}>Instructor</label>
                <input className={s.input} value={form.instructor} onChange={e => setForm(f => ({ ...f, instructor: e.target.value }))} placeholder="Instructor name" />
              </div>

              <div className={`${s.field} ${s.formFull}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <label className={s.label} style={{ margin: 0 }}>Course Banner / Cover Image</label>
                  <div style={{ fontSize: '0.75rem', color: '#C9A96E', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <GoogleIcon name="aspect_ratio" size={15} />
                    <span>📐 Recommended: 1200 × 675 px (16:9 ratio) • Max 2MB</span>
                  </div>
                </div>

                {/* Hidden File Input for Upload & Replace */}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => e.target.files?.[0] && uploadCover(e.target.files[0])}
                />

                {form.cover_image_url ? (
                  /* Existing / Selected Banner Preview with Full Actions */
                  <div style={{
                    position: 'relative',
                    borderRadius: 12,
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(0,0,0,0.5)',
                    marginBottom: '0.85rem',
                    maxWidth: 580
                  }}>
                    <div style={{ position: 'relative', width: '100%', height: 210, background: '#111' }}>
                      <img
                        src={form.cover_image_url}
                        alt="Course Banner Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                      {imageDim && (
                        <div style={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          background: 'rgba(0,0,0,0.75)',
                          backdropFilter: 'blur(4px)',
                          padding: '0.25rem 0.6rem',
                          borderRadius: 6,
                          fontSize: '0.74rem',
                          color: '#E0E7FF',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                          <GoogleIcon name="aspect_ratio" size={14} />
                          <span>{imageDim.width} × {imageDim.height} px</span>
                        </div>
                      )}
                    </div>

                    {/* Banner Action Bar: Crop, Replace, Delete */}
                    <div style={{
                      display: 'flex',
                      gap: '0.6rem',
                      padding: '0.75rem 1rem',
                      background: 'rgba(20, 24, 33, 0.95)',
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      alignItems: 'center',
                      flexWrap: 'wrap'
                    }}>
                      <button
                        type="button"
                        className={s.btnPrimary}
                        style={{
                          padding: '0.4rem 0.85rem',
                          fontSize: '0.8rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#D97706',
                          borderColor: '#B45309'
                        }}
                        onClick={() => setShowCropModal(true)}
                        title="Open interactive manual crop to adjust frame, zoom & position"
                      >
                        <GoogleIcon name="crop" size={15} />
                        ✂️ Manual Crop
                      </button>

                      <button
                        type="button"
                        className={s.btnSecondary}
                        style={{
                          padding: '0.4rem 0.85rem',
                          fontSize: '0.8rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                        disabled={cropping}
                        onClick={async () => {
                          if (!form.cover_image_url) return
                          setCropping(true)
                          try {
                            const cropped = await cropImageTo16_9(form.cover_image_url)
                            setForm(f => ({ ...f, cover_image_url: cropped }))
                            setImageDim({ width: 1200, height: 675 })
                            setAlert({ type: 'success', msg: 'Banner auto-cropped to 16:9 (1200×675)!' })
                          } catch (e) {
                            console.error('Auto crop failed', e)
                          } finally {
                            setCropping(false)
                          }
                        }}
                        title="Automatically center-crop to 16:9 (1200×675)"
                      >
                        <GoogleIcon name="auto_fix_high" size={15} />
                        {cropping ? 'Auto-Cropping...' : '⚡ Auto-Crop 16:9'}
                      </button>

                      <button
                        type="button"
                        className={s.btnSecondary}
                        style={{
                          padding: '0.4rem 0.9rem',
                          fontSize: '0.8rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        title="Upload a new image file to replace this banner"
                      >
                        <GoogleIcon name="cached" size={16} />
                        {uploading ? 'Uploading...' : '🔄 Replace Banner'}
                      </button>

                      <button
                        type="button"
                        className={s.btnDanger}
                        style={{
                          padding: '0.4rem 0.9rem',
                          fontSize: '0.8rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginLeft: 'auto'
                        }}
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this course banner?')) {
                            setForm(f => ({ ...f, cover_image_url: '' }))
                            setImageDim(null)
                          }
                        }}
                        title="Delete current banner"
                      >
                        <GoogleIcon name="delete" size={16} />
                        🗑️ Delete Banner
                      </button>
                    </div>
                  </div>
                ) : (
                  /* No Banner: Clean Dropzone */
                  <div style={{
                    border: '2px dashed rgba(255,255,255,0.2)',
                    borderRadius: 12,
                    padding: '1.75rem 1rem',
                    textAlign: 'center',
                    background: 'rgba(255,255,255,0.02)',
                    marginBottom: '0.85rem',
                    maxWidth: 580
                  }}>
                    <GoogleIcon name="add_photo_alternate" size={40} style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#EEE', marginBottom: '0.25rem' }}>
                      No Course Banner Selected
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: '1.1rem' }}>
                      Select an image file or paste an external image link below
                    </div>
                    <button
                      type="button"
                      className={s.btnPrimary}
                      style={{ padding: '0.45rem 1.1rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                    >
                      <GoogleIcon name="upload" size={16} />
                      {uploading ? 'Uploading...' : '📁 Choose Image File'}
                    </button>
                  </div>
                )}

                {/* Direct Image URL input */}
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', maxWidth: 580 }}>
                  <input
                    className={s.input}
                    style={{ flex: 1 }}
                    value={form.cover_image_url}
                    onChange={e => setForm(f => ({ ...f, cover_image_url: e.target.value }))}
                    placeholder="Or paste direct image URL (https://...)"
                  />
                  {form.cover_image_url && (
                    <button
                      type="button"
                      className={s.btnSecondary}
                      style={{ padding: '0.45rem 0.8rem', fontSize: '0.78rem', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                      onClick={() => setShowCropModal(true)}
                    >
                      <GoogleIcon name="crop" size={15} /> Crop
                    </button>
                  )}
                </div>
              </div>

              <div className={`${s.field} ${s.formFull}`}>
                <label className={s.label}>Syllabus</label>
                {form.syllabus.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input className={s.input} style={{ width: 120, flexShrink: 0 }} value={item.week} onChange={e => setForm(f => ({ ...f, syllabus: f.syllabus.map((s, j) => j === i ? { ...s, week: e.target.value } : s) }))} placeholder="Week 1" />
                    <input className={s.input} value={item.topic} onChange={e => setForm(f => ({ ...f, syllabus: f.syllabus.map((s, j) => j === i ? { ...s, topic: e.target.value } : s) }))} placeholder="Topic / Module title" />
                    {form.syllabus.length > 1 && (
                      <button className={s.btnDanger} style={{ flexShrink: 0, padding: '0 0.65rem' }} onClick={() => setForm(f => ({ ...f, syllabus: f.syllabus.filter((_, j) => j !== i) }))}>✕</button>
                    )}
                  </div>
                ))}
                <button className={s.btnSecondary} style={{ width: 'fit-content' }} onClick={() => setForm(f => ({ ...f, syllabus: [...f.syllabus, { week: `Week ${f.syllabus.length + 1}`, topic: '' }] }))}>
                  + Add Week
                </button>
              </div>

              <div className={s.field}>
                <label className={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
                  Publish immediately
                </label>
              </div>
            </div>

            <div className={s.modalActions}>
              <button className={s.btnSecondary} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={s.btnPrimary} onClick={save}><GoogleIcon name="save" size={16} /> Save Course</button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Image Cropper Modal */}
      {showCropModal && form.cover_image_url && (
        <ManualImageCropperModal
          imageSrc={form.cover_image_url}
          onClose={() => setShowCropModal(false)}
          onSaveCrop={(croppedUrl) => {
            setForm(f => ({ ...f, cover_image_url: croppedUrl }))
            getImageDimensions(croppedUrl).then(setImageDim)
            setAlert({ type: 'success', msg: 'Course banner manually cropped & optimized successfully!' })
          }}
        />
      )}
    </>
  )
}

/* ============================================================
   COUNSELLING SECTION
   ============================================================ */
function CounsellingSection() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [countryFilter, setCountryFilter] = useState<string>('all')
  const [viewItem, setViewItem] = useState<any | null>(null)

  const parseRequestOrigin = (r: any) => {
    let country = r.country || ''
    let state = r.state || ''
    let city = r.city || ''

    if (!country) {
      const msgMatch = (r.message || '').match(/\[Origin:\s*([^,]+),\s*([^,]+),\s*([^\]]+)\]/)
      if (msgMatch) {
        city = city || msgMatch[1].trim()
        state = state || msgMatch[2].trim()
        country = msgMatch[3].trim()
      } else if (r.city && r.city.includes('(')) {
        const match = r.city.match(/(.*?)\((.*?)\)/)
        if (match) {
          country = match[2].trim()
          const parts = match[1].split(',')
          city = parts[0]?.trim() || city
          state = parts[1]?.trim() || state
        }
      }
    }
    country = country || 'India'
    return { ...r, country, state, city }
  }

  const load = async () => {
    setLoading(true)
    let fetchedList: any[] = []

    // 1. Supabase Fetch
    try {
      const { data } = await supabase.from('counselling_requests').select('*').order('created_at', { ascending: false })
      if (data && data.length > 0) fetchedList = data
    } catch (e) {
      console.warn('Supabase counselling fetch error:', e)
    }

    // 2. LocalStorage Dual-Sync & Merge
    try {
      const local = localStorage.getItem('shakti_counselling_requests')
      if (local) {
        const localList = JSON.parse(local)
        const idMap = new Map<string, any>()
        fetchedList.forEach(r => idMap.set(r.id, r))
        localList.forEach((r: any) => {
          if (!idMap.has(r.id)) {
            idMap.set(r.id, r)
            fetchedList.push(r)
          }
        })
      }
    } catch (e) {
      console.warn('LocalStorage counselling read error:', e)
    }

    // Default authentic demo sample if empty
    if (fetchedList.length === 0) {
      fetchedList = [
        { id: 'req_1', name: 'Ananya Sharma', email: 'ananya.s@gmail.com', phone: '+91 98201 44321', country: 'India', state: 'Maharashtra', city: 'Pune', concern: 'Anxiety, Stress & Overthinking', message: 'Navigating workplace burnout and severe caregiver expectations.', status: 'pending', created_at: new Date(Date.now() - 3600000 * 4).toISOString() },
        { id: 'req_2', name: 'Pooja Iyer', email: 'pooja.iyer@outlook.com', phone: '+91 98450 11290', country: 'India', state: 'Karnataka', city: 'Bengaluru', concern: 'Trauma, Domestic Coercion & Recovery', message: 'Looking for confidential one-on-one somatic counseling.', status: 'contacted', created_at: new Date(Date.now() - 3600000 * 28).toISOString() },
        { id: 'req_3', name: 'Simran Kaur', email: 'simran.k@yahoo.com', phone: '+91 94172 88910', country: 'India', state: 'Punjab', city: 'Amritsar', concern: 'Self-Worth, Boundaries & Career Guidance', message: 'Need assistance setting healthy personal boundaries.', status: 'reviewed', created_at: new Date(Date.now() - 3600000 * 52).toISOString() },
        { id: 'req_4', name: 'Dr. Radhika Desai', email: 'radhika.desai@gmail.com', phone: '+1 408 555 0192', country: 'United States', state: 'California', city: 'San Jose', concern: 'Trauma, Domestic Coercion & Recovery', message: 'Seeking remote support circle for diaspora community members.', status: 'resolved', created_at: new Date(Date.now() - 3600000 * 80).toISOString() },
        { id: 'req_5', name: 'Fatima Shaikh', email: 'fatima.s@hotmail.com', phone: '+971 50 123 4567', country: 'United Arab Emirates', state: 'Dubai', city: 'Dubai', concern: 'Depression & Loss of Motivation', message: 'Overwhelmed and feeling isolated.', status: 'contacted', created_at: new Date(Date.now() - 3600000 * 110).toISOString() },
        { id: 'req_6', name: 'Meenakshi Patel', email: 'meenakshi.p@gmail.com', phone: '+44 20 7946 0912', country: 'United Kingdom', state: 'Greater London', city: 'London', concern: 'Anxiety, Stress & Overthinking', message: 'Dealing with chronic anxiety and would love guidance from certified counselor.', status: 'pending', created_at: new Date(Date.now() - 3600000 * 130).toISOString() }
      ]
    }

    const parsed = fetchedList.map(parseRequestOrigin)
    setRequests(parsed)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id: string, status: string) => {
    // 1. Supabase
    try {
      await supabase.from('counselling_requests').update({ status }).eq('id', id)
    } catch (e) { /* ignore */ }

    // 2. LocalStorage
    try {
      const local = localStorage.getItem('shakti_counselling_requests')
      if (local) {
        const list = JSON.parse(local)
        const updated = list.map((r: any) => r.id === id ? { ...r, status } : r)
        localStorage.setItem('shakti_counselling_requests', JSON.stringify(updated))
      }
    } catch (e) { /* ignore */ }

    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    if (viewItem?.id === id) setViewItem((prev: any) => prev ? { ...prev, status } : null)
  }

  // ── Compute Geographic Origin Analytics ──
  const countryCounts: Record<string, number> = {}
  requests.forEach(r => {
    const c = r.country || 'India'
    countryCounts[c] = (countryCounts[c] || 0) + 1
  })
  const countryList = Object.entries(countryCounts).sort((a, b) => b[1] - a[1])
  const totalReqs = requests.length || 1

  const filteredRequests = requests.filter(r => {
    const matchesStatus = filter === 'all' || r.status === filter
    const matchesCountry = countryFilter === 'all' || r.country === countryFilter
    return matchesStatus && matchesCountry
  })

  return (
    <>
      {/* ── GEOGRAPHIC INTAKE ANALYTICS PANEL ── */}
      <div style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#F9FAFB', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'Cinzel', serif" }}>
              <GoogleIcon name="public" size={22} style={{ color: '#DC143C' }} />
              Geographic Intake Analytics — Requests by Country
            </h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: '#888' }}>
              Real-time monitoring of where women are reaching out for counselling support across India &amp; global diaspora
            </p>
          </div>
          <span style={{ fontSize: '0.85rem', color: '#C9A96E', fontWeight: 700 }}>
            Total Intakes: {requests.length}
          </span>
        </div>

        {/* Country Breakdown Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          {countryList.map(([cName, count]) => {
            const pct = Math.round((count / totalReqs) * 100)
            const isSelected = countryFilter === cName
            return (
              <div
                key={cName}
                onClick={() => setCountryFilter(isSelected ? 'all' : cName)}
                style={{
                  background: isSelected ? 'rgba(220,20,60,0.12)' : 'rgba(255,255,255,0.02)',
                  border: isSelected ? '1px solid #DC143C' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 700, color: '#F3F4F6', fontSize: '0.92rem' }}>{cName}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#DC143C' }}>{count}</span>
                </div>
                <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden', marginBottom: '0.4rem' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: '#DC143C', borderRadius: 999 }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>
                  {pct}% of total intake
                </div>
              </div>
            )
          })}
        </div>

        {/* Filter Pills for Country */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Filter by Country:</span>
          <button
            type="button"
            className={`${s.tab} ${countryFilter === 'all' ? s.tabActive : ''}`}
            style={{ padding: '0.25rem 0.75rem', fontSize: '0.78rem' }}
            onClick={() => setCountryFilter('all')}
          >
            All Countries ({requests.length})
          </button>
          {countryList.map(([cName, count]) => (
            <button
              key={cName}
              type="button"
              className={`${s.tab} ${countryFilter === cName ? s.tabActive : ''}`}
              style={{ padding: '0.25rem 0.75rem', fontSize: '0.78rem' }}
              onClick={() => setCountryFilter(cName)}
            >
              {cName} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* ── REQUESTS TABLE HEADER ── */}
      <div className={s.sectionHeader}>
        <span className={s.sectionTitle}>
          Counselling Intakes ({filteredRequests.length})
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', 'pending', 'reviewed', 'contacted', 'resolved'].map(f => (
            <button key={f} className={`${s.tab} ${filter === f ? s.tabActive : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={s.tableWrap}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
        ) : filteredRequests.length === 0 ? (
          <div className={s.empty}>
            <div className={s.emptyIcon}>
              <GoogleIcon name="forum" size={44} style={{ color: 'rgba(255,255,255,0.2)' }} />
            </div>
            <div className={s.emptyText}>No requests match the selected filters</div>
          </div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Country &amp; Origin</th>
                <th>Area of Concern</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(r => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>{r.email}</div>
                    {r.phone && <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{r.phone}</div>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: '#F3F4F6' }}>
                      <GoogleIcon name="place" size={14} style={{ color: '#DC143C' }} />
                      <span>{r.country}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginLeft: 18 }}>
                      {r.city}{r.state ? `, ${r.state}` : ''}
                    </div>
                  </td>
                  <td>
                    <span className={`${s.badge} ${s.badgeGray}`} style={{ fontSize: '0.78rem' }}>
                      {r.concern}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
                    {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <select
                      className={s.statusSelect}
                      value={r.status || 'pending'}
                      onChange={e => updateStatus(r.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="contacted">Contacted</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  <td>
                    <button className={s.btnEdit} onClick={() => setViewItem(r)}>View Full</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── View Detail Modal ── */}
      {viewItem && (
        <div className={s.overlay} data-lenis-prevent="true" onClick={e => e.target === e.currentTarget && setViewItem(null)}>
          <div className={s.modal} data-lenis-prevent="true" style={{ maxWidth: 580 }}>
            <h2 className={s.modalTitle}>Counselling Intake Dossier</h2>
            <button className={s.modalClose} onClick={() => setViewItem(null)}><GoogleIcon name="close" size={18} /></button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                ['Name', viewItem.name],
                ['Email', viewItem.email],
                ['Phone', viewItem.phone],
                ['Country', viewItem.country || 'India'],
                ['State / Region', viewItem.state || '—'],
                ['City', viewItem.city || '—'],
                ['Concern', viewItem.concern],
                ['Status', viewItem.status],
              ].map(([key, val]) => (
                <div key={key} style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ width: 110, flexShrink: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', paddingTop: 2 }}>{key}</span>
                  <span style={{ color: '#F3F4F6', fontSize: '0.92rem' }}>{val || '—'}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <span style={{ width: 110, flexShrink: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', paddingTop: 2 }}>Message / Notes</span>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '0.85rem', color: '#F3F4F6', fontSize: '0.9rem', lineHeight: 1.65, flex: 1 }}>
                  {viewItem.message || 'No additional message provided.'}
                </div>
              </div>
            </div>
            <div className={s.modalActions}>
              <button className={s.btnSecondary} onClick={() => setViewItem(null)}>Close</button>
              <a href={`mailto:${viewItem.email}?subject=Re: Confidential Counselling Intake at Shakti Sabha`} className={s.btnPrimary} style={{ textDecoration: 'none' }}>
                <GoogleIcon name="mail" size={16} /> Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
/* ============================================================
   TESTIMONIALS SECTION
   ============================================================ */
function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [showTestimonialCropModal, setShowTestimonialCropModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const defaultForm = {
    name: '',
    role: '',
    location: '',
    quote: '',
    image_url: '',
    rating: 5,
    published: true,
  }
  const [form, setForm] = useState(defaultForm)

  const load = async () => {
    setLoading(true)
    let list: Testimonial[] = []

    // 1. Fetch from Supabase
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data && data.length > 0) list = data
    } catch (err) {
      console.warn('Supabase fetch testimonials error:', err)
    }

    // 2. Fetch from LocalStorage and merge
    try {
      const local = localStorage.getItem('shakti_testimonials')
      if (local) {
        const localList: Testimonial[] = JSON.parse(local)
        const idMap = new Map<string, Testimonial>()
        for (const t of list) idMap.set(t.id, t)
        for (const t of localList) {
          if (!idMap.has(t.id)) {
            idMap.set(t.id, t)
            list.push(t)
          }
        }
      } else {
        localStorage.setItem('shakti_testimonials', JSON.stringify(DEFAULT_TESTIMONIALS))
        const idMap = new Map<string, Testimonial>()
        for (const t of list) idMap.set(t.id, t)
        for (const t of DEFAULT_TESTIMONIALS) {
          if (!idMap.has(t.id)) {
            idMap.set(t.id, t)
            list.push(t)
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage error:', e)
    }

    setTestimonials(list)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setEditing(null)
    setForm(defaultForm)
    setShowModal(true)
  }

  const openEdit = (t: Testimonial) => {
    setEditing(t)
    setForm({
      name: t.name,
      role: t.role,
      location: t.location || '',
      quote: t.quote,
      image_url: t.image_url || '',
      rating: t.rating || 5,
      published: t.published !== false,
    })
    setShowModal(true)
  }

  const uploadPhoto = async (file: File) => {
    setUploading(true)
    try {
      // Compress person's image down to 500x500 (quality 0.8) for fast loading & light footprint (~30KB)
      const comp = await compressImage(file, { maxWidth: 500, maxHeight: 500, quality: 0.8 })
      setForm(f => ({ ...f, image_url: comp.dataUrl }))

      const ext = comp.file.name.split('.').pop()
      const path = `testimonials/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('media').upload(path, comp.file, { upsert: true })
      if (!error) {
        const { data } = supabase.storage.from('media').getPublicUrl(path)
        if (data?.publicUrl) {
          setForm(f => ({ ...f, image_url: data.publicUrl }))
        }
      }
    } catch (e) {
      console.warn('Testimonial image upload error:', e)
    } finally {
      setUploading(false)
    }
  }

  const save = async () => {
    if (!form.name.trim()) {
      setAlert({ type: 'error', msg: "Please enter the person's name." })
      return
    }
    if (!form.quote.trim()) {
      setAlert({ type: 'error', msg: 'Please enter the testimonial text.' })
      return
    }

    const payload = {
      name: form.name.trim(),
      role: form.role.trim() || 'Community Member',
      location: form.location.trim() || 'Maharashtra',
      quote: form.quote.trim(),
      image_url: form.image_url || '',
      rating: Number(form.rating) || 5,
      published: Boolean(form.published),
    }

    let saved = false
    let savedId = editing ? editing.id : ''

    // 1. Try Supabase
    try {
      if (editing) {
        const { error } = await supabase.from('testimonials').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing.id)
        if (!error) saved = true
      } else {
        const { data, error } = await supabase.from('testimonials').insert([payload]).select().single()
        if (!error && data) {
          saved = true
          savedId = data.id
        }
      }
    } catch (err) {
      console.warn('Supabase testimonial save error:', err)
    }

    // 2. LocalStorage Sync
    try {
      const local = localStorage.getItem('shakti_testimonials')
      let list: Testimonial[] = local ? JSON.parse(local) : []
      const id = savedId || (editing ? editing.id : `testim_${Date.now()}`)
      const item: Testimonial = {
        id,
        ...payload,
        created_at: editing?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const idx = list.findIndex(t => t.id === id)
      if (idx >= 0) {
        list[idx] = item
      } else {
        list = [item, ...list]
      }
      localStorage.setItem('shakti_testimonials', JSON.stringify(list))
      window.dispatchEvent(new Event('storage'))
      saved = true
    } catch (localErr) {
      console.warn('LocalStorage save error:', localErr)
    }

    if (saved) {
      setAlert({ type: 'success', msg: editing ? 'Testimonial updated!' : 'Testimonial added!' })
      setShowModal(false)
      load()
    } else {
      setAlert({ type: 'error', msg: 'Failed to save testimonial.' })
    }
  }

  const del = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      await supabase.from('testimonials').delete().eq('id', id)
    } catch (err) {
      console.warn('Supabase delete error:', err)
    }

    try {
      const local = localStorage.getItem('shakti_testimonials')
      if (local) {
        const list: Testimonial[] = JSON.parse(local)
        const filtered = list.filter(t => t.id !== id)
        localStorage.setItem('shakti_testimonials', JSON.stringify(filtered))
        window.dispatchEvent(new Event('storage'))
      }
    } catch (localErr) {
      console.warn('LocalStorage delete error:', localErr)
    }

    setAlert({ type: 'success', msg: 'Testimonial deleted.' })
    load()
  }

  return (
    <>
      {uploading && (
        <ShaktiLoader
          title="Processing Photo"
          status="Optimizing and uploading testimonial photo..."
        />
      )}
      {alert && <div className={`${s.alert} ${alert.type === 'error' ? s.alertError : s.alertSuccess}`}>{alert.msg}</div>}

      <div className={s.sectionHeader}>
        <span className={s.sectionTitle}>Community Testimonials ({testimonials.length})</span>
        <button className={s.btnPrimary} onClick={openNew}>+ New Testimonial</button>
      </div>

      <div className={s.tableWrap}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
        ) : testimonials.length === 0 ? (
          <div className={s.empty}>
            <div className={s.emptyIcon}>
              <GoogleIcon name="format_quote" size={44} style={{ color: 'rgba(255,255,255,0.2)' }} />
            </div>
            <div className={s.emptyText}>No testimonials yet</div>
          </div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Person</th>
                <th>Role / Context</th>
                <th>Location</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map(t => (
                <tr key={t.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', background: '#333', flexShrink: 0, border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {t.image_url ? (
                          <img src={t.image_url} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#DC143C' }}>{t.name.charAt(0)}</span>
                        )}
                      </div>
                      <span style={{ fontWeight: 600, color: '#F9FAFB' }}>{t.name}</span>
                    </div>
                  </td>
                  <td>{t.role}</td>
                  <td>{t.location || '—'}</td>
                  <td><span style={{ color: '#F59E0B' }}>{'★'.repeat(t.rating || 5)}</span></td>
                  <td><span className={`${s.badge} ${t.published ? s.badgeGreen : s.badgeGray}`}>{t.published ? 'Published' : 'Draft'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className={s.btnEdit} onClick={() => openEdit(t)}>Edit</button>
                      <button className={s.btnDanger} onClick={() => del(t.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className={s.overlay} data-lenis-prevent="true" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className={s.modal} data-lenis-prevent="true">
            <h2 className={s.modalTitle}>{editing ? 'Edit Testimonial' : 'New Testimonial'}</h2>
            <button className={s.modalClose} onClick={() => setShowModal(false)}><GoogleIcon name="close" size={18} /></button>

            <div className={s.formGrid}>
              <div className={s.field}>
                <label className={s.label}>Person's Name *</label>
                <input className={s.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Pooja Deshmukh" />
              </div>
              <div className={s.field}>
                <label className={s.label}>Role / Designation</label>
                <input className={s.input} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Lathi-Kaushal Graduate, Survivor & Mentor" />
              </div>
              <div className={s.field}>
                <label className={s.label}>Location / City</label>
                <input className={s.input} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Pune, Maharashtra" />
              </div>
              <div className={s.field}>
                <label className={s.label}>Rating (1 - 5 Stars)</label>
                <select className={s.select} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))}>
                  <option value={5}>5 Stars ★★★★★</option>
                  <option value={4}>4 Stars ★★★★☆</option>
                  <option value={3}>3 Stars ★★★☆☆</option>
                  <option value={2}>2 Stars ★★☆☆☆</option>
                  <option value={1}>1 Star ★☆☆☆☆</option>
                </select>
              </div>

              {/* Photo Upload with Instant Preview */}
              <div className={`${s.field} ${s.formFull}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className={s.label} style={{ margin: 0 }}>Person's Photo</label>
                <span style={{ fontSize: '0.75rem', color: '#C9A96E', background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.3)', padding: '0.15rem 0.55rem', borderRadius: 6, fontWeight: 600 }}>
                  Aspect Ratio: 1:1 Square (400 × 400 px) • Max 1MB
                </span>
              </div>
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => e.target.files?.[0] && uploadPhoto(e.target.files[0])}
                  />
                  <button
                    type="button"
                    className={s.btnSecondary}
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Compressing...' : <><GoogleIcon name="upload_file" size={16} style={{ marginRight: 6 }} /> Choose Photo</>}
                  </button>
                  <input
                    className={s.input}
                    style={{ flex: 1, minWidth: 220 }}
                    value={form.image_url}
                    onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                    placeholder="Or enter Image URL directly"
                  />
                </div>

                {/* Live Preview & Adjust */}
                {form.image_url ? (
                  <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: '2px solid #DC143C' }}>
                      <img src={form.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.82rem', color: '#10B981' }}>✓ Photo ready &amp; compressed</span>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className={s.btnPrimary}
                          style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', background: '#D97706', borderColor: '#B45309', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => setShowTestimonialCropModal(true)}
                        >
                          <GoogleIcon name="crop" size={14} /> ✂️ Manual Crop
                        </button>
                        <button
                          type="button"
                          className={s.btnSecondary}
                          style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={async () => {
                            try {
                              const cropped = await cropImageTo1_1(form.image_url)
                              setForm((f: any) => ({ ...f, image_url: cropped }))
                            } catch (e) {
                              console.error('Testimonial crop failed', e)
                            }
                          }}
                        >
                          <GoogleIcon name="auto_fix_high" size={14} /> ⚡ Auto-Crop 1:1
                        </button>
                        <button
                          type="button"
                          className={s.btnSecondary}
                          style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => fileRef.current?.click()}
                        >
                          <GoogleIcon name="cached" size={14} /> Replace Photo
                        </button>
                        <button
                          type="button"
                          className={s.btnDanger}
                          style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => setForm((f: any) => ({ ...f, image_url: '' }))}
                        >
                          <GoogleIcon name="delete" size={14} /> Delete Photo
                        </button>
                      </div>

                      {showTestimonialCropModal && (
                        <ManualImageCropperModal
                          imageSrc={form.image_url}
                          title="Manual Crop Testimonial Portrait"
                          defaultRatio={1}
                          onClose={() => setShowTestimonialCropModal(false)}
                          onSaveCrop={(cropped) => setForm((f: any) => ({ ...f, image_url: cropped }))}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#888' }}>
                    No photo uploaded. Using avatar initial by default.
                  </div>
                )}
              </div>

              <div className={`${s.field} ${s.formFull}`}>
                <label className={s.label}>Testimonial Quote / Story *</label>
                <textarea
                  className={s.textarea}
                  style={{ minHeight: 110 }}
                  value={form.quote}
                  onChange={e => setForm(f => ({ ...f, quote: e.target.value }))}
                  placeholder="What did this person say about their journey with Shakti Sabha?"
                />
              </div>

              <div className={`${s.field} ${s.formFull}`}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#F3F4F6' }}>
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                    style={{ accentColor: '#DC143C', width: 16, height: 16 }}
                  />
                  Publish this testimonial to the website immediately
                </label>
              </div>
            </div>

            <div className={s.modalActions}>
              <button className={s.btnSecondary} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={s.btnPrimary} onClick={save}><GoogleIcon name="save" size={16} /> Save Testimonial</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ============================================================
   FOUNDER & CIVILIZATIONAL DOSSIER SECTION
   ============================================================ */
function FounderSection() {
  const [data, setData] = useState<FounderProfileData>(getFounderData())
  const [showFounderCropModal, setShowFounderCropModal] = useState(false)
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)
  const [popupModal, setPopupModal] = useState<{ title: string; msg: string; type: 'success' | 'error' } | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUploadPhoto = async (file: File) => {
    setUploading(true)
    try {
      const comp = await compressImage(file, { maxWidth: 900, maxHeight: 1100, quality: 0.85 })
      setData(d => ({ ...d, heroImage: comp.dataUrl }))

      const ext = comp.file.name.split('.').pop()
      const path = `founder/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('media').upload(path, comp.file, { upsert: true })
      if (!error) {
        const { data: pubData } = supabase.storage.from('media').getPublicUrl(path)
        if (pubData?.publicUrl) {
          setData(d => ({ ...d, heroImage: pubData.publicUrl }))
        }
      }
    } catch (e) {
      console.warn('Founder image upload error:', e)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = () => {
    try {
      saveFounderData(data)
      setPopupModal({
        title: 'Changes Successfully Saved!',
        msg: 'Founder Dossier, Core Philosophy, and institutional information have been saved and broadcast live to Home Profile, About, Mardini, Shakti Bhava, and Shakti Varta pages.',
        type: 'success'
      })
    } catch (err: any) {
      setPopupModal({
        title: 'Save Failed',
        msg: err?.message || 'Could not save founder data. Please check inputs and try again.',
        type: 'error'
      })
    }
  }

  const handleDeletePhoto = () => {
    if (confirm('Are you sure you want to remove the current founder photo?')) {
      const updated = { ...data, heroImage: '' }
      setData(updated)
      saveFounderData(updated)
      setPopupModal({
        title: 'Photo Removed Successfully',
        msg: 'The current portrait has been cleared and saved to the database.',
        type: 'success'
      })
    }
  }

  const handleReset = () => {
    if (confirm('Reset to standard civilizational information?')) {
      setData(DEFAULT_FOUNDER_DATA)
      saveFounderData(DEFAULT_FOUNDER_DATA)
      setPopupModal({
        title: 'Reset to Default Records',
        msg: 'Standard founding institutional dossier has been restored.',
        type: 'success'
      })
    }
  }

  return (
    <>
      {uploading && (
        <ShaktiLoader
          title="Updating Founder Photo"
          status="Optimizing and uploading portrait..."
        />
      )}
      {alert && <div className={`${s.alert} ${alert.type === 'error' ? s.alertError : s.alertSuccess}`}>{alert.msg}</div>}

      <div className={s.sectionHeader}>
        <div>
          <span className={s.sectionTitle}>Founder &amp; Director Information Desk</span>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>
            Updates apply instantly to the Home Profile, About Page, Mission Mardini, Shakti Bhava, and Shakti Varta.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className={s.btnSecondary} onClick={handleReset}>Reset Defaults</button>
          <button className={s.btnPrimary} onClick={handleSave}><GoogleIcon name="save" size={16} /> Save Changes</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Basic Identity & Hero Card */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.75rem' }}>
          <h3 style={{ color: '#F9FAFB', fontSize: '1.15rem', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GoogleIcon name="badge" size={20} style={{ color: '#DC143C' }} />
            Primary Identity &amp; Titles
          </h3>

          <div className={s.formGrid}>
            <div className={s.field}>
              <label className={s.label}>Full Name</label>
              <input className={s.input} value={data.name} onChange={e => setData(d => ({ ...d, name: e.target.value }))} />
            </div>
            <div className={s.field}>
              <label className={s.label}>Official Title</label>
              <input className={s.input} value={data.title} onChange={e => setData(d => ({ ...d, title: e.target.value }))} />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Specialist Sub-Title &amp; Accreditations</label>
              <input className={s.input} value={data.subTitle} onChange={e => setData(d => ({ ...d, subTitle: e.target.value }))} />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Hero Quote (Foundational Conviction)</label>
              <textarea className={s.textarea} style={{ minHeight: 70 }} value={data.heroQuote} onChange={e => setData(d => ({ ...d, heroQuote: e.target.value }))} />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Concise Biography (Home Page Bio)</label>
              <textarea className={s.textarea} style={{ minHeight: 90 }} value={data.bio} onChange={e => setData(d => ({ ...d, bio: e.target.value }))} />
            </div>

            {/* Photo Upload */}
            <div className={`${s.field} ${s.formFull}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className={s.label} style={{ margin: 0 }}>Founder Portrait</label>
                <span style={{ fontSize: '0.75rem', color: '#C9A96E', background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.3)', padding: '0.15rem 0.55rem', borderRadius: 6, fontWeight: 600 }}>
                  Aspect Ratio: 4:5 Portrait or 1:1 Square (800 × 1000 px) • Max 2MB
                </span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => e.target.files?.[0] && handleUploadPhoto(e.target.files[0])}
                />
                <button
                  type="button"
                  className={s.btnSecondary}
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  <GoogleIcon name="upload_file" size={16} style={{ marginRight: 6 }} /> Choose New Photo
                </button>
                <input
                  className={s.input}
                  style={{ flex: 1, minWidth: 260 }}
                  value={data.heroImage}
                  onChange={e => setData(d => ({ ...d, heroImage: e.target.value }))}
                  placeholder="Or enter image URL"
                />
              </div>
              {data.heroImage ? (
                <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ width: 64, height: 75, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <img src={data.heroImage} alt="Portrait preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <span style={{ fontSize: '0.82rem', color: '#10B981' }}>✓ Portrait active</span>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className={s.btnPrimary}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', background: '#D97706', borderColor: '#B45309', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => setShowFounderCropModal(true)}
                      >
                        <GoogleIcon name="crop" size={14} /> ✂️ Manual Crop
                      </button>
                      <button
                        type="button"
                        className={s.btnSecondary}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        onClick={async () => {
                          try {
                            const cropped = await cropImageTo1_1(data.heroImage)
                            setData(d => ({ ...d, heroImage: cropped }))
                          } catch (e) {
                            console.error('Founder crop failed', e)
                          }
                        }}
                      >
                        <GoogleIcon name="auto_fix_high" size={14} /> ⚡ Auto-Crop 1:1
                      </button>
                      <button
                        type="button"
                        className={s.btnSecondary}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => fileRef.current?.click()}
                      >
                        <GoogleIcon name="cached" size={14} /> Replace Photo
                      </button>
                      <button
                        type="button"
                        className={s.btnDanger}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        onClick={handleDeletePhoto}
                      >
                        <GoogleIcon name="delete" size={14} /> Delete Photo
                      </button>
                    </div>

                    {showFounderCropModal && (
                      <ManualImageCropperModal
                        imageSrc={data.heroImage}
                        title="Manual Crop Founder Portrait"
                        defaultRatio={4 / 5}
                        onClose={() => setShowFounderCropModal(false)}
                        onSaveCrop={(cropped) => setData(d => ({ ...d, heroImage: cropped }))}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: '0.6rem', fontSize: '0.8rem', color: '#F59E0B' }}>
                  ⚠ No founder photo currently set. Upload or paste a URL above.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* The Genesis & Kshatra-Dharma */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.75rem' }}>
          <h3 style={{ color: '#F9FAFB', fontSize: '1.15rem', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GoogleIcon name="history_edu" size={20} style={{ color: '#DC143C' }} />
            The Genesis &amp; Civilizational Sovereignty
          </h3>

          <div className={s.formGrid}>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Genesis Section Headline</label>
              <input className={s.input} value={data.genesisLead} onChange={e => setData(d => ({ ...d, genesisLead: e.target.value }))} />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Genesis Paragraph 1 (Grassroots Beginnings)</label>
              <textarea className={s.textarea} style={{ minHeight: 80 }} value={data.genesisP1} onChange={e => setData(d => ({ ...d, genesisP1: e.target.value }))} />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Genesis Paragraph 2 (Beyond Vulnerability to Agency)</label>
              <textarea className={s.textarea} style={{ minHeight: 90 }} value={data.genesisP2} onChange={e => setData(d => ({ ...d, genesisP2: e.target.value }))} />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Genesis Paragraph 3 (Establishing Shakti Sabha)</label>
              <textarea className={s.textarea} style={{ minHeight: 80 }} value={data.genesisP3} onChange={e => setData(d => ({ ...d, genesisP3: e.target.value }))} />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>The Kshatra-Dharma Vision Text</label>
              <textarea className={s.textarea} style={{ minHeight: 100 }} value={data.kshatraDharmaText} onChange={e => setData(d => ({ ...d, kshatraDharmaText: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* Frontline Interventions & Statutory Disclaimer */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.75rem' }}>
          <h3 style={{ color: '#F9FAFB', fontSize: '1.15rem', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GoogleIcon name="gavel" size={20} style={{ color: '#DC143C' }} />
            Statutory Safeguarding &amp; Confidentiality Compliance
          </h3>

          <div className={s.formGrid}>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Child Protection &amp; Transit Interception Footprint</label>
              <textarea className={s.textarea} style={{ minHeight: 80 }} value={data.interventions.childProtectionText} onChange={e => setData(d => ({ ...d, interventions: { ...d.interventions, childProtectionText: e.target.value } }))} />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Counter-Grooming &amp; Pre-FIR Mediation Footprint</label>
              <textarea className={s.textarea} style={{ minHeight: 80 }} value={data.interventions.counterGroomingText} onChange={e => setData(d => ({ ...d, interventions: { ...d.interventions, counterGroomingText: e.target.value } }))} />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Somatic Grounding &amp; Non-Verbal Support Methodology</label>
              <textarea className={s.textarea} style={{ minHeight: 80 }} value={data.interventions.somaticSupportText} onChange={e => setData(d => ({ ...d, interventions: { ...d.interventions, somaticSupportText: e.target.value } }))} />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Institutional Note on Statutory Compliance &amp; Legal Confidentiality</label>
              <textarea className={s.textarea} style={{ minHeight: 90 }} value={data.interventions.confidentialityNotice} onChange={e => setData(d => ({ ...d, interventions: { ...d.interventions, confidentialityNotice: e.target.value } }))} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button className={s.btnPrimary} onClick={handleSave} style={{ padding: '0.75rem 2rem' }}>
            <GoogleIcon name="save" size={18} /> Save &amp; Publish Changes
          </button>
        </div>
      </div>

      {/* ── Status Popup Modal ── */}
      {popupModal && (
        <div className={s.overlay} data-lenis-prevent="true" onClick={() => setPopupModal(null)}>
          <div className={s.modal} data-lenis-prevent="true" style={{ maxWidth: 440, textAlign: 'center', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: popupModal.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(220,20,60,0.15)', border: popupModal.type === 'success' ? '2px solid #10B981' : '2px solid #DC143C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <GoogleIcon name={popupModal.type === 'success' ? 'check_circle' : 'error'} size={32} style={{ color: popupModal.type === 'success' ? '#10B981' : '#DC143C' }} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem', color: '#F9FAFB', fontSize: '1.2rem', fontFamily: "'Cinzel', serif" }}>{popupModal.title}</h3>
            <p style={{ margin: '0 0 1.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', lineHeight: 1.6 }}>{popupModal.msg}</p>
            <button className={s.btnPrimary} style={{ width: '100%', justifyContent: 'center' }} onClick={() => setPopupModal(null)}>
              OK, Understood
            </button>
          </div>
        </div>
      )}
    </>
  )
}


/* ============================================================
   EVENTS SECTION
   ============================================================ */
interface AdminEvent {
  id: string
  title: string
  cover_image_url?: string
  stream: 'mardini' | 'shakti-bhava' | 'shakti-varta' | 'general'
  format: 'on-ground' | 'digital'
  date: string
  end_date?: string
  location?: string
  meeting_link?: string
  pricing?: string
  is_free: boolean
  capacity?: number
  registered_count: number
  status: 'upcoming' | 'completed' | 'cancelled'
  description?: string
  curriculum_pdf_url?: string
  theme_category?: string
  region?: string
  participant_count?: number
  published: boolean
  attribution?: string
  created_at: string
}

const EMPTY_EVENT: Omit<AdminEvent, 'id' | 'created_at'> = {
  title: '',
  cover_image_url: '',
  stream: 'general',
  format: 'on-ground',
  date: '',
  is_free: true,
  registered_count: 0,
  status: 'upcoming',
  published: true,
}

function loadAdminEvents(): AdminEvent[] {
  try {
    const raw = localStorage.getItem('shakti_events')
    if (raw) return JSON.parse(raw) as AdminEvent[]
  } catch { /**/ }
  return []
}

function saveAdminEvents(evs: AdminEvent[]) {
  localStorage.setItem('shakti_events', JSON.stringify(evs))
  window.dispatchEvent(new Event('storage'))
}

function downloadCSV(evs: AdminEvent[]) {
  const headers = ['ID', 'Title', 'Stream', 'Format', 'Date', 'Location', 'Status', 'Capacity', 'Registered', 'Participants', 'Attribution', 'Published']
  const rows = evs.map(e => [
    e.id, e.title, e.stream, e.format, e.date, e.location || '', e.status,
    e.capacity || '', e.registered_count, e.participant_count || '', e.attribution || '', e.published ? 'Yes' : 'No',
  ])
  const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'shakti_events.csv'; a.click()
  URL.revokeObjectURL(url)
}

function EventsSection() {
  const [events, setEvents] = useState<AdminEvent[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<AdminEvent | null>(null)
  const [form, setForm] = useState<Omit<AdminEvent, 'id' | 'created_at'>>(EMPTY_EVENT)
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all')
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [eventImageDim, setEventImageDim] = useState<{ width: number; height: number } | null>(null)
  const [eventCropping, setEventCropping] = useState(false)
  const [showEventCropModal, setShowEventCropModal] = useState(false)
  const eventFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (form.cover_image_url) {
      getImageDimensions(form.cover_image_url).then(setEventImageDim)
    } else {
      setEventImageDim(null)
    }
  }, [form.cover_image_url])

  useEffect(() => {
    setEvents(loadAdminEvents())
    const onStorage = () => setEvents(loadAdminEvents())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const getTodayDateStr = () => {
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleDateChange = (selectedDate: string) => {
    const todayStr = getTodayDateStr()
    const isPast = Boolean(selectedDate && selectedDate < todayStr)
    setForm(f => ({
      ...f,
      date: selectedDate,
      status: isPast ? 'completed' : (selectedDate ? 'upcoming' : f.status)
    }))
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ ...EMPTY_EVENT, status: 'upcoming' })
    setShowModal(true)
  }

  const openEdit = (ev: AdminEvent) => {
    setEditing(ev)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, created_at, ...rest } = ev
    const todayStr = getTodayDateStr()
    const isPast = Boolean(rest.date && rest.date < todayStr)
    setForm({
      ...rest,
      status: isPast ? 'completed' : rest.status
    })
    setShowModal(true)
  }

  const handleSave = () => {
    setSaving(true)
    const todayStr = getTodayDateStr()
    const isPast = Boolean(form.date && form.date < todayStr)
    const safeForm = {
      ...form,
      status: isPast ? 'completed' : form.status
    }
    const all = loadAdminEvents()
    if (editing) {
      const updated = all.map(e => e.id === editing.id ? { ...editing, ...safeForm } : e)
      saveAdminEvents(updated)
      setEvents(updated)
    } else {
      const newEv: AdminEvent = { ...safeForm, id: `ev-${Date.now()}`, created_at: new Date().toISOString() }
      const updated = [newEv, ...all]
      saveAdminEvents(updated)
      setEvents(updated)
    }
    setSaving(false)
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this event?')) return
    const updated = events.filter(e => e.id !== id)
    saveAdminEvents(updated)
    setEvents(updated)
  }

  const handleTogglePublish = (id: string) => {
    const updated = events.map(e => e.id === id ? { ...e, published: !e.published } : e)
    saveAdminEvents(updated)
    setEvents(updated)
  }

  const handleAutoArchive = () => {
    const today = new Date().toDateString()
    const updated = events.map(e =>
      e.status === 'upcoming' && new Date(e.date) < new Date(today) ? { ...e, status: 'completed' as const } : e
    )
    saveAdminEvents(updated)
    setEvents(updated)
  }

  const filtered = events.filter(e => {
    if (filterStatus !== 'all' && e.status !== filterStatus) return false
    if (fromDate) {
      const evDate = new Date(e.date)
      const fDate = new Date(fromDate)
      if (evDate < fDate) return false
    }
    if (toDate) {
      const evDate = new Date(e.date)
      const tDate = new Date(toDate + 'T23:59:59')
      if (evDate > tDate) return false
    }
    return true
  })

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['all', 'upcoming', 'completed', 'cancelled'] as const).map(st => (
            <button key={st} onClick={() => setFilterStatus(st)}
              style={{ padding: '0.35rem 0.85rem', borderRadius: 20, border: '1px solid',
                borderColor: filterStatus === st ? '#C9A96E' : 'rgba(255,255,255,0.1)',
                background: filterStatus === st ? 'rgba(201,169,110,0.12)' : 'transparent',
                color: filterStatus === st ? '#C9A96E' : '#666', fontSize: '0.8rem', cursor: 'pointer' }}>
              {st.charAt(0).toUpperCase() + st.slice(1)} ({st === 'all' ? events.length : events.filter(e => e.status === st).length})
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={s.btnSecondary} onClick={handleAutoArchive} style={{ fontSize: '0.82rem' }}>
            <GoogleIcon name="auto_fix_high" size={16} /> Auto-Archive Past
          </button>
          <button className={s.btnSecondary} onClick={() => downloadCSV(events)} style={{ fontSize: '0.82rem' }}>
            <GoogleIcon name="download" size={16} /> Export CSV
          </button>
          <button className={s.btnPrimary} onClick={openCreate}>
            <GoogleIcon name="add" size={18} /> New Event
          </button>
        </div>
      </div>

      {/* ── CALENDAR DATE RANGE FILTER BAR ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '0.75rem 1.15rem',
        borderRadius: 10,
        marginBottom: '1.25rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#FFFFFF', fontSize: '0.86rem', fontWeight: 600 }}>
          <GoogleIcon name="calendar_month" size={18} style={{ color: '#FFFFFF' }} />
          <span>Calendar Date Range:</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#FFFFFF', fontWeight: 500 }}>From</span>
          <input
            type="date"
            className={s.input}
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.82rem', width: 'auto', background: '#18181D', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.25)', colorScheme: 'dark' }}
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#FFFFFF', fontWeight: 500 }}>To</span>
          <input
            type="date"
            className={s.input}
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.82rem', width: 'auto', background: '#18181D', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.25)', colorScheme: 'dark' }}
            value={toDate}
            onChange={e => setToDate(e.target.value)}
          />
        </div>
        {(fromDate || toDate) && (
          <button
            type="button"
            className={s.btnSecondary}
            style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', height: 'auto', minHeight: 0, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            onClick={() => { setFromDate(''); setToDate('') }}
          >
            <GoogleIcon name="close" size={14} /> Clear Dates
          </button>
        )}
        <span style={{ fontSize: '0.78rem', color: '#888', marginLeft: 'auto' }}>
          Showing {filtered.length} of {events.length} events
        </span>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#555' }}>
          <GoogleIcon name="event" size={48} style={{ display: 'block', margin: '0 auto 1rem', color: 'rgba(201,169,110,0.2)' }} />
          <p>No events found. Create your first event or backfill historical records.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(ev => (
            <div key={ev.id} style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ padding: '0.15rem 0.55rem', borderRadius: 12, fontSize: '0.7rem', background: ev.status === 'upcoming' ? 'rgba(61,90,69,0.4)' : ev.status === 'completed' ? 'rgba(201,169,110,0.2)' : 'rgba(220,20,60,0.2)', color: ev.status === 'upcoming' ? '#3D8B5A' : ev.status === 'completed' ? '#C9A96E' : '#DC143C' }}>
                    {ev.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#555' }}>{ev.stream} · {ev.format}</span>
                  {!ev.published && <span style={{ padding: '0.15rem 0.5rem', borderRadius: 12, fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', color: '#555' }}>Hidden</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
                    {ev.cover_image_url && (
                      <img src={ev.cover_image_url} alt="" style={{ width: 44, height: 28, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                    )}
                    <p style={{ margin: 0, fontFamily: "'Cinzel', serif", fontSize: '0.95rem', color: '#f5ead6' }}>{ev.title}</p>
                  </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                  <GoogleIcon name="calendar_today" size={14} style={{ color: '#FFFFFF' }} />
                  <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{ev.date}{ev.end_date ? ` → ${ev.end_date}` : ''}</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
                  <GoogleIcon name="location_on" size={14} style={{ color: '#C9A96E' }} />
                  <span>{ev.location || 'Location TBA'}</span>
                  {ev.participant_count ? ` · ~${ev.participant_count.toLocaleString()}+ participants` : ''}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleTogglePublish(ev.id)} title={ev.published ? 'Hide' : 'Publish'}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.4rem 0.6rem', cursor: 'pointer', color: ev.published ? '#3D8B5A' : '#555' }}>
                  <GoogleIcon name={ev.published ? 'visibility' : 'visibility_off'} size={16} />
                </button>
                <button onClick={() => openEdit(ev)} title="Edit"
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.4rem 0.6rem', cursor: 'pointer', color: '#C9A96E' }}>
                  <GoogleIcon name="edit" size={16} />
                </button>
                <button onClick={() => handleDelete(ev.id)} title="Delete"
                  style={{ background: 'transparent', border: '1px solid rgba(220,20,60,0.2)', borderRadius: 8, padding: '0.4rem 0.6rem', cursor: 'pointer', color: '#DC143C' }}>
                  <GoogleIcon name="delete" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} data-lenis-prevent="true">
          <div style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto' }} data-lenis-prevent="true">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontFamily: "'Cinzel', serif", color: '#f5ead6' }}>
                {editing ? 'Edit Event' : 'Create Event'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
            </div>

            <div className={s.formGrid}>
              <div className={`${s.field} ${s.formFull}`}>
                <label className={s.label}>Event Title *</label>
                <input className={s.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Full event name" />
              </div>

              <div className={`${s.field} ${s.formFull}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <label className={s.label} style={{ margin: 0 }}>Event Cover Image</label>
                  <div style={{ fontSize: '0.75rem', color: '#C9A96E', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <GoogleIcon name="aspect_ratio" size={15} />
                    <span>📐 Recommended: 1200 × 675 px (16:9 ratio) • Max 2MB</span>
                  </div>
                </div>

                {eventImageDim && (eventImageDim.width > 1200 || eventImageDim.height > 675 || Math.abs((eventImageDim.width / eventImageDim.height) - (16/9)) > 0.05) && (
                  <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', padding: '0.5rem 0.85rem', borderRadius: 6, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', color: '#FCD34D' }}>
                      ⚠️ Dimensions: <strong>{eventImageDim.width} × {eventImageDim.height} px</strong> (Exceeds recommended 1200 × 675 px or non-16:9 ratio).
                    </span>
                    <button
                      type="button"
                      className={s.btnSecondary}
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem', borderColor: '#F59E0B', color: '#FCD34D', cursor: 'pointer' }}
                      disabled={eventCropping}
                      onClick={async () => {
                        if (!form.cover_image_url) return
                        setEventCropping(true)
                        try {
                          const cropped = await cropImageTo16_9(form.cover_image_url)
                          setForm(f => ({ ...f, cover_image_url: cropped }))
                          setEventImageDim({ width: 1200, height: 675 })
                        } catch (e) {
                          console.error('Event crop failed', e)
                        } finally {
                          setEventCropping(false)
                        }
                      }}
                    >
                      {eventCropping ? 'Cropping…' : '✂️ Auto-Crop & Optimize to 16:9 (1200×675)'}
                    </button>
                  </div>
                )}

                {form.cover_image_url ? (
                  <div style={{
                    position: 'relative',
                    borderRadius: 12,
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(0,0,0,0.5)',
                    marginBottom: '0.85rem',
                    maxWidth: 580
                  }}>
                    <div style={{ position: 'relative', width: '100%', height: 210, background: '#111' }}>
                      <img
                        src={form.cover_image_url}
                        alt="Event Cover Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '0.6rem',
                      padding: '0.75rem 1rem',
                      background: 'rgba(20, 24, 33, 0.95)',
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      alignItems: 'center',
                      flexWrap: 'wrap'
                    }}>
                      <button
                        type="button"
                        className={s.btnPrimary}
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#D97706', borderColor: '#B45309' }}
                        onClick={() => setShowEventCropModal(true)}
                        title="Open interactive manual crop to adjust frame & zoom"
                      >
                        <GoogleIcon name="crop" size={15} /> ✂️ Manual Crop
                      </button>

                      <button
                        type="button"
                        className={s.btnSecondary}
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                        disabled={eventCropping}
                        onClick={async () => {
                          if (!form.cover_image_url) return
                          setEventCropping(true)
                          try {
                            const cropped = await cropImageTo16_9(form.cover_image_url)
                            setForm(f => ({ ...f, cover_image_url: cropped }))
                            setEventImageDim({ width: 1200, height: 675 })
                          } catch (e) {
                            console.error('Event crop failed', e)
                          } finally {
                            setEventCropping(false)
                          }
                        }}
                        title="Auto crop center to 16:9"
                      >
                        <GoogleIcon name="auto_fix_high" size={15} /> ⚡ Auto-Crop 16:9
                      </button>

                      <button
                        type="button"
                        className={s.btnSecondary}
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                        onClick={() => eventFileRef.current?.click()}
                        title="Upload a new banner image file"
                      >
                        <GoogleIcon name="cached" size={15} /> Replace Banner
                      </button>

                      <button
                        type="button"
                        className={s.btnDanger}
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px', marginLeft: 'auto' }}
                        onClick={() => {
                          if (confirm('Delete current event cover banner?')) {
                            setForm(f => ({ ...f, cover_image_url: '' }))
                            setEventImageDim(null)
                          }
                        }}
                        title="Delete current banner"
                      >
                        <GoogleIcon name="delete" size={15} /> Delete Banner
                      </button>
                    </div>

                    {showEventCropModal && (
                      <ManualImageCropperModal
                        imageSrc={form.cover_image_url}
                        title="Manual Crop Event Banner"
                        defaultRatio={16 / 9}
                        onClose={() => setShowEventCropModal(false)}
                        onSaveCrop={(cropped) => {
                          setForm(f => ({ ...f, cover_image_url: cropped }))
                          setEventImageDim({ width: 1200, height: 675 })
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>
                    No event cover image set. Upload an image file or paste an image URL below.
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    ref={eventFileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={async e => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      try {
                        const comp = await compressImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.85 })
                        setForm(f => ({ ...f, cover_image_url: comp.dataUrl }))
                      } catch (err) {
                        console.error('Event image compress error', err)
                      }
                    }}
                  />
                  <button
                    type="button"
                    className={s.btnSecondary}
                    onClick={() => eventFileRef.current?.click()}
                  >
                    <GoogleIcon name="upload_file" size={16} style={{ marginRight: 6 }} /> Choose Event Image
                  </button>
                  <input
                    className={s.input}
                    style={{ flex: 1, minWidth: 220 }}
                    value={form.cover_image_url || ''}
                    onChange={e => setForm(f => ({ ...f, cover_image_url: e.target.value }))}
                    placeholder="Or paste direct event image URL (https://...)"
                  />
                </div>
              </div>

              <div className={s.field}>
                <label className={s.label}>Stream</label>
                <select className={s.select} value={form.stream} onChange={e => setForm(f => ({ ...f, stream: e.target.value as AdminEvent['stream'] }))}>
                  <option value="mardini">Mission Mardini</option>
                  <option value="shakti-bhava">Shakti Bhava</option>
                  <option value="shakti-varta">Shakti Varta</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Format</label>
                <select className={s.select} value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value as AdminEvent['format'] }))}>
                  <option value="on-ground">On-Ground</option>
                  <option value="digital">Digital</option>
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GoogleIcon name="calendar_today" size={15} style={{ color: '#FFFFFF' }} />
                  <span>Start Date *</span>
                </label>
                <input
                  className={s.input}
                  type="date"
                  style={{ colorScheme: 'dark' }}
                  value={form.date}
                  onChange={e => handleDateChange(e.target.value)}
                  required
                />
              </div>

              <div className={s.field}>
                <label className={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GoogleIcon name="event" size={15} style={{ color: '#FFFFFF' }} />
                  <span>End Date (optional)</span>
                </label>
                <input
                  className={s.input}
                  type="date"
                  style={{ colorScheme: 'dark' }}
                  value={form.end_date || ''}
                  onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                />
              </div>

              <div className={s.field}>
                <label className={s.label}>Status</label>
                <select
                  className={s.select}
                  value={form.status}
                  onChange={e => {
                    const nextVal = e.target.value as AdminEvent['status']
                    const isPast = Boolean(form.date && form.date < getTodayDateStr())
                    if (isPast && nextVal === 'upcoming') return
                    setForm(f => ({ ...f, status: nextVal }))
                  }}
                >
                  <option
                    value="upcoming"
                    disabled={Boolean(form.date && form.date < getTodayDateStr())}
                  >
                    Upcoming {Boolean(form.date && form.date < getTodayDateStr()) ? '(Unavailable for past dates)' : ''}
                  </option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {Boolean(form.date && form.date < getTodayDateStr()) && (
                  <div style={{ fontSize: '0.74rem', color: '#F59E0B', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <GoogleIcon name="lock" size={14} style={{ color: '#F59E0B' }} />
                    <span>Past date: Event is automatically marked as <strong>Completed</strong> and cannot be set to Upcoming.</span>
                  </div>
                )}
              </div>

              <div className={s.field}>
                <label className={s.label}>Theme Category</label>
                <select className={s.select} value={form.theme_category || ''} onChange={e => setForm(f => ({ ...f, theme_category: e.target.value }))}>
                  <option value="">None</option>
                  <option value="national-symposia">National Symposia & Policy Forums</option>
                  <option value="tactical-camps">Tactical & Somatic Camps / Mission Mardini</option>
                  <option value="academic-deployments">Academic & Institutional Deployments</option>
                  <option value="community-assemblies">Community Stabilisation & Civil Assemblies</option>
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Attribution Role</label>
                <select className={s.select} value={form.attribution || ''} onChange={e => setForm(f => ({ ...f, attribution: e.target.value }))}>
                  <option value="">Select role</option>
                  <option value="Organised by Shakti Sabha">Organised by Shakti Sabha</option>
                  <option value="Independent">Independent</option>
                  <option value="Collaborative">Collaborative</option>
                  <option value="Keynote Speaker">Keynote Speaker</option>
                  <option value="Guest Speaker">Guest Speaker</option>
                  <option value="Trainer">Trainer</option>
                  <option value="Panelist">Panelist</option>
                  <option value="Participant">Participant</option>
                  <option value="Collaborator">Collaborator</option>
                  <option value="Under another organisation">Under another organisation</option>
                </select>
              </div>

              <div className={`${s.field} ${s.formFull}`}>
                <label className={s.label}>Location</label>
                <input className={s.input} value={form.location || ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="City, State / Online" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Region</label>
                <input className={s.input} value={form.region || ''} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} placeholder="e.g. Maharashtra" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Approx. Participant Count</label>
                <input className={s.input} type="number" value={form.participant_count || ''} onChange={e => setForm(f => ({ ...f, participant_count: parseInt(e.target.value) || undefined }))} placeholder="e.g. 500" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Capacity (seats)</label>
                <input className={s.input} type="number" value={form.capacity || ''} onChange={e => setForm(f => ({ ...f, capacity: parseInt(e.target.value) || undefined }))} />
              </div>

              <div className={s.field}>
                <label className={s.label}>Registered Count</label>
                <input className={s.input} type="number" value={form.registered_count} onChange={e => setForm(f => ({ ...f, registered_count: parseInt(e.target.value) || 0 }))} />
              </div>

              <div className={s.field}>
                <label className={s.label}>Pricing</label>
                <input className={s.input} value={form.pricing || ''} onChange={e => setForm(f => ({ ...f, pricing: e.target.value }))} placeholder="e.g. ₹2,500 or Free" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Is Free?</label>
                <select className={s.select} value={form.is_free ? 'yes' : 'no'} onChange={e => setForm(f => ({ ...f, is_free: e.target.value === 'yes' }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className={`${s.field} ${s.formFull}`}>
                <label className={s.label}>Meeting Link (if digital)</label>
                <input className={s.input} value={form.meeting_link || ''} onChange={e => setForm(f => ({ ...f, meeting_link: e.target.value }))} placeholder="https://..." />
              </div>

              <div className={`${s.field} ${s.formFull}`}>
                <label className={s.label}>Curriculum PDF URL</label>
                <input className={s.input} value={form.curriculum_pdf_url || ''} onChange={e => setForm(f => ({ ...f, curriculum_pdf_url: e.target.value }))} placeholder="https://..." />
              </div>

              <div className={`${s.field} ${s.formFull}`}>
                <label className={s.label}>Description</label>
                <textarea className={s.textarea} style={{ minHeight: 80 }} value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short event description..." />
              </div>

              <div className={s.field}>
                <label className={s.label}>Published (visible on site)</label>
                <select className={s.select} value={form.published ? 'yes' : 'no'} onChange={e => setForm(f => ({ ...f, published: e.target.value === 'yes' }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No (draft)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className={s.btnSecondary} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={s.btnPrimary} onClick={handleSave} disabled={saving || !form.title || !form.date}>
                <GoogleIcon name="save" size={18} />
                {saving ? 'Saving…' : (editing ? 'Save Changes' : 'Create Event')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ============================================================
   THE SHAKTI DISPATCH & WEEKLY INSIGHTS SECTION
   ============================================================ */
interface DispatchSubscriber {
  id: string
  email: string
  created_at: string
  status: 'Active' | 'Unsubscribed'
  source?: string
}

interface DispatchIssue {
  id: string
  issueNo: number
  title: string
  date: string
  heroineTopic: string
  psychologyTopic: string
  status: 'Published' | 'Draft'
}

function DispatchSection() {
  const [subscribers, setSubscribers] = useState<DispatchSubscriber[]>([])
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)

  const DEFAULT_ISSUES: DispatchIssue[] = [
    { id: 'iss_14', issueNo: 14, title: 'रानी अब्बक्का चौटा — नौसैनिक व्यूहरचना एवं तटीय संप्रभुता', date: '2024-10-25', heroineTopic: 'रानी अब्बक्का (उल्लाल)', psychologyTopic: 'शारीरिक भय-मुक्ति व त्वरित निर्णय क्षमता', status: 'Published' },
    { id: 'iss_13', issueNo: 13, title: 'महिलाओं में High-Functioning Anxiety के दैहिक लक्षण', date: '2024-10-18', heroineTopic: 'गार्गी वाचक्नवी', psychologyTopic: 'सोमैटिक ग्राउंडिंग और केयरगिवर गिल्ट का निवारण', status: 'Published' },
    { id: 'iss_12', issueNo: 12, title: 'गार्गी वाचक्नवी और उपनिषदकालीन बौद्धिक स्वाभिमान', date: '2024-10-11', heroineTopic: 'वैदिक विदुषियां', psychologyTopic: 'दार्शनिक दृढ़ता एवं नैतिक साहस', status: 'Published' },
  ]

  const loadSubscribers = () => {
    try {
      const local = localStorage.getItem('shakti_dispatch_subscribers')
      if (local) {
        setSubscribers(JSON.parse(local))
      } else {
        const seed: DispatchSubscriber[] = [
          { id: 'sub_1', email: 'meera.joshi@gmail.com', created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), status: 'Active', source: 'The Shakti Dispatch Footer' },
          { id: 'sub_2', email: 'priya.kulkarni@yahoo.co.in', created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(), status: 'Active', source: 'Weekly Insights Form' },
          { id: 'sub_3', email: 'dr.shweta.m@gmail.com', created_at: new Date(Date.now() - 3600000 * 24 * 8).toISOString(), status: 'Active', source: 'Article Reader Page' },
          { id: 'sub_4', email: 'kavita.deshmukh@outlook.com', created_at: new Date(Date.now() - 3600000 * 24 * 12).toISOString(), status: 'Active', source: 'The Shakti Dispatch Form' },
        ]
        localStorage.setItem('shakti_dispatch_subscribers', JSON.stringify(seed))
        setSubscribers(seed)
      }
    } catch (e) {
      console.warn('Dispatch load error:', e)
    }
  }

  useEffect(() => {
    loadSubscribers()
    const onStorage = () => loadSubscribers()
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const handleAddSubscriber = () => {
    if (!newEmail.trim() || !newEmail.includes('@')) {
      setAlert({ type: 'error', msg: 'Please enter a valid email address.' })
      return
    }
    const item: DispatchSubscriber = {
      id: `sub_${Date.now()}`,
      email: newEmail.trim().toLowerCase(),
      created_at: new Date().toISOString(),
      status: 'Active',
      source: 'Admin Manual Add'
    }
    const updated = [item, ...subscribers.filter(s => s.email.toLowerCase() !== item.email)]
    localStorage.setItem('shakti_dispatch_subscribers', JSON.stringify(updated))
    setSubscribers(updated)
    setNewEmail('')
    setShowAddModal(false)
    setAlert({ type: 'success', msg: `${item.email} added to The Shakti Dispatch successfully!` })
  }

  const handleDeleteSubscriber = (id: string, email: string) => {
    if (!confirm(`Remove ${email} from The Shakti Dispatch subscriber list?`)) return
    const updated = subscribers.filter(s => s.id !== id)
    localStorage.setItem('shakti_dispatch_subscribers', JSON.stringify(updated))
    setSubscribers(updated)
    setAlert({ type: 'success', msg: `${email} unsubscribed.` })
  }

  const handleExportCSV = () => {
    const headers = ['Email', 'Subscribed At', 'Status', 'Source']
    const rows = subscribers.map(s => [s.email, new Date(s.created_at).toLocaleDateString('en-IN'), s.status, s.source || 'Website'])
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'shakti_dispatch_subscribers.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredSubs = subscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {alert && <div className={`${s.alert} ${alert.type === 'error' ? s.alertError : s.alertSuccess}`}>{alert.msg}</div>}

      {/* ── HEADER BANNER ── */}
      <div style={{ background: 'linear-gradient(135deg, rgba(220,20,60,0.15) 0%, rgba(201,169,110,0.1) 100%)', border: '1px solid rgba(220,20,60,0.3)', borderRadius: 16, padding: '1.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A96E', fontWeight: 700 }}>
              Weekly Insights Desk
            </span>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.6rem', color: '#F9FAFB', margin: '0.35rem 0 0.5rem' }}>
              The Shakti Dispatch
            </h2>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', fontSize: '0.92rem', maxWidth: 640, lineHeight: 1.6, fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              हर सप्ताह — एक नया शोध, एक विस्मृत वीरांगना की गाथा, और मनोवैज्ञानिक संबल। सीधा आपके इनबॉक्स में।
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className={s.btnSecondary} onClick={handleExportCSV} style={{ fontSize: '0.82rem' }}>
              <GoogleIcon name="download" size={16} /> Export Subscribers CSV
            </button>
            <button className={s.btnPrimary} onClick={() => setShowAddModal(true)} style={{ fontSize: '0.82rem' }}>
              <GoogleIcon name="person_add" size={16} /> Add Subscriber
            </button>
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '0.85rem 1.1rem' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F9FAFB' }}>{subscribers.length}</div>
            <div style={{ fontSize: '0.76rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Subscribers</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '0.85rem 1.1rem' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10B981' }}>100%</div>
            <div style={{ fontSize: '0.76rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active Status</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '0.85rem 1.1rem' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#C9A96E' }}>14</div>
            <div style={{ fontSize: '0.76rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Weekly Issues Published</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '0.85rem 1.1rem' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#DC143C', marginTop: 4 }}>Upcoming Friday</div>
            <div style={{ fontSize: '0.76rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Next Issue Schedule</div>
          </div>
        </div>
      </div>

      {/* ── SUBSCRIBERS TABLE ── */}
      <div className={s.sectionHeader}>
        <div>
          <span className={s.sectionTitle}>
            Newsletter Subscribers ({filteredSubs.length})
          </span>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#888' }}>
            Readers receiving weekly research white papers, psychology breakdowns, and warrior histories
          </p>
        </div>

        <input
          className={s.input}
          style={{ width: 220, fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}
          placeholder="Search by email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className={s.tableWrap} style={{ marginBottom: '2.5rem' }}>
        {filteredSubs.length === 0 ? (
          <div className={s.empty}>
            <div className={s.emptyIcon}><GoogleIcon name="mail" size={44} style={{ color: 'rgba(255,255,255,0.2)' }} /></div>
            <div className={s.emptyText}>No subscribers found</div>
          </div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Subscriber Email</th>
                <th>Joined Date</th>
                <th>Status</th>
                <th>Acquisition Channel</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubs.map(sub => (
                <tr key={sub.id}>
                  <td style={{ fontWeight: 600, color: '#F9FAFB' }}>{sub.email}</td>
                  <td style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
                    {new Date(sub.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <span className={`${s.badge} ${s.badgeGreen}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
                    {sub.source || 'Website Dispatch Box'}
                  </td>
                  <td>
                    <button
                      className={s.btnDanger}
                      style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                      onClick={() => handleDeleteSubscriber(sub.id, sub.email)}
                    >
                      Unsubscribe
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── RECENT WEEKLY ISSUES REPOSITORY ── */}
      <div className={s.sectionHeader}>
        <div>
          <span className={s.sectionTitle}>
            Recent Dispatch Issues
          </span>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#888' }}>
            Archived newsletters broadcasted to the subscriber list
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {DEFAULT_ISSUES.map(iss => (
          <div key={iss.id} style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#DC143C', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Issue #{iss.issueNo}
              </span>
              <span className={`${s.badge} ${s.badgeGreen}`} style={{ fontSize: '0.7rem' }}>{iss.status}</span>
            </div>
            <h4 style={{ color: '#F9FAFB', margin: '0 0 0.65rem', fontSize: '0.98rem', lineHeight: 1.4, fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              {iss.title}
            </h4>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div>⚔️ <strong>वीरांगना गाथा:</strong> {iss.heroineTopic}</div>
              <div>🧠 <strong>मनोवैज्ञानिक संबल:</strong> {iss.psychologyTopic}</div>
            </div>
            <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.75rem', color: '#6B7280' }}>
              Broadcast date: {iss.date}
            </div>
          </div>
        ))}
      </div>

      {/* ── ADD SUBSCRIBER MODAL ── */}
      {showAddModal && (
        <div className={s.overlay} data-lenis-prevent="true" onClick={() => setShowAddModal(false)}>
          <div className={s.modal} data-lenis-prevent="true" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <h2 className={s.modalTitle}>Add Dispatch Subscriber</h2>
            <button className={s.modalClose} onClick={() => setShowAddModal(false)}><GoogleIcon name="close" size={18} /></button>
            <div className={s.field} style={{ margin: '1rem 0 1.5rem' }}>
              <label className={s.label}>Subscriber Email Address *</label>
              <input
                type="email"
                className={s.input}
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="name@example.com"
                autoFocus
              />
            </div>
            <div className={s.modalActions}>
              <button className={s.btnSecondary} onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className={s.btnPrimary} onClick={handleAddSubscriber}>Add to Dispatch</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
