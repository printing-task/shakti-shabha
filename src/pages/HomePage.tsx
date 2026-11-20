import Hero from '../components/Hero/Hero'
import About from '../components/About/About'
import Courses from '../components/Courses/Courses'
import Sahyog from '../components/Sahyog/Sahyog'
import Articles from '../components/Articles/Articles'
import SocialWork from '../components/SocialWork/SocialWork'
import ImpactGrid from '../components/ImpactGrid/ImpactGrid'
import Profile from '../components/Profile/Profile'
import Aaryaveera from '../components/Aaryaveera/Aaryaveera'
import HistoryGirls from '../components/HistoryGirls/HistoryGirls'
import FinalCTA from '../components/FinalCTA/FinalCTA'

export default function HomePage() {
  return (
    <main id="home">
      {/* 1. HERO & INTRO: Hero banner with Sanskrit & 4-column Who We Are + 3 Features */}
      <Hero />

      {/* 2. THREE STREAMS: The Union of Peace & Revolution (Ⅰ Mission Mardini, Ⅱ Shakti Bhava, Ⅲ Shakti Varta) */}
      <About />

      {/* 3. WHAT WE DO: 8-Grid of institutional services on warm linen gradient */}
      <Courses />

      {/* 4. OUR STORY: 2-column field photo & purpose + core metrics (03 streams, 01 purpose, ∞ room to grow) */}
      <Sahyog />

      {/* 5. LATEST RESEARCH / INSIGHTS: High-impact articles, field reports & monographs */}
      <Articles />

      {/* 6. FROM THE FIELD: 3D Ground Realities & "What We Observed / What We Learned" */}
      <SocialWork />

      {/* 7. INSTITUTIONAL CREDIBILITY: Verified Footprint & Field Indicators (2,000+ trained, 25,000+ youth, 13 rescues) */}
      <ImpactGrid />

      {/* 8. FOUNDER: Professional Profile — Balanced & Dignified */}
      <Profile />

      {/* 9. AARYAVEERA WORLDVIEW: Interactive Code & Civilizational Leadership */}
      <Aaryaveera />

      {/* 10. HISTORICAL RECORD: Milestones & Historical Heritage */}
      <HistoryGirls />

      {/* 11. FINAL QUOTE: Editorial Dark Strip "Strength is not the opposite of peace. It is one of the ways we protect it." */}
      <FinalCTA />
    </main>
  )
}
