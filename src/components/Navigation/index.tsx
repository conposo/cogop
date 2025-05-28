'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/Auth/AuthModal'
import UserMenu from '@/components/Auth/UserMenu'
import SearchModal from '@/components/SearchModal'
import { setLocale, t } from '@/lib/i18n'
import { useI18n } from '@/contexts/I18nContext'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [isMac, setIsMac] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const togglerRef = useRef<HTMLButtonElement>(null)
  const { user, loading } = useAuth()
  const { language, setLanguage } = useI18n()

  // Add Bootstrap JS on client side
  useEffect(() => {
    // Detect if user is on macOS
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
    
    // Bootstrap is already loaded via script tag in layout.tsx
    // Initialize dropdowns when component mounts
    const initializeDropdowns = () => {
      if (typeof window !== 'undefined' && (window as any).bootstrap) {
        // Clear any existing dropdowns first
        const dropdownElementList = document.querySelectorAll('[data-bs-toggle="dropdown"]')
        dropdownElementList.forEach(dropdownToggleEl => {
          // Check if dropdown already exists
          const existingDropdown = (window as any).bootstrap.Dropdown.getInstance(dropdownToggleEl)
          if (existingDropdown) {
            existingDropdown.dispose()
          }
          // Create new dropdown
          new (window as any).bootstrap.Dropdown(dropdownToggleEl)
        })
        console.log('Dropdowns initialized:', dropdownElementList.length)
      }
    }

    // Wait for both Bootstrap and DOM to be ready
    const checkAndInit = () => {
      if ((window as any).bootstrap && document.readyState === 'complete') {
        initializeDropdowns()
      } else {
        setTimeout(checkAndInit, 100)
      }
    }

    // If document is already loaded, check immediately
    if (document.readyState === 'complete') {
      setTimeout(checkAndInit, 500) // Give a bit more time for Bootstrap to load
    } else {
      // Otherwise wait for load event
      window.addEventListener('load', checkAndInit)
      return () => window.removeEventListener('load', checkAndInit)
    }
  }, [])

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
      setLocale(savedLanguage);
    }
  }, [setLanguage]);

  // Handle clicking outside the navigation
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as Element
      
      // Don't close if clicking on dropdown items or dropdown toggles
      if (target.closest('.dropdown-menu') || target.closest('.dropdown-toggle')) {
        return
      }
      
      if (
        navRef.current && 
        !navRef.current.contains(event.target as Node) &&
        togglerRef.current &&
        !togglerRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false)
        // Close Bootstrap collapse
        const navbarCollapse = document.getElementById('navbarContent')
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          const bsCollapse = new (window as any).bootstrap.Collapse(navbarCollapse, {
            toggle: false
          })
          bsCollapse.hide()
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearchModal(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle toggle button click
  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  // Handle menu item click (close menu on mobile)
  const handleMenuItemClick = () => {
    if (isOpen) {
      setIsOpen(false)
      // Close Bootstrap collapse
      const navbarCollapse = document.getElementById('navbarContent')
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = new (window as any).bootstrap.Collapse(navbarCollapse, {
          toggle: false
        })
        bsCollapse.hide()
      }
    }
  }

  const handleAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const handleSearchClick = () => {
    setShowSearchModal(true)
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    setLanguage(newLocale);
    setLocale(newLocale);
    localStorage.setItem('language', newLocale);
  };

  // Force re-render when language changes
  useEffect(() => {
    // This effect will trigger when language changes, causing the component to re-render
  }, [language]);

  const mainMenu = [
    {
      title: t('get_connected', { defaultValue: 'Get Connected' }),
      items: [
        { title: t('calendar', { defaultValue: 'Calendar' }), href: '/get-connected/calendar' },
        { title: t('contact', { defaultValue: 'Contact' }), href: '/get-connected/contact' },
        { title: t('faq', { defaultValue: 'FAQ' }), href: '/get-connected/faq' },
        { title: t('employment', { defaultValue: 'Employment' }), href: '/get-connected/employment' },
        { title: t('schedule_tour', { defaultValue: 'Schedule a Tour' }), href: '/get-connected/schedule-tour' },
      ]
    },
    {
      title: t('about', { defaultValue: 'About' }),
      items: [
        { title: t('who_we_are', { defaultValue: 'Who We Are' }), href: '/about/who-we-are' },
        { title: t('what_we_believe', { defaultValue: 'What We Believe' }), href: '/about/what-we-believe' },
        { title: t('our_leadership', { defaultValue: 'Our Leadership' }), href: '/about/leadership' },
        { title: t('our_history', { defaultValue: 'Our History' }), href: '/about/history' },
        { title: t('membership', { defaultValue: 'Membership' }), href: '/about/membership' },
      ]
    },
    {
      title: t('ministries', { defaultValue: 'Ministries' }),
      items: [
        { title: t('admin_finance_title', { defaultValue: 'Administration & Finance' }), href: '/ministries/admin-finance' },
        { title: t('global_missions_title', { defaultValue: 'Global Missions' }), href: '/ministries/global-missions' },
        { title: t('harvest_partners_title', { defaultValue: 'Harvest Partners' }), href: '/ministries/harvest-partners' },
        { title: t('helping_hands_title', { defaultValue: 'Helping Hands' }), href: '/ministries/helping-hands' },
        { title: t('one_child_fund_title', { defaultValue: 'One Child Fund' }), href: '/ministries/one-child-fund' },
        { title: t('heritage_title', { defaultValue: 'Heritage' }), href: '/ministries/heritage' },
        // { title: t('fields_of_wood_title', { defaultValue: 'Fields of the Wood' }), href: '/ministries/fields-of-the-wood' },
        { title: t('stewardship_title', { defaultValue: 'Stewardship' }), href: '/ministries/stewardship' },
        { title: t('bookstore_title', { defaultValue: 'Bookstore' }), href: '/ministries/bookstore' },
        // { title: t('global_communications_title', { defaultValue: 'Global Communications' }), href: '/ministries/global-communications' },
        // { title: t('white_wing_messenger_title', { defaultValue: 'White Wing Messenger' }), href: '/ministries/white-wing-messenger' },
        { title: t('prayer_title', { defaultValue: 'Prayer' }), href: '/ministries/prayer' },
        { title: t('international_assembly_title', { defaultValue: 'International Assembly' }), href: '/ministries/international-assembly' },
        { title: t('leadership_development_title', { defaultValue: 'Leadership Development' }), href: '/ministries/leadership-development' },
        // { title: t('accredited_ministries_title', { defaultValue: 'Accredited Ministries' }), href: '/ministries/accredited-ministries' },
        { title: t('center_biblical_leadership_title', { defaultValue: 'Center for Biblical Leadership' }), href: '/ministries/center-biblical-leadership' },
        // { title: t('spirit_life_seminary_title', { defaultValue: 'Spirit & Life Seminary' }), href: '/ministries/spirit-life-seminary' },
        { title: t('childrens_title', { defaultValue: "Children's" }), href: '/ministries/childrens' },
        { title: t('youth_title', { defaultValue: 'Youth' }), href: '/ministries/youth' },
      ]
    },
    // {
    //   title: t('where_we_serve', { defaultValue: 'Where We Serve' }),
    //   items: [
    //     { title: t('presiding_bishop', { defaultValue: 'Presiding Bishop' }), href: '/where-we-serve/presiding-bishop' },
    //     { title: t('africa', { defaultValue: 'Africa' }), href: '/where-we-serve/africa' },
    //     { title: t('asia_australia_oceania', { defaultValue: 'Asia, Australia & Oceania' }), href: '/where-we-serve/asia-australia-oceania' },
    //     { title: t('caribbean_atlantic', { defaultValue: 'Caribbean & Atlantic' }), href: '/where-we-serve/caribbean-atlantic' },
    //     { title: t('central_america', { defaultValue: 'Central America' }), href: '/where-we-serve/central-america' },
    //     { title: t('north_america', { defaultValue: 'North America' }), href: '/where-we-serve/north-america' },
    //     { title: t('south_america', { defaultValue: 'South America' }), href: '/where-we-serve/south-america' },
    //     { title: t('europe_middle_east', { defaultValue: 'Europe & Middle East' }), href: '/where-we-serve/europe-middle-east' },
    //   ]
    // },
    {
      title: t('resources', { defaultValue: 'Resources' }),
      items: [
        { title: t('get_started_title', { defaultValue: 'Get Started' }), href: '/resources/get-started' },
        { title: t('how_to_know_god_title', { defaultValue: 'How to Know God' }), href: '/resources/how-to-know-god' },
        { title: t('membership', { defaultValue: 'Membership' }), href: '/resources/membership' },
        { title: t('media_title', { defaultValue: 'Media' }), href: '/resources/media' },
        { title: t('podcasts_title', { defaultValue: 'Podcasts' }), href: '/resources/podcasts' },
        { title: t('youtube_title', { defaultValue: 'YouTube' }), href: '/resources/youtube' },
        { title: t('library_title', { defaultValue: 'Library' }), href: '/resources/library' },
        { title: t('assembly_documents_title', { defaultValue: 'Assembly Documents' }), href: '/resources/assembly-documents' },
        { title: t('policies_guidelines_title', { defaultValue: 'Policies & Guidelines' }), href: '/resources/policies-guidelines' },
        { title: t('public_statements_title', { defaultValue: 'Public Statements' }), href: '/resources/public-statements' },
        { title: t('assembly_minutes_title', { defaultValue: 'Assembly Minutes' }), href: '/resources/assembly-minutes' },
        { title: t('church_resources_title', { defaultValue: 'Church Resources' }), href: '/resources/church-resources' },
        { title: t('church_locator_title', { defaultValue: 'Church Locator' }), href: '/find-a-church' },
        // { title: t('church_logos_title', { defaultValue: 'Church Logos' }), href: '/resources/church-logos' },
        { title: t('treasurers_report_title', { defaultValue: "Treasurer's Report" }), href: '/resources/treasurers-report' },
        { title: t('directory_title', { defaultValue: 'Directory' }), href: '/resources/directory' },
      ]
    },
    {
      title: t('give', { defaultValue: 'Give' }),
      href: '/give'
    }
  ]

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index)
  }

  return (
    <>
      <style>
        {`
          .search-btn:hover .search-shortcut {
            opacity: 1 !important;
          }
        `}
      </style>
      <nav ref={navRef} className="navbar navbar-expand-lg fixed-top bg-transparent shadow-none">
        <div className="container py-1 bg-white shadow-sm rounded-5">
          <Link href="/" className="navbar-brand">
            <Image
              src="/images/logo-cogop.webp"
              alt="Church of God of Prophecy"
              width={(133)}
              height={(32)}
              priority
              className="d-flex"
              style={{
                width: (133),
                height: 'auto'
              }}
            />
          </Link>

          <button 
            ref={togglerRef}
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarContent"
            aria-controls="navbarContent" 
            aria-expanded={isOpen ? 'true' : 'false'}
            aria-label={t('toggle_navigation', { defaultValue: 'Toggle navigation' })}
            onClick={handleToggle}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {mainMenu.map((item, index) => (
                <li key={index} className="nav-item dropdown">
                  {item.href ? (
                    <Link 
                      href={item.href} 
                      className="nav-link"
                      onClick={handleMenuItemClick}
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <>
                      <a 
                        className="nav-link dropdown-toggle" 
                        href="#" 
                        role="button" 
                        data-bs-toggle="dropdown" 
                        aria-expanded="false"
                      >
                        {item.title}
                      </a>
                      {item.items && (
                        <ul className="dropdown-menu">
                          {item.items.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link 
                                href={subItem.href}
                                className="dropdown-item"
                                onClick={handleMenuItemClick}
                              >
                                {subItem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>

            <div className="d-flex align-items-center gap-3">
              <select
                className="form-select form-select-sm me-2"
                value={language}
                onChange={handleLanguageChange}
                aria-label={t('select_language', { defaultValue: 'Select language' })}
                style={{ width: 100 }}
              >
                <option value="en">{t('english', { defaultValue: 'English' })}</option>
                <option value="bg">{t('bulgarian', { defaultValue: 'Български' })}</option>
              </select>
              
              {/* Search Button */}
              <button 
                className="btn btn-link position-relative search-btn" 
                aria-label={t('search', { defaultValue: 'Search' })}
                onClick={handleSearchClick}
                title={t('search_shortcut', { defaultValue: `Search (${isMac ? '⌘' : 'Ctrl'}+K)` })}
                style={{ 
                  '--bs-btn-hover-bg': 'rgba(0,0,0,0.05)',
                  '--bs-btn-hover-border-color': 'transparent'
                } as React.CSSProperties}
              >
                <i className="bi bi-search fs-5"></i>
                <span 
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-light text-dark small search-shortcut"
                  style={{ 
                    fontSize: '0.6rem',
                    opacity: 0,
                    transition: 'opacity 0.2s ease-in-out',
                    pointerEvents: 'none'
                  }}
                >
                  {isMac ? '⌘K' : 'Ctrl+K'}
                </span>
              </button>
              
              {/* Authentication Section */}
              {!loading && (
                <>
                  {user ? (
                    <UserMenu />
                  ) : (
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleAuthModal('login')}
                      >
                        {t('sign_in', { defaultValue: 'Sign In' })}
                      </button>
                      <button 
                        className="btn btn-dark btn-sm"
                        onClick={() => handleAuthModal('signup')}
                      >
                        {t('sign_up', { defaultValue: 'Sign Up' })}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      <SearchModal 
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  )
}

export default Navigation 