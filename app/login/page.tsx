import { Metadata } from "next";
import LoginForm from "./loginForm";


export const metadata: Metadata = {
    title: 'Login',
    description: 'Enomoto Atsushiのポートフォリオサイトへのログインぺージです。',
    openGraph: {
        title: 'Contact',
        description: 'Enomoto Atsushiのポートフォリオサイトへのログインページです。',
        url: '/login',
        siteName: 'Atsushi Portfolio',
        images: [
            {
                url: 'ogp/og-image.webp',
                width: 1200,
                height: 630,
            },
        ],
        locale: 'ja_JP',
        type: 'website',
    },
}

export default function ContactPage() {
    return <LoginForm />
}