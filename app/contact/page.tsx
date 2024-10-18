import { Metadata } from "next"
import ContactForm from "./ContactForm"

export const metadata: Metadata = {
    title: 'Contact',
    description: 'Enomoto Atsushiのブログを掲載したページです。',
    openGraph: {
        title: 'Contact',
        description: 'Enomoto Atsushiのブログを掲載したページです。',
    },
}

export default function ContactPage() {
    return <ContactForm />
}