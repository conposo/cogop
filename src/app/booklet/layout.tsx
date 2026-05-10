import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Booklet — We Are the COGOP',
  description:
    'A guide to who we are, what we believe, and how we live out our mission together.',
}

export default function BookletLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
