'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Article, MultilingualString } from '@/lib/dummyContent';
import { useI18n } from '@/contexts/I18nContext';

interface Props {
  article: Article;
  slug: string;
}

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

export default function ArticlePageClient({ article, slug }: Props) {
  const { language } = useI18n();

  // Use getLocalizedString for display
  const articleTitle = getLocalizedString(article.title, language);
  const articleContent = getLocalizedString(article.content, language);
  const articleSummary = getLocalizedString(article.summary, language);

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
                  width={900}
                  height={400}
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