'use client';

import { useState, useEffect } from 'react';
import { useDiscussions, Discussion } from '@/contexts/DiscussionsContext';
import { useChurchUser } from '@/contexts/ChurchUserContext';
import { useAuth } from '@/contexts/AuthContext';
import CreateDiscussionModal from './CreateDiscussionModal';
import DiscussionCard from './DiscussionCard';

interface DiscussionsListProps {
  churchId: string;
}

export default function DiscussionsList({ churchId }: DiscussionsListProps) {
  const { user } = useAuth();
  const { getChurchDiscussions, searchDiscussions, getDiscussionsByTag, discussions, loading } = useDiscussions();
  const { getUserChurches } = useChurchUser();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [localDiscussions, setLocalDiscussions] = useState<Discussion[]>([]);
  const [userRole, setUserRole] = useState<string>('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Check user role in this church
  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) return;
      
      try {
        const userChurches = await getUserChurches(user.uid);
        const currentChurch = userChurches.find(uc => uc.churchId === churchId);
        setUserRole(currentChurch?.role || 'member');
      } catch (error) {
        console.error('Error checking user role:', error);
        setUserRole('member');
      }
    };

    checkUserRole();
  }, [user, churchId]);

  // Load discussions
  useEffect(() => {
    const loadDiscussions = async () => {
      // Don't try to load if no user or no church ID
      if (!user || !churchId) {
        setLocalDiscussions([]);
        setAvailableTags([]);
        return;
      }

      try {
        // Debug: Log user and church info
        console.log('🔍 Debug Info:');
        console.log('User:', user?.uid);
        console.log('Church ID:', churchId);
        console.log('User Role:', userRole);
        
        const discussions = await getChurchDiscussions(churchId);
        setLocalDiscussions(discussions);
        
        // Extract unique tags
        const tags = new Set<string>();
        discussions.forEach(discussion => {
          discussion.tags.forEach(tag => tags.add(tag));
        });
        setAvailableTags(Array.from(tags).sort());
        
        console.log('✅ Successfully loaded', discussions.length, 'discussions');
      } catch (error) {
        console.error('Error loading discussions:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        // Set empty arrays to prevent infinite loops
        setLocalDiscussions([]);
        setAvailableTags([]);
        
        // Additional debugging for permission errors
        if (error.code === 'permission-denied') {
          console.log('🚨 Permission denied. Check:');
          console.log('1. User authentication status');
          console.log('2. Church membership exists');
          console.log('3. Firestore security rules');
          console.log('4. Required indexes');
          
          // Show user-friendly alert for permission errors
          alert(`❌ Unable to load discussions for this church.

This usually means:
• You're not a member of this church yet
• Your account needs proper permissions
• There might be a setup issue

To fix this:
1. Contact a church administrator to add you as a member
2. Or use the "Setup Church Membership" tool below (for testing)
3. Make sure you're logged in with the correct account

Technical details: ${error.message}`);
        } else if (error.code === 'failed-precondition') {
          console.log('🚨 Failed precondition - likely missing Firestore indexes');
          alert(`❌ Database setup incomplete.

The required database indexes haven't been created yet.
This is a technical issue that needs to be resolved by a developer.

Please contact technical support.

Technical details: ${error.message}`);
        } else {
          // Generic error alert
          alert(`❌ Error loading discussions: ${error.message || 'Unknown error'}

Please try:
1. Refreshing the page
2. Logging out and back in
3. Contacting support if the issue persists`);
        }
      }
    };

    loadDiscussions();
  }, [churchId, refreshTrigger, user?.uid]);

  // Handle search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // Reset to all discussions
      const discussions = await getChurchDiscussions(churchId);
      setLocalDiscussions(discussions);
      return;
    }

    try {
      const results = await searchDiscussions(churchId, searchTerm);
      setLocalDiscussions(results);
    } catch (error) {
      console.error('Error searching discussions:', error);
    }
  };

  // Handle tag filter
  const handleTagFilter = async (tag: string) => {
    if (!tag) {
      // Reset to all discussions
      const discussions = await getChurchDiscussions(churchId);
      setLocalDiscussions(discussions);
      setSelectedTag('');
      return;
    }

    try {
      const results = await getDiscussionsByTag(churchId, tag);
      setLocalDiscussions(results);
      setSelectedTag(tag);
    } catch (error) {
      console.error('Error filtering by tag:', error);
    }
  };

  const handleDiscussionCreated = () => {
    setShowCreateModal(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDiscussionUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const canCreateDiscussion = () => {
    // Members and above can create discussions
    return ['member', 'editor', 'manager', 'admin'].includes(userRole);
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24 * 7) {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-chat-dots me-2"></i>
            Church Discussions
          </h2>
          <p className="text-muted mb-0">Connect with your church community</p>
        </div>
        
        {canCreateDiscussion() && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            New Discussion
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-end">
            <div className="col-md-6">
              <label htmlFor="search" className="form-label">Search Discussions</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="search"
                  placeholder="Search by title, content, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={handleSearch}
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
            
            <div className="col-md-4">
              <label htmlFor="tagFilter" className="form-label">Filter by Tag</label>
              <select
                className="form-select"
                id="tagFilter"
                value={selectedTag}
                onChange={(e) => handleTagFilter(e.target.value)}
              >
                <option value="">All Tags</option>
                {availableTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
            
            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTag('');
                  handleTagFilter('');
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Discussion Stats */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="bi bi-chat-dots fs-2 me-3"></i>
                <div>
                  <h4 className="mb-0">{localDiscussions.length}</h4>
                  <small>Total Discussions</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="bi bi-pin-angle fs-2 me-3"></i>
                <div>
                  <h4 className="mb-0">{localDiscussions.filter(d => d.isPinned).length}</h4>
                  <small>Pinned</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="bi bi-chat-left-text fs-2 me-3"></i>
                <div>
                  <h4 className="mb-0">{localDiscussions.reduce((sum, d) => sum + d.commentCount, 0)}</h4>
                  <small>Total Comments</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="bi bi-tags fs-2 me-3"></i>
                <div>
                  <h4 className="mb-0">{availableTags.length}</h4>
                  <small>Unique Tags</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading discussions...</span>
          </div>
          <p className="mt-2 text-muted">Loading discussions...</p>
        </div>
      )}

      {/* Discussions List */}
      {!loading && (
        <>
          {localDiscussions.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-chat-dots text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">No Discussions Found</h4>
              <p className="text-muted">
                {searchTerm || selectedTag ? 
                  'Try adjusting your search or filter criteria.' : 
                  'Be the first to start a discussion in your church community!'
                }
              </p>
              {canCreateDiscussion() && !searchTerm && !selectedTag && (
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => setShowCreateModal(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Start First Discussion
                </button>
              )}
            </div>
          ) : (
            <div className="row">
              {localDiscussions.map((discussion) => (
                <div key={discussion.id} className="col-12 mb-3">
                  <DiscussionCard 
                    discussion={discussion}
                    userRole={userRole}
                    onUpdate={handleDiscussionUpdated}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Discussion Modal */}
      {showCreateModal && (
        <CreateDiscussionModal
          churchId={churchId}
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreated={handleDiscussionCreated}
        />
      )}
    </div>
  );
} 