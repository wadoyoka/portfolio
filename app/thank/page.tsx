import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Thank',
    description: 'Enomoto Atsushiのメール送信感謝ぺージです。',
    openGraph: {
        title: 'Thank',
        description: 'Enomoto Atsushiのメール送信感謝ぺージです。',
        url: '/thank',
        siteName: 'Atsushi Portfolio',
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
        title: 'Thank',
        description: 'Enomoto Atsushiのメール送信感謝ぺージです。',
        images: [{
            url: '/ogp/og-image.webp',
            width: 1200,
            height: 630,
        },],
        creator: '@wadoyoka',
    },
}

export default function ThankYou() {
    return (
        <div className="container mx-auto px-4 py-8 min-h-[80vh] flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-6">ありがとうございます!</h1>
            <p className="text-xl mb-8">メッセージは送信されました！</p>
            <Link href="/" className="text-blue-600 hover:underline">
                Return to Home
            </Link>
        </div>
    )
}