'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DiscussionsProvider } from '@/contexts/DiscussionsContext';
import DiscussionsSummary from '@/components/admin/DiscussionsSummary';

interface Church {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  email?: string;
  website?: string;
  pastor?: string;
  denomination?: string;
  description?: string;
  servicesTimes: {
    day: string;
    time: string;
  }[];
  programs: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  isActive: boolean;
}

export default function ChurchDetailsPage() {
  const params = useParams();
  const [church, setChurch] = useState<Church | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const churchId = params.id as string;

  // Helper function to migrate old servicesTimes structure to new format
  const migrateServicesTimes = (servicesTimes: any): { day: string; time: string }[] => {
    if (Array.isArray(servicesTimes)) {
      return servicesTimes;
    }
    
    // Handle old structure with sunday/wednesday properties
    if (servicesTimes && typeof servicesTimes === 'object') {
      const migrated = [];
      if (servicesTimes.sunday) {
        migrated.push({ day: 'Sunday', time: servicesTimes.sunday });
      }
      if (servicesTimes.wednesday) {
        migrated.push({ day: 'Wednesday', time: servicesTimes.wednesday });
      }
      return migrated;
    }
    
    return [];
  };

  useEffect(() => {
    fetchChurch();
  }, [churchId]);

  const fetchChurch = async () => {
    try {
      const churchDoc = await getDoc(doc(db, 'churches', churchId));
      if (churchDoc.exists()) {
        const data = churchDoc.data();
        const churchData = {
          id: churchDoc.id,
          ...data,
          servicesTimes: migrateServicesTimes(data.servicesTimes)
        } as Church;
        
        // Check if church is active (public access should only see active churches)
        if (churchData.isActive) {
          setChurch(churchData);
        } else {
          setError('Church not found or not available');
        }
      } else {
        setError('Church not found');
      }
    } catch (error) {
      console.error('Error fetching church:', error);
      setError('Error loading church details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading church details...</p>
        </div>
      </div>
    );
  }

  if (error || !church) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          <h4>Church Not Found</h4>
          <p>{error || 'The requested church could not be found.'}</p>
          <Link href="/churches" className="btn btn-primary">
            Back to Churches
          </Link>
        </div>
      </div>
    );
  }

  return (
    <DiscussionsProvider>
      <div className="container py-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/churches">Churches</Link>
            </li>
            <li className="breadcrumb-item active">{church.name}</li>
          </ol>
        </nav>

        <div className="row">
          {/* Main Content */}
          <div className="col-lg-8">
            <div className="card">
              <div className="card-body">
                <h1 className="card-title mb-3">{church.name}</h1>
                
                {church.denomination && (
                  <p className="text-muted mb-3">
                    <i className="bi bi-bookmark me-2"></i>
                    <strong>Denomination:</strong> {church.denomination}
                  </p>
                )}

                {church.pastor && (
                  <p className="text-muted mb-3">
                    <i className="bi bi-person me-2"></i>
                    <strong>Pastor:</strong> {church.pastor}
                  </p>
                )}

                {church.description && (
                  <div className="mb-4">
                    <h5>About Us</h5>
                    <p className="text-muted">{church.description}</p>
                  </div>
                )}

                {(church.servicesTimes.length > 0) && (
                  <div className="mb-4">
                    <h5>Service Times</h5>
                    <div className="row">
                      {church.servicesTimes.map((service, index) => (
                        <div key={index} className="col-md-6">
                          <div className="mb-2">
                            <strong>{service.day}:</strong><br />
                            <span className="text-muted">{service.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {church.programs.length > 0 && (
                  <div className="mb-4">
                    <h5>Programs & Ministries</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {church.programs.map((program, index) => (
                        <span key={index} className="badge bg-primary">
                          {program}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="mb-4">
                  <h5>Contact Information</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <strong>Address:</strong><br />
                        <address className="text-muted mb-0">
                          {church.address}<br />
                          {church.city}, {church.state} {church.zipCode}
                          {church.country && church.country !== 'United States' && (
                            <><br />{church.country}</>
                          )}
                        </address>
                      </div>
                    </div>
                    <div className="col-md-6">
                      {church.phone && (
                        <div className="mb-3">
                          <strong>Phone:</strong><br />
                          <a href={`tel:${church.phone}`} className="text-decoration-none">
                            {church.phone}
                          </a>
                        </div>
                      )}
                      {church.email && (
                        <div className="mb-3">
                          <strong>Email:</strong><br />
                          <a href={`mailto:${church.email}`} className="text-decoration-none">
                            {church.email}
                          </a>
                        </div>
                      )}
                      {church.website && (
                        <div className="mb-3">
                          <strong>Website:</strong><br />
                          <a 
                            href={church.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                          >
                            {church.website}
                            <i className="bi bi-box-arrow-up-right ms-1"></i>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex flex-wrap gap-2">
                  <Link 
                    href={`/churches/${churchId}/discussions`}
                    className="btn btn-success"
                  >
                    <i className="bi bi-chat-dots me-2"></i>
                    Join Discussions
                  </Link>
                  {church.phone && (
                    <a 
                      href={`tel:${church.phone}`} 
                      className="btn btn-primary"
                    >
                      <i className="bi bi-telephone me-2"></i>
                      Call Church
                    </a>
                  )}
                  {church.email && (
                    <a 
                      href={`mailto:${church.email}`} 
                      className="btn btn-outline-primary"
                    >
                      <i className="bi bi-envelope me-2"></i>
                      Send Email
                    </a>
                  )}
                  {church.website && (
                    <a 
                      href={church.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-outline-info"
                    >
                      <i className="bi bi-globe me-2"></i>
                      Visit Website
                    </a>
                  )}
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${church.address}, ${church.city}, ${church.state} ${church.zipCode}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-success"
                  >
                    <i className="bi bi-geo-alt me-2"></i>
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Discussions Summary */}
            <DiscussionsSummary churchId={churchId} />

            {/* Location Card */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="bi bi-geo-alt me-2"></i>
                  Location
                </h5>
              </div>
              <div className="card-body">
                <address className="mb-3">
                  {church.address}<br />
                  {church.city}, {church.state} {church.zipCode}
                  {church.country && church.country !== 'United States' && (
                    <><br />{church.country}</>
                  )}
                </address>
                <div className="d-grid">
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${church.address}, ${church.city}, ${church.state} ${church.zipCode}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary"
                  >
                    <i className="bi bi-geo-alt me-2"></i>
                    View on Map
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Contact Card */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="bi bi-telephone me-2"></i>
                  Quick Contact
                </h5>
              </div>
              <div className="card-body">
                {church.phone && (
                  <div className="d-grid mb-2">
                    <a 
                      href={`tel:${church.phone}`} 
                      className="btn btn-primary"
                    >
                      <i className="bi bi-telephone me-2"></i>
                      {church.phone}
                    </a>
                  </div>
                )}
                {church.email && (
                  <div className="d-grid mb-2">
                    <a 
                      href={`mailto:${church.email}`} 
                      className="btn btn-outline-secondary"
                    >
                      <i className="bi bi-envelope me-2"></i>
                      Send Email
                    </a>
                  </div>
                )}
                {church.website && (
                  <div className="d-grid">
                    <a 
                      href={church.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-outline-info"
                    >
                      <i className="bi bi-globe me-2"></i>
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Church Info Card */}
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  Church Information
                </h5>
              </div>
              <div className="card-body">
                <table className="table table-borderless table-sm">
                  <tbody>
                    {church.denomination && (
                      <tr>
                        <td><strong>Denomination:</strong></td>
                        <td>{church.denomination}</td>
                      </tr>
                    )}
                    {church.pastor && (
                      <tr>
                        <td><strong>Pastor:</strong></td>
                        <td>{church.pastor}</td>
                      </tr>
                    )}
                    <tr>
                      <td><strong>City:</strong></td>
                      <td>{church.city}, {church.state}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Churches */}
        <div className="text-center mt-5 pt-4 border-top">
          <Link href="/churches" className="btn btn-outline-primary">
            <i className="bi bi-arrow-left me-2"></i>
            Back to All Churches
          </Link>
        </div>
      </div>
    </DiscussionsProvider>
  );
} 