import type { Metadata } from 'next'

// Types for content structure
interface PageContent {
  title: string
  description: string
  content?: string
  backgroundImage?: string
  keywords?: string[]
}

interface ArticleContent {
  title: string | Record<string, string>
  excerpt?: string | Record<string, string>
  summary?: string | Record<string, string>
  content?: string | Record<string, string>
  imageUrl?: string
  author?: string
  date?: string
  category?: string
  tags?: string[]
}

// Helper to get localized string
function getLocalizedString(
  field: string | Record<string, string> | undefined, 
  lang: string = 'en', 
  fallbackLang: string = 'en'
): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'object' && field !== null) {
    return field[lang] || field[fallbackLang] || Object.values(field)[0] || '';
  }
  return '';
}

// Generate metadata for standard pages
export function generatePageMetadata(
  pageContent: PageContent,
  customMetadata?: Partial<Metadata>
): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cogop.org'
  
  const metadata: Metadata = {
    title: pageContent.title,
    description: pageContent.description,
    keywords: pageContent.keywords || [],
    openGraph: {
      title: pageContent.title,
      description: pageContent.description,
      type: 'website',
      images: pageContent.backgroundImage ? [
        {
          url: pageContent.backgroundImage.startsWith('http') 
            ? pageContent.backgroundImage 
            : `${baseUrl}${pageContent.backgroundImage}`,
          width: 1200,
          height: 630,
          alt: pageContent.title,
        },
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageContent.title,
      description: pageContent.description,
      images: pageContent.backgroundImage ? [
        pageContent.backgroundImage.startsWith('http') 
          ? pageContent.backgroundImage 
          : `${baseUrl}${pageContent.backgroundImage}`
      ] : undefined,
    },
  }

  return {
    ...metadata,
    ...customMetadata,
  }
}

// Generate metadata for articles/news
export function generateArticleMetadata(
  article: ArticleContent,
  slug: string,
  language: string = 'en',
  customMetadata?: Partial<Metadata>
): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cogop.org'
  const title = getLocalizedString(article.title, language)
  const description = getLocalizedString(article.excerpt || article.summary, language)
  const url = `${baseUrl}/news/${slug}`
  
  const metadata: Metadata = {
    title: title,
    description: description,
    authors: article.author ? [{ name: article.author }] : undefined,
    publishedTime: article.date,
    keywords: article.tags || [],
    category: article.category,
    openGraph: {
      title: title,
      description: description,
      url: url,
      type: 'article',
      publishedTime: article.date,
      authors: article.author ? [article.author] : undefined,
      section: article.category,
      tags: article.tags,
      images: article.imageUrl ? [
        {
          url: article.imageUrl.startsWith('http') 
            ? article.imageUrl 
            : `${baseUrl}${article.imageUrl}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ] : [
        {
          url: `${baseUrl}/images/default-article-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'Church of God of Prophecy News',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: article.imageUrl ? [
        article.imageUrl.startsWith('http') 
          ? article.imageUrl 
          : `${baseUrl}${article.imageUrl}`
      ] : [`${baseUrl}/images/default-article-image.jpg`],
    },
    alternates: {
      canonical: url,
    },
  }

  return {
    ...metadata,
    ...customMetadata,
  }
}

// Generate metadata for ministry pages
export function generateMinistryMetadata(
  ministryName: string,
  description: string,
  customMetadata?: Partial<Metadata>
): Metadata {
  const keywords = [
    'ministry',
    'church ministry',
    ministryName.toLowerCase(),
    'church of god of prophecy',
    'christian ministry',
    'global ministry'
  ]

  return generatePageMetadata(
    {
      title: ministryName,
      description: description,
      keywords: keywords,
    },
    customMetadata
  )
}

// Generate metadata for regional pages
export function generateRegionalMetadata(
  regionName: string,
  description: string,
  customMetadata?: Partial<Metadata>
): Metadata {
  const keywords = [
    'global ministry',
    'church locations',
    regionName.toLowerCase(),
    'church of god of prophecy',
    'international ministry',
    'worldwide church'
  ]

  return generatePageMetadata(
    {
      title: `${regionName} - Where We Serve`,
      description: description,
      keywords: keywords,
    },
    customMetadata
  )
}

// Generate structured data for organization
export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Church of God of Prophecy",
    "alternateName": "COGOP",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://cogop.org",
    "description": "A global ministry of reconciliation with a heart for missions, serving in 135 countries worldwide.",
    "foundingDate": "1903",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "3720 Keith Street NW",
      "addressLocality": "Cleveland",
      "addressRegion": "TN",
      "postalCode": "37312",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-423-559-5100",
      "contactType": "Customer Service",
      "areaServed": "Worldwide",
      "availableLanguage": ["English", "Spanish", "French", "Portuguese"]
    },
    "sameAs": [
      "https://www.facebook.com/cogophq",
      "https://twitter.com/cogophq",
      "https://www.youtube.com/user/cogophq",
      "https://www.instagram.com/cogophq"
    ],
    "logo": {
      "@type": "ImageObject",
      "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://cogop.org"}/images/logo.png`
    }
  }
}

// Generate structured data for articles
export function generateArticleStructuredData(
  article: ArticleContent,
  slug: string,
  language: string = 'en'
) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cogop.org'
  const title = getLocalizedString(article.title, language)
  const description = getLocalizedString(article.excerpt || article.summary, language)
  
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": article.imageUrl || `${baseUrl}/images/default-article-image.jpg`,
    "author": {
      "@type": "Person",
      "name": article.author || "Church of God of Prophecy"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Church of God of Prophecy",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/logo.png`
      }
    },
    "datePublished": article.date,
    "dateModified": article.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/news/${slug}`
    }
  }
}

export { getLocalizedString } 