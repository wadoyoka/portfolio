'use client'

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { House, Mail, Menu, Newspaper, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from "next/navigation"
import { useState } from 'react'

interface MenuItem {
    href: string
    label: string
    icon: string
}

const menuItems: MenuItem[] = [
    { href: '/', label: 'Top', icon: 'House' },
    { href: '/about', label: 'About', icon: 'User' },
    { href: '/blog', label: 'Blog', icon: 'News' },
    { href: '/contact', label: 'Contact', icon: 'Mail' },
]

function selectIcon(icon: string) {
    switch (icon) {
        case 'House':
            return (
                <House />
            );
        case 'User':
            return (
                <User />
            );
        case 'News':
            return (
                <Newspaper />
            );
        case 'Mail':
            return (
                <Mail />
            );
        default:
            return null;
    }
}

export default function HamburgerMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">
                    Navigate through our site using the links below.
                </SheetDescription>
                <nav className="flex flex-col space-y-4 mt-8">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex text-lg font-medium transition-colors ${(pathname === item.href)
                                ? 'text-blue-600 hover:text-blue-700'
                                : 'text-foreground hover:text-primary'
                                }`}
                            onClick={() => setIsOpen(false)}
                        >
                            <div className="mr-2">
                                {selectIcon(item.icon)}
                            </div>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    )
}