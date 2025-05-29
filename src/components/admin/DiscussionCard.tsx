'use client';

import { useState } from 'react';
import { Discussion } from '@/contexts/DiscussionsContext';
import { useDiscussions } from '@/contexts/DiscussionsContext';
import { useAuth } from '@/contexts/AuthContext';
import DiscussionDetailModal from './DiscussionDetailModal';
import DiscussionEditModal from './DiscussionEditModal';

interface DiscussionCardProps {
  discussion: Discussion;
  userRole: string;
  onUpdate: () => void;
}

export default function DiscussionCard({ discussion, userRole, onUpdate }: DiscussionCardProps) {
  const { user } = useAuth();
  const { pinDiscussion, deleteDiscussion } = useDiscussions();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const canPin = () => {
    return ['admin', 'manager'].includes(userRole);
  };

  const canEdit = () => {
    return user && (user.uid === discussion.authorId || ['admin', 'manager'].includes(userRole));
  };

  const canDelete = () => {
    return user && (user.uid === discussion.authorId || ['admin', 'manager'].includes(userRole));
  };

  const handlePin = async () => {
    if (!canPin() || loading) return;

    setLoading(true);
    try {
      await pinDiscussion(discussion.id, !discussion.isPinned);
      onUpdate();
    } catch (error) {
      console.error('Error pinning discussion:', error);
      alert('Error updating discussion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!canDelete() || loading) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this discussion? This action cannot be undone.'
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteDiscussion(discussion.id);
      onUpdate();
    } catch (error) {
      console.error('Error deleting discussion:', error);
      alert('Error deleting discussion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const truncateContent = (content: string, maxLength: number = 300) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <>
      <div className={`card h-100 ${discussion.isPinned ? 'border-warning' : ''}`}>
        {discussion.isPinned && (
          <div className="card-header bg-warning bg-opacity-10 py-2">
            <small className="text-warning fw-bold">
              <i className="bi bi-pin-angle me-1"></i>
              Pinned Discussion
            </small>
          </div>
        )}

        <div className="card-body">
          {/* Title and Actions */}
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title mb-0">{discussion.title}</h5>
            
            <div className="dropdown">
              <button
                className="btn btn-sm btn-outline-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                disabled={loading}
              >
                <i className="bi bi-three-dots"></i>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => setShowDetailModal(true)}
                  >
                    <i className="bi bi-eye me-2"></i>
                    View Details
                  </button>
                </li>
                
                {canPin() && (
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={handlePin}
                      disabled={loading}
                    >
                      <i className={`bi bi-pin${discussion.isPinned ? '-fill' : ''} me-2`}></i>
                      {discussion.isPinned ? 'Unpin' : 'Pin'} Discussion
                    </button>
                  </li>
                )}
                
                {canEdit() && (
                  <>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => setShowEditModal(true)}
                      >
                        <i className="bi bi-pencil me-2"></i>
                        Edit Discussion
                      </button>
                    </li>
                  </>
                )}
                
                {canDelete() && (
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleDelete}
                      disabled={loading}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Delete Discussion
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Author and Time */}
          <div className="d-flex align-items-center mb-3">
            <div className="d-flex align-items-center text-muted small">
              <i className="bi bi-person-circle me-1"></i>
              <span className="me-2">{discussion.authorName}</span>
              <i className="bi bi-clock me-1"></i>
              <span className="me-2">{formatRelativeTime(discussion.createdAt)}</span>
              {discussion.lastActivityAt > discussion.createdAt && (
                <>
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  <span>Updated {formatRelativeTime(discussion.lastActivityAt)}</span>
                </>
              )}
            </div>
          </div>

          {/* Content Preview */}
          <div className="mb-3">
            <p className="card-text">
              {truncateContent(discussion.content)}
              {discussion.content.length > 300 && (
                <button
                  className="btn btn-link p-0 ms-2"
                  onClick={() => setShowDetailModal(true)}
                >
                  Read more
                </button>
              )}
            </p>
          </div>

          {/* Tags */}
          {discussion.tags.length > 0 && (
            <div className="mb-3">
              <div className="d-flex flex-wrap gap-1">
                {discussion.tags.slice(0, 5).map((tag) => (
                  <span key={tag} className="badge bg-secondary">
                    {tag}
                  </span>
                ))}
                {discussion.tags.length > 5 && (
                  <span className="badge bg-light text-dark">
                    +{discussion.tags.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Stats and Actions */}
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-3">
              <span className="text-muted small">
                <i className="bi bi-chat-left-text me-1"></i>
                {discussion.commentCount} comment{discussion.commentCount !== 1 ? 's' : ''}
              </span>
              
              {/* <span className="text-muted small">
                <i className="bi bi-heart me-1"></i>
                0 likes TODO: Implement likes feature
              </span> */}
            </div>

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setShowDetailModal(true)}
            >
              <i className="bi bi-chat-dots me-1"></i>
              Join Discussion
            </button>
          </div>
        </div>

        {/* Footer with Last Activity */}
        <div className="card-footer bg-transparent">
          <small className="text-muted">
            <i className="bi bi-activity me-1"></i>
            Last activity: {formatRelativeTime(discussion.lastActivityAt)}
          </small>
        </div>
      </div>

      {/* Discussion Detail Modal */}
      {showDetailModal && (
        <DiscussionDetailModal
          discussionId={discussion.id}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onUpdate={onUpdate}
          userRole={userRole}
        />
      )}

      {/* Discussion Edit Modal */}
      {showEditModal && (
        <DiscussionEditModal
          discussionId={discussion.id}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdated={onUpdate}
        />
      )}
    </>
  );
} 