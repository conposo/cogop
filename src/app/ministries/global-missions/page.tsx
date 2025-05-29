import type { Metadata } from 'next'
import { generateMinistryMetadata } from '@/lib/metadata'
import { getPageContent } from '@/lib/content'
import GlobalMissionsPageClient from './GlobalMissionsPageClient'

// Generate metadata for the global missions page
export function generateMetadata(): Metadata {
  const pageContent = getPageContent('ministries/global-missions')
  
  return generateMinistryMetadata(
    pageContent.title,
    pageContent.description,
    {
      alternates: {
        canonical: '/ministries/global-missions',
      },
      keywords: [
        ...pageContent.keywords || [],
        'global evangelism',
        'worldwide missions',
        'church planting',
        '135 countries'
      ]
    }
  )
}

// Server component that provides metadata
export default function GlobalMissionsPage() {
  const pageContent = getPageContent('ministries/global-missions')

  return <GlobalMissionsPageClient pageContent={pageContent} />
}
