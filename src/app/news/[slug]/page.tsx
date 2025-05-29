import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateArticleMetadata, generateArticleStructuredData, getLocalizedString } from '@/lib/metadata'
import { fetchArticleById, Article } from '@/lib/dummyContent'
import ArticlePageClient from './ArticlePageClient'

interface Props {
  params: { slug: string }
}

// Generate metadata for the article
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await fetchArticleById(params.slug)
  
  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The article you are looking for does not exist or may have been moved.',
    }
  }

  return generateArticleMetadata(article, params.slug, 'en', {
    alternates: {
      canonical: `/news/${params.slug}`,
    },
  })
}

// Server component that fetches data and provides metadata
export default async function ArticlePage({ params }: Props) {
  const article = await fetchArticleById(params.slug)
  
  if (!article) {
    notFound()
  }

  // Generate structured data
  const structuredData = generateArticleStructuredData(article, params.slug, 'en')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ArticlePageClient article={article} slug={params.slug} />
    </>
  )
} 