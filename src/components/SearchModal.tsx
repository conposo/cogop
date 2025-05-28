'use client';

import { useState, useEffect, useRef } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { t } from '@/lib/i18n';
import Link from 'next/link';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  type: 'page' | 'article' | 'podcast' | 'event';
  title: string;
  description: string;
  url: string;
  category?: string;
  date?: string;
  excerpt?: string;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { pages, articles, podcasts, events } = useContent();

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            window.location.href = results[selectedIndex].url;
            onClose();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // Perform search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay for better UX
    const searchTimeout = setTimeout(() => {
      const searchResults: SearchResult[] = [];
      const term = searchTerm.toLowerCase();

      // Search pages
      Object.entries(pages).forEach(([path, page]) => {
        const titleMatch = page.title.toLowerCase().includes(term);
        const descMatch = page.description.toLowerCase().includes(term);
        const contentMatch = page.content?.toLowerCase().includes(term);

        if (titleMatch || descMatch || contentMatch) {
          searchResults.push({
            type: 'page',
            title: page.title,
            description: page.description,
            url: `/${path}`,
            excerpt: page.content ? extractExcerpt(page.content, term) : undefined
          });
        }
      });

      // Search articles
      articles.forEach(article => {
        const titleMatch = article.title.toLowerCase().includes(term);
        const categoryMatch = article.category.toLowerCase().includes(term);
        const excerptMatch = article.excerpt?.toLowerCase().includes(term);

        if (titleMatch || categoryMatch || excerptMatch) {
          searchResults.push({
            type: 'article',
            title: article.title,
            description: article.excerpt || '',
            url: '#', // Articles don't have individual pages yet
            category: article.category,
            date: article.date
          });
        }
      });

      // Search podcasts
      podcasts.forEach(podcast => {
        const titleMatch = podcast.title.toLowerCase().includes(term);
        const seriesMatch = podcast.series.toLowerCase().includes(term);
        const descMatch = podcast.description.toLowerCase().includes(term);
        const hostMatch = podcast.host.toLowerCase().includes(term);

        if (titleMatch || seriesMatch || descMatch || hostMatch) {
          searchResults.push({
            type: 'podcast',
            title: podcast.title,
            description: podcast.description,
            url: '/resources/podcasts',
            category: podcast.series
          });
        }
      });

      // Search events
      events.forEach(event => {
        const titleMatch = event.title.toLowerCase().includes(term);
        const locationMatch = event.location.toLowerCase().includes(term);
        const descMatch = event.description?.toLowerCase().includes(term);
        const categoryMatch = event.category?.toLowerCase().includes(term);

        if (titleMatch || locationMatch || descMatch || categoryMatch) {
          searchResults.push({
            type: 'event',
            title: event.title,
            description: event.description || `${event.date} - ${event.location}`,
            url: '/get-connected/calendar',
            category: event.category,
            date: event.date
          });
        }
      });

      // Sort results by relevance (title matches first)
      searchResults.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(term);
        const bTitle = b.title.toLowerCase().includes(term);
        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;
        return 0;
      });

      setResults(searchResults.slice(0, 10)); // Limit to 10 results
      setSelectedIndex(-1);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm, pages, articles, podcasts, events]);

  // Extract excerpt around search term
  const extractExcerpt = (content: string, term: string): string => {
    const plainText = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const index = plainText.toLowerCase().indexOf(term.toLowerCase());
    if (index === -1) return plainText.substring(0, 150) + '...';
    
    const start = Math.max(0, index - 75);
    const end = Math.min(plainText.length, index + 75);
    let excerpt = plainText.substring(start, end);
    
    if (start > 0) excerpt = '...' + excerpt;
    if (end < plainText.length) excerpt = excerpt + '...';
    
    return excerpt;
  };

  // Get icon for result type
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'page': return 'bi-file-text';
      case 'article': return 'bi-newspaper';
      case 'podcast': return 'bi-mic';
      case 'event': return 'bi-calendar-event';
      default: return 'bi-search';
    }
  };

  // Get result type label
  const getResultTypeLabel = (type: string) => {
    switch (type) {
      case 'page': return t('page', { defaultValue: 'Page' });
      case 'article': return t('article', { defaultValue: 'Article' });
      case 'podcast': return t('podcast', { defaultValue: 'Podcast' });
      case 'event': return t('event', { defaultValue: 'Event' });
      default: return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <div className="w-100">
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-transparent border-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="form-control border-0 shadow-none"
                  placeholder={t('search_placeholder', { defaultValue: 'Search pages, articles, podcasts, and events...' })}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                  aria-label={t('close', { defaultValue: 'Close' })}
                ></button>
              </div>
            </div>
          </div>
          
          <div className="modal-body pt-2" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {!searchTerm.trim() ? (
              <div className="text-center py-5">
                <i className="bi bi-search display-4 text-muted mb-3"></i>
                <h5 className="text-muted">{t('start_typing_to_search', { defaultValue: 'Start typing to search...' })}</h5>
                <p className="text-muted small">
                  {t('search_help_text', { defaultValue: 'Search through pages, articles, podcasts, and events' })}
                </p>
              </div>
            ) : isSearching ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">{t('searching', { defaultValue: 'Searching...' })}</span>
                </div>
                <p className="text-muted">{t('searching', { defaultValue: 'Searching...' })}</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-search display-4 text-muted mb-3"></i>
                <h5 className="text-muted">{t('no_results_found', { defaultValue: 'No results found' })}</h5>
                <p className="text-muted small">
                  {t('no_results_help', { defaultValue: 'Try different keywords or check your spelling' })}
                </p>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {results.map((result, index) => (
                  <Link
                    key={index}
                    href={result.url}
                    className={`list-group-item list-group-item-action border-0 ${
                      index === selectedIndex ? 'active' : ''
                    }`}
                    onClick={onClose}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="d-flex align-items-start">
                      <div className="me-3 mt-1">
                        <i className={`bi ${getResultIcon(result.type)} text-primary`}></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <h6 className="mb-0">{result.title}</h6>
                          <small className="text-muted ms-2">
                            {getResultTypeLabel(result.type)}
                          </small>
                        </div>
                        <p className="mb-1 text-muted small">{result.description}</p>
                        {result.category && (
                          <span className="badge bg-light text-dark me-2">{result.category}</span>
                        )}
                        {result.date && (
                          <small className="text-muted">{result.date}</small>
                        )}
                        {result.excerpt && (
                          <p className="mb-0 text-muted small mt-1">{result.excerpt}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          {results.length > 0 && (
            <div className="modal-footer border-0 pt-0">
              <small className="text-muted">
                <i className="bi bi-arrow-up-down me-1"></i>
                {t('search_navigation_help', { defaultValue: 'Use arrow keys to navigate, Enter to select, Esc to close' })}
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 