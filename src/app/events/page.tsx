'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { fetchEventsFromFirestore, Event, formatEventDateTime } from '@/lib/dummyContent'

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      const fetchedEvents = await fetchEventsFromFirestore()
      setEvents(fetchedEvents)
      setLoading(false)
    }
    loadEvents()
  }, [])

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading events...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="display-4 mb-4">Upcoming Events</h1>
          <p className="lead mb-5">Join us for these special gatherings and conferences throughout the year.</p>
        </div>
      </div>

      {events.length > 0 ? (
        <div className="row">
          {events.map((event) => (
            <div key={event.id} className="col-lg-4 mb-4">
              <div className="card h-100 shadow">
                {event.imageUrl && (
                  <div className="card-img-top-wrapper" style={{ height: '200px', overflow: 'hidden' }}>
                    <img 
                      src={event.imageUrl} 
                      alt={event.title}
                      className="card-img-top w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-info text-dark">{event.category}</span>
                    {event.featured && (
                      <span className="badge bg-warning text-dark">Featured</span>
                    )}
                  </div>
                  <h2 className="card-title h5 mb-3">{event.title}</h2>
                  <p className="card-text text-muted mb-3">{event.excerpt}</p>
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
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-calendar-x fs-1 text-muted mb-3"></i>
          <h4 className="text-muted">No upcoming events</h4>
          <p className="text-muted">Check back soon for new events!</p>
        </div>
      )}

      <div className="row mt-5">
        <div className="col-12 text-center">
          <h2 className="mb-4">Don't miss out on these opportunities!</h2>
          <Link href="/get-connected/calendar" className="btn btn-dark me-3">View Full Calendar</Link>
          <Link href="/get-connected/contact" className="btn btn-outline-primary">Contact Us</Link>
        </div>
      </div>
    </div>
  )
} 