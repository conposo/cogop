'use client'

import { useContent } from '@/contexts/ContentContext'
import PageLayout from '@/components/PageLayout'
import { t } from '@/lib/i18n'

export default function GivePage() {
  const { pages } = useContent()
  const pageContent = pages['give']

  if (!pageContent) {
    return <div>Loading...</div>; // Or your preferred loading/fallback
  }

  return (
    <PageLayout
      title={pageContent.title}
      description={pageContent.description}
      backgroundImage={pageContent.backgroundImage}
    >
      <div dangerouslySetInnerHTML={{ __html: pageContent.content || `<p>${t('content_coming_soon', { defaultValue: 'Content coming soon...' })}</p>` }} />
    </PageLayout>
  )
}
