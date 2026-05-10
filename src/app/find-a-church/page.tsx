'use client'

import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getPageContent } from '@/contexts/ContentContext'
import PageLayout from '@/components/PageLayout'
import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'

interface Church {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
  email?: string
  website?: string
  pastor?: string
  denomination?: string
  description?: string
  servicesTimes: {
    day: string
    time: string
  }[]
  programs: string[]
  coordinates?: {
    lat: number
    lng: number
  }
  isActive: boolean
}

export default function FindaChurchPage() {
  const { t } = useTranslation()
  const pageContent = getPageContent('find-a-church')
  const [churches, setChurches] = useState<Church[]>([])
  const [filteredChurches, setFilteredChurches] = useState<Church[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper function to migrate old servicesTimes structure to new format
  const migrateServicesTimes = (servicesTimes: unknown): { day: string; time: string }[] => {
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

  // Fetch churches from Firebase
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
      setFilteredChurches(churchesData);
    } catch (error) {
      console.error('Error fetching churches:', error);
      setError('An error occurred while fetching churches.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get all unique programs for filtering
  const allPrograms = Array.from(new Set(churches.flatMap(church => church.programs || [])));

  useEffect(() => {
    filterChurches()
  }, [searchTerm, selectedPrograms, churches])

  const filterChurches = () => {
    let filtered = churches

    // Filter by search term (city, state, country, or church name)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(church => 
        (church.city || '').toLowerCase().includes(term) ||
        (church.state || '').toLowerCase().includes(term) ||
        (church.country || '').toLowerCase().includes(term) ||
        (church.name || '').toLowerCase().includes(term) ||
        (church.address || '').toLowerCase().includes(term) ||
        (church.pastor || '').toLowerCase().includes(term) ||
        (church.denomination || '').toLowerCase().includes(term)
      )
    }

    // Filter by selected programs
    if (selectedPrograms.length > 0) {
      filtered = filtered.filter(church =>
        selectedPrograms.every(program => (church.programs || []).includes(program))
      )
    }

    setFilteredChurches(filtered)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    filterChurches()
  }

  const toggleProgram = (program: string) => {
    setSelectedPrograms(prev =>
      prev.includes(program)
        ? prev.filter(p => p !== program)
        : [...prev, program]
    )
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedPrograms([])
  }

  return (
    <PageLayout
      title={pageContent.title}
      description={pageContent.description}
      backgroundImage={pageContent.backgroundImage}
    >
      <div className="container">
        <div className="row">
          {/* Search and Filters Sidebar */}
          <div className="col-lg-4 col-xl-3 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-search me-2"></i>
                  {t('search_churches', { defaultValue: 'Search Churches' })}
                </h5>
              </div>
              <div className="card-body">
                {/* Location Search */}
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="mb-3">
                    <label htmlFor="location" className="form-label">
                      {t('enter_city_state_country', { defaultValue: 'Enter City, State, or Country' })}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="location"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={t('location_placeholder', { defaultValue: 'e.g., Cleveland, TN or United States' })}
                    />
                  </div>
                  <button type="submit" className="btn btn-dark w-100" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {t('searching', { defaultValue: 'Searching...' })}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-search me-2"></i>
                        {t('search_churches', { defaultValue: 'Search Churches' })}
                      </>
                    )}
                  </button>
                </form>

                {/* Program Filters */}
                <div className="mb-4">
                  <h6 className="mb-3">{t('filter_by_programs', { defaultValue: 'Filter by Programs' })}</h6>
                  {allPrograms.map(program => (
                    <div key={program} className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`program-${program}`}
                        checked={selectedPrograms.includes(program)}
                        onChange={() => toggleProgram(program)}
                      />
                      <label className="form-check-label" htmlFor={`program-${program}`}>
                        {program}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Clear Filters */}
                {(searchTerm || selectedPrograms.length > 0) && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100"
                    onClick={clearFilters}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    {t('clear_filters', { defaultValue: 'Clear Filters' })}
                  </button>
                )}

                {/* Contact Info */}
                <hr />
                <div className="mt-4">
                  <h6>{t('need_help', { defaultValue: 'Need Help?' })}</h6>
                  <p className="small text-muted mb-2">
                    {t('cant_find_church', { defaultValue: 'Can\'t find a church near you? Contact us for assistance.' })}
                  </p>
                  <p className="small">
                    <strong>{t('phone', { defaultValue: 'Phone' })}:</strong> (423) 559-5100<br />
                    <strong>Email:</strong> info@cogop.org
                  </p>
                  <Link href="/get-connected/contact" className="btn btn-outline-primary btn-sm">
                    {t('contact_us', { defaultValue: 'Contact Us' })}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Church Results */}
          <div className="col-lg-8 col-xl-9">
            {/* Results Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>
                {isLoading ? t('searching', { defaultValue: 'Searching...' }) : t('found_churches', { defaultValue: 'Found {count} Churches' }).replace('{count}', filteredChurches.length.toString())}
                {searchTerm && (
                  <small className="text-muted ms-2">
                    {t('for_search_term', { defaultValue: 'for "{term}"' }).replace('{term}', searchTerm)}
                  </small>
                )}
              </h3>
              {filteredChurches.length > 0 && (
                <div className="text-muted">
                  <i className="bi bi-geo-alt me-1"></i>
                  {t('showing_results_worldwide', { defaultValue: 'Showing results worldwide' })}
                </div>
              )}
            </div>

            {/* Error State */}
            {error && (
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
                  {t('try_again', { defaultValue: 'Try Again' })}
                </button>
              </div>
            )}

            {/* Church Cards */}
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">{t('loading', { defaultValue: 'Loading...' })}</span>
                </div>
                <p className="mt-3 text-muted">{t('searching_for_churches', { defaultValue: 'Searching for churches...' })}</p>
              </div>
            ) : filteredChurches.length === 0 && !error ? (
              <div className="text-center py-5">
                <i className="bi bi-search display-1 text-muted mb-3"></i>
                <h4>{t('no_churches_found', { defaultValue: 'No Churches Found' })}</h4>
                <p className="text-muted mb-4">
                  {churches.length === 0 
                    ? 'No churches are currently listed in our directory.' 
                    : t('no_churches_message', { defaultValue: 'We couldn\'t find any churches matching your search criteria. Try adjusting your search terms or contact us for assistance.' })
                  }
                </p>
                <button
                  className="btn btn-dark me-2"
                  onClick={clearFilters}
                >
                  {t('clear_filters', { defaultValue: 'Clear Filters' })}
                </button>
                <Link href="/get-connected/contact" className="btn btn-outline-primary">
                  {t('contact_us', { defaultValue: 'Contact Us' })}
                </Link>
              </div>
            ) : !error && (
              <div className="row">
                {filteredChurches.map(church => (
                  <div key={church.id} className="col-12 mb-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-8">
                            <a
                                href={`/churches/${church.id}`}
                                className="text-decoration-none"
                              >
                              <h5 className="card-title text-primary">
                                <i className="bi bi-house-heart me-2"></i>
                                {church.name}
                              </h5>
                            </a>
                            
                            {church.denomination && (
                              <p className="text-muted small mb-2">
                                <i className="bi bi-bookmark me-1"></i>
                                {church.denomination}
                              </p>
                            )}
                            
                            <div className="mb-3">
                              <p className="mb-1">
                                <i className="bi bi-geo-alt text-muted me-2"></i>
                                {church.address}
                                {church.city && church.state && (
                                  <><br />{church.city}, {church.state} {church.zipCode}</>
                                )}
                                {church.country && church.country !== 'United States' && (
                                  <><br />{church.country}</>
                                )}
                              </p>
                              {church.phone && (
                                <p className="mb-1">
                                  <i className="bi bi-telephone text-muted me-2"></i>
                                  <a href={`tel:${church.phone}`} className="text-decoration-none">
                                    {church.phone}
                                  </a>
                                </p>
                              )}
                              {church.email && (
                                <p className="mb-1">
                                  <i className="bi bi-envelope text-muted me-2"></i>
                                  <a href={`mailto:${church.email}`} className="text-decoration-none">
                                    {church.email}
                                  </a>
                                </p>
                              )}
                              {church.pastor && (
                                <p className="mb-0">
                                  <i className="bi bi-person text-muted me-2"></i>
                                  {t('pastor', { defaultValue: 'Pastor' })}: {church.pastor}
                                </p>
                              )}
                            </div>

                            {church.servicesTimes.length > 0 && (
                              <div className="mb-3">
                                <h6 className="text-muted mb-2">{t('service_times', { defaultValue: 'Service Times' })}</h6>
                                {church.servicesTimes.map((service, index) => (
                                  <p key={index} className="small mb-1">{service.day}: {service.time}</p>
                                ))}
                              </div>
                            )}

                            {church.programs && church.programs.length > 0 && (
                              <div className="mb-3">
                                <h6 className="text-muted mb-2">{t('programs_ministries', { defaultValue: 'Programs & Ministries' })}</h6>
                                <div className="d-flex flex-wrap gap-1">
                                  {church.programs.map(program => (
                                    <span key={program} className="badge bg-light text-dark border">
                                      {program}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {church.description && (
                              <div className="mb-3">
                                <p className="text-muted small">
                                  {church.description.length > 150 
                                    ? `${church.description.substring(0, 150)}...` 
                                    : church.description
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                          
                          <div className="col-md-4 text-md-end">
                            <div className="d-grid gap-2">
                              <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(`${church.address}, ${church.city}, ${church.state} ${church.zipCode}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline-primary btn-sm"
                              >
                                <i className="bi bi-map me-1"></i>
                                {t('get_directions', { defaultValue: 'Get Directions' })}
                              </a>
                              {false && church.website && (
                                <a
                                  href={church.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-outline-secondary btn-sm"
                                >
                                  <i className="bi bi-globe me-1"></i>
                                  {t('visit_website', { defaultValue: 'Visit Website' })}
                                </a>
                              )}
                              {church.phone && (
                                <a
                                  href={`tel:${church.phone}`}
                                  className="btn btn-dark btn-sm"
                                >
                                  <i className="bi bi-telephone me-1"></i>
                                  {t('call_church', { defaultValue: 'Call Church' })}
                                </a>
                              )}
                              <a
                                href={`/churches/${church.id}`}
                                className="btn btn-primary text-white btn-sm"
                              >
                                <i className="bi bi-eye me-1"></i>
                                {t('view_details', { defaultValue: 'View Details' })}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Global Network Info */}
            {filteredChurches.length > 0 && !error && (
              <div className="mt-5 p-4 bg-light rounded">
                <h4>{t('our_global_network', { defaultValue: 'Our Global Network' })}</h4>
                <p className="mb-3">
                  {t('global_network_description', { defaultValue: 'The Church of God of Prophecy has churches and missions worldwide. If you don\'t see a church near you, we may still have a congregation in your area.' })}
                </p>
                <div className="row text-center">
                  <div className="col-6 col-md-3">
                    <div className="h5 text-primary mb-1">{churches.length}+</div>
                    <div className="small text-muted">{t('churches_missions', { defaultValue: 'Churches & Missions' })}</div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="h5 text-primary mb-1">{new Set(churches.map(c => c.country)).size}+</div>
                    <div className="small text-muted">{t('countries', { defaultValue: 'Countries' })}</div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="h5 text-primary mb-1">{new Set(churches.map(c => c.state)).size}+</div>
                    <div className="small text-muted">{t('states_provinces', { defaultValue: 'States/Provinces' })}</div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="h5 text-primary mb-1">{new Set(churches.map(c => c.city)).size}+</div>
                    <div className="small text-muted">{t('cities', { defaultValue: 'Cities' })}</div>
                  </div>
                </div>
              </div>
            )}

            {/* What to Expect Section */}
            <div className="mt-5 p-4 border rounded">
              <h4>{t('what_to_expect_at_churches', { defaultValue: 'What to Expect at Our Churches' })}</h4>
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      {t('spirit_led_worship_teaching', { defaultValue: 'Spirit-led worship and biblical teaching' })}
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      {t('warm_welcoming_fellowship', { defaultValue: 'Warm, welcoming fellowship' })}
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      {t('opportunities_spiritual_growth', { defaultValue: 'Opportunities for spiritual growth' })}
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      {t('community_outreach_missions', { defaultValue: 'Community outreach and missions' })}
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      {t('programs_for_all_ages', { defaultValue: 'Programs for all ages' })}
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      {t('diverse_multicultural_community', { defaultValue: 'Diverse, multicultural community' })}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
