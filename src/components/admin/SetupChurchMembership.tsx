'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { setupChurchMembership } from '@/utils/setupChurchMembership';

interface SetupChurchMembershipProps {
  churchId: string;
}

export default function SetupChurchMembership({ churchId }: SetupChurchMembershipProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [role, setRole] = useState<'admin' | 'manager' | 'editor' | 'member'>('member');

  const handleSetup = async () => {
    if (!user) {
      alert('Please log in first');
      return;
    }

    setLoading(true);
    try {
      await setupChurchMembership({ user, churchId, role });
      setSuccess(true);
      setTimeout(() => {
        window.location.reload(); // Refresh to update context
      }, 1000);
    } catch (error) {
      console.error('Setup failed:', error);
      alert('Setup failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="alert alert-success">
        <i className="bi bi-check-circle me-2"></i>
        Church membership set up successfully! Refreshing page...
      </div>
    );
  }

  return (
    <div className="card border-warning">
      <div className="card-header bg-warning bg-opacity-10">
        <h6 className="mb-0">
          <i className="bi bi-tools me-2"></i>
          Setup Church Membership (Super Admin Tool)
        </h6>
      </div>
      <div className="card-body">
        <div className="alert alert-danger small mb-3">
          <i className="bi bi-exclamation-triangle me-2"></i>
          <strong>Development Tool Warning:</strong> This tool is for testing and development purposes only. 
          Remove or restrict access in production environments.
        </div>
        
        <p className="small text-muted mb-3">
          This tool helps set up church membership for testing purposes. Only super administrators should have access to this functionality.
        </p>
        
        <div className="row align-items-end">
          <div className="col-md-4">
            <label htmlFor="role" className="form-label">Role</label>
            <select 
              className="form-select"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              disabled={loading}
            >
              <option value="member">Member</option>
              <option value="editor">Editor</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div className="col-md-4">
            <label className="form-label">Church ID</label>
            <input 
              type="text" 
              className="form-control" 
              value={churchId} 
              disabled 
            />
          </div>
          
          <div className="col-md-4">
            <button 
              className="btn btn-warning w-100"
              onClick={handleSetup}
              disabled={loading || !user}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Setting up...
                </>
              ) : (
                <>
                  <i className="bi bi-plus-circle me-2"></i>
                  Setup Membership
                </>
              )}
            </button>
          </div>
        </div>
        
        {user && (
          <div className="mt-2">
            <small className="text-muted">
              Setting up for user: {user.email} ({user.uid})
            </small>
          </div>
        )}
      </div>
    </div>
  );
} 