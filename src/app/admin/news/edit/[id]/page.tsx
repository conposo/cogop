'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export default function EditArticle() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'General',
    published: false,
    featured: false,
    imageUrl: '',
    tags: '',
    type: 'article',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    eventAddress: '',
    eventEndDate: '',
    eventEndTime: ''
  });

  const categories = [
    'General',
    'Ministry Updates',
    'Global Missions',
    'Youth Ministry',
    'Community Outreach',
    'Events',
    'Announcements',
    'Prayer Requests'
  ];

  useEffect(() => {
    const fetchArticle = async () => {
      if (!params.id) return;

      try {
        const docRef = doc(db, 'news', params.id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            title: data.title || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            category: data.category || 'General',
            published: data.published || false,
            featured: data.featured || false,
            imageUrl: data.imageUrl || '',
            tags: data.tags?.join(', ') || '',
            type: data.type || 'article',
            eventDate: data.eventDate || '',
            eventTime: data.eventTime || '',
            eventLocation: data.eventLocation || '',
            eventAddress: data.eventAddress || '',
            eventEndDate: data.eventEndDate || '',
            eventEndTime: data.eventEndTime || ''
          });
        } else {
          alert('Article not found');
          router.push('/admin/news');
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        alert('Error loading article');
      } finally {
        setPageLoading(false);
      }
    };

    fetchArticle();
  }, [params.id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const imageRef = ref(storage, `news-images/${Date.now()}-${file.name}`);
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      setFormData(prev => ({ ...prev, imageUrl: downloadURL }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !params.id) return;

    setLoading(true);
    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const baseData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        published: formData.published,
        featured: formData.featured,
        imageUrl: formData.imageUrl,
        tags: tagsArray,
        updatedAt: serverTimestamp(),
        type: formData.type
      };

      if (formData.type === 'event') {
        Object.assign(baseData, {
          eventDate: formData.eventDate,
          eventTime: formData.eventTime,
          eventLocation: formData.eventLocation,
          eventAddress: formData.eventAddress,
          eventEndDate: formData.eventEndDate || formData.eventDate,
          eventEndTime: formData.eventEndTime || formData.eventTime
        });
      } else {
        Object.assign(baseData, {
          eventDate: null,
          eventTime: null,
          eventLocation: null,
          eventAddress: null,
          eventEndDate: null,
          eventEndTime: null
        });
      }

      const docRef = doc(db, 'news', params.id as string);
      await updateDoc(docRef, baseData);

      router.push('/admin/news');
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Error updating article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading article...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Edit {formData.type === 'event' ? 'Event' : 'Article'}</h1>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => router.back()}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="excerpt" className="form-label">
                    {formData.type === 'event' ? 'Description' : 'Excerpt'} *
                  </label>
                  <textarea
                    className="form-control"
                    id="excerpt"
                    name="excerpt"
                    rows={3}
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    placeholder={formData.type === 'event' ? 'Brief description of the event...' : 'Brief summary of the article...'}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    {formData.type === 'event' ? 'Event Details' : 'Content'} *
                  </label>
                  <textarea
                    className="form-control"
                    id="content"
                    name="content"
                    rows={15}
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder={formData.type === 'event' ? 'Detailed event information...' : 'Write your article content here...'}
                    required
                  />
                </div>

                {formData.type === 'event' && (
                  <>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="eventDate" className="form-label">Event Date *</label>
                          <input
                            type="date"
                            className="form-control"
                            id="eventDate"
                            name="eventDate"
                            value={formData.eventDate}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="eventTime" className="form-label">Start Time *</label>
                          <input
                            type="time"
                            className="form-control"
                            id="eventTime"
                            name="eventTime"
                            value={formData.eventTime}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="eventEndDate" className="form-label">End Date</label>
                          <input
                            type="date"
                            className="form-control"
                            id="eventEndDate"
                            name="eventEndDate"
                            value={formData.eventEndDate}
                            onChange={handleInputChange}
                          />
                          <div className="form-text">Leave empty if same as start date</div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="eventEndTime" className="form-label">End Time</label>
                          <input
                            type="time"
                            className="form-control"
                            id="eventEndTime"
                            name="eventEndTime"
                            value={formData.eventEndTime}
                            onChange={handleInputChange}
                          />
                          <div className="form-text">Leave empty if same as start time</div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="eventLocation" className="form-label">Location *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="eventLocation"
                        name="eventLocation"
                        value={formData.eventLocation}
                        onChange={handleInputChange}
                        placeholder="e.g., Main Sanctuary, Community Hall"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="eventAddress" className="form-label">Address</label>
                      <textarea
                        className="form-control"
                        id="eventAddress"
                        name="eventAddress"
                        rows={2}
                        value={formData.eventAddress}
                        onChange={handleInputChange}
                        placeholder="Full address for the event location"
                      />
                    </div>
                  </>
                )}

                <div className="mb-3">
                  <label htmlFor="tags" className="form-label">Tags</label>
                  <input
                    type="text"
                    className="form-control"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="Enter tags separated by commas (e.g., ministry, community, prayer)"
                  />
                  <div className="form-text">Separate multiple tags with commas</div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Content Type *</label>
                  <div className="btn-group w-100" role="group">
                    <input
                      type="radio"
                      className="btn-check"
                      name="type"
                      id="typeArticle"
                      value="article"
                      checked={formData.type === 'article'}
                      onChange={handleInputChange}
                    />
                    <label className="btn btn-outline-primary" htmlFor="typeArticle">
                      <i className="bi bi-newspaper me-2"></i>
                      Article
                    </label>

                    <input
                      type="radio"
                      className="btn-check"
                      name="type"
                      id="typeEvent"
                      value="event"
                      checked={formData.type === 'event'}
                      onChange={handleInputChange}
                    />
                    <label className="btn btn-outline-primary" htmlFor="typeEvent">
                      <i className="bi bi-calendar-event me-2"></i>
                      Event
                    </label>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">Category *</label>
                  <select
                    className="form-select"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="image" className="form-label">Featured Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                  />
                  {imageUploading && (
                    <div className="mt-2">
                      <div className="spinner-border spinner-border-sm me-2"></div>
                      Uploading image...
                    </div>
                  )}
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{ maxWidth: '200px' }}
                      />
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="published"
                      name="published"
                      checked={formData.published}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="published">
                      Published
                    </label>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="featured">
                      Featured {formData.type}
                    </label>
                  </div>
                  <div className="form-text">
                    Featured {formData.type === 'event' ? 'events' : 'articles'} appear prominently on the homepage
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || imageUploading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Update {formData.type === 'event' ? 'Event' : 'Article'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 