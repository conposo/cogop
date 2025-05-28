'use client';

import { useState, useEffect } from 'react';
import { useDiscussions, Discussion } from '@/contexts/DiscussionsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useChurchUser } from '@/contexts/ChurchUserContext';
import Link from 'next/link';

interface DiscussionsSummaryProps {
  churchId: string;
}

export default function DiscussionsSummary({ churchId }: DiscussionsSummaryProps) {
  const { user } = useAuth();
  const { getChurchDiscussions } = useDiscussions();
  const { getUserChurches } = useChurchUser();
  
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    checkAccess();
  }, [user, churchId]);

  const checkAccess = async () => {
    if (!user) {
      setHasAccess(false);
      setLoading(false);
      return;
    }

    try {
      const userChurches = await getUserChurches(user.uid);
      const churchMembership = userChurches.find(uc => uc.churchId === churchId);
      
      if (churchMembership) {
        setHasAccess(true);
        setUserRole(churchMembership.role);
        await loadDiscussions();
      } else {
        setHasAccess(false);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking church access:', error);
      setHasAccess(false);
      setLoading(false);
    }
  };

  const loadDiscussions = async () => {
    try {
      const churchDiscussions = await getChurchDiscussions(churchId, 10); // Get recent 10
      setDiscussions(churchDiscussions);
    } catch (error) {
      console.error('Error loading discussions summary:', error);
      setDiscussions([]);
    } finally {
      setLoading(false);
    }
  };

  const getRecentDiscussions = () => {
    const now = new Date();
    const recentThreshold = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)); // 7 days ago
    return discussions.filter(d => d.createdAt >= recentThreshold);
  };

  const getPinnedDiscussions = () => {
    return discussions.filter(d => d.isPinned);
  };

  const getTotalComments = () => {
    return discussions.reduce((total, d) => total + d.commentCount, 0);
  };

  const getMostActiveDiscussion = () => {
    return discussions.length > 0 
      ? discussions.reduce((prev, current) => 
          prev.commentCount > current.commentCount ? prev : current
        )
      : null;
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return hours === 0 ? 'Just now' : `${hours}h ago`;
    } else if (diffInHours < 24 * 7) {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <i className="bi bi-chat-dots me-2"></i>
            Community Discussions
          </h5>
        </div>
        <div className="card-body text-center">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="small text-muted mt-2 mb-0">Loading discussions...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <i className="bi bi-chat-dots me-2"></i>
            Community Discussions
          </h5>
        </div>
        <div className="card-body text-center">
          <i className="bi bi-lock text-muted mb-2" style={{ fontSize: '2rem' }}></i>
          <p className="text-muted mb-3">
            Join this church to participate in community discussions
          </p>
          <small className="text-muted">
            Contact a church administrator for access
          </small>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          <i className="bi bi-chat-dots me-2"></i>
          Community Discussions
        </h5>
        <Link 
          href={`/churches/${churchId}/discussions`}
          className="btn btn-sm btn-outline-primary"
        >
          View All
        </Link>
      </div>
      <div className="card-body">
        {discussions.length === 0 ? (
          <div className="text-center">
            <i className="bi bi-chat-dots text-muted mb-2" style={{ fontSize: '2rem' }}></i>
            <p className="text-muted mb-3">No discussions yet</p>
            <Link 
              href={`/churches/${churchId}/discussions`}
              className="btn btn-sm btn-primary"
            >
              Start First Discussion
            </Link>
          </div>
        ) : (
          <>
            {/* Statistics */}
            <div className="row text-center mb-3">
              <div className="col-4">
                <div className="border-end">
                  <h6 className="text-primary mb-0">{discussions.length}</h6>
                  <small className="text-muted">Total</small>
                </div>
              </div>
              <div className="col-4">
                <div className="border-end">
                  <h6 className="text-success mb-0">{getRecentDiscussions().length}</h6>
                  <small className="text-muted">This Week</small>
                </div>
              </div>
              <div className="col-4">
                <h6 className="text-info mb-0">{getTotalComments()}</h6>
                <small className="text-muted">Comments</small>
              </div>
            </div>

            {/* Pinned Discussions */}
            {getPinnedDiscussions().length > 0 && (
              <div className="mb-3">
                <h6 className="text-warning mb-2">
                  <i className="bi bi-pin-angle me-1"></i>
                  Pinned
                </h6>
                {getPinnedDiscussions().slice(0, 2).map((discussion) => (
                  <div key={discussion.id} className="small mb-2">
                    <Link 
                      href={`/churches/${churchId}/discussions`}
                      className="text-decoration-none fw-medium"
                    >
                      {discussion.title.length > 40 
                        ? discussion.title.substring(0, 40) + '...' 
                        : discussion.title
                      }
                    </Link>
                    <div className="text-muted">
                      {discussion.commentCount} comments • {formatRelativeTime(discussion.lastActivityAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Discussions */}
            <div className="mb-3">
              <h6 className="text-primary mb-2">
                <i className="bi bi-clock me-1"></i>
                Recent Activity
              </h6>
              {discussions.slice(0, 3).map((discussion) => (
                <div key={discussion.id} className="small mb-2">
                  <Link 
                    href={`/churches/${churchId}/discussions`}
                    className="text-decoration-none"
                  >
                    {discussion.title.length > 35 
                      ? discussion.title.substring(0, 35) + '...' 
                      : discussion.title
                    }
                  </Link>
                  <div className="text-muted">
                    by {discussion.authorName} • {discussion.commentCount} comments
                  </div>
                  {discussion.tags.length > 0 && (
                    <div className="mt-1">
                      {discussion.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="badge bg-light text-dark me-1" style={{ fontSize: '0.7em' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Most Active Discussion */}
            {getMostActiveDiscussion() && getMostActiveDiscussion()!.commentCount > 0 && (
              <div className="mb-3">
                <h6 className="text-info mb-2">
                  <i className="bi bi-fire me-1"></i>
                  Most Active
                </h6>
                <div className="small">
                  <Link 
                    href={`/churches/${churchId}/discussions`}
                    className="text-decoration-none fw-medium"
                  >
                    {getMostActiveDiscussion()!.title.length > 35 
                      ? getMostActiveDiscussion()!.title.substring(0, 35) + '...' 
                      : getMostActiveDiscussion()!.title
                    }
                  </Link>
                  <div className="text-muted">
                    {getMostActiveDiscussion()!.commentCount} comments • 
                    by {getMostActiveDiscussion()!.authorName}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="d-grid gap-2">
              <Link 
                href={`/churches/${churchId}/discussions`}
                className="btn btn-primary btn-sm"
              >
                <i className="bi bi-chat-dots me-2"></i>
                Join Discussions
              </Link>
              {['member', 'editor', 'manager', 'admin'].includes(userRole) && (
                <small className="text-center text-muted">
                  As a {userRole}, you can create and participate in discussions
                </small>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 