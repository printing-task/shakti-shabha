import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../../lib/LanguageContext'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import s from './LanguageSwitcher.module.css'

interface LanguageSwitcherProps {
  floating?: boolean
  className?: string
}

function TranslateGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
    </svg>
  )
}

export default function LanguageSwitcher({ floating = false, className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage, isTranslating } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (lang: 'en' | 'hi') => {
    setLanguage(lang)
    setIsOpen(false)
  }

  // Floating button style (bottom right of screen)
  if (floating) {
    return (
      <div ref={menuRef} className={`${s.floatingWrapper} ${className}`} data-lenis-prevent="true">
        <button
          type="button"
          className={`${s.floatingBtn} ${isTranslating ? s.translating : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Select Language"
          title="Translate / भाषा चुनें"
        >
          <TranslateGlyph size={18} />
          <span className={s.currentLangBadge}>{language === 'en' ? 'EN' : 'हिन्दी'}</span>
        </button>

        {isOpen && (
          <div className={s.floatingDropdown}>
            <div className={s.dropdownTitle}>Select Language / भाषा चुनें</div>
            <button
              type="button"
              className={`${s.dropdownItem} ${language === 'en' ? s.activeItem : ''}`}
              onClick={() => handleSelect('en')}
            >
              <span className={s.langCode}>EN</span>
              <span className={s.langLabel}>English</span>
              {language === 'en' && <GoogleIcon name="check" size={16} className={s.checkIcon} />}
            </button>
            <button
              type="button"
              className={`${s.dropdownItem} ${language === 'hi' ? s.activeItem : ''}`}
              onClick={() => handleSelect('hi')}
            >
              <span className={s.langCode}>HI</span>
              <span className={s.langLabel}>हिन्दी (Hindi)</span>
              {language === 'hi' && <GoogleIcon name="check" size={16} className={s.checkIcon} />}
            </button>
          </div>
        )}
      </div>
    )
  }

  // Header / Navbar style: Clean translator icon button with language code badge
  return (
    <div ref={menuRef} className={`${s.headerSwitcherWrap} ${className}`}>
      <button
        type="button"
        className={`${s.headerIconBtn} ${isOpen ? s.headerIconBtnActive : ''} ${isTranslating ? s.translating : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Translate Website - Language Menu"
        title="Translate Website / भाषा बदलें"
      >
        <TranslateGlyph size={18} />
      </button>

      {isOpen && (
        <div className={s.headerDropdown}>
          <div className={s.dropdownHeader}>
            <GoogleIcon name="language" size={14} />
            <span>Select Language / भाषा</span>
          </div>
          <div className={s.dropdownList}>
            <button
              type="button"
              className={`${s.dropdownOption} ${language === 'en' ? s.activeOption : ''}`}
              onClick={() => handleSelect('en')}
            >
              <div className={s.optionLeft}>
                <span className={s.optionCode}>EN</span>
                <span className={s.optionName}>English</span>
              </div>
              {language === 'en' && <GoogleIcon name="check" size={16} className={s.checkIcon} />}
            </button>
            <button
              type="button"
              className={`${s.dropdownOption} ${language === 'hi' ? s.activeOption : ''}`}
              onClick={() => handleSelect('hi')}
            >
              <div className={s.optionLeft}>
                <span className={s.optionCode}>HI</span>
                <span className={s.optionName}>हिन्दी (Hindi)</span>
              </div>
              {language === 'hi' && <GoogleIcon name="check" size={16} className={s.checkIcon} />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
