import FooterCreator from '@/components/layouts/Footer/FooterCreater';
import HeaderCreator from '@/components/layouts/Header/HeaderCreater';
import { Toaster } from '@/components/ui/toaster';
import BreadcrumbJsonLd from '@/utils/BreadcrumbJsonLd';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Atsushi Portfolio',
    template: '%s | Atsushi Portofolio',
  },
  description: 'ここはEnomoto Atsushiのポートフォリオサイトです。私が過去に作った制作物や、ブログを掲載しています。是非見ていってください!',
  openGraph: {
    title: {
      default: 'Atsushi Portfolio',
      template: '%s | Atsushi Portofolio',
    },
    description: 'ここはEnomoto Atsushiのポートフォリオサイトです。私が過去に作った制作物や、ブログを掲載しています。是非見ていってください!',
    url: `${process.env.NEXT_PUBLIC_SITE_URL as string}`,//後で確認
    siteName: 'Atsushi Portfolio',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL as string}/og-image.webp`,
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
    icon: [
      { url: 'favicons/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: 'favicons/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: 'favicons/favicon.ico',
    apple: [
      { url: 'favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: 'favicons/site.webmanifest',
  appleWebApp: {
    title: 'Atsushi',
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