'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useChurchUser, ChurchUser } from '@/contexts/ChurchUserContext';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ChurchUserEditModal from '@/components/admin/ChurchUserEditModal';

interface Church {
  id: string;
  name: string;
}

interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export default function ChurchUsersManagement() {
  const { adminData } = useAdmin();
  const { 
    churchUsers, 
    loading: churchUsersLoading, 
    addChurchUser, 
    updateChurchUser, 
    removeChurchUser, 
    getChurchUsers 
  } = useChurchUser();
  
  const params = useParams();
  const router = useRouter();
  const [church, setChurch] = useState<Church | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<ChurchUser | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    userId: '',
    email: '',
    displayName: '',
    role: 'member' as 'admin' | 'manager' | 'editor' | 'member',
    permissions: [] as string[]
  });

  const churchId = params.id as string;
  const isSuperAdmin = adminData?.role === 'super_admin';

  useEffect(() => {
    if (!isSuperAdmin) return;
    
    fetchChurch();
    fetchChurchUsers();
    fetchAvailableUsers();
  }, [churchId, isSuperAdmin]);

  const fetchChurch = async () => {
    try {
      const churchDoc = await getDoc(doc(db, 'churches', churchId));
      if (churchDoc.exists()) {
        setChurch({
          id: churchDoc.id,
          name: churchDoc.data().name
        });
      }
    } catch (error) {
      console.error('Error fetching church:', error);
    }
  };

  const fetchChurchUsers = async () => {
    try {
      await getChurchUsers(churchId);
    } catch (error) {
      console.error('Error fetching church users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      // In a real app, you might want to fetch from a users collection
      // For now, we'll just provide a way to add users by UID/email
      setAvailableUsers([]);
    } catch (error) {
      console.error('Error fetching available users:', error);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.userId.trim()) return;

    try {
      await addChurchUser(churchId, {
        userId: newUserData.userId,
        email: newUserData.email,
        displayName: newUserData.displayName,
        role: newUserData.role,
        permissions: newUserData.permissions.length > 0 ? newUserData.permissions : getDefaultPermissions(newUserData.role)
      });

      setShowAddForm(false);
      setNewUserData({
        userId: '',
        email: '',
        displayName: '',
        role: 'member',
        permissions: []
      });
      
      await fetchChurchUsers();
    } catch (error) {
      console.error('Error adding church user:', error);
      alert('Error adding user to church. Please try again.');
    }
  };

  const handleUpdateUser = async (churchUser: ChurchUser, updates: Partial<ChurchUser>) => {
    try {
      await updateChurchUser(churchUser.id, updates);
      await fetchChurchUsers();
    } catch (error) {
      console.error('Error updating church user:', error);
      alert('Error updating user. Please try again.');
    }
  };

  const handleRemoveUser = async (churchUser: ChurchUser) => {
    if (window.confirm(`Are you sure you want to remove ${churchUser.displayName || churchUser.email} from this church?`)) {
      try {
        await removeChurchUser(churchUser.id);
        await fetchChurchUsers();
      } catch (error) {
        console.error('Error removing church user:', error);
        alert('Error removing user from church. Please try again.');
      }
    }
  };

  const handleEditUser = (churchUser: ChurchUser) => {
    setEditingUser(churchUser);
    setShowEditModal(true);
  };

  const handleSaveUserEdit = async (updates: Partial<ChurchUser>) => {
    if (!editingUser) return;
    
    await handleUpdateUser(editingUser, updates);
    setShowEditModal(false);
    setEditingUser(null);
  };

  const getDefaultPermissions = (role: string): string[] => {
    switch (role) {
      case 'admin':
        return ['manage_users', 'manage_content', 'manage_events', 'view_analytics', 'manage_settings'];
      case 'manager':
        return ['manage_content', 'manage_events', 'view_analytics'];
      case 'editor':
        return ['manage_content', 'manage_events'];
      case 'member':
        return ['view_content'];
      default:
        return ['view_content'];
    }
  };

  const handlePermissionChange = (permission: string) => {
    setNewUserData(prev => ({
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

  if (!isSuperAdmin) {
    return (
      <div className="alert alert-warning">
        <h4>Access Denied</h4>
        <p>Only Super Admins can manage church users.</p>
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
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/admin">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/admin/churches">Churches</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href={`/admin/churches/${churchId}`}>{church?.name}</Link>
              </li>
              <li className="breadcrumb-item active">Users</li>
            </ol>
          </nav>
          <h1>Church Users - {church?.name}</h1>
        </div>
        <div>
          <Link href={`/admin/churches/${churchId}`} className="btn btn-secondary me-2">
            <i className="bi bi-arrow-left me-2"></i>
            Back to Church
          </Link>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add User
          </button>
        </div>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title mb-0">Add User to Church</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddUser}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="userId" className="form-label">User ID *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="userId"
                      value={newUserData.userId}
                      onChange={(e) => setNewUserData(prev => ({ ...prev, userId: e.target.value }))}
                      placeholder="Enter the user's Firebase UID"
                      required
                    />
                    <div className="form-text">
                      You can find the user's UID in the Firebase Authentication console
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={newUserData.email}
                      onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="user@example.com"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="displayName" className="form-label">Display Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="displayName"
                      value={newUserData.displayName}
                      onChange={(e) => setNewUserData(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">Role *</label>
                    <select
                      className="form-select"
                      id="role"
                      value={newUserData.role}
                      onChange={(e) => {
                        const role = e.target.value as 'admin' | 'manager' | 'editor' | 'member';
                        setNewUserData(prev => ({ 
                          ...prev, 
                          role,
                          permissions: getDefaultPermissions(role)
                        }));
                      }}
                    >
                      <option value="member">Member</option>
                      <option value="editor">Editor</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Permissions</label>
                <div className="row">
                  {['manage_users', 'manage_content', 'manage_events', 'view_analytics', 'manage_settings', 'view_content'].map(permission => (
                    <div key={permission} className="col-md-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={permission}
                          checked={newUserData.permissions.includes(permission)}
                          onChange={() => handlePermissionChange(permission)}
                        />
                        <label className="form-check-label" htmlFor={permission}>
                          {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-check-circle me-2"></i>
                  Add User
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Church Users Table */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <i className="bi bi-people me-2"></i>
            Church Users ({churchUsers.length})
          </h5>
        </div>
        <div className="card-body">
          {churchUsersLoading ? (
            <div className="text-center py-3">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : churchUsers.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-people display-4 text-muted"></i>
              <p className="text-muted mt-2">No users assigned to this church yet.</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddForm(true)}
              >
                Add First User
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Permissions</th>
                    <th>Status</th>
                    <th>Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {churchUsers.map((churchUser) => (
                    <tr key={churchUser.id}>
                      <td>
                        <div>
                          <div className="fw-bold">
                            {churchUser.displayName || 'Unknown User'}
                          </div>
                          <small className="text-muted">{churchUser.email}</small>
                          <br />
                          <small className="text-muted">ID: {churchUser.userId}</small>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getRoleBadgeClass(churchUser.role)}`}>
                          {churchUser.role.charAt(0).toUpperCase() + churchUser.role.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {churchUser.permissions.slice(0, 3).map((permission) => (
                            <span key={permission} className="badge bg-light text-dark">
                              {permission.replace('_', ' ')}
                            </span>
                          ))}
                          {churchUser.permissions.length > 3 && (
                            <span className="badge bg-light text-dark">
                              +{churchUser.permissions.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${churchUser.isActive ? 'bg-success' : 'bg-secondary'}`}>
                          {churchUser.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted">
                          {churchUser.createdAt.toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleEditUser(churchUser)}
                            title="Edit user"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => {
                              // Toggle active status
                              handleUpdateUser(churchUser, { isActive: !churchUser.isActive });
                            }}
                            title={churchUser.isActive ? 'Deactivate' : 'Activate'}
                          >
                            <i className={`bi ${churchUser.isActive ? 'bi-pause' : 'bi-play'}`}></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleRemoveUser(churchUser)}
                            title="Remove from church"
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

      {/* Edit User Modal */}
      <ChurchUserEditModal
        churchUser={editingUser}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUserEdit}
      />
    </div>
  );
} 