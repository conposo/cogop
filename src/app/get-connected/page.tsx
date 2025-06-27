'use client'

import { useContent } from '@/contexts/ContentContext'
import PageLayout from '@/components/PageLayout'
import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'

export default function GetConnectedPage() {
  const { t } = useTranslation()
  const { pages } = useContent()
  const pageContent = pages['get-connected']

  return (
    <PageLayout
      title={pageContent.title}
      description={pageContent.description}
      backgroundImage={pageContent.backgroundImage}
    >
      {pageContent.sections ? (
        <div className="row">
          {pageContent.sections.map((section, index) => (
            <div key={index} className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">{section.title}</h3>
                  <p className="card-text">{section.description}</p>
                  <Link href={section.buttonLink} className="btn btn-dark">
                    {section.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: pageContent.content || `<p>${t('content_coming_soon', { defaultValue: 'Content coming soon...' })}</p>` }} />
      )}
    </PageLayout>
  )
}
