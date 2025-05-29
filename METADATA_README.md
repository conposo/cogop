# Metadata and SEO Implementation Guide

This guide explains how to use the comprehensive metadata and SEO system implemented in your Next.js Church of God of Prophecy website.

## Overview

The metadata system provides:
- Automatic SEO optimization with proper meta tags
- Open Graph and Twitter Card support for social sharing
- Structured data (JSON-LD) for search engines
- Dynamic metadata generation for articles and pages
- Multi-language support ready

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required
NEXT_PUBLIC_SITE_URL=https://cogop.org

# Optional but recommended
GOOGLE_VERIFICATION_CODE=your-google-search-console-verification-code

# Social Media (for structured data)
NEXT_PUBLIC_FACEBOOK_URL=https://www.facebook.com/cogophq
NEXT_PUBLIC_TWITTER_HANDLE=@cogophq
NEXT_PUBLIC_YOUTUBE_URL=https://www.youtube.com/user/cogophq
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/cogophq
```

## Components of the System

### 1. Root Layout Metadata (`src/app/layout.tsx`)

Provides default metadata for the entire site including:
- Site-wide title template: `Page Title | Church of God of Prophecy`
- Default description and keywords
- Open Graph and Twitter Card defaults
- Viewport configuration
- Robots meta tags

### 2. Metadata Utilities (`src/lib/metadata.ts`)

Contains helper functions for generating metadata:

- `generatePageMetadata()` - For standard pages
- `generateArticleMetadata()` - For news articles
- `generateMinistryMetadata()` - For ministry pages
- `generateRegionalMetadata()` - For regional pages
- `generateOrganizationStructuredData()` - Church organization schema
- `generateArticleStructuredData()` - Article schema

### 3. Server-side Content (`src/lib/content.ts`)

Provides server-side content data for metadata generation without requiring client-side contexts.

## How to Add Metadata to Pages

### Method 1: Server Components with Static Metadata

For pages with static content, export a `metadata` object:

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description for SEO',
  keywords: ['keyword1', 'keyword2'],
  openGraph: {
    title: 'Page Title',
    description: 'Page description',
    url: '/page-url',
  },
}

export default function Page() {
  return <div>Your page content</div>
}
```

### Method 2: Server Components with Dynamic Metadata

For pages that need dynamic metadata based on content:

```typescript
import type { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'
import { getPageContent } from '@/lib/content'

export function generateMetadata(): Metadata {
  const pageContent = getPageContent('your/page/path')
  
  return generatePageMetadata(pageContent, {
    alternates: {
      canonical: '/your/page/path',
    },
  })
}

export default function Page() {
  // Your page content
}
```

### Method 3: Dynamic Routes with generateMetadata

For dynamic pages like articles:

```typescript
import type { Metadata } from 'next'
import { generateArticleMetadata } from '@/lib/metadata'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await fetchArticleBySlug(params.slug)
  
  if (!article) {
    return { title: 'Article Not Found' }
  }

  return generateArticleMetadata(article, params.slug, 'en')
}

export default async function ArticlePage({ params }: Props) {
  // Your page content
}
```

## Adding Structured Data

### Organization Data (Homepage)

```typescript
import { generateOrganizationStructuredData } from '@/lib/metadata'

export default function HomePage() {
  const structuredData = generateOrganizationStructuredData()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Your page content */}
    </>
  )
}
```

### Article Data

```typescript
import { generateArticleStructuredData } from '@/lib/metadata'

export default function ArticlePage({ article, slug }) {
  const structuredData = generateArticleStructuredData(article, slug, 'en')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Your article content */}
    </>
  )
}
```

## Working with Client Components

Since client components cannot export metadata, use the wrapper pattern:

### Server Component (for metadata):
```typescript
// page.tsx
import type { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'
import PageClient from './PageClient'

export function generateMetadata(): Metadata {
  // Generate metadata
}

export default function Page() {
  return <PageClient />
}
```

### Client Component (for interactivity):
```typescript
// PageClient.tsx
'use client'

export default function PageClient() {
  // Your interactive content
}
```

## SEO Features Included

### Meta Tags
- Title with template system
- Description
- Keywords
- Canonical URLs
- Robots directives

### Social Media
- Open Graph (Facebook, LinkedIn)
- Twitter Cards
- Social media images

### Search Engines
- Google verification
- Structured data (Schema.org)
- Proper heading hierarchy
- Image alt attributes

### Performance
- Viewport optimization
- Theme color support
- Preconnect hints (when needed)

## Content Management

### Adding New Pages

1. Add page content to `src/lib/content.ts`
2. Create the page component with metadata export
3. Use appropriate metadata generator function

### Updating Existing Pages

1. Update content in `src/lib/content.ts`
2. Modify metadata if needed
3. Test with social media preview tools

## Testing and Validation

### SEO Testing Tools
- Google Search Console
- Facebook Sharing Debugger
- Twitter Card Validator
- LinkedIn Post Inspector
- Schema.org Validator

### Local Testing
```bash
# Install SEO testing tools
npm install -g lighthouse
npm install -g @lhci/cli

# Run Lighthouse audit
lighthouse http://localhost:3000 --view

# Test structured data
curl -s "http://localhost:3000" | grep -o '"@type":"[^"]*"'
```

## Best Practices

1. **Keep titles under 60 characters**
2. **Keep descriptions between 150-160 characters**
3. **Use descriptive, keyword-rich URLs**
4. **Include alt text for all images**
5. **Test social media previews before publishing**
6. **Use canonical URLs to prevent duplicate content**
7. **Update structured data when content changes**

## Troubleshooting

### Common Issues

1. **Missing Open Graph images**: Ensure images are at least 1200x630px
2. **Duplicate meta tags**: Check for conflicts between layout and page metadata
3. **Invalid structured data**: Validate with Google's Rich Results Test
4. **Social media not updating**: Use Facebook Debugger to refresh cache

### Debug Commands

```bash
# Check metadata in development
curl -s http://localhost:3000/your-page | grep -i "meta\|title"

# Validate structured data
curl -s http://localhost:3000/your-page | grep -o '"@context"[^}]*}'
```

This metadata system ensures your website is optimized for search engines and social media sharing while maintaining flexibility for future content updates. 