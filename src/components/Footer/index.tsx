'use client'

import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
  const socialLinks = [
    { icon: 'facebook', label: 'Facebook', href: 'https://facebook.com/cogop' },
    { icon: 'instagram', label: 'Instagram', href: 'https://instagram.com/cogop' },
    { icon: 'twitter', label: 'Twitter', href: 'https://twitter.com/cogop' },
    { icon: 'youtube', label: 'YouTube', href: 'https://youtube.com/cogop' },
    { icon: 'spotify', label: 'Spotify', href: 'https://spotify.com/cogop' },
  ]

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <Image
              src="/images/Cogop-white.svg"
              alt="Church of God of Prophecy"
              width={200}
              height={60}
              className="footer__logo"
            />
            <ul className="footer__social">
              {socialLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    <i className={`bi bi-${link.icon}`}></i>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-2">
            <h5>About</h5>
            <ul className="footer__links">
              <li><Link href="/about/who-we-are">Who We Are</Link></li>
              <li><Link href="/about/what-we-believe">What We Believe</Link></li>
              <li><Link href="/about/leadership">Leadership</Link></li>
              <li><Link href="/about/history">History</Link></li>
            </ul>
          </div>
          <div className="col-lg-2">
            <h5>Ministries</h5>
            <ul className="footer__links">
              <li><Link href="/ministries/global-missions">Global Missions</Link></li>
              <li><Link href="/ministries/prayer">Prayer</Link></li>
              <li><Link href="/ministries/childrens">Children's</Link></li>
              <li><Link href="/ministries/youth">Youth</Link></li>
            </ul>
          </div>
          <div className="col-lg-2">
            <h5>Resources</h5>
            <ul className="footer__links">
              <li><Link href="/resources/media">Media</Link></li>
              <li><Link href="/resources/library">Library</Link></li>
              <li><Link href="/resources/church-locator">Find a Church</Link></li>
              <li><Link href="/give">Give</Link></li>
            </ul>
          </div>
          <div className="col-lg-2">
            <h5>Connect</h5>
            <ul className="footer__links">
              <li><Link href="/get-connected/contact">Contact Us</Link></li>
              <li><Link href="/get-connected/calendar">Calendar</Link></li>
              <li><Link href="/get-connected/employment">Employment</Link></li>
              <li><Link href="/get-connected/faq">FAQ</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} Church of God of Prophecy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 