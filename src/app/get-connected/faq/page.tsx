'use client'

import { useContent, getPageContent } from '@/contexts/ContentContext'
import PageLayout from '@/components/PageLayout'
import { t } from '@/lib/i18n'
import Link from 'next/link'

export default function FAQPage() {
  const pageContent = getPageContent('get-connected/faq')

  const getButtonClass = (variant: 'primary' | 'outline' | 'dark') => {
    switch (variant) {
      case 'dark':
        return 'btn btn-dark'
      case 'outline':
        return 'btn btn-outline-primary'
      default:
        return 'btn btn-primary'
    }
  }

  return (
    <PageLayout
      title={pageContent.title}
      description={pageContent.description}
      backgroundImage={pageContent.backgroundImage}
    >
      {pageContent.faq ? (
        <div className="faq-container">
          <div className="row">
            <div className="col-12">
              <p className="lead">
                {pageContent.faq.introduction}{' '}
                <Link href="/get-connected/contact">contact us</Link> directly.
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
                            className={`accordion-button ${question.isExpanded ? '' : 'collapsed'}`}
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

          <div className="row mt-5">
            <div className="col-12">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h4 className="card-title">{pageContent.faq.callToAction.title}</h4>
                  <p className="card-text">{pageContent.faq.callToAction.description}</p>
                  <div className="row">
                    {pageContent.faq.callToAction.buttons.map((button, index) => (
                      <div key={index} className="col-md-4 mb-2">
                        <Link href={button.link} className={`${getButtonClass(button.variant)} w-100`}>
                          {button.text}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

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
