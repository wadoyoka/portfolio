'use client'

import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import HeaderSearch from "./HeaderSearch"

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
                <div className="hidden md:block">
                    <HeaderSearch />
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                        <nav className="flex flex-col gap-4">
                            {menuItems.map((item) => (
                                <SheetClose asChild key={item.href}>
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="block px-2 py-1 text-lg"
                                    >
                                        {item.label}
                                    </Link>
                                </SheetClose>
                            ))}
                        </nav>
                        {/* <div className="mt-6">
                            <HeaderSearch />
                        </div> */}
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}