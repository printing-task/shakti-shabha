import { useState, useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  fetchCategories,
  fetchAllPhotos,
  GALLERY_UPDATE_EVENT,
  GalleryCategoryItem
} from '../data/galleryStore'
import DomeGallery, { DEFAULT_SHAKTI_IMAGES, type DomeGalleryImage } from '../components/DomeGallery/DomeGallery'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import gp from './GalleryPage.module.css'

const EXTRA_GALLERY_IMAGES: DomeGalleryImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&auto=format&fit=crop&q=80',
    alt: 'Lathi-Kaushal Dual Staff Defense',
    tag: 'MISSION MARDINI CAMPS',
    desc: 'Demonstration of two-handed defensive staff circular sweeps at the Wardha district camp.'
  },
  {
    src: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80',
    alt: 'Traditional Maratha Talwar Parries',
    tag: 'MISSION MARDINI CAMPS',
    desc: 'Practicing ancient sword stances, balance shifts, and rapid diagonal strikes.'
  },
  {
    src: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    alt: 'Joint-Lock & Escape Biomechanics',
    tag: 'MISSION MARDINI CAMPS',
    desc: 'Intensive tactile counter-assault training during the 5-day residential Mission Mardini camp.'
  },
  {
    src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    alt: 'Trauma Release & Peer Healing Circle',
    tag: 'COMMUNITY & SAHYOG',
    desc: 'Guided somatic therapy and group affirmation circles for domestic abuse survivors.'
  },
  {
    src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    alt: 'School Campus Street-Smart Training',
    tag: 'AARYAVEERA LEADERSHIP',
    desc: 'Empowering adolescent students with situational danger reflexes and confidence.'
  },
  {
    src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    alt: 'Mission Mardini Cadet Convocation',
    tag: 'MISSION MARDINI CAMPS',
    desc: 'Over 120 girls receiving their verified physical warrior certificates in Pune.'
  },
  {
    src: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=80',
    alt: 'Confidential Survivor Listening Circle',
    tag: 'COMMUNITY & SAHYOG',
    desc: 'Safe, empathetic space where women share personal journeys and receive emotional anchoring.'
  },
  {
    src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    alt: 'High School Legal Literacy Assembly',
    tag: 'AARYAVEERA LEADERSHIP',
    desc: 'Instructing female students on self-defense rights, emergency helplines, and legal remedies.'
  },
]

const ALL_IMAGES = [...DEFAULT_SHAKTI_IMAGES, ...EXTRA_GALLERY_IMAGES]
const INITIAL_IMAGE_LIMIT = 10
const VISIBLE_CATEGORY_COUNT = 3

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>('ALL')
  const [categories, setCategories] = useState<GalleryCategoryItem[]>([])
  const [dbImages, setDbImages] = useState<DomeGalleryImage[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [imageLimit, setImageLimit] = useState(INITIAL_IMAGE_LIMIT)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const loadMedia = () => {
    Promise.all([
      fetchAllPhotos(),
      fetchCategories()
    ]).then(([photos, cats]) => {
      setCategories(cats)
      const catMap = new Map<string, string>()
      cats.forEach(c => catMap.set(c.id, c.name.trim().toUpperCase()))

      if (photos.length > 0) {
        // Shuffle photos slightly so each visit is dynamic and fresh
        const shuffled = [...photos].sort(() => Math.random() - 0.5)
        const mapped: DomeGalleryImage[] = shuffled.map(p => ({
          src: p.url,
          alt: p.caption || 'Shakti Sabha Field Documentation',
          tag: p.category_id ? (catMap.get(p.category_id) || 'COMMUNITY') : 'COMMUNITY',
          desc: p.caption || 'Authentic on-ground field photograph',
        }))
        setDbImages(mapped)
      }
    }).catch(err => console.warn('Gallery photos fetch error:', err))
  }

  useEffect(() => {
    loadMedia()
    window.addEventListener(GALLERY_UPDATE_EVENT, loadMedia)
    window.addEventListener('storage', loadMedia)

    return () => {
      window.removeEventListener(GALLERY_UPDATE_EVENT, loadMedia)
      window.removeEventListener('storage', loadMedia)
    }
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [dropdownOpen])

  // Reset image limit when changing category
  const handleSelectCategory = (catName: string) => {
    setActiveCategory(catName)
    setImageLimit(INITIAL_IMAGE_LIMIT)
    setDropdownOpen(false)
  }

  const allGalleryImages = useMemo(() => {
    return [...dbImages, ...ALL_IMAGES]
  }, [dbImages])

  // Filtered by current category
  const filteredImages = useMemo(() => {
    if (activeCategory === 'ALL') return allGalleryImages
    return allGalleryImages.filter(img =>
      img.tag?.toLowerCase().includes(activeCategory.toLowerCase())
    )
  }, [activeCategory, allGalleryImages])

  // On-demand limited images for performance
  const displayedImages = useMemo(() => {
    return filteredImages.slice(0, imageLimit)
  }, [filteredImages, imageLimit])

  const hasMoreImages = filteredImages.length > imageLimit

  // Split categories: top 2-3 vs remaining
  const visibleCategories = useMemo(() => {
    return categories.slice(0, VISIBLE_CATEGORY_COUNT)
  }, [categories])

  const moreCategories = useMemo(() => {
    return categories.slice(VISIBLE_CATEGORY_COUNT)
  }, [categories])

  // Check if active category is inside the "more" dropdown
  const isMoreCategoryActive = useMemo(() => {
    return moreCategories.some(c => c.name.toLowerCase() === activeCategory.toLowerCase())
  }, [moreCategories, activeCategory])

  const activeCategoryObj = useMemo(() => {
    return moreCategories.find(c => c.name.toLowerCase() === activeCategory.toLowerCase())
  }, [moreCategories, activeCategory])

  return (
    <div className={gp.pageContainer}>
      {/* Header Bar */}
      <div className={gp.headerSection}>
        
        <span className={gp.badge}>
          SRS Section 7 · 12-Year Media Vault
        </span>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={gp.title}
        >
          Media & Impact <span className={gp.titleHighlight}>Gallery</span>
        </motion.h1>

        <p className={gp.hindiSubtitle}>
          Visual Archive · 12 Years of Living History
        </p>

        <p className={gp.desc}>
          Explore our interactive 3D media sphere archiving twelve years of on-ground camps,
          traditional Lathi-Kaushal combat, survivor circles, and village self-defense across Maharashtra.
        </p>

        {/* Compact Category Filter: Show 2-3 + Dropdown for remaining */}
        <div className={gp.filterRow}>
          {/* 1. All Media */}
          <button
            onClick={() => handleSelectCategory('ALL')}
            className={`${gp.filterBtn} ${activeCategory === 'ALL' ? gp.filterBtnActive : ''}`}
          >
            All Media
            <span className={gp.countPill}>{allGalleryImages.length}</span>
          </button>

          {/* 2. Top 2-3 Featured Categories */}
          {visibleCategories.map(cat => {
            const count = allGalleryImages.filter(img =>
              img.tag?.toLowerCase().includes(cat.name.toLowerCase()) ||
              img.tag?.toLowerCase().includes(cat.id.toLowerCase())
            ).length
            const isSelected = activeCategory === cat.name
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.name)}
                className={`${gp.filterBtn} ${isSelected ? gp.filterBtnActive : ''}`}
              >
                {cat.name}
                {count > 0 && <span className={gp.countPill}>{count}</span>}
              </button>
            )
          })}

          {/* 3. If a category from "more" is currently active, show it as an active pill */}
          {isMoreCategoryActive && activeCategoryObj && (
            <button
              onClick={() => handleSelectCategory(activeCategoryObj.name)}
              className={`${gp.filterBtn} ${gp.filterBtnActive}`}
            >
              {activeCategoryObj.name}
              <span className={gp.countPill}>
                {filteredImages.length}
              </span>
            </button>
          )}

          {/* 4. Dropdown for More Categories */}
          {moreCategories.length > 0 && (
            <div className={gp.dropdownWrapper} ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(o => !o)}
                className={`${gp.dropdownToggle} ${dropdownOpen ? gp.dropdownToggleActive : ''}`}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <span>
                  {isMoreCategoryActive ? 'Switch Category' : `More Categories (${moreCategories.length})`}
                </span>
                <span className={`${gp.arrowIcon} ${dropdownOpen ? gp.arrowOpen : ''}`}>▼</span>
              </button>

              {dropdownOpen && (
                <div className={gp.dropdownMenu} role="menu">
                  {moreCategories.map(cat => {
                    const count = allGalleryImages.filter(img =>
                      img.tag?.toLowerCase().includes(cat.name.toLowerCase()) ||
                      img.tag?.toLowerCase().includes(cat.id.toLowerCase())
                    ).length
                    const isSelected = activeCategory === cat.name
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCategory(cat.name)}
                        className={`${gp.dropdownItem} ${isSelected ? gp.dropdownItemActive : ''}`}
                        role="menuitem"
                      >
                        <span>{cat.name}</span>
                        <span className={gp.countPill}>{count}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Load More Images Button (avoids loading all images upfront) */}
        {hasMoreImages && (
          <div className={gp.loadMoreBar}>
            <button
              type="button"
              onClick={() => setImageLimit(prev => prev + 10)}
              className={gp.loadMoreBtn}
            >
              <GoogleIcon name="add_photo_alternate" size={16} />
              <span>Load More Photos ({filteredImages.length - imageLimit} remaining)</span>
            </button>
          </div>
        )}
      </div>

      {/* 3D Dome Gallery Sphere */}
      <div className={gp.sphereWrapper}>
        <DomeGallery
          images={displayedImages}
          fit={0.46}
          fitBasis="auto"
          minRadius={460}
          maxRadius={1150}
          padFactor={0.2}
          overlayBlurColor="#FFFFFF"
          maxVerticalRotationDeg={10}
          dragSensitivity={18}
          enlargeTransitionMs={320}
          segments={35}
          dragDampening={2}
          imageBorderRadius="18px"
          openedImageBorderRadius="20px"
          grayscale={false}
          autoRotateSpeed={0.12}
        />

        <div className={gp.interactiveHint}>
          <GoogleIcon name="touch_app" size={15} />
          <span>Drag or swipe in any direction to rotate the 3D sphere · Click any image to view details</span>
        </div>
      </div>

      {/* Bottom Archive Metrics */}
      <div className={gp.galleryFooter}>
        <div className={gp.footerGrid}>
          <div className={gp.statItem}>
            <span className={gp.statNum}>12+</span>
            <span className={gp.statText}>Years of Archive</span>
          </div>
          <div className={gp.statItem}>
            <span className={gp.statNum}>400+</span>
            <span className={gp.statText}>Schools Reached</span>
          </div>
          <div className={gp.statItem}>
            <span className={gp.statNum}>50,000+</span>
            <span className={gp.statText}>Women Trained</span>
          </div>
          <div className={gp.statItem}>
            <span className={gp.statNum}>100%</span>
            <span className={gp.statText}>On-Ground Documented</span>
          </div>
          <div>
            <button
              onClick={() => alert('Downloading official 12-Year Media & Press Kit (PDF)...')}
              style={{
                padding: '0.65rem 1.75rem',
                borderRadius: '9999px',
                background: '#DC143C',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                letterSpacing: '0.04em'
              }}
            >
              Download Press Kit (PDF) →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
