'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  published: boolean;
  featured: boolean;
  createdAt: any;
  updatedAt: any;
  authorId: string;
  authorName: string;
  imageUrl?: string;
  tags: string[];
  type?: string; // 'article' or 'event'
  // Event-specific fields
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  eventAddress?: string;
  eventEndDate?: string;
  eventEndTime?: string;
}

export default function NewsManagement() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'articles' | 'events'>('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const articlesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NewsArticle[];
      setArticles(articlesData);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, 'news', articleId));
        setArticles(articles.filter(article => article.id !== articleId));
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('Error deleting item. Please try again.');
      }
    }
  };

  const filteredArticles = articles.filter(article => {
    if (filter === 'published') return article.published;
    if (filter === 'draft') return !article.published;
    if (filter === 'articles') return (article.type || 'article') === 'article';
    if (filter === 'events') return article.type === 'event';
    return true;
  });

  const formatEventDate = (article: NewsArticle) => {
    if (article.type !== 'event' || !article.eventDate) return null;
    
    const startDate = new Date(article.eventDate);
    const endDate = article.eventEndDate ? new Date(article.eventEndDate) : null;
    
    let dateStr = startDate.toLocaleDateString();
    if (endDate && endDate.getTime() !== startDate.getTime()) {
      dateStr += ` - ${endDate.toLocaleDateString()}`;
    }
    
    if (article.eventTime) {
      dateStr += ` at ${article.eventTime}`;
      if (article.eventEndTime && article.eventEndTime !== article.eventTime) {
        dateStr += ` - ${article.eventEndTime}`;
      }
    }
    
    return dateStr;
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
        <h1>Content Management</h1>
        <Link href="/admin/news/new" className="btn btn-dark">
          <i className="bi bi-plus-circle me-2"></i>
          Add New Content
        </Link>
      </div>

      {/* Filter Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Content ({articles.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${filter === 'articles' ? 'active' : ''}`}
            onClick={() => setFilter('articles')}
          >
            Articles ({articles.filter(a => (a.type || 'article') === 'article').length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${filter === 'events' ? 'active' : ''}`}
            onClick={() => setFilter('events')}
          >
            Events ({articles.filter(a => a.type === 'event').length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${filter === 'published' ? 'active' : ''}`}
            onClick={() => setFilter('published')}
          >
            Published ({articles.filter(a => a.published).length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${filter === 'draft' ? 'active' : ''}`}
            onClick={() => setFilter('draft')}
          >
            Drafts ({articles.filter(a => !a.published).length})
          </button>
        </li>
      </ul>

      {/* Articles Table */}
      <div className="card">
        <div className="card-body">
          {filteredArticles.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Author</th>
                    <th>Date/Event Info</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((article) => (
                    <tr key={article.id}>
                      <td>
                        <div>
                          <h6 className="mb-1">{article.title}</h6>
                          <small className="text-muted">{article.excerpt}</small>
                          {article.featured && (
                            <span className="badge bg-warning text-dark ms-2">Featured</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${article.type === 'event' ? 'bg-info' : 'bg-primary'}`}>
                          <i className={`bi ${article.type === 'event' ? 'bi-calendar-event' : 'bi-newspaper'} me-1`}></i>
                          {article.type === 'event' ? 'Event' : 'Article'}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-secondary">{article.category}</span>
                      </td>
                      <td>
                        <span className={`badge ${article.published ? 'bg-success' : 'bg-warning'}`}>
                          {article.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td>{article.authorName}</td>
                      <td>
                        {article.type === 'event' ? (
                          <div>
                            <small className="text-muted d-block">
                              {formatEventDate(article)}
                            </small>
                            {article.eventLocation && (
                              <small className="text-muted d-block">
                                <i className="bi bi-geo-alt me-1"></i>
                                {article.eventLocation}
                              </small>
                            )}
                          </div>
                        ) : (
                          <small className="text-muted">
                            {article.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                          </small>
                        )}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link
                            href={`/admin/news/edit/${article.id}`}
                            className="btn btn-outline-primary"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(article.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-newspaper fs-1 text-muted"></i>
              <h4 className="mt-3">No content found</h4>
              <p className="text-muted">
                {filter === 'all' 
                  ? 'Start by creating your first article or event.'
                  : `No ${filter} found.`
                }
              </p>
              {filter === 'all' && (
                <Link href="/admin/news/new" className="btn btn-dark">
                  <i className="bi bi-plus-circle me-2"></i>
                  Create First Content
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 