import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Physics2DPlugin } from 'gsap/Physics2DPlugin'
import s from './Aaryaveera.module.css'

gsap.registerPlugin(ScrollTrigger, Physics2DPlugin)

const CARDS = [
  { icon: 'sports_martial_arts',  title: 'Self-Mastery & Kshatra-Dharma', text: 'Rooted in Aaryaveera philosophy, Mission Mardini conducts tactical self-defense camps — building somatic fearlessness and physical sovereignty.' },
  { icon: 'local_fire_department', title: 'Moral Autonomy & Character',   text: 'Cultivating inner mastery, ethical courage, and personal responsibility without falling into passive victimhood.' },
  { icon: 'podcasts',             title: 'Epistemic & Civilizational Dialogue', text: 'Powering Shakti Varta’s intellectual inquiries — uncompromising civilizational discourse on Dharma and noble masculinity (Paurush).' },
]

const COLORS = ['#CC230C','#E0550D','#C8433E','#FA9417','#F7A958','#F4BEA2','#D57A84']

function rnd(a: number, b: number) { return gsap.utils.random(a, b) }
function pickColor()               { return COLORS[Math.floor(Math.random() * COLORS.length)] }

export default function Aaryaveera() {
  const secRef  = useRef<HTMLElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const svgRef  = useRef<SVGSVGElement>(null)

  /* ── CodePen particle animation converted to TypeScript ── */
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const NS          = 'http://www.w3.org/2000/svg'
    const allCircles: SVGCircleElement[] = []
    const mainTl      = gsap.timeline({ paused: true })
    const NUM         = 100

    /* Helper: clone a new SVG circle */
    function mkCircle() {
      const c = document.createElementNS(NS, 'circle')
      c.setAttribute('cx', '0')
      c.setAttribute('cy', '0')
      c.setAttribute('r',  '0')
      allCircles.push(c)
      return c
    }

    /* ── GROUP 1: BEHIND (50 particles, float downward with glow) ── */
    for (let i = 0; i < NUM / 2; i++) {
      const p           = mkCircle()
      svg.insertBefore(p, svg.firstChild)

      const startR  = rnd(2, 32)
      const dur     = rnd(8, 10)

      gsap.set(p, {
        attr:   { cx: rnd(200, 300), cy: 400, r: 0 },
        filter: 'url(#avGlow)',
        fill:   pickColor(),
      })

      const tl = gsap.timeline({ repeat: 3 })
      tl.to(p, { attr: { r: startR }, duration: dur / 2 })
        .to(p, {
          attr: { cy: 700 },
          transformOrigin: '30% 50%',
          rotation: -180,
          duration: dur,
          physics2D: {
            velocity: 0,
            angle: rnd(0, 90),
            acceleration: 0,
            gravity: -2,
            accelerationAngle: 0,
          },
        }, `-=${dur / 2}`)
        .to(p, { attr: { r: 0 }, duration: dur / 2 }, `-=${dur / 2}`)

      mainTl.add(tl, i / 10)
    }

    /* ── GROUP 2: IN FRONT (100 particles, float downward, no glow) ── */
    for (let i = 0; i < NUM; i++) {
      const p       = mkCircle()
      svg.appendChild(p)

      const startR  = rnd(1, 20)
      const dur     = rnd(10, 12)

      gsap.set(p, {
        attr:   { cx: rnd(250, 350), cy: rnd(350, 500), r: 0 },
        fill:   pickColor(),
      })

      const tl = gsap.timeline({ repeat: 3 })
      tl.to(p, { attr: { r: startR }, duration: dur / 2 })
        .to(p, {
          attr: { cy: 650 },
          rotation: 280,
          duration: dur,
          physics2D: {
            velocity: -20,
            angle: rnd(0, -90),
            acceleration: -2,
            gravity: -10,
            accelerationAngle: 0,
          },
        }, `-=${dur / 2}`)
        .to(p, { attr: { r: 0 }, duration: dur / 2 }, `-=${dur / 2}`)

      mainTl.add(tl, i / 8)
    }

    /* ── GROUP 3: TOP OF HEAD (100 particles, float UPWARD) ── */
    for (let i = 0; i < NUM; i++) {
      const p       = mkCircle()
      svg.insertBefore(p, svg.firstChild)

      const colorIdx = Math.floor(Math.random() * (COLORS.length - 1)) + 1
      const startR   = rnd(2, 10)
      const startCX  = rnd(250, 350)
      const startCY  = rnd(190, 210)
      const dur       = rnd(6, 10)

      gsap.set(p, {
        attr:   { cx: startCX, cy: startCY, r: startR },
        fill:   COLORS[colorIdx],
        opacity: 1,
      })

      const t = gsap.fromTo(p,
        { duration: dur, opacity: 1, attr: { r: startR } },
        {
          transformOrigin: '30% 650%',
          rotation: 0,
          repeat: 3,
          opacity: 1,
          attr: { r: 0, cx: '+=30' },
          duration: dur,
          physics2D: {
            velocity: 0,
            angle: rnd(0, 90),
            acceleration: 0,
            gravity: -20,
            accelerationAngle: 90,
          },
        }
      )

      mainTl.add(t, i / 6)
    }

    /* ── Driver: loop mainTimeline over 12s, repeat forever ── */
    const allTl = gsap.timeline({ repeat: -1, yoyo: false })
    allTl.timeScale(1.1)
    allTl.to(mainTl, {
      time:     mainTl.duration(),
      duration: 12,
      ease:     'none',
    })

    return () => {
      allTl.kill()
      mainTl.kill()
      allCircles.forEach(c => c.parentNode?.removeChild(c))
    }
  }, [])

  /* ── GSAP entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Ensure all critical content is always visible by default
      gsap.set('[data-av="card"], [data-av="identity"], [data-av="cta"], [data-av="title"], [data-av="sub"], [data-av="motto"], [data-av="eyebrow"], [data-av="svgwrap"]', {
        opacity: 1,
        visibility: 'visible',
      })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: secRef.current, start: 'top 85%', toggleActions: 'play none none none' }
      })
      tl.from('[data-av="eyebrow"]', { opacity: 0, y: 8, duration: 0.35, clearProps: 'all' })
        .from('[data-av="title"]',   { y: '100%', duration: 0.6, ease: 'power4.out', clearProps: 'transform' }, '-=0.2')
        .from('[data-av="sub"]',     { opacity: 0, y: 10, duration: 0.35, clearProps: 'all' }, '-=0.25')
        .from('[data-av="motto"]',   { opacity: 0, duration: 0.35, clearProps: 'all' }, '-=0.2')
        .from('[data-av="identity"]', { opacity: 0, y: 10, duration: 0.35, clearProps: 'all' }, '-=0.2')
        .from('[data-av="card"]',    { opacity: 0, y: 12, stagger: 0.08, duration: 0.35, clearProps: 'all' }, '-=0.15')
        .from('[data-av="cta"]',     { opacity: 0, y: 8, duration: 0.3, clearProps: 'all' }, '-=0.1')
        .from('[data-av="svgwrap"]', { scale: 0.95, duration: 0.6, ease: 'power3.out', clearProps: 'all' }, '-=0.5')

      gsap.to(glowRef.current, {
        opacity: 0.55, scale: 1.12, repeat: -1, yoyo: true, duration: 3.5, ease: 'sine.inOut'
      })
    }, secRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className={s.section}>
      <div ref={glowRef} className={s.glow} />

      <div className={s.inner}>
        {/* LEFT: text + identity definition + cards */}
        <div className={s.left}>
          <span data-av="eyebrow" className={s.eyebrow}>FOUNDER'S PHILOSOPHY · THE AARYAVEERA WORLDVIEW</span>
          <div className={s.titleClip}>
            <span data-av="title" className={s.title}>AARYAVEERA</span>
          </div>
          <span data-av="sub" className={s.sub}>Aaryaveera · Ideological Identity of Founder Harshita Mankar</span>
          <span data-av="motto" className={s.motto}>From Strength Alone Arises Lasting Peace</span>

          {/* Core Institutional & Philosophical Distinction Block */}
          <div data-av="identity" className={s.identity}>
            <p className={s.identityHindi}>
              Shakti Sabha — Institutional Framework · Aaryaveera — Foundational Worldview
            </p>
            <p className={s.identityText}>
              Aaryaveera represents the philosophical identity and worldview of founder Harshita Mankar — providing the ideological bedrock that guides Shakti Sabha's three institutional streams: <Link to="/mardini" className={s.streamLink}>Mission Mardini</Link>, <Link to="/shakti-bhava" className={s.streamLink}>Shakti Bhava</Link>, and <Link to="/shakti-varta" className={s.streamLink}>Shakti Varta</Link>.
            </p>
          </div>

          <div className={s.grid}>
            {CARDS.map(c => (
              <div key={c.title} data-av="card" className={s.card}>
                <div className={s.cardHeader}>
                  <div className={s.icon}><GoogleIcon name={c.icon} size={20} /></div>
                  <h3 className={s.cardTitle}>{c.title}</h3>
                </div>
                <p className={s.cardText}>{c.text}</p>
              </div>
            ))}
          </div>

          <div data-av="cta" className={s.cta}>
            <Link to="/aaryaveera" className={s.btnWarriorGold}>Explore Aaryaveera Philosophy →</Link>
            <Link to="/about#founder" className={s.btnWarriorOutline}>Founder Profile &amp; Bio</Link>
          </div>
        </div>

        {/* RIGHT: SVG warrior */}
        <div data-av="svgwrap" className={s.svgWrap}>
          <svg
            ref={svgRef}
            className={s.mainSVG}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 600 600"
            overflow="visible"
          >
            <defs>
              <filter id="avGlow" y="-50%" height="180%" colorInterpolationFilters="sRGB">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              fill="#000"
              d="M250.1,477.1c0,0,17.9-37.5,28.3-47.5c8.3-8,10.9-12.4,40.4,0
                c29.5,12.4,38.1,8.5,45.1,3.1c7-5.4,8.2-19.8,6.9-23.8c-1.3-4.1,3.4-9.3,6.3-9
                c2.9,0.3,7.7-3.1,8-6.6s0.4-3.2-0.9-8.6c2.8-1,16.2-3.4,9.3-15
                c-6.8-11.7,3.8-15.1,3.8-15.1s19.2-0.2,19.4-11.7c0.2-11.5-17.1-33.2-17.9-40.6
                c-0.8-7.4,3.5-18.1,3.5-18.1s15.1-38.8-3.5-75.7c-18.6-36.9-69.1-52-88.2-53.6
                c-40-3.3-86.6,12.4-103.7,65.3s-4.2,92.3-4.7,108.8c-1.6,56-45.6,91.3-45.6,91.3
                L250.1,477.1z"
            />

            <text x="300" y="548" textAnchor="middle"
              fontFamily="Cinzel, serif" fontSize="18" fontWeight="700"
              letterSpacing="6" fill="#E8C98A" opacity="0.9">
              AARYAVEERA
            </text>
            <text x="300" y="570" textAnchor="middle"
              fontFamily="Noto Sans Devanagari, sans-serif"
              fontSize="13" fill="#C9A96E" opacity="0.7">
              आर्यवीरा
            </text>
          </svg>
        </div>
      </div>
    </section>
  )
}
