import FooterCreator from '@/components/layouts/Footer/FooterCreater';
import HeaderCreator from '@/components/layouts/Headers/HeaderCreater';
import { Toaster } from '@/components/ui/toaster';
import BreadcrumbJsonLd from '@/utils/BreadcrumbJsonLd';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] })

const authorName = process.env.NEXT_PUBLIC_AUTHOR_NAME || 'Author Name'

export const metadata: Metadata = {
  title: {
    default: `${authorName} Portfolio`,
    template: `%s | ${authorName} Portfolio`,
  },
  description: `ここは${authorName}のポートフォリオサイトです。私が過去に作った制作物や、ブログを掲載しています。是非見ていってください!`,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
  openGraph: {
    title: {
      default: `${authorName} Portfolio`,
      template: `%s | ${authorName} Portfolio`,
    },
    description: `ここは${authorName}のポートフォリオサイトです。私が過去に作った制作物や、ブログを掲載しています。是非見ていってください!`,
    url: '/',
    siteName: `${authorName} Portfolio`,
    images: [
      {
        url: '/ogp/og-image.webp',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: `${authorName} Portfolio`,
      template: `%s | ${authorName} Portfolio`,
    },
    description: `ここは${authorName}のポートフォリオサイトです。私が過去に作った制作物や、ブログを掲載しています。是非見ていってください!`,
    images: [{
      url: '/ogp/og-image.webp',
      width: 1200,
      height: 630,
    },],
    creator: '@wadoyoka',
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
  icons: {
    icon: [
      { url: '/favicons/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicons/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicons/favicon.ico',
    apple: [
      { url: '/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/favicons/site.webmanifest',
  applicationName: `${authorName} Portfolio`,
  keywords: ['portfolio', 'web development', authorName, 'projects', 'blog'],
  authors: [{ name: authorName }],
  creator: authorName,
  publisher: authorName,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="ja"  className="light">
      <body className={`${inter.className} flex flex-col min-h-screen bg-white text-black`}>
        <BreadcrumbJsonLd />
        <Providers>
          <HeaderCreator />
          <main className="flex-grow">
            {children}
          </main>
          <FooterCreator />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}