'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { fetchArticleById, Article, MultilingualString } from '@/lib/dummyContent'; // Import MultilingualString
import { useI18n } from '@/contexts/I18nContext'; // Import useI18n

// Helper function to get localized string or fallback
const getLocalizedString = (field: MultilingualString | string | undefined, lang: string, fallbackLang: string = 'en'): string => {
  if (!field) return '';
  if (typeof field === 'string') return field; // Handle legacy string format
  if (typeof field === 'object' && field !== null) {
    // Handle multilingual object format
    return field[lang] || field[fallbackLang] || Object.values(field)[0] || '';
  }
  return '';
};

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useI18n(); // Get current language
  const slug = params.slug as string; // Or params.id if you set up the route as [id]

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const loadArticle = async () => {
        setLoading(true);
        const fetchedArticle = await fetchArticleById(slug); // Use slug as ID
        if (fetchedArticle) {
          setArticle(fetchedArticle);
        } else {
          // Optionally, redirect to a 404 page or show a message
          // For now, just logs and shows "not found"
          console.log(`Article with slug/ID '${slug}' not found.`);
          router.push('/news');
        }
        setLoading(false);
      };
      loadArticle();
    }
  }, [slug, router]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading article...</span>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container py-5 text-center">
        <h1 className="display-4">Article Not Found</h1>
        <p className="lead">The article you are looking for does not exist or may have been moved.</p>
        <Link href="/news" className="btn btn-dark mt-3">
          Back to News
        </Link>
      </div>
    );
  }

  // Use getLocalizedString for display
  const articleTitle = getLocalizedString(article.title, language);
  const articleContent = getLocalizedString(article.content, language);
  const articleSummary = getLocalizedString(article.summary, language); // If needed for meta tags or elsewhere

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <article>
            <header className="mb-4">
              <h1 className="fw-bolder mb-1">{articleTitle}</h1>
              <div className="text-muted fst-italic mb-2">
                Posted on {new Date(article.date).toLocaleDateString()} by {article.author}
              </div>
              {article.category && (
                <span className="badge bg-secondary text-decoration-none link-light">
                  {article.category}
                </span>
              )}
            </header>

            {article.imageUrl && article.imageUrl !== '' ? (
              <figure className="mb-4">
                <Image
                  src={article.imageUrl}
                  alt={articleTitle}
                  width={900} // Adjust as needed
                  height={400} // Adjust as needed
                  className="img-fluid rounded"
                  style={{ objectFit: 'cover' }}
                />
              </figure>
            ) : (
              <figure className="mb-4">
                <img 
                  src="/images/default-article-image.jpg" 
                  alt="Default Article Image"
                  className="img-fluid rounded"
                  style={{ objectFit: 'cover' }}
                />
              </figure>
            )}

            <section className="mb-5">
              {/* This assumes articleContent is HTML. If it's plain text, render directly. */}
              {/* For security, if content can be user-generated HTML, use a sanitizer or ensure it's safe. */}
              <div dangerouslySetInnerHTML={{ __html: articleContent }} />
            </section>
          </article>

          <div className="mt-5">
            <Link href="/news" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left me-2"></i>
              Back to All News
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 