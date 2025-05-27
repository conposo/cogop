'use client';

import { useState } from 'react';
import { saveStaticArticlesToFirebase, staticDummyArticles, staticDummyEvents } from '@/lib/dummyContent';

export default function ImportArticles() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await saveStaticArticlesToFirebase();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const totalContent = staticDummyArticles.length + staticDummyEvents.length;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card">
            <div className="card-header">
              <h2 className="mb-0">Import Static Content to Firebase</h2>
            </div>
            <div className="card-body">
              <p className="mb-4">
                This will import {totalContent} items ({staticDummyArticles.length} articles and {staticDummyEvents.length} events) from the dummy data into your Firebase Firestore database.
              </p>

              {/* Preview of content to be imported */}
              <div className="row mb-4">
                {/* Articles */}
                <div className="col-md-6">
                  <h5>
                    <i className="bi bi-newspaper me-2"></i>
                    Articles ({staticDummyArticles.length})
                  </h5>
                  <ul className="list-group">
                    {staticDummyArticles.map((article) => (
                      <li key={article.id} className="list-group-item d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                          <div className="fw-bold">{article.title}</div>
                          <small className="text-muted">{article.category} • {article.author} • {article.date}</small>
                        </div>
                        {article.featured && (
                          <span className="badge bg-primary rounded-pill">Featured</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Events */}
                <div className="col-md-6">
                  <h5>
                    <i className="bi bi-calendar-event me-2"></i>
                    Events ({staticDummyEvents.length})
                  </h5>
                  <ul className="list-group">
                    {staticDummyEvents.map((event) => (
                      <li key={event.id} className="list-group-item d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                          <div className="fw-bold">{event.title}</div>
                          <small className="text-muted">
                            {event.category} • {event.author} • {event.eventDate}
                          </small>
                          <div className="small text-muted mt-1">
                            <i className="bi bi-geo-alt me-1"></i>
                            {event.eventLocation}
                          </div>
                        </div>
                        {event.featured && (
                          <span className="badge bg-warning text-dark rounded-pill">Featured</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Import button */}
              <div className="text-center mb-4">
                <button
                  onClick={handleImport}
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Importing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-cloud-upload me-2"></i>
                      Import Content to Firebase
                    </>
                  )}
                </button>
              </div>

              {/* Success message */}
              {success && (
                <div className="alert alert-success" role="alert">
                  <i className="bi bi-check-circle me-2"></i>
                  Successfully imported all content to Firebase! You can now view them in the{' '}
                  <a href="/admin/news" className="alert-link">Content Management</a> section.
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Error: {error}
                </div>
              )}

              {/* Warning */}
              <div className="alert alert-warning" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                <strong>Warning:</strong> This will create new documents in your Firebase Firestore. 
                If content with the same IDs already exist, they will be overwritten.
              </div>

              {/* Additional info */}
              <div className="mt-4">
                <h6>What will be imported:</h6>
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-primary">Articles:</h6>
                    <ul className="list-unstyled">
                      <li><i className="bi bi-check text-success me-2"></i>{staticDummyArticles.length} sample articles</li>
                      <li><i className="bi bi-check text-success me-2"></i>{staticDummyArticles.filter(a => a.featured).length} featured articles</li>
                      <li><i className="bi bi-check text-success me-2"></i>Various categories (Church News, Community, Ministries, etc.)</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-info">Events:</h6>
                    <ul className="list-unstyled">
                      <li><i className="bi bi-check text-success me-2"></i>{staticDummyEvents.length} sample events</li>
                      <li><i className="bi bi-check text-success me-2"></i>{staticDummyEvents.filter(e => e.featured).length} featured events</li>
                      <li><i className="bi bi-check text-success me-2"></i>Complete event details (dates, times, locations)</li>
                    </ul>
                  </div>
                </div>
                <ul className="list-unstyled mt-3">
                  <li><i className="bi bi-check text-success me-2"></i>Proper timestamps and metadata</li>
                  <li><i className="bi bi-check text-success me-2"></i>Content type classification (article/event)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 