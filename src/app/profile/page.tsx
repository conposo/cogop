'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      await updateProfile(user, {
        displayName: displayName
      });
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(user?.displayName || '');
    setIsEditing(false);
    setError('');
    setMessage('');
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title mb-0">My Profile</h2>
            </div>
            <div className="card-body">
              {message && (
                <div className="alert alert-success" role="alert">
                  {message}
                </div>
              )}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="text-center mb-4">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: '100px', height: '100px' }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto"
                    style={{ width: '100px', height: '100px', fontSize: '2rem' }}
                  >
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={user.email || ''}
                  disabled
                />
                <div className="form-text">Email cannot be changed</div>
              </div>

              <div className="mb-3">
                <label className="form-label">Display Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    value={user.displayName || 'Not set'}
                    disabled
                  />
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Account Created</label>
                <input
                  type="text"
                  className="form-control"
                  value={user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Last Sign In</label>
                <input
                  type="text"
                  className="form-control"
                  value={user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'Unknown'}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email Verified</label>
                <div className="form-control d-flex align-items-center">
                  {user.emailVerified ? (
                    <span className="text-success">
                      <i className="bi bi-check-circle me-2"></i>
                      Verified
                    </span>
                  ) : (
                    <span className="text-warning">
                      <i className="bi bi-exclamation-circle me-2"></i>
                      Not verified
                    </span>
                  )}
                </div>
              </div>

              <div className="d-flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 