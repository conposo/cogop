'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface AdminUser {
  id: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
  createdAt: any;
  createdBy: string;
  email?: string;
  displayName?: string;
}

export default function UserManagement() {
  const { user } = useAuth();
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserData, setNewUserData] = useState({
    uid: '',
    role: 'admin' as 'admin' | 'super_admin',
    permissions: ['news']
  });

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'admins'));
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AdminUser[];
      setAdminUsers(users);
    } catch (error) {
      console.error('Error fetching admin users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newUserData.uid.trim()) return;

    try {
      await setDoc(doc(db, 'admins', newUserData.uid), {
        role: newUserData.role,
        permissions: newUserData.permissions,
        createdAt: serverTimestamp(),
        createdBy: user.uid
      });

      setShowAddForm(false);
      setNewUserData({ uid: '', role: 'admin', permissions: ['news'] });
      fetchAdminUsers();
    } catch (error) {
      console.error('Error adding admin user:', error);
      alert('Error adding admin user. Please try again.');
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    if (userId === user?.uid) {
      alert('You cannot remove yourself from admin privileges.');
      return;
    }

    if (window.confirm('Are you sure you want to remove admin privileges from this user?')) {
      try {
        await deleteDoc(doc(db, 'admins', userId));
        setAdminUsers(adminUsers.filter(admin => admin.id !== userId));
      } catch (error) {
        console.error('Error removing admin user:', error);
        alert('Error removing admin user. Please try again.');
      }
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
        <h1>User Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add Admin User
        </button>
      </div>

      {/* Add Admin Form */}
      {showAddForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title mb-0">Add New Admin User</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddAdmin}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="uid" className="form-label">User UID *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="uid"
                      value={newUserData.uid}
                      onChange={(e) => setNewUserData(prev => ({ ...prev, uid: e.target.value }))}
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
                    <label htmlFor="role" className="form-label">Role *</label>
                    <select
                      className="form-select"
                      id="role"
                      value={newUserData.role}
                      onChange={(e) => setNewUserData(prev => ({ ...prev, role: e.target.value as 'admin' | 'super_admin' }))}
                    >
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Permissions</label>
                <div className="row">
                  {['news', 'users', 'settings'].map(permission => (
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
                          {permission.charAt(0).toUpperCase() + permission.slice(1)}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-check-circle me-2"></i>
                  Add Admin
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

      {/* Admin Users Table */}
      <div className="card">
        <div className="card-body">
          {adminUsers.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Role</th>
                    <th>Permissions</th>
                    <th>Created</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((admin) => (
                    <tr key={admin.id}>
                      <td>
                        <div>
                          <code className="small">{admin.id}</code>
                          {admin.id === user?.uid && (
                            <span className="badge bg-info ms-2">You</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${admin.role === 'super_admin' ? 'bg-danger' : 'bg-primary'}`}>
                          {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </span>
                      </td>
                      <td>
                        {admin.permissions?.map(permission => (
                          <span key={permission} className="badge bg-secondary me-1">
                            {permission}
                          </span>
                        )) || <span className="text-muted">All</span>}
                      </td>
                      <td>
                        {admin.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                      </td>
                      <td>
                        <code className="small">{admin.createdBy || 'Unknown'}</code>
                      </td>
                      <td>
                        {admin.id !== user?.uid && (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleRemoveAdmin(admin.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-people fs-1 text-muted"></i>
              <h4 className="mt-3">No admin users found</h4>
              <p className="text-muted">Add your first admin user to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="card mt-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Instructions</h5>
        </div>
        <div className="card-body">
          <h6>How to add admin users:</h6>
          <ol>
            <li>The user must first create an account on your website using email/password or Google sign-in</li>
            <li>Go to the Firebase Console → Authentication → Users</li>
            <li>Find the user and copy their UID</li>
            <li>Use the "Add Admin User" form above to grant them admin privileges</li>
            <li>The user will need to sign out and sign back in to see admin features</li>
          </ol>
          
          <h6 className="mt-4">Role Differences:</h6>
          <ul>
            <li><strong>Admin:</strong> Can manage news articles and basic admin functions</li>
            <li><strong>Super Admin:</strong> Has all admin permissions plus user management</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 