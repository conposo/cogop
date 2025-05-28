'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { t } from '@/lib/i18n'

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const links = [
    { href: '/about/who-we-are', label: t('who_we_are') },
    { href: '/about/what-we-believe', label: t('what_we_believe') },
    { href: '/about/leadership', label: t('our_leadership') },
    { href: '/about/history', label: t('our_history') },
    { href: '/about/membership', label: t('membership') },
  ]

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar Navigation */}
        <nav className="col-lg-3 col-md-4 sidebar ">
          <div className="p-3 position-sticky top-0 border- bg-light rounded-5">
            <h4 className="mb-3 small text-uppercase fw-bold opacity-50">{t('about')}</h4>
            <ul className="nav nav-pills flex-column">
              {links.map((link) => (
                <li key={link.href} className="nav-item mb-1">
                  <Link 
                    href={link.href}
                    className={`nav-link ${pathname === link.href ? 'active' : 'text-dark'}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="col-lg-9 col-md-8 ms-sm-auto px-md-4">
          <div className="pb-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 