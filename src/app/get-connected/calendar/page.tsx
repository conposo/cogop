'use client'

import { useEffect, useState } from 'react'
import { fetchEventsFromFirestore, Event, formatEventDateTime } from '@/lib/dummyContent'
import PageLayout from '@/components/PageLayout'
import Link from 'next/link'
import { t } from '@/lib/i18n'

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      const fetchedEvents = await fetchEventsFromFirestore()
      setEvents(fetchedEvents)
      setLoading(false)
    }
    loadEvents()
  }, [])

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(event => {
      const eventDate = new Date(event.eventDate).toISOString().split('T')[0]
      const eventEndDate = event.eventEndDate ? new Date(event.eventEndDate).toISOString().split('T')[0] : eventDate
      return dateStr >= eventDate && dateStr <= eventEndDate
    })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []
    const today = new Date()
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day empty"></div>
      )
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dayEvents = getEventsForDate(date)
      const isToday = date.toDateString() === today.toDateString()
      const isPast = date < today && !isToday

      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isToday ? 'today' : ''} ${isPast ? 'past' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}
        >
          <div className="day-number py-2 d-flex justify-content-center align-items-center">{day}</div>
          {dayEvents.length > 0 && (
            <div className="events-indicator">
              {dayEvents.slice(0, 2).map((event, index) => (
                <div 
                  key={event.id} 
                  className="event-dot"
                  title={event.title}
                  style={{ backgroundColor: getCategoryColor(event.category) }}
                >
                  <span className="event-title">{event.title}</span>
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className="more-events">+{dayEvents.length - 2} {t('more', { defaultValue: 'more' })}</div>
              )}
            </div>
          )}
        </div>
      )
    }

    return days
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Events': '#007bff',
      'Youth Ministry': '#28a745',
      'Community Outreach': '#ffc107',
      'Ministry Updates': '#17a2b8',
      'Global Missions': '#dc3545',
      'Announcements': '#6f42c1',
      'Prayer Requests': '#fd7e14',
      'General': '#6c757d'
    }
    return colors[category] || '#6c757d'
  }

  const getUpcomingEvents = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return events
      .filter(event => new Date(event.eventDate) >= today)
      .slice(0, 5)
  }

  if (loading) {
    return (
      <PageLayout title={t('event_calendar', { defaultValue: 'Event Calendar' })} description={t('view_all_upcoming_events', { defaultValue: 'View all upcoming church events and activities' })}>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">{t('loading_calendar', { defaultValue: 'Loading calendar...' })}</span>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title={t('event_calendar', { defaultValue: 'Event Calendar' })} description={t('view_all_upcoming_events', { defaultValue: 'View all upcoming church events and activities' })}>
      <style jsx>{`
        .calendar-container {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .calendar-header {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          padding: 1.5rem;
        }
        
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          background: #e9ecef;
        }
        
        .calendar-day-header {
          background: #f8f9fa;
          padding: 0.75rem;
          text-align: center;
          font-weight: 600;
          color: #495057;
          border-bottom: 2px solid #dee2e6;
        }
        
        .calendar-day {
          background: white;
          min-height: 120px;
          padding: 0.5rem;
          position: relative;
          transition: background-color 0.2s;
        }
        
        .calendar-day:hover {
          background: #f8f9fa;
        }
        
        .calendar-day.empty {
          background: #f8f9fa;
        }
        
        .calendar-day.today {
          background: #e3f2fd;
          border: 2px solid #2196f3;
        }
        
        .calendar-day.past {
          background: #fafafa;
          color: #9e9e9e;
        }
        
        .calendar-day.has-events {
          background: #fff3cd;
        }
        
        .day-number {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        
        .events-indicator {
          font-size: 0.75rem;
        }
        
        .event-dot {
          background: #007bff;
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          margin-bottom: 2px;
          font-size: 0.7rem;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .more-events {
          color: #6c757d;
          font-size: 0.65rem;
          font-style: italic;
        }
        
        .view-toggle {
          background: white;
          border-radius: 25px;
          padding: 0.25rem;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .view-toggle .btn {
          border-radius: 20px;
          padding: 0.5rem 1rem;
          border: none;
          transition: all 0.2s;
        }
        
        .view-toggle .btn.active {
          background: #007bff;
          color: white;
          box-shadow: 0 2px 5px rgba(0,123,255,0.3);
        }

        .view-toggle .btn:not(.active):hover {
          background: transparent;
          color: #007bff;
        }
        
        .upcoming-events {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .event-card {
          border-left: 4px solid #007bff;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .event-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .category-badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
        }
      `}</style>

      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="view-toggle btn-group" role="group">
              <button
                type="button"
                className={`btn ${viewMode === 'calendar' ? 'active' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('calendar')}
              >
                <i className="bi bi-calendar3 me-2"></i>Calendar View
              </button>
              <button
                type="button"
                className={`btn ${viewMode === 'list' ? 'active' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('list')}
              >
                <i className="bi bi-list-ul me-2"></i>List View
              </button>
            </div>
            
            <div className="d-flex gap-2">
              <Link href="/events" className="btn btn-outline-primary">
                <i className="bi bi-arrow-left me-2"></i>All Events
              </Link>
              <button className="btn btn-dark" onClick={goToToday}>
                <i className="bi bi-calendar-check me-2"></i>Today
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="row">
          <div className="col-lg-9 mb-4">
            <div className="calendar-container">
              <div className="calendar-header">
                <div className="d-flex justify-content-between align-items-center">
                  <button 
                    className="btn btn-outline-light"
                    onClick={() => navigateMonth('prev')}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  
                  <h2 className="mb-0">
                    {currentDate.toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </h2>
                  
                  <button 
                    className="btn btn-outline-light"
                    onClick={() => navigateMonth('next')}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>
              
              <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="calendar-day-header">
                    {day}
                  </div>
                ))}
                {renderCalendarGrid()}
              </div>
            </div>
          </div>
          
          <div className="col-lg-3">
            <div className="upcoming-events">
              <div className="p-3 border-bottom">
                <h5 className="mb-0">
                  <i className="bi bi-clock me-2 text-primary"></i>
                  Upcoming Events
                </h5>
              </div>
              <div className="p-3">
                {getUpcomingEvents().length > 0 ? (
                  getUpcomingEvents().map(event => (
                    <div key={event.id} className="mb-3 pb-3 border-bottom">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span 
                          className="category-badge badge"
                          style={{ backgroundColor: getCategoryColor(event.category) }}
                        >
                          {event.category}
                        </span>
                        {event.featured && (
                          <span className="badge bg-warning text-dark">Featured</span>
                        )}
                      </div>
                      <h6 className="mb-2">{event.title}</h6>
                      <p className="text-muted small mb-2">
                        <i className="bi bi-calendar-event me-1"></i>
                        {formatEventDateTime(event)}
                      </p>
                      <p className="text-muted small mb-2">
                        <i className="bi bi-geo-alt me-1"></i>
                        {event.eventLocation}
                      </p>
                      <Link 
                        href={`/events/${event.id}`} 
                        className="btn btn-sm btn-outline-primary"
                      >
                        Details
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center py-3">
                    <i className="bi bi-calendar-x fs-4 d-block mb-2"></i>
                    No upcoming events
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            {events.length > 0 ? (
              <div className="row">
                {events.map(event => (
                  <div key={event.id} className="col-lg-6 mb-4">
                    <div className="card event-card h-100">
                      {event.imageUrl && (
                        <div style={{ height: '200px', overflow: 'hidden' }}>
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
                          <span 
                            className="category-badge badge"
                            style={{ backgroundColor: getCategoryColor(event.category) }}
                          >
                            {event.category}
                          </span>
                          {event.featured && (
                            <span className="badge bg-warning text-dark">Featured</span>
                          )}
                        </div>
                        <h5 className="card-title">{event.title}</h5>
                        <p className="card-text text-muted">{event.excerpt}</p>
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
                <h4 className="text-muted">No events found</h4>
                <p className="text-muted">Check back soon for new events!</p>
              </div>
            )}
          </div>
        </div>
      )}

    </PageLayout>
  )
}
