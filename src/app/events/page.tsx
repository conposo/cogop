'use client'

import Link from 'next/link'
import { useContent } from '@/contexts/ContentContext'

export default function Events() {
  const { events: upcomingEvents } = useContent()

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="display-4 mb-4">Upcoming Events</h1>
          <p className="lead mb-5">Join us for these special gatherings and conferences throughout the year.</p>
        </div>
      </div>

      <div className="row">
        {upcomingEvents.map((event, index) => (
          <div key={index} className="col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <span className="badge bg-primary mb-2">{event.category}</span>
                <h2 className="card-title h5">{event.title}</h2>
                <div className="mb-3">
                  <p className="mb-1"><i className="bi bi-calendar me-2"></i><strong>{event.date}</strong></p>
                  <p className="mb-1"><i className="bi bi-geo-alt me-2"></i>{event.location}</p>
                  <p className="text-muted small">{event.address}</p>
                </div>
                <p className="card-text">{event.description}</p>
                <Link href="#" className="btn btn-outline-primary">Learn More</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row mt-5">
        <div className="col-12 text-center">
          <h2 className="mb-4">Don't miss out on these opportunities!</h2>
          <Link href="/get-connected/calendar" className="btn btn-primary me-3">View Full Calendar</Link>
          <Link href="/get-connected/contact" className="btn btn-outline-primary">Contact Us</Link>
        </div>
      </div>
    </div>
  )
} 