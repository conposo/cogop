'use client'

import Link from 'next/link'
import Image from 'next/image'
import { t } from '@/lib/i18n'

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
            <h5>{t('about', { defaultValue: 'About' })}</h5>
            <ul className="footer__links">
              <li><Link href="/about/who-we-are">{t('who_we_are', { defaultValue: 'Who We Are' })}</Link></li>
              <li><Link href="/about/what-we-believe">{t('what_we_believe', { defaultValue: 'What We Believe' })}</Link></li>
              <li><Link href="/about/our-leadership">{t('our_leadership', { defaultValue: 'Our Leadership' })}</Link></li>
              <li><Link href="/about/our-history">{t('our_history', { defaultValue: 'Our History' })}</Link></li>
            </ul>
          </div>
          <div className="col-lg-2">
            <h5>{t('get_connected', { defaultValue: 'Get Connected' })}</h5>
            <ul className="footer__links">
              <li><Link href="/get-connected/calendar">{t('calendar', { defaultValue: 'Calendar' })}</Link></li>
              <li><Link href="/get-connected/contact">{t('contact', { defaultValue: 'Contact' })}</Link></li>
              <li><Link href="/get-connected/faq">{t('faq', { defaultValue: 'FAQ' })}</Link></li>
              <li><Link href="/get-connected/employment">{t('employment', { defaultValue: 'Employment' })}</Link></li>
            </ul>
          </div>
          <div className="col-lg-2">
            <h5>{t('ministries', { defaultValue: 'Ministries' })}</h5>
            <ul className="footer__links">
              <li><Link href="/ministries/global-missions">{t('global_missions', { defaultValue: 'Global Missions' })}</Link></li>
              <li><Link href="/ministries/youth">{t('youth_ministry', { defaultValue: 'Youth Ministry' })}</Link></li>
              <li><Link href="/ministries/children">{t('childrens_title', { defaultValue: "Children's Ministry" })}</Link></li>
              <li><Link href="/where-we-serve">{t('where_we_serve', { defaultValue: 'Where We Serve' })}</Link></li>
            </ul>
          </div>
          <div className="col-lg-2">
            <h5>{t('resources', { defaultValue: 'Resources' })}</h5>
            <ul className="footer__links">
              <li><Link href="/resources/library">{t('library_title', { defaultValue: 'Library' })}</Link></li>
              <li><Link href="/resources/media">{t('media_title', { defaultValue: 'Media' })}</Link></li>
              <li><Link href="/resources/podcasts">{t('podcasts_title', { defaultValue: 'Podcasts' })}</Link></li>
              <li><Link href="/give">{t('give', { defaultValue: 'Give' })}</Link></li>
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="footer__bottom">
              <p>&copy; 2024 Church of God of Prophecy. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 