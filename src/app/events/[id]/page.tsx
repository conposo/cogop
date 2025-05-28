'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import { fetchEventById, Event, formatEventDateTime, MultilingualString } from '@/lib/dummyContent';
import { useI18n } from '@/contexts/I18nContext';
import { t } from '@/lib/i18n';

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

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useI18n();
  const id = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const loadEvent = async () => {
        setLoading(true);
        const fetchedEvent = await fetchEventById(id);
        if (fetchedEvent) {
          setEvent(fetchedEvent);
        } else {
          console.log(`Event with ID '${id}' not found.`);
        }
        setLoading(false);
      };
      loadEvent();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">{t('loading_event')}</span>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-5 text-center">
        <h1 className="display-4">{t('event_not_found')}</h1>
        <p className="lead">{t('event_not_found_message')}</p>
        <Link href="/events" className="btn btn-dark mt-3">
          {t('back_to_events')}
        </Link>
      </div>
    );
  }

  const eventTitle = getLocalizedString(event.title, language);
  const eventContent = getLocalizedString(event.content, language);

  // Helper function to format date and time for the AddToCalendarButton
  const getFormattedDateTime = (dateString: string, timeString?: string) => {
    // Combine date and time for Date object, default to midnight if timeString is not provided
    const dateTimeString = timeString ? `${dateString}T${timeString}` : dateString;
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    // Only return time if timeString was provided, otherwise default to empty string or a specific default like '00:00'
    const hours = timeString ? date.getHours().toString().padStart(2, '0') : '00';
    const minutes = timeString ? date.getMinutes().toString().padStart(2, '0') : '00';
    return {
      date: `${year}-${month}-${day}`,
      time: timeString ? `${hours}:${minutes}` : '', // Return empty if no timeString, or handle as needed
    };
  };

  const { date: startDate, time: startTime } = getFormattedDateTime(event.eventDate, event.eventTime);
  const { date: endDate, time: endTime } = event.eventEndDate
    ? getFormattedDateTime(event.eventEndDate, event.eventEndTime)
    : { date: startDate, time: startTime }; // Fallback to start date/time if end date/time is not defined

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <article>
            <header className="mb-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <span className="badge bg-info text-dark me-2">{event.category}</span>
                  {event.featured && (
                    <span className="badge bg-warning text-dark">{t('featured_event')}</span>
                  )}
                </div>
              </div>
              
              <h1 className="fw-bolder mb-3">{eventTitle}</h1>
              
              <div className="event-details bg-light p-4 rounded mb-4">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h6 className="text-primary mb-2">
                      <i className="bi bi-calendar-event me-2"></i>{t('date_time')}
                    </h6>
                    <p className="mb-0">{formatEventDateTime(event)}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-primary mb-2">
                      <i className="bi bi-geo-alt me-2"></i>{t('location')}
                    </h6>
                    <p className="mb-0">{event.eventLocation}</p>
                    {event.eventAddress && (
                      <p className="text-muted small mb-0">{event.eventAddress}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-muted fst-italic mb-2">
                {t('posted_by')} {event.authorName}
              </div>
            </header>

            {event.imageUrl ? (
              <figure className="mb-4">
                <Image
                  src={event.imageUrl}
                  alt={eventTitle}
                  width={900}
                  height={400}
                  className="img-fluid rounded"
                  style={{ objectFit: 'cover' }}
                />
              </figure>
            ) : (
              <figure className="mb-4">
                <img 
                  src="/images/default-article-image.jpg" 
                  alt={t('default_article_image')}
                  className="img-fluid rounded"
                  style={{ objectFit: 'cover' }}
                />
              </figure>
            )}

            <section className="mb-5">
              <div className="mb-4">
                <h5 className="small text-primary text-uppercase fw-bold">{t('about_this_event')}</h5>
                <div dangerouslySetInnerHTML={{ __html: eventContent }} />
              </div>
              
              {event.eventAddress && (
                <section className="mb-5">
                  <h5>{t('location_details')}:</h5>
                  <p><i className="bi bi-geo-alt-fill me-2"></i>{event.eventLocation}</p>
                  <p className="ms-4">{event.eventAddress}</p>
                </section>
              )}
            </section>

            {/* Event Actions */}
            <section className="event-actions bg-primary text-white p-4 rounded mb-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h5 className="mb-2">{t('ready_to_join_us')}</h5>
                  <p className="mb-0">{t('join_opportunity_message')}</p>
                </div>
                <div className="col-md-4 d-flex justify-content-end">
                  {/* <Link href="/get-connected/contact" className="btn btn-light me-2">
                    {t('get_more_info')}
                  </Link> */}
                  <AddToCalendarButton
                    name={eventTitle}
                    startDate={startDate}
                    endDate={endDate}
                    startTime={startTime}
                    endTime={endTime}
                    timeZone="currentBrowser" // Or a specific timezone like "America/Los_Angeles"
                    location={event.eventLocation || ''}
                    description={eventContent.replace(/<[^>]*>?/gm, '')} // Basic HTML stripping
                    options={['Apple', 'Google', 'Outlook.com', 'Yahoo', 'iCal']}
                    buttonStyle="default"
                    trigger="click"
                    listStyle="modal"
                    styleLight="--btn-background: #0d6efd; --btn-text: #ffffff; --btn-border: #0d6efd; --btn-border-radius: 0.375rem;"
                    styleDark="--btn-background: #0d6efd; --btn-text: #ffffff; --btn-border: #0d6efd; --btn-border-radius: 0.375rem;"
                  />
                </div>
              </div>
            </section>
          </article>

          <div className="mt-5">
            <Link href="/events" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left me-2"></i>
              {t('back_to_all_events')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 