import Footer from '@/components/layouts/Footer/Footer';
import Header from '@/components/layouts/Header/Header';
import { Toaster } from '@/components/ui/toaster';
import BreadcrumbJsonLd from '@/utils/BreadcrumbJsonLd';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'My Amazing Site',
    template: '%s | My Amazing Site',
  },
  description: 'Welcome to my amazing site, full of incredible content',
  openGraph: {
    title: 'My Amazing Site',
    description: 'Welcome to my amazing site, full of incredible content',
    url: 'https://myamazingsite.com',
    siteName: 'My Amazing Site',
    images: [
      {
        url: 'https://myamazingsite.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'jp',
    type: 'website',
  },
  //↓後で確認
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
  twitter: {
    title: 'My Amazing Site',
    card: 'summary_large_image',
  },
  icons: {
    shortcut: '/favicon.ico',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="ja">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <BreadcrumbJsonLd />
        <Providers>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}