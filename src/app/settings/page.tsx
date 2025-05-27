'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updatePassword, sendEmailVerification, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !user.email) return;

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setChangingPassword(true);
    setError('');
    setMessage('');

    try {
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      
      setMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        setError('Current password is incorrect');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else {
        setError(error.message || 'Failed to update password');
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSendVerification = async () => {
    if (!user) return;

    setSendingVerification(true);
    setError('');
    setMessage('');

    try {
      await sendEmailVerification(user);
      setMessage('Verification email sent! Check your inbox.');
    } catch (error: any) {
      setError(error.message || 'Failed to send verification email');
    } finally {
      setSendingVerification(false);
    }
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

  const isGoogleUser = user.providerData.some(provider => provider.providerId === 'google.com');

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title mb-0">Account Settings</h2>
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

              {/* Email Verification Section */}
              <div className="mb-4">
                <h5>Email Verification</h5>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="fw-bold">{user.email}</div>
                    <small className={user.emailVerified ? 'text-success' : 'text-warning'}>
                      {user.emailVerified ? (
                        <>
                          <i className="bi bi-check-circle me-1"></i>
                          Verified
                        </>
                      ) : (
                        <>
                          <i className="bi bi-exclamation-circle me-1"></i>
                          Not verified
                        </>
                      )}
                    </small>
                  </div>
                  {!user.emailVerified && (
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={handleSendVerification}
                      disabled={sendingVerification}
                    >
                      {sendingVerification ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Sending...
                        </>
                      ) : (
                        'Send Verification'
                      )}
                    </button>
                  )}
                </div>
              </div>

              <hr />

              {/* Password Change Section */}
              {!isGoogleUser && (
                <>
                  <div className="mb-4">
                    <h5>Change Password</h5>
                    <form onSubmit={handlePasswordChange}>
                      <div className="mb-3">
                        <label htmlFor="currentPassword" className="form-label">Current Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="currentPassword"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          minLength={6}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          minLength={6}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={changingPassword}
                      >
                        {changingPassword ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Updating...
                          </>
                        ) : (
                          'Update Password'
                        )}
                      </button>
                    </form>
                  </div>

                  <hr />
                </>
              )}

              {/* Account Information */}
              <div className="mb-4">
                <h5>Account Information</h5>
                <div className="row">
                  <div className="col-sm-6 mb-2">
                    <strong>Account Type:</strong>
                  </div>
                  <div className="col-sm-6 mb-2">
                    {isGoogleUser ? (
                      <span className="badge bg-danger">
                        <i className="bi bi-google me-1"></i>
                        Google Account
                      </span>
                    ) : (
                      <span className="badge bg-primary">
                        <i className="bi bi-envelope me-1"></i>
                        Email Account
                      </span>
                    )}
                  </div>
                  <div className="col-sm-6 mb-2">
                    <strong>Member Since:</strong>
                  </div>
                  <div className="col-sm-6 mb-2">
                    {user.metadata.creationTime ? 
                      new Date(user.metadata.creationTime).toLocaleDateString() : 
                      'Unknown'
                    }
                  </div>
                  <div className="col-sm-6 mb-2">
                    <strong>Last Sign In:</strong>
                  </div>
                  <div className="col-sm-6 mb-2">
                    {user.metadata.lastSignInTime ? 
                      new Date(user.metadata.lastSignInTime).toLocaleDateString() : 
                      'Unknown'
                    }
                  </div>
                </div>
              </div>

              {isGoogleUser && (
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  You're signed in with Google. Password changes must be done through your Google account.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 