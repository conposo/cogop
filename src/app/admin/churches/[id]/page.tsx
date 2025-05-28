'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useChurchUser } from '@/contexts/ChurchUserContext';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export default function ChurchDetails() {
  const { adminData } = useAdmin();
  const { churchUsers, getChurchUsers } = useChurchUser();
  const params = useParams();
  const router = useRouter();
  const [church, setChurch] = useState<Church | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const churchId = params.id as string;
  const isSuperAdmin = adminData?.role === 'super_admin';

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
    if (!isSuperAdmin) {
      return;
    }
    fetchChurch();
    fetchChurchUsers();
  }, [churchId, isSuperAdmin]);

  const fetchChurch = async () => {
    try {
      const churchDoc = await getDoc(doc(db, 'churches', churchId));
      if (churchDoc.exists()) {
        const data = churchDoc.data();
        setChurch({
          id: churchDoc.id,
          ...data,
          servicesTimes: migrateServicesTimes(data.servicesTimes)
        } as Church);
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

  const fetchChurchUsers = async () => {
    try {
      await getChurchUsers(churchId);
    } catch (error) {
      console.error('Error fetching church users:', error);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="alert alert-warning">
        <h4>Access Denied</h4>
        <p>Only Super Admins can view church details.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !church) {
    return (
      <div className="alert alert-danger">
        <h4>Error</h4>
        <p>{error || 'Church not found'}</p>
        <Link href="/admin/churches" className="btn btn-primary">
          Back to Churches
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/admin">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/admin/churches">Churches</Link>
              </li>
              <li className="breadcrumb-item active">{church.name}</li>
            </ol>
          </nav>
          <h1>{church.name}</h1>
        </div>
        <div>
          <Link href="/admin/churches" className="btn btn-secondary me-2">
            <i className="bi bi-arrow-left me-2"></i>
            Back to Churches
          </Link>
          <button 
            className="btn btn-primary"
            onClick={() => router.push(`/admin/churches?edit=${church.id}`)}
          >
            <i className="bi bi-pencil me-2"></i>
            Edit Church
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-building me-2"></i>
                Church Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Address:</strong> {church.address}</p>
                  <p><strong>City:</strong> {church.city}</p>
                  <p><strong>State:</strong> {church.state}</p>
                  <p><strong>Zip Code:</strong> {church.zipCode}</p>
                  <p><strong>Country:</strong> {church.country}</p>
                  <p><strong>Status:</strong> 
                    <span className={`badge ms-2 ${church.isActive ? 'bg-success' : 'bg-secondary'}`}>
                      {church.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
                <div className="col-md-6">
                  {church.phone && (
                    <p><strong>Phone:</strong> 
                      <a href={`tel:${church.phone}`} className="text-decoration-none ms-2">
                        {church.phone}
                      </a>
                    </p>
                  )}
                  {church.email && (
                    <p><strong>Email:</strong> 
                      <a href={`mailto:${church.email}`} className="text-decoration-none ms-2">
                        {church.email}
                      </a>
                    </p>
                  )}
                  {church.website && (
                    <p><strong>Website:</strong> 
                      <a 
                        href={church.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-decoration-none ms-2"
                      >
                        Visit Website
                        <i className="bi bi-box-arrow-up-right ms-1"></i>
                      </a>
                    </p>
                  )}
                  {church.pastor && <p><strong>Pastor:</strong> {church.pastor}</p>}
                  {church.denomination && <p><strong>Denomination:</strong> {church.denomination}</p>}
                </div>
              </div>

              {(church.servicesTimes.length > 0) && (
                <div className="mt-4">
                  <h5>Service Times</h5>
                  <div className="row">
                    {church.servicesTimes.map((service, index) => (
                      <div key={index} className="col-md-6">
                        <p><strong>{service.day}:</strong> {service.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {church.programs.length > 0 && (
                <div className="mt-4">
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

              {church.coordinates && (church.coordinates.lat !== 0 || church.coordinates.lng !== 0) && (
                <div className="mt-4">
                  <h5>Location Coordinates</h5>
                  <p><strong>Latitude:</strong> {church.coordinates.lat}</p>
                  <p><strong>Longitude:</strong> {church.coordinates.lng}</p>
                  <a 
                    href={`https://maps.google.com/?q=${church.coordinates.lat},${church.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary"
                  >
                    <i className="bi bi-geo-alt me-1"></i>
                    View on Map
                  </a>
                </div>
              )}

              {church.description && (
                <div className="mt-4">
                  <h5>Description</h5>
                  <div className="card bg-light">
                    <div className="card-body">
                      <p className="mb-0">{church.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Metadata
              </h5>
            </div>
            <div className="card-body">
              <table className="table table-borderless table-sm">
                <tbody>
                  <tr>
                    <td><strong>Created:</strong></td>
                    <td>{church.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}</td>
                  </tr>
                  <tr>
                    <td><strong>Created By:</strong></td>
                    <td>{church.createdBy || 'Unknown'}</td>
                  </tr>
                  {church.updatedAt && (
                    <>
                      <tr>
                        <td><strong>Last Updated:</strong></td>
                        <td>{church.updatedAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}</td>
                      </tr>
                      <tr>
                        <td><strong>Updated By:</strong></td>
                        <td>{church.updatedBy || 'Unknown'}</td>
                      </tr>
                    </>
                  )}
                  <tr>
                    <td><strong>Church ID:</strong></td>
                    <td>
                      <code className="small">{church.id}</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-people me-2"></i>
                Church Users
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Total Users:</span>
                <span className="badge bg-primary">{churchUsers.length}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Active Users:</span>
                <span className="badge bg-success">
                  {churchUsers.filter(u => u.isActive).length}
                </span>
              </div>
              
              {churchUsers.length > 0 && (
                <div className="mt-3">
                  <small className="text-muted">Roles:</small>
                  <div className="d-flex flex-wrap gap-1 mt-1">
                    {['admin', 'manager', 'editor', 'member'].map(role => {
                      const count = churchUsers.filter(u => u.role === role).length;
                      if (count === 0) return null;
                      
                      const badgeClass = role === 'admin' ? 'bg-danger' : 
                                       role === 'manager' ? 'bg-warning' :
                                       role === 'editor' ? 'bg-info' : 'bg-secondary';
                      
                      return (
                        <span key={role} className={`badge ${badgeClass}`}>
                          {role}: {count}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="d-grid mt-3">
                <Link 
                  href={`/admin/churches/${church.id}/users`}
                  className="btn btn-outline-primary btn-sm"
                >
                  <i className="bi bi-people me-2"></i>
                  Manage Users
                </Link>
              </div>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-gear me-2"></i>
                Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={() => router.push(`/admin/churches?edit=${church.id}`)}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Edit Church
                </button>
                <button 
                  className="btn btn-outline-danger"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${church.name}"? This action cannot be undone.`)) {
                      // Handle delete - redirect to churches page with delete action
                      router.push(`/admin/churches?delete=${church.id}`);
                    }
                  }}
                >
                  <i className="bi bi-trash me-2"></i>
                  Delete Church
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 