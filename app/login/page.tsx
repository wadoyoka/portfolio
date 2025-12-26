import { Metadata } from "next";
import LoginForm from "./loginForm";

const authorName = process.env.NEXT_PUBLIC_AUTHOR_NAME || 'Author Name'

export const metadata: Metadata = {
    title: 'Login',
    description: `${authorName}のポートフォリオサイトへのログインぺージです。`,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
    openGraph: {
        title: 'Login',
        description: `${authorName}のポートフォリオサイトへのログインぺージです。`,
        url: '/login',
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
        title: 'Login',
        description: `${authorName}のポートフォリオサイトへのログインぺージです。`,
        images: [{
            url: '/ogp/og-image.webp',
            width: 1200,
            height: 630,
        },],
        creator: '@wadoyoka',
    },
}

export default function ContactPage() {
    return <LoginForm />
}