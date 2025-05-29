'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from '@/lib/i18n'

const Footer = () => {
  const { t } = useTranslation()
  
  const socialLinks = [
    { icon: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/Bojiq.carkva.na.prorochestvoto/' },
    { icon: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/cogoppics/' },
    { icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/channel/UCfIWG2CplNym_oZ3oLLeQYw' },
    { icon: 'spotify', label: 'Spotify', href: 'https://open.spotify.com/user/g1d13yyaprw0wrr2woer8edyp?si=a32b364b555f4d4d&nd=1&dlsi=616f621ad7b54638' },
  ]

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 d-flex flex-column justify-content-between mb-5 mb-sm-0">
            <Image
              src="/images/Cogop-white.svg"
              alt="Church of God of Prophecy"
              width={169}
              height={40}
              className="footer__logo"
              style={{
                width: '169px',
                height: '40px'
              }}
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
          <div className="col-lg-2 mb-4">
            <h5 className="small text-uppercase opacity-50">{t('about', { defaultValue: 'About' })}</h5>
            <ul className="footer__links">
              <li><Link href="/about/who-we-are">{t('who_we_are', { defaultValue: 'Who We Are' })}</Link></li>
              <li><Link href="/about/what-we-believe">{t('what_we_believe', { defaultValue: 'What We Believe' })}</Link></li>
              <li><Link href="/about/leadership">{t('our_leadership', { defaultValue: 'Our Leadership' })}</Link></li>
              <li><Link href="/about/our-history">{t('our_history', { defaultValue: 'Our History' })}</Link></li>
            </ul>
          </div>
          <div className="col-lg-2 mb-4">
            <h5 className="small text-uppercase opacity-50">{t('get_connected', { defaultValue: 'Get Connected' })}</h5>
            <ul className="footer__links">
              <li><Link href="/get-connected/calendar">{t('calendar', { defaultValue: 'Calendar' })}</Link></li>
              <li><Link href="/get-connected/contact">{t('contact', { defaultValue: 'Contact' })}</Link></li>
              <li><Link href="/get-connected/faq">{t('faq', { defaultValue: 'FAQ' })}</Link></li>
              <li><Link href="/get-connected/employment">{t('employment', { defaultValue: 'Employment' })}</Link></li>
            </ul>
          </div>
          <div className="col-lg-2 mb-4">
            <h5 className="small text-uppercase opacity-50">{t('ministries', { defaultValue: 'Ministries' })}</h5>
            <ul className="footer__links">
              <li><Link href="/ministries/global-missions">{t('global_missions', { defaultValue: 'Global Missions' })}</Link></li>
              <li><Link href="/ministries/youth">{t('youth_ministry', { defaultValue: 'Youth Ministry' })}</Link></li>
              <li><Link href="/ministries/children">{t('childrens_title', { defaultValue: "Children's Ministry" })}</Link></li>
              <li><Link href="/where-we-serve">{t('where_we_serve', { defaultValue: 'Where We Serve' })}</Link></li>
            </ul>
          </div>
          <div className="col-lg-2">
            <h5 className="small text-uppercase opacity-50">{t('resources', { defaultValue: 'Resources' })}</h5>
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
              <p>&copy; {new Date().getFullYear()} Church of God of Prophecy. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 