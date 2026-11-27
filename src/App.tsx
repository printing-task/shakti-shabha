import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { ReactLenis, useLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from './components/Navigation/Navigation'
import { AuthProvider } from './lib/AuthContext'
import { LanguageProvider } from './lib/LanguageContext'
import HomePage from './pages/HomePage'
import Footer from './components/Footer/Footer'

const AaryaveeraPage = lazy(() => import('./pages/AaryaveeraPage'))
const SocialWorkPage = lazy(() => import('./pages/SocialWorkPage'))
const EventsPage = lazy(() => import('./pages/EventsPage'))
const ImpactPage = lazy(() => import('./pages/ImpactPage'))
const SahyogPage = lazy(() => import('./pages/SahyogPage'))
const CoursesPage = lazy(() => import('./pages/CoursesPage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage'))
const BrandPage = lazy(() => import('./pages/BrandPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage'))
const ResearchPage = lazy(() => import('./pages/ResearchPage'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'))
const CounsellingPage = lazy(() => import('./pages/CounsellingPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const MardiniPage = lazy(() => import('./pages/MardiniPage'))
const ShaktiBhavaPage = lazy(() => import('./pages/ShaktiBhavaPage'))
const ShaktiVartaPage = lazy(() => import('./pages/ShaktiVartaPage'))
const ThreeStreamsPage = lazy(() => import('./pages/ThreeStreamsPage'))

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

/** Page wrapper — guaranteed min-height, instant render */
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        flex: '1 0 auto',
        minHeight: '85vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
        {children}
      </Suspense>
    </div>
  )
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
        duration: 0.5,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.1,
        touchMultiplier: 1.5,
        syncTouch: true,
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
