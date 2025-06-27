'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChurchUser, ChurchUser } from '@/contexts/ChurchUserContext';
import { updateProfile } from 'firebase/auth';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Church {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  isActive: boolean;
}

interface ChurchMembershipCardProps {
  churchUser: ChurchUser;
  getChurchDetails: (churchId: string) => Promise<Church | null>;
  onLeaveChurch: (churchUser: ChurchUser) => void;
  isLeaving?: boolean;
}

function ChurchMembershipCard({ churchUser, getChurchDetails, onLeaveChurch, isLeaving = false }: ChurchMembershipCardProps) {
  const [church, setChurch] = useState<Church | null>(null);
  const [loading, setLoading] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchChurch = async () => {
      const churchDetails = await getChurchDetails(churchUser.churchId);
      setChurch(churchDetails);
      setLoading(false);
    };
    
    fetchChurch();
  }, [churchUser.churchId, getChurchDetails]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-danger';
      case 'manager': return 'bg-warning';
      case 'editor': return 'bg-info';
      case 'member': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="list-group-item">
        <div className="d-flex align-items-center">
          <div className="spinner-border spinner-border-sm me-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span>Loading church details...</span>
        </div>
      </div>
    );
  }

  if (!church) {
    return (
      <div className="list-group-item">
        <div className="d-flex align-items-center text-muted">
          <i className="bi bi-exclamation-triangle me-2"></i>
          <span>Church not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="list-group-item">
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1">
          <h6 className="mb-1">{church.name}</h6>
          <p className="mb-1 text-muted">
            <i className="bi bi-geo-alt me-1"></i>
            {church.city}, {church.state}, {church.country}
          </p>
          <div className="d-flex align-items-center gap-2">
            <span className={`badge ${getRoleBadgeClass(churchUser.role)}`}>
              {churchUser.role.charAt(0).toUpperCase() + churchUser.role.slice(1)}
            </span>
            <span className={`badge ${churchUser.isActive ? 'bg-success' : 'bg-secondary'}`}>
              {churchUser.isActive ? 'Active' : 'Inactive'}
            </span>
            {!church.isActive && (
              <span className="badge bg-warning">
                Church Inactive
              </span>
            )}
          </div>
          <small className="text-muted">
            Joined: {churchUser.createdAt.toLocaleDateString()}
          </small>
        </div>
        <div className="text-end">
          <div className="mb-2">
            <small className="text-muted">
              {churchUser.permissions.length} permission{churchUser.permissions.length !== 1 ? 's' : ''}
            </small>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <Link
              href={`/churches/${churchUser.churchId}`}
              className="btn btn-outline-primary btn-sm"
              title="Visit church page"
            >
              <i className="bi bi-eye me-1"></i>
              Visit
            </Link>
            <div className="position-relative" ref={dropdownRef}>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setShowActions(!showActions)}
                title="More actions"
              >
                <i className="bi bi-three-dots"></i>
              </button>
              {showActions && (
                <div className="dropdown-menu show position-absolute end-0 mt-1" style={{ zIndex: 1000 }}>
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to leave ${church.name}?`)) {
                        onLeaveChurch(churchUser);
                      }
                      setShowActions(false);
                    }}
                    disabled={isLeaving}
                  >
                    {isLeaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Leaving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Leave Church
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { getUserChurches, addChurchUser, leaveChurch } = useChurchUser();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Church membership state
  const [userChurches, setUserChurches] = useState<ChurchUser[]>([]);
  const [availableChurches, setAvailableChurches] = useState<Church[]>([]);
  const [showJoinChurch, setShowJoinChurch] = useState(false);
  const [selectedChurchId, setSelectedChurchId] = useState('');
  const [joiningChurch, setJoiningChurch] = useState(false);
  const [churchesLoading, setChurchesLoading] = useState(true);
  const [churchSearchTerm, setChurchSearchTerm] = useState('');
  const [leavingChurch, setLeavingChurch] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      fetchUserChurches();
      fetchAvailableChurches();
    }
  }, [user]);

  const fetchUserChurches = async () => {
    if (!user) return;
    
    try {
      const churches = await getUserChurches(user.uid);
      setUserChurches(churches);
    } catch (error) {
      console.error('Error fetching user churches:', error);
    }
  };

  const fetchAvailableChurches = async () => {
    try {
      const churchesQuery = query(
        collection(db, 'churches'),
        where('isActive', '==', true)
      );
      const querySnapshot = await getDocs(churchesQuery);
      
      const churches = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Church[];
      
      setAvailableChurches(churches);
      
    } catch (error) {
      console.error('Error fetching available churches:', error);
    } finally {
      setChurchesLoading(false);
    }
  };

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

  const handleJoinChurch = async () => {
    if (!user || !selectedChurchId) return;

    setJoiningChurch(true);
    setError('');
    setMessage('');

    try {
      // Check if user is already a member of this church
      const isAlreadyMember = userChurches.some(uc => uc.churchId === selectedChurchId);
      if (isAlreadyMember) {
        setError('You are already a member of this church.');
        return;
      }

      // Get church details for display name
      const selectedChurch = availableChurches.find(c => c.id === selectedChurchId);
      
      await addChurchUser(selectedChurchId, {
        userId: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        role: 'member'
      });

      setMessage(`Successfully joined ${selectedChurch?.name || 'the church'}!`);
      setShowJoinChurch(false);
      setSelectedChurchId('');
      setChurchSearchTerm('');
      
      // Refresh user churches
      await fetchUserChurches();
    } catch (error: any) {
      console.error('Error joining church:', error);
      setError(error.message || 'Failed to join church. Please try again.');
    } finally {
      setJoiningChurch(false);
    }
  };

  const getChurchDetails = async (churchId: string) => {
    try {
      const churchDoc = await getDoc(doc(db, 'churches', churchId));
      if (churchDoc.exists()) {
        return { id: churchDoc.id, ...churchDoc.data() } as Church;
      }
    } catch (error) {
      console.error('Error fetching church details:', error);
    }
    return null;
  };

  const handleLeaveChurch = async (churchUser: ChurchUser) => {
    if (!user) return;

    try {
      setError('');
      setMessage('');
      setLeavingChurch(churchUser.id);

      await leaveChurch(churchUser.churchId, user.uid);
      
      // Get church name for success message
      const church = await getChurchDetails(churchUser.churchId);
      setMessage(`Successfully left ${church?.name || 'the church'}.`);
      
      // Refresh user churches
      await fetchUserChurches();
    } catch (error: any) {
      console.error('Error leaving church:', error);
      setError(error.message || 'Failed to leave church. Please try again.');
    } finally {
      setLeavingChurch(null);
    }
  };

  const getFilteredChurches = () => {
    return availableChurches
      .filter(church => !userChurches.some(uc => uc.churchId === church.id))
      .filter(church => 
        churchSearchTerm === '' || 
        church.name.toLowerCase().includes(churchSearchTerm.toLowerCase()) ||
        church.city.toLowerCase().includes(churchSearchTerm.toLowerCase()) ||
        church.state.toLowerCase().includes(churchSearchTerm.toLowerCase())
      );
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
      <div className="row">
        {/* Profile Section */}
        <div className="col-md-6">
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
                      className="btn btn-dark"
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
                    className="btn btn-dark"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Church Membership Section */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3 className="card-title mb-0">
                <i className="bi bi-building me-2"></i>
                My Churches
              </h3>
              <button
                className="btn btn-primary text-white btn-sm"
                onClick={() => setShowJoinChurch(!showJoinChurch)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Join Church
              </button>
            </div>
            <div className="card-body">
              {/* Join Church Form */}
              {showJoinChurch && (
                <div className="card bg-light mb-3">
                  <div className="card-body">
                    <h5 className="card-title">Join a Church</h5>
                    {churchesLoading ? (
                      <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Loading churches...</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-3">
                          <label htmlFor="churchSearch" className="form-label">Search Churches</label>
                          <input
                            type="text"
                            id="churchSearch"
                            className="form-control"
                            placeholder="Search by name, city, or state..."
                            value={churchSearchTerm}
                            onChange={(e) => setChurchSearchTerm(e.target.value)}
                            disabled={joiningChurch}
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="churchSelect" className="form-label">
                            Select a Church 
                            <small className="text-muted">({getFilteredChurches().length} available)</small>
                          </label>
                          <select
                            id="churchSelect"
                            className="form-select"
                            value={selectedChurchId}
                            onChange={(e) => setSelectedChurchId(e.target.value)}
                            disabled={joiningChurch}
                          >
                            <option value="">Choose a church...</option>
                            {getFilteredChurches().map(church => (
                              <option key={church.id} value={church.id}>
                                {church.name} - {church.city}, {church.state}
                              </option>
                            ))}
                          </select>
                          {getFilteredChurches().length === 0 && churchSearchTerm && (
                            <div className="form-text text-warning">
                              <i className="bi bi-search me-1"></i>
                              No churches found matching "{churchSearchTerm}". Try a different search term.
                            </div>
                          )}
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-success btn-sm text-white"
                            onClick={handleJoinChurch}
                            disabled={!selectedChurchId || joiningChurch}
                          >
                            {joiningChurch ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Joining...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-check-circle me-2"></i>
                                Join as Member
                              </>
                            )}
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setShowJoinChurch(false);
                              setSelectedChurchId('');
                              setChurchSearchTerm('');
                            }}
                            disabled={joiningChurch}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Current Church Memberships */}
              {userChurches.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-building display-4 text-muted"></i>
                  <p className="text-muted mt-2">You haven't joined any churches yet.</p>
                  <button
                    className="btn btn-primary text-white"
                    onClick={() => setShowJoinChurch(true)}
                  >
                    Join Your First Church
                  </button>
                </div>
              ) : (
                <div>
                  <h5 className="mb-3">Your Church Memberships ({userChurches.length})</h5>
                  <div className="list-group">
                    {userChurches.map((churchUser) => (
                      <ChurchMembershipCard 
                        key={churchUser.id} 
                        churchUser={churchUser}
                        getChurchDetails={getChurchDetails}
                        onLeaveChurch={handleLeaveChurch}
                        isLeaving={leavingChurch === churchUser.id}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 