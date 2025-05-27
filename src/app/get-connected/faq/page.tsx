'use client'

import { useContent, getPageContent } from '@/contexts/ContentContext'
import PageLayout from '@/components/PageLayout'
import { t } from '@/lib/i18n'

export default function FAQPage() {
  const pageContent = getPageContent('get-connected/faq')

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
