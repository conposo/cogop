'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

// Define a type for multilingual fields
interface MultilingualString {
  [key: string]: string;
}

export default function NewArticle() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: { en: '' } as MultilingualString,
    excerpt: { en: '' } as MultilingualString,
    content: { en: '' } as MultilingualString,
    category: 'General',
    languages: ['en'], // Default selected language
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

  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'bg', name: 'Български' }
  ];

  useEffect(() => {
    setFormData(prev => {
      const newTitle: MultilingualString = { ...prev.title };
      const newExcerpt: MultilingualString = { ...prev.excerpt };
      const newContent: MultilingualString = { ...prev.content };

      (prev.languages || []).forEach(lang => {
        if (newTitle[lang] === undefined) newTitle[lang] = '';
        if (newExcerpt[lang] === undefined) newExcerpt[lang] = '';
        if (newContent[lang] === undefined) newContent[lang] = '';
      });
      
      return { ...prev, title: newTitle, excerpt: newExcerpt, content: newContent };
    });
  }, [formData.languages]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    langForTextField?: string // language code for title, excerpt, content
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked; // For checkboxes

    if (name === "languages") { // Checkbox for selecting a language from availableLanguages
      setFormData(prev => {
        const currentSelectedLanguages = prev.languages || [];
        const newSelectedLanguages = checked
          ? [...currentSelectedLanguages, value] // Add language if checked
          : currentSelectedLanguages.filter(l => l !== value); // Remove if unchecked
        
        // Ensure title, excerpt, content objects have keys for all selected languages
        const newTitle = { ...prev.title };
        const newExcerpt = { ...prev.excerpt };
        const newContent = { ...prev.content };

        newSelectedLanguages.forEach(lang => {
          if (newTitle[lang] === undefined) newTitle[lang] = '';
          if (newExcerpt[lang] === undefined) newExcerpt[lang] = '';
          if (newContent[lang] === undefined) newContent[lang] = '';
        });
        // Optional: clean up if language is removed and you want to delete its data
        // Object.keys(newTitle).forEach(lang => { if (!newSelectedLanguages.includes(lang)) delete newTitle[lang]; });
        // Object.keys(newExcerpt).forEach(lang => { if (!newSelectedLanguages.includes(lang)) delete newExcerpt[lang]; });
        // Object.keys(newContent).forEach(lang => { if (!newSelectedLanguages.includes(lang)) delete newContent[lang]; });

        return { 
          ...prev, 
          languages: newSelectedLanguages,
          title: newTitle,
          excerpt: newExcerpt,
          content: newContent
        };
      });
    } else if (langForTextField && (name === 'title' || name === 'excerpt' || name === 'content')) {
      // Input for title, excerpt, or content for a specific language
      setFormData(prev => ({
        ...prev,
        [name]: {
          ...(prev[name] as MultilingualString),
          [langForTextField]: value
        }
      }));
    } else { // Other fields (category, published, featured, imageUrl, tags, type, event details)
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
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
    if (!user) return;

    setLoading(true);
    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Ensure that only the data for selected languages is saved for title, excerpt, content
      const titleData: MultilingualString = {};
      const excerptData: MultilingualString = {};
      const contentData: MultilingualString = {};

      formData.languages.forEach(lang => {
        if (formData.title[lang] !== undefined) titleData[lang] = formData.title[lang];
        if (formData.excerpt[lang] !== undefined) excerptData[lang] = formData.excerpt[lang];
        if (formData.content[lang] !== undefined) contentData[lang] = formData.content[lang];
      });

      const baseData: any = {
        title: titleData,
        excerpt: excerptData,
        content: contentData,
        category: formData.category,
        languages: formData.languages,
        published: formData.published,
        featured: formData.featured,
        imageUrl: formData.imageUrl,
        tags: tagsArray,
        authorId: user.uid,
        authorName: user.displayName || user.email || 'Unknown Author',
        createdAt: serverTimestamp(),
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
      }

      await addDoc(collection(db, 'news'), baseData);

      router.push('/admin/news');
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Error creating article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Add New {formData.type === 'event' ? 'Event' : 'Article'}</h1>
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
                {/* Language-specific fields for Title, Excerpt, Content */}
                {(formData.languages || []).map(langCode => {
                  const language = availableLanguages.find(l => l.code === langCode);
                  return (
                    <div key={langCode} className="mb-4 p-3 border rounded">
                      <h5 className="mb-3">{language ? language.name : langCode.toUpperCase()} Content</h5>
                      <div className="mb-3">
                        <label htmlFor={`title-${langCode}`} className="form-label">Title *</label>
                        <input
                          type="text"
                          className="form-control"
                          id={`title-${langCode}`}
                          name="title" // Name is generic, lang is passed to handler
                          value={formData.title[langCode] || ''}
                          onChange={(e) => handleInputChange(e, langCode)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor={`excerpt-${langCode}`} className="form-label">
                          {formData.type === 'event' ? 'Description' : 'Excerpt'} *
                        </label>
                        <textarea
                          className="form-control"
                          id={`excerpt-${langCode}`}
                          name="excerpt" // Name is generic
                          rows={3}
                          value={formData.excerpt[langCode] || ''}
                          onChange={(e) => handleInputChange(e, langCode)}
                          placeholder={formData.type === 'event' ? 'Brief description of the event...' : 'Brief summary of the article...'}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor={`content-${langCode}`} className="form-label">
                          {formData.type === 'event' ? 'Event Details' : 'Content'} *
                        </label>
                        <textarea
                          className="form-control"
                          id={`content-${langCode}`}
                          name="content" // Name is generic
                          rows={15}
                          value={formData.content[langCode] || ''}
                          onChange={(e) => handleInputChange(e, langCode)}
                          placeholder={formData.type === 'event' ? 'Detailed event information...' : 'Write your article content here...'}
                          required
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Event specific fields (not multilingual) */}
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
                            onChange={(e) => handleInputChange(e)}
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
                            onChange={(e) => handleInputChange(e)}
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
                            onChange={(e) => handleInputChange(e)}
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
                            onChange={(e) => handleInputChange(e)}
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
                        onChange={(e) => handleInputChange(e)}
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
                        onChange={(e) => handleInputChange(e)}
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
                    onChange={(e) => handleInputChange(e)}
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
                      onChange={(e) => handleInputChange(e)}
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
                      onChange={(e) => handleInputChange(e)}
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
                    onChange={(e) => handleInputChange(e)}
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
                  <label className="form-label">Languages *</label>
                  {availableLanguages.map(language => (
                    <div key={language.code} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`language-${language.code}`}
                        name="languages"
                        value={language.code}
                        checked={formData.languages.includes(language.code)}
                        onChange={(e) => handleInputChange(e, language.code)}
                      />
                      <label className="form-check-label" htmlFor={`language-${language.code}`}>
                        {language.name}
                      </label>
                    </div>
                  ))}
                  <div className="form-text">Select all languages this content will be available in</div>
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
                      onChange={(e) => handleInputChange(e)}
                    />
                    <label className="form-check-label" htmlFor="published">
                      Publish immediately
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
                      onChange={(e) => handleInputChange(e)}
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
                    className="btn btn-dark"
                    disabled={loading || imageUploading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Create {formData.type === 'event' ? 'Event' : 'Article'}
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