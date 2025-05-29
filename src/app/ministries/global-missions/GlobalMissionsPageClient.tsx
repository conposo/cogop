'use client'

import PageLayout from '@/components/PageLayout'
import { PageContent } from '@/lib/metadata'

interface Props {
  pageContent: PageContent
}

export default function GlobalMissionsPageClient({ pageContent }: Props) {
  return (
    <PageLayout
      title={pageContent.title}
      description={pageContent.description}
      backgroundImage={pageContent.backgroundImage}
    >
      <div dangerouslySetInnerHTML={{ __html: pageContent.content || '<p>Content coming soon...</p>' }} />
    </PageLayout>
  )
} 