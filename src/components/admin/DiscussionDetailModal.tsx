'use client';

import { useState, useEffect } from 'react';
import { useDiscussions, Discussion, Comment } from '@/contexts/DiscussionsContext';
import { useAuth } from '@/contexts/AuthContext';

interface DiscussionDetailModalProps {
  discussionId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  userRole: string;
}

export default function DiscussionDetailModal({
  discussionId,
  isOpen,
  onClose,
  onUpdate,
  userRole
}: DiscussionDetailModalProps) {
  const { user } = useAuth();
  const { 
    getDiscussion, 
    getDiscussionComments, 
    createComment, 
    updateComment, 
    deleteComment 
  } = useDiscussions();
  
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && discussionId) {
      loadDiscussionAndComments();
    }
  }, [isOpen, discussionId]);

  const loadDiscussionAndComments = async () => {
    setLoading(true);
    try {
      const [discussionData, commentsData] = await Promise.all([
        getDiscussion(discussionId),
        getDiscussionComments(discussionId)
      ]);
      
      setDiscussion(discussionData);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading discussion details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      await createComment(discussionId, { content: newComment });
      setNewComment('');
      await loadDiscussionAndComments();
      onUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error adding comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddReply = async (parentCommentId: string) => {
    if (!replyContent.trim() || submitting) return;

    setSubmitting(true);
    try {
      await createComment(discussionId, { 
        content: replyContent,
        parentCommentId 
      });
      setReplyContent('');
      setReplyingTo(null);
      await loadDiscussionAndComments();
      onUpdate();
    } catch (error) {
      console.error('Error adding reply:', error);
      alert('Error adding reply. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmed) return;

    try {
      await deleteComment(commentId);
      await loadDiscussionAndComments();
      onUpdate();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Error deleting comment. Please try again.');
    }
  };

  const canDeleteComment = (comment: Comment) => {
    return user && (user.uid === comment.authorId || ['admin', 'manager'].includes(userRole));
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

  // Organize comments into threads
  const organizeComments = (comments: Comment[]) => {
    const topLevelComments = comments.filter(c => !c.parentCommentId);
    const replies = comments.filter(c => c.parentCommentId);
    
    return topLevelComments.map(comment => ({
      ...comment,
      replies: replies.filter(r => r.parentCommentId === comment.id)
    }));
  };

  const threadedComments = organizeComments(comments);

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-chat-dots me-2"></i>
              Discussion Details
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading discussion details...</p>
              </div>
            ) : discussion ? (
              <>
                {/* Discussion Content */}
                <div className="card mb-4">
                  <div className="card-body">
                    {/* Title and Pinned Badge */}
                    <div className="d-flex align-items-center mb-3">
                      <h4 className="mb-0 me-2">{discussion.title}</h4>
                      {discussion.isPinned && (
                        <span className="badge bg-warning">
                          <i className="bi bi-pin-angle me-1"></i>
                          Pinned
                        </span>
                      )}
                    </div>

                    {/* Author and Time */}
                    <div className="d-flex align-items-center mb-3 text-muted">
                      <i className="bi bi-person-circle me-2"></i>
                      <span className="me-3">{discussion.authorName}</span>
                      <i className="bi bi-clock me-2"></i>
                      <span className="me-3">{formatRelativeTime(discussion.createdAt)}</span>
                      {discussion.lastActivityAt > discussion.createdAt && (
                        <>
                          <i className="bi bi-arrow-clockwise me-2"></i>
                          <span>Last activity: {formatRelativeTime(discussion.lastActivityAt)}</span>
                        </>
                      )}
                    </div>

                    {/* Content */}
                    <div className="mb-3">
                      <p className="fs-6" style={{ whiteSpace: 'pre-wrap' }}>
                        {discussion.content}
                      </p>
                    </div>

                    {/* Tags */}
                    {discussion.tags.length > 0 && (
                      <div className="mb-3">
                        <small className="text-muted me-2">Tags:</small>
                        <div className="d-inline-flex flex-wrap gap-1">
                          {discussion.tags.map((tag) => (
                            <span key={tag} className="badge bg-secondary">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="d-flex gap-3 text-muted small">
                      <span>
                        <i className="bi bi-chat-left-text me-1"></i>
                        {discussion.commentCount} comment{discussion.commentCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Add Comment Form */}
                {user && (
                  <div className="card mb-4">
                    <div className="card-body">
                      <h6 className="card-title">Add a Comment</h6>
                      <div className="mb-3">
                        <textarea
                          className="form-control"
                          rows={3}
                          placeholder="Share your thoughts..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          disabled={submitting}
                        ></textarea>
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={handleAddComment}
                        disabled={submitting || !newComment.trim()}
                      >
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Posting...</span>
                            </span>
                            Posting...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send me-2"></i>
                            Post Comment
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Comments */}
                <div className="comments-section">
                  <h6 className="mb-3">
                    Comments ({comments.length})
                  </h6>

                  {threadedComments.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      <i className="bi bi-chat-left-text" style={{ fontSize: '2rem' }}></i>
                      <p className="mt-2">No comments yet. Be the first to share your thoughts!</p>
                    </div>
                  ) : (
                    threadedComments.map((comment) => (
                      <div key={comment.id} className="comment-thread mb-4">
                        {/* Main Comment */}
                        <div className="card">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div className="d-flex align-items-center text-muted small">
                                <i className="bi bi-person-circle me-2"></i>
                                <span className="me-2 fw-semibold">{comment.authorName}</span>
                                <i className="bi bi-clock me-1"></i>
                                <span>{formatRelativeTime(comment.createdAt)}</span>
                              </div>
                              
                              <div className="dropdown">
                                <button
                                  className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                >
                                  <i className="bi bi-three-dots"></i>
                                </button>
                                <ul className="dropdown-menu">
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => setReplyingTo(comment.id)}
                                    >
                                      <i className="bi bi-reply me-2"></i>
                                      Reply
                                    </button>
                                  </li>
                                  {canDeleteComment(comment) && (
                                    <li>
                                      <button
                                        className="dropdown-item text-danger"
                                        onClick={() => handleDeleteComment(comment.id)}
                                      >
                                        <i className="bi bi-trash me-2"></i>
                                        Delete
                                      </button>
                                    </li>
                                  )}
                                </ul>
                              </div>
                            </div>
                            
                            <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                              {comment.content}
                            </p>
                            
                            {comment.replyCount > 0 && (
                              <div className="mt-2">
                                <small className="text-muted">
                                  <i className="bi bi-reply me-1"></i>
                                  {comment.replyCount} repl{comment.replyCount === 1 ? 'y' : 'ies'}
                                </small>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Reply Form */}
                        {replyingTo === comment.id && user && (
                          <div className="mt-2 ms-4">
                            <div className="card bg-light">
                              <div className="card-body">
                                <h6 className="card-title small">Reply to {comment.authorName}</h6>
                                <div className="mb-2">
                                  <textarea
                                    className="form-control form-control-sm"
                                    rows={2}
                                    placeholder="Write your reply..."
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    disabled={submitting}
                                  ></textarea>
                                </div>
                                <div className="d-flex gap-2">
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleAddReply(comment.id)}
                                    disabled={submitting || !replyContent.trim()}
                                  >
                                    {submitting ? 'Posting...' : 'Reply'}
                                  </button>
                                  <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => {
                                      setReplyingTo(null);
                                      setReplyContent('');
                                    }}
                                    disabled={submitting}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="replies mt-2 ms-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="card bg-light mb-2">
                                <div className="card-body py-2">
                                  <div className="d-flex justify-content-between align-items-start mb-1">
                                    <div className="d-flex align-items-center text-muted small">
                                      <i className="bi bi-reply me-1"></i>
                                      <i className="bi bi-person-circle me-1"></i>
                                      <span className="me-2 fw-semibold">{reply.authorName}</span>
                                      <i className="bi bi-clock me-1"></i>
                                      <span>{formatRelativeTime(reply.createdAt)}</span>
                                    </div>
                                    
                                    {canDeleteComment(reply) && (
                                      <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDeleteComment(reply.id)}
                                        title="Delete reply"
                                      >
                                        <i className="bi bi-trash"></i>
                                      </button>
                                    )}
                                  </div>
                                  
                                  <p className="mb-0 small" style={{ whiteSpace: 'pre-wrap' }}>
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
                <h4 className="mt-3">Discussion Not Found</h4>
                <p className="text-muted">The discussion you're looking for doesn't exist or has been removed.</p>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 