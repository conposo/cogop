'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { fetchEventById, Event, formatEventDateTime } from '@/lib/dummyContent';

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
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
          <span className="visually-hidden">Loading event...</span>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-5 text-center">
        <h1 className="display-4">Event Not Found</h1>
        <p className="lead">The event you are looking for does not exist or may have been moved.</p>
        <Link href="/events" className="btn btn-dark mt-3">
          Back to Events
        </Link>
      </div>
    );
  }

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
                    <span className="badge bg-warning text-dark">Featured Event</span>
                  )}
                </div>
              </div>
              
              <h1 className="fw-bolder mb-3">{event.title}</h1>
              
              <div className="event-details bg-light p-4 rounded mb-4">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h6 className="text-primary mb-2">
                      <i className="bi bi-calendar-event me-2"></i>Date & Time
                    </h6>
                    <p className="mb-0">{formatEventDateTime(event)}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-primary mb-2">
                      <i className="bi bi-geo-alt me-2"></i>Location
                    </h6>
                    <p className="mb-0">{event.eventLocation}</p>
                    {event.eventAddress && (
                      <p className="text-muted small mb-0">{event.eventAddress}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-muted fst-italic mb-2">
                Posted by {event.authorName}
              </div>
            </header>

            {event.imageUrl && (
              <figure className="mb-4">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  width={900}
                  height={400}
                  className="img-fluid rounded"
                  style={{ objectFit: 'cover' }}
                />
              </figure>
            )}

            <section className="mb-5">
              <div className="mb-4">
                <h5 className="text-primary">About This Event</h5>
                <p className="lead">{event.excerpt}</p>
              </div>
              
              {event.content && event.content !== event.excerpt && (
                <div>
                  <h5 className="text-primary mb-3">Event Details</h5>
                  <div dangerouslySetInnerHTML={{ __html: event.content }} />
                </div>
              )}
            </section>

            {/* Event Actions */}
            <section className="event-actions bg-primary text-white p-4 rounded mb-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h5 className="mb-2">Ready to Join Us?</h5>
                  <p className="mb-0">Don't miss this opportunity to be part of something special.</p>
                </div>
                <div className="col-md-4 text-md-end">
                  <Link href="/get-connected/contact" className="btn btn-light me-2">
                    Get More Info
                  </Link>
                  <Link href="/get-connected/calendar" className="btn btn-outline-light">
                    Add to Calendar
                  </Link>
                </div>
              </div>
            </section>
          </article>

          <div className="mt-5">
            <Link href="/events" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left me-2"></i>
              Back to All Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 