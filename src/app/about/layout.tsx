'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const links = [
    { href: '/about/who-we-are', label: 'Who We Are' },
    { href: '/about/what-we-believe', label: 'What We Believe' },
    { href: '/about/leadership', label: 'Our Leadership' },
    { href: '/about/history', label: 'Our History' },
    { href: '/about/membership', label: 'Membership' },
  ]

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar Navigation */}
        <nav className="col-lg-3 col-md-4 sidebar bg-light border-end">
          <div className="p-3">
            <h4 className="text-primary mb-3">About</h4>
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
          <div className="py-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 