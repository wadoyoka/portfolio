import Image from 'next/image'
import Link from 'next/link'
import { FaGithub, FaTwitter } from 'react-icons/fa'

export default function About() {
    return (
        <div className="container mx-auto px-4 py-8 min-h-[80vh] flex items-center max-w-7xl">
            <div className="w-full">
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
                    <div className="md:w-2/3 mb-8 md:mb-0 md:pr-4">
                        <h1 className="text-4xl font-bold mb-4">Enomoto Atsushi</h1>
                        <h2 className="text-2xl mb-4">東京電機大学　情報メディア学科</h2>
                        <p className="mb-4">
                            2022年に東京電機大学の情報メディア学科に入学してから、主に
                            Javaを使ってプログラミングを勉強してきました。2024年4月に
                            Node.jsを知ったことがきっかけで、Webアプリ開発に興味を持
                            つようになり、8月の終わりごろからNext.jsの勉強を始めまし
                            た。
                        </p>
                        <p className="mb-4">
                            このサイトは、v0を使いつつ、Next.jsとmicroCMSを中心に作ってみたものです。
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
                    <div className="md:w-1/3">
                        <Image
                            src="/logo.png"
                            alt="Enomoto Atsushi Logo"
                            width={300}
                            height={300}
                            className="rounded-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}