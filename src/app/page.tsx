'use client'

import Link from 'next/link'
import { useContent } from '@/contexts/ContentContext'

export default function Home() {
  const { stats, articles, podcasts, events, carousel } = useContent()

  // Create chunks of articles for multi-item carousel
  const chunkArticles = (articles: any[], chunkSize: number) => {
    const chunks = []
    for (let i = 0; i < articles.length; i += chunkSize) {
      chunks.push(articles.slice(i, i + chunkSize))
    }
    return chunks
  }

  const articleChunks = chunkArticles(articles, 3)

  return (
    <div className="container-fluid">
      {/* Hero Carousel Section */}
      <section className="hero-carousel">
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
                  className="carousel-slide d-flex align-items-center justify-content-center"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '70vh'
                  }}
                >
                  <div className="container">
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

      {/* Mission Statement */}
      <section className="mission-section py-5">
        <div className="container">
          <h2 className="text-center mb-5">We invite you to join with us as we seek to fulfill our mission of reconciling the world to Christ through the Power of the Holy Spirit.</h2>
        </div>
      </section>

      {/* Statistics */}
      <section className="stats-section py-5 bg-light">
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
      </section>

      {/* Articles */}
      <section className="articles-section py-5">
        <div className="container">
          <h2 className="text-center mb-5">Articles & News</h2>
          
          {/* Mobile Carousel - 1 article per slide */}
          <div id="mobileArticlesCarousel" className="carousel slide d-lg-none" data-bs-ride="carousel">
            {/* Carousel Indicators */}
            <div className="carousel-indicators">
              {articles.map((_, index) => (
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

            {/* Carousel Inner */}
            <div className="carousel-inner">
              {articles.map((article, index) => (
                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                  <div className="row justify-content-center">
                    <div className="col-12">
                      <div className="card h-100 shadow">
                        {article.image && (
                          <div className="card-img-top-wrapper" style={{ height: '200px', overflow: 'hidden' }}>
                            <img 
                              src={article.image} 
                              alt={article.title}
                              className="card-img-top w-100 h-100"
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                        )}
                        <div className="card-body p-4">
                          <span className="badge bg-primary mb-3">{article.category}</span>
                          <h3 className="card-title h5 mb-3">{article.title}</h3>
                          {article.excerpt && (
                            <p className="card-text text-muted mb-3">{article.excerpt}</p>
                          )}
                          {article.date && (
                            <p className="text-muted small mb-3">
                              <i className="bi bi-calendar me-2"></i>{article.date}
                            </p>
                          )}
                          <Link href="/news" className="btn btn-primary">Read More</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            <button className="carousel-control-prev" type="button" data-bs-target="#mobileArticlesCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#mobileArticlesCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>

          {/* Desktop Carousel - 3 articles per slide */}
          <div id="desktopArticlesCarousel" className="carousel slide d-none d-lg-block" data-bs-ride="carousel">
            {/* Carousel Indicators */}
            <div className="carousel-indicators">
              {articleChunks.map((_, index) => (
                <button 
                  key={index}
                  type="button" 
                  data-bs-target="#desktopArticlesCarousel" 
                  data-bs-slide-to={index}
                  className={index === 0 ? 'active' : ''}
                  aria-current={index === 0 ? 'true' : 'false'}
                  aria-label={`Slide ${index + 1}`}
                ></button>
              ))}
            </div>

            {/* Carousel Inner */}
            <div className="carousel-inner">
              {articleChunks.map((chunk, chunkIndex) => (
                <div key={chunkIndex} className={`carousel-item ${chunkIndex === 0 ? 'active' : ''}`}>
                  <div className="row">
                    {chunk.map((article, articleIndex) => (
                      <div key={`${chunkIndex}-${articleIndex}`} className="col-lg-4">
                        <div className="card h-100 shadow">
                          {article.image && (
                            <div className="card-img-top-wrapper" style={{ height: '200px', overflow: 'hidden' }}>
                              <img 
                                src={article.image} 
                                alt={article.title}
                                className="card-img-top w-100 h-100"
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                          )}
                          <div className="card-body p-4">
                            <span className="badge bg-primary mb-3">{article.category}</span>
                            <h3 className="card-title h5 mb-3">{article.title}</h3>
                            {article.excerpt && (
                              <p className="card-text text-muted mb-3">{article.excerpt}</p>
                            )}
                            {article.date && (
                              <p className="text-muted small mb-3">
                                <i className="bi bi-calendar me-2"></i>{article.date}
                              </p>
                            )}
                            <Link href="/news" className="btn btn-primary">Read More</Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            <button className="carousel-control-prev" type="button" data-bs-target="#desktopArticlesCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#desktopArticlesCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>

          <div className="text-center mt-4">
            <Link href="/news" className="btn btn-outline-primary">View all</Link>
          </div>
        </div>
      </section>

      {/* Podcasts */}
      <section className="podcasts-section py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Our Podcasts</h2>
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
                    <button className="btn btn-primary">Listen now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/podcasts" className="btn btn-outline-primary">View all</Link>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="events-section py-5">
        <div className="container">
          <h2 className="text-center mb-5">Upcoming events</h2>
          <div className="row">
            {events.map((event, index) => (
              <div key={index} className="col-lg-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="card-title h5">{event.title}</h3>
                    <p className="text-muted">{event.location}</p>
                    <ul className="list-unstyled">
                      <li><i className="bi bi-calendar me-2"></i>{event.date}</li>
                      <li><i className="bi bi-geo-alt me-2"></i>{event.venue}</li>
                    </ul>
                    <Link href="/events" className="btn btn-outline-primary btn-sm">Event Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/events" className="btn btn-outline-primary">Explore All Events</Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section py-5 bg-primary text-white text-center">
        <div className="container">
          <h2 className="mb-4">Have you ever wondered how to know God and experience the peace that comes from him?</h2>
          <Link href="/resources/know-god" className="btn btn-light btn-lg">How to Know God</Link>
        </div>
      </section>
    </div>
  )
}
