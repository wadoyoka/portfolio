'use client'

import Image from 'next/image'
import Link from 'next/link'
import HamburgerMenu from './HamburgerMenu'
import MobileSearch from './MobileSearch'

const menuItems = [
    { href: "/", label: "Top" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
]

export default function Header() {



    return (
        <header className="bg-primary text-primary-foreground">
            <div className="container mx-auto flex justify-between items-center py-4 max-w-7xl">
                <Link href="/" className="flex items-center hover:opacity-60 duration-300">
                    <Image
                        src="/logo.png"
                        alt="Enomoto Atsushi Logo"
                        width={40}
                        height={40}
                        className="ml-2 mr-2"
                    />
                    <span className="text-2xl font-bold">Enomoto Atsushi</span>
                </Link>
                <nav className="hidden md:block">
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
                <div className="flex items-center space-x-2">
                    <MobileSearch />
                    <HamburgerMenu />
                </div>
            </div>
        </header>
    )
}