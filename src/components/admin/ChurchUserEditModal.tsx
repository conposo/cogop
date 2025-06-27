'use client';

import { useState, useEffect } from 'react';
import { ChurchUser } from '@/contexts/ChurchUserContext';

interface ChurchUserEditModalProps {
  churchUser: ChurchUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<ChurchUser>) => Promise<void>;
}

export default function ChurchUserEditModal({
  churchUser,
  isOpen,
  onClose,
  onSave
}: ChurchUserEditModalProps) {
  const [formData, setFormData] = useState({
    role: 'member' as 'admin' | 'manager' | 'editor' | 'member',
    permissions: [] as string[],
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (churchUser) {
      setFormData({
        role: churchUser.role,
        permissions: [...churchUser.permissions],
        isActive: churchUser.isActive
      });
    }
  }, [churchUser]);

  const handleSave = async () => {
    if (!churchUser) return;

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving church user:', error);
      alert('Error saving changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getDefaultPermissions = (role: string): string[] => {
    switch (role) {
      case 'admin':
        return ['manage_users', 'manage_content', 'manage_events', 'view_analytics', 'manage_settings', 'manage_discussions', 'pin_discussions', 'moderate_discussions'];
      case 'manager':
        return ['manage_content', 'manage_events', 'view_analytics', 'manage_discussions', 'pin_discussions', 'moderate_discussions'];
      case 'editor':
        return ['manage_content', 'manage_events', 'create_discussions', 'moderate_discussions'];
      case 'member':
        return ['view_content', 'create_discussions', 'comment_discussions'];
      default:
        return ['view_content'];
    }
  };

  const handleRoleChange = (newRole: 'admin' | 'manager' | 'editor' | 'member') => {
    setFormData(prev => ({
      ...prev,
      role: newRole,
      permissions: getDefaultPermissions(newRole)
    }));
  };

  const handlePermissionChange = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-danger';
      case 'manager': return 'bg-warning';
      case 'editor': return 'bg-info';
      case 'member': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  };

  if (!isOpen || !churchUser) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-person-gear me-2"></i>
              Edit User Role & Permissions
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={saving}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <h6>User Information</h6>
                <p className="mb-1"><strong>Name:</strong> {churchUser.displayName || 'Unknown User'}</p>
                <p className="mb-1"><strong>Email:</strong> {churchUser.email}</p>
                <p className="mb-1"><strong>User ID:</strong> <code className="small">{churchUser.userId}</code></p>
                <p className="mb-0">
                  <strong>Current Role:</strong> 
                  <span className={`badge ms-2 ${getRoleBadgeClass(churchUser.role)}`}>
                    {churchUser.role.charAt(0).toUpperCase() + churchUser.role.slice(1)}
                  </span>
                </p>
              </div>
              <div className="col-md-6">
                <h6>Current Permissions</h6>
                <div className="d-flex flex-wrap gap-1">
                  {churchUser.permissions.map((permission) => (
                    <span key={permission} className="badge bg-light text-dark">
                      {permission.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <hr />

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">New Role</label>
                  <select
                    className="form-select"
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleRoleChange(e.target.value as 'admin' | 'manager' | 'editor' | 'member')}
                    disabled={saving}
                  >
                    <option value="member">Member</option>
                    <option value="editor">Editor</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="form-text">
                    Changing the role will reset permissions to defaults for that role.
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      disabled={saving}
                    />
                    <label className="form-check-label" htmlFor="isActive">
                      Active User
                    </label>
                  </div>
                  <div className="form-text">
                    Inactive users cannot access church resources.
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Custom Permissions</label>
                <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {['manage_users', 'manage_content', 'manage_events', 'view_analytics', 'manage_settings', 'view_content', 'manage_discussions', 'pin_discussions', 'moderate_discussions', 'create_discussions', 'comment_discussions'].map(permission => (
                    <div key={permission} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`edit_${permission}`}
                        checked={formData.permissions.includes(permission)}
                        onChange={() => handlePermissionChange(permission)}
                        disabled={saving}
                      />
                      <label className="form-check-label" htmlFor={`edit_${permission}`}>
                        {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="form-text">
                  You can customize permissions beyond the role defaults.
                </div>
              </div>
            </div>

            <div className="mt-3">
              <h6>Role Descriptions</h6>
              <div className="row">
                <div className="col-md-6">
                  <small>
                    <strong>Admin:</strong> Full access to manage users, content, events, and settings.<br />
                    <strong>Manager:</strong> Can manage content, events, and view analytics.
                  </small>
                </div>
                <div className="col-md-6">
                  <small>
                    <strong>Editor:</strong> Can manage content and events.<br />
                    <strong>Member:</strong> Basic access to view content only.
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary text-white"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Saving...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 