import Hero         from '../components/Hero/Hero'
import Profile      from '../components/Profile/Profile'
import About        from '../components/About/About'
import ImpactGrid   from '../components/ImpactGrid/ImpactGrid'
import Aaryaveera   from '../components/Aaryaveera/Aaryaveera'
import SocialWork   from '../components/SocialWork/SocialWork'
import Articles     from '../components/Articles/Articles'
import Sahyog       from '../components/Sahyog/Sahyog'
import Courses      from '../components/Courses/Courses'
import HistoryGirls from '../components/HistoryGirls/HistoryGirls'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Profile />
      <About />
      <ImpactGrid />
      <Aaryaveera />
      <SocialWork />
      <Articles />
      <Sahyog />
      <Courses />
      <HistoryGirls />
    </main>
  )
}
