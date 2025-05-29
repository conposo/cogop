'use client'

import PageLayout from '@/components/PageLayout'
import { t } from '@/lib/i18n'
import { PageContent } from '@/lib/metadata'

interface Props {
  pageContent: PageContent
}

export default function AboutPageClient({ pageContent }: Props) {
  return (
    <PageLayout
      title={pageContent.title}
      description={pageContent.description}
      backgroundImage={pageContent.backgroundImage}
    >
      <div dangerouslySetInnerHTML={{ 
        __html: pageContent.content || `<p>${t('content_coming_soon', { defaultValue: 'Content coming soon...' })}</p>` 
      }} />
    </PageLayout>
  )
} 