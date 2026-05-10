'use client'

import PageLayout from '@/components/PageLayout'
import { useTranslation } from '@/lib/i18n'

const BOOKLET_FILENAME = 'Bulgarian We are the COGOP DIN A5 Book PRINT READY.pdf'
const bookletPdfUrl = `/${encodeURIComponent(BOOKLET_FILENAME)}`

export default function BookletPage() {
  const { t } = useTranslation()

  return (
    <PageLayout
      title={String(t('hero_title_1', { defaultValue: 'We are the Church of God of Prophecy' }))}
      description={String(
        t('hero_desc_1', {
          defaultValue:
            'This 24-page booklet is a guide for anyone interested in understanding who we are, what we believe, and how we live out our mission together.',
        }),
      )}
      showCallToAction={false}
    >
      <div className="booklet-pdf">
        <iframe
          src={bookletPdfUrl}
          title={String(t('hero_title_1'))}
          className="w-100 border rounded shadow-sm mb-4"
          style={{ minHeight: '80vh', height: '80vh' }}
        />
        <a
          href={bookletPdfUrl}
          download={BOOKLET_FILENAME}
          className="btn btn-outline-primary btn-lg"
          target="_blank"
          rel="noopener noreferrer"
        >
          {String(t('booklet_download_pdf'))}
        </a>
      </div>
    </PageLayout>
  )
}
