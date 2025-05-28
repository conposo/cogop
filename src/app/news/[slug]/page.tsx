'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { fetchArticleById, Article } from '@/lib/dummyContent'; // Using the new function

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
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
        }
        setLoading(false);
      };
      loadArticle();
    }
  }, [slug]);

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

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <article>
            <header className="mb-4">
              <h1 className="fw-bolder mb-1">{article.title}</h1>
              <div className="text-muted fst-italic mb-2">
                Posted on {new Date(article.date).toLocaleDateString()} by {article.author}
              </div>
              {article.category && (
                <span className="badge bg-secondary text-decoration-none link-light">
                  {article.category}
                </span>
              )}
            </header>

            {article.imageUrl && (
              <figure className="mb-4">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  width={900} // Adjust as needed
                  height={400} // Adjust as needed
                  className="img-fluid rounded"
                  style={{ objectFit: 'cover' }}
                />
              </figure>
            )}

            <section className="mb-5">
              {/* This assumes article.content contains HTML. If it's plain text, wrap in <p> or use a markdown parser */}
              {article.content ? (
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              ) : (
                <p>{article.summary}</p> // Fallback to summary if no full content
              )}
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