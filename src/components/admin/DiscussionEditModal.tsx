'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDiscussions } from '@/contexts/DiscussionsContext';

interface DiscussionEditModalProps {
  discussionId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export default function DiscussionEditModal({
  discussionId,
  isOpen,
  onClose,
  onUpdated
}: DiscussionEditModalProps) {
  const { updateDiscussion, getDiscussion } = useDiscussions();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Load discussion data when modal opens
  const loadDiscussion = useCallback(async () => {
    setLoading(true);
    try {
      const discussion = await getDiscussion(discussionId);
      if (discussion) {
        setFormData({
          title: discussion.title,
          content: discussion.content,
          tags: discussion.tags
        });
      }
    } catch (error) {
      console.error('Error loading discussion:', error);
      alert('Error loading discussion data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [discussionId, getDiscussion]);

  useEffect(() => {
    if (isOpen && discussionId) {
      loadDiscussion();
    }
  }, [isOpen, discussionId, loadDiscussion]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters long';
    } else if (formData.content.length > 5000) {
      newErrors.content = 'Content must be less than 5000 characters';
    }

    if (formData.tags.length > 10) {
      newErrors.tags = 'Maximum 10 tags allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      if (formData.tags.length < 10) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, trimmedTag]
        }));
        setTagInput('');
      } else {
        alert('Maximum 10 tags allowed');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      tags: []
    });
    setTagInput('');
    setErrors({});
  };

  const handleClose = () => {
    if (!saving) {
      resetForm();
      onClose();
    }
  };

  const handleSave = async () => {
    if (!validateForm() || saving) return;

    setSaving(true);
    try {
      await updateDiscussion(discussionId, {
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags: formData.tags
      });
      
      resetForm();
      onUpdated();
      onClose();
    } catch (error: unknown) {
      console.error('Error updating discussion:', error);
      
      if (error && typeof error === 'object' && 'code' in error && error.code === 'permission-denied') {
        alert('You do not have permission to edit this discussion.');
      } else {
        alert('Error updating discussion. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-pencil me-2"></i>
              Edit Discussion
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={saving || loading}
            ></button>
          </div>
          
          <div className="modal-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading discussion...</p>
              </div>
            ) : (
              <>
                {/* Title */}
                <div className="mb-3">
                  <label htmlFor="edit-title" className="form-label">
                    Discussion Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    id="edit-title"
                    placeholder="What would you like to discuss?"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    disabled={saving}
                    maxLength={200}
                  />
                  {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                  <div className="form-text">
                    {formData.title.length}/200 characters
                  </div>
                </div>

                {/* Content */}
                <div className="mb-3">
                  <label htmlFor="edit-content" className="form-label">
                    Discussion Content <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                    id="edit-content"
                    rows={6}
                    placeholder="Share your thoughts, questions, or start a conversation..."
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    disabled={saving}
                    maxLength={5000}
                  ></textarea>
                  {errors.content && <div className="invalid-feedback">{errors.content}</div>}
                  <div className="form-text">
                    {formData.content.length}/5000 characters
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-3">
                  <label htmlFor="edit-tags" className="form-label">
                    Tags <span className="text-muted">(optional)</span>
                  </label>
                  
                  {/* Tag Input */}
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      id="edit-tags"
                      placeholder="Add a tag (e.g., prayer, worship, community)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagInputKeyPress}
                      disabled={saving || formData.tags.length >= 10}
                      maxLength={30}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={handleAddTag}
                      disabled={saving || !tagInput.trim() || formData.tags.length >= 10}
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>

                  {/* Current Tags */}
                  {formData.tags.length > 0 && (
                    <div className="d-flex flex-wrap gap-1 mb-2">
                      {formData.tags.map((tag) => (
                        <span key={tag} className="badge bg-secondary d-flex align-items-center">
                          {tag}
                          <button
                            type="button"
                            className="btn-close btn-close-white ms-1"
                            style={{ fontSize: '0.6rem' }}
                            onClick={() => handleRemoveTag(tag)}
                            disabled={saving}
                          ></button>
                        </span>
                      ))}
                    </div>
                  )}

                  {errors.tags && <div className="text-danger small">{errors.tags}</div>}
                  
                  <div className="form-text">
                    Tags help categorize your discussion. Press Enter or click + to add. ({formData.tags.length}/10)
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={saving || loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary text-white"
              onClick={handleSave}
              disabled={saving || loading || !formData.title.trim() || !formData.content.trim()}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Updating...</span>
                  </span>
                  Updating...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Update Discussion
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 