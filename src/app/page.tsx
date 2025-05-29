'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useContent } from '@/contexts/ContentContext'
import { useI18n } from '@/contexts/I18nContext'
import { dummyArticles as fetchDummyArticles, dummyEvents, dummyPodcasts, dummyStatistics, Article, fetchEventsFromFirestore, Event, formatEventDateTime, fetchArticlesFromFirestore, MultilingualString } from '@/lib/dummyContent'
import { generateOrganizationStructuredData } from '@/lib/metadata'
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

export default function Home() {
  const { stats, mainCTAs, articles: contextArticles, podcasts, events: contextEvents, carousel } = useContent()
  const { language } = useI18n()
  const [articles, setArticles] = useState<Article[]>([])
  const [events, setEvents] = useState<Event[]>([])

  // Generate structured data for the homepage
  const structuredData = generateOrganizationStructuredData()

  useEffect(() => {
    const loadArticles = async () => {
      const fetchedArticles = await fetchArticlesFromFirestore(language);
      // Let's sort and filter articles here once, if these are the primary ways they are used.
      // This avoids doing it multiple times in the JSX or for chunking.
      const processedArticles = fetchedArticles
        .filter(article => article.featured) // Assuming you still want featured articles
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setArticles(processedArticles);
    }
    loadArticles()
  }, [language])

  useEffect(() => {
    const loadEvents = async () => {
      const fetchedEvents = await fetchEventsFromFirestore(language);
      // Show only the first 3 upcoming events
      setEvents(fetchedEvents.slice(0, 3));
    }
    loadEvents()
  }, [language])

  // Create chunks of articles for multi-item carousel
  const chunkArticles = (articlesToChunk: Article[], chunkSize: number) => {
    const chunks = []
    for (let i = 0; i < articlesToChunk.length; i += chunkSize) {
      chunks.push(articlesToChunk.slice(i, i + chunkSize))
    }
    return chunks
  }

  // Prepare only the first 3 articles for the desktop carousel if that's the design.
  // Or, if the carousel should show all featured articles in chunks, adjust this.
  const articleChunks = chunkArticles(articles.slice(0, 9), 3); // Using first 3 featured & sorted articles for desktop carousel
  // For the mobile carousel, we might want all featured articles, or just the first few as well.
  // The provided JSX for mobile iterates `articles.map(...)` which implies all of them.
  // If you only want the first N, you can use articles.slice(0, N).map(...)

  return (
    <>
      {/* Add structured data for the homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="container-fluid">
        {/* Hero Carousel Section */}
        {carousel && carousel.length > 0 && (
          <section className="hero-carousel mx-n3">
            <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
              {/* Carousel Indicators */}
              <div className="carousel-indicators">
                {carousel.map((slide, index) => (
                  <button 
                    key={slide.id}
                    type="button" 
                    data-bs-target="#heroCarousel" 
                    data-bs-slide-to={index}
                    className={index === 0 ? 'active' : ''}
                    aria-current={index === 0 ? 'true' : 'false'}
                    aria-label={`Slide ${index + 1}`}
                  ></button>
                ))}
              </div>

              {/* Carousel Inner */}
              <div className="carousel-inner">
                {carousel.map((slide, index) => (
                  <div key={slide.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                    <div 
                      className="carousel-slide d-flex align-items-center justify-content-center  py-5"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        minHeight: '70vh'
                      }}
                    >
                      <div className="container  py-5">
                        <div className="row justify-content-center">
                          <div className="col-lg-8 text-center text-white">
                            <h1 className="display-4 fw-bold mb-4">{slide.title}</h1>
                            <p className="lead mb-4">{slide.description}</p>
                            {slide.buttonText && slide.buttonLink && (
                              <Link href={slide.buttonLink} className="btn btn-light btn-lg px-4 py-2">
                                {slide.buttonText}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Controls */}
              <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </section>
        )}

        {/* Mission Statement */}
        <section className="mission-section py-5">
          <div className="container">
            <h2 className="text-center mb-0 py-sm-3">{t('mission_statement')}</h2>
          </div>
        </section>

        {/* mainCTAs */}
        {mainCTAs && mainCTAs.length > 0 && (
          <section className="stats-section mx-n3 py-5 bg-light">
            <div className="container">
              <div className="row py-sm-3 text-center">
                {mainCTAs.map((cta, index) => (
                  <div key={index} className="col-md-3 mb-4 mb-sm-0">
                    <Link href={cta.link} className="btn py-sm-3 d-flex flex-column align-items-center justify-content-center h-100 shadow-sm bg-white rounded-5">
                      <i className={`bi bi-${cta.icon}`}  style={{ fontSize: '2rem' }}></i>
                      <div className="mt-2" style={{ maxWidth: '100px' }}><span className="fw-bold text-uppercase text-center">{cta.label}</span></div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Statistics */}
        {/* <section className="stats-section py-5 bg-light">
          <div className="container">
            <div className="row text-center">
              {stats.map((stat, index) => (
                <div key={index} className="col-md-3 mb-4">
                  <h3 className="display-5 fw-bold text-primary">{stat.value}</h3>
                  <p className="text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Articles Section (New Structure) */}
        <section className="articles-section py-5">
          <div className="container">
            <h2 className="text-center mb-5">{t('articles_and_news')}</h2>
            
            {/* Mobile Carousel - 1 article per slide */}
            <div id="mobileArticlesCarousel" className="carousel slide d-lg-none" data-bs-ride="carousel">
              <div className="carousel-indicators">
                {articles.slice(0,3).map((_, index) => ( // Displaying first 3 articles in mobile carousel as well for consistency
                  <button 
                    key={index}
                    type="button" 
                    data-bs-target="#mobileArticlesCarousel" 
                    data-bs-slide-to={index}
                    className={index === 0 ? 'active' : ''}
                    aria-current={index === 0 ? 'true' : 'false'}
                    aria-label={`Article ${index + 1}`}
                  ></button>
                ))}
              </div>
              <div className="carousel-inner">
                {articles.slice(0,3).map((article, index) => ( // Displaying first 3 articles
                  <div key={article.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                    <div className="row justify-content-center">
                      <div className="col-12">
                        <div className="card h-100 shadow">
                          {article.imageUrl !== '' ? (
                            <div className="card-img-top-wrapper" style={{ height: '200px', overflow: 'hidden' }}>
                              <img 
                                src={article.imageUrl} 
                                alt={getLocalizedString(article.title, language)}
                                className="card-img-top w-100 h-100"
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                          ) : (
                            <div className="card-img-top-wrapper" style={{ height: '200px', overflow: 'hidden' }}>
                              <img 
                                src="/images/default-article-image.jpg" 
                                alt={getLocalizedString(article.title, language)}
                                className="card-img-top w-100 h-100"
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                          )}
                          <div className="card-body p-4">
                            <span className="badge bg-primary mb-3">{article.category}</span>
                            <h3 className="card-title h5 mb-3">{getLocalizedString(article.title, language)}</h3>
                            {getLocalizedString(article.summary, language) && (
                              <p className="card-text text-muted mb-3">{getLocalizedString(article.summary, language)}</p>
                            )}
                            {article.date && (
                              <p className="text-muted small mb-3">
                                <i className="bi bi-calendar me-2"></i>{new Date(article.date).toLocaleDateString()}
                              </p>
                            )}
                            <Link href={`/news/${article.slug}`} className="btn btn-dark">{t('read_more')}</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#mobileArticlesCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#mobileArticlesCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>

            {/* Desktop View - Static Grid Layout */}
            <div className="d-none d-lg-block">
              <div className="row">
                {articles.slice(0, 3).map((article) => (
                  <div key={article.id} className="col-lg-4 mb-4">
                    <div className="card h-100 shadow">
                      {article.imageUrl !== '' ? (
                        <div className="card-img-top-wrapper" style={{ height: '200px', overflow: 'hidden' }}>
                          <img 
                            src={article.imageUrl} 
                            alt={getLocalizedString(article.title, language)}
                            className="card-img-top w-100 h-100"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      ) : (
                        <div className="card-img-top-wrapper" style={{ height: '200px', overflow: 'hidden' }}>
                          <img 
                            src="/images/default-article-image.jpg" 
                            alt={getLocalizedString(article.title, language)}
                            className="card-img-top w-100 h-100"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      )}
                      <div className="card-body p-4">
                        <span className="badge bg-primary mb-3">{article.category}</span>
                        <h3 className="card-title h5 mb-3">{getLocalizedString(article.title, language)}</h3>
                        {getLocalizedString(article.summary, language) && (
                          <p className="card-text text-muted mb-3">{getLocalizedString(article.summary, language)}</p>
                        )}
                        {article.date && (
                          <p className="text-muted small mb-3">
                            <i className="bi bi-calendar me-2"></i>{new Date(article.date).toLocaleDateString()}
                          </p>
                        )}
                        <Link href={`/news/${article.slug}`} className="btn btn-dark">{t('read_more')}</Link>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Add placeholder cards if fewer than 3 articles */}
                {articles.length < 3 && Array.from({ length: 3 - articles.length }).map((_, index) => (
                  <div key={`article-placeholder-${index}`} className="col-lg-4 mb-4">
                    <div className="card h-100 shadow border-2 border-dashed">
                      <div className="card-body d-flex flex-column justify-content-center align-items-center text-center py-5">
                        <i className="bi bi-newspaper fs-1 text-muted mb-3"></i>
                        <h5 className="text-muted mb-2">{t('more_articles_coming_soon')}</h5>
                        <p className="text-muted small mb-3">{t('stay_tuned_for_inspiring_articles_and_church_updates')}</p>
                        <Link href="/news" className="btn btn-outline-secondary btn-sm">
                          {t('view_all')}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-4">
              <Link href="/news" className="btn btn-outline-primary">{t('view_all')}</Link>
            </div>
          </div>
        </section>

        {/* Podcasts */}
        <section className="podcasts-section mx-n3 py-5 bg-light">
          <div className="container">
            <h2 className="text-center mb-5">{t('our_podcasts')}</h2>
            <div className="row">
              {podcasts.map((podcast, index) => (
                <div key={index} className="col-lg-6 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="mb-3">
                        <h4 className="h6 text-primary">{podcast.series}</h4>
                        <p className="text-muted small">{podcast.host}</p>
                      </div>
                      <h3 className="card-title h5">{podcast.title}</h3>
                      <p className="card-text">{podcast.description}</p>
                      <button className="btn btn-dark">{t('listen_now')}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link href="/podcasts" className="btn btn-outline-primary">{t('view_all')}</Link>
            </div>
          </div>
        </section>

        {/* Events */}
        <section className="events-section py-5">
          <div className="container">
            <h2 className="text-center mb-5">{t('upcoming_events')}</h2>
            {events.length > 0 ? (
              <div className="row">
                {events.map((event) => (
                  <div key={event.id} className="col-lg-4 mb-4">
                    <div className="card h-100 shadow">
                      {event.imageUrl && (
                        <div className="card-img-top-wrapper" style={{ height: '200px', overflow: 'hidden' }}>
                          <img 
                            src={event.imageUrl} 
                            alt={getLocalizedString(event.title, language)}
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
                        <h3 className="card-title h5 mb-3">{getLocalizedString(event.title, language)}</h3>
                        <p className="card-text text-muted mb-3">{getLocalizedString(event.excerpt, language)}</p>
                        <div className="mb-3">
                          <p className="text-muted small mb-1">
                            <i className="bi bi-calendar me-2"></i>
                            {formatEventDateTime(event)}
                          </p>
                          <p className="text-muted small mb-0">
                            <i className="bi bi-geo-alt me-2"></i>
                            {event.eventLocation}
                          </p>
                        </div>
                        <Link href={`/events/${event.id}`} className="btn btn-outline-primary btn-sm">{t('event_details')}</Link>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Add placeholder cards if fewer than 3 events */}
                {events.length < 3 && Array.from({ length: 3 - events.length }).map((_, index) => (
                  <div key={`placeholder-${index}`} className="d-none d-sm-block col-lg-4 mb-4">
                    <div className="card h-100 shadow border-2 border-dashed">
                      <div className="card-body d-flex flex-column justify-content-center align-items-center text-center py-5">
                        <i className="bi bi-calendar-plus fs-1 text-muted mb-3"></i>
                        <h5 className="text-muted mb-2">{t('more_events_coming_soon')}</h5>
                        <p className="text-muted small mb-3">{t('stay_tuned_for_exciting_upcoming_events_and_gatherings')}</p>
                        <Link href="/get-connected/contact" className="btn btn-outline-secondary btn-sm">
                          {t('get_notified')}
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
                <p className="text-muted">{t('check_back_soon_for_new_events')}</p>
              </div>
            )}
            <div className="text-center">
              <Link href="/events" className="btn btn-outline-primary">{t('explore_all_events')}</Link>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section 
          className="cta-section py-5 text-white text-center rounded-5"
          style={{
            background: 'linear-gradient(135deg, #007bff, #0056b3)',
            padding: '1.5rem'
          }}
        >
          <div className="container">
            <h2 className="mb-4">{t('have_you_ever_wondered_how_to_know_god_and_experience_the_peace_that_comes_from_him')}</h2>
            <Link href="/resources/know-god" className="btn btn-light btn-lg">{t('how_to_know_god')}</Link>
          </div>
        </section>
      </div>
    </>
  )
}
