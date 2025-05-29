'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Brute force scroll to top - multiple attempts with different timings
    const scrollToTop = () => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    // Immediate scroll
    scrollToTop()

    // Multiple delayed attempts
    const timeouts = [0, 50, 100, 200, 500, 1000].map(delay => 
      setTimeout(scrollToTop, delay)
    )

    // Listen to multiple events to ensure it happens
    const events = ['load', 'DOMContentLoaded', 'readystatechange']
    events.forEach(event => {
      window.addEventListener(event, scrollToTop)
    })

    // Cleanup
    return () => {
      timeouts.forEach(clearTimeout)
      events.forEach(event => {
        window.removeEventListener(event, scrollToTop)
      })
    }
  }, [pathname])

  return null
} 