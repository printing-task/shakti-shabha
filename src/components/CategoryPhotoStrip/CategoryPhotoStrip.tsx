import { useState } from 'react'
import { useCategoryPhotos } from '../../data/galleryStore'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import s from './CategoryPhotoStrip.module.css'

interface CategoryPhotoStripProps {
  categoryKeywords: string | string[]
  title: string
  subtitle?: string
  accentColor?: string
  fallbackUrls?: string[]
}

const DEFAULT_FALLBACKS: Record<string, string[]> = {
  mardini: [
    '/missionmirdani.jpg',
    '/IMG_20260908_201306.jpg',
    '/20260517_120756.jpg',
    '/sahog.jpg',
  ],
  shaktiBhava: [
    '/shaktibhava.jpg',
    '/socialworkk.jpg',
    '/counceling.jpg',
    '/harshitama\'am.jpg',
  ],
  shaktiVarta: [
    '/shaktivarta.jpg',
    '/articles.jpg',
    '/courses.jpg',
    '/sahog.jpg',
  ]
}

export default function CategoryPhotoStrip({
  categoryKeywords,
  title,
  subtitle,
  accentColor = '#DC143C',
  fallbackUrls = []
}: CategoryPhotoStripProps) {
  // Determine standard fallbacks based on keyword
  const keyStr = (Array.isArray(categoryKeywords) ? categoryKeywords.join(' ') : categoryKeywords).toLowerCase()
  const fallbacks = fallbackUrls.length > 0 ? fallbackUrls : (
    keyStr.includes('mardini') ? DEFAULT_FALLBACKS.mardini :
    keyStr.includes('varta') ? DEFAULT_FALLBACKS.shaktiVarta :
    DEFAULT_FALLBACKS.shaktiBhava
  )

  const photos = useCategoryPhotos(categoryKeywords, 4, fallbacks)
  const [activePhoto, setActivePhoto] = useState<{ url: string; caption?: string } | null>(null)

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <div>
          <div className={s.eyebrow} style={{ color: accentColor }}>
            <GoogleIcon name="photo_camera" size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Live Field &amp; Archive Photos
          </div>
          <h3 className={s.title}>{title}</h3>
          {subtitle && <p className={s.subtitle}>{subtitle}</p>}
        </div>
      </div>

      <div className={s.grid}>
        {photos.map((p, idx) => (
          <div
            key={idx}
            className={s.photoCard}
            onClick={() => setActivePhoto(p)}
          >
            <img src={p.url} alt={p.caption || title} loading="lazy" />
            <div className={s.overlay}>
              <div className={s.badge} style={{ background: p.isFromDb ? accentColor : 'rgba(0,0,0,0.6)' }}>
                {p.isFromDb ? 'Direct Field Capture' : 'Archive Reference'}
              </div>
              {p.caption && <div className={s.caption}>{p.caption}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className={s.lightbox} onClick={() => setActivePhoto(null)} data-lenis-prevent="true">
          <div className={s.lightboxContent} onClick={e => e.stopPropagation()}>
            <button className={s.closeBtn} onClick={() => setActivePhoto(null)}>
              <GoogleIcon name="close" size={20} />
            </button>
            <img src={activePhoto.url} alt={activePhoto.caption || title} />
            {activePhoto.caption && <p className={s.lightboxCaption}>{activePhoto.caption}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
