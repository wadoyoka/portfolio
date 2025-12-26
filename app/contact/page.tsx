import { Metadata } from "next"
import ContactForm from "./ContactForm"

const authorName = process.env.NEXT_PUBLIC_AUTHOR_NAME || 'Author Name'

export const metadata: Metadata = {
    title: 'Contact',
    description: `${authorName}のメール送信用ページです。`,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
    openGraph: {
        title: 'Contact',
        description: `${authorName}のメール送信用ページです。`,
        url: '/contact',
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
        title: 'Contact',
        description: `${authorName}のメール送信用ページです。`,
        images: [{
            url: '/ogp/og-image.webp',
            width: 1200,
            height: 630,
        },],
        creator: '@wadoyoka',
    },
}

export default function ContactPage() {
    return <ContactForm />
}