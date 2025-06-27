'use client'

import { useContent } from '@/contexts/ContentContext'
import PageLayout from '@/components/PageLayout'
import { useTranslation } from '@/lib/i18n'

export default function ScheduleaTourPage() {
  const { t } = useTranslation()
  const { pages } = useContent()
  const pageContent = pages['get-connected/schedule-tour']

  if (!pageContent) {
    return <div>{t('loading', { defaultValue: 'Loading...' })}</div>; // Or your preferred loading/fallback
  }

  return (
    <PageLayout
      title={pageContent.title}
      description={pageContent.description}
      backgroundImage={pageContent.backgroundImage}
      showCallToAction={false}
    >
      <div dangerouslySetInnerHTML={{ __html: pageContent.content || `<p>${t('content_coming_soon', { defaultValue: 'Content coming soon...' })}</p>` }} />
    </PageLayout>
  )
}
