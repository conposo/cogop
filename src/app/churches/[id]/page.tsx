'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DiscussionsProvider } from '@/contexts/DiscussionsContext';
import DiscussionsSummary from '@/components/admin/DiscussionsSummary';
import { useTranslation } from '@/lib/i18n';

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
  const { t } = useTranslation();
  const params = useParams();
  const [church, setChurch] = useState<Church | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const churchId = params.id as string;

  // Helper function to migrate old servicesTimes structure to new format
  const migrateServicesTimes = (servicesTimes: unknown): { day: string; time: string }[] => {
    if (Array.isArray(servicesTimes)) {
      return servicesTimes;
    }
    
    // Handle old structure with sunday/wednesday properties
    if (servicesTimes && typeof servicesTimes === 'object') {
      const migrated: { day: string; time: string }[] = [];
      const servicesObj = servicesTimes as Record<string, any>;
      if (servicesObj.sunday) {
        migrated.push({ day: 'Sunday', time: servicesObj.sunday });
      }
      if (servicesObj.wednesday) {
        migrated.push({ day: 'Wednesday', time: servicesObj.wednesday });
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
          setError(t('church_not_found_message'));
        }
      } else {
        setError(t('church_not_found_message'));
      }
    } catch (error) {
      console.error('Error fetching church:', error);
      setError(t('loading_church_details'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">{t('loading')}</span>
          </div>
          <p className="mt-2">{t('loading_church_details')}</p>
        </div>
      </div>
    );
  }

  if (error || !church) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          <h4>{t('church_not_found')}</h4>
          <p>{error || t('church_not_found_message')}</p>
          <Link href="/churches" className="btn btn-primary text-white">
            {t('back_to_churches')}
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
              <Link href="/">{t('home')}</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/churches">{t('churches')}</Link>
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
                
                {false && church.denomination && (
                  <p className="text-muted mb-3">
                    <i className="bi bi-bookmark me-2"></i>
                    <strong>{t('denomination')}:</strong> {church.denomination}
                  </p>
                )}

                {church.pastor && (
                  <p className="text-muted mb-3">
                    <i className="bi bi-person me-2"></i>
                    <strong>{t('pastor')}:</strong> {church.pastor}
                  </p>
                )}

                {church.description && (
                  <div className="mb-4">
                    <h5>{t('about_us')}</h5>
                    <p className="text-muted">{church.description}</p>
                  </div>
                )}

                {(church.servicesTimes.length > 0) && (
                  <div className="mb-4">
                    <h5>{t('service_times')}</h5>
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
                    <h5>{t('programs_ministries')}</h5>
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
                  <h5>{t('contact_information')}</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <strong>{t('address')}:</strong><br />
                        <address className="text-muted mb-0">
                          {church.address}<br />
                          {church.city}, {church.state} {church.zipCode}
                          {church.country && church.country !== t('united_states') && (
                            <><br />{church.country}</>
                          )}
                        </address>
                      </div>
                    </div>
                    <div className="col-md-6">
                      {church.phone && (
                        <div className="mb-3">
                          <strong>{t('phone')}:</strong><br />
                          <a href={`tel:${church.phone}`} className="text-decoration-none">
                            {church.phone}
                          </a>
                        </div>
                      )}
                      {church.email && (
                        <div className="mb-3">
                          <strong>{t('email')}:</strong><br />
                          <a href={`mailto:${church.email}`} className="text-decoration-none">
                            {church.email}
                          </a>
                        </div>
                      )}
                      {church.website && (
                        <div className="mb-3">
                          <strong>{t('website')}:</strong><br />
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
                    {t('join_discussions')}
                  </Link>
                  {church.phone && (
                    <a 
                      href={`tel:${church.phone}`} 
                      className="btn btn-primary text-white"
                    >
                      <i className="bi bi-telephone me-2"></i>
                      {t('call_church')}
                    </a>
                  )}
                  {church.email && (
                    <a 
                      href={`mailto:${church.email}`} 
                      className="btn btn-outline-primary"
                    >
                      <i className="bi bi-envelope me-2"></i>
                      {t('send_email')}
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
                      {t('visit_website')}
                    </a>
                  )}
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${church.address}, ${church.city}, ${church.state} ${church.zipCode}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-success"
                  >
                    <i className="bi bi-geo-alt me-2"></i>
                    {t('get_directions')}
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
                  {t('location')}
                </h5>
              </div>
              <div className="card-body">
                <address className="mb-3">
                  {church.address}<br />
                  {church.city}, {church.state} {church.zipCode}
                  {church.country && church.country !== t('united_states') && (
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
                    {t('view_on_map')}
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Contact Card */}
            {(church.phone || church.email || church.website) && (
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-telephone me-2"></i>
                    {t('quick_contact')}
                  </h5>
                </div>
                <div className="card-body">
                  {church.phone && (
                    <div className="d-grid mb-2">
                      <a 
                        href={`tel:${church.phone}`} 
                        className="btn btn-primary text-white"
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
                        {t('send_email')}
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
                        {t('visit_website')}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Church Info Card */}
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  {t('church_information')}
                </h5>
              </div>
              <div className="card-body">
                <table className="table table-borderless table-sm">
                  <tbody>
                    {false && church && church.denomination && (
                      <tr>
                        <td><strong>{t('denomination')}:</strong></td>
                        <td>{church.denomination}</td>
                      </tr>
                    )}
                    {church && church.pastor && (
                      <tr>
                        <td><strong>{t('pastor')}:</strong></td>
                        <td>{church.pastor}</td>
                      </tr>
                    )}
                    {church && (
                      <tr>
                        <td><strong>{t('city')}:</strong></td>
                        <td>{church.city}, {church.state}</td>
                      </tr>
                    )}
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
            {t('back_to_all_churches')}
          </Link>
        </div>
      </div>
    </DiscussionsProvider>
  );
} 