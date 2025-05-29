import type { Metadata } from 'next'
import { generatePageMetadata, generateOrganizationStructuredData } from '@/lib/metadata'
import { getPageContent } from '@/lib/content'
import AboutPageClient from './AboutPageClient'

// Generate metadata for the about page
export function generateMetadata(): Metadata {
  const pageContent = getPageContent('about')
  
  return generatePageMetadata(pageContent, {
    alternates: {
      canonical: '/about',
    },
  })
}

// Server component that provides metadata and structured data
export default function AboutPage() {
  const pageContent = getPageContent('about')
  
  // Generate structured data for the organization
  const structuredData = generateOrganizationStructuredData()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AboutPageClient pageContent={pageContent} />
    </>
  )
}
