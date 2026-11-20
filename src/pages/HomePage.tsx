import Hero from '../components/Hero/Hero'
import Courses from '../components/Courses/Courses'
import Articles from '../components/Articles/Articles'
import SocialWork from '../components/SocialWork/SocialWork'
import About from '../components/About/About'
import ImpactGrid from '../components/ImpactGrid/ImpactGrid'
import Sahyog from '../components/Sahyog/Sahyog'
import Profile from '../components/Profile/Profile'
import Aaryaveera from '../components/Aaryaveera/Aaryaveera'
import HistoryGirls from '../components/HistoryGirls/HistoryGirls'
import FinalCTA from '../components/FinalCTA/FinalCTA'

export default function HomePage() {
  return (
    <main>
      {/* 1. HERO: Shakti Sabha name, Sanskrit 1-line positioning, 3D Orbit Cards, Explore Research | Our Work */}
      <Hero />

      {/* 2. KNOWLEDGE: What We Study — 4–5 Core Disciplines (Youth, Safeguarding, Human Behaviour, Indian Civilizational Thought, Kshatra Dharma) */}
      <Courses />

      {/* 3. RESEARCH: Latest Research / Insights — Articles, Case Studies with Date + Author + Subject */}
      <Articles />

      {/* 4. FROM THE FIELD: 3D Tilt Card Ring Carousel — Ground Realities & "What We Observed / What We Learned" */}
      <SocialWork />

      {/* 5. THREE INSTITUTIONAL STREAMS: Mardini (Safety), Bhava (Well-being), Varta (Research & Dialogue) */}
      <About />

      {/* 6. INSTITUTIONAL CREDIBILITY: Verified Audited Footprint & Numbers (2019–2026, 7+ Years) */}
      <ImpactGrid />

      {/* 7. DIALOGUE & COLLABORATION: Universities, Researchers, Civil Society, Institutions & 5-Column Infinite Parallax */}
      <Sahyog />

      {/* 8. FOUNDER: Professional Profile — Balanced, Dignified, kept below the institution (Aaryaveera section handles the movement) */}
      <Profile />

      {/* 9. AARYAVEERA WORLDVIEW: Interactive Physics Particle Animation & Leadership Code */}
      <Aaryaveera />

      {/* 10. HISTORICAL RECORD: Milestones & Historical Heritage */}
      <HistoryGirls />

      {/* 11. FINAL CTA: Read Our Research | Collaborate With Us */}
      <FinalCTA />
    </main>
  )
}
