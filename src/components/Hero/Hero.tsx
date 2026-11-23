'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './ShaktiHero.module.css';

const SCENES = [
  {
    roman: 'Ⅰ',
    title: ['Mission', 'Mardini'],
    sub: 'Physical & Tactical Preparedness',
    desc: 'Self-defence foundations, Lathi-Kaushal, practical awareness and training designed to build confidence and readiness.',
    cta: 'Discover Mardini',
    img: '/missionmirdini.jpeg',
    accent: '#f06529',
    glow: 'rgba(232,85,30,0.35)',
    pillars: ['Self-Defence Training', 'Lathi-Kaushal', 'Safety Awareness', 'Tactical Readiness'],
  },
  {
    roman: 'Ⅱ',
    title: ['Shakti', 'Bhava'],
    sub: 'Consciousness & Emotional Resilience',
    desc: 'Supportive spaces, counselling pathways, awareness and trauma-informed conversations that respect individual dignity.',
    cta: 'Discover Bhava',
    img: '/shaktibhava.jpeg',
    accent: '#e391b4',
    glow: 'rgba(212,114,158,0.35)',
    pillars: ['Emotional Well-being', 'Supportive Counselling', 'Self-Awareness', 'Safe & Inclusive Spaces'],
  },
  {
    roman: 'Ⅲ',
    title: ['Shakti', 'Varta'],
    sub: 'Research, Dialogue & Critical Inquiry',
    desc: 'Research, seminars, reading and dialogue that encourage independent thought and careful examination of sources.',
    cta: 'Discover Varta',
    img: '/shaktivarta.jpeg',
    accent: '#f4be42',
    glow: 'rgba(240,175,40,0.35)',
    pillars: ['Research & Study', 'Dialogue & Discussion', 'Critical Thinking', 'Heritage & Society'],
  },
];

const VS = `attribute vec2 a; void main(){ gl_Position = vec4(a,0.0,1.0); }`;

const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uR; uniform float uS; uniform float uT; uniform float uPortalPx;
uniform float uFromScene; uniform float uToScene;
uniform float uOutZoom; uniform float uInZoom; uniform float uOutFade; uniform float uInFade;
#define MARCH_STEPS 16
#define REFINE_STEPS 4
#define SUN_RADIUS 0.235
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), f.x), mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), f.x), f.y);
}
float waveH(vec2 p, float t){
  float h = 0.0;
  h += 0.038*sin(p.x*0.65 + p.y*0.25 + t*0.55);
  h += 0.018*sin(p.x*1.45 - p.y*0.72 - t*0.85);
  h += 0.010*sin(p.x*2.90 + p.y*1.15 + t*1.20);
  h += (noise(p*12.0 + vec2(t*0.22, t*0.08)) - 0.5) * 0.008;
  return h;
}
vec3 waveNorm(vec2 p, float t, float dist){
  float e = 0.022 + dist*0.0008;
  float hL = waveH(p-vec2(e,0.0),t); float hR = waveH(p+vec2(e,0.0),t);
  float hD = waveH(p-vec2(0.0,e),t); float hU = waveH(p+vec2(0.0,e),t);
  return normalize(vec3(-(hR-hL)/(2.0*e), 1.0, -(hU-hD)/(2.0*e)));
}
vec3 getSunColor(int sc){ if(sc==0) return vec3(0.86,0.24,0.10); if(sc==1) return vec3(0.76,0.36,0.56); return vec3(0.92,0.62,0.10); }
vec3 getSunTop(int sc){ if(sc==0) return vec3(0.98,0.48,0.18); if(sc==1) return vec3(0.94,0.64,0.78); return vec3(1.00,0.84,0.34); }

vec3 renderScene(vec2 fragPos, vec2 center, float zoom, int sc){
  vec2 uv = (fragPos - center) / (uS * zoom);
  float horizonY = -0.048;
  float dy = uv.y - horizonY;
  vec3 sunCol = getSunColor(sc); vec3 sunTop = getSunTop(sc);
  vec3 baseDark = vec3(0.047,0.047,0.052);
  float distToSun = length(vec2(uv.x, dy));
  if(dy >= 0.0){
    float sunEdge = smoothstep(SUN_RADIUS+0.0025, SUN_RADIUS-0.0025, distToSun);
    vec3 sunGrad = mix(sunCol, sunTop, clamp(dy/SUN_RADIUS, 0.0, 1.0));
    return mix(baseDark, sunGrad, sunEdge);
  }
  vec3 ro = vec3(0.0,1.05,0.0);
  vec3 rd = normalize(vec3(uv.x, dy, -1.35));
  float invNegRdY = 1.0 / max(-rd.y, 0.0005);
  float tMin = max(0.0, (ro.y-0.085)*invNegRdY);
  float tMax = (ro.y+0.085)*invNegRdY;
  float stepSize = (tMax-tMin)/float(MARCH_STEPS);
  float t = tMin;
  for(int i=0;i<MARCH_STEPS;i++){
    if(ro.y + rd.y*t < waveH(ro.xz + rd.xz*t, uT)) break;
    t += stepSize;
  }
  float ta = max(tMin, t-stepSize); float tb = min(tMax, t);
  for(int i=0;i<REFINE_STEPS;i++){
    float tm = (ta+tb)*0.5;
    if(ro.y + rd.y*tm < waveH(ro.xz + rd.xz*tm, uT)) tb = tm; else ta = tm;
  }
  t = (ta+tb)*0.5;
  vec2 wp = ro.xz + rd.xz*t;
  vec3 n = waveNorm(wp, uT, t);
  vec3 vDir = -rd;
  vec3 col = vec3(0.038,0.038,0.042);
  float horizSpread = exp(-abs(uv.x)*4.4);
  float depthFade = exp(dy*5.2);
  float ripple = 0.65 + 0.35*clamp(dot(n, normalize(vec3(0.0,0.85,0.52))), 0.0, 1.0);
  col += sunCol*horizSpread*depthFade*0.60*ripple;
  vec3 sunDir = normalize(vec3(0.0,0.14,-1.0));
  float spec = pow(max(dot(reflect(-sunDir,n), vDir), 0.0), 34.0);
  col += sunTop*spec*0.52*horizSpread*exp(dy*3.0);
  float vig = smoothstep(0.95, 0.25, length(uv));
  return col*(0.45 + 0.55*vig);
}

void main(){
  vec2 center = vec2(uR.x*0.5, uR.y*0.485);
  float distPx = length(gl_FragCoord.xy - center);
  vec3 baseDark = vec3(0.047,0.047,0.052);
  vec3 col;
  if(uPortalPx <= 0.5){
    col = renderScene(gl_FragCoord.xy, center, uOutZoom, int(uFromScene));
  } else {
    float mask = smoothstep(uPortalPx+1.5, uPortalPx-1.5, distPx);
    vec3 outCol = mix(baseDark, renderScene(gl_FragCoord.xy, center, uOutZoom, int(uFromScene)), uOutFade);
    vec3 inCol  = mix(baseDark, renderScene(gl_FragCoord.xy, center, uInZoom,  int(uToScene)),   uInFade);
    col = mix(outCol, inCol, mask);
    float ringWidth = uS*SUN_RADIUS;
    float innerEdge = smoothstep(uPortalPx-2.0, uPortalPx+2.0, distPx);
    float outerEdge = smoothstep(uPortalPx+ringWidth+2.0, uPortalPx+ringWidth-2.0, distPx);
    float ringIn = smoothstep(0.0, uS*0.035, uPortalPx);
    float ringT = clamp((distPx-uPortalPx)/ringWidth, 0.0, 1.0);
    vec3 ringColor = mix(getSunTop(int(uFromScene)), getSunColor(int(uFromScene)), ringT);
    col = mix(col, ringColor, innerEdge*outerEdge*ringIn*uOutFade*0.94);
  }
  float grain = hash(gl_FragCoord.xy*0.5 + floor(uT*12.0)) - 0.5;
  col += grain*0.007;
  gl_FragColor = vec4(clamp(col,0.0,1.0),1.0);
}`;

const TRANS_DURATION = 1100;
const easeInOutQuart = (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);

export default function ShaktiHero() {
  const frameRef = useRef(null);
  const canvasRef = useRef(null);
  const cylRef = useRef(null);
  const slideRefs = useRef([]);
  const api = useRef({});
  const [active, setActive] = useState(0);

  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    const slides = slideRefs.current;
    const cyl = cylRef.current;
    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: 'high-performance',
    });
    if (!gl) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const mk = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const ap = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(ap);
    gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 0, 0);

    const U = {};
    ['uR', 'uS', 'uT', 'uPortalPx', 'uFromScene', 'uToScene', 'uOutZoom', 'uInZoom', 'uOutFade', 'uInFade'].forEach(
      (n) => (U[n] = gl.getUniformLocation(prog, n))
    );

    let dpr = 1, frameW = 1, frameH = 1;
    const resize = () => {
      const r = frame.getBoundingClientRect();
      frameW = Math.max(1, r.width);
      frameH = Math.max(1, r.height);
      const cap = frameW < 700 ? 1.25 : 1.5;
      dpr = Math.min(window.devicePixelRatio || 1, cap);
      canvas.width = Math.round(frameW * dpr);
      canvas.height = Math.round(frameH * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U.uR, canvas.width, canvas.height);
      // Scale unit keeps the sun proportional on portrait phones and wide desktops
      gl.uniform1f(U.uS, Math.min(canvas.height, canvas.width * 1.15));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(frame);

    slides.forEach((s, i) => {
      s.classList.toggle(styles.slideVisible, i === 0);
      s.classList.toggle(styles.slideIsCurrent, i === 0);
    });

    let currentIdx = 0, nextIdx = 0, isTransitioning = false, transStart = 0;
    let autoTimer = null, swapTimer = null, raf = 0;

    const scheduleAuto = () => {
      clearTimeout(autoTimer);
      if (reduceMotion) return;
      autoTimer = setTimeout(() => !document.hidden && triggerNext(), 4500);
    };

    function start(target) {
      if (isTransitioning || target === currentIdx) return;
      isTransitioning = true;
      nextIdx = target;
      clearTimeout(autoTimer);
      setActive(target);
      cyl.classList.remove(styles.cylinderMoving);
      void cyl.offsetWidth;
      cyl.classList.add(styles.cylinderMoving);
      swapTimer = setTimeout(() => {
        slides[currentIdx].classList.remove(styles.slideIsCurrent);
        slides[nextIdx].classList.add(styles.slideVisible);
        slides[nextIdx].style.zIndex = 2;
        slides[nextIdx].style.opacity = 0;
        slides[currentIdx].style.zIndex = 1;
        transStart = performance.now();
      }, 280);
    }
    function triggerNext() { start((currentIdx + 1) % slides.length); }
    function triggerPrev() { start((currentIdx - 1 + slides.length) % slides.length); }
    api.current = { go: start, next: triggerNext, prev: triggerPrev };

    let wheelLock = 0;
    const onWheel = (e) => {
      const now = performance.now();
      if (isTransitioning || now - wheelLock < 600 || Math.abs(e.deltaY) < 15) return;
      wheelLock = now;
      e.deltaY > 0 ? triggerNext() : triggerPrev();
    };
    const onKey = (e) => {
      if (['ArrowDown', 'ArrowRight', ' '].includes(e.key)) { e.preventDefault(); triggerNext(); }
      else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); triggerPrev(); }
    };
    let tx = 0, ty = 0;
    const onTS = (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; };
    const onTE = (e) => {
      const dx = e.changedTouches[0].clientX - tx;
      const dy = e.changedTouches[0].clientY - ty;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? triggerNext() : triggerPrev();
    };
    frame.addEventListener('wheel', onWheel, { passive: true });
    frame.addEventListener('touchstart', onTS, { passive: true });
    frame.addEventListener('touchend', onTE, { passive: true });
    window.addEventListener('keydown', onKey);
    scheduleAuto();

    const t0 = performance.now();
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      let portal = 0, outZoom = 1, inZoom = 1, outFade = 1, inFade = 1;

      if (isTransitioning && transStart > 0) {
        const rawP = Math.min(1, (now - transStart) / TRANS_DURATION);
        const p = easeInOutQuart(rawP);
        const maxR = Math.hypot(frameW * 0.5, frameH * 0.52) + 20;
        portal = p * maxR;
        outZoom = 1 + p * 0.95;
        outFade = Math.max(0, 1 - Math.pow(rawP, 1.4));
        inZoom = 0.68 + p * 0.32;
        inFade = Math.min(1, Math.pow(rawP, 0.75) * 1.15);

        const o = slides[currentIdx], n = slides[nextIdx];
        o.style.transform = `scale(${outZoom})`;
        o.style.opacity = outFade;
        n.style.transform = `scale(${inZoom})`;
        n.style.opacity = inFade;
        n.style.clipPath = `circle(${portal}px at 50% 51.5%)`;

        if (rawP >= 1) {
          o.classList.remove(styles.slideVisible);
          o.style.transform = 'scale(1)';
          o.style.opacity = 1;
          n.classList.add(styles.slideIsCurrent);
          n.style.transform = 'scale(1)';
          n.style.opacity = 1;
          n.style.clipPath = 'none';
          n.style.zIndex = 1;
          currentIdx = nextIdx;
          isTransitioning = false;
          transStart = 0;
          portal = 0; outZoom = 1; outFade = 1; inFade = 1;
          scheduleAuto();
        }
      }

      gl.uniform1f(U.uT, (now - t0) / 1000);
      gl.uniform1f(U.uPortalPx, portal * dpr);
      gl.uniform1f(U.uFromScene, currentIdx);
      gl.uniform1f(U.uToScene, nextIdx);
      gl.uniform1f(U.uOutZoom, outZoom);
      gl.uniform1f(U.uInZoom, inZoom);
      gl.uniform1f(U.uOutFade, outFade);
      gl.uniform1f(U.uInFade, inFade);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    raf = requestAnimationFrame(tick);

    const onVis = () => { if (!document.hidden && !isTransitioning) scheduleAuto(); };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(autoTimer);
      clearTimeout(swapTimer);
      ro.disconnect();
      frame.removeEventListener('wheel', onWheel);
      frame.removeEventListener('touchstart', onTS);
      frame.removeEventListener('touchend', onTE);
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div className={styles.heroPinWrapper}>
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden="true">
        <defs>
          <filter id="remove-black" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  20 20 20 0 -0.60" />
          </filter>
        </defs>
      </svg>

      <div className={styles.appFrame} ref={frameRef}>
        <canvas className={styles.webglCanvas} ref={canvasRef} />

        <div className={styles.slidesStage}>
          {SCENES.map((s, i) => (
            <section
              key={s.roman}
              className={styles.slide}
              ref={(el) => (slideRefs.current[i] = el)}
              style={{ '--slide-accent': s.accent, '--slide-glow': s.glow }}
            >
              <div className={styles.slideLeft}>
                <div className={styles.romanNum}>{s.roman}</div>
                <h1 className={styles.slideTitle}>{s.title[0]}<br />{s.title[1]}</h1>
                <div className={styles.slideSubtitle}>{s.sub}</div>
                <p className={styles.slideDesc}>{s.desc}</p>
                <a
                  href="#"
                  className={styles.ctaBtn}
                  onClick={(e) => { e.preventDefault(); api.current.next?.(); }}
                >
                  {s.cta} <span>→</span>
                </a>
              </div>

              <div className={styles.subjectWrap}>
                <div className={styles.mediaSlot}>
                  <img src={s.img} alt={s.title.join(' ')} draggable={false} />
                </div>
              </div>

              <div className={styles.slideRight}>
                <ul className={styles.pillarList}>
                  {s.pillars.map((p) => <li key={p}>{p}</li>)}
                </ul>
                <div className={styles.stackedCounter}>
                  <span>{s.roman}</span>
                  <div className={styles.counterLine} />
                  <span className={styles.counterTotal}>Ⅲ</span>
                </div>
              </div>
            </section>
          ))}
        </div>

        <header className={styles.topBar}>
          <button className={styles.menuBtn} onClick={() => api.current.next?.()} aria-label="Next pillar">
            <span /><span /><span />
          </button>
          <div className={styles.brandTitle}>Shakti Sabha</div>
          <div className={styles.topRight}>
            <div className={styles.pillarNav}>
              {SCENES.map((s, i) => (
                <button
                  key={s.roman}
                  aria-label={s.title.join(' ')}
                  title={s.title.join(' ')}
                  className={`${styles.pillarDot} ${active === i ? styles.pillarDotActive : ''}`}
                  onClick={() => api.current.go?.(i)}
                >
                  {s.roman}
                </button>
              ))}
            </div>
            <button className={styles.navPill} onClick={() => api.current.next?.()}>ALL PILLARS</button>
          </div>
        </header>

        <button className={styles.playBtn} onClick={() => api.current.next?.()} aria-label="Next pillar">
          <svg viewBox="0 0 24 24"><polygon points="6,4 20,12 6,20" /></svg>
        </button>
        <div className={styles.cylinderBtn} ref={cylRef} />

        <footer className={styles.bottomBar}>
          <div className={styles.tagline}>Strength · Consciousness · Inquiry</div>
          <div className={styles.scrollPill} />
          <div className={styles.footerRight}><span>MARDINI</span><span>BHAVA</span><span>VARTA</span></div>
        </footer>
      </div>
    </div>
  );
}
