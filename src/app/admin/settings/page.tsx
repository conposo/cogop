'use client';

import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminSettings() {
  const { user } = useAuth();
  const { adminData } = useAdmin();
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Settings</h1>
      </div>

      {/* Settings Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            System Info
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
        </li>
      </ul>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="row">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">General Settings</h5>
              </div>
              <div className="card-body">
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  General settings will be implemented in future updates. This section will include
                  website configuration, email settings, and other global preferences.
                </div>
                
                <h6>Current Configuration</h6>
                <ul className="list-unstyled">
                  <li><strong>Website Name:</strong> Church of God of Prophecy</li>
                  <li><strong>Environment:</strong> {process.env.NODE_ENV}</li>
                  <li><strong>Firebase Project:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-primary" disabled>
                    <i className="bi bi-gear me-2"></i>
                    Site Configuration
                  </button>
                  <button className="btn btn-outline-secondary" disabled>
                    <i className="bi bi-envelope me-2"></i>
                    Email Settings
                  </button>
                  <button className="btn btn-outline-info" disabled>
                    <i className="bi bi-palette me-2"></i>
                    Theme Settings
                  </button>
                </div>
                <small className="text-muted mt-2 d-block">
                  These features will be available in future updates.
                </small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Info */}
      {activeTab === 'system' && (
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">System Information</h5>
              </div>
              <div className="card-body">
                <table className="table table-sm">
                  <tbody>
                    <tr>
                      <td><strong>Next.js Version:</strong></td>
                      <td>15.3.2</td>
                    </tr>
                    <tr>
                      <td><strong>React Version:</strong></td>
                      <td>18.x</td>
                    </tr>
                    <tr>
                      <td><strong>Firebase SDK:</strong></td>
                      <td>Latest</td>
                    </tr>
                    <tr>
                      <td><strong>Environment:</strong></td>
                      <td>{process.env.NODE_ENV}</td>
                    </tr>
                    <tr>
                      <td><strong>Build Time:</strong></td>
                      <td>{new Date().toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Firebase Configuration</h5>
              </div>
              <div className="card-body">
                <table className="table table-sm">
                  <tbody>
                    <tr>
                      <td><strong>Project ID:</strong></td>
                      <td><code>{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</code></td>
                    </tr>
                    <tr>
                      <td><strong>Auth Domain:</strong></td>
                      <td><code>{process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}</code></td>
                    </tr>
                    <tr>
                      <td><strong>Storage Bucket:</strong></td>
                      <td><code>{process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}</code></td>
                    </tr>
                    <tr>
                      <td><strong>Authentication:</strong></td>
                      <td><span className="badge bg-success">Enabled</span></td>
                    </tr>
                    <tr>
                      <td><strong>Firestore:</strong></td>
                      <td><span className="badge bg-success">Enabled</span></td>
                    </tr>
                    <tr>
                      <td><strong>Storage:</strong></td>
                      <td><span className="badge bg-success">Enabled</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="row">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Security Settings</h5>
              </div>
              <div className="card-body">
                <h6>Current Admin User</h6>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <strong>User ID:</strong><br />
                    <code>{user?.uid}</code>
                  </div>
                  <div className="col-md-6">
                    <strong>Email:</strong><br />
                    {user?.email}
                  </div>
                  <div className="col-md-6 mt-2">
                    <strong>Role:</strong><br />
                    <span className={`badge ${adminData?.role === 'super_admin' ? 'bg-danger' : 'bg-primary'}`}>
                      {adminData?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </span>
                  </div>
                  <div className="col-md-6 mt-2">
                    <strong>Permissions:</strong><br />
                    {adminData?.permissions?.map(permission => (
                      <span key={permission} className="badge bg-secondary me-1">
                        {permission}
                      </span>
                    )) || <span className="text-muted">All</span>}
                  </div>
                </div>

                <h6>Security Recommendations</h6>
                <div className="alert alert-warning">
                  <h6 className="alert-heading">Important Security Notes:</h6>
                  <ul className="mb-0">
                    <li>Regularly review admin user access in the User Management section</li>
                    <li>Ensure Firebase Security Rules are properly configured</li>
                    <li>Monitor authentication logs in the Firebase Console</li>
                    <li>Use strong passwords and enable 2FA on Firebase accounts</li>
                    <li>Regularly update Firebase SDK and dependencies</li>
                  </ul>
                </div>

                <h6>Firebase Security Rules Status</h6>
                <div className="row">
                  <div className="col-md-6">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h6>Firestore Rules</h6>
                        <i className="bi bi-shield-check fs-1 text-success"></i>
                        <p className="mb-0 small">Check Firebase Console</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h6>Storage Rules</h6>
                        <i className="bi bi-shield-check fs-1 text-success"></i>
                        <p className="mb-0 small">Check Firebase Console</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Security Actions</h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <a 
                    href={`https://console.firebase.google.com/project/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/authentication/users`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary"
                  >
                    <i className="bi bi-box-arrow-up-right me-2"></i>
                    Firebase Auth Console
                  </a>
                  <a 
                    href={`https://console.firebase.google.com/project/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/firestore`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-secondary"
                  >
                    <i className="bi bi-box-arrow-up-right me-2"></i>
                    Firestore Console
                  </a>
                  <a 
                    href={`https://console.firebase.google.com/project/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/storage`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-info"
                  >
                    <i className="bi bi-box-arrow-up-right me-2"></i>
                    Storage Console
                  </a>
                </div>
              </div>
            </div>

            <div className="card mt-3">
              <div className="card-header">
                <h5 className="card-title mb-0">Documentation</h5>
              </div>
              <div className="card-body">
                <ul className="list-unstyled">
                  <li>
                    <a href="/FIREBASE_SETUP.md" target="_blank" className="text-decoration-none">
                      <i className="bi bi-file-text me-2"></i>
                      Firebase Setup Guide
                    </a>
                  </li>
                  <li className="mt-2">
                    <a href="https://firebase.google.com/docs/rules" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                      <i className="bi bi-box-arrow-up-right me-2"></i>
                      Security Rules Docs
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 