import { useEffect, useMemo, useRef, useCallback, useState, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import './DomeGallery.css'

export interface DomeGalleryImage {
  src: string
  alt?: string
  tag?: string
  desc?: string
}

export interface DomeGalleryProps {
  images?: (string | DomeGalleryImage)[]
  fit?: number
  fitBasis?: 'auto' | 'min' | 'max' | 'width' | 'height'
  minRadius?: number
  maxRadius?: number
  padFactor?: number
  overlayBlurColor?: string
  maxVerticalRotationDeg?: number
  dragSensitivity?: number
  enlargeTransitionMs?: number
  segments?: number
  dragDampening?: number
  openedImageWidth?: string
  openedImageHeight?: string
  imageBorderRadius?: string
  openedImageBorderRadius?: string
  grayscale?: boolean
  autoRotateSpeed?: number
}

export const DEFAULT_SHAKTI_IMAGES: DomeGalleryImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&auto=format&fit=crop&q=80',
    alt: 'Village Defense & Lathi-Kaushal Camp',
    tag: 'MARDINI · LATHI',
    desc: '340 women trained in traditional bamboo staff combat and evasive footwork in Nagpur district.'
  },
  {
    src: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80',
    alt: 'Revival of Bharatiya Sword Combat',
    tag: 'MARTIAL HERITAGE',
    desc: 'Preserving ancient Maratha fencing techniques, wrist parries, and spatial awareness drills.'
  },
  {
    src: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    alt: 'Biomechanical Self-Defense Drill',
    tag: 'MISSION MARDINI',
    desc: 'Escapes from rear chokeholds, wrist locks, and emergency voice projection.'
  },
  {
    src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    alt: 'Survivor Healing Circle',
    tag: 'SHAKTI BHAVA',
    desc: 'Confidential psychological support and trauma recovery circles guided by licensed therapists.'
  },
  {
    src: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&auto=format&fit=crop&q=80',
    alt: 'Shakti Varta Academic Symposium',
    tag: 'THOUGHT-LAB',
    desc: 'Scholars and advocates addressing legal loopholes in domestic protection frameworks.'
  },
  {
    src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    alt: 'Youth Warrior Leadership Graduation',
    tag: 'LEADERSHIP',
    desc: 'High school girls completing the 6-week Shakti Sabha character and fitness certification.'
  },
  {
    src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    alt: 'School Campus Safety Assembly',
    tag: 'SCHOOL OUTREACH',
    desc: 'Interactive workshop reaching over 500 adolescent girls in government higher secondary schools.'
  },
  {
    src: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    alt: 'Rural Women Micro-Enterprise Meet',
    tag: 'SAHYOG ALLIANCE',
    desc: 'Grassroots self-help collective establishing dignified local economic autonomy.'
  },
  {
    src: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=80',
    alt: 'Peer Support & Counseling Collective',
    tag: 'SHAKTI BHAVA',
    desc: 'Breaking generational silence around domestic violence, PTSD, and social stigma.'
  },
  {
    src: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=80',
    alt: 'Community Volunteer Mobilization',
    tag: 'VOLUNTEERS',
    desc: 'Sahyog student interns and village youth coordinating on-ground camp logistics.'
  },
  {
    src: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=800&auto=format&fit=crop&q=80',
    alt: 'Outdoor Physical Conditioning',
    tag: 'WARRIOR SPIRIT',
    desc: 'Endurance, situational agility, and teamwork in dawn training sessions.'
  },
  {
    src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    alt: 'Legal Awareness & BNS Rights Lecture',
    tag: 'LEGAL COLLAGE',
    desc: 'Equipping rural women with knowledge of immediate legal protections and FIR filings.'
  },
]

const DEFAULTS = {
  maxVerticalRotationDeg: 8,
  dragSensitivity: 20,
  enlargeTransitionMs: 300,
  segments: 35
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)
const wrapAngleSigned = (deg: number) => {
  const a = (((deg + 180) % 360) + 360) % 360
  return a - 180
}

interface TileCoords {
  x: number
  y: number
  sizeX: number
  sizeY: number
  src: string
  alt: string
  tag?: string
  desc?: string
}

function buildItems(pool: (string | DomeGalleryImage)[], seg: number): TileCoords[] {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2)
  const evenYs = [-4, -2, 0, 2, 4]
  const oddYs = [-3, -1, 1, 3, 5]

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs
    return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }))
  })

  const totalSlots = coords.length
  if (pool.length === 0) {
    return coords.map(c => ({ ...c, src: '', alt: '' }))
  }

  const normalizedImages: DomeGalleryImage[] = pool.map(image => {
    if (typeof image === 'string') {
      return { src: image, alt: '' }
    }
    return {
      src: image.src || '',
      alt: image.alt || '',
      tag: image.tag || 'SHAKTI ARCHIVE',
      desc: image.desc || ''
    }
  })

  const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length])

  for (let i = 1; i < usedImages.length; i++) {
    if (usedImages[i].src === usedImages[i - 1].src) {
      for (let j = i + 1; j < usedImages.length; j++) {
        if (usedImages[j].src !== usedImages[i].src) {
          const tmp = usedImages[i]
          usedImages[i] = usedImages[j]
          usedImages[j] = tmp
          break
        }
      }
    }
  }

  return coords.map((c, i) => ({
    ...c,
    src: usedImages[i].src,
    alt: usedImages[i].alt || 'Shakti Sabha on-ground archival photo',
    tag: usedImages[i].tag,
    desc: usedImages[i].desc
  }))
}

export default function DomeGallery({
  images = DEFAULT_SHAKTI_IMAGES,
  fit = 0.45,
  fitBasis = 'auto',
  minRadius = 480,
  maxRadius = 1100,
  padFactor = 0.22,
  overlayBlurColor = '#0A0A0B',
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  segments = DEFAULTS.segments,
  dragDampening = 2,
  imageBorderRadius = '20px',
  openedImageBorderRadius = '24px',
  grayscale = false,
  autoRotateSpeed = 0.1
}: DomeGalleryProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const mainRef = useRef<HTMLElement | null>(null)
  const sphereRef = useRef<HTMLDivElement | null>(null)

  const rotationRef = useRef({ x: 0, y: 0 })
  const startRotRef = useRef({ x: 0, y: 0 })
  const startPosRef = useRef<{ x: number; y: number } | null>(null)
  const draggingRef = useRef(false)
  const movedRef = useRef(false)
  const inertiaRAF = useRef<number | null>(null)

  // Lightbox modal state for clicked images
  const [modalImage, setModalImage] = useState<DomeGalleryImage | null>(null)

  const items = useMemo(() => buildItems(images, segments), [images, segments])

  const applyTransform = (xDeg: number, yDeg: number) => {
    const el = sphereRef.current
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`
    }
  }

  // Continuous smooth horizontal autorotation
  useEffect(() => {
    let animId: number
    const autoRotate = () => {
      if (!draggingRef.current && !modalImage && !inertiaRAF.current) {
        rotationRef.current.y = wrapAngleSigned(rotationRef.current.y + autoRotateSpeed)
        applyTransform(rotationRef.current.x, rotationRef.current.y)
      }
      animId = requestAnimationFrame(autoRotate)
    }
    animId = requestAnimationFrame(autoRotate)
    return () => cancelAnimationFrame(animId)
  }, [autoRotateSpeed, modalImage])

  const lockedRadiusRef = useRef<number | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect
      const w = Math.max(1, cr.width),
        h = Math.max(1, cr.height)
      const minDim = Math.min(w, h),
        maxDim = Math.max(w, h),
        aspect = w / h
      let basis: number
      switch (fitBasis) {
        case 'min':
          basis = minDim
          break
        case 'max':
          basis = maxDim
          break
        case 'width':
          basis = w
          break
        case 'height':
          basis = h
          break
        default:
          basis = aspect >= 1.3 ? w : minDim
      }
      let radius = basis * fit
      const heightGuard = h * 1.35
      radius = Math.min(radius, heightGuard)
      const effectiveMinRadius = w < 600 ? Math.min(minRadius, w * 0.72) : minRadius
      radius = clamp(radius, effectiveMinRadius, maxRadius)
      lockedRadiusRef.current = Math.round(radius)

      const viewerPad = Math.max(8, Math.round(minDim * padFactor))
      root.style.setProperty('--radius', `${lockedRadiusRef.current}px`)
      root.style.setProperty('--viewer-pad', `${viewerPad}px`)
      root.style.setProperty('--overlay-blur-color', overlayBlurColor)
      root.style.setProperty('--tile-radius', imageBorderRadius)
      root.style.setProperty('--enlarge-radius', openedImageBorderRadius)
      root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none')
      applyTransform(rotationRef.current.x, rotationRef.current.y)
    })
    ro.observe(root)
    return () => ro.disconnect()
  }, [
    fit,
    fitBasis,
    minRadius,
    maxRadius,
    padFactor,
    overlayBlurColor,
    grayscale,
    imageBorderRadius,
    openedImageBorderRadius
  ])

  useEffect(() => {
    applyTransform(rotationRef.current.x, rotationRef.current.y)
  }, [])

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current)
      inertiaRAF.current = null
    }
  }, [])

  const startInertia = useCallback(
    (vx: number, vy: number) => {
      const MAX_V = 1.4
      let vX = clamp(vx, -MAX_V, MAX_V) * 80
      let vY = clamp(vy, -MAX_V, MAX_V) * 80
      let frames = 0
      const d = clamp(dragDampening ?? 0.6, 0, 1)
      const frictionMul = 0.94 + 0.055 * d
      const stopThreshold = 0.015 - 0.01 * d
      const maxFrames = Math.round(90 + 270 * d)
      const step = () => {
        vX *= frictionMul
        vY *= frictionMul
        if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
          inertiaRAF.current = null
          return
        }
        if (++frames > maxFrames) {
          inertiaRAF.current = null
          return
        }
        const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg)
        const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200)
        rotationRef.current = { x: nextX, y: nextY }
        applyTransform(nextX, nextY)
        inertiaRAF.current = requestAnimationFrame(step)
      }
      stopInertia()
      inertiaRAF.current = requestAnimationFrame(step)
    },
    [dragDampening, maxVerticalRotationDeg, stopInertia]
  )

  // Drag interaction handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (modalImage) return
    stopInertia()
    draggingRef.current = true
    movedRef.current = false
    startRotRef.current = { ...rotationRef.current }
    startPosRef.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (modalImage || !draggingRef.current || !startPosRef.current) return
    const dxTotal = e.clientX - startPosRef.current.x
    const dyTotal = e.clientY - startPosRef.current.y
    if (!movedRef.current) {
      const dist2 = dxTotal * dxTotal + dyTotal * dyTotal
      if (dist2 > 16) movedRef.current = true
    }
    const nextX = clamp(
      startRotRef.current.x - dyTotal / dragSensitivity,
      -maxVerticalRotationDeg,
      maxVerticalRotationDeg
    )
    const nextY = wrapAngleSigned(startRotRef.current.y + dxTotal / dragSensitivity)
    if (rotationRef.current.x !== nextX || rotationRef.current.y !== nextY) {
      rotationRef.current = { x: nextX, y: nextY }
      applyTransform(nextX, nextY)
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (!draggingRef.current || !startPosRef.current) return
    const dxTotal = e.clientX - startPosRef.current.x
    const dyTotal = e.clientY - startPosRef.current.y
    draggingRef.current = false

    const vx = clamp((dxTotal / dragSensitivity) * 0.05, -1.2, 1.2)
    const vy = clamp((dyTotal / dragSensitivity) * 0.05, -1.2, 1.2)

    if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005) {
      startInertia(vx, vy)
    }
  }

  const handleTileClick = (it: TileCoords) => {
    if (movedRef.current) return
    setModalImage({
      src: it.src,
      alt: it.alt,
      tag: it.tag,
      desc: it.desc
    })
  }

  return (
    <>
      <div
        ref={rootRef}
        className="sphere-root"
        style={
          {
            '--segments-x': segments,
            '--segments-y': segments,
            '--overlay-blur-color': overlayBlurColor,
            '--tile-radius': imageBorderRadius,
            '--enlarge-radius': openedImageBorderRadius,
            '--image-filter': grayscale ? 'grayscale(1)' : 'none'
          } as CSSProperties
        }
      >
        <div className="edge-fade edge-fade--top" />
        <div className="edge-fade edge-fade--bottom" />

        <main
          ref={mainRef}
          className="sphere-main"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="stage">
            <div ref={sphereRef} className="sphere">
              {items.map((it, i) => (
                <div
                  key={`${it.x},${it.y},${i}`}
                  className="item"
                  data-src={it.src}
                  data-offset-x={it.x}
                  data-offset-y={it.y}
                  data-size-x={it.sizeX}
                  data-size-y={it.sizeY}
                  style={
                    {
                      '--offset-x': it.x,
                      '--offset-y': it.y,
                      '--item-size-x': it.sizeX,
                      '--item-size-y': it.sizeY
                    } as CSSProperties
                  }
                >
                  <div
                    className="item__image"
                    role="button"
                    tabIndex={0}
                    aria-label={it.alt || 'Open archival photograph'}
                    onClick={() => handleTileClick(it)}
                  >
                    <img src={it.src} draggable={false} alt={it.alt} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* ===== SHAKTI SABHA THEMED LIGHTBOX MODAL ===== */}
      <AnimatePresence>
        {modalImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="gallery-modal-overlay"
            onClick={() => setModalImage(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="gallery-modal-card"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setModalImage(null)}
                className="gallery-modal-close"
                aria-label="Close photo preview"
              >
                <X size={18} />
              </button>

              {/* High-res Image Container */}
              <div className="gallery-modal-image-box">
                <img
                  src={modalImage.src}
                  alt={modalImage.alt || 'Shakti Sabha media archive'}
                />
              </div>

              {/* Details & Caption */}
              <div className="gallery-modal-meta">
                {modalImage.tag && (
                  <span className="gallery-modal-tag">
                    {modalImage.tag}
                  </span>
                )}
                {modalImage.alt && (
                  <h3 className="gallery-modal-title">
                    {modalImage.alt}
                  </h3>
                )}
                {modalImage.desc && (
                  <p className="gallery-modal-desc">
                    {modalImage.desc}
                  </p>
                )}
                <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: '#C9A96E', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <GoogleIcon name="verified_user" size={16} /> Verified 12-Year On-Ground Archival Record
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
