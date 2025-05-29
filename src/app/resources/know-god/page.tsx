'use client'

import { useContent, getPageContent } from '@/contexts/ContentContext'
import PageLayout from '@/components/PageLayout'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'

export default function HowtoKnowGodPage() {
  const pageContent = getPageContent('resources/know-god')
  const { t } = useTranslation()

  return (
    <PageLayout
      title={pageContent.title}
      description={pageContent.description}
      backgroundImage={pageContent.backgroundImage}
    >
      <div dangerouslySetInnerHTML={{ __html: pageContent.content || '<p>Content coming soon...</p>' }} />

      <div className="mt-5 mb-n5 text-center p-4">
        <h2 className="h4 mb-3">{t('ready_to_take_the_next_step')}</h2>
        <p className="mb-0">{t('if_you_would_like_to_know_more_about_having_a_personal_relationship_with_jesus_christ_we_are_here_to_help')}</p>
      </div>

    </PageLayout>
  )
}
