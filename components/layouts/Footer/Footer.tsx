import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-blue-600 text-white py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <Image
                            src="/logo.png"
                            alt="Enomoto Atsushi Logo"
                            width={40}
                            height={40}
                            className="mr-2"
                        />
                        <span className="text-xl font-bold">Enomoto Atsushi</span>
                    </div>
                    <nav>
                        <ul className="flex space-x-6">
                            <li><Link href="/" className="hover:underline">Top</Link></li>
                            <li><Link href="/about" className="hover:underline">About</Link></li>
                            <li><Link href="/blog" className="hover:underline">Blog</Link></li>
                            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
                        </ul>
                    </nav>
                </div>
                <div className="mt-4 text-center">
                    <p>&copy; Enomoto Atsushi from 2024</p>
                </div>
            </div>
        </footer>
    )
}