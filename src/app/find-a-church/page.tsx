'use client'

import { useState, useEffect } from 'react'
import { getPageContent } from '@/contexts/ContentContext'
import PageLayout from '@/components/PageLayout'

// Sample church data - in a real app, this would come from an API/database
const sampleChurches = [
  {
    id: 1,
    name: 'Cleveland Church of God of Prophecy',
    address: '3720 Keith Street NW, Cleveland, TN 37312',
    phone: '(423) 559-5100',
    email: 'info@cogop.org',
    pastor: 'Rev. John Smith',
    servicesTimes: {
      sunday: 'Sunday: 10:00 AM & 6:00 PM',
      wednesday: 'Wednesday: 7:00 PM'
    },
    programs: ['Youth Ministry', 'Children\'s Ministry', 'Bible Study', 'Prayer Group'],
    website: 'https://cogop.org',
    city: 'Cleveland',
    state: 'TN',
    country: 'United States',
    coordinates: { lat: 35.1595, lng: -84.8766 }
  },
  {
    id: 2,
    name: 'Atlanta Church of God of Prophecy',
    address: '1234 Peachtree Street, Atlanta, GA 30309',
    phone: '(404) 555-0123',
    email: 'atlanta@cogop.org',
    pastor: 'Rev. Mary Johnson',
    servicesTimes: {
      sunday: 'Sunday: 9:00 AM & 11:00 AM',
      wednesday: 'Wednesday: 7:30 PM'
    },
    programs: ['Youth Ministry', 'Children\'s Ministry', 'Senior Ministry', 'Music Ministry'],
    website: 'https://atlanta.cogop.org',
    city: 'Atlanta',
    state: 'GA',
    country: 'United States',
    coordinates: { lat: 33.7490, lng: -84.3880 }
  },
  {
    id: 3,
    name: 'Nashville Church of God of Prophecy',
    address: '567 Music Row, Nashville, TN 37203',
    phone: '(615) 555-0456',
    email: 'nashville@cogop.org',
    pastor: 'Rev. David Williams',
    servicesTimes: {
      sunday: 'Sunday: 10:30 AM & 6:00 PM',
      wednesday: 'Wednesday: 7:00 PM'
    },
    programs: ['Youth Ministry', 'Children\'s Ministry', 'Music Ministry', 'Outreach'],
    website: 'https://nashville.cogop.org',
    city: 'Nashville',
    state: 'TN',
    country: 'United States',
    coordinates: { lat: 36.1627, lng: -86.7816 }
  },
  {
    id: 4,
    name: 'Miami Church of God of Prophecy',
    address: '890 Ocean Drive, Miami, FL 33139',
    phone: '(305) 555-0789',
    email: 'miami@cogop.org',
    pastor: 'Rev. Carlos Rodriguez',
    servicesTimes: {
      sunday: 'Sunday: 9:00 AM & 11:00 AM (English), 1:00 PM (Spanish)',
      wednesday: 'Wednesday: 7:00 PM'
    },
    programs: ['Youth Ministry', 'Children\'s Ministry', 'Spanish Ministry', 'Community Outreach'],
    website: 'https://miami.cogop.org',
    city: 'Miami',
    state: 'FL',
    country: 'United States',
    coordinates: { lat: 25.7617, lng: -80.1918 }
  },
  {
    id: 5,
    name: 'Toronto Church of God of Prophecy',
    address: '123 Yonge Street, Toronto, ON M5C 1W4',
    phone: '(416) 555-0321',
    email: 'toronto@cogop.org',
    pastor: 'Rev. Sarah Thompson',
    servicesTimes: {
      sunday: 'Sunday: 10:00 AM & 6:00 PM',
      wednesday: 'Wednesday: 7:30 PM'
    },
    programs: ['Youth Ministry', 'Children\'s Ministry', 'International Ministry', 'Bible Study'],
    website: 'https://toronto.cogop.org',
    city: 'Toronto',
    state: 'ON',
    country: 'Canada',
    coordinates: { lat: 43.6532, lng: -79.3832 }
  },
  {
    id: 6,
    name: 'Phoenix Church of God of Prophecy',
    address: '456 Desert View Drive, Phoenix, AZ 85001',
    phone: '(602) 555-0987',
    email: 'phoenix@cogop.org',
    pastor: 'Rev. Michael Davis',
    servicesTimes: {
      sunday: 'Sunday: 9:30 AM & 6:30 PM',
      wednesday: 'Wednesday: 7:00 PM'
    },
    programs: ['Youth Ministry', 'Children\'s Ministry', 'Men\'s Ministry', 'Women\'s Ministry'],
    website: 'https://phoenix.cogop.org',
    city: 'Phoenix',
    state: 'AZ',
    country: 'United States',
    coordinates: { lat: 33.4484, lng: -112.0740 }
  },
  {
    id: 7,
    name: 'London Church of God of Prophecy',
    address: '789 Westminster Road, London, UK SW1A 1AA',
    phone: '+44 20 7946 0958',
    email: 'london@cogop.org',
    pastor: 'Rev. James Wilson',
    servicesTimes: {
      sunday: 'Sunday: 10:00 AM & 6:00 PM',
      wednesday: 'Wednesday: 7:30 PM'
    },
    programs: ['Youth Ministry', 'Children\'s Ministry', 'International Ministry', 'Community Service'],
    website: 'https://london.cogop.org',
    city: 'London',
    state: 'England',
    country: 'United Kingdom',
    coordinates: { lat: 51.5074, lng: -0.1278 }
  },
  {
    id: 8,
    name: 'São Paulo Igreja de Deus da Profecia',
    address: 'Rua da Consolação, 1000, São Paulo, SP 01302-000',
    phone: '+55 11 3456-7890',
    email: 'saopaulo@cogop.org',
    pastor: 'Rev. Ana Silva',
    servicesTimes: {
      sunday: 'Domingo: 9:00 & 18:00',
      wednesday: 'Quarta-feira: 19:30'
    },
    programs: ['Ministério Jovem', 'Ministério Infantil', 'Escola Bíblica', 'Ação Social'],
    website: 'https://saopaulo.cogop.org',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brazil',
    coordinates: { lat: -23.5505, lng: -46.6333 }
  }
]

interface Church {
  id: number
  name: string
  address: string
  phone: string
  email: string
  pastor: string
  servicesTimes: {
    sunday: string
    wednesday: string
  }
  programs: string[]
  website: string
  city: string
  state: string
  country: string
  coordinates: { lat: number; lng: number }
}

export default function FindaChurchPage() {
  const pageContent = getPageContent('find-a-church')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredChurches, setFilteredChurches] = useState<Church[]>(sampleChurches)
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Get all unique programs for filtering
  const allPrograms = Array.from(new Set(sampleChurches.flatMap(church => church.programs)))

  useEffect(() => {
    filterChurches()
  }, [searchTerm, selectedPrograms])

  const filterChurches = () => {
    setIsLoading(true)
    
    // Simulate API delay
    setTimeout(() => {
      let filtered = sampleChurches

      // Filter by search term (city, state, country, or church name)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase()
        filtered = filtered.filter(church => 
          church.city.toLowerCase().includes(term) ||
          church.state.toLowerCase().includes(term) ||
          church.country.toLowerCase().includes(term) ||
          church.name.toLowerCase().includes(term) ||
          church.address.toLowerCase().includes(term)
        )
      }

      // Filter by selected programs
      if (selectedPrograms.length > 0) {
        filtered = filtered.filter(church =>
          selectedPrograms.every(program => church.programs.includes(program))
        )
      }

      setFilteredChurches(filtered)
      setIsLoading(false)
    }, 500)
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
      <div className="container-fluid">
        <div className="row">
          {/* Search and Filters Sidebar */}
          <div className="col-lg-4 col-xl-3 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-search me-2"></i>
                  Search Churches
                </h5>
              </div>
              <div className="card-body">
                {/* Location Search */}
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="mb-3">
                    <label htmlFor="location" className="form-label">
                      Enter City, State, or Country
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="location"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="e.g., Cleveland, TN or United States"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Searching...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-search me-2"></i>
                        Search Churches
                      </>
                    )}
                  </button>
                </form>

                {/* Program Filters */}
                <div className="mb-4">
                  <h6 className="mb-3">Filter by Programs</h6>
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
                    Clear Filters
                  </button>
                )}

                {/* Contact Info */}
                <hr />
                <div className="mt-4">
                  <h6>Need Help?</h6>
                  <p className="small text-muted mb-2">
                    Can't find a church near you? Contact us for assistance.
                  </p>
                  <p className="small">
                    <strong>Phone:</strong> (423) 559-5100<br />
                    <strong>Email:</strong> info@cogop.org
                  </p>
                  <a href="/get-connected/contact" className="btn btn-outline-primary btn-sm">
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Church Results */}
          <div className="col-lg-8 col-xl-9">
            {/* Results Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>
                {isLoading ? 'Searching...' : `Found ${filteredChurches.length} Churches`}
                {searchTerm && (
                  <small className="text-muted ms-2">
                    for "{searchTerm}"
                  </small>
                )}
              </h3>
              {filteredChurches.length > 0 && (
                <div className="text-muted">
                  <i className="bi bi-geo-alt me-1"></i>
                  Showing results worldwide
                </div>
              )}
            </div>

            {/* Church Cards */}
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Searching for churches...</p>
              </div>
            ) : filteredChurches.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-search display-1 text-muted mb-3"></i>
                <h4>No Churches Found</h4>
                <p className="text-muted mb-4">
                  We couldn't find any churches matching your search criteria.
                  Try adjusting your search terms or contact us for assistance.
                </p>
                <button
                  className="btn btn-primary me-2"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
                <a href="/get-connected/contact" className="btn btn-outline-primary">
                  Contact Us
                </a>
              </div>
            ) : (
              <div className="row">
                {filteredChurches.map(church => (
                  <div key={church.id} className="col-12 mb-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-8">
                            <h5 className="card-title text-primary">
                              <i className="bi bi-house-heart me-2"></i>
                              {church.name}
                            </h5>
                            
                            <div className="mb-3">
                              <p className="mb-1">
                                <i className="bi bi-geo-alt text-muted me-2"></i>
                                {church.address}
                              </p>
                              <p className="mb-1">
                                <i className="bi bi-telephone text-muted me-2"></i>
                                <a href={`tel:${church.phone}`} className="text-decoration-none">
                                  {church.phone}
                                </a>
                              </p>
                              <p className="mb-1">
                                <i className="bi bi-envelope text-muted me-2"></i>
                                <a href={`mailto:${church.email}`} className="text-decoration-none">
                                  {church.email}
                                </a>
                              </p>
                              <p className="mb-0">
                                <i className="bi bi-person text-muted me-2"></i>
                                Pastor: {church.pastor}
                              </p>
                            </div>

                            <div className="mb-3">
                              <h6 className="text-muted mb-2">Service Times</h6>
                              <p className="small mb-1">{church.servicesTimes.sunday}</p>
                              <p className="small mb-0">{church.servicesTimes.wednesday}</p>
                            </div>

                            <div className="mb-3">
                              <h6 className="text-muted mb-2">Programs & Ministries</h6>
                              <div className="d-flex flex-wrap gap-1">
                                {church.programs.map(program => (
                                  <span key={program} className="badge bg-light text-dark border">
                                    {program}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="col-md-4 text-md-end">
                            <div className="d-grid gap-2">
                              <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(church.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline-primary btn-sm"
                              >
                                <i className="bi bi-map me-1"></i>
                                Get Directions
                              </a>
                              {church.website && (
                                <a
                                  href={church.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-outline-secondary btn-sm"
                                >
                                  <i className="bi bi-globe me-1"></i>
                                  Visit Website
                                </a>
                              )}
                              <a
                                href={`tel:${church.phone}`}
                                className="btn btn-primary btn-sm"
                              >
                                <i className="bi bi-telephone me-1"></i>
                                Call Church
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
            {filteredChurches.length > 0 && (
              <div className="mt-5 p-4 bg-light rounded">
                <h4>Our Global Network</h4>
                <p className="mb-3">
                  The Church of God of Prophecy has over 12,000 churches and missions 
                  in 135 countries worldwide. If you don't see a church near you, 
                  we may still have a congregation in your area.
                </p>
                <div className="row text-center">
                  <div className="col-6 col-md-3">
                    <div className="h5 text-primary mb-1">12,000+</div>
                    <div className="small text-muted">Churches & Missions</div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="h5 text-primary mb-1">135+</div>
                    <div className="small text-muted">Countries</div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="h5 text-primary mb-1">1.5M+</div>
                    <div className="small text-muted">Members</div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="h5 text-primary mb-1">100+</div>
                    <div className="small text-muted">Years of Ministry</div>
                  </div>
                </div>
              </div>
            )}

            {/* What to Expect Section */}
            <div className="mt-5 p-4 border rounded">
              <h4>What to Expect at Our Churches</h4>
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Spirit-led worship and biblical teaching
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Warm, welcoming fellowship
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Opportunities for spiritual growth
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Community outreach and missions
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Programs for all ages
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Diverse, multicultural community
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
