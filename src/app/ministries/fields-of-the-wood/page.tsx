'use client'

import { useContent, getPageContent } from '@/contexts/ContentContext'
import PageLayout from '@/components/PageLayout'

export default function FieldsoftheWoodPage() {
  const pageContent = getPageContent('ministries/fields-of-the-wood')

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
