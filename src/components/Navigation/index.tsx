'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const togglerRef = useRef<HTMLButtonElement>(null)

  // Add Bootstrap JS on client side
  useEffect(() => {
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

  const mainMenu = [
    {
      title: 'Get Connected',
      items: [
        { title: 'Calendar', href: '/get-connected/calendar' },
        { title: 'Contact', href: '/get-connected/contact' },
        { title: 'FAQ', href: '/get-connected/faq' },
        { title: 'Employment', href: '/get-connected/employment' },
        { title: 'Schedule a Tour', href: '/get-connected/schedule-tour' },
      ]
    },
    {
      title: 'About',
      items: [
        { title: 'Who We Are', href: '/about/who-we-are' },
        { title: 'What We Believe', href: '/about/what-we-believe' },
        { title: 'Our Leadership', href: '/about/leadership' },
        { title: 'Our History', href: '/about/history' },
        { title: 'Membership', href: '/about/membership' },
      ]
    },
    {
      title: 'Ministries',
      items: [
        { title: 'Administration & Finance', href: '/ministries/admin-finance' },
        { title: 'Global Missions', href: '/ministries/global-missions' },
        { title: 'Harvest Partners', href: '/ministries/harvest-partners' },
        { title: 'Helping Hands', href: '/ministries/helping-hands' },
        { title: 'One Child Fund', href: '/ministries/one-child-fund' },
        { title: 'Heritage', href: '/ministries/heritage' },
        { title: 'Fields of the Wood', href: '/ministries/fields-of-the-wood' },
        { title: 'Stewardship', href: '/ministries/stewardship' },
        { title: 'Bookstore', href: '/ministries/bookstore' },
        { title: 'Global Communications', href: '/ministries/global-communications' },
        { title: 'White Wing Messenger', href: '/ministries/white-wing-messenger' },
        { title: 'Prayer', href: '/ministries/prayer' },
        { title: 'International Assembly', href: '/ministries/international-assembly' },
        { title: 'Leadership Development', href: '/ministries/leadership-development' },
        { title: 'Accredited Ministries', href: '/ministries/accredited-ministries' },
        { title: 'Center for Biblical Leadership', href: '/ministries/center-biblical-leadership' },
        { title: 'Spirit & Life Seminary', href: '/ministries/spirit-life-seminary' },
        { title: "Children's", href: '/ministries/childrens' },
        { title: 'Youth', href: '/ministries/youth' },
      ]
    },
    {
      title: 'Where We Serve',
      items: [
        { title: 'Presiding Bishop', href: '/where-we-serve/presiding-bishop' },
        { title: 'Africa', href: '/where-we-serve/africa' },
        { title: 'Asia, Australia & Oceania', href: '/where-we-serve/asia-australia-oceania' },
        { title: 'Caribbean & Atlantic', href: '/where-we-serve/caribbean-atlantic' },
        { title: 'Central America', href: '/where-we-serve/central-america' },
        { title: 'North America', href: '/where-we-serve/north-america' },
        { title: 'South America', href: '/where-we-serve/south-america' },
        { title: 'Europe & Middle East', href: '/where-we-serve/europe-middle-east' },
      ]
    },
    {
      title: 'Resources',
      items: [
        { title: 'Get Started', href: '/resources/get-started' },
        { title: 'How to Know God', href: '/resources/how-to-know-god' },
        { title: 'Membership', href: '/resources/membership' },
        { title: 'Media', href: '/resources/media' },
        { title: 'Podcasts', href: '/resources/podcasts' },
        { title: 'YouTube', href: '/resources/youtube' },
        { title: 'Library', href: '/resources/library' },
        { title: 'Assembly Documents', href: '/resources/assembly-documents' },
        { title: 'Policies & Guidelines', href: '/resources/policies-guidelines' },
        { title: 'Public Statements', href: '/resources/public-statements' },
        { title: 'Assembly Minutes', href: '/resources/assembly-minutes' },
        { title: 'Church Resources', href: '/resources/church-resources' },
        { title: 'Church Locator', href: '/resources/church-locator' },
        { title: 'Church Logos', href: '/resources/church-logos' },
        { title: "Treasurer's Report", href: '/resources/treasurers-report' },
        { title: 'Directory', href: '/resources/directory' },
      ]
    },
    {
      title: 'Give',
      href: '/give'
    }
  ]

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index)
  }

  return (
    <nav ref={navRef} className="navbar navbar-expand-lg fixed-top bg-white shadow-sm">
      <div className="container">
        <Link href="/" className="navbar-brand">
          <Image
            src="/images/logo-cogop.webp"
            alt="Church of God of Prophecy"
            width={133}
            height={48}
            priority
            className="d-inline-block align-top"
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
          aria-label="Toggle navigation"
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
            <select className="form-select form-select-sm" aria-label="Select language">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="pt">Português</option>
              <option value="ru">Русский</option>
            </select>
            <button className="btn btn-link" aria-label="Search">
              <i className="bi bi-search fs-5"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation 