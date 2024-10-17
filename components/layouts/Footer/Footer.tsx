import Image from 'next/image'
import Link from 'next/link'
import { FaGithub, FaTwitter } from 'react-icons/fa'

export default function Footer() {
    return (
        <footer className="bg-blue-600 text-white py-8 mt-auto">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <Image
                            src="/logo_white.png"
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
                <div className="mt-4 flex justify-center space-x-4">
                    <Link href="https://x.com/wadoyoka" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200">
                        <FaTwitter size={24} />
                    </Link>
                    <Link href="https://github.com/wadoyoka" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200">
                        <FaGithub size={24} />
                    </Link>
                </div>
                <div className="mt-4 text-center">
                    <p>&copy; Enomoto Atsushi from 2024</p>
                </div>
            </div>
        </footer>
    )
}