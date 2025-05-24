'use client'

import { useContent, getPageContent } from '@/contexts/ContentContext'
import PageLayout from '@/components/PageLayout'

export default function ChurchLogosPage() {
  const pageContent = getPageContent('resources/church-logos')

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
