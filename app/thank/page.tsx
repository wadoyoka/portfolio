import Link from 'next/link'

export default function ThankYou() {
    return (
        <div className="container mx-auto px-4 py-8 min-h-[80vh] flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-6">Thank You!</h1>
            <p className="text-xl mb-8">Your message has been sent successfully. We`&apos;`ll get back to you soon.</p>
            <Link href="/" className="text-blue-600 hover:underline">
                Return to Home
            </Link>
        </div>
    )
}