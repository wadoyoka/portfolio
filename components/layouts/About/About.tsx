import Image from 'next/image'
import Link from 'next/link'
import { FaGithub, FaTwitter } from "react-icons/fa"

const authorName = process.env.NEXT_PUBLIC_AUTHOR_NAME || 'Author Name'

export default function About() {
    return (
        <section className="py-12 bg-blue-100">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* <h2 className="text-4xl font-bold mb-8 text-center">About</h2> */}
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-48 h-48 relative">
                        <Image
                            src="/logo.png"
                            alt={authorName}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-full"
                        />
                    </div>
                    <div className="flex-1">
                        <p className="text-lg mb-4">
                            こんにちは、{authorName}です。当サイトでは、私の作った作品などを掲載しております。是非見ていってください。
                        </p>
                        <div className="flex space-x-4">
                            <Link href="https://github.com/wadoyoka" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                <FaGithub size={24} />
                            </Link>
                            <a href="https://x.com/wadoyoka" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                <FaTwitter size={24} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}