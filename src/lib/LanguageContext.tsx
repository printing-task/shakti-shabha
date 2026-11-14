import React, { createContext, useContext, useEffect, useState } from 'react'

export type Language = 'en' | 'hi'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  isTranslating: boolean
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  isTranslating: false
})

declare global {
  interface Window {
    google?: any
    googleTranslateElementInit?: () => void
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('shakti_selected_lang')
      if (saved === 'hi' || saved === 'en') return saved
    } catch { /* ignore */ }
    return 'en'
  })
  const [isTranslating, setIsTranslating] = useState(false)

  // Inject Google Translate script once
  useEffect(() => {
    // Hidden container for Google Translate element
    if (!document.getElementById('google_translate_element')) {
      const div = document.createElement('div')
      div.id = 'google_translate_element'
      div.style.display = 'none'
      document.body.appendChild(div)
    }

    // Google Translate Init callback
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi',
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          },
          'google_translate_element'
        )

        // Apply saved language if Hindi
        const saved = localStorage.getItem('shakti_selected_lang')
        if (saved === 'hi') {
          setTimeout(() => applyTranslation('hi'), 500)
        }
      }
    }

    // Add script tag if not already added
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script')
      script.id = 'google-translate-script'
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)
    }

    // Inject CSS to hide Google banner/frames for seamless look & ensure Hindi font styling
    if (!document.getElementById('google-translate-custom-styles')) {
      const style = document.createElement('style')
      style.id = 'google-translate-custom-styles'
      style.innerHTML = `
        /* Hide Google Translate banner, toolbar, and tooltips */
        .goog-te-banner-frame.skiptranslate,
        .goog-te-banner-frame,
        #goog-gt-tt,
        .goog-te-balloon-frame,
        .goog-tooltip,
        .goog-tooltip:hover {
          display: none !important;
          visibility: hidden !important;
        }
        body {
          top: 0px !important;
          position: static !important;
        }
        .goog-text-highlight {
          background-color: transparent !important;
          box-shadow: none !important;
        }
        #google_translate_element {
          display: none !important;
        }
        .skiptranslate iframe {
          display: none !important;
        }

        /* Prevent icons from being translated or distorted */
        .notranslate,
        .material-symbols-outlined,
        .material-icons,
        span[class*="material-symbols"],
        span[class*="material-icons"] {
          font-family: 'Material Symbols Outlined', 'Material Icons' !important;
          speak: none !important;
          font-style: normal !important;
          font-weight: normal !important;
          text-transform: none !important;
          line-height: 1 !important;
          letter-spacing: normal !important;
          word-wrap: normal !important;
          white-space: nowrap !important;
          direction: ltr !important;
          -webkit-font-smoothing: antialiased !important;
          text-rendering: optimizeLegibility !important;
        }

        /* Prevent Hindi translation clipping or font transparency bugs */
        html.translated-ltr, html.translated-rtl {
          font-family: 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        html.translated-ltr font, html.translated-rtl font {
          font-family: inherit !important;
          color: inherit !important;
          -webkit-text-fill-color: currentColor !important;
          vertical-align: baseline !important;
        }
        /* Ensure translated headings and titles don't overflow or clip */
        html.translated-ltr [class*="title"],
        html.translated-ltr [class*="heading"],
        html.translated-ltr h1,
        html.translated-ltr h2,
        html.translated-ltr h3 {
          line-height: 1.25 !important;
          overflow: visible !important;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  const applyTranslation = (lang: Language) => {
    setIsTranslating(true)

    const hostname = window.location.hostname
    if (lang === 'hi') {
      const cookieVal = '/en/hi'
      document.cookie = `googtrans=${cookieVal}; path=/;`
      document.cookie = `googtrans=${cookieVal}; path=/; domain=${hostname}`
      document.cookie = `googtrans=${cookieVal}; path=/; domain=.${hostname}`
    } else {
      // Reverting to English
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname}`
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname}`
      document.cookie = `googtrans=/en/en; path=/;`
      document.cookie = `googtrans=/en/en; path=/; domain=${hostname}`
      document.cookie = `googtrans=/en/en; path=/; domain=.${hostname}`
    }

    const triggerCombo = () => {
      try {
        const select = document.querySelector<HTMLSelectElement>('.goog-te-combo')
        if (select) {
          const options = Array.from(select.options)
          let targetVal = lang
          if (lang === 'en') {
            // Source language option might be empty string or 'en'
            const hasEn = options.some(o => o.value === 'en')
            targetVal = hasEn ? 'en' : ('' as any)
          }
          select.value = targetVal
          select.dispatchEvent(new Event('change', { bubbles: true }))
          select.dispatchEvent(new Event('input', { bubbles: true }))
          if (typeof (select as any).onchange === 'function') {
            (select as any).onchange(new Event('change'))
          }
          return true
        }
      } catch (e) {
        console.warn('Google translation trigger warning:', e)
      }
      return false
    }

    // Try immediately, or retry if widget is still initializing
    let attempts = 0
    const interval = setInterval(() => {
      attempts++
      const success = triggerCombo()
      if (success || attempts >= 15) {
        clearInterval(interval)
        setIsTranslating(false)
        window.dispatchEvent(new CustomEvent('shakti_language_changed', { detail: { language: lang } }))
      }
    }, 150)
  }

  const setLanguage = (lang: Language) => {
    if (lang === language) return

    setLanguageState(lang)
    try {
      localStorage.setItem('shakti_selected_lang', lang)
    } catch { /* ignore */ }

    const hostname = window.location.hostname
    if (lang === 'hi') {
      const cookieVal = '/en/hi'
      document.cookie = `googtrans=${cookieVal}; path=/;`
      document.cookie = `googtrans=${cookieVal}; path=/; domain=${hostname}`
      document.cookie = `googtrans=${cookieVal}; path=/; domain=.${hostname}`
    } else {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname}`
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname}`
      document.cookie = `googtrans=/en/en; path=/;`
      document.cookie = `googtrans=/en/en; path=/; domain=${hostname}`
      document.cookie = `googtrans=/en/en; path=/; domain=.${hostname}`
    }

    // Automatically reload so all text nodes re-evaluate and render in Hindi/English
    window.location.reload()
  }

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'hi' : 'en'
    setLanguage(nextLang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
