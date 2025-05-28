'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { sampleChurches } from '@/utils/sampleChurches';

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

interface ChurchFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  pastor: string;
  denomination: string;
  description: string;
  servicesTimes: {
    day: string;
    time: string;
  }[];
  programs: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  isActive: boolean;
}

const initialFormData: ChurchFormData = {
  name: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  phone: '',
  email: '',
  website: '',
  pastor: '',
  denomination: '',
  description: '',
  servicesTimes: [
    { day: 'Sunday', time: '' },
    { day: 'Wednesday', time: '' }
  ],
  programs: [],
  coordinates: {
    lat: 0,
    lng: 0
  },
  isActive: true
};

export default function ChurchesManagement() {
  const { adminData } = useAdmin();
  const { user } = useAuth();
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingChurch, setEditingChurch] = useState<Church | null>(null);
  const [formData, setFormData] = useState<ChurchFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if user is super admin
  const isSuperAdmin = adminData?.role === 'super_admin';

  useEffect(() => {
    if (!isSuperAdmin) {
      return;
    }
    fetchChurches();
  }, [isSuperAdmin]);

  useEffect(() => {
    // Handle URL parameters for edit and delete operations
    const editId = searchParams.get('edit');
    const deleteId = searchParams.get('delete');

    if (editId && churches.length > 0) {
      const churchToEdit = churches.find(c => c.id === editId);
      if (churchToEdit) {
        handleEdit(churchToEdit);
        // Clear the URL parameter
        router.replace('/admin/churches');
      }
    }

    if (deleteId && churches.length > 0) {
      const churchToDelete = churches.find(c => c.id === deleteId);
      if (churchToDelete) {
        handleDelete(churchToDelete);
        // Clear the URL parameter
        router.replace('/admin/churches');
      }
    }
  }, [searchParams, churches, router]);

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
    
    return [{ day: 'Sunday', time: '' }, { day: 'Wednesday', time: '' }];
  };

  const fetchChurches = async () => {
    try {
      const churchesQuery = query(
        collection(db, 'churches'),
        orderBy('name', 'asc')
      );
      const snapshot = await getDocs(churchesQuery);
      const churchesData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          servicesTimes: migrateServicesTimes(data.servicesTimes)
        };
      }) as Church[];
      setChurches(churchesData);
    } catch (error) {
      console.error('Error fetching churches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects like coordinates.lat
      const [parent, child] = name.split('.');
      if (parent === 'coordinates') {
        setFormData(prev => ({
          ...prev,
          coordinates: {
            ...prev.coordinates,
            [child]: parseFloat(value) || 0
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const addServiceTime = () => {
    setFormData(prev => ({
      ...prev,
      servicesTimes: [...prev.servicesTimes, { day: '', time: '' }]
    }));
  };

  const removeServiceTime = (index: number) => {
    setFormData(prev => ({
      ...prev,
      servicesTimes: prev.servicesTimes.filter((_, i) => i !== index)
    }));
  };

  const updateServiceTime = (index: number, field: 'day' | 'time', value: string) => {
    setFormData(prev => ({
      ...prev,
      servicesTimes: prev.servicesTimes.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const churchData = {
        ...formData,
        updatedAt: Timestamp.fromDate(new Date()),
        updatedBy: user.uid
      };

      if (editingChurch) {
        // Update existing church
        await updateDoc(doc(db, 'churches', editingChurch.id), churchData);
      } else {
        // Add new church
        await addDoc(collection(db, 'churches'), {
          ...churchData,
          createdAt: Timestamp.fromDate(new Date()),
          createdBy: user.uid
        });
      }

      setShowModal(false);
      setEditingChurch(null);
      setFormData(initialFormData);
      fetchChurches();
    } catch (error) {
      console.error('Error saving church:', error);
      alert('Error saving church. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (church: Church) => {
    setEditingChurch(church);
    setFormData({
      name: church.name,
      address: church.address,
      city: church.city,
      state: church.state,
      zipCode: church.zipCode,
      country: church.country,
      phone: church.phone || '',
      email: church.email || '',
      website: church.website || '',
      pastor: church.pastor || '',
      denomination: church.denomination || '',
      description: church.description || '',
      servicesTimes: migrateServicesTimes(church.servicesTimes),
      programs: church.programs,
      coordinates: church.coordinates || { lat: 0, lng: 0 },
      isActive: church.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (church: Church) => {
    if (!confirm(`Are you sure you want to delete "${church.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'churches', church.id));
      fetchChurches();
    } catch (error) {
      console.error('Error deleting church:', error);
      alert('Error deleting church. Please try again.');
    }
  };

  const openAddModal = () => {
    setEditingChurch(null);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const handleImport = async () => {
    if (!user || !importData.trim()) return;

    setImporting(true);
    try {
      const churchesToImport = JSON.parse(importData);
      
      if (!Array.isArray(churchesToImport)) {
        alert('Invalid JSON format. Please provide an array of churches.');
        return;
      }

      if (churchesToImport.length === 0) {
        alert('No churches found in the provided data.');
        return;
      }

      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      for (const [index, churchData] of churchesToImport.entries()) {
        try {
          // Validate required fields
          if (!churchData.name || !churchData.address || !churchData.city || !churchData.state) {
            errors.push(`Church ${index + 1}: Missing required fields (name, address, city, state)`);
            errorCount++;
            continue;
          }

          // Convert old servicesTimes format to new array format
          let servicesTimes = [];
          if (churchData.servicesTimes) {
            if (Array.isArray(churchData.servicesTimes)) {
              servicesTimes = churchData.servicesTimes;
            } else if (typeof churchData.servicesTimes === 'object') {
              // Handle old format with sunday/wednesday properties
              if (churchData.servicesTimes.sunday) {
                servicesTimes.push({ day: 'Sunday', time: churchData.servicesTimes.sunday });
              }
              if (churchData.servicesTimes.wednesday) {
                servicesTimes.push({ day: 'Wednesday', time: churchData.servicesTimes.wednesday });
              }
            }
          }

          const church = {
            name: churchData.name.trim(),
            address: churchData.address.trim(),
            city: churchData.city.trim(),
            state: churchData.state.trim(),
            zipCode: churchData.zipCode?.toString().trim() || '',
            country: churchData.country?.trim() || 'United States',
            phone: churchData.phone?.trim() || '',
            email: churchData.email?.trim() || '',
            website: churchData.website?.trim() || '',
            pastor: churchData.pastor?.trim() || '',
            denomination: churchData.denomination?.trim() || '',
            description: churchData.description?.trim() || '',
            servicesTimes: servicesTimes,
            programs: Array.isArray(churchData.programs) ? churchData.programs.filter((p: string) => p && p.trim()) : [],
            coordinates: churchData.coordinates || { lat: 0, lng: 0 },
            isActive: churchData.isActive !== undefined ? churchData.isActive : true,
            createdAt: Timestamp.fromDate(new Date()),
            createdBy: user.uid,
            updatedAt: Timestamp.fromDate(new Date()),
            updatedBy: user.uid
          };

          await addDoc(collection(db, 'churches'), church);
          successCount++;
        } catch (error) {
          console.error('Error importing church:', churchData.name, error);
          errors.push(`Church ${index + 1} (${churchData.name || 'Unknown'}): ${error instanceof Error ? error.message : 'Unknown error'}`);
          errorCount++;
        }
      }

      let message = `Import completed!\nSuccessfully imported: ${successCount} churches\nErrors: ${errorCount} churches`;
      
      if (errors.length > 0 && errors.length <= 5) {
        message += '\n\nErrors:\n' + errors.join('\n');
      } else if (errors.length > 5) {
        message += '\n\nFirst 5 errors:\n' + errors.slice(0, 5).join('\n') + '\n... and more';
      }

      alert(message);
      
      if (successCount > 0) {
        fetchChurches();
      }
      
      setShowImportModal(false);
      setImportData('');
    } catch (error) {
      console.error('Error parsing JSON:', error);
      alert('Invalid JSON format. Please check your data and try again.\n\nError: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setImporting(false);
    }
  };

  const loadSampleData = () => {
    setImportData(JSON.stringify(sampleChurches, null, 2));
  };

  if (!isSuperAdmin) {
    return (
      <div className="alert alert-warning">
        <h4>Access Denied</h4>
        <p>Only Super Admins can manage churches.</p>
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

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Churches Management</h1>
        <div>
          <button 
            className="btn btn-outline-secondary me-2"
            onClick={() => setShowImportModal(true)}
          >
            <i className="bi bi-upload me-2"></i>
            Import Churches
          </button>
          <button 
            className="btn btn-primary"
            onClick={openAddModal}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add New Church
          </button>
        </div>
      </div>

      {/* Churches Table */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">All Churches ({churches.length})</h5>
        </div>
        <div className="card-body">
          {churches.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-building fs-1 text-muted"></i>
              <p className="text-muted mt-2">No churches found. Add your first church to get started.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Pastor</th>
                    <th>Denomination</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {churches.map((church) => (
                    <tr key={church.id}>
                      <td>
                        <div>
                          <Link 
                            href={`/admin/churches/${church.id}`}
                            className="text-decoration-none"
                          >
                            <strong>{church.name}</strong>
                          </Link>
                          {church.phone && (
                            <div className="small text-muted">
                              <i className="bi bi-telephone me-1"></i>
                              {church.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="small">
                          {church.address}<br />
                          {church.city}, {church.state} {church.zipCode}
                        </div>
                      </td>
                      <td>{church.pastor || '-'}</td>
                      <td>{church.denomination || '-'}</td>
                      <td>
                        <span className={`badge ${church.isActive ? 'bg-success' : 'bg-secondary'}`}>
                          {church.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link
                            href={`/admin/churches/${church.id}`}
                            className="btn btn-outline-info"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleEdit(church)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(church)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingChurch ? 'Edit Church' : 'Add New Church'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Church Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Pastor</label>
                      <input
                        type="text"
                        className="form-control"
                        name="pastor"
                        value={formData.pastor}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Address *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">State *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Zip Code *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Website</label>
                      <input
                        type="url"
                        className="form-control"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Denomination</label>
                      <input
                        type="text"
                        className="form-control"
                        name="denomination"
                        value={formData.denomination}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Service Times Management */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <label className="form-label mb-0">Service Times</label>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={addServiceTime}
                      >
                        <i className="bi bi-plus me-1"></i>
                        Add Service
                      </button>
                    </div>
                    
                    {formData.servicesTimes.map((service, index) => (
                      <div key={index} className="row mb-2">
                        <div className="col-md-4">
                          <select
                            className="form-select"
                            value={service.day}
                            onChange={(e) => updateServiceTime(index, 'day', e.target.value)}
                          >
                            <option value="">Select Day</option>
                            <option value="Sunday">Sunday</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g., 10:00 AM & 6:00 PM"
                            value={service.time}
                            onChange={(e) => updateServiceTime(index, 'time', e.target.value)}
                          />
                        </div>
                        <div className="col-md-2">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeServiceTime(index)}
                            disabled={formData.servicesTimes.length <= 1}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Programs & Ministries</label>
                      <input
                        type="text"
                        className="form-control"
                        name="programs"
                        value={formData.programs.join(', ')}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          programs: e.target.value.split(',').map(p => p.trim()).filter(p => p)
                        }))}
                        placeholder="e.g., Youth Ministry, Children's Ministry, Bible Study"
                      />
                      <div className="form-text">Separate multiple programs with commas</div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Latitude (Optional)</label>
                      <input
                        type="number"
                        step="any"
                        className="form-control"
                        name="coordinates.lat"
                        value={formData.coordinates.lat || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., 35.1595"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Longitude (Optional)</label>
                      <input
                        type="number"
                        step="any"
                        className="form-control"
                        name="coordinates.lng"
                        value={formData.coordinates.lng || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., -84.8766"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Brief description of the church..."
                    ></textarea>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label">
                      Active Church
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      editingChurch ? 'Update Church' : 'Add Church'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Import Churches</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowImportModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <p className="text-muted">
                    Paste your JSON data below. The system will automatically convert old service times format to the new flexible format.
                  </p>
                  <p className="text-muted small">
                    <strong>Expected format:</strong> An array of church objects with fields like name, address, city, state, etc.
                  </p>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-info"
                    onClick={loadSampleData}
                  >
                    <i className="bi bi-file-text me-1"></i>
                    Load Sample Data
                  </button>
                </div>
                <div className="mb-3">
                  <label className="form-label">JSON Data</label>
                  <textarea
                    className="form-control"
                    rows={15}
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder='[
  {
    "name": "Sample Church",
    "address": "123 Main St",
    "city": "Cleveland",
    "state": "TN",
    "zipCode": "37312",
    "country": "United States",
    "phone": "(423) 555-0123",
    "email": "info@church.org",
    "pastor": "Rev. John Doe",
    "servicesTimes": {
      "sunday": "Sunday: 10:00 AM & 6:00 PM",
      "wednesday": "Wednesday: 7:00 PM"
    },
    "programs": ["Youth Ministry", "Bible Study"],
    "website": "https://church.org",
    "coordinates": { "lat": 35.1595, "lng": -84.8766 }
  }
]'
                  />
                </div>
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>Note:</strong> The import will automatically convert old servicesTimes format (sunday/wednesday) to the new flexible array format.
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowImportModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleImport}
                  disabled={importing || !importData.trim()}
                >
                  {importing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Importing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-upload me-2"></i>
                      Import Churches
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 