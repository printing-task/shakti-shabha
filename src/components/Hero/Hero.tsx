import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import s from './Hero.module.css'

gsap.registerPlugin(ScrollTrigger)

/* ============================================================
   Falling leaves engine
   ============================================================ */

const LEAF_PALETTE = [
  { fill: '#6aa84f', vein: '#2e5c1e' },
  { fill: '#8bc34a', vein: '#446a1c' },
  { fill: '#7cb342', vein: '#3e6a1e' },
  { fill: '#c8a02e', vein: '#7a5c14' },
  { fill: '#d9822b', vein: '#8a4a10' },
  { fill: '#c04a2a', vein: '#6e2414' },
  { fill: '#a8452a', vein: '#5c2010' },
] as const

function createLeafSprite(fill: string, vein: string): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 128
  const g = c.getContext('2d')!
  g.translate(64, 64)

  g.beginPath()
  g.moveTo(0, -58)
  g.bezierCurveTo(38, -35, 38, 20, 0, 48)
  g.bezierCurveTo(-38, 20, -38, -35, 0, -58)
  g.closePath()
  g.fillStyle = fill
  g.fill()

  g.strokeStyle = 'rgba(0,0,0,0.12)'
  g.lineWidth = 1.5
  g.stroke()

  g.beginPath()
  g.moveTo(0, -50)
  g.lineTo(0, 48)
  g.strokeStyle = vein
  g.lineWidth = 2
  g.stroke()

  g.lineWidth = 1
  for (let i = -3; i <= 2; i++) {
    const y = i * 11
    const spread = 16 - Math.abs(i) * 2
    g.beginPath()
    g.moveTo(0, y)
    g.lineTo(-spread, y - 9)
    g.moveTo(0, y)
    g.lineTo(spread, y - 9)
    g.stroke()
  }

  g.beginPath()
  g.moveTo(0, 48)
  g.quadraticCurveTo(2, 58, -2, 66)
  g.strokeStyle = vein
  g.lineWidth = 3
  g.lineCap = 'round'
  g.stroke()

  return c
}

function grayscaleClone(src: HTMLCanvasElement): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = src.width
  c.height = src.height
  const g = c.getContext('2d')!
  g.drawImage(src, 0, 0)
  const imgData = g.getImageData(0, 0, c.width, c.height)
  const d = imgData.data
  for (let i = 0; i < d.length; i += 4) {
    const a = d[i + 3]
    if (!a) continue
    const gray = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) | 0
    d[i] = gray
    d[i + 1] = gray
    d[i + 2] = gray
  }
  g.putImageData(imgData, 0, 0)
  return c
}

type LeafParticle = {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  scale: number
  rotX: number
  rotY: number
  rotZ: number
  vRotX: number
  vRotY: number
  vRotZ: number
  spriteIdx: number
  baseAlpha: number
  wobbleSeed: number
  wobbleSpeed: number
  update: (dt: number, bounds: { width: number; height: number }) => void
  draw: (ctx: CanvasRenderingContext2D, color: boolean) => void
}

function createParticle(
  bounds: { width: number; height: number },
  spritesColor: HTMLCanvasElement[],
  spritesGray: HTMLCanvasElement[]
): LeafParticle {
  const z = Math.random() * 0.8 + 0.2
  const p: LeafParticle = {
    x: Math.random() * bounds.width,
    y: Math.random() * bounds.height,
    z,
    vx: (Math.random() - 0.45) * 0.4,
    vy: (Math.random() * 0.45 + 0.35) * z,
    vz: (Math.random() - 0.5) * 0.0005,
    scale: (Math.random() * 0.25 + 0.2) * (0.6 + z * 0.6),
    rotX: Math.random() * Math.PI * 2,
    rotY: Math.random() * Math.PI * 2,
    rotZ: Math.random() * Math.PI * 2,
    vRotX: (Math.random() - 0.5) * 0.02,
    vRotY: (Math.random() - 0.5) * 0.03,
    vRotZ: (Math.random() - 0.5) * 0.015,
    spriteIdx: (Math.random() * spritesColor.length) | 0,
    baseAlpha: Math.random() * 0.25 + 0.6,
    wobbleSeed: Math.random() * 1000,
    wobbleSpeed: Math.random() * 0.015 + 0.008,
    update(dt, b) {
      this.wobbleSeed += this.wobbleSpeed * dt
      const wind = Math.sin(this.wobbleSeed) * 0.6
      this.x += (this.vx + wind) * dt
      this.y += this.vy * dt
      this.rotX += this.vRotX * dt
      this.rotY += this.vRotY * dt
      this.rotZ += this.vRotZ * dt
      this.z += this.vz * dt
      if (this.z < 0.2) this.z = 0.2
      if (this.z > 1) this.z = 1

      const pad = 60
      if (this.y > b.height + pad) {
        this.y = -pad
        this.x = Math.random() * b.width
      }
      if (this.x < -pad) this.x = b.width + pad
      if (this.x > b.width + pad) this.x = -pad
    },
    draw(ctx, color) {
      const sprite = color
        ? spritesColor[this.spriteIdx]
        : spritesGray[this.spriteIdx]
      ctx.save()
      ctx.translate(this.x, this.y)
      const cosY = Math.cos(this.rotY)
      const cosX = Math.cos(this.rotX)
      ctx.rotate(this.rotZ)
      ctx.scale(this.scale * cosY, this.scale * cosX)
      ctx.globalAlpha = this.baseAlpha * this.z
      ctx.drawImage(sprite, -64, -64)
      ctx.restore()
    },
  }
  return p
}

type LeavesEngine = {
  destroy: () => void
  setPointer: (x: number, y: number, active: boolean) => void
  setColorMode: (on: boolean) => void
}

function createLeavesEngine(
  grayCanvas: HTMLCanvasElement,
  revealCanvas: HTMLCanvasElement,
  container: HTMLElement
): LeavesEngine {
  const grayCtx = grayCanvas.getContext('2d')!
  const revealCtx = revealCanvas.getContext('2d')!

  const sceneCanvas = document.createElement('canvas')
  const sceneCtx = sceneCanvas.getContext('2d')!
  const maskCanvas = document.createElement('canvas')
  const maskCtx = maskCanvas.getContext('2d')!

  const spritesColor = LEAF_PALETTE.map((p) => createLeafSprite(p.fill, p.vein))
  const spritesGray = spritesColor.map(grayscaleClone)

  let width = 0
  let height = 0
  let dpr = 1
  let particles: LeafParticle[] = []
  const cfg = { width: 0, height: 0 }

  const initParticles = () => {
    const area = width * height
    const baseCount = Math.round(area / 36000)
    const count = Math.max(14, Math.min(baseCount, 40))
    particles = []
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(cfg, spritesColor, spritesGray))
    }
  }

  const resize = () => {
    const r = container.getBoundingClientRect()
    width = Math.max(1, Math.floor(r.width))
    height = Math.max(1, Math.floor(r.height))
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    for (const c of [grayCanvas, revealCanvas, sceneCanvas, maskCanvas]) {
      c.width = Math.round(width * dpr)
      c.height = Math.round(height * dpr)
    }
    grayCanvas.style.width = width + 'px'
    grayCanvas.style.height = height + 'px'
    revealCanvas.style.width = width + 'px'
    revealCanvas.style.height = height + 'px'
    grayCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
    revealCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
    sceneCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
    maskCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
    grayCtx.imageSmoothingQuality = 'high'
    revealCtx.imageSmoothingQuality = 'high'
    sceneCtx.imageSmoothingQuality = 'high'
    cfg.width = width
    cfg.height = height
    if (particles.length === 0) initParticles()
  }

  let pointerX = -9999
  let pointerY = -9999
  let pointerActive = false
  const pointerRadius = 150

  const setPointer = (x: number, y: number, active: boolean) => {
    pointerX = x
    pointerY = y
    pointerActive = active
  }

  let colorMode = false
  const setColorMode = (on: boolean) => {
    colorMode = on
  }

  let lastTime = 0
  let raf = 0
  let running = true

  const tick = (now: number) => {
    if (!running) return
    const dt = lastTime ? Math.min((now - lastTime) / 16.667, 3) : 1
    lastTime = now

    for (let i = 0; i < particles.length; i++) {
      particles[i].update(dt, cfg)
    }

    sceneCtx.clearRect(0, 0, width, height)
    for (let i = 0; i < particles.length; i++) {
      particles[i].draw(sceneCtx, true)
    }

    grayCtx.clearRect(0, 0, width, height)
    if (colorMode) {
      grayCtx.drawImage(sceneCanvas, 0, 0, width, height)
    } else {
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw(grayCtx, false)
      }
    }

    revealCtx.clearRect(0, 0, width, height)
    if (pointerActive && !colorMode) {
      maskCtx.clearRect(0, 0, width, height)
      const grad = maskCtx.createRadialGradient(
        pointerX,
        pointerY,
        0,
        pointerX,
        pointerY,
        pointerRadius
      )
      grad.addColorStop(0, 'rgba(0,0,0,1)')
      grad.addColorStop(0.7, 'rgba(0,0,0,0.65)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      maskCtx.fillStyle = grad
      maskCtx.beginPath()
      maskCtx.arc(pointerX, pointerY, pointerRadius, 0, Math.PI * 2)
      maskCtx.fill()

      revealCtx.save()
      revealCtx.drawImage(sceneCanvas, 0, 0, width, height)
      revealCtx.globalCompositeOperation = 'destination-in'
      revealCtx.drawImage(maskCanvas, 0, 0, width, height)
      revealCtx.restore()
    }

    raf = requestAnimationFrame(tick)
  }

  resize()
  raf = requestAnimationFrame(tick)

  const ro = new ResizeObserver(() => resize())
  ro.observe(container)

  return {
    destroy: () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
    },
    setPointer,
    setColorMode,
  }
}

/* ============================================================
   Hero Component
   ============================================================ */

export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const secRef = useRef<HTMLElement>(null)
  const downRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const grayCanvasRef = useRef<HTMLCanvasElement>(null)
  const revealCanvasRef = useRef<HTMLCanvasElement>(null)
  const leavesWrapRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<LeavesEngine | null>(null)

  const [colorMode, setColorMode] = useState(false)

  /* GSAP Entrance Animation */
  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      gsap.set(content, { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        '[data-hero="badge"]',
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
      .fromTo(
        '[data-hero="title"]',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.3'
      )
      .fromTo(
        '[data-hero="motto"]',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      )
      .fromTo(
        '[data-hero="desc"]',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.65 },
        '-=0.3'
      )
      .fromTo(
        '[data-hero="cta"]',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.3'
      )
      .fromTo(
        '[data-hero="metrics"]',
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.2'
      )
      .fromTo(
        '[data-hero="pillars"]',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.3'
      )
    }, secRef)

    return () => ctx.revert()
  }, [])

  /* Canvas Leaves Interaction */
  useEffect(() => {
    const gray = grayCanvasRef.current
    const reveal = revealCanvasRef.current
    const wrap = leavesWrapRef.current
    if (!gray || !reveal || !wrap) return

    const engine = createLeavesEngine(gray, reveal, wrap)
    engineRef.current = engine

    const toLocal = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onMove = (e: PointerEvent) => {
      const { x, y } = toLocal(e)
      engine.setPointer(x, y, true)
    }
    const onDown = (e: PointerEvent) => {
      const { x, y } = toLocal(e)
      engine.setPointer(x, y, true)
    }
    const onUp = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        engine.setPointer(-9999, -9999, false)
      }
    }
    const onLeave = () => engine.setPointer(-9999, -9999, false)

    const target: HTMLElement = secRef.current ?? wrap
    target.addEventListener('pointermove', onMove, { passive: true })
    target.addEventListener('pointerdown', onDown, { passive: true })
    target.addEventListener('pointerup', onUp, { passive: true })
    target.addEventListener('pointercancel', onUp, { passive: true })
    target.addEventListener('pointerleave', onLeave, { passive: true })

    return () => {
      engine.destroy()
      engineRef.current = null
      target.removeEventListener('pointermove', onMove)
      target.removeEventListener('pointerdown', onDown)
      target.removeEventListener('pointerup', onUp)
      target.removeEventListener('pointercancel', onUp)
      target.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  useEffect(() => {
    engineRef.current?.setColorMode(colorMode)
  }, [colorMode])

  /* @traf shrink & scale-down parallax scroll */
  useEffect(() => {
    const wrap = wrapperRef.current
    const hero = secRef.current
    const down = downRef.current
    if (!wrap || !hero) return

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.3,
      onUpdate: (self) => {
        const p = self.progress
        const scale = 1 - p * 0.12
        const yPercent = p * 8
        const radius = p * 24
        const shadowAlpha = p * 0.35
        hero.style.transform = `translate3d(0, ${yPercent}%, 0) scale(${scale})`
        hero.style.borderRadius = `${radius}px`
        hero.style.boxShadow = `0 25px 70px rgba(0, 0, 0, ${shadowAlpha})`

        if (down) {
          down.style.opacity = `${Math.max(0, 1 - p * 3.5)}`
        }
      },
    })

    return () => {
      st.kill()
    }
  }, [])

  const handleExplore = () => {
    const wrap = wrapperRef.current
    const nextEl = wrap?.nextElementSibling ?? secRef.current?.nextElementSibling
    if (nextEl) {
      nextEl.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
    }
  }

  return (
    <div ref={wrapperRef} className={s.heroWrapper}>
      <section
        ref={secRef}
        className={s.heroSection}
        data-color={colorMode ? 'true' : 'false'}
        onPointerEnter={() => setColorMode(true)}
        onPointerLeave={() => setColorMode(false)}
      >
        <div ref={leavesWrapRef} className={s.leavesWrap} aria-hidden="true">
          <canvas ref={grayCanvasRef} className={s.leavesCanvas} />
          <canvas ref={revealCanvasRef} className={s.revealCanvas} />
        </div>

        <div ref={contentRef} className={s.heroContent}>
          {/* Institutional Badge */}
          <div data-hero="badge" className={s.badge}>
            <GoogleIcon name="swords" size={15} style={{ color: '#DC143C' }} />
            <span>THE UNION OF PEACE &amp; REVOLUTION</span>
          </div>

          {/* Main Title */}
          <h1 data-hero="title" className={s.title}>
            SHAKTI <span className={s.crimson}>SABHA</span>
          </h1>

          {/* Motto Row */}
          <div data-hero="motto" className={s.mottoRow}>
            <span className={s.mottoSanskrit}>शक्त्या शान्तिः</span>
            <span className={s.mottoSep}>·</span>
            <span className={s.mottoSub}>Sovereignty, Strength &amp; Psychological Resilience</span>
          </div>

          {/* Description */}
          <p data-hero="desc" className={s.description}>
            A sovereign institutional movement for Indian women — uniting tactical close-quarter combat, trauma-informed clinical psychological care, and uncompromising civilizational scholarship.
          </p>

          {/* Action CTAs */}
          <div data-hero="cta" className={s.ctaGroup}>
            <button
              type="button"
              onClick={handleExplore}
              className={s.ctaPrimary}
            >
              Explore The Three Streams ↓
            </button>
            <Link to="/sahyog" className={s.ctaSecondary}>
              Institutional Alliances →
            </Link>
          </div>

          {/* Institutional Metric Strip */}
          <div data-hero="metrics" className={s.metricStrip}>
            <div className={s.metricItem}>
              <span className={s.metricValue}>12+ Yrs</span>
              <span className={s.metricLabel}>On-Ground Dedication</span>
            </div>
            <div className={s.metricDivider} />
            <div className={s.metricItem}>
              <span className={s.metricValue}>2,000+</span>
              <span className={s.metricLabel}>Cadets Weaponized</span>
            </div>
            <div className={s.metricDivider} />
            <div className={s.metricItem}>
              <span className={s.metricValue}>25,000+</span>
              <span className={s.metricLabel}>Youth Reached</span>
            </div>
            <div className={s.metricDivider} />
            <div className={s.metricItem}>
              <span className={s.metricValue}>100%</span>
              <span className={s.metricLabel}>Confidential Care</span>
            </div>
          </div>

          {/* The Three Pillars Preview */}
          <div data-hero="pillars" className={s.pillarsRow}>
            <Link to="/mardini" className={s.pillarPill} title="Mission Mardini Tactical Combat">
              <span className={s.pillarDot} style={{ background: '#DC143C' }} />
              <span className={s.pillarName}>01 · Combat</span>
              <span className={s.pillarTag}>Mission Mardini</span>
            </Link>
            <Link to="/shakti-bhava" className={s.pillarPill} title="Shakti Bhava Clinical Healing">
              <span className={s.pillarDot} style={{ background: '#166534' }} />
              <span className={s.pillarName}>02 · Healing</span>
              <span className={s.pillarTag}>Shakti Bhava</span>
            </Link>
            <Link to="/shakti-varta" className={s.pillarPill} title="Shakti Varta Civilizational Discourse">
              <span className={s.pillarDot} style={{ background: '#4338CA' }} />
              <span className={s.pillarName}>03 · Discourse</span>
              <span className={s.pillarTag}>Shakti Varta</span>
            </Link>
          </div>
        </div>

        {/* Scroll Down Chevron */}
        <div
          ref={downRef}
          className={s.down}
          onClick={handleExplore}
          role="button"
          tabIndex={0}
          aria-label="Scroll down"
        >
          <svg
            viewBox="0 0 24 24"
            width="26"
            height="26"
            stroke="currentColor"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="7 13 12 18 17 13" />
            <polyline points="7 6 12 11 17 6" />
          </svg>
        </div>
      </section>
    </div>
  )
}
