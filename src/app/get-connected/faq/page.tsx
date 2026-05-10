'use client'

import { useContent } from '@/contexts/ContentContext'
import PageLayout from '@/components/PageLayout'
import CallToAction from '@/components/CallToAction'
import { useTranslation } from '@/lib/i18n'

export default function FAQPage() {
  const { t } = useTranslation()
  const { pages } = useContent()
  const pageContent = pages['get-connected/faq']

  const html =
    pageContent.content?.trim() ||
    `<p>${t('content_coming_soon', { defaultValue: 'Content coming soon...' })}</p>`

  return (
    <PageLayout
      title={pageContent.title}
      description={pageContent.description}
      backgroundImage={pageContent.backgroundImage}
      showCallToAction={false}
    >
      <div className="faq-container">
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <CallToAction />
      </div>
      <style jsx>{`
        .faq-container .faq-booklet :global(p),
        .faq-container .faq-booklet :global(blockquote) {
          line-height: 1.65;
        }
        .faq-container .faq-booklet :global(strong) {
          color: #2c5aa0;
        }
      `}</style>
    </PageLayout>
  )
}
