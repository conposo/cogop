'use client';

import { useState, useEffect, useRef } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { useI18n } from '@/contexts/I18nContext';
import { t } from '@/lib/i18n';
import Link from 'next/link';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  type: 'page' | 'article' | 'podcast' | 'event' | 'faq' | 'carousel';
  title: string;
  description: string;
  url: string;
  category?: string;
  date?: string;
  excerpt?: string;
  relevanceScore?: number;
  highlightedTitle?: string;
  highlightedDescription?: string;
}

// Helper function to get localized string or fallback
const getLocalizedString = (field: any, lang: string, fallbackLang: string = 'en'): string => {
  if (!field) return '';
  if (typeof field === 'string') return field; // Handle legacy string format
  if (typeof field === 'object' && field !== null) {
    // Handle multilingual object format
    return field[lang] || field[fallbackLang] || Object.values(field)[0] || '';
  }
  return '';
};

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { pages, articles, events, podcasts, carousel, loading } = useContent();
  const { language } = useI18n();

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

  // Calculate relevance score
  const calculateRelevance = (text: string, searchTerm: string): number => {
    const lowerText = text.toLowerCase();
    const lowerTerm = searchTerm.toLowerCase();
    
    let score = 0;
    
    // Exact match gets highest score
    if (lowerText === lowerTerm) score += 100;
    
    // Title/exact phrase match gets high score
    if (lowerText.includes(lowerTerm)) score += 50;
    
    // Word matches
    const words = lowerTerm.split(' ');
    words.forEach(word => {
      if (lowerText.includes(word)) score += 10;
    });
    
    // Bonus for matches at the beginning
    if (lowerText.startsWith(lowerTerm)) score += 25;
    
    return score;
  };

  // Highlight search terms in text
  const highlightText = (text: string, searchTerm: string): string => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-warning">$1</mark>');
  };

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
        let relevanceScore = 0;
        
        // Search in title
        const titleScore = calculateRelevance(page.title, searchTerm);
        if (titleScore > 0) relevanceScore += titleScore * 2; // Title matches are more important
        
        // Search in description
        const descScore = calculateRelevance(page.description, searchTerm);
        if (descScore > 0) relevanceScore += descScore;
        
        // Search in content
        let contentScore = 0;
        if (page.content) {
          const plainContent = page.content.replace(/<[^>]*>/g, ''); // Remove HTML tags
          contentScore = calculateRelevance(plainContent, searchTerm);
          if (contentScore > 0) relevanceScore += contentScore * 0.5; // Content matches are less important
        }

        // Search in FAQ content
        if (page.faq) {
          page.faq.categories.forEach(category => {
            category.questions.forEach(question => {
              const questionScore = calculateRelevance(question.question, searchTerm);
              const answerScore = calculateRelevance(question.answer, searchTerm);
              if (questionScore > 0 || answerScore > 0) {
                relevanceScore += (questionScore + answerScore) * 0.7;
              }
            });
          });
        }

        if (relevanceScore > 0) {
          searchResults.push({
            type: 'page',
            title: page.title,
            description: page.description,
            url: `/${path}`,
            excerpt: page.content ? extractExcerpt(page.content, term) : undefined,
            relevanceScore,
            highlightedTitle: highlightText(page.title, searchTerm),
            highlightedDescription: highlightText(page.description, searchTerm)
          });
        }
      });

      // Search Firebase articles
      articles.forEach(article => {
        let relevanceScore = 0;
        
        const title = getLocalizedString(article.title, language);
        const excerpt = getLocalizedString(article.summary, language);
        const content = getLocalizedString(article.content, language);
        
        relevanceScore += calculateRelevance(title, searchTerm) * 2;
        relevanceScore += calculateRelevance(article.category, searchTerm);
        if (excerpt) {
          relevanceScore += calculateRelevance(excerpt, searchTerm);
        }
        if (content) {
          relevanceScore += calculateRelevance(content, searchTerm) * 0.5;
        }

        if (relevanceScore > 0) {
          searchResults.push({
            type: 'article',
            title: title,
            description: excerpt || '',
            url: `/news/${article.slug || article.id}`,
            category: article.category,
            date: article.date,
            relevanceScore,
            highlightedTitle: highlightText(title, searchTerm),
            highlightedDescription: highlightText(excerpt || '', searchTerm)
          });
        }
      });

      // Search podcasts
      podcasts.forEach(podcast => {
        let relevanceScore = 0;
        
        relevanceScore += calculateRelevance(podcast.title, searchTerm) * 2;
        relevanceScore += calculateRelevance(podcast.series, searchTerm);
        relevanceScore += calculateRelevance(podcast.description, searchTerm);
        relevanceScore += calculateRelevance(podcast.host, searchTerm);

        if (relevanceScore > 0) {
          searchResults.push({
            type: 'podcast',
            title: podcast.title,
            description: podcast.description,
            url: '/resources/podcasts',
            category: podcast.series,
            relevanceScore,
            highlightedTitle: highlightText(podcast.title, searchTerm),
            highlightedDescription: highlightText(podcast.description, searchTerm)
          });
        }
      });

      // Search Firebase events
      events.forEach(event => {
        let relevanceScore = 0;
        
        const title = getLocalizedString(event.title, language);
        const excerpt = getLocalizedString(event.excerpt, language);
        const content = getLocalizedString(event.content, language);
        
        relevanceScore += calculateRelevance(title, searchTerm) * 2;
        relevanceScore += calculateRelevance(event.eventLocation, searchTerm);
        if (event.eventAddress) {
          relevanceScore += calculateRelevance(event.eventAddress, searchTerm);
        }
        if (excerpt) {
          relevanceScore += calculateRelevance(excerpt, searchTerm);
        }
        if (content) {
          relevanceScore += calculateRelevance(content, searchTerm) * 0.5;
        }
        relevanceScore += calculateRelevance(event.category, searchTerm);

        if (relevanceScore > 0) {
          const eventDescription = excerpt || `${event.eventDate} - ${event.eventLocation}`;
          searchResults.push({
            type: 'event',
            title: title,
            description: eventDescription,
            url: `/events/${event.id}`,
            category: event.category,
            date: event.eventDate,
            relevanceScore,
            highlightedTitle: highlightText(title, searchTerm),
            highlightedDescription: highlightText(eventDescription, searchTerm)
          });
        }
      });

      // Search carousel content
      carousel.forEach(slide => {
        let relevanceScore = 0;
        
        relevanceScore += calculateRelevance(slide.title, searchTerm) * 2;
        relevanceScore += calculateRelevance(slide.description, searchTerm);

        if (relevanceScore > 0) {
          searchResults.push({
            type: 'carousel',
            title: slide.title,
            description: slide.description,
            url: slide.buttonLink || '/',
            relevanceScore,
            highlightedTitle: highlightText(slide.title, searchTerm),
            highlightedDescription: highlightText(slide.description, searchTerm)
          });
        }
      });

      // Sort results by relevance score (highest first)
      searchResults.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

      setResults(searchResults.slice(0, 15)); // Limit to 15 results
      setSelectedIndex(-1);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm, pages, articles, events, podcasts, carousel, language]);

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
      case 'faq': return 'bi-question-circle';
      case 'carousel': return 'bi-images';
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
      case 'faq': return t('faq', { defaultValue: 'FAQ' });
      case 'carousel': return t('featured', { defaultValue: 'Featured' });
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
            {loading && !searchTerm.trim() ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">{t('loading', { defaultValue: 'Loading...' })}</span>
                </div>
                <p className="text-muted">{t('loading', { defaultValue: 'Loading content...' })}</p>
              </div>
            ) : !searchTerm.trim() ? (
              <div className="text-center py-5">
                <i className="bi bi-search display-4 text-muted mb-3"></i>
                <h5 className="text-muted">{t('start_typing_to_search', { defaultValue: 'Start typing to search...' })}</h5>
                <p className="text-muted small">
                  {t('search_help_text', { defaultValue: 'Search through pages, articles, podcasts, events, and more' })}
                </p>
                <div className="row text-start mt-4">
                  <div className="col-md-6">
                    <h6 className="text-muted">{t('search_tips', { defaultValue: 'Search Tips:' })}</h6>
                    <ul className="list-unstyled small text-muted">
                      <li><i className="bi bi-check2 text-success me-2"></i>{t('search_tip_1', { defaultValue: 'Use specific keywords' })}</li>
                      <li><i className="bi bi-check2 text-success me-2"></i>{t('search_tip_2', { defaultValue: 'Try different terms' })}</li>
                      <li><i className="bi bi-check2 text-success me-2"></i>{t('search_tip_3', { defaultValue: 'Search by category' })}</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted">{t('search_categories', { defaultValue: 'Search Categories:' })}</h6>
                    <ul className="list-unstyled small text-muted">
                      <li><i className="bi bi-file-text text-primary me-2"></i>{t('pages', { defaultValue: 'Pages' })}</li>
                      <li><i className="bi bi-newspaper text-primary me-2"></i>{t('articles', { defaultValue: 'Articles' })} ({articles.length})</li>
                      <li><i className="bi bi-mic text-primary me-2"></i>{t('podcasts', { defaultValue: 'Podcasts' })}</li>
                      <li><i className="bi bi-calendar-event text-primary me-2"></i>{t('events', { defaultValue: 'Events' })} ({events.length})</li>
                    </ul>
                  </div>
                </div>
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
                <div className="mt-3">
                  <small className="text-muted">
                    {t('search_suggestions', { defaultValue: 'Try searching for: "ministry", "events", "contact", "about"' })}
                  </small>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <small className="text-muted">
                    {t('search_results_count', { defaultValue: `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${searchTerm}"` })}
                  </small>
                </div>
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
                            <h6 
                              className="mb-0" 
                              dangerouslySetInnerHTML={{ 
                                __html: result.highlightedTitle || result.title 
                              }}
                            />
                            <div className="d-flex align-items-center ms-2">
                              {result.relevanceScore && result.relevanceScore > 50 && (
                                <span className="badge bg-success me-2" style={{ fontSize: '0.6rem' }}>
                                  {t('best_match', { defaultValue: 'Best Match' })}
                                </span>
                              )}
                              <small className="text-muted">
                                {getResultTypeLabel(result.type)}
                              </small>
                            </div>
                          </div>
                          <p 
                            className="mb-1 text-muted small" 
                            dangerouslySetInnerHTML={{ 
                              __html: result.highlightedDescription || result.description 
                            }}
                          />
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            {result.category && (
                              <span className="badge bg-light text-dark">{result.category}</span>
                            )}
                            {result.date && (
                              <small className="text-muted">{result.date}</small>
                            )}
                          </div>
                          {result.excerpt && (
                            <p className="mb-0 text-muted small mt-1" style={{ fontSize: '0.75rem' }}>
                              {result.excerpt}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
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