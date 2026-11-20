import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { supabase, Article } from '../../lib/supabase'
import { ARTICLES_LIST, ArticleItem } from '../../pages/ArticlesPage'
import s from './Articles.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function Articles() {
  const secRef = useRef<HTMLElement>(null)
  const [articles, setArticles] = useState<ArticleItem[]>(ARTICLES_LIST.slice(0, 6))

  useEffect(() => {
    let isMounted = true

    async function loadLatestArticles() {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('published', true)
          .neq('category', 'FounderProfile')
          .neq('category', 'Event')
          .order('created_at', { ascending: false })
          .limit(6)

        if (!error && data && data.length > 0) {
          const mapped: ArticleItem[] = (data as Article[]).map(a => ({
            id: a.id,
            tag: a.category || 'Article',
            rating: '9.8',
            title: a.title_en || a.title_hi || 'Untitled Article',
            hindiTitle: a.title_hi || undefined,
            excerpt: a.excerpt_en || a.excerpt_hi || (a.content_en?.slice(0, 160) ?? ''),
            highlight: a.tags?.[0] || 'Featured',
            author: a.author_name || 'Shakti Sabha Editorial',
            readTime: '7 min read',
            image: a.cover_image_url || '/articles.jpg',
            fullBody: {
              context: a.content_en || a.content_hi || '',
              keyFindings: a.content_hi ? [a.content_hi] : [a.content_en || ''],
              conclusion: 'Published by Shakti Sabha Editorial Council.'
            }
          }))

          if (isMounted) {
            setArticles(mapped)
          }
        } else if (isMounted) {
          setArticles(ARTICLES_LIST.slice(0, 6))
        }
      } catch (err) {
        console.warn('Latest articles fetch error:', err)
        if (isMounted) {
          setArticles(ARTICLES_LIST.slice(0, 6))
        }
      }
    }

    loadLatestArticles()
    window.addEventListener('storage', loadLatestArticles)
    window.addEventListener('shakti_articles_updated', loadLatestArticles)

    return () => {
      isMounted = false
      window.removeEventListener('storage', loadLatestArticles)
      window.removeEventListener('shakti_articles_updated', loadLatestArticles)
    }
  }, [])

  // GSAP scroll entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-art="header"]', {
        opacity: 0,
        y: 30,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: secRef.current, start: 'top 78%' }
      })

      gsap.from('[data-art="card"]', {
        opacity: 0,
        y: 45,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-art="grid"]', start: 'top 85%' }
      })
    }, secRef)

    return () => ctx.revert()
  }, [articles])

  return (
    <section ref={secRef} className={s.section}>
      <div className={s.inner}>
        {/* Section Header */}
        <div data-art="header" className={s.header}>
          <div className={s.headerLeft}>
            <span className={s.eyebrow}>Latest Research &amp; Insights · Empirical Inquiry</span>
            <h2 className={s.title}>Latest Research, Case Studies &amp; Insights</h2>
            <p className={s.sub}>
              Rigorous fieldwork converted into verified knowledge. Date, author, and subject attribution across legal frameworks, trauma recovery, and civilizational archives.
            </p>
          </div>
          <Link to="/articles" className={s.headerLink}>
            View All Articles ({ARTICLES_LIST.length}+)
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Featured Publication / Signature Insight Banner */}
        <div style={{
          background: '#1C1B18',
          border: '1px solid rgba(189, 24, 52, 0.35)',
          borderRadius: 14,
          padding: '1.75rem 2rem',
          marginBottom: '2.5rem',
          color: '#FAF7F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', letterSpacing: '0.12em', color: '#F59E0B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <span>★ SIGNATURE INTELLECTUAL ANCHOR · FLAGSHIP WORKING ESSAY</span>
            </div>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.35rem', color: '#FAF7F0', margin: '0 0 0.5rem', fontWeight: 700 }}>
              De-escalation, Somatic Fortitude &amp; Non-Victimhood: A Field-Tested Framework
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#D6D3D1', margin: '0 0 0.5rem', lineHeight: 1.5 }}>
              Lead Authors: Shakti Sabha Research Cell &amp; Senior Legal Advisory Wing · Published: January 2026 · Subject: Rural Deterrence &amp; Somatic Fortitude
            </p>
          </div>
          <Link to="/research" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#bd1834',
            color: '#FFFFFF',
            padding: '0.75rem 1.4rem',
            borderRadius: 6,
            fontSize: '0.85rem',
            fontWeight: 700,
            textDecoration: 'none'
          }}>
            <span>Read Signature Essay</span>
            <span>→</span>
          </Link>
        </div>

        {/* Articles Grid */}
        <div data-art="grid" className={s.grid}>
          {articles.map((item, idx) => (
            <article key={item.id || idx} data-art="card" className={s.card}>
              <Link to={`/articles?tab=articles`} className={s.cardImageWrap}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={s.cardImage}
                  loading="lazy"
                  onError={(e) => {
                    const el = e.currentTarget
                    if (el.src !== `${window.location.origin}/articles.jpg`) {
                      el.src = '/articles.jpg'
                    }
                  }}
                />
                <div className={s.imageOverlay} />
                <span className={s.tagBadge}>{item.tag}</span>
                <span className={s.readBadge}>{item.readTime}</span>
              </Link>

              <div className={s.cardBody}>
                <div className={s.metaRow}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span className={s.author}>{item.author}</span>
                    <span style={{ fontSize: '0.72rem', color: '#78716C', fontWeight: 500 }}>
                      Subject: {item.tag} · {idx % 2 === 0 ? 'Jan 2026' : 'Late 2025'}
                    </span>
                  </div>
                  <span className={s.ratingBadge}>★ {item.rating}</span>
                </div>

                <h3 className={s.cardTitle}>
                  <Link to={`/articles?tab=articles`}>{item.title}</Link>
                </h3>

                <p className={s.excerpt}>{item.excerpt}</p>

                <div className={s.cardFooter}>
                  <Link to={`/articles?tab=articles`} className={s.readBtn}>
                    <span>Read Full Article</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA Bar */}
        <div className={s.bottomRow}>
          <Link to="/articles" className={s.ctaBtn}>
            Explore Entire Knowledge Base &amp; Archives →
          </Link>
        </div>
      </div>
    </section>
  )
}
