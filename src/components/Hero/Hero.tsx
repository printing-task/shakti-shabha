import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import s from './Hero.module.css'

interface WebGLSlideData {
  roman: string
  title: string
  titleBreak: string
  subtitle: string
  desc: string
  ctaText: string
  ctaLink: string
  accent: string
  glow: string
  image: string
  pillars: string[]
  total: string
}

const SLIDES_DATA: WebGLSlideData[] = [
  {
    roman: 'Ⅰ',
    title: 'Mission',
    titleBreak: 'Mardini',
    subtitle: 'Physical & Tactical Preparedness',
    desc: 'Self-defence foundations, Lathi-Kaushal, practical awareness and training designed to build confidence and readiness.',
    ctaText: 'Discover Mardini',
    ctaLink: '/mardini',
    accent: '#f06529',
    glow: 'rgba(232, 85, 30, 0.35)',
    image: '/hero/hero-mardini.jpg',
    pillars: [
      'Self-Defence Training',
      'Lathi-Kaushal',
      'Safety Awareness',
      'Tactical Readiness',
    ],
    total: 'Ⅲ',
  },
  {
    roman: 'Ⅱ',
    title: 'Shakti',
    titleBreak: 'Bhava',
    subtitle: 'Consciousness & Emotional Resilience',
    desc: 'Supportive spaces, counselling pathways, awareness and trauma-informed conversations that respect individual dignity.',
    ctaText: 'Discover Bhava',
    ctaLink: '/counselling',
    accent: '#e391b4',
    glow: 'rgba(212, 114, 158, 0.35)',
    image: '/hero/hero-bhava.jpg',
    pillars: [
      'Emotional Well-being',
      'Supportive Counselling',
      'Self-Awareness',
      'Safe & Inclusive Spaces',
    ],
    total: 'Ⅲ',
  },
  {
    roman: 'Ⅲ',
    title: 'Shakti',
    titleBreak: 'Varta',
    subtitle: 'Research, Dialogue & Critical Inquiry',
    desc: 'Research, seminars, reading and dialogue that encourage independent thought and careful examination of sources.',
    ctaText: 'Discover Varta',
    ctaLink: '/research',
    accent: '#f4be42',
    glow: 'rgba(240, 175, 40, 0.35)',
    image: '/hero/hero-varta.jpg',
    pillars: [
      'Research & Study',
      'Dialogue & Discussion',
      'Critical Thinking',
      'Heritage & Society',
    ],
    total: 'Ⅲ',
  },
]

const vs = `
  attribute vec2 a;
  void main() { gl_Position = vec4(a, 0.0, 1.0); }
`

const fs = `
  precision highp float;

  uniform vec2  uR;
  uniform float uScale;
  uniform float uT;
  uniform float uPortalPx;
  uniform float uFromScene;
  uniform float uToScene;
  uniform float uOutZoom;
  uniform float uInZoom;
  uniform float uOutFade;
  uniform float uInFade;

  #define MARCH_STEPS 16
  #define REFINE_STEPS 4
  #define SUN_RADIUS 0.235

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float waveH(vec2 p, float t) {
    float h = 0.0;
    h += 0.038 * sin(p.x * 0.65 + p.y * 0.25 + t * 0.55);
    h += 0.018 * sin(p.x * 1.45 - p.y * 0.72 - t * 0.85);
    h += 0.010 * sin(p.x * 2.90 + p.y * 1.15 + t * 1.20);
    h += (noise(p * 12.0 + vec2(t * 0.22, t * 0.08)) - 0.5) * 0.008;
    return h;
  }

  vec3 waveNorm(vec2 p, float t, float dist) {
    float e = 0.022 + dist * 0.0008;
    float hL = waveH(p - vec2(e, 0.0), t);
    float hR = waveH(p + vec2(e, 0.0), t);
    float hD = waveH(p - vec2(0.0, e), t);
    float hU = waveH(p + vec2(0.0, e), t);
    return normalize(vec3(-(hR - hL) / (2.0 * e), 1.0, -(hU - hD) / (2.0 * e)));
  }

  vec3 getSunColor(int sc) {
    if (sc == 0) return vec3(0.86, 0.24, 0.10);
    if (sc == 1) return vec3(0.76, 0.36, 0.56);
    return vec3(0.92, 0.62, 0.10);
  }

  vec3 getSunTop(int sc) {
    if (sc == 0) return vec3(0.98, 0.48, 0.18);
    if (sc == 1) return vec3(0.94, 0.64, 0.78);
    return vec3(1.00, 0.84, 0.34);
  }

  vec3 renderScene(vec2 fragPos, vec2 center, float zoom, int sc) {
    vec2 uv = (fragPos - center) / (uScale * zoom);

    float horizonY = -0.048;
    float dy = uv.y - horizonY;

    vec3 sunCol = getSunColor(sc);
    vec3 sunTop = getSunTop(sc);
    vec3 baseDark = vec3(0.047, 0.047, 0.052);

    float distToSun = length(vec2(uv.x, dy));

    if (dy >= 0.0) {
      vec3 col = baseDark;
      float sunEdge = smoothstep(SUN_RADIUS + 0.0025, SUN_RADIUS - 0.0025, distToSun);
      vec3 sunGrad = mix(sunCol, sunTop, clamp(dy / SUN_RADIUS, 0.0, 1.0));
      col = mix(col, sunGrad, sunEdge);
      return col;
    } else {
      vec3 ro = vec3(0.0, 1.05, 0.0);
      vec3 rd = normalize(vec3(uv.x, dy, -1.35));

      float invNegRdY = 1.0 / max(-rd.y, 0.0005);
      float tMin = max(0.0, (ro.y - 0.085) * invNegRdY);
      float tMax = (ro.y + 0.085) * invNegRdY;
      float stepSize = (tMax - tMin) / float(MARCH_STEPS);
      float t = tMin;

      for (int i = 0; i < MARCH_STEPS; i++) {
        vec2 wpTest = ro.xz + rd.xz * t;
        if (ro.y + rd.y * t < waveH(wpTest, uT)) break;
        t += stepSize;
      }

      float ta = max(tMin, t - stepSize);
      float tb = min(tMax, t);
      for (int i = 0; i < REFINE_STEPS; i++) {
        float tm = (ta + tb) * 0.5;
        if (ro.y + rd.y * tm < waveH(ro.xz + rd.xz * tm, uT)) tb = tm;
        else ta = tm;
      }
      t = (ta + tb) * 0.5;

      vec2 wp = ro.xz + rd.xz * t;
      vec3 n = waveNorm(wp, uT, t);
      vec3 vDir = -rd;

      vec3 col = vec3(0.038, 0.038, 0.042);

      float horizSpread = exp(-abs(uv.x) * 4.4);
      float depthFade = exp(dy * 5.2);
      float ripple = 0.65 + 0.35 * clamp(dot(n, normalize(vec3(0.0, 0.85, 0.52))), 0.0, 1.0);
      col += sunCol * horizSpread * depthFade * 0.60 * ripple;

      vec3 sunDir = normalize(vec3(0.0, 0.14, -1.0));
      float spec = pow(max(dot(reflect(-sunDir, n), vDir), 0.0), 34.0);
      col += sunTop * spec * 0.52 * horizSpread * exp(dy * 3.0);

      float vig = smoothstep(0.95, 0.25, length(uv));
      col *= (0.45 + 0.55 * vig);

      return col;
    }
  }

  void main() {
    vec2 center = vec2(uR.x * 0.5, uR.y * 0.485);
    float distPx = length(gl_FragCoord.xy - center);
    vec3 baseDark = vec3(0.047, 0.047, 0.052);

    vec3 col;
    if (uPortalPx <= 0.5) {
      col = renderScene(gl_FragCoord.xy, center, uOutZoom, int(uFromScene));
    } else {
      float mask = smoothstep(uPortalPx + 1.5, uPortalPx - 1.5, distPx);

      vec3 outCol = renderScene(gl_FragCoord.xy, center, uOutZoom, int(uFromScene));
      outCol = mix(baseDark, outCol, uOutFade);

      vec3 inCol = renderScene(gl_FragCoord.xy, center, uInZoom, int(uToScene));
      inCol = mix(baseDark, inCol, uInFade);

      col = mix(outCol, inCol, mask);

      float ringWidth = uScale * SUN_RADIUS;
      float innerEdge = smoothstep(uPortalPx - 2.0, uPortalPx + 2.0, distPx);
      float outerEdge = smoothstep(uPortalPx + ringWidth + 2.0, uPortalPx + ringWidth - 2.0, distPx);
      float ringMask = innerEdge * outerEdge;

      float ringIn = smoothstep(0.0, uScale * 0.035, uPortalPx);
      float ringT = clamp((distPx - uPortalPx) / ringWidth, 0.0, 1.0);
      vec3 ringColor = mix(getSunTop(int(uFromScene)), getSunColor(int(uFromScene)), ringT);

      col = mix(col, ringColor, ringMask * ringIn * uOutFade * 0.94);
    }

    float grain = hash(gl_FragCoord.xy * 0.5 + floor(uT * 12.0)) - 0.5;
    col += grain * 0.007;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`

function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
}

export default function Hero() {
  const frameRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const cylinderRef = useRef<HTMLDivElement | null>(null)
  const slideRefs = useRef<(HTMLElement | null)[]>([])

  const [activeIdx, setActiveIdx] = useState(0)

  const stateRef = useRef({
    currentIdx: 0,
    nextIdx: 0,
    isTransitioning: false,
    transStart: 0,
    TRANS_DURATION: 1100,
    frameW: 1,
    frameH: 1,
    dpr: 1,
  })

  const autoLoopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startTransition = useCallback((targetIdx: number) => {
    const sState = stateRef.current
    if (sState.isTransitioning || targetIdx === sState.currentIdx) return

    sState.isTransitioning = true
    sState.nextIdx = targetIdx
    if (autoLoopTimerRef.current) clearTimeout(autoLoopTimerRef.current)
    setActiveIdx(targetIdx)

    const cyl = cylinderRef.current
    if (cyl) {
      cyl.classList.remove(s.cylinderMoving)
      void cyl.offsetWidth
      cyl.classList.add(s.cylinderMoving)
    }

    setTimeout(() => {
      const outSlide = slideRefs.current[sState.currentIdx]
      const inSlide = slideRefs.current[sState.nextIdx]
      if (outSlide && inSlide) {
        outSlide.classList.remove(s.slideIsCurrent)
        inSlide.classList.add(s.slideVisible)
        inSlide.style.zIndex = '2'
        inSlide.style.opacity = '0'
        outSlide.style.zIndex = '1'
      }
      sState.transStart = performance.now()
    }, 280)
  }, [])

  const triggerNext = useCallback(() => {
    const sState = stateRef.current
    startTransition((sState.currentIdx + 1) % SLIDES_DATA.length)
  }, [startTransition])

  const triggerPrev = useCallback(() => {
    const sState = stateRef.current
    startTransition((sState.currentIdx - 1 + SLIDES_DATA.length) % SLIDES_DATA.length)
  }, [startTransition])

  const scheduleAutoLoop = useCallback(() => {
    if (autoLoopTimerRef.current) clearTimeout(autoLoopTimerRef.current)
    autoLoopTimerRef.current = setTimeout(() => {
      triggerNext()
    }, 4500)
  }, [triggerNext])

  useEffect(() => {
    const canvas = canvasRef.current
    const frame = frameRef.current
    if (!canvas || !frame) return

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: 'high-performance',
    })
    if (!gl) return

    const mkShader = (type: number, src: string) => {
      const sh = gl.createShader(type)
      if (!sh) return null
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      return sh
    }

    const vShader = mkShader(gl.VERTEX_SHADER, vs)
    const fShader = mkShader(gl.FRAGMENT_SHADER, fs)
    if (!vShader || !fShader) return

    const prog = gl.createProgram()
    if (!prog) return
    gl.attachShader(prog, vShader)
    gl.attachShader(prog, fShader)
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    )

    const ap = gl.getAttribLocation(prog, 'a')
    gl.enableVertexAttribArray(ap)
    gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 0, 0)

    const uR = gl.getUniformLocation(prog, 'uR')
    const uScale = gl.getUniformLocation(prog, 'uScale')
    const uT = gl.getUniformLocation(prog, 'uT')
    const uPortalPx = gl.getUniformLocation(prog, 'uPortalPx')
    const uFromScene = gl.getUniformLocation(prog, 'uFromScene')
    const uToScene = gl.getUniformLocation(prog, 'uToScene')
    const uOutZoom = gl.getUniformLocation(prog, 'uOutZoom')
    const uInZoom = gl.getUniformLocation(prog, 'uInZoom')
    const uOutFade = gl.getUniformLocation(prog, 'uOutFade')
    const uInFade = gl.getUniformLocation(prog, 'uInFade')

    const resize = () => {
      const rect = frame.getBoundingClientRect()
      stateRef.current.frameW = rect.width
      stateRef.current.frameH = rect.height
      stateRef.current.dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(rect.width * stateRef.current.dpr)
      canvas.height = Math.round(rect.height * stateRef.current.dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uR, canvas.width, canvas.height)
      // Keeps sun circle proportional on narrow portrait phones while preserving desktop scale
      gl.uniform1f(uScale, Math.min(canvas.height, canvas.width * 1.15))
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(frame)

    let animId: number
    const t0 = performance.now()

    const tick = (now: number) => {
      animId = requestAnimationFrame(tick)
      const sState = stateRef.current

      let portalRadiusCss = 0
      let outZoom = 1.0
      let inZoom = 1.0
      let outFade = 1.0
      let inFade = 1.0

      if (sState.isTransitioning && sState.transStart > 0) {
        const rawP = Math.min(1, (now - sState.transStart) / sState.TRANS_DURATION)
        const p = easeInOutQuart(rawP)

        const maxRadiusCss =
          Math.hypot(sState.frameW * 0.5, sState.frameH * 0.52) + 20
        portalRadiusCss = p * maxRadiusCss

        outZoom = 1.0 + p * 0.95
        outFade = Math.max(0, 1.0 - Math.pow(rawP, 1.4))

        inZoom = 0.68 + p * 0.32
        inFade = Math.min(1.0, Math.pow(rawP, 0.75) * 1.15)

        const outSlide = slideRefs.current[sState.currentIdx]
        const inSlide = slideRefs.current[sState.nextIdx]

        if (outSlide && inSlide) {
          outSlide.style.transform = `scale(${outZoom})`
          outSlide.style.opacity = `${outFade}`
          outSlide.style.clipPath = 'none'

          inSlide.style.transform = `scale(${inZoom})`
          inSlide.style.opacity = `${inFade}`
          inSlide.style.clipPath = `circle(${portalRadiusCss}px at 50% 51.5%)`
        }

        if (rawP >= 1) {
          if (outSlide) {
            outSlide.classList.remove(s.slideVisible)
            outSlide.style.transform = 'scale(1)'
            outSlide.style.opacity = '1'
          }
          if (inSlide) {
            inSlide.classList.add(s.slideIsCurrent)
            inSlide.style.transform = 'scale(1)'
            inSlide.style.opacity = '1'
            inSlide.style.clipPath = 'none'
            inSlide.style.zIndex = '1'
          }

          sState.currentIdx = sState.nextIdx
          sState.isTransitioning = false
          sState.transStart = 0
          portalRadiusCss = 0
          outZoom = 1.0
          outFade = 1.0
          inFade = 1.0

          scheduleAutoLoop()
        }
      }

      gl.uniform1f(uT, (now - t0) / 1000)
      gl.uniform1f(uPortalPx, portalRadiusCss * sState.dpr)
      gl.uniform1f(uFromScene, sState.currentIdx)
      gl.uniform1f(uToScene, sState.nextIdx)
      gl.uniform1f(uOutZoom, outZoom)
      gl.uniform1f(uInZoom, inZoom)
      gl.uniform1f(uOutFade, outFade)
      gl.uniform1f(uInFade, inFade)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    animId = requestAnimationFrame(tick)
    scheduleAutoLoop()

    const onWheel = (e: WheelEvent) => {
      if (stateRef.current.isTransitioning) return
      if (Math.abs(e.deltaY) > 25) {
        if (e.deltaY > 0) triggerNext()
        else triggerPrev()
      }
    }

    let touchStartX = 0
    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (stateRef.current.isTransitioning) return
      const dx = touchStartX - e.changedTouches[0].clientX
      const dy = touchStartY - e.changedTouches[0].clientY
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) triggerNext()
        else triggerPrev()
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        triggerNext()
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        triggerPrev()
      }
    }

    frame.addEventListener('wheel', onWheel, { passive: true })
    frame.addEventListener('touchstart', onTouchStart, { passive: true })
    frame.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      cancelAnimationFrame(animId)
      if (autoLoopTimerRef.current) clearTimeout(autoLoopTimerRef.current)
      ro.disconnect()
      frame.removeEventListener('wheel', onWheel)
      frame.removeEventListener('touchstart', onTouchStart)
      frame.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
      gl.deleteProgram(prog)
      gl.deleteShader(vShader)
      gl.deleteShader(fShader)
      gl.deleteBuffer(buf)
    }
  }, [scheduleAutoLoop, triggerNext, triggerPrev])

  return (
    <div className={s.heroPinWrapper}>
      {/* Hidden SVG Filter: Keys out solid black JPEG backgrounds in the GPU compositor */}
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute', pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <defs>
          <filter id="remove-black" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="
                1  0  0  0  0
                0  1  0  0  0
                0  0  1  0  0
                20 20 20 0 -0.60
              "
            />
          </filter>
        </defs>
      </svg>

      {/* ── Full-Bleed WebGL Hero Stage ────────────────────────── */}
      <div className={s.appFrame} ref={frameRef} id="app_frame">
        {/* WebGL Canvas: Sun + Ocean Waves + Portal Ring */}
        <canvas className={s.webglCanvas} ref={canvasRef} id="webgl_canvas" />

        {/* HTML Slides Stage */}
        <div className={s.slidesStage} id="slides_stage">
          {SLIDES_DATA.map((slide, idx) => {
            const isCurrent = idx === 0
            return (
              <section
                key={slide.roman}
                ref={(el) => {
                  slideRefs.current[idx] = el
                }}
                className={`${s.slide} ${isCurrent ? `${s.slideVisible} ${s.slideIsCurrent}` : ''}`}
                style={
                  {
                    '--slide-accent': slide.accent,
                    '--slide-glow': slide.glow,
                  } as React.CSSProperties
                }
              >
                {/* Left Typography Block */}
                <div className={s.slideLeft}>
                  <div className={s.romanNum}>{slide.roman}</div>
                  <h1 className={s.slideTitle}>
                    {slide.title}
                    <br />
                    {slide.titleBreak}
                  </h1>
                  <div className={s.slideSubtitle}>{slide.subtitle}</div>
                  <p className={s.slideDesc}>{slide.desc}</p>
                  <Link to={slide.ctaLink} className={s.ctaBtn}>
                    {slide.ctaText} <span>→</span>
                  </Link>
                </div>

                {/* Subject Slot (Warrior / Consciousness / Research Portrait) */}
                <div className={s.subjectWrap}>
                  <div className={s.mediaSlot}>
                    <img
                      src={slide.image}
                      alt={`${slide.title} ${slide.titleBreak}`}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                </div>

                {/* Right Pillar Highlights & Stacked Counter */}
                <div className={s.slideRight}>
                  <ul className={s.pillarList}>
                    {slide.pillars.map((pil, pIdx) => (
                      <li key={pIdx}>{pil}</li>
                    ))}
                  </ul>
                  <div className={s.stackedCounter}>
                    <span>{slide.roman}</span>
                    <div className={s.counterLine}></div>
                    <span className={s.counterTotal}>{slide.total}</span>
                  </div>
                </div>
              </section>
            )
          })}
        </div>

        {/* Fixed UI Overlay: Top Bar */}
        <header className={s.topBar}>
          <button
            type="button"
            className={s.menuBtn}
            onClick={triggerNext}
            title="Next Pillar"
            aria-label="Next Pillar"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={s.brandTitle}>Shakti Sabha</div>

          <div className={s.topRight}>
            <div className={s.pillarNav}>
              {SLIDES_DATA.map((slide, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${s.pillarDot} ${idx === activeIdx ? s.pillarDotActive : ''}`}
                  onClick={() => startTransition(idx)}
                  title={`${slide.title} ${slide.titleBreak}`}
                >
                  {slide.roman}
                </button>
              ))}
            </div>
            <button
              type="button"
              className={s.navPill}
              onClick={triggerNext}
            >
              ALL PILLARS
            </button>
          </div>
        </header>

        {/* Center Play / Next Portal Button */}
        <button
          id="play_btn"
          type="button"
          className={s.playBtn}
          onClick={triggerNext}
          aria-label="Next Pillar"
        >
          <svg viewBox="0 0 24 24">
            <polygon points="6,4 20,12 6,20" />
          </svg>
        </button>

        {/* Sliding Cylinder / Pill Button */}
        <div id="cylinder_btn" ref={cylinderRef} className={s.cylinderBtn} />

        {/* Fixed UI Overlay: Bottom Bar */}
        <footer className={s.bottomBar}>
          <div className={s.tagline}>Strength · Consciousness · Inquiry</div>
          <div className={s.scrollPill} />
          <div className={s.footerRight}>
            <span>MARDINI</span>
            <span>BHAVA</span>
            <span>VARTA</span>
          </div>
        </footer>
      </div>

      {/* ── Section Intro (4-Column Trio below Hero) ─────────── */}
      <section className={s.intro} id="work">
        <div className={s.introPanel}>
          <div>
            <div className={s.symbol}>शक्ति</div>
            <h2>Who We Are</h2>
            <p>
              Shakti Sabha brings together initiatives for women&apos;s safety, resilience, learning and community participation.
            </p>
          </div>
          <Link to="/about" className={s.textLink}>
            Discover our purpose <span>→</span>
          </Link>
        </div>

        {/* Feature 01: Physical Preparedness */}
        <article className={s.feature}>
          <div className={s.featureNo}>01.</div>
          <h3>Physical Preparedness</h3>
          <div className={s.small}>Mission Mardini</div>
          <div className={s.featureImage}>
            <img
              src="/missionmirdani.jpg"
              alt="Mission Mardini training"
              loading="lazy"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src = '/socialwork/social-1.jpg'
              }}
            />
          </div>
          <p>
            Practical self-defence, situational awareness and disciplined training that help participants build confidence.
          </p>
          <Link to="/mardini" className={s.featureLink}>
            Explore programme <span>→</span>
          </Link>
        </article>

        {/* Feature 02: Emotional Resilience */}
        <article className={s.feature}>
          <div className={s.featureNo}>02.</div>
          <h3>Emotional Resilience</h3>
          <div className={s.small}>Shakti Bhava</div>
          <div className={s.featureImage}>
            <img
              src="/shaktibhava.jpg"
              alt="Shakti Bhava support initiative"
              loading="lazy"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src = '/socialwork/social-2.jpg'
              }}
            />
          </div>
          <p>
            Spaces for reflection, supportive conversations, awareness and pathways to appropriate help.
          </p>
          <Link to="/counselling" className={s.featureLink}>
            Explore programme <span>→</span>
          </Link>
        </article>

        {/* Feature 03: Ideas & Inquiry */}
        <article className={s.feature}>
          <div className={s.featureNo}>03.</div>
          <h3>Ideas &amp; Inquiry</h3>
          <div className={s.small}>Shakti Varta</div>
          <div className={s.featureImage}>
            <img
              src="/shaktivarta.jpg"
              alt="Shakti Varta discourse initiative"
              loading="lazy"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src = '/socialwork/social-3.jpg'
              }}
            />
          </div>
          <p>
            Research-led dialogue, source-based learning and critical thinking for an informed public.
          </p>
          <Link to="/research" className={s.featureLink}>
            Explore programme <span>→</span>
          </Link>
        </article>
      </section>
    </div>
  )
}
