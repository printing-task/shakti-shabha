import { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { ReactLenis, useLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from './components/Navigation/Navigation'
import { AuthProvider } from './lib/AuthContext'
import { LanguageProvider } from './lib/LanguageContext'
import HomePage from './pages/HomePage'
import AaryaveeraPage from './pages/AaryaveeraPage'
import SocialWorkPage from './pages/SocialWorkPage'
import EventsPage from './pages/EventsPage'
import ImpactPage from './pages/ImpactPage'
import SahyogPage from './pages/SahyogPage'
import CoursesPage from './pages/CoursesPage'
import HistoryPage from './pages/HistoryPage'
import BrandPage from './pages/BrandPage'
import AboutPage from './pages/AboutPage'
import CaseStudyPage from './pages/CaseStudyPage'
import ResearchPage from './pages/ResearchPage'
import GalleryPage from './pages/GalleryPage'
import ArticlesPage from './pages/ArticlesPage'
import CounsellingPage from './pages/CounsellingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminDashboard from './pages/AdminDashboard'
import MardiniPage from './pages/MardiniPage'
import ShaktiBhavaPage from './pages/ShaktiBhavaPage'
import ShaktiVartaPage from './pages/ShaktiVartaPage'
import ThreeStreamsPage from './pages/ThreeStreamsPage'
import Footer from './components/Footer/Footer'

gsap.registerPlugin(ScrollTrigger)
if (typeof window !== 'undefined') {
  ScrollTrigger.clearScrollMemory('manual')
}

function ScrollToTop() {
  const { pathname } = useLocation()
  const lenis = useLenis()

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true })
  }, [lenis, pathname])

  return null
}

function ScrollTriggerSync() {
  useLenis((lenis) => {
    ScrollTrigger.update()
    if (typeof window !== 'undefined') {
      ;(window as any).lenis = lenis
    }
  })

  return null
}

/** Page wrapper — fades in on every route change */
function PageTransition({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    // skip admin routes — they manage their own layout
    if (pathname.startsWith('/admin')) return
    gsap.fromTo(
      ref.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.38, ease: 'power2.out' }
    )
  }, [pathname])

  return <div ref={ref}>{children}</div>
}

export default function App() {
  // Prevent layout shifts on refresh by recalculating ScrollTrigger when assets settle
  useEffect(() => {
    const handleRefresh = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('load', handleRefresh)
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh()
      })
    }
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 400)
    return () => {
      window.removeEventListener('load', handleRefresh)
      clearTimeout(timer)
    }
  }, [])

  // Failsafe: Ensure page scroll is never trapped by any container or modal
  useEffect(() => {
    const unlockPageScroll = () => {
      if (document.body.style.overflow === 'hidden' || document.documentElement.style.overflow === 'hidden') {
        const hasOpenModal = document.querySelector('[role="dialog"], [data-modal="true"]');
        if (!hasOpenModal) {
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
        }
      }
    };

    const handleKeyScroll = (e: KeyboardEvent) => {
      if (['Space', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'End', 'Home'].includes(e.code)) {
        unlockPageScroll();
      }
    };

    window.addEventListener('keydown', handleKeyScroll, { passive: true });
    window.addEventListener('resize', unlockPageScroll, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleKeyScroll);
      window.removeEventListener('resize', unlockPageScroll);
    };
  }, []);

  return (
        <ReactLenis
      root
      options={{
        duration: 1.0,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        syncTouch: false,
        infinite: false,
      }}
    >
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <ScrollToTop />
            <ScrollTriggerSync />
            <Navigation />
            <PageTransition>
              <Routes>
                <Route path="/"                     element={<HomePage />} />
                <Route path="/home"                 element={<HomePage />} />
                <Route path="/aaryaveera"           element={<AaryaveeraPage />} />
                <Route path="/mardini"              element={<MardiniPage />} />
                <Route path="/mission-mardini"      element={<MardiniPage />} />
                <Route path="/shakti-bhava"         element={<ShaktiBhavaPage />} />
                <Route path="/shakti-varta"         element={<ShaktiVartaPage />} />
                <Route path="/social-work"          element={<SocialWorkPage />} />
                <Route path="/events"               element={<EventsPage />} />
                <Route path="/impact"               element={<ImpactPage />} />
                <Route path="/impact-archive"       element={<ImpactPage />} />
                <Route path="/sahyog"               element={<SahyogPage />} />
                <Route path="/collaboration"        element={<SahyogPage />} />
                <Route path="/courses"              element={<CoursesPage />} />
                <Route path="/history"              element={<HistoryPage />} />
                <Route path="/gallery"              element={<GalleryPage />} />
                <Route path="/articles"             element={<ArticlesPage />} />
                <Route path="/counselling"          element={<CounsellingPage />} />
                <Route path="/case-study"           element={<CaseStudyPage />} />
                <Route path="/research"             element={<ResearchPage />} />
                <Route path="/brand"                element={<BrandPage />} />
                <Route path="/about"                element={<AboutPage />} />
                <Route path="/three-streams"        element={<ThreeStreamsPage />} />
                <Route path="/streams"              element={<ThreeStreamsPage />} />
                <Route path="/peace-and-revolution" element={<ThreeStreamsPage />} />
                <Route path="/login"                element={<LoginPage />} />
                <Route path="/register"             element={<RegisterPage />} />
                <Route path="/admin"                element={<AdminDashboard />} />
                {/* Fallback to HomePage for any unknown URL */}
                <Route path="*"                     element={<HomePage />} />
              </Routes>
            </PageTransition>
            <Footer />
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </ReactLenis>
  )
}
