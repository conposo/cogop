'use client'

import React from 'react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useI18n } from '@/contexts/I18nContext'
import { fetchEventsFromFirestore, Event, formatEventDateTime, MultilingualString } from '@/lib/dummyContent'
import { t } from '@/lib/i18n'

// Helper function to get localized string or fallback
const getLocalizedString = (field: MultilingualString | string | undefined, lang: string, fallbackLang: string = 'en'): string => {
  if (!field) return '';
  if (typeof field === 'string') return field; // Handle legacy string format
  if (typeof field === 'object' && field !== null) {
    // Handle multilingual object format
    return field[lang] || field[fallbackLang] || Object.values(field)[0] || '';
  }
  return '';
};

export default function Events() {
  const { language } = useI18n()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      const fetchedEvents = await fetchEventsFromFirestore(language, false) // false means don't show past events
      setEvents(fetchedEvents)
      setLoading(false)
    }
    loadEvents()
  }, [language])

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">{t('loading_events')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="display-4 mb-4">{t('upcoming_events')}</h1>
          <p className="lead mb-5">{t('events_description')}</p>
        </div>
      </div>

      {events.length > 0 ? (
        <div className="row">
          {events.map((event) => (
            <div key={event.id} className="col-lg-4 mb-4">
              <div className="card h-100 shadow">
                {event.imageUrl !== '' ? (
                  <div className="card-img-top-wrapper" style={{ height: '200px', overflow: 'hidden' }}>
                    <img 
                      src={event.imageUrl} 
                      alt={getLocalizedString(event.title, language)}
                      className="card-img-top w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div className="card-img-top-wrapper" style={{ height: '200px', overflow: 'hidden' }}>
                    <img 
                      src="/images/default-article-image.jpg" 
                      alt={t('default_article_image')}
                      className="card-img-top w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-info text-dark">{event.category}</span>
                    {event.featured && (
                      <span className="badge bg-warning text-dark">{t('featured')}</span>
                    )}
                  </div>
                  <h2 className="card-title h5 mb-3">{getLocalizedString(event.title, language)}</h2>
                  <p className="card-text text-muted mb-3">{getLocalizedString(event.excerpt, language)}</p>
                  <div className="mb-3">
                    <p className="text-muted small mb-1">
                      <i className="bi bi-calendar-event me-2"></i>
                      {formatEventDateTime(event)}
                    </p>
                    <p className="text-muted small mb-0">
                      <i className="bi bi-geo-alt me-2"></i>
                      {event.eventLocation}
                    </p>
                    {event.eventAddress && (
                      <p className="text-muted small mb-0 ms-4">{event.eventAddress}</p>
                    )}
                  </div>
                  <Link href={`/events/${event.id}`} className="btn btn-dark">
                    {t('learn_more')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-calendar-x fs-1 text-muted mb-3"></i>
          <h4 className="text-muted">{t('no_upcoming_events')}</h4>
          <p className="text-muted">{t('check_back_soon')}</p>
        </div>
      )}

      <div className="row mt-5">
        <div className="col-12 text-center">
          <h2 className="mb-4">{t('dont_miss_opportunities')}</h2>
          <Link href="/get-connected/calendar" className="btn btn-dark me-3">{t('view_full_calendar')}</Link>
          <Link href="/get-connected/contact" className="btn btn-outline-primary">{t('contact_us')}</Link>
        </div>
      </div>
    </div>
  )
} 