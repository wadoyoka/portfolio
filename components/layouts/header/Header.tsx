import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
    return (
        <header className="bg-blue-600 text-white">
            <div className="container mx-auto flex justify-between items-center py-4 max-w-7xl">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo.png"
                        alt="Enomoto Atsushi Logo"
                        width={40}
                        height={40}
                        className="ml-2 mr-2"
                    />
                    <span className="text-2xl font-bold">Enomoto Atsushi</span>
                </Link>
                <nav className="max-md:hidden">
                    <ul className="flex space-x-6">
                        <li><Link href="/work" className="hover:underline">Work</Link></li>
                        <li><Link href="/about" className="hover:underline">About</Link></li>
                        <li><Link href="/blog" className="hover:underline">Blog</Link></li>
                        <li><Link href="/contact" className="hover:underline">Contact</Link></li>
                    </ul>
                </nav>
                <div className="flex items-center space-x-2 max-md:hidden mr-1">
                    <Input
                        type="search"
                        placeholder="検索..."
                        className="w-40 lg:w-64 bg-white text-black"
                    />
                    <Button variant="secondary" size="sm" className="bg-white text-blue-600 hover:bg-blue-100">
                        検索
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default Header