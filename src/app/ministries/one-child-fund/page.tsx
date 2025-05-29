'use client'

import { useContent } from '@/contexts/ContentContext'
import PageLayout from '@/components/PageLayout'

export default function OneChildFundPage() {
  const { pages } = useContent()
  const pageContent = pages['ministries/one-child-fund']

  if (!pageContent) {
    return <div>Loading...</div>; // Or your preferred loading/fallback
  }

  return (
    <PageLayout
      title={pageContent.title}
      description={pageContent.description}
      backgroundImage={pageContent.backgroundImage}
    >
      <div dangerouslySetInnerHTML={{ __html: pageContent.content || '<p>Content coming soon...</p>' }} />
    </PageLayout>
  )
}
