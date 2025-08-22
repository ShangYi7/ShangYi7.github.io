import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LanguageProvider } from '@/components/LanguageProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'ShangYi7 - Personal Website & Blog',
    template: '%s | ShangYi7'
  },
  description: 'ShangYi7\'s personal website and blog. Sharing thoughts on technology, programming, and life.',
  keywords: ['ShangYi7', 'blog', 'technology', 'programming', 'web development'],
  authors: [{ name: 'ShangYi7' }],
  creator: 'ShangYi7',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://shangyi7.github.io',
    siteName: 'ShangYi7',
    title: 'ShangYi7 - Personal Website & Blog',
    description: 'ShangYi7\'s personal website and blog. Sharing thoughts on technology, programming, and life.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShangYi7'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShangYi7 - Personal Website & Blog',
    description: 'ShangYi7\'s personal website and blog. Sharing thoughts on technology, programming, and life.',
    images: ['/og-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}