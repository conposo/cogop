'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
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

export default function ChurchesPage() {
  const { t } = useTranslation();
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDenomination, setSelectedDenomination] = useState('');

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
    fetchChurches();
  }, []);

  const fetchChurches = async () => {
    try {
      setError(null);
      let churchesData: Church[] = [];
      
      try {
        // Try the filtered query first
        const churchesQuery = query(
          collection(db, 'churches'),
          where('isActive', '==', true)
        );
        const snapshot = await getDocs(churchesQuery);
        churchesData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            servicesTimes: migrateServicesTimes(data.servicesTimes)
          };
        }) as Church[];
      } catch (queryError) {
        console.warn('Filtered query failed, trying to fetch all churches:', queryError);
        // Fallback: try to fetch all churches
        const allChurchesSnapshot = await getDocs(collection(db, 'churches'));
        const allChurches = allChurchesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            servicesTimes: migrateServicesTimes(data.servicesTimes)
          };
        }) as Church[];
        // Filter manually for active churches
        churchesData = allChurches.filter(church => church.isActive === true);
      }
      
      // Sort manually since we removed orderBy
      churchesData.sort((a, b) => a.name.localeCompare(b.name));
      
      setChurches(churchesData);
    } catch (error) {
      console.error('Error fetching churches:', error);
      setError('An error occurred while fetching churches.');
    } finally {
      setLoading(false);
    }
  };

  // Get unique denominations for filter
  const denominations = [...new Set(churches.map(church => church.denomination).filter(Boolean))];

  // Filter churches based on search and denomination
  const filteredChurches = churches.filter(church => {
    // Handle search term
    if (searchTerm && searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase().trim();
      const searchFields = [
        church.name || '',
        church.city || '',
        church.pastor || '',
        church.denomination || '',
        church.address || '',
        church.state || '',
        church.country || '',
        church.programs.join(' ') || ''
      ];
      
      const matchesSearch = searchFields.some(field => 
        field.toLowerCase().includes(searchLower)
      );
      
      if (!matchesSearch) return false;
    }
    
    // Handle denomination filter
    if (selectedDenomination && selectedDenomination !== '') {
      if (church.denomination !== selectedDenomination) return false;
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">{t('loading', { defaultValue: 'Loading...' })}</span>
          </div>
          <p className="mt-2">{t('loading_churches', { defaultValue: 'Loading churches...' })}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h4>{t('error_loading_churches', { defaultValue: 'Error Loading Churches' })}</h4>
          <p>{error}</p>
          <button 
            className="btn btn-primary text-white" 
            onClick={() => {
              setError(null);
              fetchChurches();
            }}
          >
            {t('try_again_btn', { defaultValue: 'Try Again' })}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">{t('find_a_church_header', { defaultValue: 'Find a Church' })}</h1>
        <p className="lead text-muted">
          {t('discover_churches_description', { defaultValue: 'Discover churches in your community and connect with local congregations' })}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="row mb-4">
        <div className="col-md-8 mb-3 mx-auto">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder={t('search_church_placeholder', { defaultValue: 'Search by church name, city, pastor, or denomination...' })}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {/* <div className="col-md-4 mb-3">
          <select
            className="form-select"
            value={selectedDenomination}
            onChange={(e) => setSelectedDenomination(e.target.value)}
          >
            <option value="">{t('all_denominations', { defaultValue: 'All Denominations' })}</option>
            {denominations.map(denomination => (
              <option key={denomination} value={denomination}>
                {denomination}
              </option>
            ))}
          </select>
        </div> */}
      </div>

      {/* Results Count */}
      {/* <div className="mb-4">
        <p className="text-muted">
          {t('churches_found', { 
            defaultValue: '{count} church{plural} found',
            count: filteredChurches.length,
            plural: filteredChurches.length !== 1 ? 'es' : ''
          })}
        </p>
      </div> */}

      {/* Churches Grid */}
      {filteredChurches.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-building fs-1 text-muted"></i>
          <h3 className="mt-3 text-muted">{t('no_churches_found_header', { defaultValue: 'No churches found' })}</h3>
          <p className="text-muted">
            {churches.length === 0 
              ? t('no_churches_listed', { defaultValue: 'No churches are currently listed in our directory.' })
              : searchTerm || selectedDenomination 
                ? t('try_adjusting_criteria', { defaultValue: 'Try adjusting your search criteria or filters.' })
                : t('no_churches_match_filters', { defaultValue: 'No churches match your current filters.' })
            }
          </p>
          {(searchTerm || selectedDenomination) && (
            <button 
              className="btn btn-outline-primary"
              onClick={() => {
                setSearchTerm('');
                setSelectedDenomination('');
              }}
            >
              {t('clear_filters_btn', { defaultValue: 'Clear Filters' })}
            </button>
          )}
        </div>
      ) : (
        <div className="row">
          {filteredChurches.map((church) => (
            <div key={church.id} className="col-lg-6 col-xl-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    <Link 
                      href={`/churches/${church.id}`}
                      className="text-decoration-none"
                    >
                      {church.name}
                    </Link>
                  </h5>
                  
                  {church.denomination && (
                    <p className="text-muted small mb-2">
                      <i className="bi bi-bookmark me-1"></i>
                      {church.denomination}
                    </p>
                  )}

                  {church.pastor && (
                    <p className="text-muted small mb-2">
                      <i className="bi bi-person me-1"></i>
                      {t('pastor_prefix', { defaultValue: 'Pastor' })} {church.pastor}
                    </p>
                  )}

                  <p className="text-muted small mb-3">
                    <i className="bi bi-geo-alt me-1"></i>
                    {church.address}<br />
                    {church.city}, {church.state} {church.zipCode}
                    {church.country && church.country !== 'United States' && (
                      <><br />{church.country}</>
                    )}
                  </p>

                  {(church.servicesTimes.length > 0) && (
                    <div className="mb-3">
                      <p className="text-muted small mb-1">
                        <i className="bi bi-clock me-1"></i>
                        <strong>{t('service_times_label', { defaultValue: 'Service Times:' })}</strong>
                      </p>
                      {church.servicesTimes.map((service, index) => (
                        <p key={index} className="text-muted small mb-1">{service.day} - {service.time}</p>
                      ))}
                    </div>
                  )}

                  {church.programs.length > 0 && (
                    <div className="mb-3">
                      <p className="text-muted small mb-2">
                        <i className="bi bi-people me-1"></i>
                        <strong>{t('programs_label', { defaultValue: 'Programs:' })}</strong>
                      </p>
                      <div className="d-flex flex-wrap gap-1">
                        {church.programs.slice(0, 3).map((program, index) => (
                          <span key={index} className="badge bg-light text-dark border small">
                            {program}
                          </span>
                        ))}
                        {church.programs.length > 3 && (
                          <span className="badge bg-light text-muted border small">
                            +{church.programs.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {church.description && (
                    <p className="card-text small text-muted mb-3">
                      {church.description.length > 100 
                        ? `${church.description.substring(0, 100)}...` 
                        : church.description
                      }
                    </p>
                  )}

                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {church.phone && (
                      <a 
                        href={`tel:${church.phone}`} 
                        className="btn btn-sm btn-outline-primary"
                      >
                        <i className="bi bi-telephone me-1"></i>
                        {t('call_btn', { defaultValue: 'Call' })}
                      </a>
                    )}
                    {church.email && (
                      <a 
                        href={`mailto:${church.email}`} 
                        className="btn btn-sm btn-outline-secondary"
                      >
                        <i className="bi bi-envelope me-1"></i>
                        {t('email_btn', { defaultValue: 'Email' })}
                      </a>
                    )}
                    {church.website && (
                      <a 
                        href={church.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-info"
                      >
                        <i className="bi bi-globe me-1"></i>
                        {t('website_btn', { defaultValue: 'Website' })}
                      </a>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <Link 
                      href={`/churches/${church.id}`}
                      className="btn btn-primary text-white btn-sm"
                    >
                      {t('view_details_btn', { defaultValue: 'View Details' })}
                    </Link>
                                          <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(`${church.address}, ${church.city}, ${church.state} ${church.zipCode}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-success btn-sm"
                      >
                        <i className="bi bi-geo-alt me-1"></i>
                        {t('directions_btn', { defaultValue: 'Directions' })}
                      </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Call to Action */}
      {churches.length > 0 && (
        <div className="text-center mt-5 pt-5 border-top">
          <h3>{t('dont_see_church', { defaultValue: "Don't see your church listed?" })}</h3>
          <p className="text-muted mb-4">
            {t('church_directory_help', { defaultValue: 'If you\'re a church leader and would like to have your church included in our directory, please contact us.' })}
          </p>
          <Link href="/get-connected/contact" className="btn btn-outline-primary">
            {t('contact_us_btn', { defaultValue: 'Contact Us' })}
          </Link>
        </div>
      )}
    </div>
  );
} 