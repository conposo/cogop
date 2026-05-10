'use client'

import { getPageContent } from '@/contexts/ContentContext'
import PageLayout from '@/components/PageLayout'

export default function MinistriesLibraryPage() {
  const pageContent = getPageContent('ministries/library')

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
