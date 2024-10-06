'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

interface MenuItem {
    href: string;
    label: string;
}

interface HamburgerMenuProps {
    menuItems: MenuItem[];
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ menuItems }) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => setIsOpen(!isOpen)

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white"
                onClick={toggleMenu}
                aria-label={isOpen ? "Close menu" : "Open menu"}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>

            <div
                className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } w-64 bg-blue-600 overflow-auto ease-in-out transition-all duration-300 z-30 md:hidden`}
            >
                <div className="p-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white"
                        onClick={toggleMenu}
                        aria-label="Close menu"
                    >
                        <X size={24} />
                    </Button>
                    <nav className="mt-8">
                        <ul className="space-y-4">
                            {menuItems.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="block py-2 hover:underline text-white"
                                        onClick={toggleMenu}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="mt-8">
                        <Input
                            type="search"
                            placeholder="検索..."
                            className="w-full bg-white text-black mb-2"
                        />
                        <Button variant="secondary" size="sm" className="w-full bg-white text-blue-600 hover:bg-blue-100">
                            検索
                        </Button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={toggleMenu}
                ></div>
            )}
        </>
    )
}

export default HamburgerMenu