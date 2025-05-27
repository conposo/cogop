'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { fetchArticlesFromFirestore, Article } from '@/lib/dummyContent'

export default function News() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true)
      const fetchedArticles = await fetchArticlesFromFirestore()
      setArticles(fetchedArticles)
      setLoading(false)
    }
    loadArticles()
  }, [])

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="display-4 mb-4">News & Articles</h1>
          <p className="lead mb-5">Stay updated with the latest news from the Church of God of Prophecy worldwide.</p>
        </div>
      </div>

      <div className="row">
        {articles.length > 0 ? (
          articles.map((article) => (
            <div key={article.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100">
                {article.imageUrl && (
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    width={400}
                    height={250}
                    className="card-img-top"
                    style={{ objectFit: 'cover' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{article.title}</h5>
                  {article.category && <span className="badge bg-secondary mb-2 align-self-start">{article.category}</span>}
                  <p className="card-text flex-grow-1">{article.summary}</p>
                  <small className="text-muted">
                    {new Date(article.date).toLocaleDateString()} | By: {article.author}
                  </small>
                  <Link href={`/news/${article.slug}`} className="btn btn-sm btn-outline-primary mt-auto align-self-start">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center text-muted">No articles found at the moment. Please check back later.</p>
          </div>
        )}
      </div>

      <div className="row mt-5">
        <div className="col-12 text-center">
          <Link href="/about" className="btn btn-primary">Learn More About Us</Link>
        </div>
      </div>
    </div>
  )
} 