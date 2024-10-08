import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import Link from 'next/link'
import HamburgerMenu from "./HamburgerMenu"

const Header = () => {
    const menuItems = [
        { href: "/", label: "Top" },
        { href: "/about", label: "About" },
        { href: "/blog", label: "Blog" },
        { href: "/contact", label: "Contact" },
    ]

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
                        {menuItems.map((item) => (
                            <li key={item.href}>
                                <Link href={item.href} className="hover:underline">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
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
                <HamburgerMenu menuItems={menuItems} />
            </div>
        </header>
    )
}

export default Header