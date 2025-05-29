import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@/styles/main.scss";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ContentProvider } from "@/contexts/ContentContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { ChurchUserProvider } from "@/contexts/ChurchUserContext";
import { I18nProvider } from "@/contexts/I18nContext";

const inter = Inter({ subsets: ["latin"] });

// Default metadata for the entire site
export const metadata: Metadata = {
  title: {
    template: '%s | Church of God of Prophecy',
    default: 'Church of God of Prophecy - A Global Ministry of Reconciliation',
  },
  description: 'The Church of God of Prophecy is a global ministry of reconciliation with a heart for missions, serving in 135 countries worldwide. Join us in our mission to reconcile the world to Christ through the Power of the Holy Spirit.',
  keywords: [
    'church', 
    'prophecy', 
    'christian', 
    'global ministry', 
    'missions', 
    'faith', 
    'bible', 
    'jesus christ',
    'holy spirit',
    'evangelism',
    'discipleship',
    'church of god'
  ],
  authors: [{ name: 'Church of God of Prophecy' }],
  creator: 'Church of God of Prophecy',
  publisher: 'Church of God of Prophecy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cogop.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Church of God of Prophecy',
    title: 'Church of God of Prophecy - A Global Ministry of Reconciliation',
    description: 'A global ministry of reconciliation with a heart for missions, serving in 135 countries worldwide. Join us in our mission to reconcile the world to Christ through the Power of the Holy Spirit.',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Church of God of Prophecy - Global Ministry',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Church of God of Prophecy - A Global Ministry of Reconciliation',
    description: 'A global ministry of reconciliation with a heart for missions, serving in 135 countries worldwide.',
    images: ['/images/og-default.jpg'],
    creator: '@cogophq',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
  },
  category: 'religion',
}

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <I18nProvider>
          <ContentProvider>
            <AuthProvider>
              <AdminProvider>
                <ChurchUserProvider>
                  <Navigation />
                  <main className="-mt-5 -pt-4">
                    {children}
                  </main>
                  <Footer />
                </ChurchUserProvider>
              </AdminProvider>
            </AuthProvider>
          </ContentProvider>
        </I18nProvider>
        {/* Bootstrap JavaScript */}
        <script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
          crossOrigin="anonymous"
          async
        ></script>
      </body>
    </html>
  );
}
