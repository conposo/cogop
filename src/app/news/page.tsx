'use client'

import Link from 'next/link'
import { useContent } from '@/contexts/ContentContext'

export default function News() {
  const { articles } = useContent()

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="display-4 mb-4">News & Articles</h1>
          <p className="lead mb-5">Stay updated with the latest news from the Church of God of Prophecy worldwide.</p>
        </div>
      </div>

      <div className="row">
        {articles.map((article, index) => (
          <div key={index} className="col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <span className="badge bg-primary mb-2">{article.category}</span>
                <h2 className="card-title h5">{article.title}</h2>
                <p className="card-text">{article.excerpt}</p>
                <p className="text-muted small">{article.date}</p>
                <Link href="#" className="btn btn-outline-primary">Read More</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row mt-5">
        <div className="col-12 text-center">
          <Link href="/about" className="btn btn-primary">Learn More About Us</Link>
        </div>
      </div>
    </div>
  )
} 