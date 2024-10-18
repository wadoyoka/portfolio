import { Metadata } from "next";
import LoginForm from "./loginForm";


export const metadata: Metadata = {
    title: 'Login',
    description: 'Enomoto Atsushiのポートフォリオサイトへのログインぺージです。',
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
    openGraph: {
        title: 'Login',
        description: 'Enomoto Atsushiのポートフォリオサイトへのログインぺージです。',
        url: '/login',
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
        title: 'Login',
        description: 'Enomoto Atsushiのポートフォリオサイトへのログインぺージです。',
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