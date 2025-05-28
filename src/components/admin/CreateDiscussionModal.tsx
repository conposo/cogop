'use client';

import { useState } from 'react';
import { useDiscussions } from '@/contexts/DiscussionsContext';

interface CreateDiscussionModalProps {
  churchId: string;
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateDiscussionModal({
  churchId,
  isOpen,
  onClose,
  onCreated
}: CreateDiscussionModalProps) {
  const { createDiscussion } = useDiscussions();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      await createDiscussion(churchId, formData);
      
      // Success alert
      alert('✅ Discussion created successfully! Your discussion has been posted and is now visible to other church members.');
      
      onCreated();
      resetForm();
    } catch (error: any) {
      console.error('Error creating discussion:', error);
      
      // Detailed error handling with specific user-friendly messages
      let errorMessage = '❌ Sorry, we couldn\'t create your discussion. ';
      
      if (error.code === 'permission-denied') {
        errorMessage += 'It looks like you don\'t have permission to create discussions in this church.\n\n';
        errorMessage += 'Possible reasons:\n';
        errorMessage += '• You\'re not a member of this church\n';
        errorMessage += '• Your account doesn\'t have discussion permissions\n';
        errorMessage += '• There might be a connectivity issue\n\n';
        errorMessage += 'Please contact a church administrator for help, or try logging out and back in.';
      } else if (error.code === 'unauthenticated') {
        errorMessage += 'You need to be logged in to create discussions.\n\n';
        errorMessage += 'Please log out and log back in, then try again.';
      } else if (error.code === 'network-request-failed') {
        errorMessage += 'There seems to be a network connection problem.\n\n';
        errorMessage += 'Please check your internet connection and try again.';
      } else if (error.code === 'quota-exceeded') {
        errorMessage += 'We\'ve reached our daily limit for new discussions.\n\n';
        errorMessage += 'Please try again tomorrow or contact support.';
      } else if (error.message && error.message.includes('Missing or insufficient permissions')) {
        errorMessage += 'Your account doesn\'t have the required permissions.\n\n';
        errorMessage += 'This usually means:\n';
        errorMessage += '• You need to be added as a church member first\n';
        errorMessage += '• Your role needs discussion permissions\n\n';
        errorMessage += 'Please ask a church administrator to:\n';
        errorMessage += '1. Verify you\'re added as a church member\n';
        errorMessage += '2. Grant you "create_discussions" permission\n';
        errorMessage += '3. Make sure your role includes discussion access';
      } else {
        errorMessage += 'An unexpected error occurred.\n\n';
        errorMessage += `Technical details: ${error.message || error.code || 'Unknown error'}\n\n`;
        errorMessage += 'Please try again in a few moments. If the problem continues, contact support.';
      }
      
      alert(errorMessage);
    } finally {
      setSaving(false);
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

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const commonTags = [
    'prayer', 'bible-study', 'fellowship', 'worship', 'community',
    'events', 'volunteers', 'youth', 'families', 'outreach'
  ];

  const addCommonTag = (tag: string) => {
    if (!formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-plus-circle me-2"></i>
              Create New Discussion
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={saving}
            ></button>
          </div>
          
          <div className="modal-body">
            {/* Title */}
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Discussion Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                id="title"
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
              <label htmlFor="content" className="form-label">
                Discussion Content <span className="text-danger">*</span>
              </label>
              <textarea
                className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                id="content"
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
              <label htmlFor="tags" className="form-label">Tags</label>
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  id="tags"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  disabled={saving || formData.tags.length >= 10}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={addTag}
                  disabled={saving || !tagInput.trim() || formData.tags.length >= 10}
                >
                  Add
                </button>
              </div>

              {/* Current Tags */}
              {formData.tags.length > 0 && (
                <div className="mb-2">
                  <small className="text-muted">Current tags:</small>
                  <div className="d-flex flex-wrap gap-1 mt-1">
                    {formData.tags.map((tag) => (
                      <span key={tag} className="badge bg-primary">
                        {tag}
                        <button
                          type="button"
                          className="btn-close btn-close-white ms-1"
                          style={{ fontSize: '0.7em' }}
                          onClick={() => removeTag(tag)}
                          disabled={saving}
                        ></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Tags */}
              {formData.tags.length < 10 && (
                <div>
                  <small className="text-muted">Common tags:</small>
                  <div className="d-flex flex-wrap gap-1 mt-1">
                    {commonTags
                      .filter(tag => !formData.tags.includes(tag))
                      .slice(0, 6)
                      .map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => addCommonTag(tag)}
                          disabled={saving}
                        >
                          {tag}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {errors.tags && <div className="text-danger small mt-1">{errors.tags}</div>}
              <div className="form-text">
                Tags help organize discussions. Maximum 10 tags allowed.
              </div>
            </div>

            {/* Guidelines */}
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              <strong>Discussion Guidelines:</strong>
              <ul className="mb-0 mt-2">
                <li>Be respectful and kind in your discussions</li>
                <li>Stay on topic and be constructive</li>
                <li>Use appropriate language for a church community</li>
                <li>Focus on building up the community</li>
              </ul>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving || !formData.title.trim() || !formData.content.trim()}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Creating...</span>
                  </span>
                  Creating...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Create Discussion
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 