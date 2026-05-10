'use client'

import { useContent } from '@/contexts/ContentContext'
import PageLayout from '@/components/PageLayout'
import CallToAction from '@/components/CallToAction'
import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'

export default function FAQPage() {
  const { t } = useTranslation()
  const { pages } = useContent()
  const pageContent = pages['get-connected/faq']

  return (
    <PageLayout
      title={pageContent.title}
      description={pageContent.description}
      backgroundImage={pageContent.backgroundImage}
      showCallToAction={false}
    >
      {pageContent.faq ? (
        <div className="faq-container">
          <div className="row">
            <div className="col-12">
              <p className="lead">
                {pageContent.faq.introduction}{' '}
                <Link href="/get-connected/contact">{t('contact_us', { defaultValue: 'contact us' })}</Link>.
              </p>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12">
              <div className="accordion" id="faqAccordion">
                {pageContent.faq.categories.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h3 className="mb-3 mt-4">{category.title}</h3>
                    {category.questions.map((question, questionIndex) => (
                      <div key={question.id} className="accordion-item">
                        <h2 className="accordion-header" id={`heading${question.id}`}>
                          <button
                            className={`accordion-button bg-transparent ${question.isExpanded ? '' : 'collapsed'}`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse${question.id}`}
                            aria-expanded={question.isExpanded || false}
                            aria-controls={`collapse${question.id}`}
                          >
                            {question.question}
                          </button>
                        </h2>
                        <div
                          id={`collapse${question.id}`}
                          className={`accordion-collapse collapse ${question.isExpanded ? 'show' : ''}`}
                          aria-labelledby={`heading${question.id}`}
                          data-bs-parent="#faqAccordion"
                        >
                          <div className="accordion-body">
                            {question.answer}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ-specific call to action */}
          <CallToAction />

          <style jsx>{`
            .faq-container .accordion-button {
              font-weight: 500;
              font-size: 1.1rem;
            }
            
            .faq-container .accordion-body {
              font-size: 1rem;
              line-height: 1.6;
            }
            
            .faq-container h3 {
              color: #2c5aa0;
              border-bottom: 2px solid #e9ecef;
              padding-bottom: 0.5rem;
            }
            
            .faq-container .accordion-item {
              border: 1px solid #dee2e6;
              margin-bottom: 0.5rem;
              border-radius: 0.375rem;
            }
            
            .faq-container .accordion-button:not(.collapsed) {
              background-color: #f8f9fa;
              color: #2c5aa0;
            }
            
            .faq-container .accordion-button:focus {
              box-shadow: 0 0 0 0.25rem rgba(44, 90, 160, 0.25);
            }
          `}</style>
        </div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: pageContent.content || `<p>${t('content_coming_soon', { defaultValue: 'Content coming soon...' })}</p>` }} />
      )}
    </PageLayout>
  )
}
