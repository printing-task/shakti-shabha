import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../../lib/LanguageContext'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import s from './LanguageSwitcher.module.css'

interface LanguageSwitcherProps {
  floating?: boolean
  className?: string
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
          <GoogleIcon name="translate" size={18} />
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
        <GoogleIcon name="translate" size={19} />
        <span className={s.langCodeBadge}>{language === 'en' ? 'EN' : 'HI'}</span>
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
